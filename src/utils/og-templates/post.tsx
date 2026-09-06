import type { CollectionEntry } from "astro:content";
import React from "react";
import { OG_COLORS, OG_FONT_FAMILY, smartenPunctuation } from "./theme";

export default (post: CollectionEntry<"essays">) => {
  const title = smartenPunctuation(post.data.title);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "96px 104px",
        background: OG_COLORS.background,
      }}
    >
      <div
        style={{
          fontFamily: OG_FONT_FAMILY,
          fontWeight: 600,
          fontSize: 72,
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
          color: OG_COLORS.ink,
          textAlign: "center",
          textWrap: "balance",
        }}
      >
        {title}
      </div>
    </div>
  );
};
