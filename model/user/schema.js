const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  fullName: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
    required: true
  },
  hashed_password: {
    type: String,
    required: true,
    select: false
  },
  created_at: {
    type: Date,
    default: Date.now()
  }
});

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.hashed_password);
};

module.exports = mongoose.model('User', userSchema);
