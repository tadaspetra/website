interface HalfMoonLayer {
  label?: string;
  radius: number;
  fontSize?: number;
  labelY?: number;
}

const halfMoons: HalfMoonLayer[] = [
  { label: "Things", radius: 255, fontSize: 20, labelY: 126 },
  { label: "Software", radius: 190, fontSize: 17, labelY: 191 },
  { label: "Apps", radius: 125, fontSize: 15, labelY: 256 },
  { radius: 72 },
];

const CX = 300;
const BASELINE_Y = 349;
const LOGO_VIEWBOX_W = 256;
const LOGO_VIEWBOX_H = 317;
const LOGO_HEIGHT = 48;
const LOGO_WIDTH = (LOGO_HEIGHT * LOGO_VIEWBOX_W) / LOGO_VIEWBOX_H;
const LOGO_NUDGE_X = -3;
const LOGO_NUDGE_Y = -8;

function halfMoonPath(radius: number) {
  return [
    `M ${CX - radius} ${BASELINE_Y}`,
    `A ${radius} ${radius} 0 0 1 ${CX + radius} ${BASELINE_Y}`,
    `L ${CX - radius} ${BASELINE_Y}`,
    "Z",
  ].join(" ");
}

function halfMoonArcPath(radius: number) {
  return `M ${CX - radius} ${BASELINE_Y} A ${radius} ${radius} 0 0 1 ${CX + radius} ${BASELINE_Y}`;
}

export default function ConcentricCircles() {
  return (
    <figure className="mt-2 mb-8 mx-auto w-full max-w-none">
      <svg
        viewBox="0 0 600 350"
        className="block w-full overflow-hidden rounded-lg text-[#6b5a45] dark:text-[#d4c4b0]"
        role="img"
        aria-labelledby="half-moons-title"
        aria-describedby="half-moons-desc"
      >
        <title id="half-moons-title">Nested half moons narrowing into Flutter</title>
        <desc id="half-moons-desc">
          A rectangle labeled Life contains nested half moons labeled Things,
          Software, and Apps, with the Flutter logo inside the smallest half
          moon, illustrating that Flutter apps are one small part of a wider
          life.
        </desc>

        <rect
          x="0"
          y="0"
          width="600"
          height="350"
          rx="8"
          fill="currentColor"
          fillOpacity="0.02"
        />

        <text
          x={CX}
          y="74"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="currentColor"
          fontSize="24"
          className="font-fraunces italic"
          style={{ letterSpacing: "0.01em" }}
        >
          Life
        </text>

        {halfMoons.map((layer, idx) => (
          <path
            key={`half-moon-fill-${layer.label ?? layer.radius}`}
            d={halfMoonPath(layer.radius)}
            fill="currentColor"
            fillOpacity={0.028 + idx * 0.03}
          />
        ))}

        {halfMoons.map((layer) => (
          <path
            key={`half-moon-arc-${layer.label ?? layer.radius}`}
            d={halfMoonArcPath(layer.radius)}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.32}
            strokeWidth={1}
            strokeDasharray="4 5"
          />
        ))}

        {halfMoons.map((layer) =>
          layer.label && layer.labelY && layer.fontSize ? (
          <text
            key={`label-${layer.label}`}
            x={CX}
            y={layer.labelY}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="currentColor"
            fontSize={layer.fontSize}
            className="font-fraunces italic"
            style={{ letterSpacing: "0.01em" }}
          >
            {layer.label}
          </text>
          ) : null,
        )}

        <svg
          x={CX - LOGO_WIDTH / 2 + LOGO_NUDGE_X}
          y={BASELINE_Y - 28 - LOGO_HEIGHT / 2 + LOGO_NUDGE_Y}
          width={LOGO_WIDTH}
          height={LOGO_HEIGHT}
          viewBox={`0 0 ${LOGO_VIEWBOX_W} ${LOGO_VIEWBOX_H}`}
          aria-label="Flutter logo"
        >
          <defs>
            <linearGradient x1="4%" y1="27%" x2="75.9%" y2="52.9%" id="flutter-shadow">
              <stop offset="0%" />
              <stop stopOpacity="0" offset="100%" />
            </linearGradient>
          </defs>
          <path fill="#47C5FB" d="M158 0 0 158l49 48L255 0zM157 145l-85 85 49 50 49-49 85-86z" />
          <path fill="#00569E" d="m121 280 37 37h97l-85-86z" />
          <path fill="#00B5F8" d="m72 230 48-48 50 49-49 49z" />
          <path fillOpacity={0.8} fill="url(#flutter-shadow)" d="m121 280 41-14 4-31z" />
        </svg>
      </svg>
    </figure>
  );
}
