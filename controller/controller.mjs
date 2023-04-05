"use strict"

import {teacherDao} from "../dao/teacherDao.mjs";
import {scheduleDao} from "../dao/scheduleDao.mjs";
import {roomDao} from "../dao/roomDao.mjs";
import {userDao} from "../dao/userDao.mjs";
import {groupDao} from "../dao/groupDao.mjs";

import {Schedule} from "../model/schedule.mjs"
import {Cours} from "../model/cours.mjs"
import {Room} from "../model/room.mjs"
import {User} from "../model/user.mjs"
import {ScheduleType} from "../model/scheduleType.mjs";

import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";
import fetch from "node-fetch";
import HttpsProxyAgent from 'https-proxy-agent';

const proxy = process.env.https_proxy

let agent = null
if (proxy != undefined) {
    agent =  new HttpsProxyAgent(proxy);
}
else {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

let lastUpdate = null;
const PRIVATE_KEY = "OnDevraitTrouverMieux"

// Les emplois du temps étant mis à jour tous les jours aux alentours de minuit,
// si la dernière requête n'a pas été réalisé aujourd'hui, on vide la base de données.
const clearDatabaseIfNotUpdatedToday = async () => {
    const today = new Date();
    
    if (
        lastUpdate == null ||
        lastUpdate.getFullYear() != today.getFullYear() ||
        lastUpdate.getMonth() != today.getMonth() ||
        lastUpdate.getDate() != today.getDate()
    ) {
        try {
            await scheduleDao.deleteAll();
            lastUpdate = new Date()
        } catch (e) {}
    }
}


// Permet de vérifier que le token est toujours valide
const verifyToken = (token) => {
    if (!token) {
      return {message: "A token is required for authentification"};
    }

    try {
      return jwt.verify(token, PRIVATE_KEY);
    } catch (err) {
      return {message: "Invalid token"};
    }
  };
  

export const controller = {
    findGroups : async() => {
        try {
            // Si l'utilisateur n'a pas fait de requêtes aujourd'hui, on vide la base de données
            clearDatabaseIfNotUpdatedToday()

            return await groupDao.findAll();
            
        } catch (e) {
            return Promise.reject({message : "error"})
        }
    },

    findByDay : async(id, date, scheduleType) => {
        try {
            // Si l'utilisateur n'a pas fait de requêtes aujourd'hui, on vide la base de données
            clearDatabaseIfNotUpdatedToday()

            // On vérifie que l'id correspond bien à l'id d'un groupe ou d'un professeur
            const teacher = await teacherDao.find(id);
            const group = await groupDao.find(id);
            if (teacher == null && group == null) {
                return null;
            }

            // Si l'edt n'est pas dans la base de données (s'il n'a pas déjà été récupéré dans la journée)
            // alors on fetch l'ics pour récupérer l'edt et on l'ajoute à la base de données pour ne pas avoir à fetch à nouveau
            let schedule = await scheduleDao.find(id);
            if (schedule == null) {
                schedule = await scheduleDao.save(id, scheduleType)
            }

            if (schedule == null) {
                return null
            }

            return await scheduleDao.findByDay(schedule, date)

        } catch (e) {
            return Promise.reject({message : "error"})
        }
    },

    findByTime : async(id, time, scheduleType) => {
        try {

            // Si l'utilisateur n'a pas fait de requêtes aujourd'hui, on vide la base de données
            clearDatabaseIfNotUpdatedToday()

            // On vérifie que l'id correspond bien à l'id d'une salle
            const room = await roomDao.find(id);
            if (room == null) {
                return null;
            }

            // Si l'edt n'est pas dans la base de données (s'il n'a pas déjà été récupéré dans la journée)
            // alors on fetch l'ics pour récupérer l'edt et on l'ajoute à la base de données pour ne pas avoir à fetch à nouveau
            let schedule = await scheduleDao.find(room.id);
            if (schedule == null) {
                schedule = await scheduleDao.save(room.id, scheduleType)
            }

            if (schedule == null) {
                return null
            }

            return await scheduleDao.findByTime(schedule, time)

        } catch (e) {
            return Promise.reject({message : "error"})
        }
    },

    findByWeek : async(id, date, scheduleType) => {
        try {

            // Si l'utilisateur n'a pas fait de requêtes aujourd'hui, on vide la base de données
            clearDatabaseIfNotUpdatedToday()

            const week= [];
            // On fixe la date au début de la semaine
            date.setDate((date.getDate() - date.getDay() ));

            // On crée les dates de tous les jours correspondant à la semaine du jour donnée en paramètre
            for (let i = 0; i < 7; i++) {
                week.push(
                    new Date(date)
                ); 
                date.setDate(date.getDate() + 1);
            }

            const schedules = [];

            let schedule = await scheduleDao.find(id);
            if (schedule == null) {
                schedule = await scheduleDao.save(id, scheduleType)
            }
                
            if (schedule == null) {
                return null
            }
            
            for (const day of week) {
                schedules.push(await scheduleDao.findByDay(schedule, day))
            }

            return schedules

        } catch (e) {
            return Promise.reject({message : "error"})
        }
    },

    populate : async(fileName) => {
        try {
            switch (fileName) {
                case "groups":
                    return await groupDao.populate("./data/groups.csv")

                case "rooms":
                    return await roomDao.populate("./data/rooms.csv")

                case "teachers":
                return await teacherDao.populate("./data/teachers.csv")
                
                default:
                    return null;
            }

        } catch (e) {
            return Promise.reject({message : "error"})
        }
    },

    findTeacher : async (teacherName, date) => {
        try {
            const teacher = await teacherDao.findByName(teacherName);
            if (teacher == null) {
                return null;
            }

            const classes = await scheduleDao.findByDay(teacher.getScheduleURL(), date)
            return classes

        } catch (e) {
            return Promise.reject({message : "error"})
        }
    },

    findTeachers : async () => {
        try {
            return await teacherDao.findAll();

        } catch (e) {
            return Promise.reject({message : "error"})
        }
    },

    findRoom : async (id, time) => {
        try {
            // On vérifie que l'id est un id valide de salle
            const room = await roomDao.find(id);
            if (room == null) {
                return null;
            }

            const cours = await scheduleDao.findByTime(room.getScheduleURL(), time);

            return cours

        } catch (e) {
            return Promise.reject({message : "error"})
        }
    },

    findRooms : async(computerRoomsOnly, time, scheduleType) => {
        try {
            const rooms = await roomDao.findAll();
            const freeRooms = [];

            for (const room of rooms) {

                // on filtre les salles informatiques uniquement si nécessaire
                if (computerRoomsOnly == false || room.computerRoom) {
                    const roomSchedule = await controller.findByTime(room.id, time, scheduleType);

                    if (roomSchedule.length == 0) {
                        freeRooms.push(room);
                    }
                }
            }

            return freeRooms

        } catch (e) {
            return Promise.reject({message : "error"})
        }
    },

    register : async (user) => {
        try {
            const userAlreadyExists = await userDao.find(user.login)
            if (userAlreadyExists) {
                return null
            }

            // on crée un token permettant à l'utilisateur de rejouer ce token quand il veut réaliser une action en lien avec son compte
            const token = jwt.sign(
                { login: user.login },
                PRIVATE_KEY,
                {
                    expiresIn: "1h",
                }
            );

            const userToAdd = new User({
                login: user.login,
                password: bcrypt.hashSync(user.password, 8),
                favoriteSchedule: 0,
                favoriteAddress: "",
                favoriteTransitMode: "transit",
                token: token
            })

            const userAdded = await userDao.add(userToAdd);
            return {token: userAdded.token}


        } catch (e) {
            return Promise.reject({message : "error"})
        }
    },

    login : async (user) => {
        try {
            const userFound = await userDao.find(user.login)
            if (!userFound || !bcrypt.compareSync(user.password, userFound.password)) {
                return {message: "not found"}
            }

            // on crée un token permettant à l'utilisateur de rejouer ce token quand il veut réaliser une action en lien avec son compte
            const token = jwt.sign(
                { login: user.login },
                PRIVATE_KEY,
                {
                    expiresIn: "1h",
                }
            );

            userFound.token = token

            const userUpdated = await userDao.update(userFound)
            return {token: userUpdated.token}

        } catch (e) {
            return Promise.reject({message : "error"})
        }
    },

    deleteUser : async(token) => {
        try {
            const user = await userDao.findByToken(token)
            if (user == null) {
                return {message: "not found"}
            }

            // on vérifie que le token soit valide (non expiré)
            const validToken = verifyToken(user.token)
            if (!validToken.login) {
                return {message: validToken}
            }

            return await userDao.delete(user.login);

        } catch(e) {
            return Promise.reject({message : "error"})
        }
    },

    deleteAllUsers : async() => {
        try {
            return await userDao.deleteAll();
        } catch(e) {
            return Promise.reject({message : "error"})
        }
    },


    setFavorite : async(token, favoriteSchedule) => {
        try {
            const user = await userDao.findByToken(token)
            if (user == null) {
                return {message: "not found"}
            }

            // on vérifie que le token soit valide (non expiré)
            const validToken = verifyToken(user.token)
            if (!validToken.login) {
                return {message: validToken}
            }

            user.favoriteSchedule = favoriteSchedule
            const userUpdated = await userDao.update(user)
            return {favoriteSchedule: userUpdated.favoriteSchedule}

        } catch (e) {
            return Promise.reject({message : "error"})
        }
    },

    getFavorite : async (token) => {
        try {
            const user = await userDao.findByToken(token)
            if (user == null) {
                return {message: "not found"}
            }

            // on vérifie que le token soit valide (non expiré)
            const validToken = verifyToken(token)
            if (!validToken.login) {
                return {message: validToken}
            }

            return {favoriteSchedule: user.favoriteSchedule}

        } catch (e) {
            return Promise.reject({message : "error"})
        }
    },

    setFavoriteAddress : async(token, favoriteAddress) => {
        try {
            const user = await userDao.findByToken(token)
            if (user == null) {
                return {message: "not found"}
            }

            // on vérifie que le token soit valide (non expiré)
            const validToken = verifyToken(user.token)
            if (!validToken.login) {
                return {message: validToken}
            }

            user.favoriteAddress = favoriteAddress
            const userUpdated = await userDao.update(user)
            return {favoriteAddress: userUpdated.favoriteAddress}

        } catch (e) {
            return Promise.reject({message : "error"})
        }
    },

    getFavoriteAddress : async (token) => {
        try {
            const user = await userDao.findByToken(token)
            if (user == null) {
                return {message: "not found"}
            }

            // on vérifie que le token soit valide (non expiré)
            const validToken = verifyToken(token)
            if (!validToken.login) {
                return {message: validToken}
            }

            return {favoriteAddress: user.favoriteAddress}

        } catch (e) {
            return Promise.reject({message : "error"})
        }
    },

    setFavoriteTransitMode : async(token, favoriteTransitMode) => {
        try {
            const user = await userDao.findByToken(token)
            if (user == null) {
                return {message: "not found"}
            }

            // on vérifie que le token soit valide (non expiré)
            const validToken = verifyToken(user.token)
            if (!validToken.login) {
                return {message: validToken}
            }

            user.favoriteTransitMode = favoriteTransitMode
            const userUpdated = await userDao.update(user)
            return {favoriteTransitMode: userUpdated.favoriteTransitMode}

        } catch (e) {
            return Promise.reject({message : "error"})
        }
    },

    getFavoriteTransitMode : async (token) => {
        try {
            const user = await userDao.findByToken(token)
            if (user == null) {
                return {message: "not found"}
            }

            // on vérifie que le token soit valide (non expiré)
            const validToken = verifyToken(token)
            if (!validToken.login) {
                return {message: validToken}
            }

            return {favoriteTransitMode: user.favoriteTransitMode}

        } catch (e) {
            return Promise.reject({message : "error"})
        }
    },

    directions : async (origin, arrivalTime, transitMode) => {
        try {
            // on fetch l'API google maps (en utilisant un agent sinon on est bloqué par le proxy)
            const result = (agent != null)
                ? await fetch(
                    "https://maps.googleapis.com/maps/api/directions/json?" +
                    "origin=" + origin + 
                    "&destination=place_id:ChIJpy2TCz7wBUgRo4Ly_iTXbto" + 
                    "&arrival_time=" + arrivalTime / 1000 +
                    "&mode=" + transitMode +
                    "&key=AIzaSyDoM4U5lz87DBlZL2KQ8tmtUQBopQKr09Y",
                    {agent: agent}
                )

                : await fetch(
                    "https://maps.googleapis.com/maps/api/directions/json?" +
                    "origin=" + origin + 
                    "&destination=place_id:ChIJpy2TCz7wBUgRo4Ly_iTXbto" + 
                    "&arrival_time=" + arrivalTime / 1000 +
                    "&mode=" + transitMode +
                    "&key=AIzaSyDoM4U5lz87DBlZL2KQ8tmtUQBopQKr09Y",
                )

            return await result.json()

        } catch (e) {
            return Promise.reject({message : "error"})
        }
    },
}
