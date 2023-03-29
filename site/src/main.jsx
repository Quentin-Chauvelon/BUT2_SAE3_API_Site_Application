import React from 'react'
import ReactDOM from 'react-dom/client'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Root from "./routes/root";
import Register, {action as registerAction} from "./routes/register"
import Login, {action as loginAction} from "./routes/login"
import Home, {loader as homeLoader} from "./routes/home";
import './assets/css/root.css'
import "./assets/css/home.css"


const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: [
        {
          path: "login",
          element: <Login />,
          action: loginAction,
        },
        {
            path: "register",
            element: <Register />,
            action: registerAction,
        },
      ],
    },
    {
      path: "home",
      element: <Home />,
      loader: homeLoader
    },
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
