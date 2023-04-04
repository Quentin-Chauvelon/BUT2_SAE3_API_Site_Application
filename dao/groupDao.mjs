import {PrismaClient} from "@prisma/client";
import csv from 'csv-parser'
import fs from 'node:fs'

import {Group} from "../model/group.mjs";

const prisma = new PrismaClient()

export const groupDao = {
    findAll : async () => {
        try {
            return await prisma.group.findMany({})
        } catch(e){
            return Promise.reject(e)
        }
    },

    find : async (id) => {
        try {
            return await prisma.group.findUnique({
                where: {
                    id: id
                }
            })
        } catch(e){
            return Promise.reject(e)
        }
    },

    save : async (group) => {
        try {
            return await prisma.group.create({
                data: group
            })
        } catch(e){
            return Promise.reject(e)
        }
    },

    deleteAll : async () => {
        try {
            return await prisma.group.deleteMany({})
        } catch(e){
            return Promise.reject(e)
        }
    },

    populate : async (fileName) => {
        try {
            await groupDao.deleteAll();
            
            await new Promise((resolve, reject) => {
                fs.createReadStream(fileName)
                .pipe(csv())
                .on('data', async data => {
                    const group = new Group({
                        id: parseInt(data["id"]),
                        name: data["name"],
                    })
                    
                    try {
                        await groupDao.save(group)
                    }
                    catch (e) {
                        // reject({message: "error"})
                    }
                })
                .on('end', () => {
                    resolve(true);
                });
            })
            
            return await groupDao.findAll();
        } catch(e){
            return Promise.reject(e)
        }
    },
}