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
  const { handle } = useHandler();

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

  // ルーム参加処理
  useEffect(() => {
    // デッキのロードが完了するまで待機
    if (websocket && isConnected && !isJoined.current && id && !isDeckLoading) {
      isJoined.current = true;

      // Register player identity in Context for use throughout the app
      setSelfId(playerId, 'player');

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

    // クリーンアップ: ゲーム離脱時にリスナーを削除し、状態をリセット
    return () => {
      if (websocket && isJoined.current) {
        websocket.off('message', messageHandler);
        isJoined.current = false;
        reset();
      }
    };
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
    reset,
  ]);

  useEffect(() => {
    if (websocket) {
      // Set initial state based on current connection state
      setConnected(websocket.isConnected());

      // Set up listener for future state changes
      const handleOpen = () => setConnected(true);
      const handleClose = () => setConnected(false);

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
