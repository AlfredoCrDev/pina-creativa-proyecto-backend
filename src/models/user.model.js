const mongoose = require("mongoose");

const userCollecion = "users"

const documentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  reference: { type: String, required: true },
});

const userSchema = new mongoose.Schema({
  first_name: {type: String, max: 30},
  last_name: {type: String, max: 30},
  email: {type: String, max: 30},
  age: {type: Number},
  password: {type: String},
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'carts' },
  rol: { type: String, enum: ["usuario", "admin", "premium"], default: "usuario" },
  documents: [documentSchema],
  last_connection: { type: Date },
})

const userModel = mongoose.model(userCollecion, userSchema)

module.exports =  userModel
