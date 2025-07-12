import { Schema, model, Document, Model } from 'mongoose';

// Interface for Payment document
export interface IPayment extends Document {
  user: Schema.Types.ObjectId;
  amount: number;
  date: Date;
  numberOfCoins?: number;
}

// Interface for Payment model
export interface IPaymentModel extends Model<IPayment> {}

const paymentSchema = new Schema<IPayment>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  numberOfCoins: {
    type: Number,
    default: 0,
  },
});

const Payment = model<IPayment, IPaymentModel>('Payment', paymentSchema);

export { Payment }; 