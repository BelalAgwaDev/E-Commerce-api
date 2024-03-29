const mongoose = require("mongoose");

const dbConnection = () => {
  mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((connect) => {
      console.log(`Database connected : ${connect.connection.host}`);
    });
};

module.exports = dbConnection;
