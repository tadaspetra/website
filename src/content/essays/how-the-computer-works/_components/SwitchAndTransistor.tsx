import CircuitDrawing from "./CircuitDrawing";
export default function SwitchAndTransistor() {
  return (
    <div>
      <CircuitDrawing kind="switch" single />
      <CircuitDrawing kind="transistor" single />
    </div>
  );
}
