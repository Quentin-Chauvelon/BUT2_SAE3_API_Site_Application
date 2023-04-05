"use strict"

import { PrismaClient } from '@prisma/client'
import csv from 'csv-parser'
import fs from 'node:fs'

import {Room} from '../model/room.mjs'

let prisma = new PrismaClient()

export const roomDao = {
    findAll : async() => {
        try {
            return await prisma.room.findMany({});
        } catch(e){
            return Promise.reject(e)
        }
    },

    find : async (id) => {
        try {
            return await prisma.room.findUnique({
                where: {
                    id: id
                }
            })
        } catch(e){
            return Promise.reject(e)
        }
    },
    
    findByName : async (name) => {
        try {
            return await prisma.room.findFirst({
                where: {
                    name: name
                }
            })
        } catch(e){
            return Promise.reject(e)
        }
    },
    
    save : async (room) => {
        try {
            return await prisma.room.create({
                data: room
            })
        } catch(e){
            return Promise.reject(e)
        }
    },
    
    populate : async (fileName) => {
        try {
            await roomDao.deleteAll();
            
            await new Promise((resolve, reject) => {
                fs.createReadStream(fileName)
                .pipe(csv())
                .on('data', async data => {
                    const room = new Room({
                        id: parseInt(data["id"]),
                        name: data["name"],
                        computerRoom: (parseInt(data["computerRoom"])) ? true : false
                    })
                    
                    try {
                        await roomDao.save(room)
                    }
                    catch (e) {
                        // reject({message: "error"})
                    }
                })
                .on('end', () => {
                    resolve(true);
                });
            })
            
            return await roomDao.findAll();
        } catch(e){
            return Promise.reject(e)
        }
    },
    
    deleteAll : async() => {
        try {
            return prisma.room.deleteMany({});
        } catch(e){
            return Promise.reject(e)
        }
    }
}