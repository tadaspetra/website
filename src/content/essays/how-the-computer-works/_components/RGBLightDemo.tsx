import { useState } from "react";
import TechnicalDrawing, {
  Box,
  Cylinder,
  Label,
  Line,
  project,
  path3,
} from "../../../../components/illustrations/TechnicalDrawing";
import CircuitControl from "./CircuitControl";
import useClickSound from "./useClickSound";

const channels = ["Red", "Green", "Blue"];
const channelColors = [
  "text-red-600 dark:text-red-400",
  "text-green-600 dark:text-green-400",
  "text-blue-600 dark:text-blue-400",
];
const colors = [
  "Off",
  "Blue",
  "Green",
  "Cyan",
  "Red",
  "Magenta",
  "Yellow",
  "White",
];

export default function RGBLightDemo() {
  const [lights, setLights] = useState([false, false, false]);
  const playClick = useClickSound();
  const pixelColor = `rgb(${lights.map((on) => (on ? 255 : 0)).join(", ")})`;
  const colorName =
    colors[Number(lights[0]) * 4 + Number(lights[1]) * 2 + Number(lights[2])];
  return (
    <>
      <TechnicalDrawing
        title="The three channels of a pixel"
        description="Toggle the red, green, and blue emitters. Active emitters light up in their channel color. The pixel above shows the mixed color, also named by its label."
        viewBox="0 0 600 400"
        interactive
      >
        <g transform="translate(190 105)">
          <Box size={[320, 150, 8]} />
          {channels.map((name, i) => {
            const x = 60 + i * 95,
              on = lights[i];
            const [cx, cy] = project([x, 75, 8]);
            return (
              <CircuitControl
                key={name}
                label={`${name} LED`}
                pressed={on}
                hint={`Turn ${on ? "off" : "on"} ${name.toLowerCase()}`}
                onToggle={() => {
                  playClick();
                  setLights((prev) => prev.map((v, n) => (n === i ? !v : v)));
                }}
              >
                <g
                  data-circuit-art
                  className={on ? channelColors[i] : undefined}
                  stroke="currentColor"
                >
                  <Cylinder
                    at={[x, 75, 8]}
                    radius={17}
                    height={42}
                    lightOn={on}
                  />
                  <Line
                    points={[
                      [x - 5, 75, 8],
                      [x - 5, 75, 33],
                      [x + 5, 75, 33],
                      [x + 5, 75, 8],
                    ]}
                    strong={on}
                  />
                  {on && (
                    <path
                      d={`M${cx} ${cy - 65} v-10 M${cx - 28} ${cy - 53} l-8-5 M${cx + 28} ${cy - 53} l8-5`}
                    />
                  )}
                </g>
                <g className={channelColors[i]}>
                  <Label x={cx} y={cy + 39}>
                    {name[0]}
                  </Label>
                </g>
                <rect
                  x={cx - 39}
                  y={cy - 67}
                  width="78"
                  height="116"
                  rx="3"
                  data-circuit-hit
                  className="fill-transparent stroke-transparent group-focus-visible:stroke-current"
                />
              </CircuitControl>
            );
          })}
        </g>
        <g transform="translate(300 55)">
          <path
            d={path3(
              [
                [0, 0, 5],
                [30, 0, 5],
                [30, 30, 5],
                [0, 30, 5],
              ],
              true,
            )}
            fill={pixelColor}
            stroke="none"
          />
          <Box size={[30, 30, 5]} />
        </g>
        <Label x={300} y={30}>
          {colorName === "Off" ? "PIXEL" : colorName.toUpperCase()}
        </Label>
        {/* Keep the readout centered beneath the board and clear of its front edge. */}
        <Label x={190 + project([320 / 2, 150 / 2, 0])[0]} y={376}>
          R {Number(lights[0])} + G {Number(lights[1])} + B {Number(lights[2])}
        </Label>
      </TechnicalDrawing>
      <span role="status" className="sr-only">
        {channels
          .map((name, i) => `${name} ${lights[i] ? "on" : "off"}`)
          .join(", ")}
        . {colorName}.
      </span>
    </>
  );
}
