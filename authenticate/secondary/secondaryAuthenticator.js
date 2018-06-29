module.exports = class SecondaryAuthenticator {

    constructor() {
    }

    async create () {
        // returns the data to send back to the client
    }

    async verify (data) {
        //rejects if can't be verified, otherwise returns data
    }

    async authenticate (requestData, databaseData) {
        //return whether the auth is successful
    }

}