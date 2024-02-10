import React from 'react'

export default function Modal1({Ques,ok,cancel}) {
  const onclickOk=()=>{
    if(ok && ok.current){
      ok.current()
    }
    
  }
  const onClickCancel=()=>{
    if(cancel && cancel.current){
      cancel.current()
    }
   
  }
  return (
    <div className='w-[30rem] h-[15rem] absolute z-50 bg-orange-950/30 backdrop-blur-xl top-0 rounded-xl p-8'>
        <p className='font-Quicksand w-full text-3xl text-center text-emerald-400 drop-shadow-[0_0_0.5rem_green] tracking-wider'>{Ques}</p>
        <div className='w-1/2 m-auto mt-12 flex justify-between'>
            <button className='text-xl font-Comfortaa text-red-500 bg-slate-700/50 rounded-full p-2' onClick={onClickCancel}>Cancel</button>
            <button className='text-xl font-Comfortaa text-blue-500 bg-slate-700/50 rounded-full p-2' onClick={onclickOk}>OK</button>
        </div>
    </div>
  )
}
