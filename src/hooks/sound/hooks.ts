'use client';

import { useCallback, useMemo } from "react"
import useSound from "use-sound"

export const useSoundEffect = () => {
  const [draw] = useSound('/sound/se/draw.ogg')
  const [clockUp] = useSound('/sound/se/clock-up.ogg')
  const [trash] = useSound('/sound/se/trash.ogg')
  const [open] = useSound('/sound/se/open-trash.ogg')

  const audioCtx = useMemo(() => {
    if (typeof window !== 'undefined' && window.AudioContext) return new AudioContext()
  }, []);
  const bgm = useCallback(async () => {
    if (audioCtx) {
      const buffer = await (await fetch('/sound/bgm/Quiet Madness.wav')).arrayBuffer();
      const audio = await audioCtx.decodeAudioData(buffer);
      const source = audioCtx.createBufferSource();
      source.buffer = audio;
      source.loop = true;
      source.loopStart = 0; // ループ開始位置（秒）
      source.loopEnd = 124.235;   // ループ終了位置（秒）
      source.connect(audioCtx.destination);
      return source;
    } else {
      return
    }
  }, [audioCtx])

  return {
    draw,
    clockUp,
    trash,
    open,
    bgm,
  }
}