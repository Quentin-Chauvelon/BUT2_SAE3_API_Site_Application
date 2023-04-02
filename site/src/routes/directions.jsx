import {Form, useLoaderData, useActionData, useSubmit} from "react-router-dom"
import {token} from "../main.jsx"
import '../assets/css/directions.css'


export async function action({ request, params }) {
    const formData = await request.formData();

    const departureAddress = formData.get("departure");

    if (token != "" && departureAddress != "") {
        await fetch("http://172.26.82.56:443/user/favoriteAddress", {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: token,
                favoriteAddress: departureAddress
            })
        });
    }

    return departureAddress;
}


export async function loader({ request }) {
    let loaderFavoriteAddress = "";
    let selectedTransitMode = "";

    const url = new URL(request.url);
    loaderFavoriteAddress = url.searchParams.get("favoriteAddress") || "";
    selectedTransitMode = url.searchParams.get("transitMode")

    if (selectedTransitMode == null) {
        selectedTransitMode = "transit";

        if (token != "") {
            const favoriteAddressResponse = await fetch("http://172.26.82.56:443/user/favoriteAddress/".concat(token))
            const favoriteAddressJson = await favoriteAddressResponse.json()
            
            if (favoriteAddressJson.favoriteAddress) {
                loaderFavoriteAddress = favoriteAddressJson.favoriteAddress;
            }

            const selectedTransitModeResponse = await fetch("http://172.26.82.56:443/user/favoriteTransitMode/".concat(token))
            const selectedTransitModeJson = await selectedTransitModeResponse.json()
            
            if (selectedTransitModeJson.favoriteTransitMode) {
                selectedTransitMode = selectedTransitModeJson.favoriteTransitMode;
            }
        }
    }

    console.log("http://172.26.82.56:443/directions/" + loaderFavoriteAddress + "/" + "tard" + "/" + selectedTransitMode);

    return {loaderFavoriteAddress, selectedTransitMode}
}


export default function Directions() {
    const {loaderFavoriteAddress, selectedTransitMode} = useLoaderData();
    let departureAddress = useActionData();
    const favoriteAddress = departureAddress || loaderFavoriteAddress
    
    const submit = useSubmit()

    const cours = {
        start: new Date()
    }

    // TODO: replace bus/tram by div with the color of the line and the line name (ex : C1)
    // change dot and line icons color to match the bus line color
    // replace duration on the left with time if not done already
   
    const response = null;

    return (
        <div className="directions">
            <div className="directions_details">
                <Form method="post">
                    <div className="origin_container">
                        <p>Départ : </p>
                        <input type="text" name="departure" id="departure" placeholder={favoriteAddress}/>
                    </div>
                    
                    <div className="arrival_time">
                        <p>Arrivée à : {cours.start.getHours() + ":" + cours.start.getMinutes()}</p>
                    </div>

                    <div className="search">
                        <button type="submit">Rechercher</button>
                    </div>
                </Form>
            </div>

            <div className="directions_container">
                <div className="directions_steps">

                    <div className="transit_mode">
                        <Form id="transitMode" role="search">
                            <div className={(selectedTransitMode == "transit") ? "transit_mode_selected" : ""}>
                                <img src="../src/assets/img/bus.png" id="transit" alt="bus" onClick={(event) => {
                                    let formData = new FormData();
                                    formData.append("favoriteAddress", favoriteAddress);
                                    formData.append("transitMode", "transit");
                                    submit(formData);
                                }}/>
                            </div>

                            <div className={(selectedTransitMode == "bicycling") ? "transit_mode_selected" : ""}>
                                <img src="../src/assets/img/bike.png" alt="vélo" onClick={(event) => {
                                    let formData = new FormData();
                                    formData.append("favoriteAddress", favoriteAddress);
                                    formData.append("transitMode", "bicycling");
                                    submit(formData);
                                }}/>
                            </div>

                            <div className={(selectedTransitMode == "walking") ? "transit_mode_selected" : ""}>
                                <img src="../src/assets/img/pedestrian.png" alt="marche" onClick={(event) => {
                                    let formData = new FormData();
                                    formData.append("favoriteAddress", favoriteAddress);
                                    formData.append("transitMode", "walking");
                                    submit(formData);
                                }}/>
                            </div>

                            <div className={(selectedTransitMode == "driving") ? "transit_mode_selected" : ""}>
                                <img src="../src/assets/img/car.png" alt="voiture" onClick={(event) => {
                                    let formData = new FormData();
                                    formData.append("favoriteAddress", favoriteAddress);
                                    formData.append("transitMode", "driving");
                                    submit(formData);
                                }}/>
                            </div>
                        </Form>
                    </div>

                    <div className="steps_container">
                        <p className="duration">{(response != null && response.routes && response.routes.length > 0 && response.routes[0].legs && response.routes[0].legs.length > 0) ? "Durée totale : " + response.routes[0].legs[0].duration.text : "Veuillez choisir une adresse de départ"}</p>

                            {
                              (response != null && response.routes && response.routes.length > 0 && response.routes[0].legs && response.routes[0].legs.length > 0)
                              
                              ? response.routes[0].legs[0].steps.map((step, i) => {

                                    const departureDate = new Date(response.routes[0].legs[0].departure_time.value * 1000)
                                    const arrivalDate = new Date(response.routes[0].legs[0].arrival_time.value * 1000)
                                    const departureTime = ((departureDate.getHours() > 9) ? "" : "0") + departureDate.getHours() + ":" + ((departureDate.getMinutes() > 9) ? "" : "0") + departureDate.getMinutes()
                                    const arrivalTime = ((arrivalDate.getHours() > 9) ? "" : "0") + arrivalDate.getHours() + ":" + ((arrivalDate.getMinutes() > 9) ? "" : "0") + arrivalDate.getMinutes()


                                    // currentTime.setTime(currentTime.getTime() + step.duration.value * 1000);
                                    // const hours = currentTime.getHours();
                                    // const minutes = currentTime.getMinutes();
                                    // const time = ((hours > 9) ? "" : "0").concat(hours.toString(), ":", ((minutes > 9) ? "" : "0"), minutes.toString());

                                    if (step.travel_mode == "WALKING") {
                                        return ([
                                            (i == 0)
                                                ? <div className="departure_details">
                                                      <p className="departure_time">{departureTime}</p>
                                                      <div className="stop_icon"></div>
                                                      <p className="departure_position">{response.routes[0].legs[0].start_address}</p>
                                                </div>
                                                : null,

                                            <div className="step_details">
                                                <div className="icon_container">
                                                    <img src="../src/assets/img/pedestrian.png" alt=""/>
                                                </div>
                
                                                <div className="stop_line dotted"></div>
                
                                                <div className="transit_details">
                                                   <p className="step_transit_mode">Marche</p>
                                                   <p className="step_distance">{step.distance.text}</p>
                                                   <p className="step_time">{step.duration.text}</p>
                                                </div>
                                            </div>,

                                            (i == response.routes[0].legs[0].steps.length - 1)
                                                ? <div className="departure_details">
                                                      <p className="departure_time">{arrivalTime}</p>
                                                   <div className="stop_icon"></div>
                                                   <p className="departure_position">{response.routes[0].legs[0].end_address}</p>
                                                </div>
                                                : null
                                        ])
                                    } 

                                    else if (step.travel_mode == "BICYCLING") {
                                        return ([
                                            (i == 0)
                                                ? <div className="departure_details">
                                                      <p className="departure_time">{departureTime}</p>
                                                      <div className="stop_icon"></div>
                                                      <p className="departure_position">{response.routes[0].legs[0].start_adress}</p>
                                                </div>
                                                : null,

                                            <div className="step_details">
                                                <div className="icon_container">
                                                    <img src="../src/assets/img/pedestrian.png" alt=""/>
                                                </div>
                
                                                <div className="stop_line dotted"></div>
                
                                                <div className="transit_details">
                                                    <p className="step_transit_mode">Vélo</p>
                                                    <p className="step_distance">{step.distance.text}</p>
                                                    <p className="step_time">{step.duration.text}</p>
                                                </div>
                                            </div>,

                                            (i == response.routes[0].legs[0].steps.length - 1)
                                                ? <div className="departure_details">
                                                      <p className="departure_time">{arrivalTime}</p>
                                                      <div className="stop_icon"></div>
                                                      <p className="departure_position">{response.routes[0].legs[0].end_address}</p>
                                                </div>
                                                : null
                                        ])
                                    }

                                    else if (step.travel_mode == "TRANSIT") {
                                       const stepDepartureDate = new Date(step.transit_details.departure_time.value * 1000)
                                       const stepArrivalDate = new Date(step.transit_details.arrival_time.value * 1000)
                                       const stepDepartureTime = ((stepDepartureDate.getHours() > 9) ? "" : "0") + stepDepartureDate.getHours() + ":" + ((stepDepartureDate.getMinutes() > 9) ? "" : "0") + stepDepartureDate.getMinutes()
                                       const stepArrivalTime = ((stepArrivalDate.getHours() > 9) ? "" : "0") + stepArrivalDate.getHours() + ":" + ((stepArrivalDate.getMinutes() > 9) ? "" : "0") + stepArrivalDate.getMinutes()

                                       return ([
                                          <div className="departure_details">
                                             <p className="departure_time">{stepDepartureTime}</p>
                                             <div className="stop_icon" style={{border: "5px solid " + step.transit_details.line.color}}></div>
                                             <p className="departure_position">{step.transit_details.departure_stop.name}</p>
                                          </div>,

                                          <div className="step_details">
                                             <div className="icon_container">
                                                <img src="../src/assets/img/bus.png" alt=""/>
                                             </div>
               
                                             <div className="stop_line" style={{borderRight: "5px solid " + step.transit_details.line.color}}></div>
               
                                             <div className="transit_details">
                                                <div className="line_name" style={{backgroundColor: step.transit_details.line.color, color: step.transit_details.line.text_color}}>{step.transit_details.line.short_name}</div>
                                                <p className="step_distance">{step.distance.text}</p>
                                                <p className="step_time">{step.duration.text + " (" + step.transit_details.num_stops + " arrêts)"}</p>
                                             </div>
                                          </div>,

                                          <div className="departure_details">
                                             <p className="departure_time">{stepArrivalTime}</p>
                                             <div className="stop_icon" style={{border: "5px solid " + step.transit_details.line.color}}></div>
                                             <p className="departure_position">{step.transit_details.arrival_stop.name}</p>
                                          </div>
                                       ])
                                    }
                                })
                              : null
                            // <div className="departure_details">
                            //     <p className="departure_time">08:14</p>
                            //     <div className="stop_icon"></div>
                            //     <p className="departure_position">Rue Maréchal Joffre</p>
                            // </div>

                            // <div className="step_details">
                            //     <div className="icon_container">
                            //         <img src="../src/assets/img/pedestrian.png" alt=""/>
                            //     </div>

                            //     <div className="stop_line"></div>

                            //     <div className="transit_details">
                            //         <p className="step_transit_mode">Marche</p>
                            //         <p className="step_distance">18m</p>
                            //         <p className="step_time">01 min</p>
                            //     </div>
                            // </div>

                            // <div className="departure_details">
                            //     <p className="departure_time">08:14</p>
                            //     <div className="stop_icon"></div>
                            //     <p className="departure_position">Rue Maréchal Joffre</p>
                            // </div>
                            }
                        
                    </div>
                </div>
            </div>
        </div>
    )
}