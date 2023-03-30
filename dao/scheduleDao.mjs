import {PrismaClient} from "@prisma/client";
import fetch from "node-fetch";
import toJSON from "ical-js-parser/toJSON/index.js";
import csv from 'csv-parser'
import fs from 'node:fs'

import {roomDao} from "./roomDao.mjs"
import {Schedule} from "../model/schedule.mjs";
import {Cours} from "../model/cours.mjs"
import {Room} from "../model/room.mjs";
import {Schedules} from "../model/schedules.mjs";

const prisma = new PrismaClient()

let lastUpdate = null;
const baseURL = "https://edt.univ-nantes.fr/iut_nantes";

export const scheduleDao = {
    
    findAll : async() => {
        try {
            const schedules = await prisma.schedule.findMany({
                include: {
                    classes: true
                }
            });

            if (schedules == null) {
                return null
            }

            // for (const index of schedule[0].classes.keys()) {
            //     schedule[0].classes[index] = new Cours(schedule[0].classes[index])
            // }

            schedules.forEach(schedule => {
                schedule.classes = schedule.classes.map((cours) => {
                    return new Cours(cours)
                })
            });

            return schedule

        } catch(e){
            return Promise.reject(e)
        }
    },
    
    find : async(id) => {
        try {
            const schedule = await prisma.schedule.findUnique({
                where: {
                    id: id
                },

                include: {
                    classes: true
                }
            })
            
            if (schedule == null) {
                return null
            }

            // for (const index of schedule.classes.keys()) {
            //     schedule.classes[index] = new Cours(schedule.classes[index])
            // }
            schedule.classes = schedule.classes.map((cours) => {
                return new Cours(cours)
            })

            return schedule
            
        } catch(e){
            return Promise.reject(e)
        }
    },

    findSchedules : async() => {
        try {
            console.log(await prisma.schedules.findMany({}));
            return await prisma.schedules.findMany({})
        } catch(e){
            return Promise.reject(e)
        }
    },
    
    findByDay : async(schedule, date) => {
        try {
            const classesOfDate = [];
            
            schedule.classes.forEach(cours => {
                if (cours.isSameDay(date)) {
                    classesOfDate.push(cours);
                }
            });
            
            return classesOfDate;

        } catch(e){
            return Promise.reject(e)
        }
    },

    findByTime : async(schedule, time) => {
        try {
            const classesOfDate = [];
            
            schedule.classes.forEach(cours => {
                if (cours.isSameDay(time) && cours.isTimeDuringClass(time)) {
                    classesOfDate.push(cours);
                }
            });
            
            return classesOfDate;

        } catch(e){
            return Promise.reject(e)
        }
    },
    
    deleteAll : async() => {
        try {
            return await prisma.schedule.deleteMany({})
        } catch(e){
            return Promise.reject(e)
        }
    },
    
    save : async(id, scheduleType) => {
        try {
            let classes = await fetch(baseURL + scheduleType.getUrl(id) + ".ics")
            .then(ics => ics.text());
            
            classes = await toJSON.default(classes).events;

            classes = classes.map((cours) => {
                const room = cours.location.substring(2);
                return new Cours(cours, room)
            })

            let schedule = new Schedule({
                id: id,
                classes: classes,
                type: scheduleType.getType(),
            })

            const param = {...schedule}
            delete param.classes
            
            await prisma.schedule.create({
                data: param
            })

            await prisma.schedule.update({
                data : {
                    classes: {
                        create: schedule.classes
                    }
                },
                where : {
                    id : schedule.id
                }
            })

            return await scheduleDao.find(id)
            
        } catch(e){
            console.log(e);
            return Promise.reject(e)
        }
    },

    findSchedules : async () => {
        try {
            return await prisma.schedules.findMany({})
        } catch(e){
            return Promise.reject(e)
        }
    },

    saveSchedules : async (schedule) => {
        try {
            return await prisma.schedules.create({
                data: schedule
            })
        } catch(e){
            return Promise.reject(e)
        }
    },

    deleteSchedules : async (schedule) => {
        try {
            return await prisma.schedules.deleteMany({})
        } catch(e){
            return Promise.reject(e)
        }
    },

    populate : async (fileName) => {
        try {
            await scheduleDao.deleteSchedules();
            
            await new Promise((resolve, reject) => {
                fs.createReadStream(fileName)
                .pipe(csv())
                .on('data', async data => {
                    const schedules = new Schedules({
                        id: parseInt(data["id"]),
                        name: data["name"],
                    })
                    
                    try {
                        await scheduleDao.saveSchedules(schedules)
                    }
                    catch (e) {
                        // reject({message: "error"})
                    }
                })
                .on('end', () => {
                    resolve(true);
                });
            })
            
            return await scheduleDao.findSchedules();
        } catch(e){
            return Promise.reject(e)
        }
    },
}