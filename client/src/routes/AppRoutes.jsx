import React from 'react'
import Landing from '../pages/Landing'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Layout'
import AboutUs from '../pages/AboutUs'

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "", 
                element: <Landing />
            },
            {
                path:"about",
                element:<AboutUs/>
            }
        ]
    }


])

const AppRoutes = () => {
    return <RouterProvider router={router}/>
}

export default AppRoutes