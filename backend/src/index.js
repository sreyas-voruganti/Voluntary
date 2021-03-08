require("dotenv").config();
const app = require("./app");
const { socket } = require("./socket");
const mongoose = require("mongoose");

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    app.listen(parseInt(process.env.PORT), () => {
      socket.listen(parseInt(process.env.SOCKET_PORT), () => {
        console.log(
          `Voluntary Backend Successfully Started: (HTTP: ${parseInt(
            process.env.PORT
          )}, SOCKET: ${parseInt(process.env.SOCKET_PORT)})`
        );
      });
    });
  })
  .catch((err) => console.log(err));
