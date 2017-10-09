const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate')
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  completedEstimated: {
    type: Number,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    required: true,
    enum: ['ACTIVE', 'PAUSED', 'FINISHED']
  },
  budget: {
    ownAmount: Number,
    hours: Number,
    billingDate: Date,
    startDate: Date,
    endDate: Date
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company'
  },
  manager: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
});

projectSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Project', projectSchema);
