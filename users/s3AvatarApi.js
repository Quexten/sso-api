import Jimp from 'jimp'
import AWS  from 'aws-sdk'

export default class S3AvatarApi {

    constructor (config) {
        this.key = config.key
        this.secret = config.secret
        this.region = config.region
        this.bucket = config.bucket
        this.path = config.avatarPath
        AWS.config.update({ accessKeyId: this.key, secretAccessKey: this.secret, region: this.region })
    }

    async uploadAvatar (buffer, name) {
        let s3 = new AWS.S3()
        return await new Promise((resolve, reject) => {
            s3.upload({
                Bucket: this.bucket,
                Key: this.path + '/' + name + '.png',
                Body: buffer,
                ACL: 'public-read',
                ContentType: 'image/png'
            }, resolve)
        })
    }

    async uploadUserImage (id, url) {
        //Download and convert image
        let image = await Jimp.read(url)
        image.resize(512, 512)
        await this.uploadAvatar(await image.getBufferAsync('image/png'), id + '_512')
        return 'https://s3.eu-central-1.amazonaws.com/quexten/sso-dev/avatars/' + id + '_512.png'
    }
}