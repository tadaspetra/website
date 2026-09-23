import { useState, useId } from "react";
import FlowParticles from "./FlowParticles";
import { toggleKeys } from "./toggleKeys";
import useClickSound from "./useClickSound";

interface TransistorState {
  a: boolean;
  b: boolean;
}

export default function TransistorAndGate() {
  const [inputs, setInputs] = useState<TransistorState>({ a: false, b: false });

  const playClickSound = useClickSound();
  const id = useId();

  const isCircuitComplete = inputs.a && inputs.b;

  const toggleInput = (which: "a" | "b") => {
    playClickSound();
    setInputs((prev) => ({ ...prev, [which]: !prev[which] }));
  };

  return (
    <div className="my-12 -mx-4 sm:mx-0">
      <svg
        viewBox="0 0 310 430"
        className="w-full h-auto max-w-md mx-auto"
        style={{ minHeight: "300px" }}
      >
        <defs>
          <filter
            id={`${id}-transistorGlow`}
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ============ PULL-DOWN RESISTOR & GROUND (rendered FIRST, behind everything) ============ */}
        {/* Vertical wire down from junction to resistor */}
        <line
          x1="200"
          y1="310"
          x2="200"
          y2="325"
          className="stroke-neutral-300 dark:stroke-neutral-700"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Resistor symbol (vertical) */}
        <path
          d="M200,325 L208,330 L192,340 L208,350 L192,360 L200,365"
          fill="none"
          className="stroke-neutral-400 dark:stroke-neutral-600"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* R_Out label */}
        <text
          x="225"
          y="350"
          fontSize="11"
          className="fill-neutral-400 dark:fill-neutral-600 select-none"
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
          className="stroke-amber-400 dark:stroke-yellow-400"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Segment 2: Transistor A bottom to Transistor B top (y=148 to y=212) */}
        <line
          x1="200"
          y1="148"
          x2="200"
          y2="212"
          className={`transition-colors duration-300 ${
            inputs.a
              ? "stroke-amber-400 dark:stroke-yellow-400"
              : "stroke-neutral-300 dark:stroke-neutral-700"
          }`}
          strokeWidth={inputs.a ? 3 : 2}
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
          className={`transition-colors duration-300 ${
            isCircuitComplete
              ? "stroke-amber-400 dark:stroke-yellow-400"
              : "stroke-neutral-300 dark:stroke-neutral-700"
          }`}
          strokeWidth={isCircuitComplete ? 3 : 2}
          strokeLinecap="round"
          style={{
            transition: "x2 0.4s ease-out, y2 0.4s ease-out",
          }}
        />

        {/* ============ ELECTRICITY PARTICLES ============ */}
        {isCircuitComplete && (
          <FlowParticles path="M200 35 V310 H280" duration={2.8} />
        )}

        {/* ============ VOLTAGE SOURCE (Battery) ============ */}
        <g className="text-amber-400 dark:text-yellow-400">
          {/* Battery positive line (longer) */}
          <line
            x1="188"
            y1="8"
            x2="212"
            y2="8"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Battery negative line (shorter) */}
          <line
            x1="192"
            y1="18"
            x2="208"
            y2="18"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Connecting wire to circuit */}
          <line
            x1="200"
            y1="18"
            x2="200"
            y2="35"
            stroke="currentColor"
            strokeWidth="3"
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
        <g
          onClick={() => toggleInput("a")}
          role="button"
          tabIndex={0}
          aria-label="Transistor input A"
          aria-pressed={inputs.a}
          onKeyDown={(event) => toggleKeys(event, () => toggleInput("a"))}
          className="cursor-pointer group"
        >
          {/* Transistor body circle - fill only (renders first, behind everything) */}
          <circle
            cx="200"
            cy="120"
            r="28"
            className={`transition-colors duration-300 ${
              inputs.a
                ? "fill-amber-50 dark:fill-amber-950/30"
                : "fill-neutral-100 dark:fill-neutral-900"
            }`}
          />

          {/* Collector (top) */}
          <line
            x1="200"
            y1="92"
            x2="200"
            y2="105"
            className={`transition-colors duration-300 ${
              inputs.a
                ? "stroke-amber-400 dark:stroke-yellow-400"
                : "stroke-neutral-500 dark:stroke-neutral-500"
            }`}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Emitter (bottom) with arrow */}
          <line
            x1="200"
            y1="135"
            x2="200"
            y2="148"
            className={`transition-colors duration-300 ${
              inputs.a
                ? "stroke-amber-400 dark:stroke-yellow-400"
                : "stroke-neutral-500 dark:stroke-neutral-500"
            }`}
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Arrow head on emitter */}
          <polygon
            points="200,148 196,140 204,140"
            className={`transition-colors duration-300 ${
              inputs.a
                ? "fill-amber-400 dark:fill-yellow-400"
                : "fill-neutral-500 dark:fill-neutral-500"
            }`}
          />

          {/* Internal vertical bar */}
          <line
            x1="188"
            y1="110"
            x2="188"
            y2="130"
            className={`transition-colors duration-300 ${
              inputs.a
                ? "stroke-amber-400 dark:stroke-yellow-400"
                : "stroke-neutral-500 dark:stroke-neutral-500"
            }`}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Collector to bar */}
          <line
            x1="200"
            y1="105"
            x2="188"
            y2="113"
            className={`transition-colors duration-300 ${
              inputs.a
                ? "stroke-amber-400 dark:stroke-yellow-400"
                : "stroke-neutral-500 dark:stroke-neutral-500"
            }`}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Emitter from bar */}
          <line
            x1="188"
            y1="127"
            x2="200"
            y2="135"
            className={`transition-colors duration-300 ${
              inputs.a
                ? "stroke-amber-400 dark:stroke-yellow-400"
                : "stroke-neutral-500 dark:stroke-neutral-500"
            }`}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Base (left side) */}
          <line
            x1="172"
            y1="120"
            x2="188"
            y2="120"
            className={`transition-colors duration-300 ${
              inputs.a
                ? "stroke-amber-400 dark:stroke-yellow-400"
                : "stroke-neutral-500 dark:stroke-neutral-500"
            }`}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Transistor body circle - stroke only (renders last, on top of everything) */}
          <circle
            cx="200"
            cy="120"
            r="28"
            fill="none"
            className={`transition-colors duration-300 ${
              inputs.a
                ? "stroke-amber-400 dark:stroke-yellow-500"
                : "stroke-neutral-400 dark:stroke-neutral-600"
            }`}
            strokeWidth="2"
          />

          {/* Invisible hit area */}
          <rect x="60" y="85" width="180" height="70" fill="transparent" />
        </g>

        {/* ============ INPUT A (with resistor) ============ */}
        <g onClick={() => toggleInput("a")} className="cursor-pointer group">
          {/* Horizontal wire to resistor */}
          <line
            x1="60"
            y1="120"
            x2="90"
            y2="120"
            className={`transition-colors duration-300 ${
              inputs.a
                ? "stroke-amber-400 dark:stroke-yellow-400"
                : "stroke-neutral-300 dark:stroke-neutral-700"
            }`}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Resistor symbol */}
          <path
            d="M90,120 L95,112 L105,128 L115,112 L125,128 L135,112 L145,128 L150,120 L172,120"
            fill="none"
            className={`transition-colors duration-300 ${
              inputs.a
                ? "stroke-amber-400 dark:stroke-yellow-400"
                : "stroke-neutral-400 dark:stroke-neutral-600"
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
            className={`select-none transition-colors duration-300 ${
              inputs.a
                ? "fill-amber-400 dark:fill-yellow-400"
                : "fill-neutral-500 dark:fill-neutral-500"
            }`}
          >
            A
          </text>

          {/* Input dot */}
          <circle
            cx="60"
            cy="120"
            r="6"
            className={`transition-colors duration-300 group-hover:scale-110 ${
              inputs.a
                ? "fill-amber-400 dark:fill-yellow-400"
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
            className="fill-neutral-400 dark:fill-neutral-600 select-none"
          >
            R
          </text>
        </g>

        {/* ============ TRANSISTOR B ============ */}
        <g
          onClick={() => toggleInput("b")}
          role="button"
          tabIndex={0}
          aria-label="Transistor input B"
          aria-pressed={inputs.b}
          onKeyDown={(event) => toggleKeys(event, () => toggleInput("b"))}
          className="cursor-pointer group"
        >
          {/* Transistor body circle - fill only (renders first, behind everything) */}
          <circle
            cx="200"
            cy="240"
            r="28"
            className={`transition-colors duration-300 ${
              inputs.b
                ? "fill-amber-50 dark:fill-amber-950/30"
                : "fill-neutral-100 dark:fill-neutral-900"
            }`}
          />

          {/* Collector (top) */}
          <line
            x1="200"
            y1="212"
            x2="200"
            y2="225"
            className={`transition-colors duration-300 ${
              inputs.b
                ? "stroke-amber-400 dark:stroke-yellow-400"
                : "stroke-neutral-500 dark:stroke-neutral-500"
            }`}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Emitter (bottom) with arrow */}
          <line
            x1="200"
            y1="255"
            x2="200"
            y2="268"
            className={`transition-colors duration-300 ${
              inputs.b
                ? "stroke-amber-400 dark:stroke-yellow-400"
                : "stroke-neutral-500 dark:stroke-neutral-500"
            }`}
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Arrow head on emitter */}
          <polygon
            points="200,268 196,260 204,260"
            className={`transition-colors duration-300 ${
              inputs.b
                ? "fill-amber-400 dark:fill-yellow-400"
                : "fill-neutral-500 dark:fill-neutral-500"
            }`}
          />

          {/* Internal vertical bar */}
          <line
            x1="188"
            y1="230"
            x2="188"
            y2="250"
            className={`transition-colors duration-300 ${
              inputs.b
                ? "stroke-amber-400 dark:stroke-yellow-400"
                : "stroke-neutral-500 dark:stroke-neutral-500"
            }`}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Collector to bar */}
          <line
            x1="200"
            y1="225"
            x2="188"
            y2="233"
            className={`transition-colors duration-300 ${
              inputs.b
                ? "stroke-amber-400 dark:stroke-yellow-400"
                : "stroke-neutral-500 dark:stroke-neutral-500"
            }`}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Emitter from bar */}
          <line
            x1="188"
            y1="247"
            x2="200"
            y2="255"
            className={`transition-colors duration-300 ${
              inputs.b
                ? "stroke-amber-400 dark:stroke-yellow-400"
                : "stroke-neutral-500 dark:stroke-neutral-500"
            }`}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Base (left side) */}
          <line
            x1="172"
            y1="240"
            x2="188"
            y2="240"
            className={`transition-colors duration-300 ${
              inputs.b
                ? "stroke-amber-400 dark:stroke-yellow-400"
                : "stroke-neutral-500 dark:stroke-neutral-500"
            }`}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Transistor body circle - stroke only (renders last, on top of everything) */}
          <circle
            cx="200"
            cy="240"
            r="28"
            fill="none"
            className={`transition-colors duration-300 ${
              inputs.b
                ? "stroke-amber-400 dark:stroke-yellow-500"
                : "stroke-neutral-400 dark:stroke-neutral-600"
            }`}
            strokeWidth="2"
          />

          {/* Invisible hit area */}
          <rect x="60" y="205" width="180" height="70" fill="transparent" />
        </g>

        {/* ============ INPUT B (with resistor) ============ */}
        <g onClick={() => toggleInput("b")} className="cursor-pointer group">
          {/* Horizontal wire to resistor */}
          <line
            x1="60"
            y1="240"
            x2="90"
            y2="240"
            className={`transition-colors duration-300 ${
              inputs.b
                ? "stroke-amber-400 dark:stroke-yellow-400"
                : "stroke-neutral-300 dark:stroke-neutral-700"
            }`}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Resistor symbol */}
          <path
            d="M90,240 L95,232 L105,248 L115,232 L125,248 L135,232 L145,248 L150,240 L172,240"
            fill="none"
            className={`transition-colors duration-300 ${
              inputs.b
                ? "stroke-amber-400 dark:stroke-yellow-400"
                : "stroke-neutral-400 dark:stroke-neutral-600"
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
            className={`select-none transition-colors duration-300 ${
              inputs.b
                ? "fill-amber-400 dark:fill-yellow-400"
                : "fill-neutral-500 dark:fill-neutral-500"
            }`}
          >
            B
          </text>

          {/* Input dot */}
          <circle
            cx="60"
            cy="240"
            r="6"
            className={`transition-colors duration-300 group-hover:scale-110 ${
              inputs.b
                ? "fill-amber-400 dark:fill-yellow-400"
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
            className="fill-neutral-400 dark:fill-neutral-600 select-none"
          >
            R
          </text>
        </g>

        {/* ============ OUTPUT SECTION ============ */}
        {/* Horizontal wire */}
        <line
          x1="200"
          y1="310"
          x2="268"
          y2="310"
          className="stroke-neutral-300 dark:stroke-neutral-700"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* 90-degree turn up to lightbulb */}
        <line
          x1="268"
          y1="310"
          x2="268"
          y2="306"
          className="stroke-neutral-300 dark:stroke-neutral-700"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Active horizontal wire */}
        <line
          x1="200"
          y1="310"
          x2="268"
          y2="310"
          className={`transition-colors duration-300 ${
            isCircuitComplete
              ? "stroke-amber-400 dark:stroke-yellow-400"
              : "stroke-transparent"
          }`}
          strokeWidth={3}
          strokeLinecap="round"
        />
        {/* Active vertical wire */}
        {isCircuitComplete && (
          <line
            x1="268"
            y1="310"
            x2="268"
            y2="306"
            className="stroke-amber-400 dark:stroke-yellow-400"
            strokeWidth="3"
            strokeLinecap="round"
          />
        )}

        {/* ============ OUTPUT INDICATOR (Lightbulb - wire turns up into bottom) ============ */}
        <g>
          {/* Glass bulb on TOP */}
          <ellipse
            cx="268"
            cy="272"
            rx="18"
            ry="20"
            className={`transition-[fill,stroke,opacity,filter,transform,x2,y2] duration-500 ${
              isCircuitComplete
                ? "fill-amber-200 dark:fill-yellow-200"
                : "fill-neutral-100 dark:fill-neutral-800"
            }`}
            style={{
              filter: isCircuitComplete ? `url(#${id}-transistorGlow)` : "none",
            }}
          />
          {/* Inner glow when on */}
          {isCircuitComplete && (
            <ellipse
              cx="268"
              cy="272"
              rx="11"
              ry="13"
              className="fill-amber-300 dark:fill-yellow-300"
              style={{ opacity: 0.6 }}
            />
          )}
          {/* Bulb outline */}
          <ellipse
            cx="268"
            cy="272"
            rx="18"
            ry="20"
            fill="none"
            className={`transition-[fill,stroke,opacity,filter,transform,x2,y2] duration-300 ${
              isCircuitComplete
                ? "stroke-amber-400 dark:stroke-yellow-400"
                : "stroke-neutral-400 dark:stroke-neutral-600"
            }`}
            strokeWidth="2"
          />
          {/* Screw base */}
          <rect
            x="258"
            y="290"
            width="20"
            height="12"
            className={`transition-colors duration-300 ${
              isCircuitComplete
                ? "fill-neutral-400 dark:fill-neutral-500"
                : "fill-neutral-300 dark:fill-neutral-600"
            }`}
          />
          {/* Screw threads */}
          <line
            x1="258"
            y1="294"
            x2="278"
            y2="294"
            className="stroke-neutral-500 dark:stroke-neutral-700"
            strokeWidth="1"
          />
          <line
            x1="258"
            y1="298"
            x2="278"
            y2="298"
            className="stroke-neutral-500 dark:stroke-neutral-700"
            strokeWidth="1"
          />
          {/* Bottom contact (wire turns up into here) */}
          <rect
            x="263"
            y="302"
            width="10"
            height="4"
            rx="1"
            className={`transition-colors duration-300 ${
              isCircuitComplete
                ? "fill-amber-400 dark:fill-yellow-500"
                : "fill-neutral-400 dark:fill-neutral-600"
            }`}
          />
          {/* Filament (visible when off) */}
          <path
            d="M262,272 L268,262 L274,272"
            fill="none"
            className="stroke-neutral-400 dark:stroke-neutral-500"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              opacity: isCircuitComplete ? 0 : 1,
              transition: "opacity 0.3s",
            }}
          />
        </g>

        {/* ============ BOOLEAN EXPRESSION ============ */}
        <text
          x="200"
          y="410"
          fontSize="13"
          textAnchor="middle"
          className="fill-neutral-400 dark:fill-neutral-600 select-none"
          fontFamily="ui-monospace, monospace"
        >
          <tspan
            className={inputs.a ? "fill-amber-400 dark:fill-yellow-400" : ""}
          >
            A
          </tspan>
          <tspan> ∧ </tspan>
          <tspan
            className={inputs.b ? "fill-amber-400 dark:fill-yellow-400" : ""}
          >
            B
          </tspan>
          <tspan> = </tspan>
          <tspan
            className={
              isCircuitComplete ? "fill-emerald-500 dark:fill-emerald-400" : ""
            }
            fontWeight={isCircuitComplete ? "600" : "400"}
          >
            {isCircuitComplete ? "1" : "0"}
          </tspan>
        </text>
      </svg>

      {/* Subtle interaction hint */}
      <p className="text-center text-neutral-500 dark:text-neutral-400 text-sm mt-2">
        Toggle A or B to apply voltage
      </p>
    </div>
  );
}
