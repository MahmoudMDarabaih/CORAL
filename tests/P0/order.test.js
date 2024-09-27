/* eslint-disable */
import request from 'supertest';
import app from '../../src/app';
import sequelize from '../../src/database';
import User from '../../src/db-files/models/User';
import associateModels from '../../src/db-files/associations';
import Order from '../../src/db-files/models/Order';
const timeout = 15000;
let token, categoryId, brandId, productId;

beforeAll(async() => {
   // to assert associations before running queries
  associateModels();
  // create a user and update their role to 'admin' to use for products endpoints
  await request(app).post('/api/auth/signup').send({
    firstName: "Test",
    lastName: "Test",
    email: "testuser6p0@gmail.com",
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
        email: 'testuser6p0@gmail.com'
      }
    }
  );

  // login using that user's credintials to get the token
  const res = await request(app).post('/api/auth/login').send({
    email: 'testuser6p0@gmail.com',
    password: 'Test@test1234',
  });
  console.log(`Products P0 tests, Login Status: ${res.status}`);
  token = res.body.token;

  // create a category to associate the product tests with it
  const category = await request(app)
      .post('/api/categories')
      .set('authorization', `Bearer ${token}`)
      .field('name', 'Test-Category-Product-2')
      .field('description', 'Test')
      .attach('image', './tests/P0/Temp-Adidas.png');
  categoryId = category.body.category.id;

  // create a brand to associate the product test with it
  const brand = await request(app)
      .post('/api/brands')
      .set('authorization', `Bearer ${token}`)
      .field('name', 'Test-Brand-Product-2')
      .attach('image', './tests/P0/Temp-Adidas.png');

  brandId = brand.body.brand.id;

  const product = await request(app)
      .post('/api/products')
      .set('authorization', `Bearer ${token}`)
      .send({
        name: 'Test',
        description: 'Test',
        brief: 'Test',
        stock: 20,
        price: 299.99,
        categoryName: 'Test-Category-Product-2',
        brandName: 'Test-Brand-Product-2'
      });
    productId = product.body.product.id;
}, timeout);

describe('Create an Order', () => {
  it('should return a 201 status code response with a response body containing the order', async() => {
    const res = await request(app)
      .post('/api/orders')
      .set('authorization', `Bearer ${token}`)
      .send(
        {
        itemsList: [
          {
            id: productId,
            quantity: 2
          }
        ],
        address: {
          street: "Abass",
          city: "Nasr City",
          state: "Cairo",
          pin: "294"
        },
        phoneNumber: "+970597224488",
        orderOwner: "P0 Test User",
        cardNumber: "4263982640269298"
        }
      );
    expect(res.status).toBe(201);
  });
}, timeout);

// Clean up data used for testing and close connection to database
afterAll(async() => {
  // Delete created Order for testing
  await Order.destroy({
    where: {
      orderOwner: 'P0 Test User'
    }
  });

  //Delete created product for testing

  await request(app)
      .delete(`/api/products/${productId}`)
      .set('authorization', `Bearer ${token}`);

  // Delete the created brand for testing
  await request(app)
      .delete(`/api/categories/${categoryId}`)
      .set('authorization', `Bearer ${token}`);

  // Delete the created category for testing
  await request(app)
      .delete(`/api/brands/${brandId}`)
      .set('authorization', `Bearer ${token}`);
  
  // delete the user used for testing
  await User.destroy({
    where: {
      email: 'testuser6p0@gmail.com',
    },
  });
  
  // Close the database connection after all tests
  await sequelize.close();
}, timeout);