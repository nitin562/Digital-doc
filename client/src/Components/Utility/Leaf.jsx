import React from "react";

export default function Leaf({ pos1, pos2, rotate,color }) {
  return (
    <>
      <div
        className={`absolute ${color}  ${pos1} ${pos2} ${rotate}  w-[10rem] h-[10rem] rounded-[0_90px]`}
      ></div>
    </>
  );
}
