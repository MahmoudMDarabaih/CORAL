/* eslint-disable */
import request from 'supertest';
import app from '../../src/app';
import sequelize from '../../src/database';
import User from '../../src/db-files/models/User';
const timeout = 15000;
let token;

describe('Sign up new user with valid credintials', () => {
  it('should return a 201 status code response that indicates success sign up', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        firstName: "Test",
        lastName: "Test",
        email: "testuserp0@gmail.com",
        mobileNumber: "+970567112233",
        password: "Test@test1234",
        confirmPassword: "Test@test1234"
      });
      expect(res.status).toBe(201);
  });
}, timeout);

describe('Login to the system using an existing user', () => {
  it('should return a 200 status code response that indicates success login', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: "testuserp0@gmail.com",
        password: "Test@test1234",
      });
      expect(res.status).toBe(200);
      token = res.body.token;
  });
}, timeout);

describe('Logout from the system while being logged in', () => {
  it('should return a 200 status code response that indicates successful logout', async () => {
      const res = await request(app).get('/api/auth/logout').set('authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
  });
}, timeout);

// Clean up data used for testing and close connection to database
afterAll(async () => {
  await User.destroy({ 
    where: {
      email: "testuserp0@gmail.com",
    }
   });
  await sequelize.close(); // Close the database connection after all tests
}, timeout);