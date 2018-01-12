import co from 'co'
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth'
import configGoogle from './google'
import User from '../app/models/user'

/**
 * Take user and token from Google and save as new or update existing.
 *
 * Won't fire until we have all our data back from Google.
 *
 * @param  {string}   token        Google access token
 * @param  {string}   refreshToken Can be used to obtain new access tokens
 * @param  {Object}   profile      Google user profile
 * @param  {Function} done         Passport verify callback
 */
function processUser (token, refreshToken, profile, done) {
  process.nextTick(co.wrap(function * () {
    let error, user
    try {
      user = yield User.findOne({ 'google.id': profile.id })
      if (!user) {
        user = yield new User({ google: { 'id': profile.id, 'token': token } }).save()
      }
    } catch (e) {
      error = e
    }
    if (user) return done(null, user)
    else if (error) return done(error)
  }))
}

/**
 * Configure passport strategy for authenticated routes.
 *
 * Used to serialize and deserialize the user for the session.
 *
 * @param  {Passport} passport passportjs instance
 * @param  {Winston} logger    winstonjs instance
 */
function configure (passport, logger) {
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((id, done) => User.findById(id, (err, user) => done(err, user)))
  passport.use(new GoogleStrategy(configGoogle, processUser))
}

module.exports = configure
