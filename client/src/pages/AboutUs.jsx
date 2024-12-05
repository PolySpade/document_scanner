import React from 'react'
import logo from '/logo.png'
import { Cheng_Ken, Donald_Xu, Hanna_De_Los_Santos,Jersey_To,Shanette_Presas } from '../assets/member_photos'

const AboutUs = () => {
  return (
    <div className='flex justify-center items-center flex-col'>
              <div className="flex justify-center">
        <img src={logo} className="h-20" />
      </div>
      <div className='mt-8 text-white font-medium text-3xl'>
        Meet the Team Behind ScanPro
      </div>
      <div className='mt-8 flex justify-center space-x-52'>
        <div>
            <div className='border-0 rounded-full h-48 w-48 bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center'>
                <div className='border-0 overflow-clip rounded-full h-40 w-40 bg-white'>
                    <img src={Donald_Xu}/>
                </div>
            </div>
            <div className='flex justify-center font-bold text-lg mt-3'>
                Donald Xu
            </div>
        </div>
        <div>
            <div className='border-0 rounded-full h-48 w-48 bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center'>
                <div className='border-0 overflow-clip rounded-full h-40 w-40 bg-white'>
                    <img src={Cheng_Ken}/>
                </div>
            </div>
            <div className='flex justify-center font-bold text-lg mt-3'>
                Ken Cheng
            </div>
        </div>
        <div>
            <div className='border-0 rounded-full h-48 w-48 bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center'>
                <div className='border-0 overflow-clip rounded-full h-40 w-40 bg-white'>
                    <img src={Shanette_Presas} className='mb-11'/>
                </div>
            </div>
            <div className='flex justify-center font-bold text-lg mt-3'>
                Shanette Presas
            </div>
        </div>
      </div>
      <div className='flex justify-center flex-row space-x-52'>  
      <div>
            <div className='border-0 rounded-full h-48 w-48 bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center'>
                <div className='border-0 overflow-clip rounded-full h-40 w-40 bg-white'>
                    <img src={Hanna_De_Los_Santos} className='mb-11'/>
                </div>
            </div>
            <div className='flex justify-center font-bold text-lg mt-3'>
                Hanna De Los Santos
            </div>
        </div>
        <div>
            <div className='border-0 rounded-full h-48 w-48 bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center'>
                <div className='border-0 overflow-clip rounded-full h-40 w-40 bg-white'>
                    <img src={Jersey_To} className='mb-11'/>
                </div>
            </div>
            <div className='flex justify-center font-bold text-lg mt-3'>
                Jersey To
            </div>
        </div>
      </div>
        
    </div>
  )
}

export default AboutUs