import { ReactNode } from 'react';
import { SoundManagerV2Provider } from '../soundV2';
import { CardsDialogProvider } from '../cards-dialog';
import { CardEffectDialogProvider } from '../card-effect-dialog';
import { CardUsageEffectProvider } from '../card-usage-effect';
import { InterceptUsageProvider } from '../intercept-usage';
import { TimerProvider } from '@/feature/Timer/context';
import { UnitSelectionProvider } from '../unit-selection';
import { ChoicePanelProvider } from '@/feature/ChoicePanel/context';
import { MulliganProvider } from '../mulligan/context';

interface Props {
  children: ReactNode;
}

export const GameContextProvider = ({ children }: Props) => {
  return (
    <SoundManagerV2Provider>
      <CardsDialogProvider>
        <CardEffectDialogProvider>
          <CardUsageEffectProvider>
            <InterceptUsageProvider>
              <TimerProvider>
                <ChoicePanelProvider>
                  <MulliganProvider>
                    <UnitSelectionProvider>{children}</UnitSelectionProvider>
                  </MulliganProvider>
                </ChoicePanelProvider>
              </TimerProvider>
            </InterceptUsageProvider>
          </CardUsageEffectProvider>
        </CardEffectDialogProvider>
      </CardsDialogProvider>
    </SoundManagerV2Provider>
  );
};
