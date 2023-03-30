"use strict"


class Teacher {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    getScheduleURL() {
        return "_pers/s" + this.id
    }
}


class Room {
    constructor(id, location, computerRoom = false, free = true) {
        this.id = id
        this.location = location.replace("J-", "");
        this.computerRoom = computerRoom
        this.free = free
    }
    
    getScheduleURL() {
        return "_pers/r" + this.id
    }
}


const allSchedules = [
    "/g3145",
    "/g3177"
]


function formatStringToDate(stringDate) {
    const [date, time] = stringDate.split("T")

    const year = parseInt(date.substring(0,4))
    const month = parseInt(date.substring(4,6))
    const day = parseInt(date.substring(6,8))

    const hour = parseInt(time.substring(0,2))
    const minute = parseInt(time.substring(2,4))

    return new Date(year, month - 1, day, hour, minute, 0)
}


class Cours {
    constructor(cours) {
        this.start = formatStringToDate(cours.dtstart.value);
        this.end = formatStringToDate(cours.dtend.value);
        this.summary = cours.summary;
        this.location = cours.location.substring(2);
    }

    isSameDay(date) {
        return (
            this.start.getFullYear() == date.getFullYear() &&
            this.start.getMonth() == date.getMonth() &&
            this.start.getDate() == date.getDate()
        )
    }

    isTimeDuringClass(time) {
        return (
            time >= this.start.getTime() &&
            time <= this.end.getTime()
        )
    }
}


const Teachers = [
    new Teacher(360071, "Jean-François BERDJUGIN"),
    new Teacher(220150156, "Arnaud LANOIX"),
    new Teacher(2232, "Jean-Marie MOTTU"),
]


const Rooms = [
    new Room(1299, "C0/01", true),
    new Room(89806, "C0/02", true),
    new Room(1300, "C0/03", true),
    new Room(1301, "C0/04", true),
    new Room(89804, "C0/05", false)
]

export {Cours, Teachers, Rooms, allSchedules}