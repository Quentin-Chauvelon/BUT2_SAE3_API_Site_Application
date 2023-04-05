/* Import des composants vite et de leurs méthodes
   et de la fonction setToken et de la variable baseUrl
*/
import {Link, redirect, useActionData, Form} from "react-router-dom"
import {setToken,baseUrl} from "../main.jsx"

/* Définition de la fonction action*/

export async function action({ request, params }) {
    /* Récupération des données du Form */
    const formData = await request.formData();

    /* Requête sur l'api pour vérifier le login et password,
       et renvoie un token si la connexion est correct*/
    const response = await fetch(baseUrl+'/user/login', {
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
    
    // Présence d'un attribut token // Connexion validé
    if (json.token) {
        // re-Définission du token
        setToken(json.token);
        // Redirection au home
        return redirect("/app/home");
    }

    const error = true;
    return error
} 

/* Création et export du composant Login */

export default function Login() {
    // Recupération error
    const error = useActionData();

    /* Affichage du composant */
    return (
        <>
            <div className="homeConnexion">
                <div className="connexion">
                    <div className="Sc">Connexion</div>
                    <div className="barre-h1"></div>

                    <Form method="post">
                        <input name="login" className="bodyInput" placeholder="Login" required/><br/>
                        <input name="password" className="bodyInput" placeholder="Password" type="password" required/><br/>
                        {
                            (error)
                                ? <p className="error">Login ou mot de passe incorrect</p>
                                : null
                        }
                        <button name="register" className="bodyButton Sc">Entrer</button><br/>
                    </Form>
                    
                    <Link to={"/register"} className="petit Sc a">Créez un compte ?</Link>
                </div>

                <div className="barre-v"></div>
                <div className="barre-h3"></div>
                <div className="visiteur">
                    <div className="Sc">Visiteur</div>
                    <div className="barre-h2"></div>
                    <p className="Sc">“Je jure solennellement que mes intentions sont mauvaises”</p>
                    <Link to={"/app/home"}><button name="register" className="bodyButton Sc">Entrer</button></Link> 
                </div>
            </div>

        </>
    );
}
