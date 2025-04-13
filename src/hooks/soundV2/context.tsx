'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import useSound from 'use-sound';

export type SoundKey =
  | 'agent-interrupt'
  | 'bind'
  | 'block'
  | 'bounce'
  | 'clock-up-field'
  | 'clock-up'
  | 'copied'
  | 'copying'
  | 'cp-consume'
  | 'cp-increase'
  | 'damage'
  | 'deactive'
  | 'deleted'
  | 'draw'
  | 'drive'
  | 'effect'
  | 'evolve'
  | 'fortitude'
  | 'grow'
  | 'guard'
  | 'leave'
  | 'open'
  | 'oracle'
  | 'overheat'
  | 'penetrate'
  | 'purple-consume'
  | 'purple-increase'
  | 'reboot'
  | 'recover'
  | 'bang'
  | 'silent'
  | 'speedmove'
  | 'trash'
  | 'trigger'
  | 'unblockable'
  | 'withdrawal'
  | 'cancel'
  | 'close'
  | 'choice'
  | 'decide'
  | 'joker-drive'
  | 'joker-grow'
  | 'select';

interface SoundManagerContextType {
  play: (soundId: string) => void;
  playBgm: () => Promise<void>;
  stopBgm: () => void;
  isAudioReady: boolean;
  setBgmVolume: (volume: number) => void;
  getBgmVolume: () => number;
  isBgmPlaying: () => boolean;
}

// Create the context with a default value
export const SoundManagerV2Context = createContext<SoundManagerContextType | undefined>(undefined);

export const SoundManagerV2Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAudioReady, setIsAudioReady] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioInitializedRef = useRef(false);
  const soundInstancesRef = useRef<Map<string, { play: () => void; stop: () => void }>>(new Map());
  const activeSoundsRef = useRef<Map<string, () => void>>(new Map());
  const activeBgmRef = useRef<AudioBufferSourceNode | null>(null);
  const bgmGainNodeRef = useRef<GainNode | null>(null);
  const bgmVolumeRef = useRef<number>(0.5); // Default volume at 50%
  const pendingSoundsRef = useRef<string[]>([]);

  // Initialize volume from localStorage if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedVolume = localStorage.getItem('bgmVolume');
      if (savedVolume) {
        const volume = parseFloat(savedVolume);
        if (!isNaN(volume) && volume >= 0 && volume <= 1) {
          bgmVolumeRef.current = volume;
        }
      }
    }
  }, []);

  // Setup the AudioContext for BGM and monitoring
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initializeAudio = () => {
      if (audioInitializedRef.current) return;

      try {
        // Create a single AudioContext for the application
        if (!audioContextRef.current && window.AudioContext) {
          audioContextRef.current = new AudioContext();
        }

        // Check if context is in suspended state (browser autoplay policy)
        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume();
        }

        setIsAudioReady(true);
        audioInitializedRef.current = true;

        // Process any pending sounds
        while (pendingSoundsRef.current.length > 0) {
          const soundId = pendingSoundsRef.current.shift();
          if (soundId) {
            playSoundById(soundId);
          }
        }
      } catch (error) {
        console.error('Error initializing audio:', error);
      }
    };

    // Try to initialize audio immediately (will work if autoplay policy allows)
    initializeAudio();

    // Set up user interaction listeners to initialize audio
    const userInteractionEvents = ['click', 'touchstart', 'keydown', 'touchend'];

    const handleUserInteraction = () => {
      initializeAudio();

      // Clean up event listeners after successful initialization
      if (audioInitializedRef.current) {
        userInteractionEvents.forEach(event => {
          window.removeEventListener(event, handleUserInteraction);
        });
      }
    };

    // Add event listeners for user interaction
    userInteractionEvents.forEach(event => {
      window.addEventListener(event, handleUserInteraction);
    });

    // Cleanup function
    return () => {
      userInteractionEvents.forEach(event => {
        window.removeEventListener(event, handleUserInteraction);
      });
    };
  }, []);

  // Initialize sound effects
  // We need to call useSound for each effect individually to comply with React's rules of hooks
  const [agentInterruptPlay, agentInterruptControls] = useSound('/sound/se/agent-interrupt.ogg', {
    volume: 0.25,
  });
  const [bindPlay, bindControls] = useSound('/sound/se/bind.ogg', { volume: 0.25 });
  const [blockPlay, blockControls] = useSound('/sound/se/block.ogg', { volume: 0.25 });
  const [bouncePlay, bounceControls] = useSound('/sound/se/bounce.ogg', { volume: 0.25 });
  const [clockUpFieldPlay, clockUpFieldControls] = useSound('/sound/se/clock-up-field.ogg', {
    volume: 0.25,
  });
  const [clockUpPlay, clockUpControls] = useSound('/sound/se/clock-up.ogg', { volume: 0.25 });
  const [copiedPlay, copiedControls] = useSound('/sound/se/copied.ogg', { volume: 0.25 });
  const [copyingPlay, copyingControls] = useSound('/sound/se/copying.ogg', { volume: 0.25 });
  const [cpConsumePlay, cpConsumeControls] = useSound('/sound/se/cp-consume.ogg', { volume: 0.25 });
  const [cpIncreasePlay, cpIncreaseControls] = useSound('/sound/se/cp-increase.ogg', {
    volume: 0.25,
  });
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
  const [purpleConsumePlay, purpleConsumeControls] = useSound('/sound/se/purple-consume.ogg', {
    volume: 0.25,
  });
  const [purpleIncreasePlay, purpleIncreaseControls] = useSound('/sound/se/purple-increase.ogg', {
    volume: 0.25,
  });
  const [rebootPlay, rebootControls] = useSound('/sound/se/reboot.ogg', { volume: 0.25 });
  const [recoverPlay, recoverControls] = useSound('/sound/se/recover.ogg', { volume: 0.25 });
  const [bangPlay, bangControls] = useSound('/sound/se/bang.ogg', { volume: 0.25 });
  const [silentPlay, silentControls] = useSound('/sound/se/silent.ogg', { volume: 0.25 });
  const [speedmovePlay, speedmoveControls] = useSound('/sound/se/speedmove.ogg', { volume: 0.25 });
  const [trashPlay, trashControls] = useSound('/sound/se/trash.ogg', { volume: 0.25 });
  const [triggerPlay, triggerControls] = useSound('/sound/se/trigger.ogg', { volume: 0.25 });
  const [unblockablePlay, unblockableControls] = useSound('/sound/se/unblockable.ogg', {
    volume: 0.25,
  });
  const [withdrawalPlay, withdrawalControls] = useSound('/sound/se/withdrawal.ogg', {
    volume: 0.25,
  });

  // Map all sound instances to their IDs
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Clear the map first
    soundInstancesRef.current.clear();

    // Add all sound instances to the map
    soundInstancesRef.current.set('agent-interrupt', {
      play: agentInterruptPlay,
      stop: agentInterruptControls.stop,
    });
    soundInstancesRef.current.set('bind', { play: bindPlay, stop: bindControls.stop });
    soundInstancesRef.current.set('block', { play: blockPlay, stop: blockControls.stop });
    soundInstancesRef.current.set('bounce', { play: bouncePlay, stop: bounceControls.stop });
    soundInstancesRef.current.set('clock-up-field', {
      play: clockUpFieldPlay,
      stop: clockUpFieldControls.stop,
    });
    soundInstancesRef.current.set('clock-up', { play: clockUpPlay, stop: clockUpControls.stop });
    soundInstancesRef.current.set('copied', { play: copiedPlay, stop: copiedControls.stop });
    soundInstancesRef.current.set('copying', { play: copyingPlay, stop: copyingControls.stop });
    soundInstancesRef.current.set('cp-consume', {
      play: cpConsumePlay,
      stop: cpConsumeControls.stop,
    });
    soundInstancesRef.current.set('cp-increase', {
      play: cpIncreasePlay,
      stop: cpIncreaseControls.stop,
    });
    soundInstancesRef.current.set('damage', { play: damagePlay, stop: damageControls.stop });
    soundInstancesRef.current.set('deactive', { play: deactivePlay, stop: deactiveControls.stop });
    soundInstancesRef.current.set('deleted', { play: deletedPlay, stop: deletedControls.stop });
    soundInstancesRef.current.set('draw', { play: drawPlay, stop: drawControls.stop });
    soundInstancesRef.current.set('drive', { play: drivePlay, stop: driveControls.stop });
    soundInstancesRef.current.set('effect', { play: effectPlay, stop: effectControls.stop });
    soundInstancesRef.current.set('evolve', { play: evolvePlay, stop: evolveControls.stop });
    soundInstancesRef.current.set('fortitude', {
      play: fortitudePlay,
      stop: fortitudeControls.stop,
    });
    soundInstancesRef.current.set('grow', { play: growPlay, stop: growControls.stop });
    soundInstancesRef.current.set('guard', { play: guardPlay, stop: guardControls.stop });
    soundInstancesRef.current.set('leave', { play: leavePlay, stop: leaveControls.stop });
    soundInstancesRef.current.set('open', { play: openPlay, stop: openControls.stop });
    soundInstancesRef.current.set('oracle', { play: oraclePlay, stop: oracleControls.stop });
    soundInstancesRef.current.set('overheat', { play: overheatPlay, stop: overheatControls.stop });
    soundInstancesRef.current.set('penetrate', {
      play: penetratePlay,
      stop: penetrateControls.stop,
    });
    soundInstancesRef.current.set('purple-consume', {
      play: purpleConsumePlay,
      stop: purpleConsumeControls.stop,
    });
    soundInstancesRef.current.set('purple-increase', {
      play: purpleIncreasePlay,
      stop: purpleIncreaseControls.stop,
    });
    soundInstancesRef.current.set('reboot', { play: rebootPlay, stop: rebootControls.stop });
    soundInstancesRef.current.set('recover', { play: recoverPlay, stop: recoverControls.stop });
    soundInstancesRef.current.set('bang', { play: bangPlay, stop: bangControls.stop });
    soundInstancesRef.current.set('silent', { play: silentPlay, stop: silentControls.stop });
    soundInstancesRef.current.set('speedmove', {
      play: speedmovePlay,
      stop: speedmoveControls.stop,
    });
    soundInstancesRef.current.set('trash', { play: trashPlay, stop: trashControls.stop });
    soundInstancesRef.current.set('trigger', { play: triggerPlay, stop: triggerControls.stop });
    soundInstancesRef.current.set('unblockable', {
      play: unblockablePlay,
      stop: unblockableControls.stop,
    });
    soundInstancesRef.current.set('withdrawal', {
      play: withdrawalPlay,
      stop: withdrawalControls.stop,
    });
  }, [
    agentInterruptPlay,
    agentInterruptControls,
    bindPlay,
    bindControls,
    blockPlay,
    blockControls,
    bouncePlay,
    bounceControls,
    clockUpFieldPlay,
    clockUpFieldControls,
    clockUpPlay,
    clockUpControls,
    copiedPlay,
    copiedControls,
    copyingPlay,
    copyingControls,
    cpConsumePlay,
    cpConsumeControls,
    cpIncreasePlay,
    cpIncreaseControls,
    damagePlay,
    damageControls,
    deactivePlay,
    deactiveControls,
    deletedPlay,
    deletedControls,
    drawPlay,
    drawControls,
    drivePlay,
    driveControls,
    effectPlay,
    effectControls,
    evolvePlay,
    evolveControls,
    fortitudePlay,
    fortitudeControls,
    growPlay,
    growControls,
    guardPlay,
    guardControls,
    leavePlay,
    leaveControls,
    openPlay,
    openControls,
    oraclePlay,
    oracleControls,
    overheatPlay,
    overheatControls,
    penetratePlay,
    penetrateControls,
    purpleConsumePlay,
    purpleConsumeControls,
    purpleIncreasePlay,
    purpleIncreaseControls,
    rebootPlay,
    rebootControls,
    recoverPlay,
    recoverControls,
    bangPlay,
    bangControls,
    silentPlay,
    silentControls,
    speedmovePlay,
    speedmoveControls,
    trashPlay,
    trashControls,
    triggerPlay,
    triggerControls,
    unblockablePlay,
    unblockableControls,
    withdrawalPlay,
    withdrawalControls,
  ]);

  // Internal function to play sound by ID
  const playSoundById = useCallback(
    (soundId: string) => {
      // Check if audio is ready
      if (!isAudioReady) {
        // Add to pending sounds queue if not ready
        pendingSoundsRef.current.push(soundId);
        return;
      }

      // Get the sound instance
      const soundInstance = soundInstancesRef.current.get(soundId);
      if (!soundInstance) {
        console.warn(`Sound not found: ${soundId}`);
        return;
      }

      // Stop the same sound if it's already playing
      if (activeSoundsRef.current.has(soundId)) {
        activeSoundsRef.current.get(soundId)?.();
        activeSoundsRef.current.delete(soundId);
      }

      // Play the sound and track it
      soundInstance.play();
      activeSoundsRef.current.set(soundId, soundInstance.stop);

      console.log(`%c Sound played: ${soundId}`, 'color: #8bc34a');
    },
    [isAudioReady]
  );

  // Public API: play sound by ID
  const play = useCallback(
    (soundId: string) => {
      playSoundById(soundId);
    },
    [playSoundById]
  );

  // Function to play BGM
  const playBgm = useCallback(async () => {
    console.log('PlayBgm called, checking audioContext...');
    if (!audioContextRef.current) {
      console.error('AudioContext not available');
      try {
        // Try creating an audio context if it doesn't exist
        audioContextRef.current = new window.AudioContext();
        console.log('Created new AudioContext');
      } catch (err) {
        console.error('Failed to create AudioContext:', err);
        return;
      }
    }

    try {
      console.log('AudioContext state:', audioContextRef.current.state);

      // Stop any currently playing BGM
      if (activeBgmRef.current) {
        console.log('Stopping currently playing BGM');
        activeBgmRef.current.stop();
        activeBgmRef.current = null;
      }

      // Make sure audio context is resumed
      if (audioContextRef.current.state === 'suspended') {
        console.log('Resuming suspended AudioContext');
        await audioContextRef.current.resume();
        console.log('AudioContext resumed successfully');
      }

      console.log('Fetching BGM file...');
      const fetchResponse = await fetch('/sound/bgm/Quiet Madness.wav');
      if (!fetchResponse.ok) {
        throw new Error(`Failed to fetch BGM: ${fetchResponse.status} ${fetchResponse.statusText}`);
      }

      const buffer = await fetchResponse.arrayBuffer();
      console.log('BGM file fetched, decoding audio...');

      const audio = await audioContextRef.current.decodeAudioData(buffer);
      console.log('Audio decoded successfully, creating source node');

      const source = audioContextRef.current.createBufferSource();
      source.buffer = audio;
      source.loop = true;
      source.loopStart = 0; // Loop start position (seconds)
      source.loopEnd = 124.235; // Loop end position (seconds)

      // Create gain node for volume control
      const gainNode = audioContextRef.current.createGain();
      gainNode.gain.value = bgmVolumeRef.current;
      console.log('Setting BGM volume to:', bgmVolumeRef.current);

      // Connect source -> gainNode -> destination
      source.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      console.log('Starting BGM playback');
      source.start();

      // Store references
      activeBgmRef.current = source;
      bgmGainNodeRef.current = gainNode;
      console.log('BGM playback started successfully');
    } catch (error) {
      console.error('Error playing BGM:', error);
      throw error; // Re-throw so callers can handle it
    }
  }, []);

  // Function to stop BGM
  const stopBgm = useCallback(() => {
    if (activeBgmRef.current) {
      activeBgmRef.current.stop();
      activeBgmRef.current = null;
    }

    // Properly disconnect and clean up the gain node
    if (bgmGainNodeRef.current) {
      bgmGainNodeRef.current.disconnect();
      bgmGainNodeRef.current = null;
    }

    console.log('BGM stopped and cleaned up');
  }, []);

  // Function to check if BGM is currently playing
  const isBgmPlaying = useCallback(() => {
    return activeBgmRef.current !== null;
  }, []);

  // Function to set BGM volume
  const setBgmVolume = useCallback((volume: number) => {
    // Ensure volume is between 0 and 1
    const clampedVolume = Math.max(0, Math.min(1, volume));

    // Update volume ref
    bgmVolumeRef.current = clampedVolume;

    // Apply to current BGM if playing
    if (bgmGainNodeRef.current) {
      bgmGainNodeRef.current.gain.value = clampedVolume;
    }

    // Save to localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('bgmVolume', clampedVolume.toString());
    }
  }, []);

  // Function to get current BGM volume
  const getBgmVolume = useCallback(() => {
    return bgmVolumeRef.current;
  }, []);

  const value = useMemo(
    () => ({
      play,
      playBgm,
      stopBgm,
      isAudioReady,
      setBgmVolume,
      getBgmVolume,
      isBgmPlaying,
    }),
    [play, playBgm, stopBgm, isAudioReady, setBgmVolume, getBgmVolume, isBgmPlaying]
  );

  return <SoundManagerV2Context.Provider value={value}>{children}</SoundManagerV2Context.Provider>;
};

// Hook to use the sound manager
export const useSoundManagerV2 = (): SoundManagerContextType => {
  const context = useContext(SoundManagerV2Context);
  if (context === undefined) {
    throw new Error('useSoundManagerV2 must be used within a SoundManagerV2Provider');
  }
  return context;
};
