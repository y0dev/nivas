const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Subscription must belong to a user'],
  },
  plan: {
    type: String,
    enum: ['basic', 'pro', 'elite'],
    required: [true, 'Subscription must have a plan'],
  },
  billingInterval: {
    type: String,
    enum: ['monthly', 'annual'],
    required: [true, 'Subscription must have a billing interval'],
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: [true, 'Subscription must have an end date'],
  },
  trialEndDate: {
    type: Date,
  },
  allowedSearches: {
    type: Number,
    required: [true, 'Subscription must have allowed searches'],
  },
  searchesMade: {
    type: Number,
    default: 0,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);
module.exports = { Subscription, subscriptionSchema };
