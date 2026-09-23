import { useState } from "react";
import { LEDArtwork } from "./CircuitArtwork";
import CircuitControl from "./CircuitControl";
import useClickSound from "./useClickSound";

interface RGBState {
  r: boolean;
  g: boolean;
  b: boolean;
}

interface LEDProps {
  x: number;
  color: string;
  isOn: boolean;
  onClick: () => void;
  label: string;
}

// LED component - classic through-hole LED shape
function LED({ x, color, isOn, onClick, label }: LEDProps) {
  return (
    <CircuitControl
      label={`${label} LED`}
      pressed={isOn}
      hint={`${isOn ? "Turn off" : "Turn on"} ${label.toLowerCase()}`}
      onToggle={onClick}
    >
      <LEDArtwork x={x} color={color} on={isOn} />

      {/* Hit area */}
      <rect
        x={x - 25}
        y={105}
        width={50}
        height={100}
        rx={10}
        data-circuit-hit
        className="fill-transparent stroke-transparent transition-colors duration-150 group-hover:fill-neutral-500/8 group-focus-visible:fill-neutral-500/8 group-focus-visible:stroke-neutral-500 dark:group-hover:fill-white/8 dark:group-focus-visible:fill-white/8 dark:group-focus-visible:stroke-neutral-400"
      />
      <text
        x={x}
        y={205}
        textAnchor="middle"
        fontSize="10"
        className="fill-neutral-500 dark:fill-neutral-400 select-none"
      >
        {label[0]}
      </text>
    </CircuitControl>
  );
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

  const colors = [
    ["Pixel Off", "#262626"],
    ["Blue", "#3b82f6"],
    ["Green", "#22c55e"],
    ["Cyan", "#22d3ee"],
    ["Red", "#ef4444"],
    ["Magenta", "#e879f9"],
    ["Yellow", "#facc15"],
    ["White", "#fafafa"],
  ];
  const [colorName, pixelColor] =
    colors[Number(lights.r) * 4 + Number(lights.g) * 2 + Number(lights.b)];

  // Keep the screen and light paths in their original positions.
  const pixelPath = "M50 49V24Q50 16 58 16H262Q270 16 270 24V49Z";
  const framePath = "M50 160V24Q50 16 58 16H262Q270 16 270 24V160";

  return (
    <div className="my-12 -mx-4 sm:mx-0">
      <svg viewBox="0 0 320 220" className="w-full h-auto max-w-md mx-auto">
        <path
          d={pixelPath}
          fill={pixelColor}
          className="transition-[fill] duration-200"
        />

        {/* Housing frame - open at bottom, using defined radius */}
        <path
          d={framePath}
          fill="none"
          className="stroke-neutral-400 dark:stroke-neutral-500"
          strokeWidth="1.8"
        />

        {/* Divider line below pixel - same stroke as frame */}
        <line
          x1="50"
          y1="49"
          x2="270"
          y2="49"
          className="stroke-neutral-400 dark:stroke-neutral-500"
          strokeWidth="1.8"
        />

        {/* Color label in pixel */}
        <text
          x="160"
          y="38"
          fontSize="12"
          fontWeight="500"
          textAnchor="middle"
          fill={
            ["Green", "Cyan", "Yellow", "White"].includes(colorName)
              ? "#262626"
              : "#ffffff"
          }
          className="select-none transition-[fill] duration-200"
        >
          {colorName}
        </text>

        {/* Light cones - starting from bottom of LED dome */}
        <polygon
          points="90,150 110,150 135,49 65,49"
          fill="#ef4444"
          opacity={lights.r ? 0.16 : 0}
          className="transition-opacity duration-200"
        />
        <polygon
          points="150,150 170,150 195,49 125,49"
          fill="#22c55e"
          opacity={lights.g ? 0.16 : 0}
          className="transition-opacity duration-200"
        />
        <polygon
          points="210,150 230,150 255,49 185,49"
          fill="#3b82f6"
          opacity={lights.b ? 0.16 : 0}
          className="transition-opacity duration-200"
        />

        {/* LEDs */}
        <LED
          x={100}
          color="#ef4444"
          isOn={lights.r}
          onClick={() => toggleLight("r")}
          label="Red"
        />
        <LED
          x={160}
          color="#22c55e"
          isOn={lights.g}
          onClick={() => toggleLight("g")}
          label="Green"
        />
        <LED
          x={220}
          color="#3b82f6"
          isOn={lights.b}
          onClick={() => toggleLight("b")}
          label="Blue"
        />
      </svg>

      <span role="status" className="sr-only">
        Red {lights.r ? "on" : "off"}, green {lights.g ? "on" : "off"}, blue{" "}
        {lights.b ? "on" : "off"}. {colorName}.
      </span>
    </div>
  );
}
