const mongoose = require("mongoose");

//create job schema
const jobSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      required: true,
    },
    description: {
      type: Object,
      required: true,
      about: {
        type: String,
        required: true,
      },
      skills: {
        type: Array,
        required: true,
      },
      responsibilities: {
        type: Array,
        required: true,
      },
    },
    location: {
      type: String,
      required: true,
    },
    salary: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "jobs",
  }
);

const model = mongoose.model("Job", jobSchema);
module.exports = model;
