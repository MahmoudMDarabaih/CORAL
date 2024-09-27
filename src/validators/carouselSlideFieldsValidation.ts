import Joi from 'joi';

// Validation schema for creating a new carousel slide
const createCarouselSlideValidation = Joi.object({
  slideOrder: Joi.number()
    .integer()
    .required()
    .messages({
      'number.base': 'Slide Order should be a number.',
      'number.integer': 'Slide Order should be an integer.',
      'any.required': 'Slide Order is a required field.',
    }),

  title: Joi.string()
    .max(50)
    .required()
    .messages({
      'string.base': 'Title should be a type of text.',
      'string.max': 'Title should have a maximum length of {#limit}.',
      'any.required': 'Title is a required field.',
    }),

  description: Joi.string()
    .max(100)
    .required()
    .messages({
      'string.base': 'Description should be a type of text.',
      'string.max': 'Description should have a maximum length of {#limit}.',
      'any.required': 'Description is a required field.',
    }),

  categoryName: Joi.string()
    .max(50)
    .optional()
    .messages({
      'string.base': 'Category Name should be a type of text.',
      'string.max': 'Category Name should have a maximum length of {#limit}.',
      'any.required': 'Category Name is a required field.',
    }),

  brandName: Joi.string()
    .max(50)
    .optional()
    .messages({
      'string.base': 'Brand Name should be a type of text.',
      'string.max': 'Brand Name should have a maximum length of {#limit}.',
      'any.required': 'Brand Name is a required field.',
    }),
});

// Validation schema for carousel slide ID
const carouselSlideIdValidation = Joi.object({
  id: Joi.string()
    .uuid({ version: 'uuidv4' })
    .required()
    .messages({
      'string.base': 'ID should be a type of string.',
      'string.guid': 'ID must be a valid UUID.',
      'any.required': 'ID is a required field.',
    }),
});

// Validation schema for updating a carousel slide
const updateCarouselSlideValidation = Joi.object({
  slideOrder: Joi.number()
    .integer()
    .optional()
    .messages({
      'number.base': 'Slide Order should be a number.',
      'number.integer': 'Slide Order should be an integer.',
    }),

  title: Joi.string()
    .max(100)
    .optional()
    .messages({
      'string.base': 'Title should be a type of text.',
      'string.max': 'Title should have a maximum length of {#limit}.',
    }),

  description: Joi.string()
    .max(255)
    .optional()
    .messages({
      'string.base': 'Description should be a type of text.',
      'string.max': 'Description should have a maximum length of {#limit}.',
    }),

  categoryName: Joi.string()
    .max(100)
    .optional()
    .messages({
      'string.base': 'Category Name should be a type of text.',
      'string.max': 'Category Name should have a maximum length of {#limit}.',
    }),

  brandName: Joi.string()
    .max(100)
    .optional()
    .messages({
      'string.base': 'Brand Name should be a type of text.',
      'string.max': 'Brand Name should have a maximum length of {#limit}.',
    }),
});

export { createCarouselSlideValidation, carouselSlideIdValidation, updateCarouselSlideValidation };
