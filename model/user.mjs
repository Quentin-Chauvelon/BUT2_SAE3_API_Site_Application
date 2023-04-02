class User {
    login
    password
    favoriteSchedule
    favoriteAddress
    favoriteTransitMode
    token

    constructor(obj) {
        Object.assign(this, obj)
    }
}

export {User}