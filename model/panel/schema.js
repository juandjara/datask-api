const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate')
const Schema = mongoose.Schema;

const panelSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  hidden: Boolean,
  orderPosition: {
    type: Number,
    min: 0
  },
  defaultTaskStatus: {
    type: String,
    enum: ["PENDING", "ACTIVE", "COMPLETED"]
  }
});

panelSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Panel', panelSchema);
