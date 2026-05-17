const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/create-admin', async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const user = await User.create({
    name,
    email,
    password,
    isAdmin: true,
  });
  res.json({ message: 'Admin created', email: user.email });
});
router.get('/profile', protect, getUserProfile);

module.exports = router;