import Joi from 'joi';

const createCategoryValidation = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.base': 'Name should be a type of text.',
      'string.empty': 'Name cannot be empty.',
      'string.max': 'Name should have a maximum length of {#limit}.',
      'any.required': 'Name is a required field.',
    }),

  description: Joi.string()
    .max(150)
    .required()
    .messages({
      'string.base': 'Description should be a type of text.',
      'string.empty': 'Description cannot be empty.',
      'string.max': 'Description should have a maximum length of {#limit}.',
      'any.required': 'Description is a required field.',
    }),
});

const categoryIdValidation = Joi.object({
  id: Joi.string()
    .uuid({ version: 'uuidv4' })
    .required()
    .messages({
      'string.base': 'ID should be a type of string.',
      'string.guid': 'ID must be a valid UUID.',
      'any.required': 'ID is a required field.',
    }),
});

const updateCategoryValidation = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .messages({
      'string.base': 'Name should be a type of text.',
      'string.max': 'Name should have a maximum length of {#limit}.',
    }),

  description: Joi.string()
    .max(150)
    .messages({
      'string.base': 'Description should be a type of text.',
      'string.max': 'Description should have a maximum length of {#limit}.',
    }),
});
// .min(1).messages({
//   'object.min': 'At least one field is required.',
// });

export  { createCategoryValidation , categoryIdValidation ,updateCategoryValidation };
