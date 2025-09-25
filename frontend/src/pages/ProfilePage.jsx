import { useEffect, useState } from "react";
import { api } from "../lib/api.js";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    api.get("/profile").then((res) => {
      setUser(res.user);
      setName(res.user.name);
    });
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setStatus("");
    const res = await api.put("/profile", { name });
    setUser(res.user);
    setStatus("Saved");
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="row">
      <div className="col-12 col-md-8 col-lg-6">
        <h2 className="mb-3">Profile</h2>
        <form onSubmit={save}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input className="form-control" value={user.email} disabled />
          </div>
          <button className="btn btn-primary">Save</button>
          {status && <span className="ms-3 text-success">{status}</span>}
        </form>
      </div>
    </div>
  );
}
