const ticketModel = require('../models/ticket.model');

class TicketService {
  async createTicket(ticketData) {
    try {
      const ticket = new ticketModel(ticketData);
      const savedTicket = await ticket.save();
      return savedTicket;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new TicketService();
