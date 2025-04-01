import type { SVGProps } from "react";

export default function CowIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Cow head */}
      <circle
        cx="50"
        cy="50"
        r="25"
        fill="white"
        stroke="black"
        strokeWidth="4"
      />

      {/* Eyes */}
      <circle cx="40" cy="45" r="5" fill="black" />
      <circle cx="60" cy="45" r="5" fill="black" />

      {/* Nose */}
      <ellipse
        cx="50"
        cy="60"
        rx="10"
        ry="7"
        fill="#FFCC99"
        stroke="black"
        strokeWidth="2"
      />
      <circle cx="45" cy="60" r="2" fill="black" />
      <circle cx="55" cy="60" r="2" fill="black" />

      {/* Ears */}
      <path
        d="M25 40 L15 25 L30 30 Z"
        fill="white"
        stroke="black"
        strokeWidth="2"
      />
      <path
        d="M75 40 L85 25 L70 30 Z"
        fill="white"
        stroke="black"
        strokeWidth="2"
      />

      {/* Horns */}
      <path
        d="M35 30 L25 15 L40 25 Z"
        fill="#F9A03F"
        stroke="black"
        strokeWidth="2"
      />
      <path
        d="M65 30 L75 15 L60 25 Z"
        fill="#F9A03F"
        stroke="black"
        strokeWidth="2"
      />
    </svg>
  );
}
