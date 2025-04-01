interface CowProps {
  size: number;
  hasHat?: boolean;
}

export default function Cow({ size, hasHat = false }: CowProps) {
  return (
    <div style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        {/* Cow body */}
        <ellipse
          cx="50"
          cy="60"
          rx="30"
          ry="25"
          fill="white"
          stroke="black"
          strokeWidth="4"
        />

        {/* Cow spots */}
        <circle cx="40" cy="50" r="8" fill="#F9A03F" />
        <circle cx="65" cy="65" r="10" fill="#F9A03F" />

        {/* Cow head */}
        <circle
          cx="50"
          cy="40"
          r="15"
          fill="white"
          stroke="black"
          strokeWidth="4"
        />

        {/* Eyes */}
        <circle cx="43" cy="38" r="3" fill="black" />
        <circle cx="57" cy="38" r="3" fill="black" />

        {/* Nose */}
        <ellipse
          cx="50"
          cy="48"
          rx="8"
          ry="5"
          fill="#FFCC99"
          stroke="black"
          strokeWidth="2"
        />
        <circle cx="46" cy="48" r="1.5" fill="black" />
        <circle cx="54" cy="48" r="1.5" fill="black" />

        {/* Ears */}
        <path
          d="M35 35 L30 25 L40 30 Z"
          fill="white"
          stroke="black"
          strokeWidth="2"
        />
        <path
          d="M65 35 L70 25 L60 30 Z"
          fill="white"
          stroke="black"
          strokeWidth="2"
        />

        {/* Legs */}
        <rect
          x="35"
          y="80"
          width="6"
          height="15"
          fill="white"
          stroke="black"
          strokeWidth="2"
        />
        <rect
          x="59"
          y="80"
          width="6"
          height="15"
          fill="white"
          stroke="black"
          strokeWidth="2"
        />

        {/* Hat (if needed) */}
        {hasHat && (
          <>
            <ellipse
              cx="50"
              cy="25"
              rx="25"
              ry="5"
              fill="#8B4513"
              stroke="black"
              strokeWidth="2"
            />
            <rect
              x="40"
              y="10"
              width="20"
              height="15"
              fill="#8B4513"
              stroke="black"
              strokeWidth="2"
              rx="2"
              ry="2"
            />
            <ellipse
              cx="50"
              cy="10"
              rx="10"
              ry="2"
              fill="#8B4513"
              stroke="black"
              strokeWidth="2"
            />
          </>
        )}

        {/* Tag on ear */}
        {hasHat && (
          <circle
            cx="65"
            cy="35"
            r="4"
            fill="yellow"
            stroke="black"
            strokeWidth="1"
          />
        )}
      </svg>
    </div>
  );
}
