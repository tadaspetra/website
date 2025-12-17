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
          fontSize: 96,
          fontFamily: "La Belle Aurore",
          color: "#171717",
          lineHeight: 1.2,
          marginTop: 50,
          maxWidth: "95%",
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
            fontSize: 48,
            fontFamily: "La Belle Aurore",
            color: "#525252",
            marginTop: 16,
          }}
        >
          tadas petra
        </span>
      </div>
    </div>
  );
};
