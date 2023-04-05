/* Import des composants vite */
import { Outlet,Link } from "react-router-dom";

import "./../assets/css/navbar.css"

/* Création et export du composant NavBar */

export default function Navbar(){
    return (
        <>
        <div className="Sc navBar">
                <Link to={"/app/home"}> 
                <div>
                    <img src="../src/assets/img/homeIcon.png"/>
                    <p>Accueil</p>
                </div>
                </Link>
                <Link to={"/app/salle"}>
                <div>
                    <img src="../src/assets/img/salleIcon.png"/>
                    <p>Salles</p>
                </div>
                </Link>
                <Link to={"/app/prof"}>
                <div>
                    <img src="../src/assets/img/profIcon.png"/>
                    <p>Professeurs</p>
                </div>
                </Link>
                <Link to={"/app/directions"}>
                <div>
                    <img src="../src/assets/img/locationIcon.png"/>
                    <p>Itinéraire</p>
                </div>
                </Link>
        </div>
        <Outlet/>
        </>
    )
}