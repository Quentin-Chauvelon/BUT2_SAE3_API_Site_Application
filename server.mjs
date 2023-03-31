'use strict';

import Hapi from '@hapi/hapi';
import Jois from 'joi';

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


function formatStringToDate(stringDate) {
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
