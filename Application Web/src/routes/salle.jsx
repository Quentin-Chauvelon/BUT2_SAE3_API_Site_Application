/* Import des composants vite et de leurs méthodes,
   des fonctions de convertion de date et de baseUrl
*/

import {Form, useFetcher, useActionData} from "react-router-dom";
import {formatDateToString, formatStringToDate,baseUrl} from "../main.jsx"
import "./../assets/css/salle.css"

/* Définition de la function action*/

export async function action({ request, params }) {

    /* Récupération des données du Form */
    const formData = await request.formData();
    let computerRoomsOnly = formData.get("computerRoomsOnly") || false;
    if (computerRoomsOnly == "on") {
        computerRoomsOnly = "true";
    }

    const dateParam = formData.get("roomsDate")         
    const date = (dateParam && dateParam != "") ? new Date(formatStringToDate(dateParam)) : new Date();
    
    /* Requête sur l'api pour recevoir les salles disponible avec les paramètres du form */
    const roomsResponse = await fetch(baseUrl+"/rooms/".concat(computerRoomsOnly, "/", formatDateToString(date)));
    const rooms = await roomsResponse.json()
    return {rooms};
}


/* Création et export du composant Salle */

export default function Salle() {
    // Variables utiles au composant
    let rooms = []
    let alreadySearched = false;
    let i = 0                       

    // Fonction pour récupérer les données renvoyé par action()
    const actionData = useActionData()

    // re-Définision des variables
    if (actionData) {
        rooms = actionData.rooms;
        alreadySearched = true;
    }
    
    // Tri des salles de cours
    rooms.sort((room1, room2) => {
        if (room1.name < room2.name) {
            return -1;
        }
        if (room1.name > room2.name) {
            return 1;
        }
        return 0;  
    })
    
    /* Affichage du composant */

    return (
        <>
            <div className="rechercheSalle">
                <p className="Sc grand">&nbsp;Service de recherche de Salles&nbsp;</p>
                <div className="barreRecherche">
                    <Form method="post">
                        <button className="Sc">Recherche des Salles disponibles</button>
                        
                        <div className="switch-holder">
                            <div className="switch-label">
                                <span className="Sc">Info</span>
                            </div>

                            <div className="switch-toggle">
                                <input name="computerRoomsOnly" type="checkbox" id="informatique"/>
                                <label htmlFor="informatique"></label>
                            </div>
                        </div>

                        <input className="Sc dateInput" type="datetime-local" id="roomsDate" name="roomsDate" />
                    </Form>
                    
                    <p className="Sc">Les salles disponibles sont : </p>
                    
                    {
                        (alreadySearched)
                            ? (rooms.length > 0)
                                /* Affichage dynamique des salles */
                                ? <div className="Sc profEdt">{rooms.map(room => {
                                    if (room.computerRoom==true) {
                                        room.computerRoom=<img src="../src/assets/img/iconOrdi.png"/>
                                    } else if (room.computerRoom==false) {
                                        room.computerRoom=<img src="../src/assets/img/devoirIcon.png"/>
                                    } 
                                    return <div className="card2" key={i=i+1}><br/>{room.name}<br/><br/>{(room.computerRoom)}</div>})}</div>
                                : <p id="Vide" className="Sc">{"Il n'y a aucune salle de libre :("}</p>
                            : null
                    }
                </div>
            </div>
        </>)
    }