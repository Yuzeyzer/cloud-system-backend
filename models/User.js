const { Schema, model } = require('mongoose');

const User = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  diskSpace: {
    type: Number,
    default: 1024 ** 3 * 10,
  },
  usedSpace: {
    type: Number,
    default: 0,
  },
  files: [{ type: Object, ref: 'File' }],
});

module.exports = model('User', User);
