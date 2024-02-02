const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Ruta para iniciar el proceso de autenticación
router.get('/github', authController.loginGitHub);

// Ruta de callback después de la autenticación en GitHub
router.get('/sessions/githubcallback', authController.gitHubCallback);

module.exports = router;
