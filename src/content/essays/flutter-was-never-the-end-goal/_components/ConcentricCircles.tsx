import { useId } from "react";

interface HalfMoonLayer {
  label?: string;
  radius: number;
  fontSize?: number;
}

const CX = 300;
const BASELINE_Y = 368;
const VIEW_W = 600;
const VIEW_H = 380;

const halfMoons: HalfMoonLayer[] = [
  { label: "Life", radius: 292, fontSize: 16 },
  { label: "Things", radius: 228, fontSize: 15 },
  { label: "Software", radius: 168, fontSize: 14 },
  { label: "Apps", radius: 112, fontSize: 13 },
  { radius: 64 },
];

const LOGO_VIEWBOX_W = 256;
const LOGO_VIEWBOX_H = 317;
const LOGO_HEIGHT = 42;
const LOGO_WIDTH = (LOGO_HEIGHT * LOGO_VIEWBOX_W) / LOGO_VIEWBOX_H;

function halfMoonPath(radius: number) {
  return [
    `M ${CX - radius} ${BASELINE_Y}`,
    `A ${radius} ${radius} 0 0 1 ${CX + radius} ${BASELINE_Y}`,
    "Z",
  ].join(" ");
}

function halfMoonArcPath(radius: number) {
  return `M ${CX - radius} ${BASELINE_Y} A ${radius} ${radius} 0 0 1 ${CX + radius} ${BASELINE_Y}`;
}

function bandLabelY(outer: number, inner: number) {
  return BASELINE_Y - (outer + inner) / 2;
}

export default function ConcentricCircles() {
  const gradientId = useId();

  return (
    <figure className="mt-2 mb-8 mx-auto w-full">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="block w-full font-sans text-neutral-600 dark:text-neutral-300"
        role="img"
        aria-labelledby="half-moons-title"
        aria-describedby="half-moons-desc"
        style={{ shapeRendering: "geometricPrecision" }}
      >
        <title id="half-moons-title">Nested half moons narrowing into Flutter</title>
        <desc id="half-moons-desc">
          Nested half moons labeled Life, Things, Software, and Apps, with the
          Flutter logo in the smallest moon, illustrating that Flutter apps are
          one small part of a wider life.
        </desc>

        {halfMoons.map((layer, idx) => (
          <path
            key={`fill-${layer.label ?? layer.radius}`}
            d={halfMoonPath(layer.radius)}
            fill="currentColor"
            fillOpacity={0.04 + idx * 0.035}
          />
        ))}

        {halfMoons.map((layer) => (
          <path
            key={`arc-${layer.label ?? layer.radius}`}
            d={halfMoonArcPath(layer.radius)}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.4}
            strokeWidth={1.25}
            strokeLinecap="round"
          />
        ))}

        <line
          x1={CX - halfMoons[0].radius}
          y1={BASELINE_Y}
          x2={CX + halfMoons[0].radius}
          y2={BASELINE_Y}
          stroke="currentColor"
          strokeOpacity={0.16}
          strokeWidth={1}
        />

        {halfMoons.map((layer, idx) => {
          if (!layer.label || !layer.fontSize) return null;
          const inner = halfMoons[idx + 1]?.radius ?? 0;
          return (
            <text
              key={`label-${layer.label}`}
              x={CX}
              y={bandLabelY(layer.radius, inner)}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="currentColor"
              fontSize={layer.fontSize}
              fontWeight="500"
              letterSpacing="-0.015em"
            >
              {layer.label}
            </text>
          );
        })}

        <svg
          x={CX - LOGO_WIDTH / 2}
          y={BASELINE_Y - 64 / 2 - LOGO_HEIGHT / 2 - 1}
          width={LOGO_WIDTH}
          height={LOGO_HEIGHT}
          viewBox={`0 0 ${LOGO_VIEWBOX_W} ${LOGO_VIEWBOX_H}`}
          aria-label="Flutter logo"
          overflow="visible"
        >
          <defs>
            <linearGradient
              x1="4%"
              y1="27%"
              x2="75.9%"
              y2="52.9%"
              id={gradientId}
            >
              <stop offset="0%" stopColor="#000" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#000" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            fill="#47C5FB"
            d="M158 0 0 158l49 48L255 0zM157 145l-85 85 49 50 49-49 85-86z"
          />
          <path fill="#00569E" d="m121 280 37 37h97l-85-86z" />
          <path fill="#00B5F8" d="m72 230 48-48 50 49-49 49z" />
          <path fill={`url(#${gradientId})`} d="m121 280 41-14 4-31z" />
        </svg>
      </svg>
    </figure>
  );
}
