import type { CollectionEntry } from "astro:content";
import React from "react";

export default (post: CollectionEntry<"essays">, profileImage: string) => {
  return (
    <div
      style={{
        background: "#ffffff",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px 80px",
        position: "relative",
      }}
    >
      <p
        style={{
          fontSize: 96,
          fontFamily: "Fraunces",
          color: "#171717",
          lineHeight: 1.2,
          maxWidth: "95%",
        }}
      >
        {post.data.title}
      </p>

      <img
        src={profileImage}
        width={100}
        height={100}
        style={{
          borderRadius: 12,
          position: "absolute",
          bottom: 50,
          right: 80,
        }}
      />
    </div>
  );
};
