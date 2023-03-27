'use strict';

import Hapi from '@hapi/hapi';

import {controller} from "./controller/controller.mjs";

import {ScheduleType} from "./model/scheduleType.mjs"


function formatStringToDate(stringDate) {
    const [date, time] = stringDate.split("T")
    
    const year = parseInt(date.substring(0,4))
    const month = parseInt(date.substring(4,6))
    const day = parseInt(date.substring(6,8))
    
    const hour = parseInt(time.substring(0,2)) + 1
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
        path: '/schedule/{id}/{date?}',
        handler: async (request, h) => {
            try {
                const id = request.params.id
                const date = (request.params.date) ? formatStringToDate(request.params.date) : new Date()
                
                const schedule = await controller.findByDay(id, date, ScheduleType.Schedule)
                
                if (schedule != null) {
                    return h.response(schedule).code(200)
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
        method: 'GET',
        path: '/teacher/{name}/{date?}',
        handler: async (request, h) => {
            try {
                const name = request.params.name
                const date = (request.params.date) ? formatStringToDate(request.params.date) : new Date()
                
                const schedule = await controller.findTeacher(name, date)
                
                if (schedule != null) {
                    return h.response(schedule).code(200)
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
        path: '/room/{name}/{time?}',
        handler: async (request, h) => {
            try {
                const name = request.params.name
                const time = (request.params.time) ? formatStringToDate(request.params.time) : new Date()
                
                const free = await controller.findRoom(name, time)
                
                if (free != null) {
                    return h.response(free).code(200)
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
                
                const freeRooms = await controller.findRooms(computerRoomsOnly, time)
                
                return h.response(freeRooms).code(200)
                
            } catch (e) {
                return h.response(e).code(400)
            }
        }
    }
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