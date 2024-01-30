const cartService = require('../services/cartService');
const ticketService = require('../services/ticketService');

class CartController {
  async purchaseCart(req, res) {
    try {
      const cartId = req.params.cid;
      const { code, amount, purchaser } = req.body;

      // Realizar la compra y obtener los productos que no pudieron procesarse
      const failedProducts = await cartService.purchaseCart(cartId, amount);

      // Generar un ticket con los datos de la compra
      const ticket = await ticketService.generateTicket(code, amount, purchaser);

      // Actualizar el carrito con los productos que no pudieron comprarse
      await cartService.updateCartAfterPurchase(cartId, failedProducts);

      res.json({ ticket, failedProducts });
    } catch (error) {
      console.error('Error al finalizar la compra:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}

module.exports = new CartController();
