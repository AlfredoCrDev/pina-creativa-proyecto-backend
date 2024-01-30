const mongoose = require("mongoose");

const ticketCollecion = "tickets"

const ticketSchema = new mongoose.Schema({
  code: {type: String, max: 30, unique: true, required: true},
  purchase_datatime: {type: Date, defauklt: Date.now},
  amount: {type: Number},
  purchaser: {type: String, max: 15, required: true},
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
      }
    }
  ]
})

const ticketModel = mongoose.model(ticketCollecion, ticketSchema)

module.exports = ticketModel