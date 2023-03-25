class Teacher {
    id
    name

    constructor(obj) {
        Object.assign(this, obj)
    }

    getScheduleURL() {
        return "_pers/s" + this.id.toString()
    }
}


const Teachers = [
    new Teacher({
        id: 360071,
        name: "Jean-François BERDJUGIN"
    }),

    new Teacher({
        id: 2208,
        name: "Arnaud LANOIX"
    }),

    new Teacher({
        id: 2232,
        name: "Jean-Marie MOTTU"
    })
]

export {Teachers}