import React, { useState } from "react";

export default function MenuBtn({ title,NewBtn,openBtn,SaveBtnFunc,download }) { 
    const [toogle, settoogle] = useState(false)
    const clickbtn=()=>{
        settoogle(prev=>!prev)
    }
  return (
    <div className="z-20" onMouseOver={()=>settoogle(true)} onMouseOut={()=>settoogle(false)}>
      <div className="w-fit h-full text-white  px-2 flex items-center justify-center cursor-pointer font-Barlow border-2 border-transparent hover:bg-slate-400 hover:text-black">
        {title}
      </div>
      <div className={`w-[10rem] h-fit absolute ml-2 bg-white text-black shadow-[0_0.2rem_1rem_#000] ${toogle?"block":"hidden"}`}  onMouseOver={()=>settoogle(true)} onMouseOut={()=>settoogle(false)}>
        <p className=" px-2 py-1 font-Barlow hover:bg-slate-200 cursor-pointer" onClick={NewBtn} >New</p>
        <p className=" px-2 py-1 font-Barlow hover:bg-slate-200 cursor-pointer" onClick={openBtn}>Open</p>
        <p className=" px-2 py-1 font-Barlow hover:bg-slate-200 cursor-pointer" onClick={SaveBtnFunc}>Save</p>
        
      </div>
    </div>
  );
}
