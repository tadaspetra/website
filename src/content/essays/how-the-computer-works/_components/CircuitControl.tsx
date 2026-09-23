import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { toggleKeys } from "./toggleKeys";

interface CircuitControlProps {
  label: string;
  pressed: boolean;
  hint: string;
  onToggle: () => void;
  children: ReactNode;
}

/** Keeps the drawing itself interactive, with a hint only on hover or focus. */
export default function CircuitControl({
  label,
  pressed,
  hint,
  onToggle,
  children,
}: CircuitControlProps) {
  const id = useId();
  const control = useRef<SVGGElement>(null);
  const tooltip = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const focused = useRef(false);
  const hovered = useRef(false);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ left: 0, top: 0 });

  function show() {
    clearTimeout(closeTimer.current);
    setOpen(true);
  }

  function hide() {
    clearTimeout(closeTimer.current);
    // Allow the pointer to cross the small gap to the popup.
    closeTimer.current = setTimeout(() => {
      if (!focused.current && !hovered.current) setOpen(false);
    }, 120);
  }

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  useLayoutEffect(() => {
    if (!open) return;

    function place() {
      const anchor = control.current?.querySelector("[data-circuit-hit]");
      if (!anchor || !tooltip.current) return;
      const rect = anchor.getBoundingClientRect();
      const { width, height } = tooltip.current.getBoundingClientRect();
      setPosition({
        left: Math.max(
          8,
          Math.min(
            rect.left + (rect.width - width) / 2,
            window.innerWidth - width - 8,
          ),
        ),
        top: rect.top >= height + 16 ? rect.top - height - 8 : rect.bottom + 8,
      });
    }

    function dismiss(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    window.addEventListener("keydown", dismiss);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("keydown", dismiss);
    };
  }, [open, hint]);

  return (
    <>
      <g
        ref={control}
        role="button"
        tabIndex={0}
        aria-label={label}
        aria-pressed={pressed}
        aria-describedby={open ? id : undefined}
        onClick={onToggle}
        onKeyDown={(event) => toggleKeys(event, onToggle)}
        onPointerEnter={(event) => {
          if (event.pointerType !== "mouse") return;
          hovered.current = true;
          show();
        }}
        onPointerLeave={() => {
          hovered.current = false;
          hide();
        }}
        onFocus={(event) => {
          focused.current = event.currentTarget.matches(":focus-visible");
          if (focused.current) show();
        }}
        onBlur={() => {
          focused.current = false;
          hide();
        }}
        className="group cursor-pointer touch-manipulation outline-none"
      >
        {children}
      </g>
      {open &&
        createPortal(
          <div
            ref={tooltip}
            id={id}
            role="tooltip"
            style={position}
            onPointerEnter={() => {
              hovered.current = true;
              show();
            }}
            onPointerLeave={() => {
              hovered.current = false;
              hide();
            }}
            className="fixed z-50 max-w-[calc(100vw-16px)] rounded-md bg-neutral-900 px-2.5 py-1.5 text-xs leading-4 font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
          >
            {hint}
          </div>,
          document.body,
        )}
    </>
  );
}
