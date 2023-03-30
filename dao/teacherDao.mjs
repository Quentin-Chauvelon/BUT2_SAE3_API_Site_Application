"use strict"

import { PrismaClient } from '@prisma/client'
import csv from 'csv-parser'
import fs from 'node:fs'

let prisma = new PrismaClient()

import {Teacher} from '../model/teacher.mjs'
import { scheduleDao } from './scheduleDao.mjs'


// let prisma = new PrismaClient()

export const teacherDao = {
    findAll : async() => {
        try {
            return await prisma.teacher.findMany({});
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
            await scheduleDao.deleteAll();
            
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
            console.log(e);
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

    // //tous les utilisteurs
    // findAll : async () => {
    //     try {
    //         const users = (await prisma.user.findMany()).map(obj => new User(obj))
    //         return users
    //     } catch (e) {
    //         return Promise.reject(e)
    //     }
    //     },


    // //renvoie l'utilisateur ajouté ou une erreur sinon
    // findByLogin : async (login) => {
    //     try {
    //         const elt = await prisma.user.findUnique({where: {login: login}})
    //         return elt == null ? null : new User(elt)
    //     } catch (e) {
    //         return Promise.reject(e)
    //     }
    // },
    // //supprime un utilisateur
    // //renvoie l'utilisateur supprimé ou erreur sinon
    // deleteByLogin: async (login) => {
    //     try {
    //         const elt = await prisma.user.delete({where: {login: login}})
    //         return new User(elt)
    //     }
    //     catch (e) {
    //         return Promise.reject(e)
    //     }
    // },
    // //ajout un utilisateur
    // //renvoie l'utilisateur ajouté ou une erreur si il était déjà présent
    // add: async (user) => {
    //     try {
    //         const elt = await prisma.user.create({data: user})
    //         return new User(elt)
    //     }
    //     catch (e) {
    //         return Promise.reject(e)
    //     }
    // },

    // //Modifie un utilisateur
    // //premd en paramètre le login du user à modifier et la modification
    // //renvoie le user modifier ou une erreur
    // update: async (login, user) => {
    //     try {
    //         const elt = await prisma.user.update({
    //             where: {
    //                 login: login
    //             },
    //             data: user
    //         })
    //         return new User(elt)
    //     } catch (e) {
    //         return Promise.reject(e)
    //     }
    // }
}