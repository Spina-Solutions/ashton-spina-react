import React from "react";

type FlagIconProps = {
  code: string;
  width?: number;
  height?: number;
};

export function FlagIcon({ code, width = 18, height = 12 }: FlagIconProps) {
  const label = (code || "").toUpperCase().slice(0, 2) || "--";
  const style: React.CSSProperties = {
    width,
    height,
    borderRadius: 4,
    fontSize: Math.max(8, Math.floor(height * 0.7)),
    lineHeight: `${height}px`,
  };

  return (
    <span
      className={"inline-flex items-center justify-center bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold"}
      style={style}
      aria-label={`Flag ${label}`}
    >
      {label}
    </span>
  );
}


