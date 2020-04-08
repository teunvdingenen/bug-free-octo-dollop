const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  admin: Boolean,
  allow_alert: Boolean,
  shadow_banned: Boolean,
});

const tickerSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    autopopulate: true,
  },
  value: String,
}, {
  timestamps: true,
});

const alertSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    autopopulate: true,
  },
  value: String,
}, {
  timestamps: true,
});

alertSchema.plugin(require('mongoose-autopopulate'));
tickerSchema.plugin(require('mongoose-autopopulate'));

module.exports = {
  Ticker: mongoose.model('Ticker', tickerSchema),
  Alert: mongoose.model('Alert', alertSchema),
  User: mongoose.model('User', userSchema),
};
