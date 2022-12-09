const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
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

    name: {
      type: Object,
      required: true,
      first: {
        type: String,
        required: true,
      },
      last: {
        type: String,
        required: true,
      },
    },

    education: {
      type: Object,
      required: true,
      university: {
        type: String,
        required: true,
      },
      degree: {
        type: String,
        required: true,
      },
      field: {
        type: String,
        required: true,
      },
      yearOfGraduation: {
        type: String,
        required: true,
      },
    },

    skills: {
      type: Array,
      required: true,
    },

    experience: {
      type: Array,
      required: true,

      company: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        required: true,
      },
      startDate: {
        type: String,
        required: true,
      },
      endDate: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
    },

    linkedinURL: {
      type: String,
      required: true,
    },
    contact: {
      type: Object,
      required: true,
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },
  },
  {
    collection: "profiles",
  }
);

const model = mongoose.model("Profile", profileSchema);
module.exports = model;
