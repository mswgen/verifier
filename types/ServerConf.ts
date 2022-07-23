import type mongodb from 'mongodb'
interface ServerConf {
    _id: mongodb.ObjectId
    server: string,
    unverifiedRole?: string,
    channelId?: string,
    messageId?: string,
    msg: string,
    verifiedMsg?: string,
    verifiedRole?: string
}
export default ServerConf