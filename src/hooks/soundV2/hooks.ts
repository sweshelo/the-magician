'use client';

import { useCallback } from 'react';
import { useSoundManagerV2, SoundKey } from './context';

export const useSoundV2 = () => {
  const { play, playBgm, stopBgm, isAudioReady, setBgmVolume, getBgmVolume } = useSoundManagerV2();

  // Simple play function to play a sound by key name
  // This is what users will primarily use
  const playSound = useCallback(
    (key: SoundKey | string) => {
      play(key);
    },
    [play]
  );

  // BGM control functions
  const bgm = useCallback(async () => {
    await playBgm();
    return {
      start: playBgm, // Allow explicitly starting BGM
      stop: stopBgm, // Allow stopping BGM
    };
  }, [playBgm, stopBgm]);

  // Volume control functions
  const setVolume = useCallback(
    (volume: number) => {
      setBgmVolume(volume);
    },
    [setBgmVolume]
  );

  const getVolume = useCallback(() => {
    return getBgmVolume();
  }, [getBgmVolume]);

  return {
    // Main function for playing sounds
    play: playSound,

    // BGM controls
    bgm,

    // Volume controls
    setVolume,
    getVolume,

    // Audio state
    isAudioReady,
  };
};
