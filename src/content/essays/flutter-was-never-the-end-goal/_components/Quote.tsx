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
  "[&_p]:font-fraunces [&_p]:italic",
  "[&_p]:text-base sm:[&_p]:text-lg",
  "[&_p]:leading-snug [&_p]:tracking-[-0.005em]",
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
      className={`quote-figure my-8 sm:my-10 mx-auto max-w-xl flex items-start gap-5 sm:gap-6 ${
        isImageRight ? "flex-row-reverse" : ""
      }`}
    >
      {image && (
        <img
          src={image}
          alt={imageAlt ?? author ?? ""}
          loading="lazy"
          className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl object-cover object-top shrink-0 grayscale-[0.15] ring-1 ring-[#6b5a45]/25 dark:ring-[#d4c4b0]/25 shadow-md shadow-[#6b5a45]/10 dark:shadow-black/30"
        />
      )}
      <div className={`flex-1 min-w-0 ${isImageRight ? "text-right" : ""}`}>
        <blockquote className={`quote-blockquote ${childTypography}`}>
          {children}
        </blockquote>
        {hasAttribution && (
          <figcaption className="mt-3 text-[#6b5a45] dark:text-[#d4c4b0] leading-none">
            {author && (
              <span className="block font-['Reenie_Beanie',cursive] text-2xl sm:text-3xl tracking-wide">
                - {author}
              </span>
            )}
            {source && (
              <span className="mt-1.5 block text-xs italic opacity-70">
                {source}
              </span>
            )}
          </figcaption>
        )}
      </div>
    </figure>
  );
}
