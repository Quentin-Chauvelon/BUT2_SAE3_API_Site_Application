
import {Link, useFetcher, redirect} from "react-router-dom"


export async function action({ request, params }) {
    const formData = await request.formData();

    const response = await fetch('http://172.26.82.56:443/user/login', {
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
        return redirect("/home/");
    }

    return null
    // return updateContact(params.contactId, {
    //   favorite: formData.get("favorite") === "true",
    // });
} 


export default function Login() {
    const fetcher = useFetcher()

    return (
        <>
            <div className="homeConnexion">
                <div className="connexion">
                    <div className="Sc">Connexion</div>
                    <div className="barre-h1"></div>

                    <fetcher.Form method="post">
                        <input name="login" className="bodyInput" placeholder="Login"/><br/>
                        <input name="password" className="bodyInput" placeholder="Password" type="password"/><br/>
                        <button name="register" className="bodyButton Sc">Entrer</button><br/>
                    </fetcher.Form>
                    
                    <Link to={"/register"} className="petit Sc">Créez un compte ?</Link>
                </div>

                <div className="barre-v"></div>
                <div className="barre-h3"></div>
                <div className="visiteur">
                    <div className="Sc">Visiteur</div>
                    <div className="barre-h2"></div>
                    <p className="Sc">“Je jure solennellement que mes intentions sont mauvaises”</p>
                    <Link to={"/home"} className="bodyButton Sc">Entrer</Link>
                </div>
            </div>
        </>
    );
}
