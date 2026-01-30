import { useAuth } from '@/hooks/auth/hooks';
import { STARTER_DECK, STARTER_JOKERS } from '@/constants/deck';
import { useDeck } from '@/hooks/deck';
import { useHandler } from '@/hooks/game/handler';
import { useWebSocket } from '@/hooks/websocket/hooks';
import { usePlayerIdentity } from '@/hooks/player-identity';
import { LocalStorageHelper } from '@/service/local-storage';
import { Message, PlayerEntryPayload } from '@/submodule/suit/types';
import { useEffect, useRef, useState } from 'react';

interface Props {
  id: string;
}
export const useGameComponentHook = ({ id }: Props) => {
  const { user } = useAuth();
  const { websocket } = useWebSocket();
  const { setSelfId } = usePlayerIdentity();
  const { mainDeck, isLoading: isDeckLoading } = useDeck();
  const [isConnected, setConnected] = useState<boolean>(websocket?.isConnected() ?? false);
  const isJoined = useRef(false);
  const { handle } = useHandler();

  // Discordログイン中はDiscord名・SupabaseユーザーIDを使用、未ログインはlocalStorageを使用
  const playerName =
    user?.user_metadata?.full_name || user?.user_metadata?.name || LocalStorageHelper.playerName();
  const playerId = user?.id || LocalStorageHelper.playerId();

  // ルーム参加処理
  useEffect(() => {
    // デッキのロードが完了するまで待機
    if (websocket && isConnected && !isJoined.current && id && !isDeckLoading) {
      isJoined.current = true;

      // Register player identity in Context for use throughout the app
      setSelfId(playerId, 'player');

      websocket?.on('message', (message: Message) => {
        handle(message);
      });
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
    handle,
    playerName,
    playerId,
    setSelfId,
    mainDeck,
    isDeckLoading,
  ]);

  useEffect(() => {
    if (websocket) {
      // Set initial state based on current connection state
      setConnected(websocket.isConnected());

      // Set up listener for future state changes
      websocket.on('open', () => setConnected(true));
      websocket.on('close', () => setConnected(false));
    }
  }, [websocket]);
};
