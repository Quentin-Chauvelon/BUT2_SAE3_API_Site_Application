'use strict';

import Hapi from '@hapi/hapi';
import Jois from 'joi';

const proxy = process.env.https_proxy
import axios from "axios";
import fetch from "node-fetch";
import HttpsProxyAgent from 'https-proxy-agent';

let agent = null
if (proxy != undefined) {
    agent =  new HttpsProxyAgent(proxy);
}
else {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

import JoiDate from '@hapi/joi-date'
const Joi = Jois.extend(JoiDate)

import Inert from '@hapi/inert'
import Vision from '@hapi/vision';
import HapiSwagger from 'hapi-swagger';

import {controller} from "./controller/controller.mjs";

import {ScheduleType} from "./model/scheduleType.mjs"

// TODO: joi, swagger, chai, secure routes (schedule/day/fgdfqgfg3184fsgd...)
// TODO séparer schedule et schedules parce que là c'est affreux
// TODO populate ligne ~354, j'ai viré le status 200 du swagger car maintenant ça peut être un joiRoomsTab ou un objet de la forme {id : number, name : string} (voir model schedules)
// token header, authorization bering?
// remplacer schedules par groups
// remplacer post par put
// augmenter quotas directions api pour l'éval
// remplir la bd avec tous les profs, salles et schedules
// re-swagger bien toutes les routes + secure + joi (object + notes...)
// feedback and errors pour le site (choisir un edt au lieu d'un edt vide, mauvais login ou mdp, login déjà pris...)
// remove useless commented code + comment code + remove prints

// Partie JOI - Définitions des objets joi
const joiCours = Joi.object({
    id : Joi.number().integer().description("L'id d'une salle doit être unique"),
    start : Joi.date().description("Date de début du cours"),
    end : Joi.date().description("Date de début du cours"),
    // .format('YYYYMMDDTHHmmSSSSS').utc()
    summary : Joi.string().allow(null).required().description("Corps du cours (quel cours, etc)"),
    location : Joi.string().allow(null).required().description("identifiant de la salle ( EX-XX )"),
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
    name : Joi.string().allow(null).required().description("Le nom de la salle"),
    computerRoom : Joi.boolean().required().description("Vaut vrai quand la salle est équipée de matériel informatique")
}).description('Room')

const joiRoomsTab = Joi.array().items(joiRoom).description("A collection of Rooms")


const joiUser = Joi.object({
    login : Joi.number().integer().required().description("Le login d'un utilisateur doit être unique"),
    password : Joi.string().required().description("Le mot de passe de l'utilisateur"),
    favoriteSchedule : Joi.number().integer().required().description("L'identifiant de l'emploi du temps favori de l'utilisateur"),
    token : Joi.string().allow(null).required().description("Dernier web token connu de l'utilisateur"),
}).description('User')


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
        title: "L'API des utilisateurs",
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
        return h.response({message: 'date invalide'}).code(400)
    }

    return date
}


const routes =[    
    {
        method: '*',
        path: '/{any*}',
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
                    200 : joiGroupsTab
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
            description : 'get classes for a day from an id, the date can be expressed, by default its the current day',
            notes : 'get classes for a day from an id, the date can be expressed, by default its the current day',
            tags : ['api'],
            validate: {
                params: Joi.object({
                    id : Joi.string(),
                    date : Joi.string().allow(null),
                }),
            },
            response: {
                status: {
                    200 : joiCoursTab,
                    404 : notFound
                }
            }
        },
        handler: async (request, h) => {
            try {
                const id = getIdFromPayload(request.params.id)
                const date = getDateFromPayload(request.params.date)
                if (date.message) { return date}
                
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
            description : 'get classes for a week from an id, the date can be expressed, by default its the current day',
            notes : 'get classes for a week from an id, the date can be expressed, by default its the current day',
            tags : ['api'],
            validate: {
                params: Joi.object({
                    id : Joi.string(),
                    date : Joi.string().allow(null),
                })
            },
            response: {
                status: {
                    200 : Joi.array().items(joiCoursTab),
                    404 : notFound
                }
            }
        },
        handler: async (request, h) => {
            try {
                const id = getIdFromPayload(request.params.id)
                const date = getDateFromPayload(request.params.date)
                if (date.message) { return date}

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
            description : 'get classes for a given day for a teacher from an id, the date can be expressed, by default its the current day',
            notes : 'get classes for a given day for a teacher from an id, the date can be expressed, by default its the current day',
            tags : ['api'],
            validate: {
                params: Joi.object({
                    id : Joi.string(),
                    date : Joi.string().allow(null),
                })
            },
            response: {
                status: {
                    200 : joiCoursTab,
                    404 : notFound
                }
            }
        },
        handler: async (request, h) => {
            try {
                const id = getIdFromPayload(request.params.id)
                const date = getDateFromPayload(request.params.date)
                if (date.message) { return date}
                
                const classes = await controller.findByDay(id, date, ScheduleType.Teacher)
                
                if (classes != null) {
                    return h.response(classes).code(200)
                } else {
                    return h.response({message: 'not found'}).code(404)
                }
                
            } catch (e) {
                console.log(e);
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
                    200 : joiTeacherTab
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
            description : 'get classes for a given day for a room from an id, the date can be expressed, by default its the current day',
            notes : 'can be a tab containing a single class or no class',
            tags : ['api'],
            validate: {
                params: Joi.object({
                    id : Joi.string(),
                    time : Joi.string().allow(null),
                })
            },
            response: {
                status: {
                    200 : joiCoursTab,
                    404 : notFound
                }
            }
        },
        handler: async (request, h) => {
            try {
                const id = getIdFromPayload(request.params.id)
                const time = getDateFromPayload(request.params.time)
                if (time.message) { return time}
                
                const classes = await controller.findByTime(id, time, ScheduleType.Room)
                
                if (classes != null) {
                    return h.response(classes).code(200)
                } else {
                    return h.response({message: 'not found'}).code(404)
                }
                
            } catch (e) {
                console.log(e);
                return h.response(e).code(400)
            }
        }
    },
    
    {
        method: 'GET',
        path: '/rooms/{computerRoomsOnly}/{time?}',
        options : {
            description : 'get empty rooms for a given daytime, computerRoomsOnly can be set to true to get rooms equipped with it equipment the date can be expressed, by default its the current day and time',
            notes : 'a tab containing empty rooms, computerRoom or computerRoom and !computerRoom',
            tags : ['api'],
            validate: {
                params: Joi.object({
                    computerRoomsOnly : Joi.boolean(),
                    time : Joi.string().allow(null),
                })
            },
            response: {
                status: {
                    200 : joiRoomsTab,
                }
            }
        },
        handler: async (request, h) => {
            try {
                const computerRoomsOnly = request.params.computerRoomsOnly
                const time = getDateFromPayload(request.params.time)
                if (time.message) { return time}

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
            description : 'read the csv corresponding to the type and populates the database',
            notes : 'read the csv corresponding to the type and populates the database',
            tags : ['api'],
            validate: {
                params: Joi.object({
                    type : Joi.string(),
                }),
            },
            response: {
                status: {
                    // 200 : joiRoomsTab,
                    404 : notFound
                    }
                }
        },
        handler: async (request, h) => {
            try {
                const classes = await controller.populate(request.params.type)
                
                return h.response(classes).code(200)
            } catch (e) {
                return h.response(e).code(400)
            }
        }
    },

    {
        method: 'POST',
        path: '/user/register',
        options : {
            description : 'allow users to register',
            notes : 'allow users to register',
            tags : ['api'],
            validate: {
                payload: Joi.object({
                    login : Joi.string(),
                    password : Joi.string() 
                })
            },
        },
        handler: async (request, h) => {
            try {
                const userToAdd = request.payload
                const user = await controller.register(userToAdd)
                
                if (user != null) {
                    return h.response(user).code(201)
                } else {
                    return h.response(user).code(403)
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
            description : 'allow users to log in',
            notes : 'allow users to log in',
            tags : ['api'],
            validate: {
                payload: Joi.object({
                    login : Joi.string(),
                    password : Joi.string() 
                })
            },
        },
        handler: async (request, h) => {
            try {
                const userToAdd = request.payload
                console.log(userToAdd);
                const user = await controller.login(userToAdd)
                
                if (user != null) {
                    return h.response(user).code(201)
                } else {
                    return h.response(user).code(403)
                }

            } catch (e) {
                return h.response({message: 'error'}).code(404)
            }
        }
    },

    {
        method: 'PUT',
        path: '/user/favoriteSchedule',
        options : {
            description : 'allow users to get their favorite schedule',
            notes : 'allow users to log in',
            tags : ['api'],
            validate: {
                payload: Joi.object({
                    token : Joi.string(),
                    favoriteSchedule : Joi.number() 
                })
            },
        },
        handler: async (request, h) => {
            try {
                console.log("here");
                const token = request.payload.token
                const favoriteSchedule = request.payload.favoriteSchedule

                const user = await controller.setFavorite(token, favoriteSchedule)
                
                if (user != null) {
                    return h.response(user).code(201)
                } else {
                    return h.response(user).code(403)
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
            description : 'read the csv corresponding to the type and populates the database',
            notes : 'read the csv corresponding to the type and populates the database',
            tags : ['api'],
            validate: {
                params: Joi.object({
                    token : Joi.string(),
                })
            },
            response: {
                status: {
                    // 200 : Joi.number().integer(),
                    404 : notFound
                    }
                }
        },
        handler: async (request, h) => {
            try {
                const favoriteSchedule = await controller.getFavorite(request.params.token)

                return h.response(favoriteSchedule).code(200)
            } catch (e) {
                console.log(e);
                return h.response(e).code(400)
            }
        }
    },

    {
        method: 'PUT',
        path: '/user/favoriteAddress',
        options : {
            description : 'allow users to get their favorite schedule',
            notes : 'allow users to log in',
            tags : ['api'],
            validate: {
                payload: Joi.object({
                    token : Joi.string(),
                    favoriteAddress : Joi.string() 
                })
            },
        },
        handler: async (request, h) => {
            try {
                const token = request.payload.token
                const favoriteAddress = request.payload.favoriteAddress

                const user = await controller.setFavoriteAddress(token, favoriteAddress)
                
                if (user != null) {
                    return h.response(user).code(201)
                } else {
                    return h.response(user).code(403)
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
            description : 'read the csv corresponding to the type and populates the database',
            notes : 'read the csv corresponding to the type and populates the database',
            tags : ['api'],
            validate: {
                params: Joi.object({
                    token : Joi.string(),
                })
            },
            response: {
                status: {
                    // 200 : Joi.number().integer(),
                    404 : notFound
                    }
                }
        },
        handler: async (request, h) => {
            try {
                const favoriteAddress = await controller.getFavoriteAddress(request.params.token)

                return h.response(favoriteAddress).code(200)
            } catch (e) {
                console.log(e);
                return h.response(e).code(400)
            }
        }
    },

    {
        method: 'PUT',
        path: '/user/favoriteTransitMode',
        options : {
            description : 'allow users to get their favorite schedule',
            notes : 'allow users to log in',
            tags : ['api'],
            validate: {
                payload: Joi.object({
                    token : Joi.string(),
                    favoriteTransitMode : Joi.string() 
                })
            },
        },
        handler: async (request, h) => {
            try {
                const token = request.payload.token
                const favoriteTransitMode = request.payload.favoriteTransitMode

                const user = await controller.setFavoriteTransitMode(token, favoriteTransitMode)
                
                if (user != null) {
                    return h.response(user).code(201)
                } else {
                    return h.response(user).code(403)
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
            description : 'read the csv corresponding to the type and populates the database',
            notes : 'read the csv corresponding to the type and populates the database',
            tags : ['api'],
            validate: {
                params: Joi.object({
                    token : Joi.string(),
                })
            },
            response: {
                status: {
                    // 200 : Joi.number().integer(),
                    404 : notFound
                    }
                }
        },
        handler: async (request, h) => {
            try {
                const favoriteTransitMode = await controller.getFavoriteTransitMode(request.params.token)

                return h.response(favoriteTransitMode).code(200)
            } catch (e) {
                console.log(e);
                return h.response(e).code(400)
            }
        }
    },

    {
        method: 'GET',
        path: '/directions/{origin}/{arrivalTime}/{transitMode?}',
        handler: async (request, h) => {
            try {
                const origin = request.params.origin;
                const arrivalTime = request.params.arrivalTime
                const transitMode = request.params.transitMode || "transit"

                console.log(
                    "https://maps.googleapis.com/maps/api/directions/json?" +
                    "origin=" + origin + 
                    "&destination=place_id:ChIJpy2TCz7wBUgRo4Ly_iTXbto" + 
                    "&arrival_time=" + arrivalTime / 1000 +
                    "&mode=" + transitMode +
                    "&key=AIzaSyDoM4U5lz87DBlZL2KQ8tmtUQBopQKr09Y",
                );

                const result = agent!=null
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

                const data = await result.json()
                return h.response(data).code(200)
            } catch (e) {
                console.log(e);
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
