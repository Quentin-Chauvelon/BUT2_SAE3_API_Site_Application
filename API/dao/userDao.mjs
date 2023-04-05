"use strict"

import { PrismaClient } from '@prisma/client'

import {User} from "../model/user.mjs"

let prisma = new PrismaClient()

export const userDao = {
    findAll : async () => {
        try {
            const users = await prisma.user.findMany({})

            // renvoie l'objet sans le mot de passe
            users.forEach(user => {
                delete user.password;
            });

            return users

        } catch(e){
            return Promise.reject(e)
        }
    },

    find : async (login) => {
        try {
            let userFound = await prisma.user.findUnique({
                where: {
                    login: login
                }
            })

            if (userFound == null) {
                return null
            }

            userFound = new User(userFound)
            return userFound;

        } catch(e){
            return Promise.reject(e)
        }
    },

    findByToken : async (token) => {
        try {
            let userFound = await prisma.user.findFirst({
                where: {
                    token: token
                }
            })

            if (userFound == null) {
                return null
            }

            userFound = new User(userFound)
            return userFound;

        } catch(e){
            return Promise.reject(e)
        }
    },


    add : async (user) => {
        try {

            let userFound = await prisma.user.create({
                data: user
            })

            if (userFound == null) {
                return null
            }

            userFound = new User(userFound)
            delete userFound.password
            return userFound;

        } catch(e){
            return Promise.reject(e)
        }
    },

    deleteAll : async () => {
        try {
            return await prisma.user.deleteMany({})
        } catch(e){
            return Promise.reject(e)
        }
    },

    delete : async (login) => {
        try {
            const user = await prisma.user.delete({
                where: {
                    login: login
                }
            })

            if (user == null) {
                return null;
            }

            delete user.password
            return user

        } catch(e){
            return Promise.reject(e)
        }
    },

    update : async (user) => {
        try {
            let userFound = await prisma.user.update({
                data: user,
                
                where: {
                    login: user.login
                }
            })

            if (userFound == null) {
                return null
            }

            userFound = new User(userFound)
            delete userFound.password
            return userFound;

        } catch(e){
            return Promise.reject(e)
        }
    }
}