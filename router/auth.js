const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const pick = require('lodash/pick');
const { tokenSecret } = require('../config');

const User = require('../models/user');

// Авторизация по токену
router.post('/', async (req, res) => { // localhost/auth
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(401).json({ message: 'Incorrect username or password.' });
  }

  const user = await User.findOne({username});

  if (!user) {
    return res.status(401).json({ message: 'User not found' });
  }

  if (!user.comparePassword(password)) {
    return res.status(401).json({ message: 'Wrong password' });
  }

  const userInfo = pick(user, ['_id', 'username']);
  console.log(userInfo);
  res.json({
    token: jwt.sign(userInfo, tokenSecret),
    ...userInfo
  });
});

module.exports = router;
