const express = require("express");
const router = express.Router();
const usersController = require("../../controllers/usersController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");
const faceController = require("../../controllers/faceController");
// const formidable = require("formidable");
// const form = formidable();

router
  .route("/")
  .get(verifyRoles(ROLES_LIST.Admin), usersController.getAllUsers)
  .delete(verifyRoles(ROLES_LIST.Admin), usersController.deleteUser);

router
  .route("/admins")
  .get(verifyRoles(ROLES_LIST.Admin), usersController.getAllAdmins);

router
  .route("/:id")
  .get(verifyRoles(ROLES_LIST.Admin), usersController.getUser);

router.route("/faceRecognition").post(faceController.faceRecognition);

module.exports = router;
