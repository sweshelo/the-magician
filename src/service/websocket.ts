import {
  Message,
  RequestPayload,
  ResponsePayload,
  ErrorPayload,
  PlayerDisconnectedPayload,
  PlayerReconnectedPayload,
} from '@/submodule/suit/types';
import { ErrorCode } from '@/submodule/suit/constant/error';
import EventEmitter from 'events';

// Type guards
function isMessage(value: unknown): value is Message {
  if (!value || typeof value !== 'object') return false;
  return (
    'action' in value &&
    typeof value.action === 'object' &&
    value.action !== null &&
    'payload' in value &&
    typeof value.payload === 'object' &&
    value.payload !== null
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function isErrorPayload(payload: unknown): payload is ErrorPayload {
  if (!payload || typeof payload !== 'object') return false;
  return (
    'type' in payload &&
    payload.type === 'Error' &&
    'errorCode' in payload &&
    typeof payload.errorCode === 'string' &&
    'message' in payload &&
    typeof payload.message === 'string'
  );
}

class WebSocketService extends EventEmitter {
  private readonly socket: WebSocket;
  private errorHandler?: (message: string, title?: string, onConfirm?: () => void) => void;
  private warningHandler?: (message: string, title?: string, onConfirm?: () => void) => void;
  private disconnectHandler?: (isWaitingReconnect: boolean) => void;

  constructor(url: string) {
    super();
    this.socket = new WebSocket(url);

    this.socket.addEventListener('open', () => {
      this.emit('open');
    });

    this.socket.addEventListener('close', () => {
      this.emit('close');
      throw Error('WebSocket Connection Closed.');
    });

    this.socket.addEventListener('message', (event: MessageEvent<string>) => {
      const message = JSON.parse(event.data);
      console.log(message);

      // エラー通知の処理
      if (message.action?.type === 'error') {
        this.handleError(message.payload);
        return;
      }

      // プレイヤー切断通知の処理
      if (message.action?.type === 'disconnected') {
        this.handlePlayerDisconnected(message.payload);
        return;
      }

      // プレイヤー再接続通知の処理
      if (message.action?.type === 'reconnected') {
        this.handlePlayerReconnected(message.payload);
        return;
      }

      // 通常のゲームメッセージ
      this.emit('message', message);
    });
  }

  isConnected(): boolean {
    return this.socket.readyState === WebSocket.OPEN;
  }

  /**
   * エラーハンドラーを設定
   */
  setErrorHandler(
    handler: (message: string, title?: string, onConfirm?: () => void) => void
  ): void {
    this.errorHandler = handler;
  }

  /**
   * 警告ハンドラーを設定
   */
  setWarningHandler(
    handler: (message: string, title?: string, onConfirm?: () => void) => void
  ): void {
    this.warningHandler = handler;
  }

  /**
   * 切断ハンドラーを設定
   */
  setDisconnectHandler(handler: (isWaitingReconnect: boolean) => void): void {
    this.disconnectHandler = handler;
  }

  // メッセージをサーバに送る
  // 主にゲーム内で利用
  send(message: Message): void {
    this.socket.send(JSON.stringify(message));
  }

  // あるメッセージに対してサーバ側の応答を待たす
  // 主にゲーム外で利用
  async request<T extends RequestPayload>(message: Message<T>): Promise<Message<ResponsePayload>> {
    this.socket.send(JSON.stringify(message));

    return await new Promise((resolve, reject) => {
      const handler = (e: MessageEvent): void => {
        try {
          const parsed: unknown = JSON.parse(e.data);

          if (!isMessage(parsed)) {
            console.warn('Invalid message format received:', parsed);
            return;
          }

          const { payload, action } = parsed;

          // エラーレスポンスの場合
          if (action?.type === 'error') {
            this.socket.removeEventListener('message', handler);
            // parsed.payloadをunknownとして直接チェックしてナローイング
            const errorPayload: unknown = parsed.payload;
            if (
              errorPayload !== null &&
              typeof errorPayload === 'object' &&
              'message' in errorPayload &&
              typeof errorPayload.message === 'string'
            ) {
              reject(new Error(errorPayload.message || 'サーバーエラーが発生しました'));
            } else {
              reject(new Error('サーバーエラーが発生しました'));
            }
            return;
          }

          // 正常なレスポンス - ResponsePayloadはrequestIdを持つ
          if (
            payload !== null &&
            typeof payload === 'object' &&
            'requestId' in payload &&
            typeof payload.requestId === 'string' &&
            'result' in payload &&
            typeof payload.result === 'boolean'
          ) {
            this.socket.removeEventListener('message', handler);
            resolve({
              action: parsed.action,
              payload: {
                type: payload.type,
                requestId: payload.requestId,
                result: payload.result,
              },
            });
          }
        } catch (e) {
          this.socket.removeEventListener('message', handler);
          reject(e);
        }
      };

      this.socket.addEventListener('message', handler);
    });
  }

  /**
   * エラー通知を処理
   */
  private handleError(payload: ErrorPayload): void {
    const userMessage = this.getJapaneseErrorMessage(payload.errorCode);
    console.error(`[${payload.errorCode}] ${payload.message}`, payload.details);

    if (this.errorHandler) {
      this.errorHandler(userMessage);
    } else {
      // フォールバック: ハンドラーが設定されていない場合はalertを使用
      alert(userMessage);
    }
  }

  /**
   * プレイヤー切断通知を処理
   */
  private handlePlayerDisconnected(payload: PlayerDisconnectedPayload): void {
    console.warn('Player disconnected:', payload);

    if (payload.roomWillClose) {
      // ルームが閉じられる場合はエラーオーバーレイを表示
      const message = '対戦相手が切断しました。\nルームが閉じられます。';
      const onConfirm = () => {
        setTimeout(() => {
          window.location.href = '/entrance';
        }, 500);
      };

      if (this.warningHandler) {
        this.warningHandler(message, '接続が切断されました', onConfirm);
      } else {
        // フォールバック
        alert(message);
        setTimeout(() => {
          window.location.href = '/entrance';
        }, 2000);
      }
    } else {
      // 復帰待ちの場合はLoadingOverlayを表示
      if (this.disconnectHandler) {
        this.disconnectHandler(true);
      } else {
        // フォールバック
        alert('対戦相手が切断しました。復帰を待機しています...');
      }
    }
  }

  /**
   * プレイヤー再接続通知を処理
   */
  private handlePlayerReconnected(payload: PlayerReconnectedPayload): void {
    console.log('Player reconnected:', payload);

    // LoadingOverlayを閉じる
    if (this.disconnectHandler) {
      this.disconnectHandler(false);
    }
  }

  /**
   * エラーコードから日本語メッセージへのマッピング
   */
  private getJapaneseErrorMessage(errorCode: ErrorCode): string {
    const messages: Record<string, string> = {
      [ErrorCode.CONN_DISCONNECTED]: '接続が切断されました',
      [ErrorCode.CONN_TIMEOUT]: '接続がタイムアウトしました',
      [ErrorCode.CONN_INVALID_MESSAGE]: '無効なメッセージを受信しました',
      [ErrorCode.ROOM_NOT_FOUND]: 'ルームが見つかりません',
      [ErrorCode.ROOM_FULL]: 'ルームが満員です',
      [ErrorCode.ROOM_CLOSED]: 'ルームが閉じられました',
      [ErrorCode.GAME_INVALID_MOVE]: '無効な手です',
      [ErrorCode.GAME_NOT_YOUR_TURN]: 'あなたのターンではありません',
      [ErrorCode.GAME_INVALID_STATE]: 'ゲーム状態が無効です',
      [ErrorCode.VALID_INVALID_PAYLOAD]: '無効なデータです',
      [ErrorCode.VALID_MISSING_FIELD]: '必須項目が不足しています',
      [ErrorCode.SYS_INTERNAL_ERROR]: 'サーバーエラーが発生しました',
      [ErrorCode.SYS_UNKNOWN_ERROR]: 'エラーが発生しました',
      [ErrorCode.MATCHING_ALREADY_QUEUED]: '既にマッチングキューに参加しています',
      [ErrorCode.MATCHING_QUEUE_NOT_FOUND]: 'マッチングキューが見つかりません',
      [ErrorCode.MATCHING_TIMEOUT]: 'マッチングがタイムアウトしました',
      [ErrorCode.MATCHING_CANCELLED]: 'マッチングがキャンセルされました',
      [ErrorCode.MATCHING_INVALID_CRITERIA]: 'マッチング条件が無効です',
    };
    return messages[errorCode] || 'エラーが発生しました';
  }
}

export const webSocketService = new WebSocketService(
  `${process.env.NEXT_PUBLIC_SECURE_CONNECTION === 'true' ? 'wss://' : 'ws://'}${process.env.NEXT_PUBLIC_SERVER_HOST}`
);
