import React from "react";
import document from "../../Images/google-docs.png";
import {v4 as uuidv4} from "uuid"
import { links, origin } from "../../links";
import { fetchup } from "../UtlilityFunc/helper";
export default function DataTile({ id, title, delta, createdAt, updatedAt }) {
  const clickOnTitle=()=>{
    let uid=uuidv4()
    const newTab=window.open(`${origin}/editor/${uid}`)
    newTab.onload=async()=>{

      newTab.postMessage({dataId:id},origin)
    }
  }
  
  return (
    
    <div className="w-[8rem] h-[10rem] flex flex-col items-center p-2 gap-y-4 bg-blue-300 cursor-pointer hover:bg-green-400 transition duration-200 group" onClick={clickOnTitle}>
      <img className="w-[6rem] h-[6rem] group-hover:scale-105 transition duration-200" src={document} alt="fileTile"></img>
      <p className="whitespace-nowrap text-2xl font-bold text-lightBg font-Abel ">{ title.length>11?`${title.slice(0,9)}...`:title}</p>
    </div>
  );
}
