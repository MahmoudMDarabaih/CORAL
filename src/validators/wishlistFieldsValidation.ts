import Joi from 'joi';

const wishListProductIdValidation = Joi.object({
  productId: Joi.string()
    .uuid({ version: 'uuidv4' })
    .required()
    .messages({
      'string.guid': 'Product ID must be a valid UUID.',
      'any.required': 'Product ID is required.',
      'string.base': 'Product ID must be a string.',
    }),
});

export { wishListProductIdValidation };
