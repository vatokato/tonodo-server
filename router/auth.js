const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const pick = require('lodash/pick');
const { tokenSecret } = require('../config.js');

const User = require('../models/user');

// Авторизация по токену
router.post('/', async (req, res) => { // localhost/auth
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Incorrect username or password.' });
  }

  try {
    const user = await User.findOne({username});

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (!user.comparePassword(password)) {
      return res.status(400).json({ message: 'Wrong password' });
    }

    const userInfo = pick(user, ['_id', 'username']);

    return res.status(200).json({
      token: jwt.sign(userInfo, tokenSecret),
      ...userInfo
    });
  } catch (error) {
    res.status(500).json({ error });
  }

});

module.exports = router;
