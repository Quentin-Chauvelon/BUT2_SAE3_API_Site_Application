import {useLoaderData, useSubmit, Form, useFetcher, redirect} from "react-router-dom";
import {token, formatDateToString, setNextCours, formatStringToDate,baseUrl} from "../main.jsx"
import '../assets/css/root.css'



export async function action({ request, params }) {
    const formData = await request.formData();

    // Récupère l'id de l'emploi du temps favori de l'utilisateur, s'il en a un
    const scheduleId = formData.get("favorite");

    // Si le token est vide et que l'utilisateur a essayé de mettre un emploi du temps en favori, on le renvoie vers la page d'accueil
    if (token == "") {
        return redirect("/login");
    }

    // Modifie l'edt favori de l'utilisateur
    await fetch(baseUrl+"/user/favoriteSchedule", {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token: token,
            favoriteSchedule: scheduleId
        })
    });

    return null;
}


export async function loader({ request }) {
    const url = new URL(request.url);
    let scheduleId = url.searchParams.get("scheduleId") || "";

    const dateParam = url.searchParams.get("date")
    const date = (dateParam && dateParam != "") ? new Date(parseInt(dateParam)) : new Date();

    let favoriteScheduleString = "";
    // Si l'utilisateur est connecté
    if (token != "") {
        // On récupère son emploi du temps favori pour l'afficher automatiquement
        const favoriteScheduleResponse = await fetch(baseUrl+"/user/favoriteSchedule/".concat(token))
        const favoriteSchedule = await favoriteScheduleResponse.json()
        
        if (favoriteSchedule.favoriteSchedule) {
            favoriteScheduleString = favoriteSchedule.favoriteSchedule.toString();

            if (scheduleId == "") {
                scheduleId = favoriteScheduleString;
            }
        }
    }
    
    // On récupère tous les groupes
    let schedules = []
    try {
        const schedulesResponse = await fetch(baseUrl+'/groups')
        schedules = await schedulesResponse.json();
    } catch(e) {
        schedules = []
    }
    
    // S'il y a eu une erreur, on définit les groupes comme un tableau vide
    if (schedules.message != null) {
        schedules = [];
    }
    
    // On récupère les cours de la semaine pour l'id donné
    let schedule = []
    try {
        scheduleId = (scheduleId != "") ? scheduleId : "0"
        const scheduleResponse = await fetch(baseUrl+'/schedule/week/'.concat(scheduleId, "/", formatDateToString(date)))
        schedule = await scheduleResponse.json();
    } catch(e) {
        schedule = []
    }
    
    // S'il y a eu une erreur, on définit les cours comme un tableau vide
    if (schedule.message != null) {
        schedule = [];
    }
    
    return {schedule, schedules, scheduleId, date, favoriteScheduleString};
}


export default function Home() {    
    const {schedule, schedules, scheduleId, date, favoriteScheduleString} = useLoaderData();
    const submit = useSubmit();
    const fetcher = useFetcher();
    const weekdays = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

    // On récupère la date actuelle afin de pouvoir déterminer le prochain cours (par rapport à l'heure actuelle)
    const now = new Date();
    let foundNextCours = false;

    // Quand on récupère l'ics, certains semaines ont un décalage d'1h, certaines de 2h,
    // C'est pourquoi, parfois, il faut enlever 2h au cours pour afficher la bonne heure et parfois 3h
    let decalageHeure = 2;
    schedule.forEach(coursDay => {
        if (coursDay.length > 0 && coursDay[0].start.substring(11,16) == "10:00") {
            decalageHeure = 3;
        }
    });
    
    return (
        <div className="home">
            <div className="selectSchedule">
                <h2>Choisissez l'emploi du temps que vous souhaitez voir : </h2>
            
                {/* Form permettant de choisir l'emploi du temps à afficher */}
                <Form id="scheduleId" role="search">
                    <select 
                    name="scheduleId"
                    id="scheduleId"
                    onChange={(event) => {
                        submit(event.currentTarget.form)
                    }}
                    >
                    
                    <option value="">Veuillez choisir un groupe</option>
                    {
                        schedules.map((scheduleObject, i) => {
                            return <option key={i} value={scheduleObject.id}>{scheduleObject.name}</option>
                        })
                    }
                    </select>
                </Form>
            </div>
            
            {
            (scheduleId != 0)
                ? <>
                    <div className="changeWeek">

                        {/* Forms qui permettent de changer de semaine (afficher la semaine précédente ou suivante (tout en gardant le même id d'edt)) */}
                        <Form id="previousWeek" role="search">
                            <div
                                name="previousWeek"
                                id="previousWeek"
                                onClick={() => {
                                    let formData = new FormData();
                                    formData.append("scheduleId", scheduleId);
                                    formData.append("date", date.setDate(date.getDate() - 7));
                                    submit(formData);
                                }}
                            >{"<<<"}</div>
                        </Form>

                        <Form id="nextWeek" role="search">
                            <div
                                name="nextWeek"
                                id="nextWeek"
                                onClick={() => {
                                    let formData = new FormData();
                                    formData.append("scheduleId", scheduleId);
                                    formData.append("date", date.setDate(date.getDate() + 7));
                                    submit(formData);
                                }}
                            >{">>>"}</div>
                        </Form>  
                    </div>

                    <table>
                        <thead>
                            {/* Créer un tableau de 145 colonnes de large (25 colonnes pour l'affichage des jours à gauche) puis 1 colonne pour 5 minutes de cours */}
                            <tr>
                            {
                                Array.from({ length: 145 }).map((_, i) => {
                                    return <th key={i}></th>
                                })
                            }
                            </tr>

                            <tr>
                            <th colSpan="25">
                                <div>
                                    <fetcher.Form method="post">
                                        <input type="image" value={scheduleId} name="favorite" className="star" id="favorite" alt="favorite" src={(favoriteScheduleString == scheduleId) ? "../src/assets/img/star.png" : "../src/assets/img/emptyStar.png"}/>
                                    </fetcher.Form>
                                </div>
                            </th>
                            
                            {/* Créer les heures de 8h-9h à 17h-18h */}
                            {
                                Array.from({ length: 10 }).map((_, i) => {
                                    return <th key={i} colSpan="12">{(i + 8).toString().concat(":00 - ", i + 9, ":00")}</th>
                                })
                            }
                            </tr>
                        </thead>
                
                        <tbody>
                        {
                        schedule.map((coursDay, j) => {
                            if (j == 0 || j == schedule.length - 1) {
                                return null
                            }
                            
                            return (
                                // Affichage du jour et de la date
                                <tr key={j}>
                                <th colSpan="25">{weekdays[j].concat((schedule[j][0] && schedule[j][0].start)
                                    ? "\n" + new Date(Date.parse(schedule[j][0].start)).getDate() + "/" + (new Date(Date.parse(schedule[j][0].start)).getMonth() + 1) + "/" + new Date(Date.parse(schedule[j][0].start)).getFullYear()
                                    : "")
                                }</th>

                                {
                                    // Pour chaque cours
                                    schedule[j].map((cours, i) => {
                                        const start = new Date(Date.parse(cours.start))
                                        const end = new Date(Date.parse(cours.end))
                                        start.setTime(start.getTime() - decalageHeure * 60 * 60 * 1000)
                                        end.setTime(end.getTime() - decalageHeure * 60 * 60 * 1000)

                                        // Si le cours est le prochain cours à avoir lieu (par rapport à l'heure actuelle), on le sauvegarde
                                        // Il sera utilisé comme heure de référence pour l'itinéraire
                                        if (!foundNextCours && now < start) {
                                            foundNextCours = true

                                            const coursCopy = {...cours}
                                            coursCopy.start = formatStringToDate(coursCopy.start)
                                            coursCopy.end = formatStringToDate(coursCopy.end)

                                            setNextCours(coursCopy)
                                        }
                                        
                                        const previousCours = (i > 0) ? schedule[j][i - 1] : null
                                        
                                        // On détermine le temps passé depuis le dernier cours (ou depuis 8h si c'est le premier cours de la journée)
                                        // ce qui permet de laisser des espaces dans l'affichage de l'edt pour les pauses, midi...
                                        // ou de laisser un trou si le premier n'est pas à 8h par exemple
                                        let previousCoursEnd
                                        if (previousCours != null) {
                                            previousCoursEnd = new Date(Date.parse(previousCours.end))
                                            previousCoursEnd.setTime(previousCoursEnd.getTime() - decalageHeure * 60 * 60 * 1000)
                                        } else {
                                            const year = start.getFullYear()
                                            const month = start.getMonth()
                                            const day = start.getDate()
                                            previousCoursEnd = new Date(year, month, day)
                                            previousCoursEnd.setTime(previousCoursEnd.getTime() + 8 * 60 * 60 * 1000)
                                        }
                                        
                                        return ([
                                            (start - previousCoursEnd) > 0 ? <td colSpan={(start - previousCoursEnd) / 60 / 1000 / 5} key={i + j + previousCoursEnd}></td> : null,
                                            (end - start)
                                                ? <td colSpan={(end - start) / 60 / 1000 / 5} key={i + j + start}>
                                                    {/* Les className de la div suivante permettent de colorer la case en fonction du type de cours (td -> bleu, tp -> rose, ds -> marron...) */}
                                                    <div className={
                                                        "cours"
                                                        .concat(cours.summary.includes("TD") ? " td" : "")
                                                        .concat(cours.summary.includes("TP") ? " tp" : "")
                                                        .concat(cours.summary.includes("DS") ? " ds" : "")
                                                        .concat(cours.summary.includes("Cours") ? " amphi" : "")
                                                        .concat(cours.summary.includes("Reunion") ? " reunion" : "")
                                                    }
                                                    // Si on clique sur un cours, cela permet de calculer l'itinéraire et l'heure de départ pour arriver à ce cours
                                                    onClick={event => {
                                                        const coursCopy = {...cours}
                                                        coursCopy.start = formatStringToDate(coursCopy.start)
                                                        coursCopy.end = formatStringToDate(coursCopy.end)

                                                        setNextCours(coursCopy);

                                                        submit(null, {action: "/app/directions"});
                                                    }}>
                                                    
                                                    <p>{
                                                        ((start.getHours() < 10) ? "0" + start.getHours() : start.getHours()) + ":" +
                                                        ((start.getMinutes() < 10) ? start.getMinutes() + "0" : start.getMinutes()) + " - " +
                                                        ((end.getHours() < 10) ? "0" + end.getHours() : end.getHours()) + ":" +
                                                        ((end.getMinutes() < 10) ? end.getMinutes() + "0" : end.getMinutes())
                                                    }</p>
                                                    <p>{cours.summary.replaceAll('\\', '\n')}</p>
                                                    <p>{cours.location}</p>
                                                    </div>
                                                </td>

                                                : null
                                        ])
                                    })
                                }
                                
                                </tr>
                                )
                            })
                        }
                        </tbody>
                    </table>
                </>

                : null
            }
        </div>
        );
    }