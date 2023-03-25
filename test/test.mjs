"use strict"

import fetch from "node-fetch";
import toJSON from "ical-js-parser/toJSON/index.js";
import {Cours, Teachers, Rooms, allSchedules} from "../cours.mjs"

const baseURL = "https://edt.univ-nantes.fr/iut_nantes";


// const today  = new Date();
// const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(today);
// const month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(today);
// const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(today);
// const todayString = `${year}${month}${day}`


async function readIcs(url) {
    const ics = await fetch(baseURL + url + ".ics")
    .then(ics => ics.text());
    
    return toJSON.default(ics);
}


function formatDateToString(date) {
    const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
    const month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date);
    const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
    
    return `${year}${month}${day}`;
}


async function getClassesOfDay(date, url) {
    const classes = await readIcs(url);
    const classesOfDay = []

    classes.events.forEach(todayClass => {
        const cours = new Cours(todayClass);

        if (cours.isSameDay(date)) {
            classesOfDay.push(cours)
        }
    });

    return classesOfDay
}

async function getProfs(teacher, date) {
    const classesOfDay = await getClassesOfDay(date, teacher.getScheduleURL());

    if (classesOfDay.length == 0) {
        console.log(teacher.name + " n'a pas cours aujourd'hui !")
    } else {
        console.log("Vous trouverez " + teacher.name + " :")
        classesOfDay.forEach(cours => {
            console.log(`En ${cours.location} de ${cours.start.getHours() + 1}h${cours.start.getMinutes()} à ${cours.end.getHours() + 1}h${cours.end.getMinutes()}`);
        });
    }
}


async function getFreeRooms(date) {
    const rooms = Rooms;
    
    for (const room of rooms) {
        // rooms.forEach(async room => {
        const classesOfDay = await getClassesOfDay(date, room.getScheduleURL());

        classesOfDay.forEach(cours => {
                if (cours.isTimeDuringClass(date.getTime())) {
                room.free = false;
            }
        });
    };
    
    console.log(`Liste des salles libres à ${date.getHours()}h${date.getMinutes()} :`);
    rooms.forEach(room => {
        if (room.free) {
            console.log(room.location);
        }
    });
}

// add filter for rooms you like or don't like + filter for computer rooms only
// which is better? checking all the rooms schedules one by one (better since you can choose which room to query) or the promo1 and promo2 and then marking the room as taken?
// check if getMinutes < 10 and add 0


// Teachers.forEach(teacher => {
//     getProfs(teacher, new Date(2023, 2, 24))
// });

// console.log(await getClassesOfDay(new Date(), "/g3184"))
// console.log(await getClassesOfDay(new Date(2023, 2, 23), "/g3184"))

// Google Maps routes API ($300 trial (up to 60 000 request?))

// in dates, month starts at 0 so 2 is march and not february + since it's utc time (not sure), 16h45 is actually 17h45 (substract 1 hour)
// getFreeRooms(new Date(2023, 2, 22, 13, 0))