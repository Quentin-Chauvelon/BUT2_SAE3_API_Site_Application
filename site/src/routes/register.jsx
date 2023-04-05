import {Link, redirect, Form, useActionData} from "react-router-dom"
import {setToken,baseUrl} from "../main.jsx"


export async function action({ request, params }) {
    const formData = await request.formData();
    
    const response = await fetch(baseUrl+'/user/register', {
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
    
    if (json.token) {
        setToken(json.token);
        return redirect("/app/home");
    }
        
    // const response = await fetch("http://172.26.82.56:443/user/login")
    // console.log(await response.json());
    
    const error = true;
    return error
    // return updateContact(params.contactId, {
    //   favorite: formData.get("favorite") === "true",
    // });
} 


export default function Register() {
    const error = useActionData();

    return (
        <>
            <div className="homeEnregistrer">
                <div className="Sc">S'enregistrer</div>
                <div className="barre-h1"></div>

                <Form method="post" className="registerForm">
                    <input name="login" className="bodyInput" placeholder="Login" required/>
                    <input name="password" className="bodyInput" placeholder="Password" type="password" required/>
                    {
                        (error)
                            ? <p className="error">Un compte existe déjà avec le mot de passe donnée</p>
                            : null
                    }
                    <button name="log in" className="bodyButton Sc">Entrer</button>
                </Form>
                <Link to={"/login"} className="Sc petit a br">Annuler ?</Link>
            </div>
        </>
    );
}