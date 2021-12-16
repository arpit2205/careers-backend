const mongooose = require("mongoose");

const userSchema = new mongooose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
    },
  },
  {
    collection: "users",
  }
);

const model = mongooose.model("userSchema", userSchema);
module.exports = model;
