const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriptionSchema = new Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  plan: {
    type: String,
    enum: ['basic', 'premium', 'vip'],
    required: true,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  allowedSearches: {
    type: Number,
    required: true,
  },
  searchesMade: {
    type: Number,
    default: 0,
  },
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);
module.exports = { Subscription, subscriptionSchema };