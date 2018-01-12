let dbUrl
let dbName = 'gmaildupes'

if (process.env.NODE_ENV === 'test') dbUrl = 'localhost:27017'

module.exports = {
  url: `mongodb://${dbUrl}/${dbName}`,
  options: {
    keepAlive: true,
    reconnectTries: Number.MAX_VALUE,
    useMongoClient: true
  }
}
