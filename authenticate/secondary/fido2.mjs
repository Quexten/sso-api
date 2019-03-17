import fido2lib from 'fido2-lib'
const { Fido2Lib } = fido2lib

export default async () => {

// create a new instance of the library
    var f2l = new Fido2Lib();
    var registrationOptions = await f2l.attestationOptions();

// make sure to add registrationOptions.user.id
// save the challenge in the session information...
// send registrationOptions to client and pass them in to `navigator.credentials.create()`...
// get response back from client (clientAttestationResponse)

    var attestationExpectations = {
        challenge: "33EHav-jZ1v9qwH783aU-j0ARx6r5o-YHh-wd7C6jPbd7Wh6ytbIZosIIACehwf9-s6hXhySHO-HHUjEwZS29w",
        origin: "https://localhost:8443",
        factor: "either"
    };
    var regResult = await f2l.attestationResult(clientAttestationResponse, attestationExpectations); // will throw on error
    return regResult
}

