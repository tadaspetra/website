import { useState } from "react";
import { BulbArtwork } from "./CircuitArtwork";
import FlowParticles from "./FlowParticles";
import CircuitControl from "./CircuitControl";
import useClickSound from "./useClickSound";

interface SwitchState {
  a: boolean;
  b: boolean;
}

export default function SwitchAndGate() {
  const [switches, setSwitches] = useState<SwitchState>({ a: false, b: false });

  const playClickSound = useClickSound();

  const isCircuitComplete = switches.a && switches.b;

  const toggleSwitch = (which: "a" | "b") => {
    playClickSound();
    setSwitches((prev) => ({ ...prev, [which]: !prev[which] }));
  };

  return (
    <div className="my-12 -mx-4 sm:mx-0">
      <svg
        viewBox="-5 -10 560 140"
        className="w-full h-auto overflow-visible"
        style={{ minHeight: "100px" }}
      >
        {/* Separate wire segments leave a real gap at each open switch. */}
        <path
          d="M30 60 H130"
          fill="none"
          className="stroke-amber-500 dark:stroke-amber-300"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M210 60 H330"
          fill="none"
          className={`transition-[stroke] duration-200 ${switches.a ? "stroke-amber-500 dark:stroke-amber-300" : "stroke-neutral-400 dark:stroke-neutral-500"}`}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M410 60 H510 V52"
          fill="none"
          className={`transition-[stroke] duration-200 ${isCircuitComplete ? "stroke-amber-500 dark:stroke-amber-300" : "stroke-neutral-400 dark:stroke-neutral-500"}`}
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* ============ POWER SOURCE ============ */}
        <g className="text-amber-500 dark:text-amber-300">
          {/* Battery symbol */}
          <line
            x1="10"
            y1="45"
            x2="10"
            y2="75"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="20"
            y1="50"
            x2="20"
            y2="70"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="20"
            y1="60"
            x2="30"
            y2="60"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* + symbol */}
          <text
            x="10"
            y="38"
            fontSize="12"
            fontWeight="500"
            textAnchor="middle"
            fill="currentColor"
          >
            +
          </text>
        </g>

        {/* ============ SWITCH A ============ */}
        <CircuitControl
          label={"Switch A"}
          pressed={switches.a}
          hint={switches.a ? "Open switch A" : "Close switch A"}
          onToggle={() => toggleSwitch("a")}
        >
          {/* Label */}
          <text
            x="170"
            y="25"
            fontSize="14"
            fontWeight="600"
            textAnchor="middle"
            className={`select-none transition-colors duration-200 ${
              switches.a
                ? "fill-amber-500 dark:fill-amber-300"
                : "fill-neutral-500 dark:fill-neutral-500"
            }`}
          >
            A
          </text>

          {/* Contact points */}
          <circle
            cx="130"
            cy="60"
            r="4"
            className={`transition-colors duration-200 group-hover:stroke-amber-500 ${
              switches.a
                ? "fill-amber-500 dark:fill-amber-300 stroke-amber-500 dark:stroke-amber-400"
                : "fill-neutral-100 dark:fill-neutral-900 stroke-neutral-400 dark:stroke-neutral-500"
            }`}
            strokeWidth="2"
          />
          <circle
            cx="210"
            cy="60"
            r="4"
            className={`transition-colors duration-200 group-hover:stroke-amber-500 ${
              switches.a
                ? "fill-amber-500 dark:fill-amber-300 stroke-amber-500 dark:stroke-amber-400"
                : "fill-neutral-100 dark:fill-neutral-900 stroke-neutral-400 dark:stroke-neutral-500"
            }`}
            strokeWidth="2"
          />

          {/* Switch arm */}
          <line
            x1="130"
            y1="60"
            x2="210"
            y2="60"
            style={{
              transformOrigin: "130px 60px",
              transform: switches.a ? "rotate(0deg)" : "rotate(-26deg)",
            }}
            className={`transition-[fill,stroke,opacity,filter,transform,x2,y2] duration-200 ease-out group-hover:stroke-amber-500 ${
              switches.a
                ? "stroke-amber-500 dark:stroke-amber-300"
                : "stroke-neutral-500 dark:stroke-neutral-500"
            }`}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Invisible hit area */}
          <rect
            x="110"
            y="0"
            width="120"
            height="85"
            rx="10"
            data-circuit-hit
            className="fill-transparent stroke-transparent transition-colors duration-150 group-hover:fill-neutral-500/8 group-focus-visible:fill-neutral-500/8 group-focus-visible:stroke-neutral-500 dark:group-hover:fill-white/8 dark:group-focus-visible:fill-white/8 dark:group-focus-visible:stroke-neutral-400"
          />
        </CircuitControl>

        {/* ============ SWITCH B ============ */}
        <CircuitControl
          label={"Switch B"}
          pressed={switches.b}
          hint={switches.b ? "Open switch B" : "Close switch B"}
          onToggle={() => toggleSwitch("b")}
        >
          {/* Label */}
          <text
            x="370"
            y="25"
            fontSize="14"
            fontWeight="600"
            textAnchor="middle"
            className={`select-none transition-colors duration-200 ${
              switches.b
                ? "fill-amber-500 dark:fill-amber-300"
                : "fill-neutral-500 dark:fill-neutral-500"
            }`}
          >
            B
          </text>

          {/* Contact points */}
          <circle
            cx="330"
            cy="60"
            r="4"
            className={`transition-colors duration-200 group-hover:stroke-amber-500 ${
              switches.a
                ? "fill-amber-500 dark:fill-amber-300 stroke-amber-500 dark:stroke-amber-400"
                : "fill-neutral-100 dark:fill-neutral-900 stroke-neutral-400 dark:stroke-neutral-500"
            }`}
            strokeWidth="2"
          />
          <circle
            cx="410"
            cy="60"
            r="4"
            className={`transition-colors duration-200 group-hover:stroke-amber-500 ${
              isCircuitComplete
                ? "fill-amber-500 dark:fill-amber-300 stroke-amber-500 dark:stroke-amber-400"
                : "fill-neutral-100 dark:fill-neutral-900 stroke-neutral-400 dark:stroke-neutral-500"
            }`}
            strokeWidth="2"
          />

          {/* Switch arm */}
          <line
            x1="330"
            y1="60"
            x2="410"
            y2="60"
            style={{
              transformOrigin: "330px 60px",
              transform: switches.b ? "rotate(0deg)" : "rotate(-26deg)",
            }}
            className={`transition-[fill,stroke,opacity,filter,transform,x2,y2] duration-200 ease-out group-hover:stroke-amber-500 ${
              isCircuitComplete
                ? "stroke-amber-500 dark:stroke-amber-300"
                : "stroke-neutral-500 dark:stroke-neutral-500"
            }`}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Invisible hit area */}
          <rect
            x="310"
            y="0"
            width="120"
            height="85"
            rx="10"
            data-circuit-hit
            className="fill-transparent stroke-transparent transition-colors duration-150 group-hover:fill-neutral-500/8 group-focus-visible:fill-neutral-500/8 group-focus-visible:stroke-neutral-500 dark:group-hover:fill-white/8 dark:group-focus-visible:fill-white/8 dark:group-focus-visible:stroke-neutral-400"
          />
        </CircuitControl>

        <BulbArtwork x={510} y={22} on={isCircuitComplete} />

        {/* ============ BOOLEAN EXPRESSION ============ */}
        <text
          x="280"
          y="105"
          fontSize="13"
          textAnchor="middle"
          className="fill-neutral-500 dark:fill-neutral-400 select-none"
          fontFamily="ui-monospace, monospace"
        >
          <tspan
            className={switches.a ? "fill-amber-500 dark:fill-amber-300" : ""}
          >
            A
          </tspan>
          <tspan> ∧ </tspan>
          <tspan
            className={switches.b ? "fill-amber-500 dark:fill-amber-300" : ""}
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
          <FlowParticles path="M30 60 H510 V56" duration={2.1} />
        )}
      </svg>

      <span role="status" className="sr-only">
        Switch A {switches.a ? "closed" : "open"}, switch B{" "}
        {switches.b ? "closed" : "open"}. Light{" "}
        {isCircuitComplete ? "on" : "off"}.
      </span>
    </div>
  );
}
