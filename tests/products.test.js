const chai = require("chai");
const { expect } = chai;
const supertest = require('supertest');
const app = require('../src/server.js');
const request = supertest(app);

describe('Router de Productos', () => {
  it('Debería obtener la lista de productos', async () => {
    const response = await request.get('/products/api')
    expect(response.status).to.equal(200);
    expect(response.body.docs).to.be.an('array');
    expect(response.body.docs).to.have.length.above(0);  // Verificar que la lista no esté vacía
    expect(response.body.docs[0]).to.have.property('title');  // Verificar que los productos tienen un título
  });

  it('Debería dar error por código de producto en uso y devolver un código 400', async () => {
    const nuevoProducto = {
      title: 'Nuevo Producto',
      description: 'Descripción del nuevo producto',
      price: 2500,
      stock: 15,
      category: "Abarrote",
      code: "NP01",
      status: true,
      owner: "admin"
    };

    const response = await request.post('/products/addProduct').send(nuevoProducto);
    expect(response.status).to.equal(400);
    expect(response.body.message).to.contain(`El código ${nuevoProducto.code} ya está siendo utilizado`);
  });

  it('Debería actualizar un producto existente y devolver un código 201', async () => {
    productId = "659867ef72460a646772eab9"
    const productoActualizado = {
      description: 'Descripción actualizada del producto',
      price: 3000,
    };

    const response = await request.put(`/products/${productId}`).send(productoActualizado);
    expect(response.status).to.equal(201); 
    expect(response._body.message).to.contain(`Producto modificado correctamente`);
  });
});
