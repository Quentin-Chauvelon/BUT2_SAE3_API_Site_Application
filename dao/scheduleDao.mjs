"use strict"

import fetch from "node-fetch";
import toJSON from "ical-js-parser/toJSON/index.js";

import {Cours} from "../model/cours.mjs"
const baseURL = "https://edt.univ-nantes.fr/iut_nantes";

export const scheduleDao = {
    findAll : async(url) => {
        try {
            let classes = await fetch(baseURL + url + ".ics")
            .then(ics => ics.text());

            classes = await toJSON.default(classes);
            classes.events = classes.events.map(cours => new Cours(cours))

            return classes.events

        } catch (e) {
            return Promise.reject({message : "error"})
        }
    },

    findByDay : async(url, date) => {
        try {
            const classes = await scheduleDao.findAll(url);
            const classesOfDay = []

            classes.forEach(cours => {
                if (cours.isSameDay(date)) {
                    classesOfDay.push(cours);
                }
            });

            return classesOfDay;
            
        } catch (e) {
            return Promise.reject({message : "error"})
        }
    },

    findByTime : async(url, time) => {
        try {
            const classesOfDay = await scheduleDao.findByDay(url, time);
            let coursAtTime = {free : true}; // default

            classesOfDay.forEach(cours => {
                if (cours.isTimeDuringClass(time)) {
                    coursAtTime = cours
                }
            });

            return coursAtTime;
            
        } catch (e) {
            return Promise.reject({message : "error"})
        }
    }
}