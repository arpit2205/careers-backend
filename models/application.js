const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: Object,
      required: true,
      id: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        required: true,
      },
      location: {
        type: String,
        required: true,
      },
    },

    user: {
      type: Object,
      required: true,
      id: {
        type: String,
        required: true,
      },
      username: {
        type: String,
        required: true,
      },
    },

    profile: {
      type: Object,
      required: true,
    },

    status: {
      type: String,
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    message: {
      type: String,
      default: "",
    },
  },
  {
    collection: "applications",
  }
);

const model = mongoose.model("Application", applicationSchema);
module.exports = model;
