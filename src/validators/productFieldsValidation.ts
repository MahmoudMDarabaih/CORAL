import Joi, { ObjectSchema } from 'joi';

const createProductValidation: ObjectSchema = Joi.object({
  name: Joi.string()
    .required()
    .max(50)
    .messages({
      'any.required': 'Product name is required',
      'string.base': 'Product name must be a string',
      'string.max': 'Product name must be less than or equal to 50 characters long',
    }),
  brief: Joi.string()
    .required()
    .max(50)
    .messages({
      'any.required': 'A product\'s brief description is required',
      'string.base': 'A product\'s brief description must be a string',
      'string.max': 'A product\'s brief description must be less than or\
      equal to 50 characters long',
    }),
  description: Joi.string()
    .required()
    .max(65535)
    .messages({
      'any.required': 'Product description is required',
      'string.base': 'Product description must be a string',
      'string.max': 'Product description must be less than or equal to 65535 characters long',
    }),
  price: Joi.number()
    .precision(2)
    .max(99999.99)
    .min(0)
    .required()
    .messages({
      'number.base': 'Price must be a number.',
      'number.precision': 'Price must have at most 2 decimal places.',
      'number.max': 'Price cannot exceed 99999.99.',
      'number.min': 'Price cannot be less than 0.',
      'any.required': 'Price is a required field.',
    }),
  stock: Joi.number()
    .integer()
    .min(0)
    .messages({
      'number.base': 'Stock must be a number.',
      'number.integer': 'Stock must be an integer.',
      'number.min': 'Stock cannot be less than 0.',
    }),
  categoryName: Joi.string()
    .required()
    .max(50)
    .messages({
      'any.required': 'Category name is required',
      'string.base': 'Category name must be a string',
      'string.max': 'Category Name must be less than 50 characters long',
    }),
  brandName: Joi.string()
    .required()
    .max(50)
    .messages({
      'any.required': 'Brand name is required',
      'string.base': 'Brand name must be a string',
      'string.max': 'Brand Name must be less than 50 characters long',
    }),
  discountRate: Joi.number()
    .precision(2)
    .min(0.01)
    .max(1.0)
    .default(1)
    .messages({
      'number.base': 'Discount rate must be a number.',
      'number.precision': 'Discount rate must have at most 2 decimal places.',
      'number.min': 'Discount rate cannot be less than 0.01.',
      'number.max': 'Discount rate cannot be greater than 1.0.',
    }),
});

const uuidV4validation = (fieldName: string): Joi.StringSchema =>
  Joi.string()
    .uuid({ version: 'uuidv4' })
    .required()
    .messages({
      'string.guid': `${fieldName} ID must be a valid UUID.`,
      'any.required': `${fieldName} ID is required`,
      'string.base': `${fieldName} ID must be a string`,
    });

const productIdValidation: ObjectSchema = Joi.object({
  id: uuidV4validation('Product'),
});

const deleteProductImageValidation = Joi.object({
  id: uuidV4validation('Product'),
  productImageId: uuidV4validation('Product Image'),
});

const updateProductValidation = Joi.object({
  name: Joi.string()
    .max(50)
    .messages({
      'string.base': 'Product name must be a string',
      'string.max': 'Product name must be less than or equal to 50 characters long',
    }),
  brief: Joi.string()
    .max(50)
    .messages({
      'string.base': 'A product\'s brief description must be a string',
      'string.max': 'A product\'s brief description must be less than or\
      equal to 50 characters long',
    }),
  description: Joi.string()
    .max(65535)
    .messages({
      'string.base': 'Product description must be a string',
      'string.max': 'Product description must be less than or equal to 65535 characters long',
    }),
  price: Joi.number()
    .precision(2)
    .max(99999.99)
    .min(0)
    .messages({
      'number.base': 'Price must be a number.',
      'number.precision': 'Price must have at most 2 decimal places.',
      'number.max': 'Price cannot exceed 99999.99.',
      'number.min': 'Price cannot be less than 0.',
    }),
  stock: Joi.number()
    .integer()
    .min(0)
    .messages({
      'number.base': 'Stock must be a number.',
      'number.integer': 'Stock must be an integer.',
      'number.min': 'Stock cannot be less than 0.',
    }),
  categoryName: Joi.string()
    .max(50)
    .messages({
      'string.base': 'Category name must be a string',
      'string.max': 'Category Name must be less than 50 characters long',
    }),
  brandName: Joi.string()
    .max(50)
    .messages({
      'string.base': 'Brand name must be a string',
      'string.max': 'Brand Name must be less than 50 characters long',
    }),
  discountRate: Joi.number()
    .precision(2)
    .min(0.01)
    .max(1.0)
    .default(1)
    .messages({
      'number.base': 'Discount rate must be a number.',
      'number.precision': 'Discount rate must have at most 2 decimal places.',
      'number.min': 'Discount rate cannot be less than 0.01.',
      'number.max': 'Discount rate cannot be greater than 1.0.',
    }),
}).min(1).messages({
  'object.min': 'At least one field is required.',
});

const getProductsQueryValidation = Joi.object({
  category: Joi.string()
    .max(50)
    .messages({
      'string.base': 'Category name query must be a string',
      'string.max': 'Cateogry name must be less than or equal to 50 characters long',
    }),
  brand: Joi.string()
    .max(50)
    .messages({
      'string.base': 'Brand name query must be a string',
      'string.max': 'Brand name must be less than or equal to 50 characters long',
    }),
});

export {
  createProductValidation,
  updateProductValidation,
  getProductsQueryValidation,
  deleteProductImageValidation,
  productIdValidation,
};
