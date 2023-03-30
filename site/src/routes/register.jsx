import {Link, useFetcher, redirect} from "react-router-dom"


export async function action({ request, params }) {
    const formData = await request.formData();
    
    const response = await fetch('http://172.26.82.56:443/user/register', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            login: formData.get("login"),
            password: formData.get("password")
        })
    });
    const json = await response.json();
    console.log(json.token);
    
    if (json.token) {
        return redirect("/app/home");
    }
        
        // const response = await fetch("http://172.26.82.56:443/user/login")
    // console.log(await response.json());
    
    return null
    // return updateContact(params.contactId, {
    //   favorite: formData.get("favorite") === "true",
    // });
} 


export default function Register() {
    const fetcher = useFetcher();

    return (
        <>
            <div className="homeEnregistrer">
                <div className="Sc">S'enregistrer</div>
                <div className="barre-h1"></div>

                <fetcher.Form method="post" className="registerForm">
                    <input name="login" className="bodyInput" placeholder="Login" required/>
                    <input name="password" className="bodyInput" placeholder="Password" type="password" required/>
                    <button name="log in" className="bodyButton Sc">Entrer</button>
                </fetcher.Form>
                <Link to={"/login"} className="Sc petit a br">Annuler ?</Link>
            </div>
        </>
    );
}