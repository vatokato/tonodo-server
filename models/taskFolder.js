const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskFoldersSchema = new Schema({
  userId: {
    type: String,
    requried: true,
  },
  title: {
    type: String,
    required: true,
  },
  parentId: Number,
  editable: {
    type: Boolean,
    default: true,
  }
}, {timestamps: {}});

module.exports = mongoose.model('TaskFolder', taskFoldersSchema, 'taskFolders');
