import { useState } from "react";
import TechnicalDrawing, {
  Box,
  Cylinder,
  Label,
  Line,
  project,
  path3,
  type Point,
} from "../../../../components/illustrations/TechnicalDrawing";
import CircuitControl from "./CircuitControl";
import FlowParticles from "./FlowParticles";
import useClickSound from "./useClickSound";

interface Props {
  kind: "switch" | "transistor";
  single?: boolean;
}
const hitClass = "fill-transparent stroke-none";

// The same terminal coordinates drive both the drawing and its current animation.
function transistorGeometry(x: number) {
  const radius = 22;
  const rx = radius * Math.sqrt(1.5);
  const ry = radius / Math.sqrt(2);
  const terminalOffset = (20 * Math.sqrt(3)) / 2;
  const rimRise = ry * Math.sqrt(1 - (terminalOffset / rx) ** 2);
  const collector: Point[] = [
    [x, 80, 10],
    [x + 10, 80, 10],
    [x + 10, 80, 40 - 10 - rimRise],
  ];
  const emitter: Point[] = [
    [x + 50, 80, 40 + 10 - rimRise],
    [x + 50, 80, 10],
    [x + 60, 80, 10],
  ];
  const base: Point[] = [
    [x + 30, 80, 40 - ry],
    [x + 30, 80, 10],
    [x + 30, 116, 10],
  ];
  const rim = `A${rx} ${ry} 0 0 0 ${project(emitter[0]).join(" ")}`;
  return {
    collector,
    emitter,
    base,
    path: `${path3(collector)} ${rim} ${path3(emitter).replace(/^M/, "L")}`,
  };
}

function switchGeometry(x: number, closed = true) {
  const hinge: Point = [x + 10, 80, 29];
  const contact: Point = [x + 50, 80, 29];
  const angle = closed ? 0 : Math.PI / 5;
  const tip: Point = [
    x + 10 + 40 * Math.cos(angle),
    80,
    29 + 40 * Math.sin(angle),
  ];
  const input: Point[] = [[x, 80, 10], [x + 10, 80, 10], hinge];
  const output: Point[] = [contact, [x + 50, 80, 10], [x + 60, 80, 10]];
  return {
    hinge,
    contact,
    tip,
    input,
    output,
    path: path3([...input, ...output]),
  };
}

export default function CircuitDrawing({ kind, single = false }: Props) {
  const [inputs, setInputs] = useState([false, false]);
  const playClick = useClickSound();
  const currentColor = "text-amber-600 dark:text-amber-300";
  const complete = single ? inputs[0] : inputs[0] && inputs[1];
  const transistor = kind === "transistor";
  const positions = single ? [155] : [80, 220];
  const title = `${transistor ? "Transistor" : "Switch"}${single ? "" : " AND gate"}`;
  const output: Point = [345, 80, 10];
  const [ox, oy] = project(output);
  const flowPath = [
    path3([[32, 80, 10]]),
    ...positions.map((x) =>
      (transistor
        ? transistorGeometry(x).path
        : switchGeometry(x).path
      ).replace(/^M/, "L"),
    ),
    `L${ox} ${oy} V${oy - 19}`,
  ].join(" ");
  return (
    <>
      <TechnicalDrawing
        title={title}
        description={`Toggle ${single ? "the input" : "inputs A and B"} directly on the drawing. ${single ? "The input controls the light." : "Both inputs must be on for the light to turn on."} Dotted edges show the underside of the circuit board.`}
        viewBox="0 0 600 370"
        interactive
      >
        <g transform="translate(165 46)">
          <Box size={[385, 150, 8]} />
          <g className={complete ? currentColor : undefined}>
            <Line
              points={[
                [32, 80, 10],
                [positions[0], 80, 10],
              ]}
              strong
            />
          </g>
          {positions.map((x, i) => {
            const on = inputs[i];
            const terminals = transistorGeometry(x);
            const switchParts = switchGeometry(x, on);
            const [cx, cy] = project([x + 30, 80, 25]);
            const label = single
              ? transistor
                ? "Transistor base"
                : "Switch"
              : `${transistor ? "Input" : "Switch"} ${i ? "B" : "A"}`;
            const next = positions[i + 1] ?? 345;
            return (
              <g key={x}>
                <g className={complete ? currentColor : undefined}>
                  <Line
                    points={[
                      [x + 60, 80, 10],
                      [next, 80, 10],
                    ]}
                    strong={inputs.slice(0, i + 1).every(Boolean)}
                  />
                </g>
                <CircuitControl
                  label={label}
                  pressed={on}
                  hint={
                    transistor
                      ? `${on ? "Remove" : "Apply"} voltage ${on ? "from" : "to"} ${single ? "the base" : `input ${i ? "B" : "A"}`}`
                      : `${on ? "Open" : "Close"} ${single ? "switch" : `switch ${i ? "B" : "A"}`}`
                  }
                  onToggle={() => {
                    playClick();
                    setInputs((prev) =>
                      prev.map((value, index) =>
                        index === i ? !value : value,
                      ),
                    );
                  }}
                >
                  <g data-circuit-art>
                    {transistor && (
                      <g className={complete ? currentColor : undefined}>
                        <Cylinder
                          at={[x + 30, 80, 40]}
                          radius={22}
                          height={30}
                          lightOn={complete}
                        />
                      </g>
                    )}
                    <g
                      className={
                        (transistor ? on : complete) ? currentColor : undefined
                      }
                    >
                      {transistor ? (
                        <>
                          {/* Leads emerge from the visible lower rim, without crossing the casing. */}
                          <g
                            className={
                              complete
                                ? currentColor
                                : "text-neutral-700 dark:text-neutral-300"
                            }
                          >
                            <Line
                              points={terminals.collector}
                              strong={complete}
                            />
                            <Line
                              points={terminals.emitter}
                              strong={complete}
                            />
                          </g>
                          <Line points={terminals.base} strong={on} />
                          <circle
                            cx={project([x + 30, 116, 10])[0]}
                            cy={project([x + 30, 116, 10])[1]}
                            r="3"
                            fill={on ? "currentColor" : "none"}
                            stroke="currentColor"
                          />
                        </>
                      ) : (
                        <>
                          <Line points={switchParts.input} />
                          <Line points={switchParts.output} />
                          <Line
                            points={[switchParts.hinge, switchParts.tip]}
                            strong
                          />
                          {[switchParts.hinge, switchParts.contact].map(
                            (point, index) => {
                              const [contactX, contactY] = project(point);
                              return (
                                <circle
                                  key={index}
                                  cx={contactX}
                                  cy={contactY}
                                  r="3"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  className="fill-white dark:fill-neutral-900"
                                />
                              );
                            },
                          )}
                        </>
                      )}
                    </g>
                  </g>
                  {!single && (
                    <Label
                      x={transistor ? cx - 44 : cx}
                      y={cy + (transistor ? 38 : 34)}
                      anchor={transistor ? "end" : "middle"}
                    >
                      {i ? "B" : "A"}
                    </Label>
                  )}
                  {transistor ? (
                    <>
                      <ellipse
                        cx={cx}
                        cy={cy - 20}
                        rx="38"
                        ry="48"
                        data-circuit-hit
                        className={hitClass}
                      />
                      <rect
                        x={cx - 58}
                        y={cy + 22}
                        width="72"
                        height="22"
                        data-circuit-hit
                        className={hitClass}
                      />
                    </>
                  ) : (
                    <rect
                      x={cx - 47}
                      y={cy - 38}
                      width="94"
                      height="92"
                      data-circuit-hit
                      className={hitClass}
                    />
                  )}
                  <rect
                    x={cx - 33}
                    y={cy - (transistor ? 63 : 27)}
                    width="66"
                    height={transistor ? 100 : 66}
                    rx="5"
                    data-circuit-anchor
                    pointerEvents="none"
                    className="fill-none stroke-transparent group-focus-visible:stroke-current"
                  />
                </CircuitControl>
              </g>
            );
          })}
          <g
            className={complete ? currentColor : undefined}
            stroke="currentColor"
          >
            <Cylinder at={output} radius={17} height={38} lightOn={complete} />
            <path
              d={`M${ox - 7} ${oy - 26} l7 7 7-7 M${ox} ${oy - 19} v19`}
              strokeWidth={complete ? 2 : 1}
            />
            {complete && (
              <path
                d={`M${ox} ${oy - 65} v-9 M${ox - 29} ${oy - 49} l-7-5 M${ox + 29} ${oy - 49} l7-5`}
              />
            )}
          </g>
          <Label x={-10} y={26}>
            +
          </Label>
          <Line
            points={[
              [32, 62, 10],
              [32, 98, 10],
            ]}
          />
          <Line
            points={[
              [24, 68, 10],
              [24, 92, 10],
            ]}
          />
          {complete && <FlowParticles path={flowPath} duration={3} />}
        </g>
        {/* Center the caption on the projected board, with space below its front edge. */}
        <Label x={165 + project([385 / 2, 150 / 2, 0])[0]} y={350}>
          {single
            ? title
            : `${Number(inputs[0])} AND ${Number(inputs[1])} = ${Number(complete)}`}
        </Label>
      </TechnicalDrawing>
      <span role="status" className="sr-only">
        {title}.{" "}
        {single
          ? `Input ${inputs[0] ? "on" : "off"}`
          : `A ${inputs[0] ? "on" : "off"}, B ${inputs[1] ? "on" : "off"}`}
        . Light {complete ? "on" : "off"}.
      </span>
    </>
  );
}
