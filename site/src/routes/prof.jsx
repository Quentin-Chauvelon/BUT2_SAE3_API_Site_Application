/* Import des composants vite et de leurs méthodes,
   des fonctions de convertion de date et de baseUrl
*/

import {useLoaderData,useSubmit ,Form} from "react-router-dom";
import {formatStringToDate,formatDateToString,baseUrl} from "../main.jsx"

import "./../assets/css/prof.css"

/* Définition de la function loader*/

export async function loader({request}) {
    try {
        // Création d'un objet URL pour avoir accès à l'url
        const url = new URL(request.url);

        // Requête pour récupérer tous les professeurs
        const professeursResponse = await fetch(baseUrl+'/teachers')
        let professeurs = await professeursResponse.json();

        if (professeurs.error!=null) {
            professeurs=[];
        }
        // Variables utiles pour la fonction
        let professeurId = 0
        let professeur = -1

        // S'il y a un professeur dans l'url
        if (url.searchParams.get("prof")!=null) {
            // Recherche du professeur dans professeur
            professeurs.map( async (prof)=>{
                if (prof.name.toLowerCase()==url.searchParams.get("prof").toLowerCase()) {
                  professeurId=prof.id
                }
            })

            // Création d'une Date
            let date = new Date()

            // Vérification de la présence d'une date dans l'url
            if ( url.searchParams.get("date")!="") {
                date =new Date(url.searchParams.get("date"))
            }
            // Requête pour récupérer l'edt d'un professeur à la date chosit
            const professeurResponse = await fetch(baseUrl+'/teacher/'+professeurId+"/"+formatDateToString(date))
            professeur = await professeurResponse.json();
        }
        // Récupération du nom du professeur dans l'url
        const nomProfesseur = url.searchParams.get("prof")
        return {professeurs,professeur,nomProfesseur}
    } catch (error) {
        const professeurs=[]
        const professeur = []
        const nomProfesseur = "L'Api ScheduleTrack Nantes"
        return {professeurs,professeur,nomProfesseur}
    }
}

/* Création et export du composant Prof */

export default function Prof() {
    // Fonction pour récupérer les données renvoyé par loader()
    const {professeurs,professeur,nomProfesseur} = useLoaderData()
    // Fonction pour envoyer des données à la page
    const submit = useSubmit()

    // Variables utiles au composant
    let rooms = []
    let alreadySearched = false 
    let i = 0

    // re-Définition des variables
    if (professeur!=-1) {
        alreadySearched=true
        rooms = professeur
    }

    /* Affichage du composant */
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
            
            {  /* Affichage dynamique de l'edt d'un professeur*/
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
                                {/*Affichage de la date en format hh-mm*/}
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