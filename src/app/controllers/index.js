import Gmail from 'node-gmail-api'
import passport from 'passport'
import {OAuth2Strategy} from 'passport-google-oauth'

passport.use(new OAuth2Strategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: 'http://localhost:8080/auth/google/callback',
  accessType: 'offline'
}, (accessToken, refreshToken, profile, done) =>
  User.findOrCreate({ googleId: profile.id }, (err, user) => done(err, user))
))
// let key = passport.authenticate('google', { scope: ['email', 'profile'] })

const gmail = new Gmail(process.env.TOKEN)
let messages = gmail.messages('subject:"Stena Line E-ticket & Reservation Advice for booking reference: 12931991"', {max: 10, fields: ['id', 'internalDate', 'labelIds', 'payload']})
messages.on('data', function (d) {
  console.log(d.id, d.internalDate)
})
