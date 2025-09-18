const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  console.log(req.body);
  try {
    const { username, email, password, role } = req.body; // Ensure req.body contains the expected fields
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const checkUser = await User.findOne({ email: email });
    if (checkUser) {
      return res.status(400).json({
        message: 'Email or Username already exists, Please try with different one',
        status: 400,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newlyCreatedUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || 'user',
    });
    await newlyCreatedUser.save();
    console.log(newlyCreatedUser, 'hello bro ');
    if (newlyCreatedUser) {
      res.status(201).json({
        message: 'User registered successfully',
        success: true,
      });
    } else {
      res.status(400).json({
        status: 400,
        message: 'User registration failed',
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const loginuser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User don't exists",
        status: 400,
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid credentials',
        status: 400,
      });
    }

    const accessToken = jwt.sign(
      {
        userID: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1d' },
    );

    res.cookie('userToken', accessToken, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    console.log(user, 'the user data bro ');

    res.status(202).json({
      success: true,
      message: 'User logged in successfully',
      status: 200,
      user: user,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Server error' });
  }
};
const changePassword = async (req, res) => {
  try {
    const userId = req.userInfo.userID; // Corrected userInfo property to match JWT payload

    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found',
      });
    }

    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password); // Moved logic outside the if block
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: 'Old password is incorrect',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = newHashedPassword;
    await user.save();
    res.status(200).json({
      message: 'Password changed successfully',
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = { registerUser, loginuser, changePassword };
