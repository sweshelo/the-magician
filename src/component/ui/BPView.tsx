interface BPViewProps {
  bp: number;
  lv: number;
}

export const BPView = ({ bp, lv }: BPViewProps) => {
  return (
    <div className="flex relative w-32 h-[28px]">
      {/* パワー数値 */}
      <div className="flex w-32 items-center justify-center z-1">
        <span className="text-white font-bold">{`Lv${lv} ${bp}`}</span>
      </div>
    </div>
  );
};
