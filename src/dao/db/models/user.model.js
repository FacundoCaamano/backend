import mongoose from 'mongoose'

const usersCollection = 'user'

const usersSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    unique: true
  },
  role: {
    type: String,
    default: 'user'
  },
  password: String,
  age: Number,
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'carts'
  }
})

const usersModel = mongoose.model(usersCollection, usersSchema)

export default usersModel
