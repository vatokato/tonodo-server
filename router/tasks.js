const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Task = require('../models/task');
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
  const tasks = await Task.find({ userId }).lean();
  res.json(tasks.map(task => omit(task, 'userId')));
});

router.post('/', (req, res) => {
  const { _id: userId } = req.user;
  const task = new Task({ ...req.body, userId });
  task.save(error => {
    if (error) {
      res.json({ error });
    } else {
      res.json(omit(task, 'userId'));
    }
  });
});

// Полное изменение задачи
router.put('/:id', async (req, res) => {
  const savedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
  res.json(omit(savedTask, 'userId'));
});

// Частичное изменение задачи
router.patch('/:id', async (req, res) => {
  console.log(req.body);
  try {
    const savedTask = await Task.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }).lean();
    res.json(omit(savedTask, 'userId'));
  } catch ({ message }) {
    res.json({
      error: message
    });
  }
});

router.delete('/:id', async (req, res) => {
  const deletedTask = await Task.findByIdAndRemove(req.params.id);
  res.json(omit(deletedTask, 'userId'));
});

module.exports = router;