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
          display: "flex",
          fontFamily: OG_FONT_FAMILY,
          fontWeight: 600,
          fontSize: 104,
          lineHeight: 1,
          letterSpacing: "-0.025em",
          color: OG_COLORS.ink,
        }}
      >
        <span>T</span>
        {/* Restore Inter Display's pair kerning, which Satori's font parser
            misses: Ta = -223, Pe = -56, ra = -20 (2048 units per em).
            Tighten Ta by another 0.015em for the small social preview. */}
        <span style={{ marginLeft: `${-223 / 2048 - 0.015}em` }}>adas P</span>
        <span style={{ marginLeft: `${-56 / 2048}em` }}>etr</span>
        <span style={{ marginLeft: `${-20 / 2048}em` }}>a</span>
      </span>
    </div>
  );
};
