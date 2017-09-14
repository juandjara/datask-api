const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate')
const Schema = mongoose.Schema;

const companySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  address: String,
  type: {
    type: String,
    enum: ["INTERNAL", "CONTACT"]
  },
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
});

companySchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Company', companySchema);
