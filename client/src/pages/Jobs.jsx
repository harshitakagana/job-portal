import { useEffect, useState } from "react";
import api from "../api/axios";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs");
        setJobs(res.data);
      } catch (err) {
        setError("Failed to load jobs");
      }
    };
    fetchJobs();
  }, []);

  const handleApply = async (jobId) => {
    setMessage("");
    setError("");
    try {
      await api.post(`/applications/${jobId}`, { coverLetter: "" });
      setMessage("Applied successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to apply");
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "50px auto" }}>
      <h2>Available Jobs</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {jobs.length === 0 && !error && <p>No jobs posted yet.</p>}
      {jobs.map((job) => (
        <div
          key={job._id}
          style={{ border: "1px solid #ccc", padding: 16, marginBottom: 12, borderRadius: 8 }}
        >
          <h3>{job.title}</h3>
          <p><strong>{job.company}</strong> — {job.location}</p>
          <p>{job.description}</p>
          <p>💰 {job.salary} | {job.jobType}</p>
          <button onClick={() => handleApply(job._id)}>Apply</button>
        </div>
      ))}
    </div>
  );
}

export default Jobs;
