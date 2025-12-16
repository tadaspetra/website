import type { CollectionEntry } from "astro:content";
import React from "react";

export default (post: CollectionEntry<"posts">, profileImage: string) => {
  return (
    <div
      style={{
        background: "#ffffff",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "60px 80px",
      }}
    >
      {/* Title */}
      <p
        style={{
          fontSize: 64,
          fontFamily: "La Belle Aurore",
          color: "#171717",
          lineHeight: 1.2,
          margin: 0,
          maxWidth: "85%",
        }}
      >
        {post.data.title}
      </p>

      {/* Footer with image and name */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        <img
          src={profileImage}
          width={56}
          height={56}
          style={{
            borderRadius: 8,
          }}
        />
        <span
          style={{
            fontSize: 28,
            fontFamily: "La Belle Aurore",
            color: "#525252",
          }}
        >
          tadas petra
        </span>
      </div>
    </div>
  );
};
