const express = require('express');
const router = express.Router();

router.use('/tasks', require('./tasks'));
router.use('/auth', require('./auth'));
router.use('/reg', require('./reg'));
router.use('/users', require('./users'));
router.use('/taskFolders', require('./taskFolders'));
router.get('/', (req, res) => {
  res.send('todo list api');
});

module.exports = router;