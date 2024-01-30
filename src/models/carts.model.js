const mongoose = require("mongoose");

const cartCollection = "carts"

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
        quantity: { type: Number, default: 1 } 
    }],
    total: {type: Number}
})

const cartModel = mongoose.model(cartCollection, cartSchema)

module.exports = cartModel