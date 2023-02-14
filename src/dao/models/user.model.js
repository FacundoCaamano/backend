import mongoose from 'mongoose'

const UserCollection = 'user'

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  role: {
    type: String,
    default: 'user'
  },
  age: Number,
  password: String
})

mongoose.set('strictQuery', false)

const UserModel = mongoose.model(UserCollection, userSchema)

export default UserModel
