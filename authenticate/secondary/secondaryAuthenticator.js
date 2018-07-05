module.exports = class SecondaryAuthenticator {

    constructor() {
    }

    async create () {
        // returns the data of the form:
        // { id: [AuthenticatorId], data: CustomAuthData
    }

    async verify (data) {
        // returns true if data is verified, otherwise returns false
    }

    async authenticate (requestData, databaseData) {
        //return whether the auth is successful
    }

}