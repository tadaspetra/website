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
        className={`hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors cursor-pointer bg-transparent border-none p-0 text-base ml-4 flex items-center gap-1.5 ${
          isOpen
            ? "text-neutral-600 dark:text-neutral-300"
            : "text-neutral-400 dark:text-neutral-500"
        }`}
      >
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-90" : ""
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
            clipRule="evenodd"
          />
        </svg>
        previous work
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
