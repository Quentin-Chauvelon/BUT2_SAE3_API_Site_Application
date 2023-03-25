"use strict"

import {teacherDao} from "../dao/teacherDao.mjs";
import {scheduleDao} from "../dao/scheduleDao.mjs";
import {roomDao} from "../dao/roomDao.mjs";

export const controller = {
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
