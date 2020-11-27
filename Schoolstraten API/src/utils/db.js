const mongoose = require("mongoose");

async function connect() {
  return mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  });
}

module.exports = { connect };
