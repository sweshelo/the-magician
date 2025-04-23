import { ReactNode } from 'react';
import { SoundManagerV2Provider } from '../soundV2';
import { CardsDialogProvider } from '../cards-dialog';
import { CardEffectDialogProvider } from '../card-effect-dialog';
import { CardUsageEffectProvider } from '../card-usage-effect';
import { InterceptUsageProvider } from '../intercept-usage';
import { TimerProvider } from '@/feature/Timer/context';
import { UnitSelectionProvider } from '../unit-selection';

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
                <UnitSelectionProvider>{children}</UnitSelectionProvider>
              </TimerProvider>
            </InterceptUsageProvider>
          </CardUsageEffectProvider>
        </CardEffectDialogProvider>
      </CardsDialogProvider>
    </SoundManagerV2Provider>
  );
};
