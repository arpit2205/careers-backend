const express = require("express");
const router = express.Router();
const Job = require("../../models/Job");

const verifyToken = require("../middleware/verifyToken");

// Get all jobs
router.get("/all-jobs", verifyToken, async (req, res) => {
  try {
    const jobs = await Job.find();

    return res.status(200).json({ status: "success", data: jobs });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error });
  }
});

// Get single job
router.get("/:id", verifyToken, async (req, res) => {
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
