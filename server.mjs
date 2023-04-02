'use strict';

import Hapi from '@hapi/hapi';
import Jois from 'joi';

// import * as dotenv from 'dotenv'
// dotenv.config()
const proxy = process.env.https_proxy
import axios from "axios";
import fetch from "node-fetch";
import HttpsProxyAgent from 'https-proxy-agent';

let agent = null
if (proxy != undefined) {
    agent =  new HttpsProxyAgent(proxy);
}
else {
    //pour pouvoir consulter un site avec un certificat invalide
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

import JoiDate from '@hapi/joi-date'
const Joi = Jois.extend(JoiDate)
// const Joi = require('joi').extend(require('@joi/date'));


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
// remplir la bd avec tous les profs et salles
// re-swagger bien toutes les routes + secure + joi (object + notes...)
// feedback and errors pour le site (choisir un edt au lieu d'un edt vide, mauvais login ou mdp, login déjà pris...)
// remove useless commented code + comment code + remove prints

// Partie JOI - Définitions des objets joi
const joiCours = Joi.object(
    {
        id : Joi.number().integer().description("L'id d'une salle doit être unique"),
        // start : Joi.string().required().description("Date de début du cours"),
        // end : Joi.string().required().description("Date de fin du cours"),
        start : Joi.date().description("Date de début du cours"),
        end : Joi.date().description("Date de début du cours"),
        // .format('YYYYMMDDTHHmmSSSSS').utc()
        
        // start : Joi.date().format('YYYY-MM-DD').required().description("Date de début du cours"),
        // end : Joi.date().format('YYYY-MM-DD').required().description("Date de fin du cours"),
        
        summary : Joi.string().allow(null).required().description("Corps du cours (quel cours, etc)"),
        location : Joi.string().allow(null).required().description("identifiant de la salle ( EX-XX )"),
        roomId :  Joi.number().integer().required().description("L'id d'une salle"),
        Schedule : Joi.array(), 
    }
).description('Cours')

const joiCoursTab = Joi.array().items(joiCours).description("A collection of Cours")


const joiSchedule = Joi.object(
    {
        id : Joi.number().integer().required().description("L'identifiant d'un emploi du temps doit être unique"),
        classes : joiCoursTab,
        type : Joi.string().required().description("Le type d'emploi du temps ('prof/etudiant/ ')"),
    }
).description('Schedule')

const joiScheduleTab = Joi.array().items(joiSchedule).description("A collection of Schedule")


const joiTeacher = Joi.object(
    {
        id : Joi.number().integer().required().description("L'id d'un professeur doit être unique"),
        name : Joi.string().required().description("Le nom du professeur"),

    }
).description('Teacher')



const joiRoom = Joi.object(
    {
        id : Joi.number().integer().required().description("L'id d'une salle doit être unique"),
        name : Joi.string().allow(null).required().description("Le nom de la salle"),
        computerRoom : Joi.boolean().required().description("Vaut vrai quand la salle est équipée de matériel informatique")

    }
).description('Room')

const joiRoomsTab = Joi.array().items(joiRoom).description("A collection of Rooms")



const joiUser = Joi.object(
    {
        login : Joi.number().integer().required().description("Le login d'un utilisateur doit être unique"),
        password : Joi.string().required().description("Le mot de passe de l'utilisateur"),
        favoriteSchedule : Joi.number().integer().required().description("L'identifiant de l'emploi du temps favori de l'utilisateur"),
        token : Joi.string().allow(null).required().description("Dernier web token connu de l'utilisateur"),

    }
).description('User')



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
        path: '/schedules',
        handler: async (request, h) => {
            try {
                const schedules = await controller.findSchedules();
                
                if (schedules != null) {
                    return h.response(schedules).code(200)
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
                    // 200 : joiCoursTab,
                    404 : notFound
                    }
                }
        },
        handler: async (request, h) => {
            try {
                const id = parseInt(request.params.id)
                let date = ""
                try {
                    date = (request.params.date) ? formatStringToDate(request.params.date) : new Date()
                } catch(e) {
                    return h.response({message: 'date invalide'}).code(400)
                }
                
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
                const id = parseInt(request.params.id)
                let date = ""
                try {
                    date = (request.params.date) ? formatStringToDate(request.params.date) : new Date()
                } catch(e) {
                    return h.response({message: 'date invalide'}).code(400)
                }

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
                const id = parseInt(request.params.id)
                let date = ""
                try {
                    date = (request.params.date) ? formatStringToDate(request.params.date) : new Date()
                } catch(e) {
                    return h.response({message: 'date invalide'}).code(400)
                }
                
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
        handler: async (request, h) => {
            try {
                const teachers = await controller.findTeachers()
                
                if (teachers != null) {
                    return h.response(teachers).code(200)
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
                    // 200 : joiCoursTab,
                    404 : notFound
                    }
                }
        },
        handler: async (request, h) => {
            try {
                const id = parseInt(request.params.id)
                let time = ""
                try {
                    time = (request.params.time) ? formatStringToDate(request.params.time) : new Date()
                } catch(e) {
                    return h.response({message: 'date invalide'}).code(400)
                }

                if (!request.params.time) {
                    time.setTime(time.getTime() + 2 * 60 * 60 * 1000);
                }
                
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
                    404 : notFound
                    }
                }
        },
        handler: async (request, h) => {
            try {
                const computerRoomsOnly = request.params.computerRoomsOnly
                let time = ""
                try {
                    time = (request.params.time) ? formatStringToDate(request.params.time) : new Date()
                } catch(e) {
                    return h.response({message: 'date invalide'}).code(400)
                }

                if (!request.params.time) {
                    time.setTime(time.getTime() + 2 * 60 * 60 * 1000);
                }
                console.log(time);
                
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
        method: 'POST',
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
        method: 'POST',
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
        method: 'POST',
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
                // const response = {
                //     "geocoded_waypoints" : [
                //        {
                //           "geocoder_status" : "OK",
                //           "partial_match" : true,
                //           "place_id" : "ChIJf0z7govrBUgR-eyKhZ2Su7E",
                //           "types" : [ "establishment", "point_of_interest", "tourist_attraction" ]
                //        },
                //        {
                //           "geocoder_status" : "OK",
                //           "place_id" : "ChIJpy2TCz7wBUgRo4Ly_iTXbto",
                //           "types" : [ "establishment", "point_of_interest", "university" ]
                //        }
                //     ],
                //     "routes" : [
                //        {
                //           "bounds" : {
                //              "northeast" : {
                //                 "lat" : 47.22322399999999,
                //                 "lng" : -1.5418138
                //              },
                //              "southwest" : {
                //                 "lat" : 47.2064871,
                //                 "lng" : -1.5676184
                //              }
                //           },
                //           "copyrights" : "Map data ©2023",
                //           "fare" : {
                //              "currency" : "EUR",
                //              "text" : "€1.70",
                //              "value" : 1.7
                //           },
                //           "legs" : [
                //              {
                //                 "arrival_time" : {
                //                    "text" : "9:55 PM",
                //                    "time_zone" : "Europe/Paris",
                //                    "value" : 1680551706
                //                 },
                //                 "departure_time" : {
                //                    "text" : "9:30 PM",
                //                    "time_zone" : "Europe/Paris",
                //                    "value" : 1680550224
                //                 },
                //                 "distance" : {
                //                    "text" : "3.4 km",
                //                    "value" : 3366
                //                 },
                //                 "duration" : {
                //                    "text" : "25 mins",
                //                    "value" : 1482
                //                 },
                //                 "end_address" : "3 Rue Maréchal Joffre, 44000 Nantes, France",
                //                 "end_location" : {
                //                    "lat" : 47.22322399999999,
                //                    "lng" : -1.5444447
                //                 },
                //                 "start_address" : "Parc des Chantiers, Bd Léon Bureau, 44200 Nantes, France",
                //                 "start_location" : {
                //                    "lat" : 47.2064871,
                //                    "lng" : -1.564284
                //                 },
                //                 "steps" : [
                //                    {
                //                       "distance" : {
                //                          "text" : "0.4 km",
                //                          "value" : 414
                //                       },
                //                       "duration" : {
                //                          "text" : "6 mins",
                //                          "value" : 336
                //                       },
                //                       "end_location" : {
                //                          "lat" : 47.20896690000001,
                //                          "lng" : -1.5676184
                //                       },
                //                       "html_instructions" : "Walk to Chantiers Navals",
                //                       "polyline" : {
                //                          "points" : "q_c_HvopHQPM@MJg@d@q@j@WVORKJKZg@b@YXcAz@A?KJOLA@a@X_Ax@GFEHGJELABCLEPINCBKP`@tB"
                //                       },
                //                       "start_location" : {
                //                          "lat" : 47.2064871,
                //                          "lng" : -1.564284
                //                       },
                //                       "steps" : [
                //                          {
                //                             "distance" : {
                //                                "text" : "0.1 km",
                //                                "value" : 123
                //                             },
                //                             "duration" : {
                //                                "text" : "2 mins",
                //                                "value" : 97
                //                             },
                //                             "end_location" : {
                //                                "lat" : 47.2074261,
                //                                "lng" : -1.5651286
                //                             },
                //                             "html_instructions" : "Head \u003cb\u003enorthwest\u003c/b\u003e on \u003cb\u003eBd Léon Bureau\u003c/b\u003e toward \u003cb\u003eRue La Noue Bras de Fer\u003c/b\u003e",
                //                             "polyline" : {
                //                                "points" : "q_c_HvopHQPM@MJg@d@q@j@WVORKJ"
                //                             },
                //                             "start_location" : {
                //                                "lat" : 47.2064871,
                //                                "lng" : -1.564284
                //                             },
                //                             "travel_mode" : "WALKING"
                //                          },
                //                          {
                //                             "distance" : {
                //                                "text" : "0.2 km",
                //                                "value" : 243
                //                             },
                //                             "duration" : {
                //                                "text" : "3 mins",
                //                                "value" : 199
                //                             },
                //                             "end_location" : {
                //                                "lat" : 47.20913789999999,
                //                                "lng" : -1.5670348
                //                             },
                //                             "html_instructions" : "Slight \u003cb\u003eleft\u003c/b\u003e onto \u003cb\u003eBd Léon Bureau\u003c/b\u003e/\u003cwbr/\u003e\u003cb\u003ePont Anne de Bretagne\u003c/b\u003e\u003cdiv style=\"font-size:0.9em\"\u003eContinue to follow Bd Léon Bureau\u003c/div\u003e",
                //                             "maneuver" : "turn-slight-left",
                //                             "polyline" : {
                //                                "points" : "mec_H`upHKZg@b@YXcAz@A?KJOLA@a@X_Ax@GFEHGJELABCLEPINCBKP"
                //                             },
                //                             "start_location" : {
                //                                "lat" : 47.2074261,
                //                                "lng" : -1.5651286
                //                             },
                //                             "travel_mode" : "WALKING"
                //                          },
                //                          {
                //                             "distance" : {
                //                                "text" : "48 m",
                //                                "value" : 48
                //                             },
                //                             "duration" : {
                //                                "text" : "1 min",
                //                                "value" : 40
                //                             },
                //                             "end_location" : {
                //                                "lat" : 47.20896690000001,
                //                                "lng" : -1.5676184
                //                             },
                //                             "html_instructions" : "Turn \u003cb\u003eleft\u003c/b\u003e onto \u003cb\u003eQuai de la Fosse\u003c/b\u003e\u003cdiv style=\"font-size:0.9em\"\u003eDestination will be on the left\u003c/div\u003e",
                //                             "maneuver" : "turn-left",
                //                             "polyline" : {
                //                                "points" : "cpc_H|`qH`@tB"
                //                             },
                //                             "start_location" : {
                //                                "lat" : 47.20913789999999,
                //                                "lng" : -1.5670348
                //                             },
                //                             "travel_mode" : "WALKING"
                //                          }
                //                       ],
                //                       "travel_mode" : "WALKING"
                //                    },
                //                    {
                //                       "distance" : {
                //                          "text" : "2.2 km",
                //                          "value" : 2169
                //                       },
                //                       "duration" : {
                //                          "text" : "9 mins",
                //                          "value" : 540
                //                       },
                //                       "end_location" : {
                //                          "lat" : 47.2178215,
                //                          "lng" : -1.5421464
                //                       },
                //                       "html_instructions" : "Tram towards Beaujoire / Ranzay",
                //                       "polyline" : {
                //                          "points" : "_oc_HnbqH@AUeAWmAEWiCiMCMS_AS{@_@sAGQKY{@yCw@sCq@aCACs@iCK]K[CEISOa@Sa@S_@O[a@s@W_@Y_@m@{@Wc@GISg@Wu@s@aCGOk@oBi@gBGWCIAECGEQCQEOIa@Q_ASsAAC[gCCYo@gFCSIg@UiBCSEQYyAEQGYCS[eBI_@AIIc@CKI]Ok@Oe@Sk@Wo@u@cB]eA]iAOe@GSeAoDUs@oBoG?CMe@Me@Im@Io@Gi@E]AOIwAEs@AWJA"
                //                       },
                //                       "start_location" : {
                //                          "lat" : 47.208957,
                //                          "lng" : -1.5672773
                //                       },
                //                       "transit_details" : {
                //                          "arrival_stop" : {
                //                             "location" : {
                //                                "lat" : 47.2178215,
                //                                "lng" : -1.5421464
                //                             },
                //                             "name" : "Gare Nord"
                //                          },
                //                          "arrival_time" : {
                //                             "text" : "9:45 PM",
                //                             "time_zone" : "Europe/Paris",
                //                             "value" : 1680551100
                //                          },
                //                          "departure_stop" : {
                //                             "location" : {
                //                                "lat" : 47.208957,
                //                                "lng" : -1.5672773
                //                             },
                //                             "name" : "Chantiers Navals"
                //                          },
                //                          "departure_time" : {
                //                             "text" : "9:36 PM",
                //                             "time_zone" : "Europe/Paris",
                //                             "value" : 1680550560
                //                          },
                //                          "headsign" : "Beaujoire / Ranzay",
                //                          "line" : {
                //                             "agencies" : [
                //                                {
                //                                   "name" : "TAN",
                //                                   "phone" : "011 33 2 40 44 44 44",
                //                                   "url" : "http://www.tan.fr/"
                //                                }
                //                             ],
                //                             "color" : "#007a45",
                //                             "name" : "François Mitterrand / Jamet - Beaujoire / Ranzay",
                //                             "short_name" : "1",
                //                             "text_color" : "#ffffff",
                //                             "vehicle" : {
                //                                "icon" : "//maps.gstatic.com/mapfiles/transit/iw2/6/tram2.png",
                //                                "name" : "Tram",
                //                                "type" : "TRAM"
                //                             }
                //                          },
                //                          "num_stops" : 5
                //                       },
                //                       "travel_mode" : "TRANSIT"
                //                    },
                //                    {
                //                       "distance" : {
                //                          "text" : "0.8 km",
                //                          "value" : 783
                //                       },
                //                       "duration" : {
                //                          "text" : "10 mins",
                //                          "value" : 606
                //                       },
                //                       "end_location" : {
                //                          "lat" : 47.22322399999999,
                //                          "lng" : -1.5444447
                //                       },
                //                       "html_instructions" : "Walk to 3 Rue Maréchal Joffre, 44000 Nantes, France",
                //                       "polyline" : {
                //                          "points" : "qfe_HpelHASE[SFIDEc@KDEDAD]SK^Gl@C@?@A@EHEJILGHMLOJKFIBIBI?IAIAGEKGMKWSGEICGCICI?UCAFEB}@p@QLKHOJMLIHCFEDGHEFEJGLADCHENADCDCBa@ZGFUV[^SRU_ACFEHk@dA_@v@CFAFg@UQGwBu@_A_@]pAGV"
                //                       },
                //                       "start_location" : {
                //                          "lat" : 47.21785,
                //                          "lng" : -1.5421683
                //                       },
                //                       "steps" : [
                //                          {
                //                             "distance" : {
                //                                "text" : "36 m",
                //                                "value" : 36
                //                             },
                //                             "duration" : {
                //                                "text" : "1 min",
                //                                "value" : 28
                //                             },
                //                             "end_location" : {
                //                                "lat" : 47.2180358,
                //                                "lng" : -1.5419968
                //                             },
                //                             "html_instructions" : "Head \u003cb\u003eeast\u003c/b\u003e toward \u003cb\u003eBd de Stalingrad\u003c/b\u003e",
                //                             "polyline" : {
                //                                "points" : "qfe_HpelHASE[SFID"
                //                             },
                //                             "start_location" : {
                //                                "lat" : 47.21785,
                //                                "lng" : -1.5421683
                //                             },
                //                             "travel_mode" : "WALKING"
                //                          },
                //                          {
                //                             "distance" : {
                //                                "text" : "14 m",
                //                                "value" : 14
                //                             },
                //                             "duration" : {
                //                                "text" : "1 min",
                //                                "value" : 9
                //                             },
                //                             "end_location" : {
                //                                "lat" : 47.2180706,
                //                                "lng" : -1.5418176
                //                             },
                //                             "html_instructions" : "Turn \u003cb\u003eright\u003c/b\u003e onto \u003cb\u003eBd de Stalingrad\u003c/b\u003e",
                //                             "maneuver" : "turn-right",
                //                             "polyline" : {
                //                                "points" : "wge_HndlHEc@"
                //                             },
                //                             "start_location" : {
                //                                "lat" : 47.2180358,
                //                                "lng" : -1.5419968
                //                             },
                //                             "travel_mode" : "WALKING"
                //                          },
                //                          {
                //                             "distance" : {
                //                                "text" : "13 m",
                //                                "value" : 13
                //                             },
                //                             "duration" : {
                //                                "text" : "1 min",
                //                                "value" : 10
                //                             },
                //                             "end_location" : {
                //                                "lat" : 47.2181721,
                //                                "lng" : -1.5419064
                //                             },
                //                             "html_instructions" : "Turn \u003cb\u003eleft\u003c/b\u003e onto \u003cb\u003eRue Ecorchard\u003c/b\u003e",
                //                             "maneuver" : "turn-left",
                //                             "polyline" : {
                //                                "points" : "}ge_HjclHKDEDAD"
                //                             },
                //                             "start_location" : {
                //                                "lat" : 47.2180706,
                //                                "lng" : -1.5418176
                //                             },
                //                             "travel_mode" : "WALKING"
                //                          },
                //                          {
                //                             "distance" : {
                //                                "text" : "18 m",
                //                                "value" : 18
                //                             },
                //                             "duration" : {
                //                                "text" : "1 min",
                //                                "value" : 13
                //                             },
                //                             "end_location" : {
                //                                "lat" : 47.21832269999999,
                //                                "lng" : -1.5418138
                //                             },
                //                             "html_instructions" : "Turn \u003cb\u003eright\u003c/b\u003e",
                //                             "maneuver" : "turn-right",
                //                             "polyline" : {
                //                                "points" : "qhe_H|clH]S"
                //                             },
                //                             "start_location" : {
                //                                "lat" : 47.2181721,
                //                                "lng" : -1.5419064
                //                             },
                //                             "travel_mode" : "WALKING"
                //                          },
                //                          {
                //                             "distance" : {
                //                                "text" : "32 m",
                //                                "value" : 32
                //                             },
                //                             "duration" : {
                //                                "text" : "1 min",
                //                                "value" : 23
                //                             },
                //                             "end_location" : {
                //                                "lat" : 47.2184177,
                //                                "lng" : -1.5422017
                //                             },
                //                             "html_instructions" : "Turn \u003cb\u003eleft\u003c/b\u003e",
                //                             "maneuver" : "turn-left",
                //                             "polyline" : {
                //                                "points" : "oie_HhclHK^Gl@"
                //                             },
                //                             "start_location" : {
                //                                "lat" : 47.21832269999999,
                //                                "lng" : -1.5418138
                //                             },
                //                             "travel_mode" : "WALKING"
                //                          },
                //                          {
                //                             "distance" : {
                //                                "text" : "0.2 km",
                //                                "value" : 159
                //                             },
                //                             "duration" : {
                //                                "text" : "2 mins",
                //                                "value" : 126
                //                             },
                //                             "end_location" : {
                //                                "lat" : 47.21968820000001,
                //                                "lng" : -1.5423138
                //                             },
                //                             "html_instructions" : "Slight \u003cb\u003eright\u003c/b\u003e",
                //                             "maneuver" : "turn-slight-right",
                //                             "polyline" : {
                //                                "points" : "cje_HvelHC@?@A@EHEJILGHMLOJKFIBIBI?IAIAGEKGMKWSGEICGCICI?UC"
                //                             },
                //                             "start_location" : {
                //                                "lat" : 47.2184177,
                //                                "lng" : -1.5422017
                //                             },
                //                             "travel_mode" : "WALKING"
                //                          },
                //                          {
                //                             "distance" : {
                //                                "text" : "0.2 km",
                //                                "value" : 218
                //                             },
                //                             "duration" : {
                //                                "text" : "3 mins",
                //                                "value" : 172
                //                             },
                //                             "end_location" : {
                //                                "lat" : 47.2212453,
                //                                "lng" : -1.5440072
                //                             },
                //                             "html_instructions" : "Slight \u003cb\u003eleft\u003c/b\u003e",
                //                             "maneuver" : "turn-slight-left",
                //                             "polyline" : {
                //                                "points" : "are_HlflHAFEB}@p@QLKHOJMLIHCFEDGHEFEJGLADCHENADCDCBa@ZGFUV[^SR"
                //                             },
                //                             "start_location" : {
                //                                "lat" : 47.21968820000001,
                //                                "lng" : -1.5423138
                //                             },
                //                             "travel_mode" : "WALKING"
                //                          },
                //                          {
                //                             "distance" : {
                //                                "text" : "27 m",
                //                                "value" : 27
                //                             },
                //                             "duration" : {
                //                                "text" : "1 min",
                //                                "value" : 19
                //                             },
                //                             "end_location" : {
                //                                "lat" : 47.2213562,
                //                                "lng" : -1.5436923
                //                             },
                //                             "html_instructions" : "Turn \u003cb\u003eright\u003c/b\u003e onto \u003cb\u003eRue Gambetta\u003c/b\u003e",
                //                             "maneuver" : "turn-right",
                //                             "polyline" : {
                //                                "points" : "y{e_H`qlHU_A"
                //                             },
                //                             "start_location" : {
                //                                "lat" : 47.2212453,
                //                                "lng" : -1.5440072
                //                             },
                //                             "travel_mode" : "WALKING"
                //                          },
                //                          {
                //                             "distance" : {
                //                                "text" : "79 m",
                //                                "value" : 79
                //                             },
                //                             "duration" : {
                //                                "text" : "1 min",
                //                                "value" : 63
                //                             },
                //                             "end_location" : {
                //                                "lat" : 47.2218236,
                //                                "lng" : -1.5444856
                //                             },
                //                             "html_instructions" : "Turn \u003cb\u003eleft\u003c/b\u003e onto \u003cb\u003eRue Guillaume Grou\u003c/b\u003e",
                //                             "maneuver" : "turn-left",
                //                             "polyline" : {
                //                                "points" : "o|e_H`olHCFEHk@dA_@v@CFAF"
                //                             },
                //                             "start_location" : {
                //                                "lat" : 47.2213562,
                //                                "lng" : -1.5436923
                //                             },
                //                             "travel_mode" : "WALKING"
                //                          },
                //                          {
                //                             "distance" : {
                //                                "text" : "0.1 km",
                //                                "value" : 141
                //                             },
                //                             "duration" : {
                //                                "text" : "2 mins",
                //                                "value" : 107
                //                             },
                //                             "end_location" : {
                //                                "lat" : 47.2230275,
                //                                "lng" : -1.5439104
                //                             },
                //                             "html_instructions" : "Turn \u003cb\u003eright\u003c/b\u003e onto \u003cb\u003eRue Gaston Turpin\u003c/b\u003e",
                //                             "maneuver" : "turn-right",
                //                             "polyline" : {
                //                                "points" : "k_f_H`tlHg@UQGwBu@_A_@"
                //                             },
                //                             "start_location" : {
                //                                "lat" : 47.2218236,
                //                                "lng" : -1.5444856
                //                             },
                //                             "travel_mode" : "WALKING"
                //                          },
                //                          {
                //                             "distance" : {
                //                                "text" : "46 m",
                //                                "value" : 46
                //                             },
                //                             "duration" : {
                //                                "text" : "1 min",
                //                                "value" : 36
                //                             },
                //                             "end_location" : {
                //                                "lat" : 47.22322399999999,
                //                                "lng" : -1.5444447
                //                             },
                //                             "html_instructions" : "Turn \u003cb\u003eleft\u003c/b\u003e\u003cdiv style=\"font-size:0.9em\"\u003eRestricted usage road\u003c/div\u003e\u003cdiv style=\"font-size:0.9em\"\u003eDestination will be on the right\u003c/div\u003e",
                //                             "maneuver" : "turn-left",
                //                             "polyline" : {
                //                                "points" : "}ff_HlplH]pAGV"
                //                             },
                //                             "start_location" : {
                //                                "lat" : 47.2230275,
                //                                "lng" : -1.5439104
                //                             },
                //                             "travel_mode" : "WALKING"
                //                          }
                //                       ],
                //                       "travel_mode" : "WALKING"
                //                    }
                //                 ],
                //                 "traffic_speed_entry" : [],
                //                 "via_waypoint" : []
                //              }
                //           ],
                //           "overview_polyline" : {
                //              "points" : "q_c_HvopHQPM@u@p@iAbA[^KZg@b@}AtA_@ZaBrAMPSj@O`@OT`@tB@cASgAkD}Pg@{Bg@eBgAsDiBuGmAgEq@}Ac@{@y@sAgBiCk@}A{@qCaByFOq@u@eEa@eDsAmKi@qCq@sDYwA_@qAk@{Au@cB]eAm@oBsEgOMi@WsAYgCOkCAWJAEBASE[SFIDEc@QJAD]SK^Gl@CBGJOXUV[RSFSAQGy@m@e@KUCAFcAt@{@p@[`@Uf@Od@cA~@o@r@U_ACFq@nAc@~@AFg@UiC}@_A_@]pAGV"
                //           },
                //           "summary" : "",
                //           "warnings" : [
                //              "Walking directions are in beta. Use caution – This route may be missing sidewalks or pedestrian paths."
                //           ],
                //           "waypoint_order" : []
                //        }
                //     ],
                //     "status" : "OK"
                //  }

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
                // console.log(data);


                // const result = await fetch("https://maps.googleapis.com/maps/api/directions/json?origin=Brooklyn&destination=Queens&mode=transit&departure_time=1343641500&key=AIzaSyDoM4U5lz87DBlZL2KQ8tmtUQBopQKr09Y")
                // const data = await result.data
                // console.log(data);

                // let response = agent!=null ? await fetch("https://api.themoviedb.org/3/movie/popular?api_key=b6690682a600b4de8377c122d8e12540&language=en-US&page=1", {agent: agent}):await fetch("https://api.themoviedb.org/3/movie/popular?api_key=b6690682a600b4de8377c122d8e12540&language=en-US&page=1", {agent: agent})
                // console.log("a", await response.data);


                // var config = {
                //     method: 'get',
                //     url: 'https://maps.googleapis.com/maps/api/directions/json?origin=Chicago%2C%20IL&destination=Los%20Angeles%2C%20CA&waypoints=Joplin%2C%20MO%7COklahoma%20City%2C%20OK&key=AIzaSyDoM4U5lz87DBlZL2KQ8tmtUQBopQKr09Y',
                //     headers: { }
                // };
                
                // axios(config)
                // .then(function (response) {
                //     return h.response(JSON.stringify(response.data)).code(200)
                // })
                // .catch(function (error) {
                // console.log(error);
                // });
                  


                // const directionsService = new google.maps.DirectionsService();

                // // pour IUT Nantes, utiliser soit longitude, latitude, soit googme.maps.Place
                // directionsService
                // .route({
                // origin: "Machines de l'ile, Nantes",
                // destination: "ChIJpy2TCz7wBUgRo4Ly_iTXbto" // Place ID de l'IUT de Nantes,
                // travelMode: google.maps.TravelMode.DRIVING,
                // })
                // .then((response) => {
                //     console.log(response);
                // })
                // .catch((e) =>
                // window.alert("Directions request failed due to " + status)
                // );

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
