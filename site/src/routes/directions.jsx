import {Form, useLoaderData, useSubmit} from "react-router-dom"
import {token, nextCours, setNextCours,baseUrl} from "../main.jsx"
import '../assets/css/directions.css'
import {GoogleMap, LoadScript, Polyline, Marker} from '@react-google-maps/api';
import decodePolyline from "decode-google-map-polyline"

export async function loader({ request }) {
   let loaderFavoriteAddress = "";
   let selectedTransitMode = "";

   // On récupère l'adresse et le mode de transport choisis par l'utilisateur
   const url = new URL(request.url);
   loaderFavoriteAddress = url.searchParams.get("favoriteAddress") || "";
   selectedTransitMode = url.searchParams.get("transitMode")

   // Si le mode de transport n'a pas été défini, cela signifie que l'on vient d'arriver sur la page, alors
   // on charge l'adresse et le mode de transport favori de l'utilisateur
   if (selectedTransitMode == null) {
      selectedTransitMode = "transit";

      if (token != "") {
         const favoriteAddressResponse = await fetch(baseUrl+"/user/favoriteAddress/".concat(token))
         const favoriteAddressJson = await favoriteAddressResponse.json()
         
         if (favoriteAddressJson.favoriteAddress) {
               loaderFavoriteAddress = favoriteAddressJson.favoriteAddress;
         }

         const selectedTransitModeResponse = await fetch(baseUrl+"/user/favoriteTransitMode/".concat(token))
         const selectedTransitModeJson = await selectedTransitModeResponse.json()
         
         if (selectedTransitModeJson.favoriteTransitMode) {
               selectedTransitMode = selectedTransitModeJson.favoriteTransitMode;
         }
      }

    // Si l'utilisateur a rechercher une adresse ou un mode de transport, alors on les mets en favori
   } else {
      if (token != "" && loaderFavoriteAddress != "" && selectedTransitMode != "") {
         await fetch(baseUrl+"/user/favoriteAddress", {
               method: 'PUT',
               headers: {
               'Accept': 'application/json',
               'Content-Type': 'application/json'
               },
               body: JSON.stringify({
                  token: token,
                  favoriteAddress: loaderFavoriteAddress
               })
         });

         await fetch(baseUrl+"/user/favoriteTransitMode", {
               method: 'PUT',
               headers: {
               'Accept': 'application/json',
               'Content-Type': 'application/json'
               },
               body: JSON.stringify({
                  token: token,
                  favoriteTransitMode: selectedTransitMode
               })
         });
      }
   }

   let response = null;
   const cours = nextCours;

   // On si tous les paramètres ont été définis, on récupère l'itinéraire pour aller à l'iut depuis l'adresse donnée pour le cours en utilisant le mode de trasnport donné
   if (cours.start && loaderFavoriteAddress != "" && selectedTransitMode != "") {
      const responseJson = await fetch(baseUrl+"/directions/" + loaderFavoriteAddress + "/" + cours.start.getTime() + "/" + selectedTransitMode)
      response = await responseJson.json()
   }

   return {loaderFavoriteAddress, selectedTransitMode, cours, response}
}


export default function Directions() {
    const {loaderFavoriteAddress, selectedTransitMode, cours, response} = useLoaderData();
    
    let coursStart = "";
    let coursEnd = "";
    
    // Si l'itinéraire a été défini, on récupère la "overview_polyline" qui est un string que l'on décode pour obtenir les coordonnées par lesquelles passent l'itinéraire (permet de l'afficher sur la carte)
    let path = undefined;
    if (response && response.routes && response.routes[0] && response.routes[0].overview_polyline) {
      path = decodePolyline(response.routes[0].overview_polyline.points)
    }

    // On rajoute un 0 devant les heures et les minutes si elles sont inférieures à 10 (pour faire 06, 08, 01...)
    if (cours.start && cours.end) {
        coursStart = ((cours.start.getHours() > 9) ? "" : "0") + cours.start.getHours() + ":" + ((cours.start.getMinutes() > 9) ? "" : "0") + cours.start.getMinutes()
        coursEnd = ((cours.end.getHours() > 9) ? "" : "0") + cours.end.getHours() + ":" + ((cours.end.getMinutes() > 9) ? "" : "0") + cours.end.getMinutes()
    }

    // On calcule l'heure de départ qui est égale à l'heure de début du cours - le temps du trajet
    let departureTimeStart = "";
    if (response != null && response.status && response.status == "OK" && response.routes && response.routes.length > 0 && response.routes[0].legs && response.routes[0].legs.length > 0 && response.routes[0].legs[0].duration) {
        let departure = new Date()
        departure.setTime(cours.start.getTime() - response.routes[0].legs[0].duration.value * 1000);
        departureTimeStart = ((departure.getHours() > 9) ? "" : "0") + departure.getHours() + ":" + ((departure.getMinutes() > 9) ? "" : "0") + departure.getMinutes();
    }

    const favoriteAddress = loaderFavoriteAddress
    
    const submit = useSubmit()

    return (
        (cours.start)
        ? <div className="directions">
            <div className="directions_details">
                <Form >
                    <div className="origin_container">
                        <p>Départ : </p>
                        <input type="text" name="departure" id="departure" placeholder={favoriteAddress} onKeyUp={e => {
                            if (e.keyCode == 13 || e.key == "Enter") {
                                setNextCours(cours);
                                // On doit preventDefault, sinon on obtient une erreur 405 Method Not Allowed
                                e.preventDefault();
                            }
                        }} />
                    </div>
                    
                    <div className="arrival_time">
                        <p>Arrivée à : {coursStart}</p>
                    </div>

                    <div className="search">
                        <div className="button" onClick={(event) => {
                                    setNextCours(cours)

                                    let formData = new FormData();
                                    formData.append("favoriteAddress", (event.target.parentElement.parentElement.querySelector("#departure").value != "")
                                                                        ? event.target.parentElement.parentElement.querySelector("#departure").value
                                                                        : favoriteAddress);
                                    formData.append("transitMode", selectedTransitMode);
                                    submit(formData);
                                }}
                            >Rechercher
                        </div>
                    </div>
                </Form>

                <p className="cours_detail">{"Itinéraire pour le cours de " + cours.summary + " du " + cours.start.getDate() + "/" + (cours.start.getMonth() + 1) + " de " + coursStart + " à " + coursEnd + " en " + cours.location}</p>
            </div>

            <div className="directions_container">
                <div className="directions_steps">

                    <div className="transit_mode">
                        {/* Quand on sélectionne un mode de transport, on recalcule l'itinéraire */}
                        <Form id="transitMode" role="search">
                            <div className={(selectedTransitMode == "transit") ? "transit_mode_selected" : ""}>
                                <img src="../src/assets/img/bus.png" id="transit" alt="bus" onClick={(event) => {
                                    setNextCours(cours)
                                    let formData = new FormData();
                                    formData.append("favoriteAddress", favoriteAddress);
                                    formData.append("transitMode", "transit");
                                    submit(formData);
                                }}/>
                            </div>

                            <div className={(selectedTransitMode == "bicycling") ? "transit_mode_selected" : ""}>
                                <img src="../src/assets/img/bike.png" alt="velo" onClick={(event) => {
                                    setNextCours(cours)
                                    let formData = new FormData();
                                    formData.append("favoriteAddress", favoriteAddress);
                                    formData.append("transitMode", "bicycling");
                                    submit(formData);
                                }}/>
                            </div>

                            <div className={(selectedTransitMode == "walking") ? "transit_mode_selected" : ""}>
                                <img src="../src/assets/img/pedestrian.png" alt="marche" onClick={(event) => {
                                    setNextCours(cours)
                                    let formData = new FormData();
                                    formData.append("favoriteAddress", favoriteAddress);
                                    formData.append("transitMode", "walking");
                                    submit(formData);
                                }}/>
                            </div>

                            <div className={(selectedTransitMode == "driving") ? "transit_mode_selected" : ""}>
                                <img src="../src/assets/img/car.png" alt="voiture" onClick={(event) => {
                                    setNextCours(cours)
                                    let formData = new FormData();
                                    formData.append("favoriteAddress", favoriteAddress);
                                    formData.append("transitMode", "driving");
                                    submit(formData);
                                }}/>
                            </div>
                        </Form>
                    </div>

                    {/* Affichage de toutes les étapes de l'itinéraire en fonction du mode de transport utilisé */}
                    <div className="steps_container">
                        <p className="duration">{(response != null && response.status && response.status == "OK" && response.routes && response.routes.length > 0 && response.routes[0].legs && response.routes[0].legs.length > 0) ? "Durée totale : " + response.routes[0].legs[0].duration.text : "Veuillez choisir une adresse de départ"}</p>

                            {
                              (response != null && response.status && response.status == "OK" && response.routes && response.routes.length > 0 && response.routes[0].legs && response.routes[0].legs.length > 0)
                              
                              ? (selectedTransitMode == "transit" && response.routes[0].legs[0].departure_time)
                            
                                ? response.routes[0].legs[0].steps.map((step, i) => {

                                    const departureDate = new Date(response.routes[0].legs[0].departure_time.value * 1000)
                                    const arrivalDate = new Date(response.routes[0].legs[0].arrival_time.value * 1000)
                                    const departureTime = ((departureDate.getHours() > 9) ? "" : "0") + departureDate.getHours() + ":" + ((departureDate.getMinutes() > 9) ? "" : "0") + departureDate.getMinutes()
                                    const arrivalTime = ((arrivalDate.getHours() > 9) ? "" : "0") + arrivalDate.getHours() + ":" + ((arrivalDate.getMinutes() > 9) ? "" : "0") + arrivalDate.getMinutes()

                                    if (step.travel_mode == "WALKING" || step.travel_mode == "BICYCLING") {
                                        return ([
                                            (i == 0)
                                                ? <div key={i + "1"} className="departure_details">
                                                      <p className="departure_time">{departureTime}</p>
                                                      <div className="stop_icon"></div>
                                                      <p className="departure_position">{response.routes[0].legs[0].start_address}</p>
                                                </div>
                                                : null,

                                            <div key={i + "2"} className="step_details">
                                                <div className="icon_container">
                                                    <img src={"../src/assets/img/" + (step.travel_mode == "WALKING") ? "pedestrian" : "bicycling" + ".png"} alt=""/>
                                                </div>
                
                                                <div className="stop_line dotted"></div>
                
                                                <div className="transit_details">
                                                   <p className="step_transit_mode">{(step.travel_mode == "WALKING") ? "Marche" : "Vélo"}</p>
                                                   <p className="step_distance">{step.distance.text}</p>
                                                   <p className="step_time">{step.duration.text}</p>
                                                </div>
                                            </div>,

                                            (i == response.routes[0].legs[0].steps.length - 1)
                                                ? <div key={i + "3"} className="departure_details">
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
                                          <div key={i + "1"} className="departure_details">
                                             <p className="departure_time">{stepDepartureTime}</p>
                                             <div className="stop_icon" style={{border: "5px solid " + step.transit_details.line.color}}></div>
                                             <p className="departure_position">{step.transit_details.departure_stop.name}</p>
                                          </div>,

                                          <div key={i + "2"} className="step_details">
                                             <div className="icon_container">
                                                <img src="../src/assets/img/bus.png" alt=""/>
                                             </div>
               
                                             <div className="stop_line" style={{borderRight: "5px solid " + ((step.transit_details.line.color) ? step.transit_details.line.color : "#AAA")}}></div>
               
                                             <div className="transit_details">
                                                <div className="line_name" style={{backgroundColor: step.transit_details.line.color, color: step.transit_details.line.text_color}}>{step.transit_details.line.short_name}</div>
                                                <p className="step_distance">{step.distance.text}</p>
                                                <p className="step_time">{step.duration.text + " (" + step.transit_details.num_stops + " arrêts)"}</p>
                                             </div>
                                          </div>,

                                          <div key={i + "3"} className="departure_details">
                                             <p className="departure_time">{stepArrivalTime}</p>
                                             <div className="stop_icon" style={{border: "5px solid " + step.transit_details.line.color}}></div>
                                             <p className="departure_position">{step.transit_details.arrival_stop.name}</p>
                                          </div>
                                       ])
                                    }
                                })

                                // Si le mode de transport de base n'est pas transit, alors on peut réutiliser le même affichage pour driving, walking et bicycling
                                : [
                                    <p className="time_address start">{departureTimeStart + " : " + response.routes[0].legs[0].start_address}</p>,
                                    
                                    response.routes[0].legs[0].steps.map((step, i) => {
                                        return (
                                            <div key={step.html_instructions + i} className="step_not_transit_details">
                                                    <div className="step_direction_container">
                                                        <div className="step_direction_icon_container">
                                                            <img className="step_direction_icon" src={"../src/assets/img/Directions_Icons/" + ((step.maneuver && step.maneuver != "keep-left" && step.maneuver != "keep-right") ? step.maneuver : "straight") + ".png"} alt="" />
                                                        </div>
    
                                                        <p dangerouslySetInnerHTML={{__html: step.html_instructions.replaceAll("<b>", "").replaceAll("</b>", "")}} className="step_direction"/>
                                                    </div>
                                                    <p className="step_distance_time">{step.duration.text + " (" + step.distance.text + ")"}</p>
                                            </div>
                                        )
                                    }),

                                    <p className="time_address end">{coursStart  + " : " + response.routes[0].legs[0].end_address}</p>
                                ]

                            : null
                            }
                        
                    </div>
                </div>

                {/* Affichage de la carte */}
                <div className="map_container">

                    <LoadScript
                        googleMapsApiKey="AIzaSyDoM4U5lz87DBlZL2KQ8tmtUQBopQKr09Y"
                    >
                        <GoogleMap
                            mapContainerStyle={{width: '100%', height: '100%'}}
                            center={{lat: 47.2231906, lng: -1.5444105}}
                            zoom={13}
                        >

                            {/* Affichage de l'itinéraire s'il est défini */}
                           <Polyline
                              path={path}
                              options={{
                                 strokeColor: '#067df5',
                                 strokeOpacity: 0.8,
                                 strokeWeight: 5,
                                 fillColor: '#067df5',
                                 fillOpacity: 0.35,
                                 clickable: false,
                                 draggable: false,
                                 editable: false,
                                 visible: true,
                                 radius: 30000,
                                 paths: {path},
                                 zIndex: 1
                               }}
                           />

                            {/* Affichage du point de départ et d'arrivée (IUT) si l'itinéraire est défini */}
                           {
                           (response && response.routes && response.routes.length > 0 && response.routes[0].legs && response.routes[0].legs.length > 0)
                              ? <><Marker
                                 position={response.routes[0].legs[0].start_location}
                              />
                              <Marker
                                 position={response.routes[0].legs[0].end_location}
                              /></>

                              : null
                           }
                        </GoogleMap>
                    </LoadScript>
                </div>
            </div>
        </div>
        
        : <p className="invalid_cours">Veuillez sélectionner un emploi du temps dans l'onglet "Accueil" ou connectez-vous et mettez un emploi du temps en favori afin de synchroniser automatiquement vos cours</p>
    )
}