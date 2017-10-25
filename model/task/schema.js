const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate')

const taskSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  estimatedTime: {
    type: String,
    match: /[0-9]{2}:[0-9]{2}/
  },
  asignee: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  project: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Project'
  },
  comments: [{
    publishedAt: {
      type: Date,
      required: true
    },
    authorName: {
      type: String,
      required: true,
      trim: true
    },
    body: {
      type: String,
      required: true,
      trim: true
    }
  }]
});

taskSchema.plugin(mongoosePaginate)


module.exports = mongoose.model('Task', taskSchema);
