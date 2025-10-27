import Joi from 'joi';

/**
 * Validation middleware factory
 */
export function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(d => d.message).join(', '),
      });
    }
    
    next();
  };
}

// Device validation schemas
export const deviceSchemas = {
  create: Joi.object({
    id: Joi.string().optional(),
    name: Joi.string().required(),
    location: Joi.string().optional(),
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required(),
    status: Joi.string().valid('active', 'inactive', 'maintenance', 'offline').optional(),
    type: Joi.string().optional(),
    installDate: Joi.date().optional(),
  }),

  update: Joi.object({
    name: Joi.string().optional(),
    location: Joi.string().optional(),
    lat: Joi.number().min(-90).max(90).optional(),
    lng: Joi.number().min(-180).max(180).optional(),
    status: Joi.string().valid('active', 'inactive', 'maintenance', 'offline').optional(),
    type: Joi.string().optional(),
    installDate: Joi.date().optional(),
  }),
};

// Reading validation schemas
export const readingSchemas = {
  create: Joi.object({
    deviceId: Joi.string().required(),
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required(),
    timestamp: Joi.number().optional(),
    readings: Joi.object({
      pm25: Joi.number().min(0).optional(),
      pm10: Joi.number().min(0).optional(),
      co: Joi.number().min(0).optional(),
      no2: Joi.number().min(0).optional(),
    }).required(),
  }),
};

// User validation schemas
export const userSchemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().required(),
    role: Joi.string().valid('user', 'admin').optional(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

