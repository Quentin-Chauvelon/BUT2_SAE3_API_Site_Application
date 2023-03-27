class Room {
    id
    name
    computerRoom

    constructor(obj) {
        // obj.location = obj.location.replace("J-", "");
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