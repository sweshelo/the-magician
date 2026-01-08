'use client';

import { MatchingProvider } from '@/feature/Matching/context';
import { Matching } from '@/feature/Matching';

export default function Page() {
  return (
    <MatchingProvider>
      <Matching />
    </MatchingProvider>
  );
}
