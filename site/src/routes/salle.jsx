import {Form, useFetcher, useActionData} from "react-router-dom";
import {formatDateToString, formatStringToDate} from "../main.jsx"


export async function action({ request, params }) {
    const formData = await request.formData();
    let computerRoomsOnly = formData.get("computerRoomsOnly") || false;
    if (computerRoomsOnly == "on") {
        computerRoomsOnly = "true";
    }

    const dateParam = formData.get("roomsDate")
    const date = (dateParam && dateParam != "") ? new Date(formatStringToDate(dateParam)) : new Date();
    
    const roomsResponse = await fetch("http://172.26.82.56:443/rooms/".concat(computerRoomsOnly, "/", formatDateToString(date)));
    const rooms = await roomsResponse.json()
    
    return rooms;
}


export default function Salle() {
    const fetcher = useFetcher()
    
    let rooms = useActionData()
    if (rooms == undefined) {
        rooms = [];
    }
    rooms.sort((room1, room2) => {
        if (room1.name < room2.name) {
            return -1;
        }
        if (room1.name > room2.name) {
            return 1;
        }
        return 0;  
    })
    
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
                    <p className="freeRoom">{rooms.map(room => {return room.name}).join(", ")}</p>
                    {
                        // rooms.map((room, i) => {
                        //     return <p key={i} className="freeRoom">{room.name}</p>
                        // })
                    }
                </div>
            </div>
        </>)
    }