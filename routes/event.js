const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const eventController = require("../controllers/eventController");
const ROLES_LIST = require("../config/roles_list");
const verifyRoles = require("../middleware/verifyRoles");

router.get("/", eventController.getAllEvents);
router
  .route("/")
  .post(verifyRoles(ROLES_LIST.User), eventController.createEvent);

router
  .route("/all")
  .get(verifyRoles(ROLES_LIST.User), eventController.getAllMyEvents);
router.get("/:id", eventController.getEventById);
router.get("/category/:category", eventController.getEventsByCategory);

module.exports = router;
