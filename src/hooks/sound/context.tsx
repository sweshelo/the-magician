'use client';

import React, { createContext, useCallback, useContext, useMemo, useRef } from "react";
import useSound from "use-sound";

// Define valid sound keys for better type safety
export type SoundKey =
  | 'agent-interrupt' | 'bind' | 'block' | 'bounce'
  | 'clock-up-field' | 'clock-up' | 'copied' | 'copying'
  | 'cp-consume' | 'cp-increase' | 'damage' | 'deactive'
  | 'deleted' | 'draw' | 'drive' | 'effect'
  | 'evolve' | 'fortitude' | 'grow' | 'guard'
  | 'leave' | 'open' | 'oracle' | 'overheat'
  | 'penetrate' | 'purple-consume' | 'purple-increase' | 'reboot'
  | 'recover' | 'bang' | 'silent' | 'speedmove'
  | 'trash' | 'trigger' | 'unblockable' | 'withdrawal';

interface SoundManagerContextType {
  playSound: (soundId: SoundKey | string) => void;
  stopSound: (soundId: SoundKey | string) => void;
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
  const [agentInterruptPlay, agentInterruptControls] = useSound('/sound/se/agent-interrupt.ogg', { volume: 0.25 });
  const [bindPlay, bindControls] = useSound('/sound/se/bind.ogg', { volume: 0.25 });
  const [blockPlay, blockControls] = useSound('/sound/se/block.ogg', { volume: 0.25 });
  const [bouncePlay, bounceControls] = useSound('/sound/se/bounce.ogg', { volume: 0.25 });
  const [clockUpFieldPlay, clockUpFieldControls] = useSound('/sound/se/clock-up-field.ogg', { volume: 0.25 });
  const [clockUpPlay, clockUpControls] = useSound('/sound/se/clock-up.ogg', { volume: 0.25 });
  const [copiedPlay, copiedControls] = useSound('/sound/se/copied.ogg', { volume: 0.25 });
  const [copyingPlay, copyingControls] = useSound('/sound/se/copying.ogg', { volume: 0.25 });
  const [cpConsumePlay, cpConsumeControls] = useSound('/sound/se/cp-consume.ogg', { volume: 0.25 });
  const [cpIncreasePlay, cpIncreaseControls] = useSound('/sound/se/cp-increase.ogg', { volume: 0.25 });
  const [damagePlay, damageControls] = useSound('/sound/se/damage.ogg', { volume: 0.25 });
  const [deactivePlay, deactiveControls] = useSound('/sound/se/deactive.ogg', { volume: 0.25 });
  const [deletedPlay, deletedControls] = useSound('/sound/se/deleted.ogg', { volume: 0.25 });
  const [drawPlay, drawControls] = useSound('/sound/se/draw.ogg', { volume: 0.25 });
  const [drivePlay, driveControls] = useSound('/sound/se/drive.ogg', { volume: 0.25 });
  const [effectPlay, effectControls] = useSound('/sound/se/effect.ogg', { volume: 0.25 });
  const [evolvePlay, evolveControls] = useSound('/sound/se/evolve.ogg', { volume: 0.25 });
  const [fortitudePlay, fortitudeControls] = useSound('/sound/se/fortitude.ogg', { volume: 0.25 });
  const [growPlay, growControls] = useSound('/sound/se/grow.ogg', { volume: 0.25 });
  const [guardPlay, guardControls] = useSound('/sound/se/guard.ogg', { volume: 0.25 });
  const [leavePlay, leaveControls] = useSound('/sound/se/leave.ogg', { volume: 0.25 });
  const [openPlay, openControls] = useSound('/sound/se/open-trash.ogg', { volume: 0.25 });
  const [oraclePlay, oracleControls] = useSound('/sound/se/oracle.ogg', { volume: 0.25 });
  const [overheatPlay, overheatControls] = useSound('/sound/se/overheat.ogg', { volume: 0.25 });
  const [penetratePlay, penetrateControls] = useSound('/sound/se/penetrate.ogg', { volume: 0.25 });
  const [purpleConsumePlay, purpleConsumeControls] = useSound('/sound/se/purple-consume.ogg', { volume: 0.25 });
  const [purpleIncreasePlay, purpleIncreaseControls] = useSound('/sound/se/purple-increase.ogg', { volume: 0.25 });
  const [rebootPlay, rebootControls] = useSound('/sound/se/reboot.ogg', { volume: 0.25 });
  const [recoverPlay, recoverControls] = useSound('/sound/se/recover.ogg', { volume: 0.25 });
  const [bangPlay, bangControls] = useSound('/sound/se/bang.ogg', { volume: 0.25 });
  const [silentPlay, silentControls] = useSound('/sound/se/silent.ogg', { volume: 0.25 });
  const [speedmovePlay, speedmoveControls] = useSound('/sound/se/speedmove.ogg', { volume: 0.25 });
  const [trashPlay, trashControls] = useSound('/sound/se/trash.ogg', { volume: 0.25 });
  const [triggerPlay, triggerControls] = useSound('/sound/se/trigger.ogg', { volume: 0.25 });
  const [unblockablePlay, unblockableControls] = useSound('/sound/se/unblockable.ogg', { volume: 0.25 });
  const [withdrawalPlay, withdrawalControls] = useSound('/sound/se/withdrawal.ogg', { volume: 0.25 });

  // Create AudioContext for BGM
  const audioCtx = useMemo(() => {
    if (typeof window !== 'undefined' && window.AudioContext) return new AudioContext();
    return null;
  }, []);

  // Map sound IDs to their play and control functions
  const soundMap = useMemo(() => ({
    'agent-interrupt': { play: agentInterruptPlay, controls: agentInterruptControls },
    'bind': { play: bindPlay, controls: bindControls },
    'block': { play: blockPlay, controls: blockControls },
    'bounce': { play: bouncePlay, controls: bounceControls },
    'clock-up-field': { play: clockUpFieldPlay, controls: clockUpFieldControls },
    'clock-up': { play: clockUpPlay, controls: clockUpControls },
    'copied': { play: copiedPlay, controls: copiedControls },
    'copying': { play: copyingPlay, controls: copyingControls },
    'cp-consume': { play: cpConsumePlay, controls: cpConsumeControls },
    'cp-increase': { play: cpIncreasePlay, controls: cpIncreaseControls },
    'damage': { play: damagePlay, controls: damageControls },
    'deactive': { play: deactivePlay, controls: deactiveControls },
    'deleted': { play: deletedPlay, controls: deletedControls },
    'draw': { play: drawPlay, controls: drawControls },
    'drive': { play: drivePlay, controls: driveControls },
    'effect': { play: effectPlay, controls: effectControls },
    'evolve': { play: evolvePlay, controls: evolveControls },
    'fortitude': { play: fortitudePlay, controls: fortitudeControls },
    'grow': { play: growPlay, controls: growControls },
    'guard': { play: guardPlay, controls: guardControls },
    'leave': { play: leavePlay, controls: leaveControls },
    'open': { play: openPlay, controls: openControls },
    'oracle': { play: oraclePlay, controls: oracleControls },
    'overheat': { play: overheatPlay, controls: overheatControls },
    'penetrate': { play: penetratePlay, controls: penetrateControls },
    'purple-consume': { play: purpleConsumePlay, controls: purpleConsumeControls },
    'purple-increase': { play: purpleIncreasePlay, controls: purpleIncreaseControls },
    'reboot': { play: rebootPlay, controls: rebootControls },
    'recover': { play: recoverPlay, controls: recoverControls },
    'bang': { play: bangPlay, controls: bangControls },
    'silent': { play: silentPlay, controls: silentControls },
    'speedmove': { play: speedmovePlay, controls: speedmoveControls },
    'trash': { play: trashPlay, controls: trashControls },
    'trigger': { play: triggerPlay, controls: triggerControls },
    'unblockable': { play: unblockablePlay, controls: unblockableControls },
    'withdrawal': { play: withdrawalPlay, controls: withdrawalControls }
  }), [
    agentInterruptPlay, agentInterruptControls,
    bindPlay, bindControls,
    blockPlay, blockControls,
    bouncePlay, bounceControls,
    clockUpFieldPlay, clockUpFieldControls,
    clockUpPlay, clockUpControls,
    copiedPlay, copiedControls,
    copyingPlay, copyingControls,
    cpConsumePlay, cpConsumeControls,
    cpIncreasePlay, cpIncreaseControls,
    damagePlay, damageControls,
    deactivePlay, deactiveControls,
    deletedPlay, deletedControls,
    drawPlay, drawControls,
    drivePlay, driveControls,
    effectPlay, effectControls,
    evolvePlay, evolveControls,
    fortitudePlay, fortitudeControls,
    growPlay, growControls,
    guardPlay, guardControls,
    leavePlay, leaveControls,
    openPlay, openControls,
    oraclePlay, oracleControls,
    overheatPlay, overheatControls,
    penetratePlay, penetrateControls,
    purpleConsumePlay, purpleConsumeControls,
    purpleIncreasePlay, purpleIncreaseControls,
    rebootPlay, rebootControls,
    recoverPlay, recoverControls,
    bangPlay, bangControls,
    silentPlay, silentControls,
    speedmovePlay, speedmoveControls,
    trashPlay, trashControls,
    triggerPlay, triggerControls,
    unblockablePlay, unblockableControls,
    withdrawalPlay, withdrawalControls
  ]);

  // Function to play a sound
  const playSound = useCallback((soundId: SoundKey | string) => {
    const sound = soundMap[soundId as keyof typeof soundMap];
    console.log('sound: %s', sound)
    if (!sound) return;

    // Stop any previously playing instance of this sound
    if (activeSounds.current[soundId]) {
      activeSounds.current[soundId]();
    }

    // Play the sound and save its stop function
    sound.play();
    console.log('%s played!', soundId)
    activeSounds.current[soundId] = sound.controls.stop;
  }, [soundMap]);

  // Function to explicitly stop a sound
  const stopSound = useCallback((soundId: SoundKey | string) => {
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
