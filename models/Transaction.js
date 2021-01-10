const { Schema, model } = require('mongoose');
const shortid = require('shortid');

const schema = new Schema({
  _id: { type: String, default: shortid.generate },
  date: { type: Date, required: true },
  description: { type: String },
  isIncome: { type: Boolean, required: true },
  amount: { type: Number, required: true },
});

module.exports = model('Transaction', schema);
