import React, { useContext, useState } from 'react'
import MenuBtn from './MenuBtn'
import {v4 as uuidb4} from "uuid"
import OpenPanel from '../OpenPanel'
import { context } from '../Context/ContextApi'
import { origin } from '../../links'


export default function Menu() {
  const {SaveFunc}=useContext(context)
  const [open, setopen] = useState(false)
  const openBtnFunc=()=>{
    setopen(prev=>!prev)
  }
  const NewBtnFunction=()=>{
    let uid=uuidb4()
    const url="/editor/"+uid
    const newTab=window.open(url,"_blank")
    newTab.sessionStorage.removeItem("SavedDocID")
    
  }
  const SaveBtnFunc=async()=>{
  
    const result=await SaveFunc()
    console.log(result)
    if(result.success===1){
      if(!sessionStorage.getItem("SavedDocID")){
        sessionStorage.setItem("SavedDocID",result.SaveRecord._id)
      }
      
      alert("Saved")
    }
    else{
      alert("Not Saved")
    }
  }
 
  return (
    <div className='w-full h-full flex'>
        <MenuBtn title="File" NewBtn={NewBtnFunction} openBtn={openBtnFunc} SaveBtnFunc={SaveBtnFunc} />
        {open&&<OpenPanel setopen={setopen} />}
        {/* <MenuBtn title="Edit"/>
        <MenuBtn title="About"/>         */}
    </div>
  )
}
