const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/usersController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');
const faceController = require('../../controllers/faceController');

router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin), usersController.getAllUsers)
    .delete(verifyRoles(ROLES_LIST.Admin), usersController.deleteUser);

router.route('/:id')
    .get(verifyRoles(ROLES_LIST.Admin), usersController.getUser);

router.route('/faceRecognition')
    .post(verifyRoles(ROLES_LIST.Admin), faceController.faceRecognition);

module.exports = router;