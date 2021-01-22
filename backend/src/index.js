const config = require("../config");
const app = require("./app");
const { socket } = require("./socket");
const mongoose = require("mongoose");

mongoose
  .connect(config.db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    app.listen(config.port, () => {
      socket.listen(config.socket_port, () => {
        console.log(
          `Voluntary Backend Successfully Started: (HTTP: ${config.port}, SOCKET: ${config.socket_port})`
        );
      });
    });
  })
  .catch((err) => console.log(err));
