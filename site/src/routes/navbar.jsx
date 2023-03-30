import { Outlet,Link } from "react-router-dom";

export default function Navbar(){
    return (
        <>
        <div className="Sc navBar">
                <Link to={"/home"}>
                <div>
                    <img src="../src/assets/img/homeIcon.png"/>
                    <p>Accueil</p>
                </div>
                </Link>
                <Link to={"/home/salle"}>
                <div>
                    <img src="../src/assets/img/salleIcon.png"/>
                    <p>Salles</p>
                </div>
                </Link>
                <Link to={"/home/prof"}>
                <div>
                    <img src="../src/assets/img/profIcon.png"/>
                    <p>Professeurs</p>
                </div>
                </Link>
                <Link to={"/home/iteneraire"}>
                <div>
                    <img src="../src/assets/img/locationIcon.png"/>
                    <p>Itinéraire</p>
                </div>
                </Link>
        </div>
        <Outlet/>
        <div className="homeFooter">
            <img src="../src/assets/img/univ.png"/>
        </div>
        </>
    )
}