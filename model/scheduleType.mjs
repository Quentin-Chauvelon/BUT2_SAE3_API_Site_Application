class ScheduleType {
    static Schedule = new ScheduleType()
    static Teacher = new ScheduleType()
    static Room = new ScheduleType()

    // constructor(id) {
    //     this.id = id
    //     this.Schedule = []
    // }

    getUrl(id) {
        if (this == ScheduleType.Teacher) {
            return "_pers/s" + id
        } else if (this == ScheduleType.Room) {
            return "_pers/r" + id
        } else {
            return "/g" + id
        }
    }

    getType() {
        if (this == ScheduleType.Teacher) {
            return "teacher"
        } else if (this == ScheduleType.Room) {
            return "room"
        } else {
            return "schedule"
        }
    }
}

export {ScheduleType}