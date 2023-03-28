'use strict';

import Hapi from '@hapi/hapi';

import {controller} from "./controller/controller.mjs";

import {ScheduleType} from "./model/scheduleType.mjs"

// TODO: joi, swagger, chai, secure routes (schedule/day/fgdfqgfg3184fsgd...)

function formatStringToDate(stringDate) {
    const [date, time] = stringDate.split("T")
    
    const year = parseInt(date.substring(0,4))
    const month = parseInt(date.substring(4,6))
    const day = parseInt(date.substring(6,8))
    
    const hour = parseInt(time.substring(0,2)) + 2
    const minute = parseInt(time.substring(2,4))
    
    return new Date(year, month - 1, day, hour, minute, 0)
}


const routes =[
    {
        method: '*',
        path: '/',
        handler: function (_, h) {
            return h.response({message: 'Accueil API RESTful du Club des 5'}).code(404)
        }
    },
    
    {
        method: '*',
        path: '/{any*}',
        handler: function (_, h) {
            return h.response({message: 'not found'}).code(404)
        }
    },
    
    {
        method: 'GET',
        path: '/schedule/day/{id}/{date?}',
        handler: async (request, h) => {
            try {
                const id = parseInt(request.params.id)
                const date = (request.params.date) ? formatStringToDate(request.params.date) : new Date()
                
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
        handler: async (request, h) => {
            try {
                const id = parseInt(request.params.id)
                const date = (request.params.date) ? formatStringToDate(request.params.date) : new Date()
                
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
        handler: async (request, h) => {
            try {
                const id = parseInt(request.params.id)
                const date = (request.params.date) ? formatStringToDate(request.params.date) : new Date()
                
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
        path: '/room/{id}/{time?}',
        handler: async (request, h) => {
            try {
                const id = parseInt(request.params.id)
                const time = (request.params.time) ? formatStringToDate(request.params.time) : new Date()
                
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
        handler: async (request, h) => {
            try {
                const computerRoomsOnly = request.params.computerRoomsOnly
                const time = (request.params.time) ? formatStringToDate(request.params.time) : new Date()
                
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
        handler: async (request, h) => {
            try {
                const userToAdd = request.payload
                const user = await controller.login(userToAdd)
                
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
        path: '/user/favoriteSchedule',
        handler: async (request, h) => {
            try {
                const login = request.payload.login
                const favoriteSchedule = request.payload.favoriteSchedule

                const user = await controller.setFavorite(login, favoriteSchedule)
                
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
        path: '/user/favoriteSchedule/{login}',
        handler: async (request, h) => {
            try {
                const favoriteSchedule = await controller.getFavorite(request.params.login)

                return h.response(favoriteSchedule).code(200)
            } catch (e) {
                console.log(e);
                return h.response(e).code(400)
            }
        }
    },
]

const server = Hapi.server({
    port: 80,
    host: '172.26.82.56',
    routes: {
        json: {
            space: 4
        }
    }
});

server.route(routes);

export const init = async () => {
    await server.initialize();
    return server;
};

export const start = async () => {
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
    return server;
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});