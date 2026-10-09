import TechnicalDrawing, {
  Cylinder,
  Label,
} from "../../../../components/illustrations/TechnicalDrawing";

const layers = ["Flutter", "Apps", "Software", "Things", "Life"].map(
  (label, i) => {
    const radius = 40 + i * 31;
    const y = -10 + i * 26;
    const rx = radius * Math.sqrt(1.5);
    const ry = radius / Math.sqrt(2);
    return {
      label,
      radius,
      x: rx * Math.sqrt(1 - ((y + 14) / ry) ** 2),
      y,
    };
  },
);

export default function ConcentricCircles() {
  return (
    <TechnicalDrawing
      title="Flutter within a wider life"
      description="Five nested axonometric cylinders show Flutter inside Apps, Software, Things, and Life. Parallel leader lines connect each name to its ring. Dotted lines describe the concealed lower edges."
      viewBox="0 10 600 290"
    >
      <g transform="translate(215 155)">
        {layers.map(({ label, radius }) => (
          <Cylinder key={label} at={[0, 0, 0]} radius={radius} height={14} />
        ))}
        {layers.map(({ label, x, y }) => (
          <g key={label}>
            <path d={`M${x} ${y} H242`} strokeWidth=".7" opacity=".5" />
            <circle cx={x} cy={y} r="2" fill="currentColor" stroke="none" />
            <Label x={254} y={y + 5} anchor="start">
              {label}
            </Label>
          </g>
        ))}
      </g>
    </TechnicalDrawing>
  );
}
