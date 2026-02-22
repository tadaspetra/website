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
        width={200}
        height={200}
        style={{
          borderRadius: 16,
        }}
      />
      <span
        style={{
          fontSize: 96,
          fontFamily: "Fraunces",
          color: "#171717",
        }}
      >
        Tadas Petra
      </span>
    </div>
  );
};
