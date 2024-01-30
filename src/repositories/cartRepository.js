const cartModel = require("../models/carts.model.js")
const productModel = require("../models/products.model.js")

class CarRepository {
  async addNewCart(newCart){
    try {
      const carrito = new cartModel(newCart)
      await carrito.save()
      console.log("Carrito creado con éxito", carrito);
      return carrito;
    } catch (error) {
      console.log("Error al tratar de crear el carrito", error);
    }
  }

  async getAllCarts(){
    try {
      const carts = await cartModel.find()
      if (!carts) {
        return {
          success: false,
          message: `No hay carritos`
        }
      } else {
        return {
          success : true ,
          message: "Carritos encontrados",
          carrito: carts
        }
      }    
    } catch (error) {
      throw new Error(`Error en CarRepository.getAllCarts: ${error.message}`);
    }
  }

  async getCartById(cartId){
    try {
      const cart = await cartModel.findOne({_id: cartId}).populate('products.product').lean()
      return cart
    } catch (error) {
      throw new Error(`Error en CarRepository.getCartById: ${error.message}`);
    }
  }

  async addProductToCart(cartId, productId, quantity=1, userEmail){
    try {
      const cart = await cartModel.findOne({_id: cartId})
      const product = await productModel.findOne({_id: productId});
      if (!cart) {
        return {
          success: false,
          message: `No existe un carrito con el Id ${cartId}`,
        };
      }
  
      if (!product) {
        return {
          success: false,
          message: `No existe un producto con el Id ${productId}`,
        };
      }

      if(product.owner === userEmail){
        return{
          success:false,
          message:'No puedes agregar tus propios productos'
        }
      }

      // Validar si la cantidad es mayor al stock disponible
    if (quantity > product.stock) {
      return {
        success: false,
        message: "La cantidad solicitada supera el stock disponible",
      };
    }
  
    // Restar la cantidad del stock del producto
    // const updatedStock = product.stock - quantity;
    // await productModel.updateOne({_id: productId}, { stock: updatedStock });

    // Buscar si el producto ya está en el carrito
    const productIndex = cart.products.findIndex((p) => {
      return p.product.toString() == productId;
    });

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    // Guardar el carrito actualizado en la base de datos
    await cart.save();

    return {
      success: true,
      message: "Producto agregado al carrito",
    };
    } catch (error) {
      throw new Error(`Error en el CartRepository.addProductToCart: ${error.message}`)
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await cartModel.findOne({ _id: cartId });
  
      if (!cart) {
        return {
          success: false,
          message: `No existe un carrito con el Id ${cartId}`,
        };
      }
  
      // Verificar si el producto está en el carrito
      const productIndex = cart.products.findIndex((p) => {
        return p.product.toString() == productId;
      });

      if (productIndex === -1) {
        return {
          success: false,
          message: "El producto no está presente en el carrito",
        };
      }
  
      // Eliminar completamente el producto del carrito
      cart.products.splice(productIndex, 1);
  
      // Guardar el carrito actualizado en la base de datos
      await cart.save();
  
      return {
        success: true,
        message: "Producto eliminado del carrito",
      };
    } catch (error) {
      throw new Error(`Error in CartRepository.removeProductFromCart: ${error.message}`);
    }
  }
  
  async clearCart(cartId) {
    try {
      const cart = await cartModel.findOne({ _id: cartId });
      if (!cart) {
        return {
          success: false,
          message: `No existe un carrito con el Id ${cartId}`,
        };
      }

      // Limpieza del array de productos
      cart.products = []
      // Guardar el carrito actualizado en la base de datos
      await cart.save();
      return {
        success: true,
        message: "Productos eliminados del carrito",
      };
    } catch (error) {
      throw new Error(`Error in CartRepository.clearCart: ${error.message}`);
    }
  }
  

async deteleCart(cartId){
  try {
    const cart = await cartModel.deleteOne({_id: cartId})
    return cart
  } catch (error) {
    throw new Error(`Error en CarRepository.getCartById: ${error.message}`);
  }
}

async updateCartItemQuantity(cartId, productId, newQuantity) {
  try {
    const product = await productModel.findOne({_id: productId});
    if (quantity > product.stock) {
      return {
        success: false,
        message: "La cantidad solicitada supera el stock disponible",
      };
    }
    const updatedCart = await cartModel.updateOne(
      { _id: cartId, 'products.product': productId },
      { $set: { 'products.$.quantity': newQuantity } },
      { new: true, runValidators: true, populate: 'products.product' }
    );

    if (!updatedCart) {
      return {
        success: false,
        message: `No se encontró el carrito con el ID ${cartId} o el producto con el ID ${productId} en el carrito`,
      };
    }

    return {
      success: true,
      message: "Cantidad del producto actualizada en el carrito",
      carrito: updatedCart,
    };
  } catch (error) {
    console.error("Error al actualizar la cantidad del producto en el carrito", error);
    return {
      success: false,
      message: "Error al actualizar la cantidad del producto en el carrito",
    };
  }
}
}

module.exports = CarRepository