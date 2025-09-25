import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api.js";
import { useAuth } from "../auth/AuthContext.jsx";

export default function SignupPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setErrors([]);
    setLoading(true);
    try {
      const res = await api.post("/auth/signup", form);
      login(res.token, res.user);
      navigate("/dashboard");
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors?.length) {
        setErrors(data.errors.map((e) => e.msg));
      }
      setError(data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-6 col-lg-5">
        <h2 className="mb-3">Create Account</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {errors.length > 0 && (
          <div className="alert alert-warning">
            <ul className="mb-0">
              {errors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        )}
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              minLength={2}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>
          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Creating..." : "Sign Up"}
          </button>
          <Link className="btn btn-link" to="/login">
            Already have an account?
          </Link>
        </form>
      </div>
    </div>
  );
}
