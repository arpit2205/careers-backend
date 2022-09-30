const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const Application = require("../../models/Application");
const Job = require("../../models/Job");

// Create an application
router.post("/apply", verifyToken, async (req, res) => {
  const { user, job, profile } = req.body;

  //validate
  if (!user || !job || !profile) {
    return res
      .status(400)
      .json({ status: "error", message: "Please enter all fields" });
  }

  const data = {
    user: {
      id: user.id,
      username: user.username,
    },
    job: {
      id: job.id,
      role: job.role,
      location: job.location,
    },
    profile,
    status: "applied",
  };

  //check if job exists
  try {
    const jobExists = await Job.findById(job.id);
    if (!jobExists) {
      return res
        .status(400)
        .json({ status: "error", message: "Job does not exist" });
    }
  } catch (err) {
    return res
      .status(400)
      .json({ status: "error", message: "Job does not exist" });
  }

  //check if already applied
  try {
    const application = await Application.findOne({
      "user.id": user.id,
      "job.id": job.id,
    });
    if (application) {
      return res
        .status(400)
        .json({ status: "error", message: "Already applied" });
    }
  } catch (err) {
    return res
      .status(400)
      .json({ status: "error", message: "Already applied" });
  }

  try {
    const application = await Application.create(data);
    return res.status(201).json({ status: "success", data: application });
  } catch (error) {
    res.status(500).json({ status: "error", message: error });
  }
});

// Get my applications
router.get("/my-applications", verifyToken, async (req, res) => {
  const { user } = req.body;
  try {
    const applications = await Application.find({
      "user.id": user.id,
    });
    return res.status(200).json({ status: "success", data: applications });
  } catch (error) {
    res.status(500).json({ status: "error", message: error });
  }
});

module.exports = router;
