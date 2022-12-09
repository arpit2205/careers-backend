const express = require("express");
const router = express.Router();

const Application = require("../../models/application");
const Job = require("../../models/job");
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");

const nodemailer = require("nodemailer");

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

// send email to applicant
router.post(
  "/email/:applicationId",
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    const { applicationId: id } = req.params;
    const { status, candidate, job, feedback } = req.body;

    /**
     * const data = {
     *  status: "selected", // or "rejected" or "applied"
     *  candidate: {
     *     name: "John Doe",
     *     email: "mail@mail.com"
     *  },
     *  job: {
     *     role: "Software Engineer",
     *     location: "Bangalore",
     *     id: "123456789"
     *  },
     *  feedback: "Thank you for applying. We will get back to you soon."
     * }
     */

    // validation
    if (!id || !status || !candidate || !job || !feedback) {
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

    // send email

    const text =
      status === "selected"
        ? `Hi ${candidate.name},\n\nWe are pleased to inform you that your application (ID:${id}) for the position of ${job.role}, ${job.location} (ID:${job.id}) has been SELECTED. We will soon reach out to you for next steps.\n\nAdditional feedback from the recruiter on your application: ${feedback}\n\nRegards,\nHiring Platform Team`
        : status === "rejected"
        ? `Hi ${candidate.name},\n\nThank you for your interest in our company. We regret to inform you that your application (ID:${id}) for the position of ${job.role}, ${job.location} (ID:${job.id}) has been REJECTED.\n\nAdditional feedback from the recruiter on your application: ${feedback}\n\nRegards,\nHiring Platform Team`
        : null;

    // send email using nodemailer

    const transporter = nodemailer.createTransport({
      service: "gmail",

      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: candidate.email,
      subject: "Hiring Platform - Application Status Update",
      text: text,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        res.status(500).json({ status: "error", message: error });
      } else {
        res.status(200).json({ status: "success", message: "Email sent" });
      }
    });
  }
);

// get single application
router.get("/:applicationId", verifyToken, verifyAdmin, async (req, res) => {
  const { applicationId: id } = req.params;

  // check if application exists
  try {
    const application = await Application.findById(id);
    if (!application) {
      return res.status(400).json({
        status: "error",
        message: "Application not found",
      });
    }

    return res.status(200).json({ status: "success", data: application });
  } catch (error) {
    return res
      .status(400)
      .json({ status: "error", message: "Application not found" });
  }
});

module.exports = router;
