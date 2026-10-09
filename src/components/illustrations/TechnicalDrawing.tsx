import { useId, type ReactNode } from "react";

export type Point = [number, number, number];

/** Orthographic projection: all three axes have the same scale. */
export function project([x, y, z]: Point): [number, number] {
  return [Number((((x - y) * Math.sqrt(3)) / 2).toFixed(2)), (x + y) / 2 - z];
}

export function path3(points: Point[], close = false) {
  return (
    points
      .map((point, i) => `${i ? "L" : "M"}${project(point).join(" ")}`)
      .join(" ") + (close ? " Z" : "")
  );
}

interface LineProps {
  points: Point[];
  hidden?: boolean;
  strong?: boolean;
}
export function Line({ points, hidden, strong }: LineProps) {
  return (
    <path
      d={path3(points)}
      fill="none"
      stroke="currentColor"
      strokeWidth={strong ? 2 : 1.2}
      strokeDasharray={hidden ? "1 5" : undefined}
      opacity={hidden ? 0.5 : 1}
    />
  );
}

interface BoxProps {
  at?: Point;
  size: Point;
}
export function Box({ at: [x, y, z] = [0, 0, 0], size: [w, d, h] }: BoxProps) {
  const a: Point = [x, y, z],
    b: Point = [x + w, y, z],
    c: Point = [x + w, y + d, z],
    e: Point = [x, y + d, z];
  const A: Point = [x, y, z + h],
    B: Point = [x + w, y, z + h],
    C: Point = [x + w, y + d, z + h],
    E: Point = [x, y + d, z + h];
  return (
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <Line points={[b, a, e]} hidden />
      <Line points={[a, A]} hidden />
      <Line points={[A, B, C, E, A]} />
      <Line points={[B, b, c, e, E]} />
      <Line points={[C, c]} />
    </g>
  );
}

interface CylinderProps {
  at: Point;
  radius: number;
  height: number;
  lightOn?: boolean;
}
export function Cylinder({
  at: [x, y, z],
  radius,
  height,
  lightOn = false,
}: CylinderProps) {
  const [cx, cy] = project([x, y, z]);
  // A horizontal circle projects to an ellipse; the rear lower arc is concealed.
  const rx = radius * Math.sqrt(1.5),
    ry = radius / Math.sqrt(2);
  return (
    <g fill="none" stroke="currentColor" strokeWidth="1.2">
      <ellipse
        cx={cx}
        cy={cy - height}
        rx={rx}
        ry={ry}
        fill={lightOn ? "currentColor" : "none"}
        fillOpacity=".25"
      />
      <path
        d={`M${cx - rx} ${cy} A${rx} ${ry} 0 0 1 ${cx + rx} ${cy}`}
        strokeDasharray="1 5"
        opacity=".5"
      />
      <path
        d={`M${cx - rx} ${cy - height} V${cy} A${rx} ${ry} 0 0 0 ${cx + rx} ${cy} V${cy - height}`}
      />
    </g>
  );
}

interface LabelProps {
  x: number;
  y: number;
  children: ReactNode;
  anchor?: "start" | "middle" | "end";
}
export function Label({ x, y, children, anchor = "middle" }: LabelProps) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fill="currentColor"
      stroke="none"
      fontSize="16"
      fontFamily="ui-monospace, monospace"
      letterSpacing=".03em"
    >
      {children}
    </text>
  );
}

interface DrawingProps {
  title: string;
  description: string;
  children: ReactNode;
  viewBox?: string;
  caption?: string;
  interactive?: boolean;
}
export default function TechnicalDrawing({
  title,
  description,
  children,
  viewBox = "0 0 600 360",
  caption,
  interactive,
}: DrawingProps) {
  const id = useId();
  return (
    <figure className="technical-drawing my-10 sm:my-14 text-neutral-700 dark:text-neutral-300">
      <svg
        viewBox={viewBox}
        className="block h-auto w-full overflow-visible"
        role={interactive ? "group" : "img"}
        aria-labelledby={interactive ? undefined : `${id}-title`}
        aria-label={interactive ? title : undefined}
        aria-describedby={`${id}-desc`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {!interactive && <title id={`${id}-title`}>{title}</title>}
        <desc id={`${id}-desc`}>{description}</desc>
        {children}
      </svg>
      {caption && (
        <figcaption className="mt-3 text-center font-mono text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
