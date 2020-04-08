const { ObjectId } = require('mongodb');
const {
  Ticker, Alert,
} = require('./model');

const SAFETY_TOKEN = '5e8db8a75b501c8b67a5d14b';

const saveTicker = async (user, { value }) => {
  try {
    await Ticker.findOneAndUpdate({
    	user: user.id,
    }, {
      value,
    }, {
    	upsert: true,
    	new: true,
    }).exec();
    return await Ticker.countDocuments({}).exec();
  } catch (err) {
    console.error(err);
  }
  return -1;
};

const next = async (token) => {
  try {
    if (token === SAFETY_TOKEN) {
      const oldest = await Ticker.findOne().sort('createdAt').limit(1).exec();
      console.log(oldest);
      await Ticker.deleteOne({ _id: oldest._id }).exec();
    }
    return true;
  } catch (err) {
    return false;
  }
};


const getTicker = async (count) => {
  try {
  	return await Ticker.find({}).sort('-createdAt').limit(count).exec();
  } catch (err) {
  	console.error(err);
  }
};

module.exports = {
  saveTicker,
  getTicker,
  next,
};
