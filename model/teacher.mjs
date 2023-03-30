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

export {Teacher}