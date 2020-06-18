const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const pick = require('lodash/pick');
const { tokenSecret } = require('../config');

const User = require('../models/user');

router.post('/', async (req, res) => { // localhost/auth
  const { username, password, password2 } = req.body;

  if (!username || !password || !password2) {
    return res.status(401).json({ message: 'Incorrect username or password.' });
  }

  if (password !== password2) {
    return res.status(401).json({ message: 'Passwords do not match' });
  }

  const user = await User.findOne({username});

  if (user) {
    return res.status(401).json({ message: 'User already exists' });
  }

  const newUser = new User({
    username,
    password,
  });

  await newUser.save();

  const userInfo = pick(newUser, ['_id', 'username']);
  console.log(userInfo);
  res.json({
    token: jwt.sign(userInfo, tokenSecret),
    ...userInfo
  });
});

module.exports = router;
