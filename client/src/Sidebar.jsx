import { Link } from "react-router-dom";
import { menu_fill } from "./assets";
import { useState } from "react";
import logo from '/logo.png'





const Sidebar = () => {

    const [menu, setMenu] = useState(false)

  return (
    <div className="p-6">
        {!menu && (
            <div className="m-4">
        <button onClick={() => setMenu(!menu)}>
            <img src={menu_fill} className=" h-6"/>
        </button>
        </div>
        )}
        {menu && ( 
        <div className=" bg-base-200 h-full bg-opacity-90 rounded-2xl p-6">
        <button onClick={() => setMenu(!menu)}>
            <img src={menu_fill} className=" h-6"/>
        </button>
        <div className="flex flex-col justify-center items-center mx-12">
        <img src={logo} className=" h-10 mt-4 mb-10"/>
        <div className="flex flex-col items-center space-y-5 text-gray-400">
            <Link to="/">Scan Files</Link>
            <Link to="/">Meet the Team</Link>
        </div>
        </div>
        </div>
        )}
    </div>
  )
}

export default Sidebar