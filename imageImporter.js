let Jimp = require('jimp')
let AWS = require('aws-sdk')

module.exports = (config) => {
    let key = config.key
    let secret = config.secret
    let region = config.region
    let bucket = config.bucket
    let path = config.avatarPath

    AWS.config.update({ accessKeyId: key, secretAccessKey: secret, region: region })

    let uploadAvatar = async (buffer, name) => {
        let s3 = new AWS.S3()
        return s3.upload({
            Bucket: bucket,
            Key: path + '/' + name + '.png',
            Body: buffer,
            ACL: 'public-read'
        }, (resp) => {
            console.log(arguments)
            console.log('up')
        })
    }

    let setUserImage = async (id, url) => {
        //Download and convert image
        let image = await Jimp.read(url)
        image.resize(512, 512)
        await uploadAvatar(await image.getBufferAsync('image/png'), id + '_512')
        image.resize(256, 256)
        await uploadAvatar(await image.getBufferAsync('image/png'), id + '_256')
    }

    return {
        setUserImage
    }
}
