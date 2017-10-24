const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate')

const taskSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  estimatedTime: {
    type: String,
    match: /[0-9]{2}:[0-9]{2}/
  },
  asignee: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

taskSchema.plugin(mongoosePaginate)


module.exports = mongoose.model('Task', taskSchema);
