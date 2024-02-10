import React from "react";

export default function Heading1({ title, margin }) {
  return (
    <div className={`w-full ${margin}`}>
      <div
        className={`w-full first-letter:text-yellow-600 font-Quicksand text-3xl text-white text-center tracking-wide `}
      >
        {title}
      </div>
      <div className="w-4/5 h-[0.1rem] bg-white rounded-full m-auto mt-2"></div>
    </div>
  );
}
