module.exports = function (apiKey, domain, sender) {
    let mailgun = require('mailgun-js')({
        apiKey: apiKey,
        domain: domain
    })

    return {
        send: async function (receiver, subject, body) {
            let data = {
                from: sender + '<logins@' + domain + '>',
                to: receiver,
                subject: subject,
                html: body
            }

            mailgun.messages().send(data, function (error, body) {
                console.log(body)
            })
        }
    }
}