import React, { useContext, useEffect, useState } from "react";
import search from "../Images/search.png";
import remove from "../Images/remove.png";
import reload from "../Images/reload.png";

import LogoSm from "./Utility/LogoSm";

import { links } from "../links";
import { fetchup } from "./UtlilityFunc/helper";
import DataTile from "./Utility/DataTile";
import { context } from "./Context/ContextApi";


export default function OpenPanel({setopen}) {
  const [searchInfo, setsearchInfo] = useState("");
  // const [dataArr, setdataArr] = useState([]);
  const [error, seterror] = useState(null);
  const [load, setLoad] = useState(false)
  const {Data,setData}=useContext(context)
  const FetchData = async () => {
    setLoad(true)
    setData([])
    try {
      const result = await fetchup(links.getData, "GET");
   
      if (result.success === 1) {
        // setdataArr(result.data);
        setData(result.data)
        seterror(null);
      } else {
        if (result.success === -2) {
          seterror("You are not Login");
        } else {
          seterror("Database down or connection error");
        }
      }
    } catch (error) {
      seterror("Try Again later, connection is down");
    }
    setLoad(false)
  };
  const close=()=>{
    setopen(false)
  }
  
  useEffect(() => {
    FetchData();
  }, []);
  const searchFunc=async()=>{
    if(searchInfo===""){
      FetchData()
      return
    }
  
    const result=await fetchup(`${links.search}?val=${searchInfo}`,"GET")

    if(result.success===1){
      setData(result.records)
    }
    else{
      if(result.success===-2){
        seterror(result.msg)
      }
      else{
        seterror("Database down or connection error")
      }
    }
    setLoad(false)
  }
  //search functionality
  useEffect(()=>{
    setLoad(true)
    const stopId=setTimeout(()=>{
      searchFunc()
    },300)
    return()=>{
      
      clearInterval(stopId)
    }
  },[searchInfo])
  return (
    <div className="w-screen h-screen absolute inset-0 z-20 bg-slate-500/70 backdrop-blur-sm flex justify-center items-center">
      {/* Btn to close panel */}
      <button className="absolute top-2 right-2 p-2 bg-slate-800 text-white rounded-lg font-Philosopher text-lg hover:bg-slate-900 hover:text-red-300 transition duration-200" onClick={close}>Close</button>
      <div className="bg-mainBg w-3/4 h-3/4 flex flex-col">
        {/* Nav ki tarah */}
        <div className="w-full h-20 bg-slate-800 flex">
          <div className="w-[40%] h-full bg-slate-600">
            <LogoSm />
          </div>
          <div className="w-[60%] h-full flex justify-center items-center ">
            <img
              src={search}
              alt="search"
              className="w-[10%] scale-75 invert cursor-pointer hover:invert-0"
            />
            <input
              type="input"
              className="w-[75%] h-1/2 text-white focus:text-lightBg indent-2 font-Barlow text-2xl outline-none bg-slate-700 focus:bg-slate-300 transition duration-200"
              value={searchInfo}
              onChange={(e) => setsearchInfo(e.target.value)}
            />
            <img
              src={remove}
              className="w-[5%] scale-75 invert cursor-pointer hover:invert-0 ml-3"
              onClick={() => setsearchInfo("")}
            />
          </div>
        </div>
        {/* Details of your saved data */}
        <div className="scrollbar p-10 flex-1 flex flex-wrap gap-x-20 gap-y-10 border-b-2 border-white">
          {!error &&
            Data.map((val, idx) => {
              return (
                <DataTile
                  key={idx}
                  id={val._id}
                  title={val.title}
                  delta={val.delta}
                  createdAt={val.createdAt}
                  updatedAt={val.updatedAt}
                />
              );
            })}
          {error && (
            <p className="text-2xl m-auto font-Comfortaa text-red-400">
              {error}
            </p>
          )}
        </div>
        <div className="w-full h-[10%]">
          <img
            src={reload}
            alt="reload"
            className={`p-2 float-right h-full invert cursor-pointer ${load&&"animate-rotateAnimate"} transition duration-150 active:rotate-360`}
            onClick={FetchData}
          />
        </div>
      </div>
    </div>
  );
}
