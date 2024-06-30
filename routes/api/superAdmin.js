const express = require("express");
const router = express.Router();
const documentController = require("../../controllers/documentController");

router.route("/create").post(documentController.uploadDocument);

router.route("/compare-image").post(documentController.compareImage);

module.exports = router;
