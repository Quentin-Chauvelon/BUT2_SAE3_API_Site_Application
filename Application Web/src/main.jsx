/* Import Utile pour l'application */

import React from 'react'
import ReactDOM from 'react-dom/client'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

/* Import des différents composants et de leurs fonctions */

import Root from "./routes/root";
import Register, {action as registerAction} from "./routes/register"
import Login, {action as loginAction} from "./routes/login"
import Home, {loader as homeLoader, action as homeAction} from "./routes/home";
import Navbar from './routes/navbar';
import Salle, {action as salleAction} from './routes/salle';
import Prof , {loader as profLoader} from './routes/prof';
import Directions, {loader as directionsLoader} from "./routes/directions";

/* Import des différents css utiles*/

import './assets/css/root.css'
import "./assets/css/home.css"

/* Début du code */

let token = "";                     // Token global
function setToken(tokenToSet) {     
  token = tokenToSet
}
export {token, setToken}            // Export du token et de la fonction pour le set

let nextCours = {}
function setNextCours(cours) {
  nextCours = cours
}
export {nextCours, setNextCours}


export const baseUrl = "http://172.26.82.56:443" // Initialisation de l'ip de l'API

function formatDateToString(date) {             // Fonction qui convertit une date format Date en date format String
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
export {formatDateToString}                   // Export de la fonction formatDateToString

function formatStringToDate(stringDate) {    // Fonction qui convertit une date format String en date format Date
  const [date, time] = stringDate.split("T")
  const [year, month, day] = date.split("-")
  const [hour, minute] = time.split(":")
  
  return new Date(year, month - 1, day, hour, minute, 0)
}
export {formatStringToDate}               // Export de la fonction formatStringToDate


/* Création du routeur */

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