var tfa = require('2fa');

module.exports = {
    handleRequest: (req, res) => {
        tfa.generateBackupCodes(8, 'xxxx-xxxx-xxxx', function(err, codes) {

        }
    }
}