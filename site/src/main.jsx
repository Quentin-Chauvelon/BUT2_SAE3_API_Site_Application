import React from 'react'
import ReactDOM from 'react-dom/client'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Root, {loader as rootLoader} from "./routes/root";
import Register, {action as registerAction} from "./routes/register"
import Login, {action as loginAction} from "./routes/login"
import Home, {loader as homeLoader, action as homeAction} from "./routes/home";
import Navbar from './routes/navbar';
import Salle, {action as salleAction} from './routes/salle';
import Prof , {loader as profLoader} from './routes/prof';
import Directions, {loader as directionsLoader} from "./routes/directions";

import './assets/css/root.css'
import "./assets/css/home.css"

let token = "";
function setToken(tokenToSet) {
  token = tokenToSet
}
export {token, setToken}

let nextCours = {}
function setNextCours(cours) {
  nextCours = cours
}
export {nextCours, setNextCours}


function formatDateToString(date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  
  return date.getFullYear().toString().concat(
      (month > 9 ? '' : '0') + month,
      (day > 9 ? '' : '0') + day,
      "T",
      (hours > 9 ? '' : '0') + hours,
      (minutes > 9 ? '' : '0') + minutes,
      "00000Z"
  )  
}
export {formatDateToString}

function formatStringToDate(stringDate) {
  const [date, time] = stringDate.split("T")
  const [year, month, day] = date.split("-")
  const [hour, minute] = time.split(":")
  
  return new Date(year, month - 1, day, hour, minute, 0)
}
export {formatStringToDate}


const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      loader: rootLoader,
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
      path: "app",
      element: <Navbar />,
      children : [
        {
          path: "home",
          element:<Home/>,
          action: homeAction,
          loader: homeLoader,
          // children: [
          //   {
          //     path: "cours",
          //     element: <Cours/>
          //   }
          // ]
        },
        {
          path: "salle",
          element:<Salle/>,
          action: salleAction
        },
        {
          path: "prof",
          element:<Prof/>,
          loader: profLoader,
        },
        {
          path:"directions",
          element: <Directions/>,
          loader: directionsLoader,
        }
      ],
    },
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <RouterProvider router={router} />
  // </React.StrictMode>,
)