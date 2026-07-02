import { useEffect, useState } from "react";
import api from "../api/axios";

function EmployerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [jobType, setJobType] = useState("full-time");

  const fetchMyJobs = async () => {
    try {
      const res = await api.get("/jobs");
      const user = JSON.parse(localStorage.getItem("user"));
      const myJobs = res.data.filter((job) => job.postedBy === user.id);
      setJobs(myJobs);
    } catch (err) {
      setError("Failed to load jobs");
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const handlePostJob = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await api.post("/jobs", { title, description, company, location, salary, jobType });
      setMessage("Job posted successfully!");
      setTitle("");
      setDescription("");
      setCompany("");
      setLocation("");
      setSalary("");
      setJobType("full-time");
      fetchMyJobs();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post job");
    }
  };

  const viewApplicants = async (jobId) => {
    setSelectedJobId(jobId);
    setError("");
    try {
      const res = await api.get(`/applications/job/${jobId}`);
      setApplicants(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load applicants");
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "50px auto" }}>
      <h2>Employer Dashboard</h2>

      <h3>Post a New Job</h3>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handlePostJob} style={{ marginBottom: 30 }}>
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: "100%", padding: 8, marginBottom: 8 }} />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required style={{ width: "100%", padding: 8, marginBottom: 8 }} />
        <input placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} required style={{ width: "100%", padding: 8, marginBottom: 8 }} />
        <input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required style={{ width: "100%", padding: 8, marginBottom: 8 }} />
        <input placeholder="Salary (e.g. $70,000 - $90,000)" value={salary} onChange={(e) => setSalary(e.target.value)} style={{ width: "100%", padding: 8, marginBottom: 8 }} />
        <select value={jobType} onChange={(e) => setJobType(e.target.value)} style={{ width: "100%", padding: 8, marginBottom: 8 }}>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="internship">Internship</option>
          <option value="contract">Contract</option>
        </select>
        <button type="submit">Post Job</button>
      </form>

      <h3>My Posted Jobs</h3>
      {jobs.length === 0 && <p>You haven't posted any jobs yet.</p>}
      {jobs.map((job) => (
        <div key={job._id} style={{ border: "1px solid #ccc", padding: 16, marginBottom: 12, borderRadius: 8 }}>
          <h4>{job.title}</h4>
          <p>{job.company} — {job.location}</p>
          <button onClick={() => viewApplicants(job._id)}>View Applicants</button>

          {selectedJobId === job._id && (
            <div style={{ marginTop: 12 }}>
              <h5>Applicants:</h5>
              {applicants.length === 0 && <p>No applicants yet.</p>}
              {applicants.map((app) => (
                <div key={app._id} style={{ padding: 8, borderTop: "1px solid #eee" }}>
                  <p>{app.applicant?.name} — {app.applicant?.email}</p>
                  <p>Status: {app.status}</p>
                  {app.coverLetter && <p>Cover letter: {app.coverLetter}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default EmployerDashboard;
