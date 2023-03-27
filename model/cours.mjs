import {Room, DEFAULT_ROOM} from "./room.mjs"

function formatStringToDate(stringDate) {
    const [date, time] = stringDate.split("T")

    const year = parseInt(date.substring(0,4))
    const month = parseInt(date.substring(4,6))
    const day = parseInt(date.substring(6,8))

    const hour = parseInt(time.substring(0,2)) + 2
    const minute = parseInt(time.substring(2,4))

    return new Date(year, month - 1, day, hour, minute, 0)
}


class Cours {
    id
    start
    end
    summary
    location
    roomId
    Schedule
    scheduleId

    constructor(obj, room) {
        let cours = {
            id: 0,
            start: obj.start,
            end: obj.end,
            summary: obj.summary,
            location: (room) ? new Room(room) : DEFAULT_ROOM,
            roomId: (room) ? room.id : DEFAULT_ROOM.id,
            Schedule: null,
            scheduleId: null
        };

        Object.assign(this, cours)
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
            time.getTime() >= this.start.getTime() &&
            time.getTime() <= this.end.getTime()
        )
    }
}

export {Cours}

// start: formatStringToDate(obj.dtstart.value),
// end: formatStringToDate(obj.dtend.value),