class Room {
    id
    name
    computerRoom

    constructor(obj) {
        Object.assign(this, obj)
    }

    getScheduleURL() {
        return "_pers/r" + this.id.toString()
    }
}

const DEFAULT_ROOM = new Room({
    id: 0,
    name: "",
    computerRoom: false
})


export {Room, DEFAULT_ROOM}