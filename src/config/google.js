import configServer from './server'

module.exports = {
  'clientID': process.env.CLIENT_ID,
  'clientSecret': process.env.CLIENT_SECRET,
  'callbackURL': `${configServer.host}:${configServer.port}/auth/google/callback`
}
