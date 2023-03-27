"use strict"

import {teacherDao} from "../dao/teacherDao.mjs";
import {scheduleDao2} from "../dao/scheduleDao2.mjs";
import {roomDao} from "../dao/roomDao.mjs";

import {Schedule} from "../model/schedule.mjs"
import {Cours} from "../model/cours.mjs"
import {Room} from "../model/room.mjs"
import { ScheduleType } from "../model/scheduleType.mjs";

let lastUpdate = null;

const hasUpdatedToday = async () => {
    const today = new Date();
    if (
        lastUpdate == null ||
        lastUpdate.getFullYear() != today.getFullYear() ||
        lastUpdate.getMonth() != today.getMonth() ||
        lastUpdate.getDate() != today.getDate()
    ) {
        try {
            scheduleDao.deleteAll();
            lastUpdate = new Date()
        } catch (e) {}
    }
}

export const controller = {
    findByDay : async(id, date, scheduleType) => {
        try {
            await scheduleDao2.deleteAll()
            
            const classes = await scheduleDao2.find(scheduleType.getUrl(id));
            if (classes == null) {
                return null;
            }

            let room = new Room({
                id: 10,
                name: "",
                computerRoom: false
            });

            let cours = new Cours({
                id: 20,
                start: "",
                end: "",
                summary: "fklsdqjfmlkjf",
                location: room,
                roomId: 0
            });

            let schedule = new Schedule({
                id: id,
                classes: [cours],
                type: scheduleType.getType(),
            })

            // schedule.classes[0].location.Cours = []
            // schedule.classes[0].Schedule = schedule

            const test = await scheduleDao2.save(schedule)
            console.log(test);

            console.log(await scheduleDao2.findAll());
            // const classesOfDate = await scheduleDao.findByDay(schedule, date)
            // return classesOfDate

        } catch (e) {
            return Promise.reject({message : "error"})
        }
    },

    populate : async(fileName) => {
        try {
            let file = "";
            switch (fileName) {
                case "rooms":
                    return await roomDao.populate("./data/rooms.csv")
                
                default:
                    return h.response({message: 'not found'}).code(404);
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

    findRoom : async (roomName, time) => {
        try {
            const room = await roomDao.findByName(roomName);
            if (room == null) {
                return null;
            }

            const cours = await scheduleDao.findByTime(room.getScheduleURL(), time);

            return cours

        } catch (e) {
            return Promise.reject({message : "error"})
        }
    },

    findRooms : async(computerRoomsOnly, time) => {
        try {
            const rooms = await roomDao.findAll();
            const freeRooms = [];

            for (const room of rooms) {

                // filter computer rooms only if needed
                if (computerRoomsOnly == "false" || room.computerRoom) {
                    const roomSchedule = await controller.findRoom(room.name, time);

                    // if the room is free, add it to the table of free rooms
                    if (roomSchedule.free) {
                        freeRooms.push(room);
                    }
                }
            }

            return freeRooms

        } catch (e) {
            return Promise.reject({message : "error"})
        }
    }

    // findByLogin : async (login) => {
    // try {
    //     return await userDao.findByLogin(login)
    // } catch(e) { return Promise.reject({message: "error"})}
    // },

    // deleteByLogin: async (login) =>{
    //     try {
    //         return await userDao.deleteByLogin(login)
    //     } catch(e)
    //     { return Promise.reject({message: "error"})}
    // },

    // add:async (user) => {
    //     try {
    //         return  await userDao.add(user)
    //     } catch(e) {
    //         return Promise.reject({message: "error"})}
    // },

    // update: async (login, user) => {
    //     try {
    //         return await userDao.update(login, user)
    //     } catch (e) {
    //         return Promise.reject({message: "error"})
    //     }
    // }
}
