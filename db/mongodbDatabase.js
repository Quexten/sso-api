import Database from './database'
import { MongoClient, ObjectId } from 'mongodb'

export default class MongoDatabase extends Database {

    constructor () {
        super()
        this.users = null
    }

    async connect (url) {
        let mongo = await MongoClient.connect(url)
        let database = mongo.db('sso-api')
        this.users = database.collection('users')
    }

    async createUser(user) {
        return (await this.users.insertOne(user)).insertedId
    }

    async findUser(id) {
        return await this.users.findOne({ _id: ObjectId(id) })
    }

    async updateUser(id, user) {
        await this.users.updateOne({ _id: ObjectId(id)}, { $set: user })
    }

    async deleteUser(id) {
        await this.users.removeOne({ _id: ObjectId(id) })
    }

    async findUserByPrimaryAuthenticatorId (authType, id) {
        return await this.users.findOne({
            'authentication.primary.id': id,
            'authentication.primary.type': authType
        })
    }

    async getUsers (startIndex, endIndex) {
        return await this.users.find({}).toArray()
    }

    async deleteUsers () {
        await this.users.drop()
    }

}
