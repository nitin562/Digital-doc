import React from "react";

export default function Modal2({ statement, ok }) {
  return (
    <div className="w-[30rem] h-[15rem] absolute z-50 bg-slate-900/50 backdrop-blur-xl top-0 rounded-xl p-8">
      <p className="font-Barlow w-full text-2xl text-center text-green-200 drop-shadow-[0_0_0.5rem_green] tracking-wider">
        {statement}
      </p>
      <div className="w-1/2 m-auto mt-12 flex justify-center">
        <button
          className="text-xl font-Comfortaa text-blue-500 bg-slate-700/50 rounded-full p-2"
          onClick={ok.current}
        >
          OK
        </button>
      </div>
    </div>
  );
}
