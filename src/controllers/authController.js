const passport = require('passport');

// Iniciar el proceso de autenticación con GitHub
async function loginGitHub(req, res) {
  passport.authenticate('github', { session: false, scope: ['user:email'] })(req, res);
}

// Manejar la respuesta de GitHub después de la autenticación
async function gitHubCallback(req, res) {
  passport.authenticate('github', { failureRedirect: '/login' }, async (err, user) => {
    if (err || !user) {
      return res.status(400).json({ status: 'error', message: 'Token incorrecto o expirado' });
    }
    res.cookie('token', user, { httpOnly: true, maxAge: 60 * 60 * 1000 });
    res.redirect(`/profile`);
  })(req, res);
}

module.exports = { loginGitHub, gitHubCallback };
