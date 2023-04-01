import {Form} from "react-router-dom"
import '../assets/css/directions.css'

export default function Directions() {
    const cours = {
        start: new Date()
    }
    const selectedMode = "transit"

    // TODO: replace bus/tram by div with the color of the line and the line name (ex : C1)
    // change dot and line icons color to match the bus line color
    // replace duration on the left with time if not done already
    const response = {
        "geocoded_waypoints" : [
           {
              "geocoder_status" : "OK",
              "partial_match" : true,
              "place_id" : "ChIJf0z7govrBUgR-eyKhZ2Su7E",
              "types" : [ "establishment", "point_of_interest", "tourist_attraction" ]
           },
           {
              "geocoder_status" : "OK",
              "place_id" : "ChIJpy2TCz7wBUgRo4Ly_iTXbto",
              "types" : [ "establishment", "point_of_interest", "university" ]
           }
        ],
        "routes" : [
           {
              "bounds" : {
                 "northeast" : {
                    "lat" : 47.22322399999999,
                    "lng" : -1.5418138
                 },
                 "southwest" : {
                    "lat" : 47.2064871,
                    "lng" : -1.5676184
                 }
              },
              "copyrights" : "Map data ©2023",
              "fare" : {
                 "currency" : "EUR",
                 "text" : "€1.70",
                 "value" : 1.7
              },
              "legs" : [
                 {
                    "arrival_time" : {
                       "text" : "9:55 PM",
                       "time_zone" : "Europe/Paris",
                       "value" : 1680551706
                    },
                    "departure_time" : {
                       "text" : "9:30 PM",
                       "time_zone" : "Europe/Paris",
                       "value" : 1680550224
                    },
                    "distance" : {
                       "text" : "3.4 km",
                       "value" : 3366
                    },
                    "duration" : {
                       "text" : "25 mins",
                       "value" : 1482
                    },
                    "end_address" : "3 Rue Maréchal Joffre, 44000 Nantes, France",
                    "end_location" : {
                       "lat" : 47.22322399999999,
                       "lng" : -1.5444447
                    },
                    "start_address" : "Parc des Chantiers, Bd Léon Bureau, 44200 Nantes, France",
                    "start_location" : {
                       "lat" : 47.2064871,
                       "lng" : -1.564284
                    },
                    "steps" : [
                       {
                          "distance" : {
                             "text" : "0.4 km",
                             "value" : 414
                          },
                          "duration" : {
                             "text" : "6 mins",
                             "value" : 336
                          },
                          "end_location" : {
                             "lat" : 47.20896690000001,
                             "lng" : -1.5676184
                          },
                          "html_instructions" : "Walk to Chantiers Navals",
                          "polyline" : {
                             "points" : "q_c_HvopHQPM@MJg@d@q@j@WVORKJKZg@b@YXcAz@A?KJOLA@a@X_Ax@GFEHGJELABCLEPINCBKP`@tB"
                          },
                          "start_location" : {
                             "lat" : 47.2064871,
                             "lng" : -1.564284
                          },
                          "steps" : [
                             {
                                "distance" : {
                                   "text" : "0.1 km",
                                   "value" : 123
                                },
                                "duration" : {
                                   "text" : "2 mins",
                                   "value" : 97
                                },
                                "end_location" : {
                                   "lat" : 47.2074261,
                                   "lng" : -1.5651286
                                },
                                "html_instructions" : "Head \u003cb\u003enorthwest\u003c/b\u003e on \u003cb\u003eBd Léon Bureau\u003c/b\u003e toward \u003cb\u003eRue La Noue Bras de Fer\u003c/b\u003e",
                                "polyline" : {
                                   "points" : "q_c_HvopHQPM@MJg@d@q@j@WVORKJ"
                                },
                                "start_location" : {
                                   "lat" : 47.2064871,
                                   "lng" : -1.564284
                                },
                                "travel_mode" : "WALKING"
                             },
                             {
                                "distance" : {
                                   "text" : "0.2 km",
                                   "value" : 243
                                },
                                "duration" : {
                                   "text" : "3 mins",
                                   "value" : 199
                                },
                                "end_location" : {
                                   "lat" : 47.20913789999999,
                                   "lng" : -1.5670348
                                },
                                "html_instructions" : "Slight \u003cb\u003eleft\u003c/b\u003e onto \u003cb\u003eBd Léon Bureau\u003c/b\u003e/\u003cwbr/\u003e\u003cb\u003ePont Anne de Bretagne\u003c/b\u003e\u003cdiv style=\"font-size:0.9em\"\u003eContinue to follow Bd Léon Bureau\u003c/div\u003e",
                                "maneuver" : "turn-slight-left",
                                "polyline" : {
                                   "points" : "mec_H`upHKZg@b@YXcAz@A?KJOLA@a@X_Ax@GFEHGJELABCLEPINCBKP"
                                },
                                "start_location" : {
                                   "lat" : 47.2074261,
                                   "lng" : -1.5651286
                                },
                                "travel_mode" : "WALKING"
                             },
                             {
                                "distance" : {
                                   "text" : "48 m",
                                   "value" : 48
                                },
                                "duration" : {
                                   "text" : "1 min",
                                   "value" : 40
                                },
                                "end_location" : {
                                   "lat" : 47.20896690000001,
                                   "lng" : -1.5676184
                                },
                                "html_instructions" : "Turn \u003cb\u003eleft\u003c/b\u003e onto \u003cb\u003eQuai de la Fosse\u003c/b\u003e\u003cdiv style=\"font-size:0.9em\"\u003eDestination will be on the left\u003c/div\u003e",
                                "maneuver" : "turn-left",
                                "polyline" : {
                                   "points" : "cpc_H|`qH`@tB"
                                },
                                "start_location" : {
                                   "lat" : 47.20913789999999,
                                   "lng" : -1.5670348
                                },
                                "travel_mode" : "WALKING"
                             }
                          ],
                          "travel_mode" : "WALKING"
                       },
                       {
                          "distance" : {
                             "text" : "2.2 km",
                             "value" : 2169
                          },
                          "duration" : {
                             "text" : "9 mins",
                             "value" : 540
                          },
                          "end_location" : {
                             "lat" : 47.2178215,
                             "lng" : -1.5421464
                          },
                          "html_instructions" : "Tram towards Beaujoire / Ranzay",
                          "polyline" : {
                             "points" : "_oc_HnbqH@AUeAWmAEWiCiMCMS_AS{@_@sAGQKY{@yCw@sCq@aCACs@iCK]K[CEISOa@Sa@S_@O[a@s@W_@Y_@m@{@Wc@GISg@Wu@s@aCGOk@oBi@gBGWCIAECGEQCQEOIa@Q_ASsAAC[gCCYo@gFCSIg@UiBCSEQYyAEQGYCS[eBI_@AIIc@CKI]Ok@Oe@Sk@Wo@u@cB]eA]iAOe@GSeAoDUs@oBoG?CMe@Me@Im@Io@Gi@E]AOIwAEs@AWJA"
                          },
                          "start_location" : {
                             "lat" : 47.208957,
                             "lng" : -1.5672773
                          },
                          "transit_details" : {
                             "arrival_stop" : {
                                "location" : {
                                   "lat" : 47.2178215,
                                   "lng" : -1.5421464
                                },
                                "name" : "Gare Nord"
                             },
                             "arrival_time" : {
                                "text" : "9:45 PM",
                                "time_zone" : "Europe/Paris",
                                "value" : 1680551100
                             },
                             "departure_stop" : {
                                "location" : {
                                   "lat" : 47.208957,
                                   "lng" : -1.5672773
                                },
                                "name" : "Chantiers Navals"
                             },
                             "departure_time" : {
                                "text" : "9:36 PM",
                                "time_zone" : "Europe/Paris",
                                "value" : 1680550560
                             },
                             "headsign" : "Beaujoire / Ranzay",
                             "line" : {
                                "agencies" : [
                                   {
                                      "name" : "TAN",
                                      "phone" : "011 33 2 40 44 44 44",
                                      "url" : "http://www.tan.fr/"
                                   }
                                ],
                                "color" : "#007a45",
                                "name" : "François Mitterrand / Jamet - Beaujoire / Ranzay",
                                "short_name" : "1",
                                "text_color" : "#ffffff",
                                "vehicle" : {
                                   "icon" : "//maps.gstatic.com/mapfiles/transit/iw2/6/tram2.png",
                                   "name" : "Tram",
                                   "type" : "TRAM"
                                }
                             },
                             "num_stops" : 5
                          },
                          "travel_mode" : "TRANSIT"
                       },
                       {
                          "distance" : {
                             "text" : "0.8 km",
                             "value" : 783
                          },
                          "duration" : {
                             "text" : "10 mins",
                             "value" : 606
                          },
                          "end_location" : {
                             "lat" : 47.22322399999999,
                             "lng" : -1.5444447
                          },
                          "html_instructions" : "Walk to 3 Rue Maréchal Joffre, 44000 Nantes, France",
                          "polyline" : {
                             "points" : "qfe_HpelHASE[SFIDEc@KDEDAD]SK^Gl@C@?@A@EHEJILGHMLOJKFIBIBI?IAIAGEKGMKWSGEICGCICI?UCAFEB}@p@QLKHOJMLIHCFEDGHEFEJGLADCHENADCDCBa@ZGFUV[^SRU_ACFEHk@dA_@v@CFAFg@UQGwBu@_A_@]pAGV"
                          },
                          "start_location" : {
                             "lat" : 47.21785,
                             "lng" : -1.5421683
                          },
                          "steps" : [
                             {
                                "distance" : {
                                   "text" : "36 m",
                                   "value" : 36
                                },
                                "duration" : {
                                   "text" : "1 min",
                                   "value" : 28
                                },
                                "end_location" : {
                                   "lat" : 47.2180358,
                                   "lng" : -1.5419968
                                },
                                "html_instructions" : "Head \u003cb\u003eeast\u003c/b\u003e toward \u003cb\u003eBd de Stalingrad\u003c/b\u003e",
                                "polyline" : {
                                   "points" : "qfe_HpelHASE[SFID"
                                },
                                "start_location" : {
                                   "lat" : 47.21785,
                                   "lng" : -1.5421683
                                },
                                "travel_mode" : "WALKING"
                             },
                             {
                                "distance" : {
                                   "text" : "14 m",
                                   "value" : 14
                                },
                                "duration" : {
                                   "text" : "1 min",
                                   "value" : 9
                                },
                                "end_location" : {
                                   "lat" : 47.2180706,
                                   "lng" : -1.5418176
                                },
                                "html_instructions" : "Turn \u003cb\u003eright\u003c/b\u003e onto \u003cb\u003eBd de Stalingrad\u003c/b\u003e",
                                "maneuver" : "turn-right",
                                "polyline" : {
                                   "points" : "wge_HndlHEc@"
                                },
                                "start_location" : {
                                   "lat" : 47.2180358,
                                   "lng" : -1.5419968
                                },
                                "travel_mode" : "WALKING"
                             },
                             {
                                "distance" : {
                                   "text" : "13 m",
                                   "value" : 13
                                },
                                "duration" : {
                                   "text" : "1 min",
                                   "value" : 10
                                },
                                "end_location" : {
                                   "lat" : 47.2181721,
                                   "lng" : -1.5419064
                                },
                                "html_instructions" : "Turn \u003cb\u003eleft\u003c/b\u003e onto \u003cb\u003eRue Ecorchard\u003c/b\u003e",
                                "maneuver" : "turn-left",
                                "polyline" : {
                                   "points" : "}ge_HjclHKDEDAD"
                                },
                                "start_location" : {
                                   "lat" : 47.2180706,
                                   "lng" : -1.5418176
                                },
                                "travel_mode" : "WALKING"
                             },
                             {
                                "distance" : {
                                   "text" : "18 m",
                                   "value" : 18
                                },
                                "duration" : {
                                   "text" : "1 min",
                                   "value" : 13
                                },
                                "end_location" : {
                                   "lat" : 47.21832269999999,
                                   "lng" : -1.5418138
                                },
                                "html_instructions" : "Turn \u003cb\u003eright\u003c/b\u003e",
                                "maneuver" : "turn-right",
                                "polyline" : {
                                   "points" : "qhe_H|clH]S"
                                },
                                "start_location" : {
                                   "lat" : 47.2181721,
                                   "lng" : -1.5419064
                                },
                                "travel_mode" : "WALKING"
                             },
                             {
                                "distance" : {
                                   "text" : "32 m",
                                   "value" : 32
                                },
                                "duration" : {
                                   "text" : "1 min",
                                   "value" : 23
                                },
                                "end_location" : {
                                   "lat" : 47.2184177,
                                   "lng" : -1.5422017
                                },
                                "html_instructions" : "Turn \u003cb\u003eleft\u003c/b\u003e",
                                "maneuver" : "turn-left",
                                "polyline" : {
                                   "points" : "oie_HhclHK^Gl@"
                                },
                                "start_location" : {
                                   "lat" : 47.21832269999999,
                                   "lng" : -1.5418138
                                },
                                "travel_mode" : "WALKING"
                             },
                             {
                                "distance" : {
                                   "text" : "0.2 km",
                                   "value" : 159
                                },
                                "duration" : {
                                   "text" : "2 mins",
                                   "value" : 126
                                },
                                "end_location" : {
                                   "lat" : 47.21968820000001,
                                   "lng" : -1.5423138
                                },
                                "html_instructions" : "Slight \u003cb\u003eright\u003c/b\u003e",
                                "maneuver" : "turn-slight-right",
                                "polyline" : {
                                   "points" : "cje_HvelHC@?@A@EHEJILGHMLOJKFIBIBI?IAIAGEKGMKWSGEICGCICI?UC"
                                },
                                "start_location" : {
                                   "lat" : 47.2184177,
                                   "lng" : -1.5422017
                                },
                                "travel_mode" : "WALKING"
                             },
                             {
                                "distance" : {
                                   "text" : "0.2 km",
                                   "value" : 218
                                },
                                "duration" : {
                                   "text" : "3 mins",
                                   "value" : 172
                                },
                                "end_location" : {
                                   "lat" : 47.2212453,
                                   "lng" : -1.5440072
                                },
                                "html_instructions" : "Slight \u003cb\u003eleft\u003c/b\u003e",
                                "maneuver" : "turn-slight-left",
                                "polyline" : {
                                   "points" : "are_HlflHAFEB}@p@QLKHOJMLIHCFEDGHEFEJGLADCHENADCDCBa@ZGFUV[^SR"
                                },
                                "start_location" : {
                                   "lat" : 47.21968820000001,
                                   "lng" : -1.5423138
                                },
                                "travel_mode" : "WALKING"
                             },
                             {
                                "distance" : {
                                   "text" : "27 m",
                                   "value" : 27
                                },
                                "duration" : {
                                   "text" : "1 min",
                                   "value" : 19
                                },
                                "end_location" : {
                                   "lat" : 47.2213562,
                                   "lng" : -1.5436923
                                },
                                "html_instructions" : "Turn \u003cb\u003eright\u003c/b\u003e onto \u003cb\u003eRue Gambetta\u003c/b\u003e",
                                "maneuver" : "turn-right",
                                "polyline" : {
                                   "points" : "y{e_H`qlHU_A"
                                },
                                "start_location" : {
                                   "lat" : 47.2212453,
                                   "lng" : -1.5440072
                                },
                                "travel_mode" : "WALKING"
                             },
                             {
                                "distance" : {
                                   "text" : "79 m",
                                   "value" : 79
                                },
                                "duration" : {
                                   "text" : "1 min",
                                   "value" : 63
                                },
                                "end_location" : {
                                   "lat" : 47.2218236,
                                   "lng" : -1.5444856
                                },
                                "html_instructions" : "Turn \u003cb\u003eleft\u003c/b\u003e onto \u003cb\u003eRue Guillaume Grou\u003c/b\u003e",
                                "maneuver" : "turn-left",
                                "polyline" : {
                                   "points" : "o|e_H`olHCFEHk@dA_@v@CFAF"
                                },
                                "start_location" : {
                                   "lat" : 47.2213562,
                                   "lng" : -1.5436923
                                },
                                "travel_mode" : "WALKING"
                             },
                             {
                                "distance" : {
                                   "text" : "0.1 km",
                                   "value" : 141
                                },
                                "duration" : {
                                   "text" : "2 mins",
                                   "value" : 107
                                },
                                "end_location" : {
                                   "lat" : 47.2230275,
                                   "lng" : -1.5439104
                                },
                                "html_instructions" : "Turn \u003cb\u003eright\u003c/b\u003e onto \u003cb\u003eRue Gaston Turpin\u003c/b\u003e",
                                "maneuver" : "turn-right",
                                "polyline" : {
                                   "points" : "k_f_H`tlHg@UQGwBu@_A_@"
                                },
                                "start_location" : {
                                   "lat" : 47.2218236,
                                   "lng" : -1.5444856
                                },
                                "travel_mode" : "WALKING"
                             },
                             {
                                "distance" : {
                                   "text" : "46 m",
                                   "value" : 46
                                },
                                "duration" : {
                                   "text" : "1 min",
                                   "value" : 36
                                },
                                "end_location" : {
                                   "lat" : 47.22322399999999,
                                   "lng" : -1.5444447
                                },
                                "html_instructions" : "Turn \u003cb\u003eleft\u003c/b\u003e\u003cdiv style=\"font-size:0.9em\"\u003eRestricted usage road\u003c/div\u003e\u003cdiv style=\"font-size:0.9em\"\u003eDestination will be on the right\u003c/div\u003e",
                                "maneuver" : "turn-left",
                                "polyline" : {
                                   "points" : "}ff_HlplH]pAGV"
                                },
                                "start_location" : {
                                   "lat" : 47.2230275,
                                   "lng" : -1.5439104
                                },
                                "travel_mode" : "WALKING"
                             }
                          ],
                          "travel_mode" : "WALKING"
                       }
                    ],
                    "traffic_speed_entry" : [],
                    "via_waypoint" : []
                 }
              ],
              "overview_polyline" : {
                 "points" : "q_c_HvopHQPM@u@p@iAbA[^KZg@b@}AtA_@ZaBrAMPSj@O`@OT`@tB@cASgAkD}Pg@{Bg@eBgAsDiBuGmAgEq@}Ac@{@y@sAgBiCk@}A{@qCaByFOq@u@eEa@eDsAmKi@qCq@sDYwA_@qAk@{Au@cB]eAm@oBsEgOMi@WsAYgCOkCAWJAEBASE[SFIDEc@QJAD]SK^Gl@CBGJOXUV[RSFSAQGy@m@e@KUCAFcAt@{@p@[`@Uf@Od@cA~@o@r@U_ACFq@nAc@~@AFg@UiC}@_A_@]pAGV"
              },
              "summary" : "",
              "warnings" : [
                 "Walking directions are in beta. Use caution – This route may be missing sidewalks or pedestrian paths."
              ],
              "waypoint_order" : []
           }
        ],
        "status" : "OK"
    }

    const departureTime = response.routes[0].legs[0].departure_time.value;
    let currentTime = new Date(departureTime);

    return (
        <div className="directions">
            <div className="directions_details">
                <div className="origin_container">
                    <p>Départ : </p>
                    <input type="text" name="departure" id="departure" />
                </div>
                
                <div className="arrival_time">
                    <p>Arrivée à : {cours.start.getHours() + ":" + cours.start.getMinutes()}</p>
                </div>

                <div className="search">
                    <button type="submit">Rechercher</button>
                </div>
            </div>

            <div className="directions_container">
                <div className="directions_steps">

                    <div className="transit_mode">
                        <div className={(selectedMode == "transit") ? "transit_mode_selected" : ""}>
                            <img src="../src/assets/img/bus.png" alt="bus" />
                        </div>

                        <div className={(selectedMode == "bicycling") ? "transit_mode_selected" : ""}>
                            <img src="../src/assets/img/car.png" alt="vélo" />
                        </div>

                        <div className={(selectedMode == "walking") ? "transit_mode_selected" : ""}>
                            <img src="../src/assets/img/bike.png" alt="marche" />
                        </div>

                        <div className={(selectedMode == "driving") ? "transit_mode_selected" : ""}>
                            <img src="../src/assets/img/pedestrian.png" alt="voiture" />
                        </div>
                    </div>

                    <div className="steps_container">
                        <p className="duration">Durée totale : {response.routes[0].legs[0].duration.text}</p>

                            {
                                response.routes[0].legs[0].steps.map((step, i) => {

                                    currentTime.setTime(currentTime.getTime() + step.duration.value * 1000);
                                    const hours = currentTime.getHours();
                                    const minutes = currentTime.getMinutes();
                                    const time = (hours > 9) ? "" : "0").concat(hours.toString(), ":", ((minutes > 9) ? "" : "0"), minutes.toString();

                                    if (step.travel_mode == "WALKING") {
                                        return ([
                                            (i == 0)
                                                ? <div className="departure_details">
                                                    <p className="departure_time">{time}</p>
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
                                                    <p className="departure_time">{step.duration.text}</p>
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
                                                    <p className="departure_time">{time}</p>
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
                                                    <p className="departure_time">{step.duration.text}</p>
                                                    <div className="stop_icon"></div>
                                                    <p className="departure_position">{response.routes[0].legs[0].end_address}</p>
                                                </div>
                                                : null
                                        ])
                                    }

                                    else if (step.travel_mode == "TRANSIT") {
                                        return ([
                                            <div className="departure_details">
                                                <p className="departure_time">{time}</p>
                                                <div className="stop_icon"></div>
                                                <p className="departure_position">{step.transit_details.departure_stop.name}</p>
                                            </div>,

                                            <div className="step_details">
                                                <div className="icon_container">
                                                    <img src="../src/assets/img/bus.png" alt=""/>
                                                </div>
                
                                                <div className="stop_line" style={{borderRight: "5px solid #AAA"}}></div>
                
                                                <div className="transit_details">
                                                    <p className="step_transit_mode">Bus/Tramway</p>
                                                    <p className="step_distance">{step.distance.text}</p>
                                                    <p className="step_time">{step.duration.text}</p>
                                                </div>
                                            </div>,

                                            <div className="departure_details">
                                                <p className="departure_time">{step.duration.text}</p>
                                                <div className="stop_icon"></div>
                                                <p className="departure_position">{step.transit_details.arrival_stop.name}</p>
                                            </div>
                                        ])
                                    }
                                })
                                // response.routes[0].legs[0].map((step) => {
                                //     console.log(step);
                                // })
                            
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