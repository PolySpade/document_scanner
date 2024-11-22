import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  return (
    <div className='flex justify-center flex-col'>
      <div>
        ScanPro
      </div>
      <div>
        Crop your documents at the click of a button!
      </div>
      
      <div className='flex p-10 justify-center flex-col bg-base-300 rounded-xl'>
        <p>Drag your image file here</p>
        <p>OR</p>
        <p className=' font-bold text-lg '>Upload your image file here</p>

      </div>
  </div>
  )
}

export default App
