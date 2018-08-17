let Jimp = require('jimp')
let AWS = require('aws-sdk')
let {promisify} = require("es6-promisify");

module.exports = (config) => {
    let key = config.key
    let secret = config.secret
    let region = config.region
    let bucket = config.bucket
    let path = config.avatarPath

    AWS.config.update({ accessKeyId: key, secretAccessKey: secret, region: region })

    let uploadAvatar = async (buffer, name) => {
        let s3 = new AWS.S3()
        return await new Promise((resolve, reject) => {
            s3.upload({
                Bucket: bucket,
                Key: path + '/' + name + '.png',
                Body: buffer,
                ACL: 'public-read'
            }, resolve)
        })
    }

    let uploadUserImage = async (id, url) => {
        //Download and convert image
        let image = await Jimp.read(url)
        image.resize(512, 512)
        await uploadAvatar(await image.getBufferAsync('image/png'), id + '_512')
        return 'https://s3.eu-central-1.amazonaws.com/quexten/sso-dev/avatars/' + id + '_512.png'
    }

    return {
        uploadUserImage
    }
}
