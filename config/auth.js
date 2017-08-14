import env from 'dotenv'
env.config({ path: './local.env' })

export default {
  'googleAuth': {
    'clientID': process.env.CLIENT_ID,
    'clientSecret': process.env.CLIENT_SECRET,
    'callbackURL': 'http://localhost:8080/auth/google/callback'
  }
}
