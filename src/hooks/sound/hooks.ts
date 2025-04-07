'use client';

import { useCallback } from "react";
import { useSoundManager, SoundKey } from "./context";

export const useSoundEffect = () => {
  const { playSound, playBgm, stopBgm } = useSoundManager();

  // Generic play function to play a sound by key name
  const play = useCallback((key: SoundKey | string) => {
    playSound(key);
  }, [playSound]);

  const agentInterrupt = useCallback(() => {
    playSound('agent-interrupt');
  }, [playSound]);

  const bind = useCallback(() => {
    playSound('bind');
  }, [playSound]);

  const block = useCallback(() => {
    playSound('block');
  }, [playSound]);

  const bounce = useCallback(() => {
    playSound('bounce');
  }, [playSound]);

  const clockUpField = useCallback(() => {
    playSound('clock-up-field');
  }, [playSound]);

  const clockUp = useCallback(() => {
    playSound('clock-up');
  }, [playSound]);

  const copied = useCallback(() => {
    playSound('copied');
  }, [playSound]);

  const copying = useCallback(() => {
    playSound('copying');
  }, [playSound]);

  const cpConsume = useCallback(() => {
    playSound('cp-consume');
  }, [playSound]);

  const cpIncrease = useCallback(() => {
    playSound('cp-increase');
  }, [playSound]);

  const damage = useCallback(() => {
    playSound('damage');
  }, [playSound]);

  const deactive = useCallback(() => {
    playSound('deactive');
  }, [playSound]);

  const deleted = useCallback(() => {
    playSound('deleted');
  }, [playSound]);

  const draw = useCallback(() => {
    playSound('draw');
  }, [playSound]);

  const drive = useCallback(() => {
    playSound('drive');
  }, [playSound]);

  const effect = useCallback(() => {
    playSound('effect');
  }, [playSound]);

  const evolve = useCallback(() => {
    playSound('evolve');
  }, [playSound]);

  const fortitude = useCallback(() => {
    playSound('fortitude');
  }, [playSound]);

  const grow = useCallback(() => {
    playSound('grow');
  }, [playSound]);

  const guard = useCallback(() => {
    playSound('guard');
  }, [playSound]);

  const leave = useCallback(() => {
    playSound('leave');
  }, [playSound]);

  const open = useCallback(() => {
    playSound('open');
  }, [playSound]);

  const oracle = useCallback(() => {
    playSound('oracle');
  }, [playSound]);

  const overheat = useCallback(() => {
    playSound('overheat');
  }, [playSound]);

  const penetrate = useCallback(() => {
    playSound('penetrate');
  }, [playSound]);

  const purpleConsume = useCallback(() => {
    playSound('purple-consume');
  }, [playSound]);

  const purpleIncrease = useCallback(() => {
    playSound('purple-increase');
  }, [playSound]);

  const reboot = useCallback(() => {
    playSound('reboot');
  }, [playSound]);

  const recover = useCallback(() => {
    playSound('recover');
  }, [playSound]);

  const selected = useCallback(() => {
    playSound('selected');
  }, [playSound]);

  const silent = useCallback(() => {
    playSound('silent');
  }, [playSound]);

  const speedmove = useCallback(() => {
    playSound('speedmove');
  }, [playSound]);

  const trash = useCallback(() => {
    playSound('trash');
  }, [playSound]);

  const trigger = useCallback(() => {
    playSound('trigger');
  }, [playSound]);

  const unblockable = useCallback(() => {
    playSound('unblockable');
  }, [playSound]);

  const withdrawal = useCallback(() => {
    playSound('withdrawal');
  }, [playSound]);

  const bgm = useCallback(async () => {
    await playBgm();
    return {
      start: () => {}, // Already started in playBgm
      stop: stopBgm
    };
  }, [playBgm, stopBgm]);

  return {
    // Generic play function
    play,
    // Individual sound effect functions
    agentInterrupt,
    bind,
    block,
    bounce,
    clockUpField,
    clockUp,
    copied,
    copying,
    cpConsume,
    cpIncrease,
    damage,
    deactive,
    deleted,
    draw,
    drive,
    effect,
    evolve,
    fortitude,
    grow,
    guard,
    leave,
    open,
    oracle,
    overheat,
    penetrate,
    purpleConsume,
    purpleIncrease,
    reboot,
    recover,
    selected,
    silent,
    speedmove,
    trash,
    trigger,
    unblockable,
    withdrawal,
    bgm,
  };
};
