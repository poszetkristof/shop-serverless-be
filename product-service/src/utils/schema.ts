import * as Joi from "joi";

export const schemas = {
  json: {
    createProduct: {
      type: "object",
      properties: {
        count: { type: 'integer' },
        price: { type: 'integer' },
        title: { type: 'string' },
        description: { type: 'string' }
      },
      required: ['count', 'price', 'title', 'description']
    }
  },
  joi: {
    createProduct: Joi.object({
      count: Joi.number().integer().required(),
      price: Joi.number().integer().required(),
      title: Joi.string().min(1).max(64).required(),
      description: Joi.string().min(1).max(256).required()
    })
  }
} as const;
