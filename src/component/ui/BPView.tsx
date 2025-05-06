import { useEffect, useState } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';

interface BPViewProps {
  bp: number;
  lv: number;
  diff: number;
}

export const BPView = ({ bp, lv, diff }: BPViewProps) => {
  const motionBp = useMotionValue(bp + diff);
  const [displayBp, setDisplayBp] = useState(bp + diff);

  useEffect(() => {
    const controls = animate(motionBp, bp + diff, { duration: 0.2 });
    return controls.stop;
  }, [bp, diff, motionBp]);

  useEffect(() => {
    const unsubscribe = motionBp.on('change', v => setDisplayBp(v));
    return unsubscribe;
  }, [motionBp]);

  const blue = diff > 0 ? 'text-cyan-300' : undefined;
  const red = diff < 0 ? 'text-red-400' : undefined;
  const fontColor = blue || red || 'text-white';

  return (
    <div className={`flex relative w-32 h-[28px] mt-1 shadow-[2px_2px_2px_dimgray]`}>
      {/* パワー数値 */}
      <div className="flex w-32 items-center justify-center z-1 bg-gray-900">
        <span className="text-white font-bold border-r-1 border-gray-600 pr-2">{`Lv${lv}`}</span>
        <motion.span
          className={`ml-2 bold text-lg font-bold font-mono ${fontColor} w-16 text-right`}
          style={{}}
        >
          {displayBp < 0 ? 0 : Math.round(displayBp)}
        </motion.span>
      </div>
    </div>
  );
};
