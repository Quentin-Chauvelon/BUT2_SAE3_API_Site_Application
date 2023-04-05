"use strict"

import { PrismaClient } from '@prisma/client'
import csv from 'csv-parser'
import fs from 'node:fs'

import {Teacher} from '../model/teacher.mjs'

let prisma = new PrismaClient()


export const teacherDao = {
    findAll : async() => {
        try {
            return await prisma.teacher.findMany({});
        } catch(e){
            return Promise.reject(e)
        }
    },

    find : async (id) => {
        try {
            return await prisma.teacher.findUnique({
                where: {
                    id: id
                }
            })
        } catch(e){
            return Promise.reject(e)
        }
    },

    findByName : async (name) => {
        for (const teacher of Teachers) {
            if (teacher.name == name) {
                return teacher
            }
        }

        return null
    },
    
    populate : async (fileName) => {
        try {
            await teacherDao.deleteAll();
            
            await new Promise((resolve, reject) => {
                fs.createReadStream(fileName)
                .pipe(csv())
                .on('data', async data => {
                    const teacher = new Teacher({
                        id: parseInt(data["id"]),
                        name: data["name"],
                    })
                    
                    try {
                        await teacherDao.save(teacher)
                    }
                    catch (e) {
                        // reject({message: "error"})
                    }
                })
                .on('end', () => {
                    resolve(true);
                });
            })
            
            return await teacherDao.findAll();
        } catch(e){
            return Promise.reject(e)
        }
    },

    save : async (teacher) => {
        try {
            return await prisma.teacher.create({
                data: teacher
            })
        } catch(e){
            return Promise.reject(e)
        }
    },

    deleteAll : async() => {
        try {
            return prisma.teacher.deleteMany({});
        } catch(e){
            return Promise.reject(e)
        }
    }
}