/* Import des composants vite et de leurs méthodes
   et de la fonction setToken et de la variable baseUrl
*/
import {Link, redirect, Form, useActionData} from "react-router-dom"
import {setToken,baseUrl} from "../main.jsx"

/* Définition de la fonction action*/

export async function action({ request, params }) {
    /* Récupération des données du Form */
    const formData = await request.formData();
    
    /* Requête sur l'api pour vérifier l'authenticité du login et la validité du password,
       et renvoie un token si la création de compte est correct*/
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

    // Présence d'un attribut token // Connexion validé
    if (json.token) {
        // re-Définition du token
        setToken(json.token);
        // Redirection au home
        return redirect("/app/home");
    }
    
    const error = true;
    return error
} 

/* Création et export du composant Register */

export default function Register() {
    // Recupération error
    const error = useActionData();

    /* Affichage du composant */
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