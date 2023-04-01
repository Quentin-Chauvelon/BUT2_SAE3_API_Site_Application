import {useLoaderData,useSubmit ,Form} from "react-router-dom";

export async function loader({request}) {
    // const url = new URL(request.url);
    // let prof = url.searchParams.get("prof") || "";
    // console.log(prof)
    try {
        const url = new URL(request.url);

        const professeursResponse = await fetch('http://172.26.82.56:443/teachers')
        let professeurs = await professeursResponse.json();

        if (professeurs.error!=null) {
            professeurs=[];
        }

        let professeurId = 0
        let professeur = -1
        if (url.searchParams.get("prof")!=null) {
            professeurs.map( async (event)=>{
                if (event.name==url.searchParams.get("prof")) {
                  professeurId=event.id
                }
            })
            const professeurResponse = await fetch('http://172.26.82.56:443/teacher/'+professeurId)
            professeur = await professeurResponse.json();
        }
        return {professeurs,professeur}
    } catch (error) {
        const professeurs=[]
        const professeur = []
        return {professeurs,professeur}
    }
}



export default function Prof() {
    const {professeurs,professeur} = useLoaderData()
    const submit = useSubmit()



    return ( 
        <>
        <div className="rechercheProf">
            <p className="Sc grand">&nbsp;Service de recherche de Professeurs&nbsp;</p>
            <Form>
                <input name="prof" className="Sc" placeholder="Qui : Berdjugin, Arnaud, ..." list="professeurs" onDragEnter={(event) => {submit(event.currentTarget.form)}}/>
                {/* onChange={(event) => (professeurs.find((prof) => {prof.name.toLowerCase().includes(event)})) ? submit(event.currentTarget.form) : ""} */}
                {/* onDragEnter={(event) => {submit(event.currentTarget.form)}} */}
            </Form>
            <datalist id="professeurs"> 
                {professeurs.map(prof=>{
                    return <option key={prof.id} id={prof.id} value={prof.id}>{prof.name}</option>
                })}
            </datalist>
            <p className="Sc" id="None">Vous pourrez le trouvez :</p>
        </div>
        </>
    )
}