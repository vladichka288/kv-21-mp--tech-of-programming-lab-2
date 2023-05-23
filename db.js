const app = require("./server");
const mongoose = require("mongoose"); //
const config = require("./config");
const databaseUrl = config.DatabaseUrl;
const serverPort = config.ServerPort;
const connectOptions = {
  useNewUrlParser: true,
};
async function connectDB() {
  mongoose
    .connect(databaseUrl, connectOptions)
    .then(() => console.log("Mongo database connected"))
    .then(() =>
      app.listen(serverPort, function () {
        console.log("Server is ready");
      })
    )
    .catch(() => console.log("ERROR: Mongo database not connected"));
}
module.exports = connectDB;
