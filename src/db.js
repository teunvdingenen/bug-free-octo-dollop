const mongoose = require('mongoose');

class Database {
  constructor() {
    this.connect();
  }

  connect() {
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/fantastic', { useNewUrlParser: true })
      .then(() => {
        console.log('Database connection successful');
        mongoose.set('debug', true);
        mongoose.set('useNewUrlParser', true);
        mongoose.set('useFindAndModify', false);
        mongoose.set('useCreateIndex', true);
        mongoose.set('useUnifiedTopology', true);
      })
      .catch((err) => {
        console.error(`Database connection error: ${err}`);
      });
  }
}

module.exports = new Database();
