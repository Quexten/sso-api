module.exports = async (database) => {

    let createUser = async () => {
        let user = {
            _id: await database.getUniqueId(),
            authentication: {
                primary: [],
                secondary: [],
                sessions: []
            },
            audit: {
                events: [
                ]
            },
            profile: {
                avatar: '',
                username: ''
            }
        }
        await database.createUser(user)
        return user
    }

    let deleteUser = async (userId) => {
        await database.deleteUser(userId)
    }

    let getUser = async (userId) => {
        return await database.findUser(userId)
    }

    let getUsers = async () => {
        return await database.getUsers()
    }

    return {
        createUser,
        deleteUser,
        getUsers,
        getUser
    }
}
