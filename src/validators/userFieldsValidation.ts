import Joi from 'joi';

// Validation schema for user ID
const userIdValidation = Joi.object({
  id: Joi.string()
    .uuid({ version: 'uuidv4' })
    .required()
    .messages({
      'string.base': 'ID should be a type of string.',
      'string.guid': 'ID must be a valid UUID.',
      'any.required': 'ID is a required field.',
    }),
});

const updateUserValidation = Joi.object({
  firstName: Joi.string()
    .max(100)
    .optional()
    .messages({
      'string.base': 'First Name should be a type of text.',
      'string.max': 'First Name should have a maximum length of {#limit}.',
    }),

  lastName: Joi.string()
    .max(100)
    .optional()
    .messages({
      'string.base': 'Last Name should be a type of text.',
      'string.max': 'Last Name should have a maximum length of {#limit}.',
    }),

  dateOfBirth: Joi.date()
    .iso()
    .optional()
    .messages({
      'date.base': 'Date of Birth should be a valid date.',
    }),

  mobileNumber: Joi.string()
    .pattern(/^\+?[0-9]{10,15}$/)
    .optional()
    .messages({
      'string.base': 'Mobile Number should be a type of text.',
      'string.pattern.base': `Mobile Number must be in the correct international format 
      with 10 to 15 digits, optionally starting with a "+".`,
      'string.min': 'Mobile Number should have at least {#limit} digits.',
      'string.max': 'Mobile Number should have a maximum length of {#limit} digits.',
    }),
}).min(1).messages({
  'object.min': 'At least one field is required for update.',
});

const updateUserRoleValidation = Joi.object({
  role: Joi.string()
    .valid('user', 'admin')
    .required()
    .messages({
      'string.base': 'Role should be a type of text.',
      'any.only': 'Role must be one of [user, admin].',
      'any.required': 'Role is a required field.',
    }),
});

const updateUserPasswordValidation = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      'string.base': 'Current password should be a type of text.',
      'any.required': 'Current password is required.',
    }),
  newPassword: Joi.string()
    .min(8)
    .required()
    .pattern(/[A-Z]/, 'uppercase letter')
    .pattern(/[a-z]/, 'lowercase letter')
    .pattern(/\d/, 'number')
    .pattern(/[\W_]/, 'special character')
    .messages({
      'string.min': 'New password must be at least 8 characters long.',
      'string.pattern.name': 'New password must contain at least one {#name}.',
      'any.required': 'New password is required.',
    }),
  confirmPassword: Joi.any()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'Confirm password does not match the new password.',
      'any.required': 'Confirm password is required.',
    }),
});

export { userIdValidation,
  updateUserValidation,
  updateUserRoleValidation,
  updateUserPasswordValidation };
