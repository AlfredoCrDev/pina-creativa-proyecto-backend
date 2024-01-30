const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController.js');
const utils = require("../utils.js")
const userController = new UserController();

// APIs
router.get('/', userController.getAllUsers);
router.get('/userinfo', utils.authToken, userController.getUserInfo);
router.get("/byid/:uid", userController.getUserById)
router.get('/email/:email', userController.getUserByEmail);
router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.get("/logout", userController.logoutUser)
router.post("/forgot-password", userController.forgotPassword)
router.post("/reset-password", userController.updatePassword)
// router.put('/premium/:uid', utils.passportCall('jwt'), utils.isAdmin, userController.toggleUserRole);
router.put('/premium/:uid', userController.toggleUserRole);
router.post("/:uid/documents", userController.uploadDocuments);




module.exports = router;