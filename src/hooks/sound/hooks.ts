'use client';

import { useCallback } from "react";
import { useSoundManager } from "./context";

export const useSoundEffect = () => {
  const { playSound, playBgm, stopBgm } = useSoundManager();

  const draw = useCallback(() => {
    playSound('draw');
  }, [playSound]);

  const clockUp = useCallback(() => {
    playSound('clockUp');
  }, [playSound]);

  const trash = useCallback(() => {
    playSound('trash');
  }, [playSound]);

  const open = useCallback(() => {
    playSound('open');
  }, [playSound]);

  const bgm = useCallback(async () => {
    await playBgm();
    return {
      start: () => {}, // Already started in playBgm
      stop: stopBgm
    };
  }, [playBgm, stopBgm]);

  return {
    draw,
    clockUp,
    trash,
    open,
    bgm,
  };
};
