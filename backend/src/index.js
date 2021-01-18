const config = require("../config");
const { http } = require("./app");
const mongoose = require("mongoose");

mongoose
  .connect(config.db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    http.listen(config.port, () => {
      console.log(
        `Server successfully started at http://localhost:${config.port}`
      );
    });
  })
  .catch((err) => console.log(err));
