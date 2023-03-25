"use strict"

// import { PrismaClient } from '@prisma/client'

import {Rooms} from '../model/room.mjs'

// let prisma = new PrismaClient()

export const roomDao = {
    findAll : async() => {
        return Rooms;
    },

    findByName : async (name) => {
        for (const room of Rooms) {
            if (room.name == name) {
                return room;
            }
        }

        return null;
    },
}