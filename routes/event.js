const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const eventController = require("../controllers/eventController");

router.get("/", eventController.getAllEvents);
router.post("/", eventController.createEvent);
router.get("/:id", eventController.getEventById);
router.get("/category/:category", eventController.getEventsByCategory);

module.exports = router;
