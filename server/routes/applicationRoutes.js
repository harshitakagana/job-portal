const express = require("express");
const Application = require("../models/Application");
const Job = require("../models/Job");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:jobId", protect, authorize("jobseeker"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const application = new Application({
      job: req.params.jobId,
      applicant: req.user.id,
      coverLetter: req.body.coverLetter || ""
    });

    await application.save();
    res.status(201).json({ message: "Application submitted successfully", application });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "You already applied to this job" });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/my", protect, authorize("jobseeker"), async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user.id }).populate("job");
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/job/:jobId", protect, authorize("employer"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "You did not post this job" });
    }

    const applications = await Application.find({ job: req.params.jobId }).populate("applicant", "name email");
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
