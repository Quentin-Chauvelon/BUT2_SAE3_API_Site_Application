"use strict"

import {teacherDao} from "../dao/teacherDao.mjs";
import {scheduleDao} from "../dao/scheduleDao.mjs";
import {roomDao} from "../dao/roomDao.mjs";
import {userDao} from "../dao/userDao.mjs";

import {Schedule} from "../model/schedule.mjs"
import {Cours} from "../model/cours.mjs"
import {Room} from "../model/room.mjs"
import {User} from "../model/user.mjs"
import { ScheduleType } from "../model/scheduleType.mjs";

import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";

let lastUpdate = null;
const PRIVATE_KEY = "OnDevraitTrouverMieux"

const clearDatabaseIfNotUpdatedToday = async () => {
    const today = new Date();
    
    if (
        lastUpdate == null ||
        lastUpdate.getFullYear() != today.getFullYear() ||
        lastUpdate.getMonth() != today.getMonth() ||
        lastUpdate.getDate() != today.getDate()
    ) {
        try {
            // await roomDao.deleteAll();
            await scheduleDao.deleteAll();
            lastUpdate = new Date()
        } catch (e) {}
    }
}

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
    findSchedules : async() => {
        try {

            // if the user has not made any queries today, erase the database to refetch the data (because it updates everyday at midnight)
            clearDatabaseIfNotUpdatedToday()

            return await scheduleDao.findSchedules();
            
        } catch (e) {
            console.log(e);
            return Promise.reject({message : "error"})
        }
    },

    findByDay : async(id, date, scheduleType) => {
        try {

            // if the user has not made any queries today, erase the database to refetch the data (because it updates everyday at midnight)
            clearDatabaseIfNotUpdatedToday()

            let schedule = await scheduleDao.find(id);
            if (schedule == null) {
                schedule = await scheduleDao.save(id, scheduleType)
            }

            if (schedule == null) {
                return null
            }

            return await scheduleDao.findByDay(schedule, date)

        } catch (e) {
            console.log(e);
            return Promise.reject({message : "error"})
        }
    },

    findByTime : async(id, time, scheduleType) => {
        try {

            // if the user has not made any queries today, erase the database to refetch the data (because it updates everyday at midnight)
            clearDatabaseIfNotUpdatedToday()

            const room = await roomDao.find(id);
            if (room == null) {
                return null;
            }

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
            console.log(e);
            return Promise.reject({message : "error"})
        }
    },

    populate : async(fileName) => {
        try {
            let file = "";
            switch (fileName) {
                case "schedules":
                    return await scheduleDao.populate("./data/schedules.csv")

                case "rooms":
                    return await roomDao.populate("./data/rooms.csv")

                case "teachers":
                return await teacherDao.populate("./data/teachers.csv")
                
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

    findTeachers : async () => {
        try {
            return await teacherDao.findAll();

        } catch (e) {
            return Promise.reject({message : "error"})
        }
    },

    findRoom : async (id, time) => {
        try {
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

                // filter computer rooms only if needed
                if (computerRoomsOnly == false || room.computerRoom) {
                    const roomSchedule = await controller.findByTime(room.id, time, scheduleType);
                    console.log(roomSchedule);

                    // if the room is free, add it to the table of free rooms
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
                return {message: "user already exists"}
            }

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
                token: token
            })

            const userAdded = await userDao.add(userToAdd);
            return {token: userAdded.token}


        } catch (e) {
            console.log(e);
            return Promise.reject({message : "error"})
        }
    },

    login : async (user) => {
        try {
            const userFound = await userDao.find(user.login)
            if (!userFound || !bcrypt.compareSync(user.password, userFound.password)) {
                console.log("wrong");
                return {message: "user not found"}
            }

            const token = jwt.sign(
                { login: user.login },
                PRIVATE_KEY,
                {
                    expiresIn: "1h",
                }
            );

            userFound.token = token

            const userUpdated = await userDao.update(userFound)
            // delete userUpdated.password
            return {token: userUpdated.token}

        } catch (e) {
            console.log(e);
            return Promise.reject({message : "error"})
        }
    },

    setFavorite : async(token, favoriteSchedule) => {
        try {
            const user = await userDao.findByToken(token)
            if (user == null) {
                return null
            }

            const validToken = verifyToken(user.token)
            // if the token is invalid (a valid token is an dictionary with 3 keys : login, iat, exp)
            if (!validToken.login) {
                return validToken
            }

            user.favoriteSchedule = favoriteSchedule
            const userUpdated = await userDao.update(user)
            delete userUpdated.password
            return userUpdated

        } catch (e) {
            console.log(e);
            return Promise.reject({message : "error"})
        }
    },

    getFavorite : async (token) => {
        try {
            const user = await userDao.findByToken(token)
            if (user == null) {
                return null
            }

            const validToken = verifyToken(token)
            // if the token is invalid (a valid token is an dictionary with 3 keys : login, iat, exp)
            if (!validToken.login) {
                return validToken
            }

            return user.favoriteSchedule

        } catch (e) {
            console.log(e);
            return Promise.reject({message : "error"})
        }
    },
}
