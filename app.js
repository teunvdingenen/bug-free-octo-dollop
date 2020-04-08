const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const fs = require('fs');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const resolvers = require('./src/resolvers');
const { getUser } = require('./src/auth');

const typeDefs = fs.readFileSync(path.join(__dirname, 'fantastic.graphqls'),
  'utf-8');

const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token = req.headers.authorization || '';
    const user = await getUser(token);
    if (!user) {
      return {};
    }
    return { user };
  },
});

const forceSsl = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(['https://', req.get('Host'), req.url].join(''));
  }
  return next();
};

const app = express();
const env = process.env.ENV_VARIABLE || process.env.NODE_ENV || 'development';
apollo.applyMiddleware({ app });
if (env === 'production') {
  app.use(forceSsl);
} else {
  app.use(logger('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => res.sendFile(path.resolve('public', 'index.html')));
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
