import React from 'react'
import ReactDOM from 'react-dom/client'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Root from "./routes/root";
import Register, {action as registerAction} from "./routes/register"
import Login, {action as loginAction} from "./routes/login"
import Home, {loader as homeLoader, action as homeAction} from "./routes/home";
import Navbar from './routes/navbar';
import Salle from './routes/salle';
import Prof , {loader as profLoader} from './routes/prof';

import './assets/css/root.css'
import "./assets/css/home.css"
import "./assets/css/salle.css"
import "./assets/css/navbar.css"
import "./assets/css/prof.css"

let token = "";
function setToken(tokenToSet) {
  token = tokenToSet
}
export {token, setToken}


const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: [
        {
          path: "",
          element: <Login />,
          action: loginAction,
        },
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
      path: "app",
      element: <Navbar />,
      children : [
        {
          path: "home",
          element:<Home/>,
          action: homeAction,
          loader: homeLoader,
        },
        {
          path: "salle",
          element:<Salle/>,
        },
        {
          path: "prof",
          element:<Prof/>,
          loader: profLoader,
        },
        {
          path:"iteneraire",
        }
      ],
    },
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)