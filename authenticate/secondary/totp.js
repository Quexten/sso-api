module.exports = function (request, response, callback) {
    callback(true, response)
}
var tfa = require('2fa');

tfa.generateKey(32, function(err, key) {
    tfa.generateBackupCodes(8, 'xxxx-xxxx-xxxx', function(err, codes) {
        // [ '7818-b7b8-c928', '3526-dc04-d3f2', 'be3c-5d9f-cb68', ... ]

    })

    tfa.generateGoogleQR('Quexten', 'id', key, function(err, qr) {

    });

    var opts = {
        beforeDrift: 2,
        afterDrift: 2,
        drift: 4,
        step: 30
    };

    var code = tfa.generateCode(key, counter)
    var validTOTP = tfa.verifyTOTP(key, code, opts)

});
