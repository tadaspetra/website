import { useState } from "react";
import { BulbArtwork, TransistorArtwork } from "./CircuitArtwork";
import FlowParticles from "./FlowParticles";
import CircuitControl from "./CircuitControl";
import useClickSound from "./useClickSound";

interface TransistorState {
  a: boolean;
  b: boolean;
}

export default function TransistorAndGate() {
  const [inputs, setInputs] = useState<TransistorState>({ a: false, b: false });

  const playClickSound = useClickSound();

  const isCircuitComplete = inputs.a && inputs.b;

  const toggleInput = (which: "a" | "b") => {
    playClickSound();
    setInputs((prev) => ({ ...prev, [which]: !prev[which] }));
  };

  return (
    <div className="my-12 -mx-4 sm:mx-0">
      <svg
        viewBox="0 0 310 430"
        className="w-full h-auto max-w-[340px] mx-auto overflow-visible"
        style={{ minHeight: "300px" }}
      >
        {/* ============ PULL-DOWN RESISTOR & GROUND (rendered FIRST, behind everything) ============ */}
        {/* Vertical wire down from junction to resistor */}
        <line
          x1="200"
          y1="310"
          x2="200"
          y2="325"
          className="stroke-neutral-400 dark:stroke-neutral-500"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Resistor symbol (vertical) */}
        <path
          d="M200,325 L208,330 L192,340 L208,350 L192,360 L200,365"
          fill="none"
          className="stroke-neutral-400 dark:stroke-neutral-500"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* R_Out label */}
        <text
          x="225"
          y="350"
          fontSize="11"
          className="fill-neutral-500 dark:fill-neutral-400 select-none"
        >
          R
          <tspan fontSize="8" dy="2">
            Out
          </tspan>
        </text>

        {/* Ground symbol */}
        <g className="text-neutral-500 dark:text-neutral-600">
          <line
            x1="200"
            y1="365"
            x2="200"
            y2="380"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="185"
            y1="380"
            x2="215"
            y2="380"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="190"
            y1="386"
            x2="210"
            y2="386"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="195"
            y1="392"
            x2="205"
            y2="392"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </g>

        {/* ============ VERTICAL WIRES (segmented to not pass through transistors) ============ */}
        {/* Segment 1: Voltage source to Transistor A top (y=35 to y=92) */}
        <line
          x1="200"
          y1="35"
          x2="200"
          y2="92"
          className="stroke-amber-500 dark:stroke-amber-300"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Segment 2: Transistor A bottom to Transistor B top (y=148 to y=212) */}
        <line
          x1="200"
          y1="148"
          x2="200"
          y2="212"
          className={`transition-colors duration-200 ${
            inputs.a
              ? "stroke-amber-500 dark:stroke-amber-300"
              : "stroke-neutral-400 dark:stroke-neutral-500"
          }`}
          strokeWidth="2"
          strokeLinecap="round"
          style={{
            transition: "x2 0.4s ease-out, y2 0.4s ease-out",
          }}
        />

        {/* Segment 3: Transistor B bottom to junction point (y=268 to y=310) */}
        <line
          x1="200"
          y1="268"
          x2="200"
          y2="310"
          className={`transition-colors duration-200 ${
            isCircuitComplete
              ? "stroke-amber-500 dark:stroke-amber-300"
              : "stroke-neutral-400 dark:stroke-neutral-500"
          }`}
          strokeWidth="2"
          strokeLinecap="round"
          style={{
            transition: "x2 0.4s ease-out, y2 0.4s ease-out",
          }}
        />

        {/* ============ VOLTAGE SOURCE (Battery) ============ */}
        <g className="text-amber-500 dark:text-amber-300">
          {/* Battery positive line (longer) */}
          <line
            x1="188"
            y1="8"
            x2="212"
            y2="8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Battery negative line (shorter) */}
          <line
            x1="192"
            y1="18"
            x2="208"
            y2="18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Connecting wire to circuit */}
          <line
            x1="200"
            y1="18"
            x2="200"
            y2="35"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* + symbol */}
          <text
            x="222"
            y="12"
            fontSize="12"
            fontWeight="500"
            fill="currentColor"
          >
            +
          </text>
        </g>

        {/* ============ TRANSISTOR A ============ */}
        <CircuitControl
          label={"Transistor input A"}
          pressed={inputs.a}
          hint={inputs.a ? "Remove voltage from A" : "Apply voltage to A"}
          onToggle={() => toggleInput("a")}
        >
          <TransistorArtwork x={200} y={120} on={inputs.a} />

          {/* Invisible hit area */}
          <rect
            x="25"
            y="85"
            width="215"
            height="70"
            rx="10"
            data-circuit-hit
            className="fill-transparent stroke-transparent transition-colors duration-150 group-hover:fill-neutral-500/8 group-focus-visible:fill-neutral-500/8 group-focus-visible:stroke-neutral-500 dark:group-hover:fill-white/8 dark:group-focus-visible:fill-white/8 dark:group-focus-visible:stroke-neutral-400"
          />

          {/* ============ INPUT A (with resistor) ============ */}
          {/* Horizontal wire to resistor */}
          <line
            x1="60"
            y1="120"
            x2="90"
            y2="120"
            className={`transition-colors duration-200 ${
              inputs.a
                ? "stroke-amber-500 dark:stroke-amber-300"
                : "stroke-neutral-400 dark:stroke-neutral-500"
            }`}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Resistor symbol */}
          <path
            d="M90,120 L95,112 L105,128 L115,112 L125,128 L135,112 L145,128 L150,120 L172,120"
            fill="none"
            className={`transition-colors duration-200 ${
              inputs.a
                ? "stroke-amber-500 dark:stroke-amber-300"
                : "stroke-neutral-400 dark:stroke-neutral-500"
            }`}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Input A label */}
          <text
            x="45"
            y="125"
            fontSize="14"
            fontWeight="600"
            textAnchor="middle"
            className={`select-none transition-colors duration-200 ${
              inputs.a
                ? "fill-amber-500 dark:fill-amber-300"
                : "fill-neutral-500 dark:fill-neutral-500"
            }`}
          >
            A
          </text>

          {/* Input dot */}
          <circle
            cx="60"
            cy="120"
            r="4.5"
            className={`transition-colors duration-200  ${
              inputs.a
                ? "fill-amber-500 dark:fill-amber-300"
                : "fill-neutral-300 dark:fill-neutral-700"
            }`}
            style={{
              transformOrigin: "60px 120px",
              transition: "transform 0.3s",
            }}
          />

          {/* R label */}
          <text
            x="120"
            y="108"
            fontSize="11"
            textAnchor="middle"
            className="fill-neutral-500 dark:fill-neutral-400 select-none"
          >
            R
          </text>
        </CircuitControl>

        {/* ============ TRANSISTOR B ============ */}
        <CircuitControl
          label={"Transistor input B"}
          pressed={inputs.b}
          hint={inputs.b ? "Remove voltage from B" : "Apply voltage to B"}
          onToggle={() => toggleInput("b")}
        >
          <TransistorArtwork x={200} y={240} on={inputs.b} />

          {/* Invisible hit area */}
          <rect
            x="25"
            y="205"
            width="215"
            height="70"
            rx="10"
            data-circuit-hit
            className="fill-transparent stroke-transparent transition-colors duration-150 group-hover:fill-neutral-500/8 group-focus-visible:fill-neutral-500/8 group-focus-visible:stroke-neutral-500 dark:group-hover:fill-white/8 dark:group-focus-visible:fill-white/8 dark:group-focus-visible:stroke-neutral-400"
          />

          {/* ============ INPUT B (with resistor) ============ */}
          {/* Horizontal wire to resistor */}
          <line
            x1="60"
            y1="240"
            x2="90"
            y2="240"
            className={`transition-colors duration-200 ${
              inputs.b
                ? "stroke-amber-500 dark:stroke-amber-300"
                : "stroke-neutral-400 dark:stroke-neutral-500"
            }`}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Resistor symbol */}
          <path
            d="M90,240 L95,232 L105,248 L115,232 L125,248 L135,232 L145,248 L150,240 L172,240"
            fill="none"
            className={`transition-colors duration-200 ${
              inputs.b
                ? "stroke-amber-500 dark:stroke-amber-300"
                : "stroke-neutral-400 dark:stroke-neutral-500"
            }`}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Input B label */}
          <text
            x="45"
            y="245"
            fontSize="14"
            fontWeight="600"
            textAnchor="middle"
            className={`select-none transition-colors duration-200 ${
              inputs.b
                ? "fill-amber-500 dark:fill-amber-300"
                : "fill-neutral-500 dark:fill-neutral-500"
            }`}
          >
            B
          </text>

          {/* Input dot */}
          <circle
            cx="60"
            cy="240"
            r="4.5"
            className={`transition-colors duration-200  ${
              inputs.b
                ? "fill-amber-500 dark:fill-amber-300"
                : "fill-neutral-300 dark:fill-neutral-700"
            }`}
            style={{
              transformOrigin: "60px 240px",
              transition: "transform 0.3s",
            }}
          />

          {/* R label */}
          <text
            x="120"
            y="228"
            fontSize="11"
            textAnchor="middle"
            className="fill-neutral-500 dark:fill-neutral-400 select-none"
          >
            R
          </text>
        </CircuitControl>

        {/* ============ OUTPUT SECTION ============ */}
        <path
          d="M200 310 H268 V302.6"
          fill="none"
          className={`transition-colors duration-200 ${
            isCircuitComplete
              ? "stroke-amber-500 dark:stroke-amber-300"
              : "stroke-neutral-400 dark:stroke-neutral-500"
          }`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <BulbArtwork x={268} y={272} on={isCircuitComplete} scale={0.9} />

        {/* ============ BOOLEAN EXPRESSION ============ */}
        <text
          x="200"
          y="410"
          fontSize="13"
          textAnchor="middle"
          className="fill-neutral-500 dark:fill-neutral-400 select-none"
          fontFamily="ui-monospace, monospace"
        >
          <tspan
            className={inputs.a ? "fill-amber-500 dark:fill-amber-300" : ""}
          >
            A
          </tspan>
          <tspan> ∧ </tspan>
          <tspan
            className={inputs.b ? "fill-amber-500 dark:fill-amber-300" : ""}
          >
            B
          </tspan>
          <tspan> = </tspan>
          <tspan
            className={
              isCircuitComplete ? "fill-amber-600 dark:fill-amber-300" : ""
            }
            fontWeight={isCircuitComplete ? "600" : "400"}
          >
            {isCircuitComplete ? "1" : "0"}
          </tspan>
        </text>
        {isCircuitComplete && (
          <FlowParticles
            path="M200 18 V105 L189 113 V127 L200 135 V225 L189 233 V247 L200 255 V310 H268 V302.6"
            duration={2.8}
          />
        )}
      </svg>

      <span role="status" className="sr-only">
        Input A {Number(inputs.a)}, input B {Number(inputs.b)}. Output{" "}
        {Number(isCircuitComplete)}.
      </span>
    </div>
  );
}
