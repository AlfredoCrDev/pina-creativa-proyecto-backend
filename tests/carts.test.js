const chai = require("chai");
const { expect } = chai;
const supertest = require('supertest');
const app = require('../src/server.js');
const request = supertest(app);

describe('Router de Carrito', () => {
  it('Debería devolver un código 500 si no se encuentra el carrito por ID', async () => {
    const carritoIdNoExistente = 'f4wtg34gwesgf2y5464j64';
    const response = await request.get(`/cart/${carritoIdNoExistente}`);

    expect(response.status).to.equal(500);
    expect(response._body.message).to.contain('Error');
  });

  it('Debería obtener la lista de carritos exitosamente', async () => {
    const response = await request.get('/cart');
    expect(response.status).to.equal(200);
    expect(response._body.carts.success).to.equal(true);
    expect(response._body.message).to.equal('Lista de carritos obtenida');
    expect(response._body.carts.carrito).to.be.an('array');
  });

  it('Debería obtener un carrito por su ID y devolver un código 200', async () => {
    const carritoId = '6578b4a879b71208a89ee591';

    const response = await request.get(`/cart/${carritoId}`);
    expect(response.status).to.equal(200);
    expect(response._body.success).to.equal(true);
    expect(response._body.message).to.equal('Carrito encontrado');
    expect(response._body.carrito).to.be.an('object');
    expect(response._body.carrito._id).to.equal(carritoId);
  });
});
