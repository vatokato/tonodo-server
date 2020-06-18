const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  userId: {
    type: String,
    requried: true,
  },
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  folderId: String,
  parentId: Number,
}, {timestamps: {}});

module.exports = mongoose.model('Task', taskSchema, 'tasks');
