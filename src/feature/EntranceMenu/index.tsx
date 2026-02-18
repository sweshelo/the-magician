import { PlayerNameEditor } from './PlayerNameEditor';
import { DeckSelector } from './DeckSelector';
import { AuthStatus } from './AuthStatus';
import { MigrationBanner } from './MigrationBanner';
import { TicketRedeem } from './TicketRedeem';
import { PlayStatus } from './PlayStatus';

export const EntranceMenu = () => {
  return (
    <div className="space-y-6 rounded-lg max-w-lg mx-auto shadow-md">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-black mb-4">ゲーム設定</h2>
      </div>
      {process.env.DISABLE_AUTH === 'true' ? (
        <>
          <PlayerNameEditor />
          <DeckSelector />
        </>
      ) : (
        <>
          <AuthStatus />
          <MigrationBanner />
          <PlayerNameEditor />
          <DeckSelector />
          <TicketRedeem />
          <PlayStatus />
        </>
      )}
    </div>
  );
};
