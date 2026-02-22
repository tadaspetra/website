import { useState } from "react";

interface Item {
  href: string;
  title: string;
  description: string;
  logo: string;
  logoClass?: string;
  logoText?: string;
}

interface PreviousThingsProps {
  items: Item[];
}

// Map Tailwind height classes to rem values for text sizing (matching EntryCard)
const heightToSize: Record<string, string> = {
  "h-3": "0.875rem",
  "h-4": "1rem",
  "h-5": "1.125rem",
  "h-6": "1.25rem",
};

function getHeightClass(className: string): string {
  return className.split(" ").find((c) => c.match(/^h-\d+$/)) || "h-6";
}

export function PreviousThings({ items }: PreviousThingsProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!items || items.length === 0) return null;

  return (
    <div className="mt-0 pt-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 w-full cursor-pointer bg-transparent border-none p-0 group"
      >
        <span
          className={`text-xs tracking-widest uppercase transition-colors whitespace-nowrap my-1 ${
            isOpen
              ? "text-neutral-500 dark:text-neutral-400"
              : "text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-500 dark:group-hover:text-neutral-400 mx-4"
          }`}
        >
          {isOpen ? "Close previous work" : <>Show previous work <span className="leading-none relative -top-px">+</span></>}
        </span>
        {isOpen && (
          <span className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
        )}
      </button>

      <div
        className={`grid transition-all duration-200 ease-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden pt-2 grid grid-cols-1 sm:grid-cols-2">
          {items.map((item, index) => {
            const heightClass = getHeightClass(item.logoClass || "h-6");
            const fontSize = heightToSize[heightClass] || "1.5rem";

            return (
              <a
                key={index}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="plain-link block px-4 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors group"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <img
                      src={item.logo}
                      alt={item.title}
                      className={`${item.logoClass || "h-6"} w-auto max-w-56 object-contain dark:invert`}
                    />
                    {item.logoText && (
                      <span
                        className="-ml-0.5 leading-none font-medium tracking-tighter"
                        style={{ fontSize }}
                      >
                        {item.logoText}
                      </span>
                    )}
                  </div>
                  <div className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 mt-0.5">
                    {item.description}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
