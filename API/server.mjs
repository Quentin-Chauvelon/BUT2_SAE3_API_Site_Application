'use strict';

import Hapi from '@hapi/hapi';
import Jois from 'joi';

import fetch from "node-fetch";

import JoiDate from '@hapi/joi-date'
const Joi = Jois.extend(JoiDate)

import Inert from '@hapi/inert'
import Vision from '@hapi/vision';
import HapiSwagger from 'hapi-swagger';

import {controller} from "./controller/controller.mjs";

import {ScheduleType} from "./model/scheduleType.mjs"

// Partie JOI - Définitions des objets joi
const joiCours = Joi.object({
    id : Joi.number().integer().description("L'id d'une salle doit être unique"),
    start : Joi.date().description("Date de début du cours"),
    end : Joi.date().description("Date de début du cours"),
    summary : Joi.string().allow(null, '').required().description("Corps du cours (quel cours, etc)"),
    location : Joi.string().allow(null, '').required().description("identifiant de la salle ( EX-XX )"),
    roomId :  Joi.number().integer().required().description("L'id d'une salle"),
    Schedule : Joi.array(), 
}).description('Cours')

const joiCoursTab = Joi.array().items(joiCours).description("A collection of Cours")


const joiSchedule = Joi.object({
    id : Joi.number().integer().required().description("L'identifiant d'un emploi du temps doit être unique"),
    classes : joiCoursTab,
    type : Joi.string().required().description("Le type d'emploi du temps ('prof/etudiant/ ')"),
}).description('Schedule')

const joiScheduleTab = Joi.array().items(joiSchedule).description("A collection of Schedule")


const joiTeacher = Joi.object({
    id : Joi.number().integer().required().description("L'id d'un professeur doit être unique"),
    name : Joi.string().required().description("Le nom du professeur"),
}).description('Teacher')

const joiTeacherTab = Joi.array().items(joiTeacher).description("A collection of Teacher")


const joiRoom = Joi.object({
    id : Joi.number().integer().required().description("L'id d'une salle doit être unique"),
    name : Joi.string().allow(null, '').required().description("Le nom de la salle"),
    computerRoom : Joi.boolean().required().description("Vaut vrai quand la salle est équipée de matériel informatique")
}).description('Room')

const joiRoomsTab = Joi.array().items(joiRoom).description("A collection of Rooms")


const joiUserSansMdp = Joi.object({
    login : Joi.string().required().description("Le login d'un utilisateur doit être unique"),
    favoriteSchedule : Joi.number().integer().required().description("L'identifiant de l'emploi du temps favori de l'utilisateur"),
    favoriteAddress : Joi.string().allow(null, '').required().description("L'adresse favorite de l'utilisateur"),
    favoriteTransitMode : Joi.string().allow(null, '').required().description("Le mode de transport favori de l'utilisateur"),
    token : Joi.string().allow(null, '').required().description("Dernier web token connu de l'utilisateur"),
}).description('User')

const joiToken = Joi.object({
    token: Joi.string().required().description("Le token associé au compte utilisateur")
})

const joiGroup = Joi.object({
    id: Joi.number().integer().required().description("L'id du groupe doit être unique"),
    name: Joi.string().required().description("Le nom du groupe")
}).description("Groupe")

const joiGroupsTab = Joi.array().items(joiGroup).description("A collection of Groupe")



const notFound = Joi.object({
    message: "not found"
})

const errorMessage = Joi.object({
    message: "error"
})


// Partie Swagger
const swaggerOptions = {
    info: {
        title: "API ScheduleTrack Nantes",
        version: '1.0.0',
    }
};


export const formatStringToDate = function formatStringToDate(stringDate) {
    const [date, time] = stringDate.split("T")
    
    const year = parseInt(date.substring(0,4))
    const month = parseInt(date.substring(4,6))
    const day = parseInt(date.substring(6,8))
    
    const hour = parseInt(time.substring(0,2))
    const minute = parseInt(time.substring(2,4))
    
    return new Date(year, month - 1, day, hour + 2, minute, 0)
}


function getIdFromPayload(payloadId) {
    // on parse l'id et on vérifie avec un try catch qu'il a bien un format valide
    let id = 0;
    try {
        id = parseInt(payloadId)
        if (isNaN(id)) {
            id = 0;
        }
    } catch(e) {}

    return id;
}

function getDateFromPayload(payloadDate) {
    let date = ""
    try {
        date = (payloadDate) ? formatStringToDate(payloadDate) : new Date()
    } catch(e) {
        return {message: 'date invalide'}
    }

    return date
}


const routes =[    
    {
        method: '*',
        path: '/{any*}',
        options : {
            description : "Route par défaut",
            notes : 'Route par défaut',
            tags : ['api'],
            response: {
                status: {
                    404 : notFound
                }
            }
        },
        handler: function (_, h) {
            return h.response({message: 'not found'}).code(404)
        }
    },

    {
        method: 'GET',
        path: '/groups',
        options : {
            description : "Renvoie la liste des groupes disponibles",
            notes : 'Renvoie la liste des groupes disponibles',
            tags : ['api'],
            response: {
                status: {
                    200 : joiGroupsTab.description("La liste des groupes disponibles"),
                    400 : Joi.object()
                }
            }
        },
        handler: async (request, h) => {
            try {
                const groups = await controller.findGroups();
                
                return h.response(groups).code(200)
                
            } catch (e) {
                return h.response(e).code(400)
            }
        }
    },
    
    {
        method: 'GET',
        path: '/schedule/day/{id}/{date?}',
        options : {
            description : "Renvoie les cours du jour pour l'id du groupe donné et la date donnée",
            notes : "Renvoie les cours du jour pour l'id du groupe donné et la date donnée",
            tags : ['api'],
            validate: {
                params: Joi.object({
                    id : Joi.string().description("L'id du groupe"),
                    date : Joi.string().allow(null, "").description("La date ou vide (par défaut, la date du jour est utilisée)"),
                }),
            },
            response: {
                status: {
                    200 : joiCoursTab.description("La liste des cours du jour"),
                    404 : notFound,
                    400 : Joi.object()
                }
            }
        },
        handler: async (request, h) => {
            try {
                const id = getIdFromPayload(request.params.id)
                const date = getDateFromPayload(request.params.date)
                if (date.message) { return h.response(date).code(400)}
                
                const classes = await controller.findByDay(id, date, ScheduleType.Schedule)

                if (classes != null) {
                    return h.response(classes).code(200)
                } else {
                    return h.response({message: 'not found'}).code(404)
                }
                
            } catch (e) {
                return h.response(e).code(400)
            }
        }
    },

    {
        method: 'GET',
        path: '/schedule/week/{id}/{date?}',
        options : {
            description : "Renvoie les cours de la semaine pour l'id du groupe donné et la date donnée",
            notes : "Renvoie les cours de la semaine pour l'id du groupe donné et la date donnée",
            tags : ['api'],
            validate: {
                params: Joi.object({
                    id : Joi.string().description("L'id du groupe"),
                    date : Joi.string().allow(null, "").description("La date ou vide (par défaut, la date du jour est utilisée)"),
                })
            },
            response: {
                status: {
                    200 : Joi.array().items(joiCoursTab).description("La liste des cours de la semaine"),
                    404 : notFound,
                    400 : Joi.object()
                }
            }
        },
        handler: async (request, h) => {
            try {
                const id = getIdFromPayload(request.params.id)
                const date = getDateFromPayload(request.params.date)
                if (date.message) { return h.response(date).code(400)}

                const classes = await controller.findByWeek(id, date, ScheduleType.Schedule)
                
                if (classes != null) {
                    return h.response(classes).code(200)
                } else {
                    return h.response({message: 'not found'}).code(404)
                }
                
            } catch (e) {
                return h.response(e).code(400)
            }
        }
    },

    {
        method: 'GET',
        path: '/teacher/{id}/{date?}',
        options : {
            description : "Renvoie les cours du jour pour l'id du professeur donné et la date donnée",
            notes : "Renvoie les cours du jour pour l'id du professeur donné et la date donnée",
            tags : ['api'],
            validate: {
                params: Joi.object({
                    id : Joi.string().description("L'id du professeur"),
                    date : Joi.string().allow(null, "").description("La date ou vide (par défaut, la date du jour est utilisée)"),
                })
            },
            response: {
                status: {
                    200 : joiCoursTab.description("La liste des cours du professeur"),
                    404 : notFound,
                    400 : Joi.object()
                }
            }
        },
        handler: async (request, h) => {
            try {
                const id = getIdFromPayload(request.params.id)
                const date = getDateFromPayload(request.params.date)
                if (date.message) { return h.response(date).code(400)}
                
                const classes = await controller.findByDay(id, date, ScheduleType.Teacher)
                
                if (classes != null) {
                    return h.response(classes).code(200)
                } else {
                    return h.response({message: 'not found'}).code(404)
                }
                
            } catch (e) {
                return h.response(e).code(400)
            }
        }
    },

    {
        method: 'GET',
        path: '/teachers',
        options : {
            description : 'Renvoie la liste des professeurs',
            notes : 'Renvoie la liste des professeurs',
            tags : ['api'],
            response: {
                status: {
                    200 : joiTeacherTab.description("La liste des professeurs"),
                    400 : Joi.object()
                }
            }
        },
        handler: async (request, h) => {
            try {
                const teachers = await controller.findTeachers()
                
                if (teachers != null) {
                    return h.response(teachers).code(200)
                }
                
            } catch (e) {
                return h.response(e).code(400)
            }
        }
    },
    
    {
        method: 'GET',
        path: '/room/{id}/{time?}',
        options : {
            description : "Renvoie le cours pour l'id de la salle donné et l'heure donnée",
            notes : "Renvoie le cours pour l'id de la salle donné et l'heure donnée",
            tags : ['api'],
            validate: {
                params: Joi.object({
                    id : Joi.string().description("L'id de la salle"),
                    time : Joi.string().allow(null, "").description("L'heure (date + heure) ou vide (par défaut, l'heure actuelle est utilisée)"),
                })
            },
            response: {
                status: {
                    200 : joiCoursTab.description("Le cours actuel de la salle ou un tableau vide s'il n'y a pas de cours"),
                    404 : notFound,
                    400 : Joi.object()
                }
            }
        },
        handler: async (request, h) => {
            try {
                const id = getIdFromPayload(request.params.id)
                const time = getDateFromPayload(request.params.time)
                if (time.message) { return h.response(time).code(400)}
                
                const classes = await controller.findByTime(id, time, ScheduleType.Room)
                
                if (classes != null) {
                    return h.response(classes).code(200)
                } else {
                    return h.response({message: 'not found'}).code(404)
                }
                
            } catch (e) {
                return h.response(e).code(400)
            }
        }
    },
    
    {
        method: 'GET',
        path: '/rooms/{computerRoomsOnly}/{time?}',
        options : {
            description : "Renvoie la liste des salles où il n'y a pas cours à l'heure donnée, il est possible de filtrer les salles informatiques uniquement",
            notes : "Renvoie la liste des salles où il n'y a pas cours à l'heure donnée, il est possible de filtrer les salles informatiques uniquement",
            tags : ['api'],
            validate: {
                params: Joi.object({
                    computerRoomsOnly : Joi.boolean().description("Un booléen indiquant s'il ne faut renvoyer que les salles informatiques ou toutes"),
                    time : Joi.string().allow(null, "").description("L'heure (date + heure) ou vide (par défaut, l'heure actuelle est utilisée)"),
                })
            },
            response: {
                status: {
                    200 : joiRoomsTab.description("La liste des salles actuellement disponibles"),
                    400 : Joi.object()
                }
            }
        },
        handler: async (request, h) => {
            try {
                const computerRoomsOnly = request.params.computerRoomsOnly
                const time = getDateFromPayload(request.params.time)
                if (time.message) { return h.response(time).code(400)}

                if (!time) {
                    time.setTime(time.getTime() + 2 * 60 * 60 * 1000);
                }
                
                const freeRooms = await controller.findRooms(computerRoomsOnly, time, ScheduleType.Room)
                
                return h.response(freeRooms).code(200)
                
            } catch (e) {
                return h.response(e).code(400)
            }
        }
    },

    {
        method: 'GET',
        path: '/populate/{type}',
        options : {
            description : "Lit le csv corresopndant au type donné et peuple la base de données",
            notes : "Lit le csv corresopndant au type donné et peuple la base de données",
            tags : ['api'],
            validate: {
                params: Joi.object({
                    type : Joi.string().description("Le type de données à peupler (teachers, rooms ou schedules)"),
                }),
            },
            response: {
                status: {
                    200 : Joi.array().items(Joi.object()).description("Une liste de JoiRoom, JoiGroup ou JoiTeacher représentant ce qui a été ajouté à la base de données"),
                    404 : notFound,
                    400 : Joi.object()
                }
            }
        },
        handler: async (request, h) => {
            try {
                const classes = await controller.populate(request.params.type)
                
                if (classes != null) {
                    return h.response(classes).code(200)
                } else {
                    return h.response({message: 'not found'}).code(404)
                }
            } catch (e) {
                return h.response(e).code(400)
            }
        }
    },

    {
        method: 'POST',
        path: '/user/register',
        options : {
            description : 'Permet de créer un compte',
            notes : 'Permet de créer un compte',
            tags : ['api'],
            validate: {
                payload: Joi.object({
                    login : Joi.string().description("Le login du compte à créer"),
                    password : Joi.string().description("Le mot de passe du compte à créer")
                })
            },
            response: {
                status: {
                    201 : joiToken.description("Le token permettant d'effectuer les actions liées au compte"),
                    400 : Joi.object()
                }
            }
        },
        handler: async (request, h) => {
            try {
                const userToAdd = request.payload

                const token = await controller.register(userToAdd)
                
                if (token != null) {
                    return h.response(token).code(201)
                } else {
                    return h.response({message: "user already exists"}).code(400)
                }

            } catch (e) {
                return h.response({message: 'error'}).code(400)
            }
        }
    },

    {
        method: 'POST',
        path: '/user/login',
        options : {
            description : 'Permet de se connecter à un compte existant',
            notes : 'Permet de se connecter à un compte existant',
            tags : ['api'],
            validate: {
                payload: Joi.object({
                    login : Joi.string().description("Le login du compte"),
                    password : Joi.string().description("Le mot de passe du compte")
                })
            },
            response: {
                status: {
                    201 : joiToken.description("Le token permettant d'effectuer les actions liées au compte"),
                    404 : notFound,
                    400 : Joi.object()
                }
            }
        },
        handler: async (request, h) => {
            try {
                const userToAdd = request.payload

                const token = await controller.login(userToAdd)
                
                if (token != null && !token.message) {
                    return h.response(token).code(201)
                } else if(token.message == "not found") {
                    return h.response(token).code(404)
                } else {
                    return h.response(token).code(400)
                }

            } catch (e) {
                return h.response({message: 'error'}).code(400)
            }
        }
    },

    {
        method: 'DELETE',
        path: '/user/{token}',
        options : {
            description : 'Supprime un utilisateur',
            notes : 'Supprime un utilisateur en utilisant le token donné',
            tags : ['api'],
            validate: {
                params: Joi.object({
                    token : Joi.string().description("Le token lié au compte (obtenu lors de la création du compte ou de la connexion)"),
                }),
            },
            response: {
                status: {
                    200 : joiUserSansMdp.description("Le compte qui vient d'être supprimé (le mot de passe est retiré de l'objet)"),
                    404 : notFound,
                    400 : Joi.object()
                }
            }
        },
        handler: async (request, h) => {
            try {
                const token = request.params.token

                const user = await controller.deleteUser(token)

                if (user != null && !user.message) {
                    return h.response(user).code(200)
                } else if(user.message == "not found") {
                    return h.response(user).code(404)
                } else {
                    return h.response(user).code(400)
                }

            } catch (e) {
                return h.response({message: 'error'}).code(400)
            }
        }
    },

    {
        method: 'DELETE',
        path: '/user',
        options : {
            description : 'Supprime tous les utilisateurs (utiliser pour tester)',
            notes : 'Supprime tous les utilisateurs (utiliser pour tester)',
            tags : ['api'],
            response: {
                status: {
                    200 : Joi.object(),
                    400 : Joi.object()
                }
            }
        },
        handler: async (request, h) => {
            try {
                const token = request.params.token

                return await controller.deleteAllUsers()

            } catch (e) {
                return h.response({message: 'error'}).code(400)
            }
        }
    },

    {
        method: 'PUT',
        path: '/user/favoriteSchedule',
        options : {
            description : "Permet à l'utilisateur de redéfinir son emploi du temps favori",
            notes : "Permet à l'utilisateur de redéfinir son emploi du temps favori",
            tags : ['api'],
            validate: {
                payload: Joi.object({
                    token : Joi.string().description("Le token lié au compte (obtenu lors de la création du compte ou de la connexion)"),
                    favoriteSchedule : Joi.number().description("L'id de l'emploi du temps à mettre en favori") 
                })
            },
            response: {
                status: {
                    200 : Joi.object({favoriteSchedule: Joi.number().integer().required()}).description("L'id de l'emploi du temps favori de l'utilisateur"),
                    404 : notFound,
                    400 : Joi.object()
                }
            }
        },
        handler: async (request, h) => {
            try {
                const token = request.payload.token
                const favoriteSchedule = request.payload.favoriteSchedule

                const user = await controller.setFavorite(token, favoriteSchedule)
                
                if (user != null && !user.message) {
                    return h.response(user).code(200)
                } else if(user.message == "not found") {
                    return h.response(user).code(404)
                } else {
                    return h.response(user).code(400)
                }

            } catch (e) {
                return h.response({message: 'error'}).code(400)
            }
        }
    },

    {
        method: 'GET',
        path: '/user/favoriteSchedule/{token}',
        options : {
            description : "Renvoie l'id de l'emploi du temps favori de l'utilisateur",
            notes : "Renvoie l'id de l'emploi du temps favori de l'utilisateur",
            tags : ['api'],
            validate: {
                params: Joi.object({
                    token : Joi.string().description("Le token lié au compte (obtenu lors de la création du compte ou de la connexion)"),
                })
            },
            response: {
                status: {
                    200 : Joi.object({favoriteSchedule: Joi.number().integer().required()}).description("L'id de l'emploi du temps favori de l'utilisateur"),
                    404 : notFound,
                    400 : Joi.object()
                }
            }
        },
        handler: async (request, h) => {
            try {
                const favoriteSchedule = await controller.getFavorite(request.params.token)

                if (favoriteSchedule != null && !favoriteSchedule.message) {
                    return h.response(favoriteSchedule).code(200)
                } else if(favoriteSchedule.message == "not found") {
                    return h.response(favoriteSchedule).code(404)
                } else {
                    return h.response(favoriteSchedule).code(400)
                }

            } catch (e) {
                return h.response(e).code(400)
            }
        }
    },

    {
        method: 'PUT',
        path: '/user/favoriteAddress',
        options : {
            description : "Permet à l'utilisateur de redéfinir son adresse favorite",
            notes : "Permet à l'utilisateur de redéfinir son adresse favorite",
            tags : ['api'],
            validate: {
                payload: Joi.object({
                    token : Joi.string().description("Le token lié au compte (obtenu lors de la création du compte ou de la connexion)"),
                    favoriteAddress : Joi.string().allow(null, "").description("L'adresse à mettre en favori")
                })
            },
            response: {
                status: {
                    200 : Joi.object({favoriteAddress: Joi.string().allow(null, "").required()}).description("L'adresse favorite de l'utilisateur"),
                    404 : notFound,
                    400 : Joi.object()
                }
            }
        },
        handler: async (request, h) => {
            try {
                const token = request.payload.token
                const favoriteAddress = request.payload.favoriteAddress

                const user = await controller.setFavoriteAddress(token, favoriteAddress)
                
                if (user != null && !user.message) {
                    return h.response(user).code(200)
                } else if(user.message == "not found") {
                    return h.response(user).code(404)
                } else {
                    return h.response(user).code(400)
                }

            } catch (e) {
                return h.response({message: 'error'}).code(400)
            }
        }
    },

    {
        method: 'GET',
        path: '/user/favoriteAddress/{token}',
        options : {
            description : "Renvoie l'id de l'emploi du temps favori de l'utilisateur",
            notes : "Renvoie l'id de l'emploi du temps favori de l'utilisateur",
            tags : ['api'],
            validate: {
                params: Joi.object({
                    token : Joi.string().description("Le token lié au compte (obtenu lors de la création du compte ou de la connexion)"),
                })
            },
            response: {
                status: {
                    200 : Joi.object({favoriteAddress: Joi.string().allow(null, "").required()}).description("L'adresse favorite de l'utilisateur"),
                    404 : notFound,
                    400 : Joi.object()
                }
            }
        },
        handler: async (request, h) => {
            try {
                const favoriteAddress = await controller.getFavoriteAddress(request.params.token)

                if (favoriteAddress != null && !favoriteAddress.message) {
                    return h.response(favoriteAddress).code(200)
                } else if(favoriteAddress.message == "not found") {
                    return h.response(favoriteAddress).code(404)
                } else {
                    return h.response(favoriteAddress).code(400)
                }

            } catch (e) {
                return h.response(e).code(400)
            }
        }
    },

    {
        method: 'PUT',
        path: '/user/favoriteTransitMode',
        options : {
            description : "Permet à l'utilisateur de redéfinir son mode de transport favori",
            notes : "Permet à l'utilisateur de redéfinir son mode de transport favori",
            tags : ['api'],
            validate: {
                payload: Joi.object({
                    token : Joi.string().description("Le token lié au compte (obtenu lors de la création du compte ou de la connexion)"),
                    favoriteTransitMode : Joi.string().allow(null, "").description("Le mode de transport à mettre en favori")
                })
            },
            response: {
                status: {
                    200 : Joi.object({favoriteTransitMode: Joi.string().allow(null, "").required()}).description("Le mode de transport favori de l'utilisateur"),
                    404 : notFound,
                    400 : Joi.object()
                }
            }
        },
        handler: async (request, h) => {
            try {
                const token = request.payload.token
                const favoriteTransitMode = request.payload.favoriteTransitMode

                const user = await controller.setFavoriteTransitMode(token, favoriteTransitMode)
                
                if (user != null && !user.message) {
                    return h.response(user).code(200)
                } else if(user.message == "not found") {
                    return h.response(user).code(404)
                } else {
                    return h.response(user).code(400)
                }

            } catch (e) {
                return h.response({message: 'error'}).code(400)
            }
        }
    },

    {
        method: 'GET',
        path: '/user/favoriteTransitMode/{token}',
        options : {
            description : "Renvoie le mode de transport favori de l'utilisateur",
            notes : "Renvoie le mode de transport favori de l'utilisateur",
            tags : ['api'],
            validate: {
                params: Joi.object({
                    token : Joi.string().description("Le token lié au compte (obtenu lors de la création du compte ou de la connexion)"),
                })
            },
            response: {
                status: {
                    200 : Joi.object({favoriteTransitMode: Joi.string().allow(null, "").required()}).description("Le mode de transport faovri de l'utilisateur"),
                    404 : notFound,
                    400 : Joi.object()
                }
            }
        },
        handler: async (request, h) => {
            try {
                const favoriteTransitMode = await controller.getFavoriteTransitMode(request.params.token)

                if (favoriteTransitMode != null && !favoriteTransitMode.message) {
                    return h.response(favoriteTransitMode).code(200)
                } else if(favoriteTransitMode.message == "not found") {
                    return h.response(favoriteTransitMode).code(404)
                } else {
                    return h.response(favoriteTransitMode).code(400)
                }

            } catch (e) {
                return h.response(e).code(400)
            }
        }
    },

    {
        method: 'GET',
        path: '/directions/{origin}/{arrivalTime}/{transitMode?}',
        options : {
            description : "Renvoie un objet décrivant le trajet pour aller du point d'origine donné à l'IUT pour arriver à l'heure donnée par le mode transport donné",
            notes : "Renvoie un objet décrivant le trajet pour aller du point d'origine donné à l'IUT pour arriver à l'heure donnée par le mode transport donné",
            tags : ['api'],
            validate: {
                params: Joi.object({
                    origin : Joi.string().description("Le point de départ du trajet"),
                    arrivalTime : Joi.number().integer().description("L'heure d'arrivée"),
                    transitMode : Joi.string().description("Le moyen de transport à utiliser"),
                })
            },
            response: {
                status: {
                    200 : Joi.object().description("Un objet complexe représentant le trajet"),
                    400 : Joi.object()
                }
            }
        },
        handler: async (request, h) => {
            try {
                const origin = request.params.origin;
                const arrivalTime = request.params.arrivalTime
                const transitMode = request.params.transitMode || "transit"
                
                const data = await controller.directions(origin, arrivalTime, transitMode)

                return h.response(data).code(200)

            } catch (e) {
                return h.response(e).code(400)
            }
        }
    },
]


const server = Hapi.server({
    port: 443,
    host: '172.26.82.56',
    routes: {
        json: {
            space: 4
        },
        "cors": {
            "origin": ["*"],
            "headers": ["Accept", "Content-Type"],
            "additionalHeaders": ["X-Requested-With"]
        }
    }
});

server.route(routes);

export const init = async () => {
    await server.initialize();
    return server;
};

export const start = async () => {
    await server.register([
        Inert,
        Vision,
        {
            plugin : HapiSwagger,
            options : swaggerOptions
        }
    ])
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
    return server;
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});
