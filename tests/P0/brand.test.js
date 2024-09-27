/* eslint-disable */
import request from 'supertest';
import app from '../../src/app';
import sequelize from '../../src/database';
import User from '../../src/db-files/models/User';
const timeout = 15000;
let token, brandId;

beforeAll(async() => {
  // create a user and update their role to 'admin' to use for brands endpoints
  await request(app).post('/api/auth/signup').send({
    firstName: "Test",
    lastName: "Test",
    email: "testuser2p0@gmail.com",
    mobileNumber: "+970567112233",
    password: "Test@test1234",
    confirmPassword: "Test@test1234"
  });
  await User.update(
    {
      role: 'admin'
    },
    {
      where: {
        email: 'testuser2p0@gmail.com'
      }
    }
  );
  // login using that user's credintials to get the token
  const res = await request(app).post('/api/auth/login').send({
    email: 'testuser2p0@gmail.com',
    password: 'Test@test1234',
  });
  console.log(`Brand P0 tests, Login Status: ${res.status}`);
  token = res.body.token;
}, timeout);

describe('Get all brands', () => {
  it('should return a 200 status code response with an array of objects that represents brands', async() => {
    const res = await request(app)
      .get('/api/brands')
      .set('authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
}, timeout);

describe('Create a brand', () => {
  it('should return a 201 status code response with a response body that contains the created brand', async() => {
    const res = await request(app)
      .post('/api/brands')
      .set('authorization', `Bearer ${token}`)
      .field('name', 'Test-Adidas')
      .attach('image', './tests/P0/Temp-Adidas.png');
    expect(res.status).toBe(201);
    brandId = res.body.brand.id;
  });
}, timeout);

describe('Update a brand', () => {
  it('should return a 200 status code response with a response body that contains the updated brand', async() => {
    const res = await request(app)
      .put(`/api/brands/${brandId}`)
      .set('authorization', `Bearer ${token}`)
      .send({ name: 'Test-Adidas-2' });
    expect(res.status).toBe(200);
  });
}, timeout);


describe('Delete a brand', () => {
  it('should return a 204 status code response', async() => {
    const res = await request(app)
      .delete(`/api/brands/${brandId}`)
      .set('authorization', `Bearer ${token}`)
      expect(res.status).toBe(204);
  });
}, timeout);


// Clean up data used for testing and close connection to database
afterAll(async() => {
  await User.destroy({
    where: {
      email: 'testuser2p0@gmail.com',
    },
  });
  await sequelize.close(); // Close the database connection after all tests
}, timeout);
