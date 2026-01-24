import { useState } from "react";

interface Source {
  title: string;
  url: string;
}

interface SourcesProps {
  sources: Source[];
}

export function Sources({ sources }: SourcesProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!sources || sources.length === 0) return null;

  return (
    <div className="mb-12">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors cursor-pointer bg-transparent border-none p-0 text-sm flex items-center gap-1.5"
      >
        <svg
          className={`w-3 h-3 transition-transform duration-200 ${
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
        {sources.length} {sources.length === 1 ? "source" : "sources"}
      </button>

      <div
        className={`grid transition-all duration-200 ease-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <ul className="overflow-hidden list-none pl-0 m-0 pt-2 -space-y-3">
          {sources.map((source, index) => {
            const domain = new URL(source.url).hostname.replace("www.", "");
            return (
              <li key={index}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="plain-link group flex flex-wrap items-center gap-x-1.5 gap-y-0 text-md py-0.5 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                >
                  <span>{source.title}</span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-neutral-300 dark:text-neutral-600">
                      ·
                    </span>
                    <span className="text-sm text-neutral-400 dark:text-neutral-500">
                      {domain}
                    </span>
                    <svg
                      className="w-2.5 h-2.5 opacity-0 group-hover:opacity-50 transition-opacity"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
