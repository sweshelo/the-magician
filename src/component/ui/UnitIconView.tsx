import { UnitIconEffect } from './UnitIconEffect';

interface UnitViewProps {
  color: string
  image?: string
  backImage?: string
  reversed?: boolean
  showEffect?: boolean
  onEffectComplete?: () => void
}

export const UnitIconView = ({
  color,
  image,
  backImage,
  reversed = false,
  showEffect = false,
  onEffectComplete
}: UnitViewProps) => {
  return (
    <div className="flex items-center justify-center relative w-32 h-32 select-none perspective">
      {/* Animation effect layer */}
      <UnitIconEffect
        show={showEffect}
        onComplete={onEffectComplete}
      />

      {/* 3D perspective container for flip animation */}
      <div
        className="w-full h-full relative transition-transform duration-600"
        style={{
          transformStyle: 'preserve-3d',
          transform: reversed ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.6s'
        }}
      >
        {/* Front face */}
        <div
          className="absolute w-full h-full"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <svg
            viewBox="0 0 100 120"
            className="absolute top-0 left-0 w-full h-full"
          >
            {/* 外側の黒い縁取り */}
            <polygon
              points="50,10 95,35 95,85 50,110 5,85 5,35"
              fill="none"
              stroke="black"
              strokeWidth="4"
            />
            {/* 属性色の縁取り */}
            <polygon
              points="50,15 90,37.5 90,82.5 50,105 10,82.5 10,37.5"
              fill="none"
              stroke={color}
              strokeWidth="3"
            />
            {/* 内側の白い背景 */}
            <polygon
              points="50,18 87,39 87,81 50,102 13,81 13,39"
              fill="white"
            />
          </svg>

          {/* 中の画像 - SVGクリッピングパスで六角形に切り抜く */}
          <svg
            viewBox="0 0 100 120"
            className="absolute top-0 left-0 w-full h-full"
          >
            <defs>
              <clipPath id="hexClipFront">
                <polygon points="50,18 87,39 87,81 50,102 13,81 13,39" />
              </clipPath>
            </defs>
            <image
              href={image}
              x="6"
              y="18"
              width="88"
              height="84"
              preserveAspectRatio="xMidYMid slice"
              clipPath="url(#hexClipFront)"
            />
          </svg>
        </div>

        {/* Back face */}
        <div
          className="absolute w-full h-full"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <svg
            viewBox="0 0 100 120"
            className="absolute top-0 left-0 w-full h-full"
          >
            {/* 外側の黒い縁取り */}
            <polygon
              points="50,10 95,35 95,85 50,110 5,85 5,35"
              fill="none"
              stroke="black"
              strokeWidth="4"
            />
            {/* 属性色の縁取り */}
            <polygon
              points="50,15 90,37.5 90,82.5 50,105 10,82.5 10,37.5"
              fill="none"
              stroke={color}
              strokeWidth="4"
            />
            {/* 内側の白い背景 */}
            <polygon
              points="50,18 87,39 87,81 50,102 13,81 13,39"
              fill="white"
            />
          </svg>

          {/* 裏面の画像 - SVGクリッピングパスで六角形に切り抜く */}
          <svg
            viewBox="0 0 100 120"
            className="absolute top-0 left-0 w-full h-full"
          >
            <defs>
              <clipPath id="hexClipBack">
                <polygon points="50,18 87,39 87,81 50,102 13,81 13,39" />
              </clipPath>
            </defs>
            <image
              href={backImage || image}
              x="6"
              y="18"
              width="88"
              height="84"
              preserveAspectRatio="xMidYMid slice"
              clipPath="url(#hexClipBack)"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}
