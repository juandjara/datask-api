const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate')

const timeSchema = new Schema({
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: Date,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  task: {
    type: Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  }
});

timeSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Time', timeSchema);
