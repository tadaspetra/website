import type { KeyboardEvent } from "react";

export function toggleKeys(
  event: KeyboardEvent<SVGGElement>,
  toggle: () => void,
) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    if (!event.repeat) toggle();
  }
}
