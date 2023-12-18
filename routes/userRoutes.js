const express = require("express");
const router = express.Router();

const {
  authenticateUser,
  authorizePermissions,
} = require("../middlewares/authentication");

const {
  register,
  login,
  logout,
  getAllUsers,
  getSingleUser,
  deleteCurrentUser,
  updateStatus,
  updateUser,
} = require("../controllers/userController");

router.post("/login", login);
router.delete("/logout", logout);

router
  .route("/")
  .get(authenticateUser, authorizePermissions("admin"), getAllUsers)
  .post(register);
router
  .route("/:id")
  .get(authenticateUser, getSingleUser)
  .put(authenticateUser, updateUser)
  .patch(authenticateUser, updateStatus)
  .delete(authenticateUser, deleteCurrentUser);


module.exports = router;
