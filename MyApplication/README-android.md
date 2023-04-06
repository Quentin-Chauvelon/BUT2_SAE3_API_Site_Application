# Guide de déploiement et d'utilisation pour l'application mobile *ScheduleTrack Nantes*

## Introduction

---

Ce guide explique comment déployer les micro-services et comment compiler et utiliser l'application mobile *ScheduleTrack Nantes* sur votre téléphone ou émulateur.

Cette application permet de consulter son emploi du temps, mais aussi de localiser un professeur de l'IUT de Nantes et de trouver les salles libres à un moment donné. Nous souhaitons également permettre la synchronisation de l'emploi du temps avec l'API Google Maps pour savoir comment se rendre à l'IUT en fonction de l'heure de début des cours.

## Déploiement

--- 

### Prérequis

>  Android Gradle Plugin Version 7.2.0<br/>
> Gradle Version 7.3.3 <br/>
> SDK 32 | MIN SDK 21 <br/>
>  Java 1.8

*En cas de non conformité des prérequis l'application peut avoir des problèmes de compilation.* <br/>
*Info : Nous utilisons le Pixel 4 API 32 à pour l'émulation*

### Étapes de déploiement de l'application mobile

1. Téléchargez ou clonez le code source de l'application depuis le dépôt <a href="https://gitlab.univ-nantes.fr/pub/but/but2/sae4-real-01/eq_init_01_01_angot-mael_blourde-nolan_calcagni-amedeo_chauvelon-quentin_osselin-arthur/-/tree/main/">GitLab</a>.
2. Ouvrez Android Studio et ouvrez le répertoire racine de l'application mobile.
3. Lancez la compilation du projet en cliquant sur le **marteau vert**.


### Étapes de déploiement des micro-services

Par défaut notre application mobile utilise notre APIRESTful, celle-ci est déployée sur une machine virtuelle de l'IUT de Nantes et n'est accessible que depuis les machines de l'IUT ou en activant le VPN de l'IUT (Ivanti). Url APIRESTful : http://172.26.82.56:443/documentation.

Si vous n'avez pas accès à notre API il falloir la déployer de votre côté en local ou sur une machine distante. Nous avons déjà fais un *Guide de déploiement pour notre API*. <a href="https://gitlab.univ-nantes.fr/pub/but/but2/sae4-real-01/eq_init_01_01_angot-mael_blourde-nolan_calcagni-amedeo_chauvelon-quentin_osselin-arthur/-/tree/main/API">Lien GitLab Guide</a>

Dans le cas inverse vous pouvez directement aller à **Utilisation**.

Après avoir déployé l'API, il vous faut changer la classe `BaseURL` dans `app/src/main/java/com/example/myapplication/BaseURL.kt`. Vous devez modifier les deux variables `url` et `port` par ce que vous avez mis dans l'API (ex: url="http://localhost" port="443").

Maintenant, les deux applications vont pouvoir communiquer entre elles.

L'application mobile est maintenant utilisable. Vous pouvez l'exporter sur votre télephone pour la tester, ou l'essayer sur un émulateur.

## Utilisation

---

Fonctionnalités principales de l'application mobile :

- Affichage des emplois du temps de l'IUT de Nantes (BUT INFO)
- Affichage des salles disponibles sur le site Joffre
- Affichage des emplois du temps des professeurs
- Affichage de l'itinéraire pour se rendre sur le site Joffre en fonction du premier cours de la journée ou d'un cours choisi depuis l'emploi du temps

Pour utiliser l'application, il vous suffit de naviguer grâce à la barre de navigation, de suivre les indications et de cliquer sur les différents boutons pour pouvoir afficher les résultats demandés.

## Conclusion

---

Ce guide vous permettra de déployer et d'utiliser l'application mobile *ScheduleTrack Nantes* sur votre téléphone ou émulateur. Si vous avez des questions ou des problèmes, n'hésitez pas à nous contacter pour obtenir de l'aide.
