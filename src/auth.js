const jwt = require('jsonwebtoken');
const { User } = require('./model');

const APP_SECRET = 'dkl@#kjdf9kkdf1k3';

const getUser = (token) => {
  if (token === '') {
    return false;
  }
  const userId = jwt.verify(token, APP_SECRET);
  if (!userId) {
    throw new Error('No user authenticated');
  }
  return User.findById(userId.userId);
};

const register = async (parent, args) => {
  const user = await new User({
    name: args.name,
  }).save();
  return jwt.sign({ userId: user.id }, APP_SECRET);
};

module.exports = {
  getUser,
  register,
};
