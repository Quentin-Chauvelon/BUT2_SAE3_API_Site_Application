"use strict"

import { PrismaClient } from '@prisma/client'
import csv from 'csv-parser'
import fs from 'node:fs'

import {Room} from '../model/room.mjs'

let prisma = new PrismaClient()

export const roomDao = {
    findAll : async() => {
        return await prisma.room.findMany({});
    },

    findByName : async (name) => {
        return await prisma.room.findFirst({
            where: {
                name: name
            }
        })
    },

    save : async (room) => {
        return await prisma.room.create({
            data: room
        })
    },

    populate : async (fileName) => {
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
    },

    deleteAll : async() => {
        return prisma.room.deleteMany({});
    }
}