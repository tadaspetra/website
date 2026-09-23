import type { CSSProperties } from "react";

interface Props {
  path: string;
  duration: number;
}

/** Animate the drawing in CSS, without rerendering the circuit every frame. */
export default function FlowParticles({ path, duration }: Props) {
  return (
    <g
      className="electricity-particles pointer-events-none fill-amber-50 stroke-amber-600 dark:fill-neutral-900 dark:stroke-amber-200"
      aria-hidden="true"
    >
      {Array.from({ length: 6 }, (_, index) => (
        <circle
          key={index}
          r="3"
          strokeWidth="1.25"
          style={
            {
              offsetPath: `path('${path}')`,
              animation: `electricity-flow ${duration}s linear infinite`,
              animationDelay: `${(-index * duration) / 6}s`,
            } as CSSProperties
          }
        />
      ))}
    </g>
  );
}
