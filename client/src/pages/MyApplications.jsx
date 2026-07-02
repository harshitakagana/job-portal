import { useEffect, useState } from "react";
import api from "../api/axios";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get("/applications/my");
        setApplications(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load applications");
      }
    };
    fetchApplications();
  }, []);

  return (
    <div style={{ maxWidth: 700, margin: "50px auto" }}>
      <h2>My Applications</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {applications.length === 0 && !error && <p>You haven't applied to any jobs yet.</p>}
      {applications.map((app) => (
        <div
          key={app._id}
          style={{ border: "1px solid #ccc", padding: 16, marginBottom: 12, borderRadius: 8 }}
        >
          <h3>{app.job?.title}</h3>
          <p><strong>{app.job?.company}</strong> — {app.job?.location}</p>
          <p>Status: <strong>{app.status}</strong></p>
          {app.coverLetter && <p>Cover letter: {app.coverLetter}</p>}
        </div>
      ))}
    </div>
  );
}

export default MyApplications;
