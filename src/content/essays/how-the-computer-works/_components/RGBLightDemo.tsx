import { useState } from "react";
import useClickSound from "./useClickSound";

interface RGBState {
  r: boolean;
  g: boolean;
  b: boolean;
}

export default function RGBLightDemo() {
  const [lights, setLights] = useState<RGBState>({
    r: false,
    g: false,
    b: false,
  });
  const playClickSound = useClickSound();

  const toggleLight = (color: "r" | "g" | "b") => {
    playClickSound();
    setLights((prev) => ({ ...prev, [color]: !prev[color] }));
  };

  const getColorName = (): string => {
    if (!lights.r && !lights.g && !lights.b) return "Pixel Off";
    if (lights.r && lights.g && lights.b) return "White";
    if (lights.r && lights.g) return "Yellow";
    if (lights.r && lights.b) return "Magenta";
    if (lights.g && lights.b) return "Cyan";
    if (lights.r) return "Red";
    if (lights.g) return "Green";
    if (lights.b) return "Blue";
    return "Pixel Off";
  };

  const getPixelColor = (): string => {
    if (!lights.r && !lights.g && !lights.b) return "#262626";
    if (lights.r && lights.g && lights.b) return "#fafafa";
    if (lights.r && lights.g) return "#facc15";
    if (lights.r && lights.b) return "#e879f9";
    if (lights.g && lights.b) return "#22d3ee";
    if (lights.r) return "#ef4444";
    if (lights.g) return "#22c55e";
    if (lights.b) return "#3b82f6";
    return "#262626";
  };

  const anyLightOn = lights.r || lights.g || lights.b;
  const isWhite = lights.r && lights.g && lights.b;

  // Define consistent border radius for top corners
  const topRadius = 8;
  const frameTopY = 16;
  const pixelTopY = frameTopY;
  const shadowInset = 2; // 2px inset for shadow
  const shadowTopY = frameTopY + shadowInset;

  // Calculate path strings with consistent radius
  const pixelPath = `M 50 49 L 50 ${pixelTopY + topRadius} Q 50 ${pixelTopY}, ${
    50 + topRadius
  } ${pixelTopY} L ${270 - topRadius} ${pixelTopY} Q 270 ${pixelTopY}, 270 ${
    pixelTopY + topRadius
  } L 270 49 Z`;
  const framePath = `M 50 160 L 50 ${
    frameTopY + topRadius
  } Q 50 ${frameTopY}, ${50 + topRadius} ${frameTopY} L ${
    270 - topRadius
  } ${frameTopY} Q 270 ${frameTopY}, 270 ${frameTopY + topRadius} L 270 160`;
  // Shadow path: inset by shadowInset on all sides, uses same radius
  const shadowLeft = 50 + shadowInset;
  const shadowRight = 270 - shadowInset;
  const shadowBottom = 49 - shadowInset;
  const shadowPath = `M ${shadowLeft} ${shadowBottom} L ${shadowLeft} ${
    shadowTopY + topRadius
  } Q ${shadowLeft} ${shadowTopY}, ${shadowLeft + topRadius} ${shadowTopY} L ${
    shadowRight - topRadius
  } ${shadowTopY} Q ${shadowRight} ${shadowTopY}, ${shadowRight} ${
    shadowTopY + topRadius
  } L ${shadowRight} ${shadowBottom} L ${shadowLeft} ${shadowBottom} Z`;

  // LED component - classic through-hole LED shape
  const LED = ({
    x,
    color,
    isOn,
    onClick,
    label,
  }: {
    x: number;
    color: { off: string; on: string; glow: string };
    isOn: boolean;
    onClick: () => void;
    label: string;
  }) => (
    <g
      onClick={onClick}
      className="cursor-pointer"
      style={{ touchAction: "manipulation" }}
    >
      {/* Metal legs */}
      <line
        x1={x - 4}
        y1={155}
        x2={x - 4}
        y2={190}
        className="stroke-neutral-400"
        strokeWidth="2"
      />
      <line
        x1={x + 4}
        y1={155}
        x2={x + 4}
        y2={190}
        className="stroke-neutral-400"
        strokeWidth="2"
      />

      {/* LED base (flat bottom) */}
      <rect
        x={x - 10}
        y={150}
        width={20}
        height={6}
        rx={1}
        fill={isOn ? color.on : color.off}
        className="transition-all duration-200"
      />

      {/* LED dome (rounded top) */}
      <path
        d={`M ${x - 10} 150
            L ${x - 10} 130
            Q ${x - 10} 115, ${x} 115
            Q ${x + 10} 115, ${x + 10} 130
            L ${x + 10} 150 Z`}
        fill={isOn ? color.on : color.off}
        className="transition-all duration-200"
        style={{
          filter: isOn ? `drop-shadow(0 0 8px ${color.glow})` : "none",
        }}
      />

      {/* Highlight/reflection on dome */}
      <ellipse
        cx={x - 3}
        cy={125}
        rx={3}
        ry={5}
        fill="white"
        opacity={isOn ? 0.4 : 0.2}
        className="transition-opacity duration-200"
      />

      {/* Hit area */}
      <rect x={x - 20} y={110} width={40} height={90} fill="transparent" />
    </g>
  );

  return (
    <div className="my-12 -mx-4 sm:mx-0">
      <svg viewBox="0 0 320 200" className="w-full h-auto max-w-md mx-auto">
        <defs>
          {/* Light cone gradients - bright at bottom (LED), fading toward top (pixel) */}
          <linearGradient id="redCone" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="greenCone" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="blueCone" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.6" />
          </linearGradient>

          {/* Pixel grid pattern */}
          <pattern
            id="pixelGrid"
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
          >
            <rect width="8" height="8" fill="transparent" />
            <rect width="7" height="7" fill="black" fillOpacity="0.1" rx="1" />
          </pattern>

          {/* Pixel glow filter */}
          <filter id="pixelGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Clip path for pixel area - using defined radius */}
          <clipPath id="pixelClip">
            <path d={pixelPath} />
          </clipPath>
        </defs>

        {/* Pixel screen at top - rendered first so frame overlaps */}
        <g clipPath="url(#pixelClip)">
          <g style={{ filter: anyLightOn ? "url(#pixelGlow)" : "none" }}>
            {/* Base pixel color - using defined radius */}
            <path
              d={pixelPath}
              fill={getPixelColor()}
              className="transition-all duration-300"
            />
            {/* Pixel grid overlay */}
            <path
              d={pixelPath}
              fill="url(#pixelGrid)"
              className="transition-opacity duration-300"
              style={{ opacity: anyLightOn ? 0.5 : 0.3 }}
            />
          </g>
        </g>
        {/* Subtle inner shadow/depth - slightly inset from pixel edges, all sides, same radius */}
        <path
          d={shadowPath}
          fill="none"
          stroke="black"
          strokeWidth="3"
          strokeOpacity={isWhite ? 0.05 : anyLightOn ? 0.1 : 0.15}
        />

        {/* Housing frame - open at bottom, using defined radius */}
        <path
          d={framePath}
          fill="none"
          className="stroke-neutral-300 dark:stroke-neutral-600"
          strokeWidth="2"
        />

        {/* Divider line below pixel - same stroke as frame */}
        <line
          x1="50"
          y1="49"
          x2="270"
          y2="49"
          className="stroke-neutral-300 dark:stroke-neutral-600"
          strokeWidth="2"
        />

        {/* Color label in pixel */}
        <text
          x="160"
          y="38"
          fontSize="12"
          fontWeight="500"
          textAnchor="middle"
          fill={
            anyLightOn &&
            getColorName() !== "White" &&
            getColorName() !== "Yellow"
              ? "#fff"
              : "#525252"
          }
          className="select-none transition-all duration-300"
        >
          {getColorName()}
        </text>

        {/* Light cones - starting from bottom of LED dome */}
        {lights.r && (
          <polygon
            points="90,150 110,150 135,49 65,49"
            fill="url(#redCone)"
            className="transition-opacity duration-300"
          />
        )}
        {lights.g && (
          <polygon
            points="150,150 170,150 195,49 125,49"
            fill="url(#greenCone)"
            className="transition-opacity duration-300"
          />
        )}
        {lights.b && (
          <polygon
            points="210,150 230,150 255,49 185,49"
            fill="url(#blueCone)"
            className="transition-opacity duration-300"
          />
        )}

        {/* LEDs */}
        <LED
          x={100}
          color={{ off: "#737373", on: "#ef4444", glow: "#fca5a5" }}
          isOn={lights.r}
          onClick={() => toggleLight("r")}
          label="R"
        />
        <LED
          x={160}
          color={{ off: "#737373", on: "#22c55e", glow: "#86efac" }}
          isOn={lights.g}
          onClick={() => toggleLight("g")}
          label="G"
        />
        <LED
          x={220}
          color={{ off: "#737373", on: "#3b82f6", glow: "#93c5fd" }}
          isOn={lights.b}
          onClick={() => toggleLight("b")}
          label="B"
        />
      </svg>

      {/* Hint */}
      <p className="text-center text-neutral-400 dark:text-neutral-300 text-xs mt-2 opacity-50 dark:opacity-70">
        click the LEDs
      </p>
    </div>
  );
}
