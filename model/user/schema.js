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
  password: {
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

userSchema.pre('save', function(next) {
  const user = this
  if (!user.isModified('password')) {
    return next()
  }
  user.password = bcrypt.hashSync(user.password, 10);
  next()
})

module.exports = mongoose.model('User', userSchema);
