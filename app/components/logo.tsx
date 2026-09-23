"use client";

import { useEffect, useState } from "react";

type LogoProps = {
  size?: number | string;
  color?: string;
  strokeWidth?: number;
};

function useLogoColor(explicit?: string) {
  const [color, setColor] = useState(explicit ?? "#111111");

  useEffect(() => {
    if (explicit) {
      setColor(explicit);
      return;
    }

    const syncColor = () => {
      const isDark = document.documentElement.classList.contains("dark");

      // Professional neutral logo:
      // near-black in light mode, soft white in dark mode
      setColor(isDark ? "#F4F4F5" : "#111111");
    };

    syncColor();

    const observer = new MutationObserver(syncColor);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [explicit]);

  return color;
}

export default function NodeALogo({
  size = 42,
  color: colorProp,
  strokeWidth = 5,
}: LogoProps) {
  const color = useLogoColor(colorProp);

  return (
    <svg
      width={typeof size === "number" ? size : undefined}
      height={typeof size === "number" ? size : undefined}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="WebAIgen Academy"
      preserveAspectRatio="xMidYMid meet"
      style={{
        width: typeof size === "string" ? size : `${size}px`,
        height: typeof size === "string" ? size : `${size}px`,
        display: "block",
        flexShrink: 0,
      }}
    >
      {/* Left side of A */}
      <path
        d="M24 8.5L11.5 37"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Right side of A */}
      <path
        d="M24 8.5L36.5 37"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* A crossbar */}
      <path
        d="M17 27.5H31"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Top node */}
      <circle
        cx="24"
        cy="8.5"
        r="4.5"
        fill={color}
      />

      {/* Bottom-left node */}
      <circle
        cx="11.5"
        cy="37"
        r="4.5"
        fill={color}
      />

      {/* Bottom-right node */}
      <circle
        cx="36.5"
        cy="37"
        r="4.5"
        fill={color}
      />
    </svg>
  );
}