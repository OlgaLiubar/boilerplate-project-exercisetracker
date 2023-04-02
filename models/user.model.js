const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
      trim: true,
    },
    count: Number,
    log: [{
      description: {
        type: String,
        required: true
      },
      duration: {
        type: Number,
        required: true
      },
      date: String
    }]
  });

const User = mongoose.model('user', userSchema);
module.exports = User;