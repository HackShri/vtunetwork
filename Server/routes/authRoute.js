const e = require('express');
const { registerUser, loginuser } = require('../controllers/auth-controllers');
const authMiddleware = require('../middleware/auth-middleware');
const router = e.Router();

router.post('/register', registerUser);
router.post('/login', loginuser);
router.get('/authMiddle', authMiddleware, (req, res) => {
  return res.json({
    user: req.userInfo || req.user,
    message: 'The user is Authenticated ',
    success: true,
    isAuthenticated: true,
    userName: req.userName,
  });
});
// routes/auth.js (or similar)
router.get('/logout', (req, res) => {
  console.log('The logout is Clicked');
  req.logout((err) => {
    if (err) return res.status(500).send('Logout failed');
    req.session.destroy(() => {
      res.clearCookie('connect.sid'); // or whatever your cookie name is
      res.clearCookie('userToken');
      res.status(200).json({ message: 'Logged out' });
    });
  });
});

module.exports = router;
