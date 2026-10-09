import type { ReactNode } from "react";

interface QuoteProps {
  author?: string;
  source?: string;
  image?: string;
  imageAlt?: string;
  imagePosition?: "left" | "right";
  children: ReactNode;
}

const childTypography = [
  "[&_p]:italic",
  "[&_p]:text-base sm:[&_p]:text-lg",
  "[&_p]:leading-relaxed [&_p]:tracking-[-0.005em]",
  "[&_p]:text-neutral-700 dark:[&_p]:text-neutral-200",
  "[&_p]:m-0 [&_p]:p-0",
].join(" ");

export default function Quote({
  author,
  source,
  image,
  imageAlt,
  imagePosition = "left",
  children,
}: QuoteProps) {
  const hasAttribution = Boolean(author || source);
  const isImageRight = imagePosition === "right";

  return (
    <figure
      className={`quote-figure my-8 sm:my-10 mx-auto max-w-xl flex items-start gap-4 sm:gap-5 ${
        isImageRight ? "flex-row-reverse" : ""
      }`}
    >
      {image && (
        <img
          src={image}
          alt={imageAlt ?? author ?? ""}
          loading="lazy"
          className="h-16 w-16 sm:h-20 sm:w-20 rounded-sm object-cover object-top shrink-0 outline outline-black/10 dark:outline-white/10"
        />
      )}
      <div className={`flex-1 min-w-0 ${isImageRight ? "text-right" : ""}`}>
        <blockquote className={`quote-blockquote ${childTypography}`}>
          {children}
        </blockquote>
        {hasAttribution && (
          <figcaption className="mt-3 font-mono text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
            {author && (
              <span className="block">
                — {author}
              </span>
            )}
            {source && (
              <span className="mt-1 block">
                {source}
              </span>
            )}
          </figcaption>
        )}
      </div>
    </figure>
  );
}
