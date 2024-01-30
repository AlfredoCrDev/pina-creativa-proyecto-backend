const cartService = require('../services/cartService.js');
const ticketService = require("../services/ticketService.js")
const userService = require("../services/userService.js")
const productService = require("../services/productService.js")
const utils = require("../utils.js")
// const logger = require("../logger.js")

class CartController {

  async addnewCart(req, res) {
    try {
      const newCart = req.body
      const cart = await cartService.addNewCart(newCart)
      req.logger.info("Carrito creado con éxito");
      res.status(200).send({message: "Nuevo carrito creado", cart})
    } catch (error) {
      req.logger.error("Error al enviar productos al carrito", error);
      res.status(500).send({message: "Error al crear un nuevo carrito"})    
    }
  }

  async getAllCarts(req, res){
    try {
      const carts = await cartService.getAllCarts()
      req.logger.info("Lista de carritos")
      res.status(200).send({ message: "Lista de carritos obtenida", carts})
    } catch (error) {
      req.logger.error("Error al obtener los carritos")
      res.status(500).send({message: "Error al obtener los carritos"})    
    }
  }

  async getCartById(req, res){
    const cartId = req.params.cid
    try {
      const result = await cartService.getCartById(cartId);
      if (!result.success) {
        console.log("ENTRO AQUI");
        return res.status(404).json(result);
      }
      req.logger.info(`Información del carro ${cartId} obtenido correctamente`);
      return res.status(200).send(result);
    } catch (error) {
      req.logger.error(`Error en el controlador getCartById: ${error}`);
      res.status(500).send({message: "Error al obtener el carrtio por ID"})    
    }
  }

  async addProductToCart(req, res) {
    const { quantity } = req.query;
    const cartId = req.params.cid
    const productId = req.params.pid
    const userEmail = req.body.userEmail
    try {
      const result = await cartService.addProductToCart(cartId, productId, quantity, userEmail);
  
      if (result.success) {
        req.logger.info("Producto agregado con éxito")
        res.status(200).json(result);
      } else {
        res.status(400).json({error: result.message});
      }
    } catch (error) {
      req.logger.error(`Error en el controlador addProductToCart: ${error}`)
      res.status(500).json({ success: false, message: "Error al agregar producto al carrito" });
    }
  }

async removeProductFromCart(req, res) {
  const cartId = req.params.cid;
  const productId = req.params.pid;

  try {
    const result = await cartService.removeProductFromCart(cartId, productId);

    if (result.success) {
      req.logger.info(`Se ha eliminado el producto ${productId} del carro ${cartId}`);
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    req.logger.error(`Error en el controlador removeProductFromCart: ${error}`);
    res.status(500).json({ message: "Error al eliminar el producto del carrito" });
  }
}

async deleteCart(req, res){
  const cartId = req.params.cid
  try {
    const result = await cartService.deleteCart(cartId);
    if (result.success) {
      req.logger.info(`Carro de compra ${cartId} eliminado correctamente`);
      return res.status(200).json({message: "Cart deleted successfully"});
    }  else {
      return res.status(404).json(result);
    }
  } catch (error) {
    req.logger.error(`Error en el controlador deleteCart: ${error}`);
    res.status(500).send({message: "Error al eliminar el carrtio por ID"})    
  }
}

async updateCartItemQuantity(req, res) {
  const { cartId, productId, newQuantity } = req.body;

  try {
    const result = await cartService.updateCartItemQuantity(cartId, productId, newQuantity);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la cantidad del producto en el carrito" });
  }
}

async purcharseCart(req, res) {
  const cartId = req.params.cid;
  try {

    const cart = await cartService.getCartById(cartId);
    const products = cart.carrito.products
    const user = await userService.getUserById(cart.carrito.user)
    if (!cart) {
      return res.status(404).json({ error: result.message });
    }

    const productsToPurchase = [];

    products.forEach((item) => {
      const {product} = item;
      if (product.stock >= item.quantity) {
        productsToPurchase.push({
          productId: product._id,
          quantity: item.quantity,
          price: product.price,
          stock: product.stock
        });
      }
    });


    const code = utils.generateUniqueCode()
    const totalCompra = utils.calculateTotal(productsToPurchase)

    // Realizar la compra solo si hay productos para comprar
    if (productsToPurchase.length > 0) {
      // Crear un ticket con los datos de la compra
      const ticketData = {
        code: code,
        amount: totalCompra,
        purchaser: user.email,
        products: productsToPurchase,
      };
      const createdTicket = await ticketService.createTicket(ticketData);

      // Actualizar el stock de cada producto comprado en paralelo
      const updatePromises = productsToPurchase.map(async (productToPurchase) => {
        const newStock = productToPurchase.stock - productToPurchase.quantity;
        return productService.updateStock(productToPurchase.productId, { stock: newStock });
      });
      // Esperar que todas las promesas se cumplan
      await Promise.all(updatePromises);
      // Vaciar carrtio
      await cartService.clearCart(cartId);

      res.status(200).json({
        status: "success",
        message: 'Compra realizada con éxito',
        ticket: createdTicket,
      });
    } else {
      res.status(400).json({ error: 'Error al realizar la compra' });
    }
  } catch (error) {
    req.logger.error("Error en CartController.purcharseCart", error);
    res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
}

//   async getAllProducts(req, res) {
//     try {
//       const products = await productService.getAllProducts();
//       res.json(products);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }

//   async findProductsByName(req, res) {
//     const productName = req.body.name
//     try {
//       const products = await productService.findProductsByName(productName)
//       res.json({ status: 'success', products});
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }

// async createProduct(req, res) {
//   const { title, description, price, stock, category, code } = req.body;
  
//   try {
//     // Verificar si el producto existe
//     const productExists = await productService.getProductByCode(code);
    
//     if (productExists) {
//       return res.status(400).json({ status: "error", message: `El código ${code} ya esta siendo utilizado` });
//     }

//     // Crear el producto si el código no está en uso
//     const product = await productService.createProduct({ title, description, price, stock, category, code });    
//     res.json({ status: "success", product });
//   } catch (error) {
//     console.log("Error al crear al el producto: ", error);
//     res.status(400).json({ status: "error", message: error.message });
//   }
// }


//   async updateProduct(req, res) {
//     try {
//       const productId = req.params.pid;
//       const productData = req.body;
//       const updatedProduct = await productService.updateProduct(productId, productData);
//       res.json(updatedProduct);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }

//   async deleteProduct(req, res) {
//     const productId = req.params.id;
//     try {
//       const product = await productService.deleteProduct(productId);
//       res.json({ message: 'Product deleted successfully', product });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }
}

module.exports = CartController;