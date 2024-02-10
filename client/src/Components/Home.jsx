import React from 'react'
import TextEditor from './TextEditor'
import {Routes,Route} from "react-router-dom"
import Login from './Login'
import Sign from './Sign'
export default function Home() {
  return (
    <div className=' w-screen h-screen'>
      {/* <TextEditor/> */}
      <Routes>
        <Route path="/" exact element={<Login/>}/>
        <Route path="/sign" exact element={<Sign/>}/>
        <Route path={`/editor/:id`} exact element={<TextEditor key={Date.now()} />}/>
      </Routes>
    </div>
  )
}
