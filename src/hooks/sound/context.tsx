'use client';

import React, { createContext, useCallback, useContext, useMemo, useRef } from "react";
import useSound from "use-sound";

interface SoundManagerContextType {
  playSound: (soundId: string) => void;
  stopSound: (soundId: string) => void;
  playBgm: () => Promise<void>;
  stopBgm: () => void;
}

// Create the context with a default value
export const SoundManagerContext = createContext<SoundManagerContextType | undefined>(undefined);

export const SoundManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Refs to track currently playing sounds
  const activeSounds = useRef<Record<string, () => void>>({});
  const activeBgm = useRef<AudioBufferSourceNode | null>(null);

  // Sound effect hooks
  const [drawPlay, drawControls] = useSound('/sound/se/draw.ogg', { volume: 0.25 });
  const [clockUpPlay, clockUpControls] = useSound('/sound/se/clock-up.ogg', { volume: 0.25 });
  const [trashPlay, trashControls] = useSound('/sound/se/trash.ogg', { volume: 0.25 });
  const [openPlay, openControls] = useSound('/sound/se/open-trash.ogg', { volume: 0.25 });

  // Create AudioContext for BGM
  const audioCtx = useMemo(() => {
    if (typeof window !== 'undefined' && window.AudioContext) return new AudioContext();
    return null;
  }, []);

  // Map sound IDs to their play and control functions
  const soundMap = useMemo(() => ({
    'draw': { play: drawPlay, controls: drawControls },
    'clockUp': { play: clockUpPlay, controls: clockUpControls },
    'trash': { play: trashPlay, controls: trashControls },
    'open': { play: openPlay, controls: openControls },
  }), [drawPlay, drawControls, clockUpPlay, clockUpControls, trashPlay, trashControls, openPlay, openControls]);

  // Function to play a sound
  const playSound = useCallback((soundId: string) => {
    const sound = soundMap[soundId as keyof typeof soundMap];
    if (!sound) return;

    // Stop any previously playing instance of this sound
    if (activeSounds.current[soundId]) {
      activeSounds.current[soundId]();
    }

    // Play the sound and save its stop function
    sound.play();
    activeSounds.current[soundId] = sound.controls.stop;
  }, [soundMap]);

  // Function to explicitly stop a sound
  const stopSound = useCallback((soundId: string) => {
    if (activeSounds.current[soundId]) {
      activeSounds.current[soundId]();
      delete activeSounds.current[soundId];
    }
  }, []);

  // Function to play BGM
  const playBgm = useCallback(async () => {
    if (!audioCtx) return;

    try {
      // Stop any currently playing BGM
      if (activeBgm.current) {
        activeBgm.current.stop();
        activeBgm.current = null;
      }

      const buffer = await (await fetch('/sound/bgm/Quiet Madness.wav')).arrayBuffer();
      const audio = await audioCtx.decodeAudioData(buffer);
      const source = audioCtx.createBufferSource();
      source.buffer = audio;
      source.loop = true;
      source.loopStart = 0; // Loop start position (seconds)
      source.loopEnd = 124.235; // Loop end position (seconds)
      source.connect(audioCtx.destination);
      source.start();

      activeBgm.current = source;
    } catch (error) {
      console.error("Error playing BGM:", error);
    }
  }, [audioCtx]);

  // Function to stop BGM
  const stopBgm = useCallback(() => {
    if (activeBgm.current) {
      activeBgm.current.stop();
      activeBgm.current = null;
    }
  }, []);

  const value = useMemo(() => ({
    playSound,
    stopSound,
    playBgm,
    stopBgm,
  }), [playSound, stopSound, playBgm, stopBgm]);

  return (
    <SoundManagerContext.Provider value={value}>
      {children}
    </SoundManagerContext.Provider>
  );
};

// Hook to use the sound manager
export const useSoundManager = (): SoundManagerContextType => {
  const context = useContext(SoundManagerContext);
  if (context === undefined) {
    throw new Error('useSoundManager must be used within a SoundManagerProvider');
  }
  return context;
};
