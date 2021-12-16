const express = require("express");
const router = express.Router();

const Application = require("../../models/Application");
const Job = require("../../models/Job");
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");

// Get all applications
router.get("/all-applications", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const applications = await Application.find();
    res.status(200).json({ status: "success", data: applications });
  } catch (error) {
    res.status(500).json({ status: "error", message: error });
  }
});

// Get applications for a specific job
router.get("/job/:jobId", verifyToken, verifyAdmin, async (req, res) => {
  const { jobId } = req.params;

  // Check if job exists
  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        status: "error",
        message: "Job not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error getting job",
    });
  }

  try {
    const applications = await Application.find({ "job.id": jobId });
    res.status(200).json({ status: "success", data: applications });
  } catch (error) {
    res.status(500).json({ status: "error", message: error });
  }
});

// Get all applications where status !== applied (Logs)
router.get("/logs", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const applications = await Application.find({
      status: { $ne: "applied" },
    });
    res.status(200).json({ status: "success", data: applications });
  } catch (error) {
    res.status(500).json({ status: "error", message: error });
  }
});

// Select or reject an application
router.patch("/:applicationId", verifyToken, verifyAdmin, async (req, res) => {
  const { status, message } = req.body;
  const { applicationId: id } = req.params;

  //validation
  if (!id || !status || !message) {
    return res.status(400).json({
      status: "error",
      message: "Please enter all fields",
    });
  }

  if (status !== "selected" && status !== "rejected") {
    return res.status(400).json({
      status: "error",
      message: "Please enter a valid status",
    });
  }

  // check if application exists
  try {
    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({
        status: "error",
        message: "Application not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error finding application",
    });
  }

  try {
    const application = await Application.findOneAndUpdate(
      { _id: id },
      { $set: { status, message } },
      { new: true }
    );
    res.status(200).json({ status: "success", data: application });
  } catch (error) {
    res.status(500).json({ status: "error", message: error });
  }
});

module.exports = router;
