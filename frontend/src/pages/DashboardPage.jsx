import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { api } from "../lib/api.js";

export default function DashboardPage() {
  const { user } = useAuth();
  const displayName = user?.name || "there";

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/tasks");
      setTasks(res.tasks || []);
    } catch (_) {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetchTasks();
    const id = setInterval(() => {
      if (active) fetchTasks();
    }, 30000); 
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [fetchTasks]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const inProgress = tasks.filter((t) => t.status === "in_progress").length;
    const done = tasks.filter((t) => t.status === "done").length;
    const nextDue = tasks
      .filter((t) => t.dueDate)
      .map((t) => new Date(t.dueDate))
      .sort((a, b) => a - b)[0];
    return {
      total,
      inProgress,
      done,
      nextDueText: nextDue ? nextDue.toLocaleDateString() : "—",
    };
  }, [tasks]);

  return (
    <div className="row g-3">
      <div className="col-12">
        <div className="card border-0 shadow-sm">
          <div className="card-body p-4">
            <h2 className="mb-2">Welcome, {displayName} 👋</h2>
            <p className="text-muted mb-0">
              Manage your tasks, track progress, and keep your profile up to
              date.
            </p>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-4">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body">
            <div className="d-flex align-items-center mb-2">
              <span className="badge bg-primary me-2">Quick</span>
              <h5 className="mb-0">Create Task</h5>
            </div>
            <p className="text-muted small mb-3">
              Jump straight to your task list to add a new item.
            </p>
            <Link to="/tasks" className="btn btn-primary btn-sm">
              Go to Tasks
            </Link>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-4">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body">
            <div className="d-flex align-items-center mb-2">
              <span className="badge bg-success me-2">Profile</span>
              <h5 className="mb-0">Update Details</h5>
            </div>
            <p className="text-muted small mb-3">
              Keep your name and account info current.
            </p>
            <Link to="/profile" className="btn btn-success btn-sm">
              Edit Profile
            </Link>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-4">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body">
            <div className="d-flex align-items-center mb-2">
              <span className="badge bg-secondary me-2">Tips</span>
              <h5 className="mb-0">Shortcuts</h5>
            </div>
            <ul className="text-muted small mb-0 ps-3">
              <li>Use the status dropdown to move tasks.</li>
              <li>Search by title to quickly find items.</li>
              <li>Use filters to focus on what's next.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="col-12">
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <h5 className="mb-3">Your overview</h5>
            <div className="row g-3">
              <div className="col-6 col-md-3">
                <div className="p-3 bg-light rounded">
                  <div className="text-muted small">Tasks</div>
                  <div className="fs-5">{loading ? "…" : stats.total}</div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-3 bg-light rounded">
                  <div className="text-muted small">In Progress</div>
                  <div className="fs-5">{loading ? "…" : stats.inProgress}</div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-3 bg-light rounded">
                  <div className="text-muted small">Done</div>
                  <div className="fs-5">{loading ? "…" : stats.done}</div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-3 bg-light rounded">
                  <div className="text-muted small">Next Due</div>
                  <div className="fs-5">
                    {loading ? "…" : stats.nextDueText}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
