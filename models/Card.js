const mongoose = require("mongoose");
const { Schema } = mongoose;
const Joi = require("joi");

const CardSchema = new Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    description: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 1024,
    },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    web: { type: String, required: false },
    image: {
      url: {
        type: String,
        required: true,
      },
      alt: {
        type: String,
        required: true,
      },
    },
    address: {
      state: {
        type: String,
      },
      country: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      street: {
        type: String,
        required: true,
      },
      houseNumber: {
        type: Number,
        required: true,
      },
      zip: {
        type: Number,
        required: true,
      },
    },
    bizNumber: {
      unique: true,
      type: Number,

      default: () => {
        return Math.floor(Math.random() * (9999999 - 1000000 + 1)) + 1000000;
      },
    },
    likes: { type: [String], required: false, default: [],unique:true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const cardValidationSchema = Joi.object({
  title: Joi.string().min(4).max(75).required().messages({
    "string.base": "Title must be a string",
    "string.empty": "Title cannot be empty",
    "string.min": "Title must have at least 4 characters",
    "string.max": "Title can have at most 75 characters",
    "any.required": "Title is required",
  }),
  subtitle: Joi.string().min(5).max(75).required().messages({
    "string.base": "Subtitle must be a string",
    "string.empty": "Subtitle cannot be empty",
    "string.min": "Subtitle must have at least 5 characters",
    "string.max": "Subtitle can have at most 75 characters",
    "any.required": "Subtitle is required",
  }),
  description: Joi.string().min(5).max(1024).required().messages({
    "string.base": "Description must be a string",
    "string.empty": "Description cannot be empty",
    "string.min": "Description must have at least 5 characters",
    "string.max": "Description can have at most 1024 characters",
    "any.required": "Description is required",
  }),
  phone: Joi.string().min(9).max(11).required().messages({
    "string.base": "Phone must be a string",
    "string.empty": "Phone cannot be empty",
    "string.min": "Phone must have at least 9 characters",
    "string.max": "Phone can have at most 11 characters",
    "any.required": "Phone is required",
  }),
  email: Joi.string().email().min(5).max(30).required().messages({
    "string.base": "Email must be a valid string",
    "string.empty": "Email cannot be empty",
    "string.email": "Invalid email format",
    "string.min": "Email must have at least 5 characters",
    "string.max": "Email can have at most 30 characters",
    "any.required": "Email is required",
  }),
  web: Joi.string()
    .uri({
      scheme: ["http", "https"],
    })
    .required()
    .messages({
      "string.base": "WEb must be a string",
      "string.uri": "Invalid WEb format",
      "any.required": "Web is required",
    }),
  image: Joi.object({
    url: Joi.string().required().messages({
      "string.base": "Image URL must be a string",
      "string.empty": "Image URL cannot be empty",
      "any.required": "Image URL is required",
    }),
    alt: Joi.string().required().messages({
      "string.base": "Alt text must be a string",
      "string.empty": "Alt text cannot be empty",
      "any.required": "Alt text is required",
    }),
  })
    .required()
    .messages({
      "object.base": "Image must be an object",
      "any.required": "Image is required",
    }),
  address: Joi.object({
    state: Joi.string(),
    country: Joi.string().required().messages({
      "string.base": "Country must be a string",
      "string.empty": "Country cannot be empty",
      "any.required": "Country is required",
    }),
    city: Joi.string().required().messages({
      "string.base": "City must be a string",
      "string.empty": "City cannot be empty",
      "any.required": "City is required",
    }),
    street: Joi.string().required().messages({
      "string.base": "Street must be a string",
      "string.empty": "Street cannot be empty",
      "any.required": "Street is required",
    }),
    houseNumber: Joi.number().required().messages({
      "number.base": "House Number must be a number",
      "any.required": "House Number is required",
    }),
    zip: Joi.number().required().messages({
      "number.base": "ZIP must be a number",
      "any.required": "ZIP is required",
    }),
  })
    .required()
    .messages({
      "object.base": "Address must be an object",
      "any.required": "Address is required",
    }),
  bizNumber: Joi.number().default(() => {
    return Math.floor(Math.random() * (9999999 - 1000000 + 1)) + 1000000;
  }),
  likes: Joi.array().items(Joi.string()).allow(null, "").default(0),
  user_id: Joi.string().hex().length(24).allow(null, "").messages({
    "string.base": "User ID must be a string",
    "string.hex": "Invalid hexadecimal User ID",
    "string.length": "User ID must be 24 characters long",
    "any.required": "User ID is required",
  }),
}).messages({
  "object.unknown": "Unknown field: {{#label}}",
});

const Card = mongoose.model("Card", CardSchema);

module.exports = { Card, cardValidationSchema };
