import {useLoaderData} from "react-router-dom";


export async function loader({ request }) {
    const schedulesResponse = await fetch('http://172.26.82.56:443/schedules')
    const schedules = await schedulesResponse.json();

    const scheduleResponse = await fetch('http://172.26.82.56:443/schedule/week/3184')
    const schedule = await scheduleResponse.json();
    
    return {schedule, schedules};
}


export default function Home() {    
    const {schedule, schedules} = useLoaderData();
    const weekdays = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]
    console.log(schedules);

    return (
        <>

            <div className="selectSchedule">
                <h2>Choisissez l'emploi du temps que vous souhaitez voir : </h2>
                
                <select name="schedule" id="schedule">
                    <option value="">Veuillez choisir un emploi du temps</option>
                    {
                        schedules.map((scheduleObject) => {
                            return value={scheduleObject.id} <option>{scheduleObject.name}</option>
                        })
                    }
                </select>
            </div>

            <table>
                <thead>
                    <tr>
                        {
                            Array.from({ length: 145 }).map((_, i) => {
                                return <th key={i}></th>
                            })
                        }
                    </tr>
                    <tr>
                        <th colSpan="25"></th>
                        <th colSpan="12">08:00 - 09:00</th>
                        <th colSpan="12">09:00 - 10:00</th>
                        <th colSpan="12">10:00 - 11:00</th>
                        <th colSpan="12">11:00 - 12:00</th>
                        <th colSpan="12">12:00 - 13:00</th>
                        <th colSpan="12">13:00 - 14:00</th>
                        <th colSpan="12">14:00 - 15:00</th>
                        <th colSpan="12">15:00 - 16:00</th>
                        <th colSpan="12">16:00 - 17:00</th>
                        <th colSpan="12">17:00 - 18:00</th>
                    </tr>
                </thead>

                <tbody>
                {
                    schedule.map((cours, j) => {
                        if (j == 0 || j == schedule.length - 1) {
                            return null
                        }

                        return <tr key={j}>
                            <th colSpan="25">{weekdays[j]}</th>
                            {
                                schedule[j].map((cours, i) => {
                                    const start = new Date(Date.parse(cours.start))
                                    const end = new Date(Date.parse(cours.end))

                                    const previousCours = (i > 0) ? schedule[j][i - 1] : null

                                    if (previousCours == null) {
                                        return <td colSpan={(end - start) / 60 / 1000 / 5} key={i + j + start}>
                                            <div className="cours">
                                                <p>{
                                                    ((start.getHours() < 10) ? start.getHours() + "0" : start.getHours()) + ":" +
                                                    ((start.getMinutes() < 10) ? start.getMinutes() + "0" : start.getMinutes()) + " - " +
                                                    ((end.getHours() < 10) ? end.getHours() + "0" : end.getHours()) + ":" +
                                                    ((end.getMinutes() < 10) ? end.getMinutes() + "0" : end.getMinutes())
                                                }</p>
                                                <p>{cours.summary.replaceAll('\\', '\n')}</p>
                                                <p>{cours.location}</p>
                                            </div>
                                        </td>
                                    }

                                    const previousCoursEnd = new Date(Date.parse(previousCours.end))

                                    return ([
                                        <td colSpan={(start - previousCoursEnd) / 60 / 1000 / 5} key={i + j + previousCoursEnd}></td>,
                                        <td colSpan={(end - start) / 60 / 1000 / 5} key={i + j + start}>
                                            <div className="cours">
                                                <p>{
                                                    ((start.getHours() < 10) ? start.getHours() + "0" : start.getHours()) + ":" +
                                                    ((start.getMinutes() < 10) ? start.getMinutes() + "0" : start.getMinutes()) + " - " +
                                                    ((end.getHours() < 10) ? end.getHours() + "0" : end.getHours()) + ":" +
                                                    ((end.getMinutes() < 10) ? end.getMinutes() + "0" : end.getMinutes())
                                                }</p>
                                                <p>{cours.summary.replaceAll('\\', '\n')}</p>
                                                <p>{cours.location}</p>
                                            </div>
                                        </td>
                                    ])
                                })
                            }
                        </tr>
                    })
                }
                </tbody>
            </table>

        </>
    );
}