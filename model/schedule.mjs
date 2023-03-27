class Schedule {
    id
    classes
    type

    constructor(obj) {
        // obj.location = obj.location.replace("J-", "");
        Object.assign(this, obj)
    }
}

export {Schedule}