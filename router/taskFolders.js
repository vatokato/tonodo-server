const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const TaskFolder = require('../models/taskFolder');
const omit = require('lodash/omit');
const { tokenSecret } = require('../config');

router.use('/', async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).json({ message: 'No token' });
  } else {
    const [type, token] = req.headers.authorization.split(' ');

    jwt.verify(token, tokenSecret, (err, payload) => {
      if (err) {
        return res.status(403).json({ message: 'Wrong token' });
      }
      req.user = payload;
      next();
    });
  }
});

router.get('/', async (req, res) => {
  const { _id: userId } = req.user;
  const folders = await TaskFolder.find({ userId }).lean();
  res.json(folders.map(task => omit(task, 'userId')));
});

router.post('/', (req, res) => {
  const { _id: userId } = req.user;
  const folder = new TaskFolder({ ...req.body, userId });
  folder.save(error => {
    if (error) {
      res.json({ error });
    } else {
      res.json(omit(folder, 'userId'));
    }
  });
});

// Полное изменение задачи
router.put('/:id', async (req, res) => {
  const folder = await TaskFolder.findOneAndUpdate(req.params.id, req.body, { new: true }).lean();
  res.json(omit(folder, 'userId'));
});

// Частичное изменение задачи
router.patch('/:id', async (req, res) => {
  try {
    const folder = await TaskFolder.findOneAndUpdate(req.params.id, { $set: req.body }, { new: true }).lean();
    res.json(omit(folder, 'userId'));
  } catch ({ message }) {
    res.json({
      error: message
    });
  }
});

router.delete('/:id', async (req, res) => {
  const result = await TaskFolder.deleteOne({ _id: req.params.id });
  res.json(result);
});

module.exports = router;