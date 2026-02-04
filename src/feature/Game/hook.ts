import { useAuth } from '@/hooks/auth/hooks';
import { STARTER_DECK, STARTER_JOKERS } from '@/constants/deck';
import { useDeck } from '@/hooks/deck';
import { useGameStore } from '@/hooks/game/context';
import { useHandler } from '@/hooks/game/handler';
import { useWebSocket } from '@/hooks/websocket/hooks';
import { usePlayerIdentity } from '@/hooks/player-identity';
import { LocalStorageHelper } from '@/service/local-storage';
import { Message, PlayerEntryPayload } from '@/submodule/suit/types';
import { useCallback, useEffect, useRef, useState } from 'react';

interface Props {
  id: string;
}
export const useGameComponentHook = ({ id }: Props) => {
  const { user } = useAuth();
  const { websocket } = useWebSocket();
  const { setSelfId } = usePlayerIdentity();
  const { mainDeck, isLoading: isDeckLoading } = useDeck();
  const reset = useGameStore(state => state.reset);
  const [isConnected, setConnected] = useState<boolean>(websocket?.isConnected() ?? false);
  const isJoined = useRef(false);
  const { handle } = useHandler({ roomId: id });

  // Discordログイン中はDiscord名・SupabaseユーザーIDを使用、未ログインはlocalStorageを使用
  const playerName =
    user?.user_metadata?.full_name || user?.user_metadata?.name || LocalStorageHelper.playerName();
  const playerId = user?.id || LocalStorageHelper.playerId();

  // メッセージハンドラー（クリーンアップのために関数参照を保持）
  const messageHandler = useCallback(
    (message: Message) => {
      handle(message);
    },
    [handle]
  );

  // refを使用してクリーンアップ時に最新の値を参照
  const websocketRef = useRef(websocket);
  // 実際に登録されたハンドラの参照を保持（登録時と削除時で同じ参照を使用）
  const registeredHandlerRef = useRef<((message: Message) => void) | null>(null);

  // refを最新の値で更新
  useEffect(() => {
    websocketRef.current = websocket;
  });

  // ルーム参加処理
  useEffect(() => {
    // デッキのロードが完了するまで待機
    if (websocket && isConnected && !isJoined.current && id && !isDeckLoading) {
      isJoined.current = true;

      // Register player identity in Context for use throughout the app
      setSelfId(playerId, 'player');

      // 登録時のハンドラ参照を保持（クリーンアップで同じ参照を使用）
      registeredHandlerRef.current = messageHandler;
      websocket.on('message', messageHandler);
      websocket.send({
        action: {
          handler: 'room',
          type: 'join',
        },
        payload: {
          type: 'PlayerEntry',
          roomId: id,
          player: {
            name: playerName,
            id: playerId,
            deck: mainDeck?.cards ?? STARTER_DECK,
          },
          jokersOwned: mainDeck?.jokers ?? STARTER_JOKERS,
        },
      } satisfies Message<PlayerEntryPayload>);
    }
  }, [
    id,
    websocket,
    isConnected,
    messageHandler,
    playerName,
    playerId,
    setSelfId,
    mainDeck,
    isDeckLoading,
  ]);

  // アンマウント時のクリーンアップ（コンポーネント破棄時のみ実行）
  useEffect(() => {
    return () => {
      if (websocketRef.current && registeredHandlerRef.current) {
        websocketRef.current.off('message', registeredHandlerRef.current);
        registeredHandlerRef.current = null;
      }
      isJoined.current = false;
      reset();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (websocket) {
      // Set initial state based on current connection state
      setConnected(websocket.isConnected());

      // Set up listener for future state changes
      const handleOpen = () => setConnected(true);
      const handleClose = () => {
        setConnected(false);
        // 切断時に参加状態をリセット（再接続時に再joinできるようにする）
        isJoined.current = false;
        // 登録済みハンドラがあれば削除
        if (websocketRef.current && registeredHandlerRef.current) {
          websocketRef.current.off('message', registeredHandlerRef.current);
          registeredHandlerRef.current = null;
        }
      };

      websocket.on('open', handleOpen);
      websocket.on('close', handleClose);

      // クリーンアップ: リスナーを削除
      return () => {
        websocket.off('open', handleOpen);
        websocket.off('close', handleClose);
      };
    }
  }, [websocket]);
};
