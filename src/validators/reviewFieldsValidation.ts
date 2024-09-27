import Joi from 'joi';

const createReviewValidation = Joi.object({
  rating: Joi.number()
    .min(1)
    .max(5)
    .required()
    .messages({
      'number.base': 'Rating should be a number.',
      'number.min': 'Rating should be at least {#limit}.',
      'number.max': 'Rating should be at most {#limit}.',
      'any.required': 'Rating is required.',
    }),

  comment: Joi.string()
    .max(500)
    .optional()
    .messages({
      'string.base': 'Comment should be a type of text.',
      'string.max': 'Comment should have a maximum length of {#limit}.',
    }),

  productId: Joi.string()
    .uuid({ version: 'uuidv4' })
    .required()
    .messages({
      'string.base': 'Product ID should be a type of string.',
      'string.guid': 'Product ID must be a valid UUID.',
      'any.required': 'Product ID is required.',
    }),
});

const reviewIdValidation = Joi.object({
  id: Joi.string()
    .uuid({ version: 'uuidv4' })
    .required()
    .messages({
      'string.base': 'ID should be a type of string.',
      'string.guid': 'ID must be a valid UUID.',
      'any.required': 'ID is a required field.',
    }),
});

const updateReviewValidation = Joi.object({
  rating: Joi.number()
    .min(1)
    .max(5)
    .optional()
    .messages({
      'number.base': 'Rating should be a number.',
      'number.min': 'Rating should be at least {#limit}.',
      'number.max': 'Rating should be at most {#limit}.',
      'any.required': 'Rating is required.',
    }),

  comment: Joi.string()
    .max(500)
    .optional()
    .messages({
      'string.base': 'Comment should be a type of text.',
      'string.max': 'Comment should have a maximum length of {#limit}.',
    }),

});

export { createReviewValidation, reviewIdValidation , updateReviewValidation };
