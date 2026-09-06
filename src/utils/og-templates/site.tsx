import React from "react";
import { OG_COLORS, OG_FONT_FAMILY } from "./theme";

export default () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: OG_COLORS.background,
      }}
    >
      <span
        style={{
          fontFamily: OG_FONT_FAMILY,
          fontWeight: 600,
          fontSize: 104,
          lineHeight: 1,
          letterSpacing: "-0.025em",
          color: OG_COLORS.ink,
        }}
      >
        Tadas Petra
      </span>
    </div>
  );
};
