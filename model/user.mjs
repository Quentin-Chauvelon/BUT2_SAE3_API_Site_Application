class User {
    login
    password
    favoriteSchedule
    token

    constructor(obj) {
        Object.assign(this, obj)
    }
}

export {User}