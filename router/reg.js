const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const pick = require('lodash/pick');
const { tokenSecret } = require('../config');

const User = require('../models/user');

router.post('/', async (req, res) => { // localhost/auth
  const { username, password, password2 } = req.body;

  if (!username || !password || !password2) {
    return res.status(400).json({ message: 'Incorrect username or password.' });
  }

  if (password !== password2) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const user = await User.findOne({username});

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
  } catch (error) {
    res.status(500).json({ error });
  }

  const newUser = new User({
    username,
    password,
  });

  try {
    await newUser.save();
    const userInfo = pick(newUser, ['_id', 'username']);
    res.status(200).json({
      token: jwt.sign(userInfo, tokenSecret),
      ...userInfo
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
