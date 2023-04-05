# Guide de déploiement et d'utilisation de l'application web *ScheduleTrack Nantes*

## Introduction

---

Ce guide explique comment déployer et utiliser l'application web *ScheduleTrack Nantes* sur votre ordinateur en local ou sur un serveur distant.

Cette application permet de consulter son emploi du temps, mais aussi de localiser un professeur de l'IUT de Nantes et de trouver les salles libres à un moment donné. Nous souhaitons également permettre la synchronisation de l'emploi du temps avec l'API de la TAN pour savoir comment se rendre à l'IUT en fonction de l'heure de début des cours.

## Déploiement

--- 

### Prérequis

> Node.js version 18.15 <br/>
> Npm 9.5.0 <br/>

### Étapes de déploiement

1. Téléchargez ou clonez le code source de l'application depuis le dépôt <a href="https://gitlab.univ-nantes.fr/pub/but/but2/sae4-real-01/eq_init_01_01_angot-mael_blourde-nolan_calcagni-amedeo_chauvelon-quentin_osselin-arthur/-/tree/main/Application%20Web">GitLab</a>.
2. Ouvrez un terminal et accédez au répertoire racine de l'application.
3. Exécutez la commande `npm install`  pour installer toutes les dépendances nécessaires.
4. Configurez le fichier `vite.config.js` présent dans la racine du projet en remplaçant votre `adresse IP` et le `port` (ex: localhost:3000 port:3000 | 172.26.82.56 port:80).
5. Exécutez la commande `npm run dev` pour démarrer l'application.

L'application est maintenant accessible à l'adresse choisie.

## Utilisation

---

Une fois l'application déployée, si vous voulez l'utiliser à son plein potentiel, il va falloir passer au déploiement de notre API *ScheduleTrack Nantes*. <a href="https://gitlab.univ-nantes.fr/pub/but/but2/sae4-real-01/eq_init_01_01_angot-mael_blourde-nolan_calcagni-amedeo_chauvelon-quentin_osselin-arthur/-/tree/main/API">Lien GitLab</a> ( /!\ L'API peut être sur la même adresse que l'application web mais pas le même port ! )

Une fois l'API déployée et active, vous devez configurer la variable `baseUrl` dans le fichier `src/main.jsx` à la racine du projet, qui sera `l'adresse IP` de l'API.

Maintenant, les deux applications vont pouvoir communiquer entre elles.

Fonctionnalités principales de l'application :

- Affichage des emplois du temps de l'IUT de Nantes (BUT INFO)
- Affichage des salles disponibles sur le site Joffre
- Affichage des emplois du temps des professeurs
- Affichage de l'itinéraire pour se rendre sur le site Joffre en fonction du premier cours de la journée ou d'un cours choisi depuis l'emploi du temps

Pour utiliser l'application, il vous suffit de naviguer grâce à la navbar (Accueil | Salles | Professeurs | Itinéraire), de suivre les indications et de cliquer sur les différents boutons pour pouvoir afficher les résultats demandés.

## Conclusion

---

Ce guide vous permettra de déployer et d'utiliser l'application *ScheduleTrack Nantes* sur votre ordinateur local ou sur un serveur distant. Si vous avez des questions ou des problèmes, n'hésitez pas à nous contacter pour obtenir de l'aide.

Si vous voulez voir le rendu final de notre application web, cliquez ici : http://172.26.82.56.