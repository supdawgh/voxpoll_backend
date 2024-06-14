const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/adminController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/unverified")
  .get(verifyRoles(ROLES_LIST.Admin), adminController.getAllUnverifiedEvents);
router
  .route("/eventCount")
  .get(verifyRoles(ROLES_LIST.Admin), adminController.getEventCount);
router
  .route("/newEvents")
  .get(verifyRoles(ROLES_LIST.Admin), adminController.getAllNewEvents);

router
  .route("/allevents")
  .get(verifyRoles(ROLES_LIST.Admin), adminController.getAllEvents);

router
  .route("/:id")
  .get(verifyRoles(ROLES_LIST.Admin), adminController.getEventById);

router
  .route("/approve/:id")
  .patch(verifyRoles(ROLES_LIST.Admin), adminController.approveEvent);

router
  .route("/decline/:id")
  .patch(verifyRoles(ROLES_LIST.Admin), adminController.declineEvent);
//
//     .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.updateEmployee)
//     .delete(verifyRoles(ROLES_LIST.Admin), employeesController.deleteEmployee);

// router.route('/:id')
//     .get(employeesController.getEmployee);

module.exports = router;
