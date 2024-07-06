const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Payment must belong to a user']
  },
  amount: {
    type: Number,
    required: [true, 'Payment must have an amount']
  },
  date: {
    type: Date,
    default: Date.now
  },
  subscription: {
    type: mongoose.Schema.ObjectId,
    ref: 'Subscription'
  }
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = { Payment, paymentSchema };
