const mongoose = require("mongoose");
const app = require("./app");
mongoose.set("strictQuery", false);

const { DB_URL, PORT = 3000 } = process.env;

const connection = mongoose.connect(DB_URL, {
  promiseLibrary: global.Promise,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connection
  .then(() => {
    app.listen(PORT);
    console.log("Database connection successful");
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
