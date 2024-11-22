import { Outlet } from "react-router-dom"
import Sidebar from "../Sidebar"

const Layout = () => {
  return (
    <div className="flex">
        <div className="flex h-screen absolute"> 
        <Sidebar/>
        </div>
        <div className="flex flex-1 h-screen justify-center items-center">
        <div className="flex-1 justify-center items-center">
            <Outlet/>
        </div>
        </div>

    </div>
  )
}

export default Layout
