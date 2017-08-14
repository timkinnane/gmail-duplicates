import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth'
import User from '../app/models/user'
import configAuth from './auth'

// https://scotch.io/tutorials/easy-node-authentication-google
export default function (passport) {
  // used to serialize the user for the session
  passport.serializeUser((user, done) => done(null, user.id))

  // used to deserialize the user
  passport.deserializeUser((id, done) => User.findById(id, (err, user) => done(err, user)))

  passport.use(new GoogleStrategy({
    clientID: configAuth.googleAuth.clientID,
    clientSecret: configAuth.googleAuth.clientSecret,
    callbackURL: configAuth.googleAuth.callbackURL
  }, (token, refreshToken, profile, done) => {
    // make the code asynchronous
    // User.findOne won't fire until we have all our data back from Google
    process.nextTick(function () {
      // try to find the user based on their google id
      User.findOne({ 'google.id': profile.id }, (err, user) => {
        if (err) return done(err)
        if (user) return done(null, user) // if a user is found, log them in
        else {
          // if the user isnt in our database, create a new user
          let newUser = new User()

          // set all of the relevant information
          newUser.google.id = profile.id
          newUser.google.token = token
          newUser.google.name = profile.displayName
          newUser.google.email = profile.emails[0].value // pull the first email

          // save the user
          newUser.save((err) => {
            if (err) throw err
            return done(null, newUser)
          })
        }
      })
    })
  }))
}
