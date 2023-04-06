# Guide de déploiement et d'utilisation de l'API RESTful *ScheduleTrack Nantes*

## Introduction

Ce guide explique comment déployer et utiliser l'API RESTful *ScheduleTrack Nantes* sur votre ordinateur en local ou sur un serveur distant.

## Déploiement

### Prérequis

> Node.js version 18.15 <br/>
> Npm version 9.5.0 <br/>

## Etapes de déploiement

1. Télécharger ou clonez le code source de l'API depuis le dépôt <a href="">Gitlab</a>
2. Ouvrez un terminal et accédez au répertoire racine de l'application. 
3. Exécutez la commande `npm install` pour installer toutes les dépendances nécessaires.
4. Configurez la variable `server` dans le fichier `/API/server.mjs`, on lui mettant l'host et le port voulu (ex: host:localhost port:3000 | host:172.26.82.56 port:443).
5. Exécutez la commande `node startServer.mjs` pour démarrer l'API.

L'API RESTful est maintenant accessible à l'adresse choisie. Vous avez un retour terminal de l'url de l'API. (ex: Server running at: http://172.26.82.56:443)

## Utilisation

Une fois l'application déployée, si vous voulez l'essayer vous pouvez faire des requêtes http. Cependant vous pouvez vous amuser à déployer notre application web *ScheduleTrack Nantes* et vous servir de l'API dans de réelle condition. <a href="https://gitlab.univ-nantes.fr/pub/but/but2/sae4-real-01/eq_init_01_01_angot-mael_blourde-nolan_calcagni-amedeo_chauvelon-quentin_osselin-arthur/-/tree/main/Application%20Web">Lien GitLab</a>


### Technologies utilisés

> Partie serveur HTTP : Hapi <br/>
> Partie base de données : Sqlite <br/>
> Partie ORM : Prisma <br/>
> Partie Documentation : Swagger <br/>
> Partie Tests : Chai <br/>

### Open data et API tiers utilisés

Pour mener à bien ce projet d'API RESTful nous avons été obligés d'utiliser des sources de données tiers. Nous avons donc utilisé l'EDT Celcat et à partir du fichier ICS qu'il propose. Ainsi que sur l'API Direction pour pouvoir générer un itinéraire d'un point A à l'IUT de Nantes site Joffre et l'API de Google Maps pour pouvoir afficher l'itinéraire sur la carte.


### Fonctionnalités principales de l'APIRESTful:

- Créer un utilisateur et renvoyer un token
- Se connecter et renvoyer un token
- Avoir tous les professeurs de l'iut de Nantes
- Avoir tous les groupes des TP de BUT INFO
- Avoir toutes les salles libres du site Joffre pour un jour et une heure 
  données
- Avoir l'emploi du temps d'un professeur de l'IUT de Nantes pour un jour donné
- Avoir l'emploi du temps d'un des groupes des TP de BUT INFO pour un jour ou une semaine donnée
- Renvoie un itinéraire pour arriver à l'heure d'un point A à l'IUT Site Joffre avec un mode de transport choisi
- Mettre à jour les csv's (pour peupler la base de données)
- Etc ..

Pour une description plus détaillé de l'API vous pouvez utilisez la documentation générez par Swagger en allant sur `http://?ip?/documentation`.

## Mise en oeuvre des Tests :

Les tests ont été mis en oeuvre en utilisant chai.
Pour exécuter les tests, placez vous dans le dossier `/API` et exécuter la commande `npm test`.
Un retour terminal sera effectué avec les résultats associés et le coverage.

## Conclusion

Ce guide vous permettra de déployer et d'utiliser l'API RESTful *ScheduleTrack  Nantes* sur votre ordinateur local ou sur un serveur distant. Si vous avez des questions ou des problèmes, n'hésitez pas à nous contacter pour obtenir de l'aide.

Pour voir le rendu final de notre API RESTful, cliquez ici : http://172.26.82.56:443/documentation.
