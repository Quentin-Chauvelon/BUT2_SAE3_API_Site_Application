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
            const schedule = await prisma.schedule.findMany({
                include: {
                    classes: true
                }
            });

            for (const index of schedule[0].classes.keys()) {
                schedule[0].classes[index] = new Cours(schedule[0].classes[index])
            }
            // schedule[0].classes.map((cours) => {
            //     return new Cours(cours)
            // })

            return schedule

        } catch(e){
            return Promise.reject(e)
        }
    },
    
    find : async(id) => {
        try {
            let classes = await prisma.schedule.findUnique({
                where: {
                    id: id
                }
            })
            
            if (classes == null) {
                classes = await fetch(baseURL + id + ".ics")
                .then(ics => ics.text());
                
                classes = await toJSON.default(classes).events;
                
                for (const [index, cours] of classes.entries()) {
                    // const room = await roomDao.findByName(cours.location.substring(2));
                    const room = cours.location.substring(2);
                    classes[index] = new Cours(cours, room);
                }
            }
            
            return classes
            
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
    
    save : async(schedule) => {
        
        try {

            const param = {...schedule}
            delete param.classes
            
            await prisma.schedule.create({
                data: param
            })

            // for (const i of schedule.classes.keys()) {
            //     schedule.classes[i] = schedule.classes[i].getPrismaObject();
            // }

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
            
        } catch(e){
            console.log(e);
            return Promise.reject(e)
        }
    }
}