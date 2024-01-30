const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const productCollecion = "products"

const productSchema = new mongoose.Schema({
  title: {type: String, max: 30, required: true},
  description: {type: String, max: 60},
  price: {type: Number, required: true},
  stock: {type: Number, required: true},
  category: {type: String, max: 15, required: true},
  code: {type: String, max: 10, required: true},
  status: {type: Boolean},
  owner: { type: String, default: 'admin' }
})

productSchema.plugin(mongoosePaginate);

productSchema.pre("save", function (next) {
  // Si el stock es igual a 0, establecer el status en false
  if (this.stock === 0) {
    this.status = false;
  }
  next();
});

const productModel = mongoose.model(productCollecion, productSchema)

module.exports = productModel