import mongoose from 'mongoose'
import bcrypt from 'bcrypt-nodejs'

const userSchema = mongoose.Schema({
  google: {
    id: String,
    token: String,
    email: String,
    name: String
  }
})

// generating a hash
userSchema.methods.generateHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)

// create the model for users and expose it to our app
export default mongoose.model('User', userSchema)
