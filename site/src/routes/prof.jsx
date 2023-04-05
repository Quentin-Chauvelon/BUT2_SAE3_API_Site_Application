import {useLoaderData,useSubmit ,Form} from "react-router-dom";
import {formatStringToDate,formatDateToString,baseUrl} from "../main.jsx"

import "./../assets/css/prof.css"


export async function loader({request}) {
    // const url = new URL(request.url);
    // let prof = url.searchParams.get("prof") || "";
    // console.log(prof)
    try {
        const url = new URL(request.url);

        const professeursResponse = await fetch(baseUrl+'/teachers')
        let professeurs = await professeursResponse.json();

        if (professeurs.error!=null) {
            professeurs=[];
        }

        let professeurId = 0
        let professeur = -1
        if (url.searchParams.get("prof")!=null) {
            professeurs.map( async (prof)=>{
                if (prof.name.toLowerCase()==url.searchParams.get("prof").toLowerCase()) {
                  professeurId=prof.id
                }
            })
            let date = new Date()
            if ( url.searchParams.get("date")!="") {
                date =new Date(url.searchParams.get("date"))
            }
            const professeurResponse = await fetch(baseUrl+'/teacher/'+professeurId+"/"+formatDateToString(date))
            professeur = await professeurResponse.json();
        }
        const nomProfesseur = url.searchParams.get("prof")
        return {professeurs,professeur,nomProfesseur}
    } catch (error) {
        const professeurs=[]
        const professeur = []
        const nomProfesseur = "Il/Elle"
        return {professeurs,professeur,nomProfesseur}
    }
}



export default function Prof() {
    const {professeurs,professeur,nomProfesseur} = useLoaderData()
    const submit = useSubmit()

    let rooms = []
    let alreadySearched = false 
    let i = 0

    if (professeur!=-1) {
        alreadySearched=true
        rooms = professeur
    }

    return ( 
        <>
        <div className="rechercheProf">
            <p className="Sc grand">&nbsp;Service de recherche de Professeurs&nbsp;</p>
            <Form>
                <input id="input" name="prof" className="Sc" placeholder="Qui : Berdjugin, Arnaud, ..." list="professeurs" onChange={(event) => {(professeurs.find(prof=>prof.name.toLowerCase()==event.target.value.toLowerCase()))?submit(event.currentTarget.form):null}} required/>
                <input id="date" type="date" name="date" className="Sc" onChange={(event)=>{(document.getElementById("input").value!="")?submit(event.currentTarget.form):null}}/>
            </Form>
            <datalist id="professeurs"> 
                {professeurs.map(prof=>{
                    return <option key={prof.id} id={prof.id} value={prof.name}/>
                })}
            </datalist>
            <p className="Sc">Vous pourrez le trouvez :</p>
            
            {
                (alreadySearched)
                    ? (rooms.length > 0)
                        ? <div className="profEdt Sc">{rooms.map(room=>{ 
                            const startDate = formatStringToDate(room.start)
                            const endDate = formatStringToDate(room.end)
                                let style = "card"
                                if ( new Date() <= endDate & new Date() >= startDate) {
                                    style ="card now"
                                }
                                return <div className={style} key={i=i+1}>
                                {room.location.replaceAll("J-","")}
                                <br/>
                                {((startDate.getHours() < 10) ? "0" + startDate.getHours() : startDate.getHours()) + ":" +
                                ((startDate.getMinutes() < 10) ? startDate.getMinutes() + "0" : startDate.getMinutes()) + " - " +
                                ((endDate.getHours() < 10) ? "0" + endDate.getHours() : endDate.getHours()) + ":" +
                                ((endDate.getMinutes() < 10) ? endDate.getMinutes() + "0" : endDate.getMinutes())}
                                <br/>
                                <br/>
                                {room.summary}
                            </div>
                           })}
                            </div>
                        : <p className="Sc" id="Vide">{nomProfesseur} n'a pas cours, vous pourrez peut être le trouver dans son bureau.</p>
                    : null
            }
        </div>
        </>
    )
}