import React from 'react'
import Leaf from './Leaf'

export default function Design() {
  return (
    <div className={`w-full h-full  flex items-center justify-center `}>
        <Leaf color="bg-white/10" rotate="rotate-90"/>
        <span className='text-4xl mr-8 font-Bruno_Ace_SC text-pink-400 bg-black p-3'>DIGITAL</span>
        <span className='text-4xl font-Bruno_Ace_SC text-white '>DOCS</span>
    </div>
  )
}
