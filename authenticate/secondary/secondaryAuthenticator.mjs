export default class SecondaryAuthenticator {

    constructor() {
    }

    async create () {
        // returns the data of the form:
        // { id: [AuthenticatorId], data: CustomAuthData
    }

    async verify (requestData, databaseData) {
        //returns whether request data could be matched
        // with databse data
    }

    async onAuthenticate (requestData, databaseData) {
        //runs on successful authentication, for instance
        //to remove used otp's
    }

}