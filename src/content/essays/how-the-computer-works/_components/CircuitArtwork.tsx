interface BulbProps {
  x: number;
  y: number;
  on: boolean;
  scale?: number;
}

/** Flat symbols share the circuit's rounded strokes and signal colors. */
export function BulbArtwork({ x, y, on, scale = 1 }: BulbProps) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${scale})`}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-colors duration-200 ${on ? "text-amber-500 dark:text-amber-300" : "text-neutral-500 dark:text-neutral-400"}`}
    >
      <path
        d="M-8 17V14C-8 8-17 5-17-5a17 17 0 0 1 34 0c0 10-9 13-9 19v3Z"
        className={`transition-colors duration-200 ${on ? "fill-amber-100 dark:fill-amber-300/15" : "fill-white dark:fill-neutral-900"}`}
      />
      <path d="m-6-3 6 6 6-6M0 3v14M-7 22H7M-6 27H6M-3 31h6M0 31v3" />
      <path
        d="M0-28v-4M-24-16l-3-3M24-16l3-3"
        opacity={on ? 1 : 0}
        className="transition-opacity duration-200"
      />
    </g>
  );
}

interface LEDProps {
  x: number;
  color: string;
  on: boolean;
}

export function LEDArtwork({ x, color, on }: LEDProps) {
  return (
    <g
      transform={`translate(${x} 0)`}
      aria-hidden="true"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d="M-5 154v36M5 154v33"
        className="stroke-neutral-400 dark:stroke-neutral-500"
      />
      <path
        d="M-10 149v-23a10 10 0 0 1 20 0v23Z"
        fill={color}
        fillOpacity={on ? 0.85 : 0.08}
        stroke={color}
        className="transition-[fill-opacity] duration-200"
      />
      <rect
        x="-12"
        y="149"
        width="24"
        height="5"
        rx="1"
        fill={color}
        fillOpacity={on ? 0.85 : 0.08}
        stroke={color}
        className="transition-[fill-opacity] duration-200"
      />
    </g>
  );
}

interface TransistorProps {
  x: number;
  y: number;
  on: boolean;
}

export function TransistorArtwork({ x, y, on }: TransistorProps) {
  return (
    <g
      transform={`translate(${x} ${y})`}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-colors duration-200 ${on ? "text-amber-500 dark:text-amber-300" : "text-neutral-500 dark:text-neutral-400"}`}
    >
      <circle
        r="28"
        className={`transition-colors duration-200 ${on ? "fill-amber-50 dark:fill-amber-300/5" : "fill-white dark:fill-neutral-900"}`}
      />
      <path d="M0-28V-15L-11-7M-11 7 0 15v13M-28 0h17M-11-13v26" />
      <path d="m0 15-8-2 4-6Z" fill="currentColor" stroke="none" />
    </g>
  );
}
