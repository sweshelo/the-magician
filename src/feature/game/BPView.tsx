interface BPViewProps {
  bp: number;
}

export const BPView = ({ bp }: BPViewProps) => {
  return (
    <div className="relative w-24 h-[26px]">
      <svg
        viewBox="0 0 120 44"
        className="absolute top-0 left-0 w-full h-full"
      >
        {/* 外側の黒い背景 */}
        <polygon
          points="20,0 100,0 120,22 100,44 20,44 0,22"
          fill="black"
        />
        {/* 内側のグラデーション (立体感を表現) */}
        <polygon
          points="22,3 98,3 115,22 98,41 22,41 5,22"
          fill="black"
          stroke="#333"
          strokeWidth="1"
        />
        <polygon
          points="24,5 96,5 112,22 96,39 24,39 8,22"
          fill="black"
          stroke="#444"
          strokeWidth="0.5"
        />
      </svg>

      {/* パワー数値 */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <span className="text-white font-bold">{bp}</span>
      </div>
    </div>
  );
};
