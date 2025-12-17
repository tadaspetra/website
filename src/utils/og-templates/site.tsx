import React from "react";

export default (profileImage: string) => {
  return (
    <div
      style={{
        background: "#ffffff",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 32,
      }}
    >
      <img
        src={profileImage}
        width={100}
        height={100}
        style={{
          borderRadius: 16,
          marginBottom: 36,
          marginRight: 5,
        }}
      />
      <span
        style={{
          fontSize: 96,
          fontFamily: "La Belle Aurore",
          color: "#171717",
        }}
      >
        tadas petra
      </span>
    </div>
  );
};
