import {Outlet} from "react-router-dom"

export default function Root() {
    return (
        <>
            <div  className="Infant homeHeader grand">
                <p>MM. ANGOT,</p>
                <p>BLOURDE , CAMCAGNI</p>
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