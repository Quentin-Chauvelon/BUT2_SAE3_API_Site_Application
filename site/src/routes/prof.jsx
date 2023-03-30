import {useLoaderData,useSubmit ,Form} from "react-router-dom";

export async function loader({request}) {
    console.log("fjdksqfjlm");
    // const url = new URL(request.url);
    // let prof = url.searchParams.get("prof") || "";
    // console.log(prof)
    try {
        const professeursResponse = await fetch('http://172.26.82.56:443/teachers')
        let professeurs = await professeursResponse.json();

        if (professeurs.error!=null) {
            professeurs=[];
        }
        return {professeurs}
    } catch (error) {
        const professeurs=[]
        return {professeurs}
    }
}



export default function Prof() {
    const {professeurs} = useLoaderData()
    const submit = useSubmit()

    return ( 
        <>
        <div className="rechercheProf">
            <p className="Sc grand">&nbsp;Service de recherche de Professeurs&nbsp;</p>
            <Form>
                <input name="prof" className="Sc" placeholder="Qui : Berdjugin, Arnaud, ..." list="professeurs"/>
                {/* onChange={(event) => (professeurs.find((prof) => {prof.name.toLowerCase().includes(event)})) ? submit(event.currentTarget.form) : ""} */}
                {/* onDragEnter={(event) => {submit(event.currentTarget.form)}} */}
            </Form>
            <datalist id="professeurs">
                {professeurs.map(prof=>{
                    return <option key={prof.id} id={prof.id} value={prof.name}/>
                })}
            </datalist>
        </div>
        </>
    )
}