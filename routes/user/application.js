const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const Application = require("../../models/application");
const Job = require("../../models/job");

const nodemailer = require("nodemailer");

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

// send mail to applicant on applying
router.post("/email/:applicationId", verifyToken, async (req, res) => {
  const { applicationId: id } = req.params;
  const { status, candidate, job } = req.body;

  /**
   * const data = {
   *  candidate: {
   *     name: "John Doe",
   *     email: "mail@mail.com"
   *  },
   *  job: {
   *     role: "Software Engineer",
   *     location: "Bangalore",
   *     id: "123456789"
   *  }
   * }
   */

  // validation
  if (!id || !candidate || !job || !status) {
    return res.status(400).json({
      status: "error",
      message: "Please enter all fields",
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
    status === "applied"
      ? `Hi ${candidate.name},\n\nYour application (ID:${id}) for the position of ${job.role}, ${job.location} (ID:${job.id}) has been RECEIVED. We are delighted that you would consider joining our company.\n\nOur team will review your application and will be in touch if there's a match.\n\nRegards,\nHiring Platform Team`
      : "";

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
    subject: "Hiring Platform - Thanks for your application!",
    text: text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).json({ status: "error", message: error });
    } else {
      res.status(200).json({ status: "success", message: "Email sent" });
    }
  });
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
