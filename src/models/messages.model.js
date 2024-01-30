const mongoose = require("mongoose");

const messageCollecion = "messages"

const messageSchema = new mongoose.Schema({
  user: {type: String, max: 30, required: true},
  message: {type: String, max: 60, required: true},
})

const messageModel = mongoose.model(messageCollecion, messageSchema)

module.exports = { messageModel }