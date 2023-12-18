const { Card, cardValidationSchema } = require("../models/Card");
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const CustomError = require("../errors");

const getAllCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.status(StatusCodes.OK).json({ cards });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
  }
};

const createCard = async (req, res) => {
  try {
    const validationResult = cardValidationSchema.validate(req.body, {
      abortEarly: false,
      allowUnknown: true,
    });

    if (validationResult.error) {
      const errorMessage = validationResult.error.details[0].message;
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: errorMessage });
    }

    const {
      title,
      subtitle,
      description,
      phone,
      email,
      web,
      image,
      address,
      bizNumber,
      likes,
    } = req.body;

    // Create a new card
    const card = await Card.create({
      title,
      subtitle,
      description,
      phone,
      email,
      web,
      image,
      address,
      bizNumber,
      likes,
      user_id: req.user.userId,
    });

    res.status(StatusCodes.CREATED).json({ card });
  } catch (error) {
    if (error instanceof CustomError.HttpError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal Server Error" });
    }
  }
};

const getSingleCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (card) {
      return res.status(StatusCodes.OK).json({ card });
    } else {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "No card found" });
    }
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: error.message });
  }
};

const getMyCards = async (req, res) => {
  try {
    const cards = await Card.find({ user_id: req.user.userId });
    if (cards) {
      return res.status(StatusCodes.OK).json({ cards });
    } else {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "No cards found" });
    }
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: error.message });
  }
};

const updateCard = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the request data
    const validationResult = cardValidationSchema.validate(req.body, {
      abortEarly: false,
      allowUnknown: true,
    });

    if (validationResult.error) {
      const errorMessage = validationResult.error.details[0].message;
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: errorMessage });
    }

    const card = await Card.findOne({ _id: id });

    if (!card) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "Card not found" });
    }

    if (card.user_id == req.user.userId) {
      const updatedCard = await Card.findOneAndUpdate({ _id: id }, req.body, {
        new: true,
        runValidators: true,
      });

      res.status(StatusCodes.OK).json({ card: updatedCard });
    } else {
      res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Not Authorized" });
    }
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: error.message });
  }
};

const likeCard = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const card = await Card.findById(id);

    if (!card) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "Card not found" });
    }

    if (card.likes.includes(userId)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "You already liked this card" });
    }

    card.likes.push(userId);
    await card.save();

    res.status(StatusCodes.OK).json({ msg: "Card liked successfully", card });
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: error.message });
  }
};

const deleteCard = async (req, res) => {
  try {
    const { id } = req.params;
    const card = await Card.findById(id);
    if (!card) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "No cards found" });
    }
    if (req.user.role == "admin" || req.user.userId == card.user_id) {
      await card.deleteOne();
      res
        .status(StatusCodes.OK)
        .json({ msg: "Card Deleted Successfully!", card });
    } else {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Unauthorized to delete this card" });
    }
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: error.message });
  }
};
module.exports = {
  getAllCards,
  createCard,
  getSingleCard,
  getMyCards,
  updateCard,
  likeCard,
  deleteCard,
};
