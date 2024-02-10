import React, { useContext, useEffect, useState } from "react";
import docsImg from "../Images/google-docs.png";
import Menu from "./Utility/Menu";
import ConnectorToDocs from "./Utility/ConnectorToDocs";
import { context } from "./Context/ContextApi";
import { socket } from "./UtlilityFunc/socketInit";
export default function Nav() {
  
  const { currentData, getTitle,title,settitle,onlineUserRef } = useContext(context);
  useEffect(() => {
    if (!currentData) {
      return;
    }
    settitle(currentData.title);
  }, [currentData]);
  const changeTitle=(title)=>{
    settitle(title)
    getTitle.current=title
  }
  useEffect(()=>{
    socket.on("titleChanged",changeTitle)
  },[socket])
  return (
    <div className="w-full h-16 flex items-center z-50  ">
      <img src={docsImg} alt="logo" className="w-8 h-8 mx-1" />
      <div className="flex-1 h-full flex flex-col">
        <div className="w-full h-1/2  flex items-center justify-between ">
          <input
            type="text"
            className="min-w-[1px] mx-2 bg-transparent  outline-none border-2 border-transparent hover:border-white font-AR_One_Sans hover:rounded-sm "
            value={title}
            onChange={(e) => {
              if(sessionStorage.getItem("connected")==="true"&&onlineUserRef.current[sessionStorage.getItem("email")].admin===false){return}

              settitle(e.target.value);
              socket.emit("title-change",e.target.value,sessionStorage.getItem("id"))
              getTitle.current = e.target.value;
            }}
          />
          <ConnectorToDocs />
        </div>
        <div className="w-full h-1/2">
          <Menu title={title} />
        </div>
      </div>
    </div>
  );
}
