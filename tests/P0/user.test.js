/* eslint-disable */
import request from 'supertest';
import app from '../../src/app';
import sequelize from '../../src/database';
import User from '../../src/db-files/models/User';
import associateModels from '../../src/db-files/associations';
const timeout = 15000;
let token, userId;
 
beforeAll(async() => {
  // to assert associations before running queries
 associateModels();

 // create a user and update their role to 'admin' to use for products endpoints
 await request(app).post('/api/auth/signup').send({
   firstName: "Test",
   lastName: "Test",
   email: "testuser5p0@gmail.com",
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
       email: 'testuser5p0@gmail.com'
     }
   }
 );

// login using that user's credintials to get the token
const res = await request(app).post('/api/auth/login').send({
    email: 'testuser5p0@gmail.com',
    password: 'Test@test1234',
  });
  console.log(`Users P0 tests, Login Status: ${res.status}`);
  token = res.body.token;
  userId = res.body.user.id;
}, timeout);

describe('Get all users', () => {
  it('should return a 200 status code response with an array of objects that represents users', async() => {
    const res = await request(app)
      .get(`/api/users`)
      .set('authorization', `Bearer ${token}`)
      expect(res.status).toBe(200);
  });
}, timeout);


describe('Get user by ID', () => {
  it('should return a 200 status code response with an object that represents that user', async() => {
    const res = await request(app)
      .get(`/api/users/${userId}`)
      .set('authorization', `Bearer ${token}`)
      expect(res.status).toBe(200);
  });
}, timeout);


describe('Update user by ID', () => {
  it('should return a 200 status code response with an object that represents that user', async() => {
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .set('authorization', `Bearer ${token}`)
      .send({
        firstName: 'Test-2'
      });
      expect(res.status).toBe(200);
      expect(res.body.user.firstName).toBe('Test-2');
  });
}, timeout);

describe('Update user password', () => {
  it('should return a 200 status code response with a messsage that indication successful update', async() => {
    const res = await request(app)
      .put(`/api/users/${userId}/password`)
      .set('authorization', `Bearer ${token}`)
      .send({
        currentPassword: 'Test@test1234',
        newPassword: 'Test@test12345',
        confirmPassword: 'Test@test12345',
      });
      expect(res.status).toBe(200);
  });
}, timeout);


describe('Delete a user', () => {
  it('should return a 204 status code response', async() => {
    // create a dummy user to simulate user's deletion
    await request(app).post('/api/auth/signup').send({
      firstName: "Test",
      lastName: "Test",
      email: "tempUser@gmail.com",
      mobileNumber: "+970567112233",
      password: "Test@test1234",
      confirmPassword: "Test@test1234"
    });
    const tempUser = await request(app).post('/api/auth/login').send({
      email: 'tempUser@gmail.com',
      password: 'Test@test1234',
    });
    const tempId = tempUser.body.user.id;
    const res = await request(app)
      .delete(`/api/users/${tempId}`)
      .set('authorization', `Bearer ${token}`);
      expect(res.status).toBe(204);
  });
}, timeout);


// Clean up data used for testing and close connection to database
afterAll(async () => {
  await User.destroy({ 
    where: {
      email: "testuser5p0@gmail.com",
    }
   });
  await sequelize.close(); // Close the database connection after all tests
}, timeout);