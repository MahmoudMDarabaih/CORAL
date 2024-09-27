/* eslint-disable */
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const date = new Date();
    await queryInterface.bulkInsert('categories', [
      // Existing Categories
      {
        id: Sequelize.literal('UUID()'),
        name: 'Watches',
        description: 'Luxury collection of watches',
        createdAt: new Date(),
      },
      {
        id: Sequelize.literal('UUID()'),
        name: 'Bags',
        description: 'Beautiful Bags to kick off in style',
        createdAt: new Date(),
      },
      // New Categories
      {
        id: Sequelize.literal('UUID()'),
        name: 'Shoes',
        description: 'Elegant and stylish footwear for all occasions',
        createdAt: new Date(),
      },
      {
        id: Sequelize.literal('UUID()'),
        name: 'Jewelry',
        description: 'Exquisite jewelry pieces to complement your look',
        createdAt: new Date(),
      },
      {
        id: Sequelize.literal('UUID()'),
        name: 'Electronics',
        description: 'Latest gadgets and electronics for tech enthusiasts',
        createdAt: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
