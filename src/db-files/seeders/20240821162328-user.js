/* eslint-disable */
'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      // Updated Admin Users
      {
        id: Sequelize.literal('UUID()'),
        firstName: 'Ahmad',
        lastName: 'Marei',
        email: 'ahmad.marei@gmail.com',
        password: await bcrypt.hash('Ahmad@test1234', 10),
        role: 'admin',
        createdAt: new Date(),
      },
      {
        id: Sequelize.literal('UUID()'),
        firstName: 'Sara',
        lastName: 'Zebdeh',
        email: 'sara.zebdeh@gmail.com',
        password: await bcrypt.hash('Sara@test1234', 10),
        role: 'admin',
        createdAt: new Date(),
      },
      // New Users with role 'user'
      {
        id: Sequelize.literal('UUID()'),
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice.smith@gmail.com',
        password: await bcrypt.hash('Alice@test1234', 10),
        role: 'user',
        createdAt: new Date(),
      },
      {
        id: Sequelize.literal('UUID()'),
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob.johnson@gmail.com',
        password: await bcrypt.hash('Bob@test1234', 10),
        role: 'user',
        createdAt: new Date(),
      },
      {
        id: Sequelize.literal('UUID()'),
        firstName: 'Charlie',
        lastName: 'Brown',
        email: 'charlie.brown@gmail.com',
        password: await bcrypt.hash('Charlie@test1234', 10),
        role: 'user',
        createdAt: new Date(),
      },
      {
        id: Sequelize.literal('UUID()'),
        firstName: 'David',
        lastName: 'Wilson',
        email: 'david.wilson@gmail.com',
        password: await bcrypt.hash('David@test1234', 10),
        role: 'user',
        createdAt: new Date(),
      },
      {
        id: Sequelize.literal('UUID()'),
        firstName: 'Eva',
        lastName: 'Davis',
        email: 'eva.davis@gmail.com',
        password: await bcrypt.hash('Eva@test1234', 10),
        role: 'user',
        createdAt: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
