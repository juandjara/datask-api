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
    enum: ['ACTIVED', 'PAUSED', 'FINISHED']
  },
  budget: {
    ownAmount: Number,
    hours: Number,
    billingDate: Date,
    startDate: Date,
    endDate: Date
  }
});

projectSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Project', projectSchema);
