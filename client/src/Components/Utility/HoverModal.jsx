import React, { useContext } from "react";
import { context } from "../Context/ContextApi";

export default function HoverModal({ title,toogle,toggleChange,toggleNum,Obj,right }) {
  
  return (
    <div
      className={` absolute mt-10 overflow-hidden flex flex-col items-center text-emerald-200 ${
        toogle[toggleNum] ? "h-[15rem]" : "h-0"
      } w-[25rem] z-50 bg-mainBg shadow-[0_0_0.5rem_#000] transition-all duration-300`} style={{right:`${right}rem`}} onMouseOver={()=>toggleChange(prev=>{return {...prev,toggleNum:true}})} onMouseOut={()=>toggleChange(prev=>{return {...prev,toggleNum:false}})}
    >
      <p className="w-full text-center font-Abel text-2xl mt-2 tracking-wider">
        {title}
      </p>
      <div className="w-[95%] flex-1 bg-slate-200/10 mt-2 rounded-sm px-5 py-3 flex flex-col items-center gap-y-2 border-t-2">
        {Object.keys(Obj).map((e, i) => {
          return (
            <div className="break-words w-full flex" key={i}>
              <div className="w-3/4">
                <span className="font-Comfortaa text-xl text-pink-500">
                  {Obj[e].name}
                </span>
                <span className="mx-2">:</span>
                <span className="font-Comfortaa text-orange-400 ">
                  {e}
                </span>
              </div>
              {Obj[e].admin&&<div className="w-1/4 text-center">
                <span className="text-indigo-300">{Obj[e].admin?"Admin":""}</span>
              </div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
