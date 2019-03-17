import mailgunjs from 'mailgun-js'

export default function (apiKey, domain, sender) {
    let mailgun = mailgunjs({
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