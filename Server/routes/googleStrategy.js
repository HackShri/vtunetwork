const router = require('express').Router();
const passport = require('passport');

const isGoogleConfigured = Boolean(
  process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_CALLBACK_URL,
);

router.get('/auth/google', (req, res, next) => {
  if (!isGoogleConfigured) {
    return res.status(503).json({
      success: false,
      message: 'Google OAuth is not configured on the server.',
    });
  }
  return passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/auth/google/callback', (req, res, next) => {
  if (!isGoogleConfigured) {
    return res.status(503).json({
      success: false,
      message: 'Google OAuth is not configured on the server.',
    });
  }
  return passport.authenticate('google', {
    failureRedirect: process.env.GOOGLE_FAILURE_REDIRECT || 'http://localhost:5173/login',
    successRedirect: process.env.GOOGLE_SUCCESS_REDIRECT || 'http://localhost:5173',
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout(() => {
    res.send('Logged out');
  });
});

module.exports = router;
