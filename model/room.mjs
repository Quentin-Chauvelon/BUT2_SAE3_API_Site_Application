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


const Rooms = [
    new Room({
        id: 1299,
        name: "C0/01",
        computerRoom: true
    }),

    new Room({
        id: 89806,
        name: "C0/02",
        computerRoom: true
    }),

    new Room({
        id: 1300,
        name: "C0/03",
        computerRoom: true
    }),

    new Room({
        id: 1301,
        name: "C0/04",
        computerRoom: true
    }),

    new Room({
        id: 89804,
        name: "C0/05",
        computerRoom: false
    })
]

export {Rooms}