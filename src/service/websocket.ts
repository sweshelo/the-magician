import { Message, RequestPayload, ResponsePayload } from '@/submodule/suit/types';
import EventEmitter from 'events';

class WebSocketService extends EventEmitter {
  private readonly socket: WebSocket;

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
      console.log(JSON.parse(event.data));
      this.emit('message', JSON.parse(event.data));
    });
  }

  isConnected(): boolean {
    return this.socket.readyState === WebSocket.OPEN;
  }

  // メッセージをサーバに送る
  // 主にゲーム内で利用
  send(message: Message): void {
    this.socket.send(JSON.stringify(message));
  }

  // あるメッセージに対してサーバ側の応答を待たす
  // 主にゲーム外で利用
  async request<T extends RequestPayload, R extends ResponsePayload>(
    message: Message<T>
  ): Promise<Message<R>> {
    this.socket.send(JSON.stringify(message));

    return await new Promise((resolve, reject) => {
      const handler = (e: MessageEvent): void => {
        try {
          const response = JSON.parse(e.data) as Message<R>;
          const { payload } = response;
          if ('requestId' in payload) {
            this.socket.removeEventListener('message', handler);
            resolve(response);
          }
        } catch (e) {
          this.socket.removeEventListener('message', handler);
          reject(e);
        }
      };

      this.socket.addEventListener('message', handler);
    });
  }
}

export const webSocketService = new WebSocketService(
  `wss://${process.env.NEXT_PUBLIC_WEBSOCKET_HOST}`
);
