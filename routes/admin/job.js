const express = require("express");
const router = express.Router();
const Job = require("../../models/Job");

const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");

// Create a job
router.post("/post-job", verifyToken, verifyAdmin, async (req, res) => {
  const { role, tag, description, location, salary, duration } = req.body;

  //validations
  if (
    !role ||
    !tag ||
    !description ||
    !description.about ||
    !description.skills ||
    !description.responsibilities ||
    !location ||
    !salary ||
    !duration
  ) {
    return res
      .status(400)
      .json({ status: "error", message: "Please enter all fields" });
  }

  try {
    const job = await Job.create({
      role,
      tag,
      description,
      location,
      salary,
      duration,
    });

    return res.status(201).json({ status: "success", data: job });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error });
  }
});

// Delete a job
router.delete("/delete-job/:id", verifyToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    await Job.findByIdAndDelete(id);

    return res.status(200).json({ status: "success", message: "Job deleted" });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error });
  }
});

// Get all jobs
router.get("/all-jobs", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const jobs = await Job.find();

    return res.status(200).json({ status: "success", data: jobs });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error });
  }
});

// Get single job
router.get("/:id", verifyToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const jobExists = await Job.findById(id);
    if (!jobExists) {
      return res
        .status(400)
        .json({ status: "error", message: "Job not found" });
    }

    return res.status(200).json({ status: "success", data: jobExists });
  } catch (err) {
    return res.status(400).json({ status: "error", message: "Job not found" });
  }
});

module.exports = router;
