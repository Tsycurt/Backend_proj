const express = require("express");
const router = express.Router();

const {
  authenticateUser,
} = require("../middlewares/authentication");

const {
    getAllCards,
    createCard,
    getSingleCard,
    getMyCards,
    updateCard,
    likeCard,
    deleteCard
} = require("../controllers/cardController");

router
  .route("/")
  .get(getAllCards)
  .post(authenticateUser,createCard);

router.get("/my-cards", authenticateUser, getMyCards);

router
  .route("/:id")
  .get(getSingleCard)
  .put(authenticateUser, updateCard)
  .patch(authenticateUser, likeCard)
  .delete(authenticateUser, deleteCard);


module.exports = router;
