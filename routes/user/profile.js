const express = require("express");
const router = express.Router();

const Profile = require("../../models/profile");
const verifyToken = require("../middleware/verifyToken");

//post profile
router.post("/", verifyToken, async (req, res) => {
  const { user, name, education, skills, experience, linkedinURL, contact } =
    req.body;

  //validate
  if (
    !name ||
    !name.first ||
    !name.last ||
    !education ||
    !education.university ||
    !education.degree ||
    !education.field ||
    !education.yearOfGraduation ||
    !skills ||
    !experience ||
    !linkedinURL ||
    !contact
  ) {
    return res
      .status(400)
      .json({ status: "error", message: "Please enter all fields" });
  }

  const data = {
    user: {
      id: user.id,
      username: user.username,
    },
    name: {
      first: name.first,
      last: name.last,
    },
    education: {
      university: education.university,
      degree: education.degree,
      field: education.field,
      yearOfGraduation: education.yearOfGraduation,
    },
    skills,
    experience,
    linkedinURL: linkedinURL,
    contact: contact,
  };

  // Check if profile for this user already exists
  try {
    const profile = await Profile.findOne({ "user.id": user.id });

    if (profile) {
      return res.status(400).json({
        status: "error",
        message: "Profile for this user already exists",
      });
    }
  } catch (error) {
    return res.status(500).json({ status: "error", message: error });
  }

  // Create profile
  try {
    const profile = await Profile.create(data);
    return res.status(201).json({ status: "success", data: profile });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error });
  }
});

// get profile after login
router.get("/", verifyToken, async (req, res) => {
  const { user } = req.body;

  try {
    const profile = await Profile.findOne({ "user.id": user.id });
    return res.status(200).json({ status: "success", data: profile });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error });
  }
});

module.exports = router;
