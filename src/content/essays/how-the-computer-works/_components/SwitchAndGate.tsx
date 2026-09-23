import { useState, useId } from "react";
import FlowParticles from "./FlowParticles";
import { toggleKeys } from "./toggleKeys";
import useClickSound from "./useClickSound";

interface SwitchState {
  a: boolean;
  b: boolean;
}

export default function SwitchAndGate() {
  const [switches, setSwitches] = useState<SwitchState>({ a: false, b: false });

  const playClickSound = useClickSound();
  const id = useId();

  const isCircuitComplete = switches.a && switches.b;

  const toggleSwitch = (which: "a" | "b") => {
    playClickSound();
    setSwitches((prev) => ({ ...prev, [which]: !prev[which] }));
  };

  // How far electricity flows based on switch states
  const getElectricityEnd = () => {
    if (!switches.a) return 130; // Stop at switch A
    if (!switches.b) return 330; // Stop at switch B
    return 510; // Full circuit (to lightbulb)
  };

  const electricityEnd = getElectricityEnd();

  return (
    <div className="my-12 -mx-4 sm:mx-0">
      <svg
        viewBox="-5 -10 560 140"
        className="w-full h-auto"
        style={{ minHeight: "100px" }}
      >
        <defs>
          <filter
            id={`${id}-glow`}
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

        {/* ============ BASE WIRE (inactive) ============ */}
        {/* Horizontal */}
        <line
          x1="30"
          y1="60"
          x2="510"
          y2="60"
          className="stroke-neutral-300 dark:stroke-neutral-700"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* 90-degree turn up to lightbulb */}
        <line
          x1="510"
          y1="60"
          x2="510"
          y2="52"
          className="stroke-neutral-300 dark:stroke-neutral-700"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* ============ ACTIVE WIRE (shows electricity progress) ============ */}
        <line
          x1="30"
          y1="60"
          x2={Math.min(electricityEnd, 510)}
          y2="60"
          className="stroke-amber-400 dark:stroke-yellow-400"
          strokeWidth="3"
          strokeLinecap="round"
          style={{
            transition: "x2 0.4s ease-out, y2 0.4s ease-out",
          }}
        />
        {/* Vertical up to lightbulb when complete */}
        {isCircuitComplete && (
          <line
            x1="510"
            y1="60"
            x2="510"
            y2="52"
            className="stroke-amber-400 dark:stroke-yellow-400"
            strokeWidth="3"
            strokeLinecap="round"
          />
        )}

        {/* ============ ELECTRICITY PARTICLES ============ */}
        {isCircuitComplete && (
          <FlowParticles path="M30 60 H505" duration={2.1} />
        )}

        {/* ============ POWER SOURCE ============ */}
        <g className="text-amber-400 dark:text-yellow-400">
          {/* Battery symbol */}
          <line
            x1="10"
            y1="45"
            x2="10"
            y2="75"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="20"
            y1="50"
            x2="20"
            y2="70"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="20"
            y1="60"
            x2="30"
            y2="60"
            stroke="currentColor"
            strokeWidth="3"
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
        <g
          onClick={() => toggleSwitch("a")}
          role="button"
          tabIndex={0}
          aria-label="Switch A"
          aria-pressed={switches.a}
          onKeyDown={(event) => toggleKeys(event, () => toggleSwitch("a"))}
          className="cursor-pointer group"
        >
          {/* Label */}
          <text
            x="170"
            y="25"
            fontSize="14"
            fontWeight="600"
            textAnchor="middle"
            className={`select-none transition-colors duration-300 ${
              switches.a
                ? "fill-amber-400 dark:fill-yellow-400"
                : "fill-neutral-500 dark:fill-neutral-500"
            }`}
          >
            A
          </text>

          {/* Contact points */}
          <circle
            cx="130"
            cy="60"
            r="5"
            className={`transition-colors duration-300 group-hover:stroke-amber-400 ${
              switches.a
                ? "fill-amber-400 dark:fill-yellow-400 stroke-amber-400 dark:stroke-yellow-500"
                : "fill-neutral-100 dark:fill-neutral-900 stroke-neutral-400 dark:stroke-neutral-600"
            }`}
            strokeWidth="2"
          />
          <circle
            cx="210"
            cy="60"
            r="5"
            className={`transition-colors duration-300 group-hover:stroke-amber-400 ${
              switches.a
                ? "fill-amber-400 dark:fill-yellow-400 stroke-amber-400 dark:stroke-yellow-500"
                : "fill-neutral-100 dark:fill-neutral-900 stroke-neutral-400 dark:stroke-neutral-600"
            }`}
            strokeWidth="2"
          />

          {/* Switch arm */}
          <line
            x1="130"
            y1="60"
            x2={switches.a ? "210" : "200"}
            y2={switches.a ? "60" : "25"}
            className={`transition-[fill,stroke,opacity,filter,transform,x2,y2] duration-500 ease-out group-hover:stroke-amber-400 ${
              switches.a
                ? "stroke-amber-400 dark:stroke-yellow-400"
                : "stroke-neutral-500 dark:stroke-neutral-500"
            }`}
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Invisible hit area */}
          <rect x="110" y="15" width="120" height="60" fill="transparent" />
        </g>

        {/* ============ SWITCH B ============ */}
        <g
          onClick={() => toggleSwitch("b")}
          role="button"
          tabIndex={0}
          aria-label="Switch B"
          aria-pressed={switches.b}
          onKeyDown={(event) => toggleKeys(event, () => toggleSwitch("b"))}
          className="cursor-pointer group"
        >
          {/* Label */}
          <text
            x="370"
            y="25"
            fontSize="14"
            fontWeight="600"
            textAnchor="middle"
            className={`select-none transition-colors duration-300 ${
              switches.b
                ? "fill-amber-400 dark:fill-yellow-400"
                : "fill-neutral-500 dark:fill-neutral-500"
            }`}
          >
            B
          </text>

          {/* Contact points */}
          <circle
            cx="330"
            cy="60"
            r="5"
            className={`transition-colors duration-300 group-hover:stroke-amber-400 ${
              switches.a
                ? "fill-amber-400 dark:fill-yellow-400 stroke-amber-400 dark:stroke-yellow-500"
                : "fill-neutral-100 dark:fill-neutral-900 stroke-neutral-400 dark:stroke-neutral-600"
            }`}
            strokeWidth="2"
          />
          <circle
            cx="410"
            cy="60"
            r="5"
            className={`transition-colors duration-300 group-hover:stroke-amber-400 ${
              isCircuitComplete
                ? "fill-amber-400 dark:fill-yellow-400 stroke-amber-400 dark:stroke-yellow-500"
                : "fill-neutral-100 dark:fill-neutral-900 stroke-neutral-400 dark:stroke-neutral-600"
            }`}
            strokeWidth="2"
          />

          {/* Switch arm */}
          <line
            x1="330"
            y1="60"
            x2={switches.b ? "410" : "400"}
            y2={switches.b ? "60" : "25"}
            className={`transition-[fill,stroke,opacity,filter,transform,x2,y2] duration-500 ease-out group-hover:stroke-amber-400 ${
              switches.b
                ? "stroke-amber-400 dark:stroke-yellow-400"
                : "stroke-neutral-500 dark:stroke-neutral-500"
            }`}
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Invisible hit area */}
          <rect x="310" y="15" width="120" height="60" fill="transparent" />
        </g>

        {/* ============ OUTPUT INDICATOR (Lightbulb - wire turns up into bottom) ============ */}
        <g>
          {/* Glass bulb on TOP */}
          <ellipse
            cx="510"
            cy="22"
            rx="18"
            ry="20"
            className={`transition-[fill,stroke,opacity,filter,transform,x2,y2] duration-500 ${
              isCircuitComplete
                ? "fill-amber-200 dark:fill-yellow-200"
                : "fill-neutral-100 dark:fill-neutral-800"
            }`}
            style={{
              filter: isCircuitComplete ? `url(#${id}-glow)` : "none",
            }}
          />
          {/* Inner glow when on */}
          {isCircuitComplete && (
            <ellipse
              cx="510"
              cy="22"
              rx="11"
              ry="13"
              className="fill-amber-300 dark:fill-yellow-300"
              style={{ opacity: 0.6 }}
            />
          )}
          {/* Bulb outline */}
          <ellipse
            cx="510"
            cy="22"
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
            x="500"
            y="40"
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
            x1="500"
            y1="44"
            x2="520"
            y2="44"
            className="stroke-neutral-500 dark:stroke-neutral-700"
            strokeWidth="1"
          />
          <line
            x1="500"
            y1="48"
            x2="520"
            y2="48"
            className="stroke-neutral-500 dark:stroke-neutral-700"
            strokeWidth="1"
          />
          {/* Bottom contact (wire turns up into here) */}
          <rect
            x="505"
            y="52"
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
            d="M504,22 L510,12 L516,22"
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
          x="280"
          y="105"
          fontSize="13"
          textAnchor="middle"
          className="fill-neutral-400 dark:fill-neutral-600 select-none"
          fontFamily="ui-monospace, monospace"
        >
          <tspan
            className={switches.a ? "fill-amber-400 dark:fill-yellow-400" : ""}
          >
            A
          </tspan>
          <tspan> ∧ </tspan>
          <tspan
            className={switches.b ? "fill-amber-400 dark:fill-yellow-400" : ""}
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
        Toggle the switches
      </p>
    </div>
  );
}
