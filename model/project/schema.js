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
    ownAmount: {
      type: Number
    },
    hours: {
      type: Number
    },
    billingDate: {
      type: Date
    },
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    }
  }
});

projectSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Project', projectSchema);
