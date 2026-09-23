import type { CSSProperties } from "react";

interface Props {
  path: string;
  duration: number;
}

/** Animate the drawing in CSS, without rerendering the circuit every frame. */
export default function FlowParticles({ path, duration }: Props) {
  return (
    <g
      className="electricity-particles fill-amber-300 dark:fill-yellow-300"
      aria-hidden="true"
    >
      {Array.from({ length: 5 }, (_, index) => (
        <circle
          key={index}
          r="4"
          style={
            {
              offsetPath: `path('${path}')`,
              animation: `electricity-flow ${duration}s linear infinite`,
              animationDelay: `${(-index * duration) / 5}s`,
              filter: "drop-shadow(0 0 4px currentColor)",
            } as CSSProperties
          }
        />
      ))}
    </g>
  );
}
