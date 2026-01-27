'use client';

import { useState } from 'react';
import { PlayerNameEditor } from './PlayerNameEditor';
import { DeckSelector } from './DeckSelector';
import { AuthStatus } from './AuthStatus';
import { MigrationBanner } from './MigrationBanner';
import { PlayStatus } from './PlayStatus';
import { TicketRedeem } from './TicketRedeem';

export const EntranceMenu = () => {
  const [playStatusKey, setPlayStatusKey] = useState(0);

  // チケット使用成功時にPlayStatusを更新
  const handleTicketSuccess = () => {
    setPlayStatusKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6 p-6 rounded-lg max-w-lg mx-auto shadow-md">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-black mb-4">ゲーム設定</h2>
      </div>
      <AuthStatus />
      <MigrationBanner />
      <PlayStatus key={playStatusKey} />
      <TicketRedeem onSuccess={handleTicketSuccess} />
      <PlayerNameEditor />
      <DeckSelector />
    </div>
  );
};
