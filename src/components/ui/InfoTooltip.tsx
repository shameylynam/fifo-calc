import * as React from "react";

interface InfoTooltipProps {
  text: string;
  children: React.ReactNode;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ text, children }) => (
  <span style={{ position: "relative", display: "inline-block" }}>
    {children}
    <span
      style={{
        marginLeft: 4,
        cursor: "pointer",
        borderBottom: "1px dotted #888",
      }}
      tabIndex={0}
      title={text}
      aria-label={text}
    >
      ⓘ
    </span>
  </span>
);
