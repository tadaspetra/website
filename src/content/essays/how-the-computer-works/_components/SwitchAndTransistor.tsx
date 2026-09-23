import { useState } from "react";
import { BulbArtwork, TransistorArtwork } from "./CircuitArtwork";
import FlowParticles from "./FlowParticles";
import CircuitControl from "./CircuitControl";
import useClickSound from "./useClickSound";

interface ComponentState {
  switchClosed: boolean;
  transistorOn: boolean;
}

export default function SwitchAndTransistor() {
  const [state, setState] = useState<ComponentState>({
    switchClosed: false,
    transistorOn: false,
  });
  const playClickSound = useClickSound();

  const toggleSwitch = () => {
    playClickSound();
    setState((prev) => ({ ...prev, switchClosed: !prev.switchClosed }));
  };

  const toggleTransistor = () => {
    playClickSound();
    setState((prev) => ({ ...prev, transistorOn: !prev.transistorOn }));
  };

  return (
    <div className="my-12 -mx-4 sm:mx-0">
      <div className="grid items-center gap-2 min-[480px]:grid-cols-2 min-[480px]:gap-5">
        <svg
          viewBox="0 0 280 200"
          className="mx-auto w-full max-w-[300px] overflow-visible"
        >
          {/* ============ SWITCH CIRCUIT (Left Side) ============ */}
          <CircuitControl
            label={"Mechanical switch"}
            pressed={state.switchClosed}
            hint={state.switchClosed ? "Open switch" : "Close switch"}
            onToggle={toggleSwitch}
          >
            {/* Power source */}
            <g className="text-amber-500 dark:text-amber-300">
              {/* Battery positive line */}
              <line
                x1="30"
                y1="95"
                x2="30"
                y2="125"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Battery negative line */}
              <line
                x1="42"
                y1="102"
                x2="42"
                y2="118"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* + symbol */}
              <text
                x="30"
                y="88"
                fontSize="12"
                fontWeight="600"
                textAnchor="middle"
                fill="currentColor"
              >
                +
              </text>
            </g>

            {/* Wire from battery to switch */}
            <line
              x1="42"
              y1="110"
              x2="80"
              y2="110"
              className={`transition-colors duration-200 ${
                state.switchClosed
                  ? "stroke-amber-500 dark:stroke-amber-300"
                  : "stroke-amber-500 dark:stroke-amber-300"
              }`}
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Left contact point */}
            <circle
              cx="80"
              cy="110"
              r="4"
              className={`transition-colors duration-200 group-hover:stroke-amber-500 ${
                state.switchClosed
                  ? "fill-amber-500 dark:fill-amber-300 stroke-amber-500 dark:stroke-amber-400"
                  : "fill-neutral-100 dark:fill-neutral-900 stroke-neutral-400 dark:stroke-neutral-500"
              }`}
              strokeWidth="2"
            />

            {/* Switch arm */}
            <line
              x1="80"
              y1="110"
              x2="160"
              y2="110"
              style={{
                transformOrigin: "80px 110px",
                transform: state.switchClosed
                  ? "rotate(0deg)"
                  : "rotate(-30deg)",
              }}
              className={`transition-[fill,stroke,opacity,filter,transform,x2,y2] duration-200 ease-out group-hover:stroke-amber-500 ${
                state.switchClosed
                  ? "stroke-amber-500 dark:stroke-amber-300"
                  : "stroke-neutral-500 dark:stroke-neutral-500"
              }`}
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Right contact point */}
            <circle
              cx="160"
              cy="110"
              r="4"
              className={`transition-colors duration-200 group-hover:stroke-amber-500 ${
                state.switchClosed
                  ? "fill-amber-500 dark:fill-amber-300 stroke-amber-500 dark:stroke-amber-400"
                  : "fill-neutral-100 dark:fill-neutral-900 stroke-neutral-400 dark:stroke-neutral-500"
              }`}
              strokeWidth="2"
            />

            {/* Wire from switch to corner */}
            <line
              x1="160"
              y1="110"
              x2="220"
              y2="110"
              className={`transition-colors duration-200 ${
                state.switchClosed
                  ? "stroke-amber-500 dark:stroke-amber-300"
                  : "stroke-neutral-400 dark:stroke-neutral-500"
              }`}
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* 90-degree turn up to lightbulb */}
            <line
              x1="220"
              y1="110"
              x2="220"
              y2="100"
              className={`transition-colors duration-200 ${
                state.switchClosed
                  ? "stroke-amber-500 dark:stroke-amber-300"
                  : "stroke-neutral-400 dark:stroke-neutral-500"
              }`}
              strokeWidth="2"
              strokeLinecap="round"
            />

            <BulbArtwork x={220} y={70} on={state.switchClosed} scale={0.9} />

            {/* Invisible hit area */}
            <rect
              x="60"
              y="52"
              width="120"
              height="90"
              rx="10"
              data-circuit-hit
              className="fill-transparent stroke-transparent transition-colors duration-150 group-hover:fill-neutral-500/8 group-focus-visible:fill-neutral-500/8 group-focus-visible:stroke-neutral-500 dark:group-hover:fill-white/8 dark:group-focus-visible:fill-white/8 dark:group-focus-visible:stroke-neutral-400"
            />
          </CircuitControl>
          {state.switchClosed && (
            <FlowParticles path="M42 110 H220 V100.6" duration={1.4} />
          )}
        </svg>
        <svg
          viewBox="330 0 280 220"
          className="mx-auto w-full max-w-[300px] overflow-visible"
        >
          {/* ============ TRANSISTOR CIRCUIT (Right Side) ============ */}
          {/* Transistor center: (480, 110), radius: 28 */}
          {/* Top edge: 82, Bottom edge: 138, Left edge: 452 */}
          <CircuitControl
            label={"Transistor"}
            pressed={state.transistorOn}
            hint={
              state.transistorOn ? "Remove base voltage" : "Apply base voltage"
            }
            onToggle={toggleTransistor}
          >
            {/* Collector wire from top (voltage in) - outside circle */}
            <line
              x1="480"
              y1="35"
              x2="480"
              y2="82"
              className={`transition-colors duration-200 ${
                state.transistorOn
                  ? "stroke-amber-500 dark:stroke-amber-300"
                  : "stroke-amber-500 dark:stroke-amber-300"
              }`}
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Voltage source (Battery) */}
            <g className="text-amber-500 dark:text-amber-300">
              {/* Battery positive line (longer) */}
              <line
                x1="468"
                y1="8"
                x2="492"
                y2="8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Battery negative line (shorter) */}
              <line
                x1="472"
                y1="18"
                x2="488"
                y2="18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Connecting wire to circuit */}
              <line
                x1="480"
                y1="18"
                x2="480"
                y2="35"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* + symbol */}
              <text
                x="502"
                y="12"
                fontSize="12"
                fontWeight="500"
                fill="currentColor"
              >
                +
              </text>
            </g>

            {/* C Label */}
            <text
              x="498"
              y="60"
              fontSize="16"
              fontWeight="500"
              fontStyle="italic"
              className={`select-none transition-colors duration-200 ${
                state.transistorOn
                  ? "fill-amber-500 dark:fill-amber-300"
                  : "fill-neutral-500 dark:fill-neutral-500"
              }`}
            >
              C
            </text>

            <TransistorArtwork x={480} y={110} on={state.transistorOn} />

            {/* Extended base wire to left (outside circle) */}
            <line
              x1="380"
              y1="110"
              x2="452"
              y2="110"
              className={`transition-colors duration-200 ${
                state.transistorOn
                  ? "stroke-amber-500 dark:stroke-amber-300"
                  : "stroke-neutral-400 dark:stroke-neutral-500"
              }`}
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Base input dot (this is what you "toggle") */}
            <circle
              cx="380"
              cy="110"
              r="4.5"
              className={`transition-[fill,stroke,opacity,filter,transform,x2,y2] duration-200  ${
                state.transistorOn
                  ? "fill-amber-500 dark:fill-amber-300"
                  : "fill-neutral-300 dark:fill-neutral-700"
              }`}
              style={{ transformOrigin: "380px 110px" }}
            />

            {/* B Label - to the left of the base wire */}
            <text
              x="365"
              y="115"
              fontSize="16"
              fontWeight="500"
              fontStyle="italic"
              textAnchor="middle"
              className={`select-none transition-colors duration-200 ${
                state.transistorOn
                  ? "fill-amber-500 dark:fill-amber-300"
                  : "fill-neutral-500 dark:fill-neutral-500"
              }`}
            >
              B
            </text>

            {/* Emitter wire going down (outside circle) */}
            <line
              x1="480"
              y1="138"
              x2="480"
              y2="175"
              className={`transition-colors duration-200 ${
                state.transistorOn
                  ? "stroke-amber-500 dark:stroke-amber-300"
                  : "stroke-neutral-400 dark:stroke-neutral-500"
              }`}
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Output wire (horizontal from emitter) */}
            <line
              x1="480"
              y1="175"
              x2="560"
              y2="175"
              className={`transition-colors duration-200 ${
                state.transistorOn
                  ? "stroke-amber-500 dark:stroke-amber-300"
                  : "stroke-neutral-400 dark:stroke-neutral-500"
              }`}
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* 90-degree turn up to lightbulb */}
            <line
              x1="560"
              y1="175"
              x2="560"
              y2="165"
              className={`transition-colors duration-200 ${
                state.transistorOn
                  ? "stroke-amber-500 dark:stroke-amber-300"
                  : "stroke-neutral-400 dark:stroke-neutral-500"
              }`}
              strokeWidth="2"
              strokeLinecap="round"
            />

            <BulbArtwork x={560} y={135} on={state.transistorOn} scale={0.9} />

            {/* E Label - below the transistor circle */}
            <text
              x="498"
              y="155"
              fontSize="16"
              fontWeight="500"
              fontStyle="italic"
              className={`select-none transition-colors duration-200 ${
                state.transistorOn
                  ? "fill-amber-500 dark:fill-amber-300"
                  : "fill-neutral-500 dark:fill-neutral-500"
              }`}
            >
              E
            </text>

            {/* Invisible hit area */}
            <rect
              x="350"
              y="72"
              width="165"
              height="85"
              rx="10"
              data-circuit-hit
              className="fill-transparent stroke-transparent transition-colors duration-150 group-hover:fill-neutral-500/8 group-focus-visible:fill-neutral-500/8 group-focus-visible:stroke-neutral-500 dark:group-hover:fill-white/8 dark:group-focus-visible:fill-white/8 dark:group-focus-visible:stroke-neutral-400"
            />
          </CircuitControl>
          {state.transistorOn && (
            <FlowParticles
              path="M480 18 V95 L469 103 V117 L480 125 V175 H560 V165.6"
              duration={1.8}
            />
          )}
        </svg>
      </div>
      <span role="status" className="sr-only">
        Switch light {state.switchClosed ? "on" : "off"}. Transistor light{" "}
        {state.transistorOn ? "on" : "off"}.
      </span>
    </div>
  );
}
