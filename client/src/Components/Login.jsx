import React, { useContext, useEffect, useState } from "react";
import Leaf from "./Utility/Leaf";
import Heading1 from "./Utility/Heading1";
import FormInput from "./Utility/FormInput";
import Design from "./Utility/Design";
import Loader from "./Utility/Loader"
import { fetchup, generateColors } from "./UtlilityFunc/helper";
import {links} from "../links";
import { useNavigate } from "react-router-dom";
import {v4 as uuidv4} from "uuid"
import { context } from "./Context/ContextApi";

import { socket } from "./UtlilityFunc/socketInit";
export default function Login() {
  const nav=useNavigate()
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const [errors, seterrors] = useState({Email:"",password:""})
  const [load, setload] = useState(false)
  const {setcurrentUsers,currentUsers,colors,setcolorState,onlineUserRef}=useContext(context)
  const doLogin=async(e)=>{
    e.preventDefault()
    seterrors({Email:"",password:""})
    setload(true)
    const url=links.login+`?email=${email}&password=${password}`

    const result=await fetchup(url,"GET")
    if(result.success===1){
      sessionStorage.setItem("name",result.name)
      sessionStorage.setItem("email",result.email)
      sessionStorage.setItem("token",result.token)

      let uuid=uuidv4()
      sessionStorage.setItem("id",uuid)
      onlineUserRef.current={
        [result.email]:{
          name:result.name,
          admin:false,
          Token:result.token,
          cursor:{
            top:0,
            left:0
          }
        }        
      }
      colors.current={
        [result.email]:generateColors()
      }
      setcurrentUsers(onlineUserRef.current)
      setcolorState(colors.current)
      nav(`/editor/${uuid}`)
    }
    else{
      if(result.success===-2){
        seterrors(prev=>{return {...prev,Email:result.error}})
      }
      else if(result.success===-3){
        seterrors(prev=>{return {...prev,password:result.error}})
      }
      else if(result.success===-1){
        if(result.error["email"]){
          seterrors(prev=>{return {...prev,Email:result.error["email"].msg}})
        }
        if(result.error["password"]){
          seterrors(prev=>{return {...prev,password:result.error["password"].msg}})
        }
      }
      else{
        seterrors(prev=>{return {...prev,Email:"Internal Server error"}})
      }
    }
    setload(false)
  }
  useEffect(() => {
    const logout = () => {
      if (sessionStorage.getItem("email")) {
        if (
          sessionStorage.getItem("connected")==="true"
        ) {
          //connected then we have to disconnect
          socket.emit(
            "disconnectRoom",
            sessionStorage.getItem("id"), //url
            sessionStorage.getItem("email"),
            currentUsers
          );
        }
        sessionStorage.clear()

      }
    };
    logout();
  }, []);
  return (
    <div className="h-full w-full scrollbar bg-mainBg flex items-center justify-center">
      <Leaf pos1="top-0" pos2="left-0" rotate="rotate" color="bg-lightBg" />
      <Leaf pos1="bottom-0" pos2="right-0" rotate="rotate" color="bg-lightBg" />
      <Leaf
        pos1="bottom-0"
        pos2="left-0"
        rotate="rotate-90"
        color="bg-lightBg"
      />
      <Leaf pos1="top-0" pos2="right-0" rotate="rotate-90" color="bg-lightBg" />
      <div className="w-[90%] bg-lightBg h-3/4 flex flex-col rounded-3xl shadow-[0_0.5rem_1rem_#000] z-20 p-4">
        <Heading1 title="Welcome Back!!" margin="my-4" />

        <div className="w-full flex flex-1 ">
          <div className="hidden  md:block flex-1 px-4 h-full">
            <Design />
          </div>
          <form className="flex flex-col items-center justify-center gap-y-2 w-full md:w-2/5 h-full " onSubmit={doLogin}>
            <FormInput
              title="Email"
              write="Enter Email address"
              type="email"
              width="w-4/5"
              state={email}
              setstate={setemail}
              ErrorTitle={errors.Email}
            />
            <FormInput
              title="Password"
              write="Enter password"
              type="password"
              width="w-4/5"
              state={password}
              setstate={setpassword}
              ErrorTitle={errors.password}

            />
            <div className="flex justify-between items-center w-4/5 mt-2 text-sm ">
              <span className="font-Quicksand text-green-500 hover:underline hover:underline-offset-3 cursor-pointer" onClick={()=>nav("/sign")}>
                Register?
              </span>
              <button className="bg-white rounded-xl w-16 p-2 h-10 flex items-center justify-center tracking-wider text-red-500 font-Barlow hover:bg-mainBg hover:text-yellow-500">
                LOGIN
              </button>
            </div>
            <div className="h-7 w-10">{load&&<Loader/>}</div>


          </form>
        </div>
      </div>
    </div>
  );
}
