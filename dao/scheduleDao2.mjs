import {PrismaClient} from "@prisma/client";
import fetch from "node-fetch";
import toJSON from "ical-js-parser/toJSON/index.js";

import {roomDao} from "../dao/roomDao.mjs"
import {Schedule} from "../model/schedule.mjs";
import {Cours} from "../model/cours.mjs"
import { Room } from "../model/room.mjs";

const prisma = new PrismaClient()

let lastUpdate = null;
const baseURL = "https://edt.univ-nantes.fr/iut_nantes";

export const scheduleDao2 = {
    
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

            // TODO map
            for (const index of schedule[0].classes.keys()) {
                schedule[0].classes[index] = new Cours(schedule[0].classes[index])
            }

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

            return await scheduleDao2.find(id)
            
        } catch(e){
            console.log(e);
            return Promise.reject(e)
        }
    }
}