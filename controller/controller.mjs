"use strict"

import {teacherDao} from "../dao/teacherDao.mjs";
import {scheduleDao2} from "../dao/scheduleDao2.mjs";
import {roomDao} from "../dao/roomDao.mjs";

import {Schedule} from "../model/schedule.mjs"
import {Cours} from "../model/cours.mjs"
import {Room} from "../model/room.mjs"
import { ScheduleType } from "../model/scheduleType.mjs";

let lastUpdate = null;

const clearDatabaseIfNotUpdatedToday = async () => {
    const today = new Date();
    
    if (
        lastUpdate == null ||
        lastUpdate.getFullYear() != today.getFullYear() ||
        lastUpdate.getMonth() != today.getMonth() ||
        lastUpdate.getDate() != today.getDate()
    ) {
        try {
            await roomDao.deleteAll();
            await scheduleDao2.deleteAll();
            lastUpdate = new Date()
        } catch (e) {}
    }
}

export const controller = {
    findByDay : async(id, date, scheduleType) => {
        try {

            // if the user has not made any queries today, erase the database to refetch the data (because it updates everyday at midnight)
            clearDatabaseIfNotUpdatedToday()

            let schedule = await scheduleDao2.find(id);
            if (schedule == null) {
                schedule = await scheduleDao2.save(id, scheduleType)
            }

            if (schedule == null) {
                return null
            }

            return await scheduleDao2.findByDay(schedule, date)

        } catch (e) {
            console.log(e);
            return Promise.reject({message : "error"})
        }
    },

    findByWeek : async(id, date, scheduleType) => {
        try {

            // if the user has not made any queries today, erase the database to refetch the data (because it updates everyday at midnight)
            clearDatabaseIfNotUpdatedToday()

            const week= []; 
            date.setDate((date.getDate() - date.getDay() ));

            for (let i = 0; i < 7; i++) {
                week.push(
                    new Date(date)
                ); 
                date.setDate(date.getDate() + 1);
            }

            const schedules = [];

            let schedule = await scheduleDao2.find(id);
            if (schedule == null) {
                schedule = await scheduleDao2.save(id, scheduleType)
            }
                
            if (schedule == null) {
                return null
            }
            
            for (const day of week) {
                schedules.push(await scheduleDao2.findByDay(schedule, day))
            }

            return schedules

        } catch (e) {
            console.log(e);
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
