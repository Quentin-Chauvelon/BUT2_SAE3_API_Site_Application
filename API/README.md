# Guide de déploiement et d'utilisation de l'API RESTful *ScheduleTrack Nantes*

## Introduction

Ce guide explique comment déployer et utiliser l'API RESTful *ScheduleTrack Nantes* sur votre ordinateur en local ou sur un serveur distant.

## Déploiement

### Prérequis
> Node.js version 18.15 <br/>
> Npm version 9.5.0 <br/>

# Etapes de déploiement

1. Télécharger ou clonez le code source de l'API depuis le dépôt <a href="">Gitlab</a>
2. Ouvrez un terminal et accédez au répertoire racine de l'application. 
3. Exécutez la commande **npm install** pour installer toutes les dépendances nécessaires.
4. Configurez la variable **server** dans le fichier **server.mjs** à la racine du projet, on lui mettant l'host et le port voulu (ex: host:localhost port:3000 | host:172.26.82.56 port:443). 
5. Exécutez la commande **node startServer.mjs** pour démarrer l'API.

L'API RESTful est maintenant accessible à l'adresse choisie. Vous avez un retour terminal de l'url de l'api. (ex: Server running at: http://172.26.82.56:443)


## Utilisation

## Conclusion

Ce guide vous permettra de déployer et d'utiliser l'API RESTful *ScheduleTrack  Nantes* sur votre ordinateur local ou sur un serveur distant. Si vous avez des questions ou des problèmes, n'hésitez pas à nous contacter pour obtenir de l'aide.

## Test

172.26.82.56:443/documentation
