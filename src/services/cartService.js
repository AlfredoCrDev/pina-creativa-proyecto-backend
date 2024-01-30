const CartRepository = require("../repositories/cartRepository.js")
const cartRepository = new  CartRepository();

async function addNewCart(newCart) {
  try {
    return await cartRepository.addNewCart(newCart)
  } catch (error) {
    throw new Error(`Error in CartRepository.addNewCart: ${error.message}`);
  }
}

async function getAllCarts(){
  try {
    return await cartRepository.getAllCarts()
  } catch (error) {
    throw new Error(`Error in CartRepository.getAllCarts: ${error.message}`);
  }
}

async function getCartById(cartId){
  try {
    const cart = await cartRepository.getCartById(cartId)
    if (!cart) {
      return {
        success: false,
        message: `Carrito con ID ${cartId} no encontrado`
      }
    } else {
      return {
        success : true ,
        message: "Carrito encontrado",
        carrito: cart
      }
    }    
  } catch (error) {
    throw new Error(`Error in CartRepository.getCartById: ${error.message}`);
  }
}

async function addProductToCart(cartId, productId, quantity, userEmail) {
  try {
    const result = await cartRepository.addProductToCart(cartId, productId, quantity, userEmail);

    if (result.success) {
      return { success: true, message: "Producto agregado al carrito" };
    } else {
      return { success: false, message: result.message };
    }
  } catch (error) {
    throw new Error(`Error in CartService.addProductToCart: ${error.message}`);
  }
}

async function removeProductFromCart(cartId, productId) {
  try {
    const result = await cartRepository.removeProductFromCart(cartId, productId);

    if (result.success) {
      return { success: true, message: "Producto eliminado del carrito" };
    } else {
      return { success: false, message: result.message };
    }
  } catch (error) {
    throw new Error(`Error in CartService.addProductToCart: ${error.message}`);
  }
}

async function clearCart(cartId) {
  try {
    const result = await cartRepository.clearCart(cartId);

    if (result.success) {
      return { success: true, message: "Productos eliminados del carrito" };
    } else {
      return { success: false, message: result.message };
    }
  } catch (error) {
    throw new Error(`Error in CartService.clearCart: ${error.message}`);
  }
}

async function deleteCart(cartId){
  try {
    const cart = await cartRepository.deteleCart(cartId)
    if (!cart) {
      return {
        success: false,
        message: `Carrito con ID ${cartId} no encontrado`
      }
    } else {
      return {
        success : true ,
        message: "Carrito Eliminado",
        carrito: cart
      }
    }    
  } catch (error) {
    throw new Error(`Error in CartRepository.getCartById: ${error.message}`);
  }
}

async function updateCartItemQuantity(cartId, productId, newQuantity) {
  try {
    return await cartRepository.updateCartItemQuantity(cartId, productId, newQuantity);
  } catch (error) {
    throw new Error(`Error in CartService.updateCartItemQuantity: ${error.message}`);
  }
}


module.exports = {
  addNewCart,
  getAllCarts,
  getCartById,
  addProductToCart,
  removeProductFromCart,
  deleteCart,
  updateCartItemQuantity,
  clearCart
}