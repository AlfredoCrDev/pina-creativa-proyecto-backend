const chai = require("chai");
const { expect } = chai;
const supertest = require('supertest');
const app = require('../src/server.js');
const request = supertest(app);

describe('Router de Usuarios', () => {
  it('Debería obtener la lista de los usuarios', async () => {
    const response = await request.get('/users/')
    expect(response.status).to.equal(200);
    expect(response.body.payload).to.be.an('array');
    expect(response.body.payload).to.have.length.above(0);  
    expect(response.body.payload[0]).to.have.property('first_name');
  });

  it('Debería registrar un nuevo usuario y devolver un código 201', async () => {
    const nuevoUsuario = {
      first_name: 'nuevoUsuario1',
      email: 'nuevoUsuario2@example.com',
      password: 'contraseña123',
    };

    const response = await request.post('/users/register').send(nuevoUsuario);
    // console.log("RESPONSEEE", response);
    expect(response.status).to.equal(200);
    expect(response._body).to.have.property('token');
  });

  it('Debería eliminar un nuevo usuario por id', async () => {
    const userId = "659c320a5fbd1008814daef8" // Es el ID de un usuario prueba ya registrado
    const response = await request.delete(`/users/${userId}`);
    console.log("RESPONSEEE", response);
    expect(response.status).to.equal(200)
  });
})