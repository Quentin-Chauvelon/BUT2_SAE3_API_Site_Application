import {PrismaClient} from "@prisma/client";
import fetch from "node-fetch";
import toJSON from "ical-js-parser/toJSON/index.js";
import csv from 'csv-parser'
import fs from 'node:fs'

import {roomDao} from "./roomDao.mjs"
import {Schedule} from "../model/schedule.mjs";
import {Cours} from "../model/cours.mjs"
import {Room} from "../model/room.mjs";

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
            // On fetch l'ics pour récupérer l'ensemble des cours
            let classes = await fetch(baseURL + scheduleType.getUrl(id) + ".ics")
            .then(ics => ics.text());
            
            // On transforme cet ics (texte) en JSON
            classes = await toJSON.default(classes).events;

            // On transforme chaque cours en un objet Cours pour pouvoir les manipuler plus facilement (notamment pour les dates)
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
            return Promise.reject(e)
        }
    },
}