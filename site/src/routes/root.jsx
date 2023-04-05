/* Import des composants vite et de leurs méthodes*/

import {Outlet, useLocation, useSubmit} from "react-router-dom"

/* Création et export du composant Root */

export default function Root() {
    // Redirection en cas de mauvaise url
    const submit = useSubmit()
    const location = useLocation();
    if (location.pathname == "/") {
        submit(null, {action: "/login"})
    }

    return (
        <>
            <div  className="Infant homeHeader grand">
                <p>MM. ANGOT,</p>
                <p>BLOURDE , CALCAGNI</p>
                <p>CHAUVELON & OSSELIN</p>
                <p className="Sc headerP">Sont Heureux de vous présenter</p>
            </div>

            <div>
                <p className="Sc titre">ScheduleTrack Nantes</p>
                <div className="barre-h"></div>
                <Outlet/>
            </div>

            <div className="homeFooter">
                <img src="../src/assets/img/univ.png"/>
            </div>

        </>
        );
    }