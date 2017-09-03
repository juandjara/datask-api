const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const uniqueValidator = require('mongoose-unique-validator');
const hiddenFields = require('mongoose-hidden')({ defaultHidden: {} })

const userSchema = new Schema({
  full_name: {
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
    select: false,
    hide: true
  },
  created_at: {
    type: Date,
    default: Date.now()
  },
  roles: {
    type: [
      {type: 'String', enum: ['ADMIN', 'DEVELOPER', 'CUSTOMER']}
    ],
    default: ["DEVELOPER"],
    required: true
  }
});

userSchema.plugin(uniqueValidator)
userSchema.plugin(hiddenFields)

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.pre('save', function(next) {
  const user = this
  if (!user.isModified('password')) {
    return next()
  }
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      return next(err)
    }
    user.password = hash
    next()
  });
})

module.exports = mongoose.model('User', userSchema);
