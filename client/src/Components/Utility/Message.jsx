import React from 'react'

export default function Message() {
  return (
    <div className='min-w-[25rem] min-h-[15rem] absolute top-0 left-[35%] z-10 bg-slate-700 flex flex-col items-center'>
        <p className='text-3xl my-3 text-emerald-300 font-thin'>nitin@gmail.com</p>
        <p className='text-xl tracking-wide font-Comfortaa my-3 first-letter:text-pink-500 '>Want to Connect</p>
        <div className='w-3/4 mt-8 flex justify-between'>
            <button className='p-2 bg-slate-300 text-black rounded-md font-Amaranth hover:bg-zinc-950 hover:text-white '>Allow</button>
            <button className='p-2 bg-slate-300 text-black rounded-md font-Amaranth hover:bg-zinc-950 hover:text-white'>Not Allow</button>
        </div>
    </div>
  )
}
