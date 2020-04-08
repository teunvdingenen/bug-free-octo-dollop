const ops = require('./operations');
const auth = require('./auth');

module.exports = {
  Mutation: {
  	register: (parent, args) => auth.register(args.authInput),
    saveTicker: (parent, args, context) => {
      const v = (context.user && !context.user.shadow_banned
    	 ? ops.saveTicker(context.user, args.tickerInput)
    	 : null);
      console.log(v);
      return v;
    },
    next: (parent, args) => ops.next(args.token),
  },
  Query: {
  	viewer: (parent, args, context) => {
      if (!context.user) {
        return null;
      }
      return context.user;
    },
    ticker: (parent, args) => ops.getTicker(args.count),
  },
};
