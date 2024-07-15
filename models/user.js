const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: false,
  }
})

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  tasks: [taskSchema],
  taskCounter: {
    type: Number,
    required: true,
    default: 0,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
