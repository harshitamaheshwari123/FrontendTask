import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api.js";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [filters, setFilters] = useState({ q: "", status: "" });
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get("/tasks", {
        q: filters.q || undefined,
        status: filters.status || undefined,
      });
      setTasks(res.tasks);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const createTask = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const res = await api.post("/tasks", form);
    setTasks((t) => [res.task, ...t]);
    setForm({ title: "", description: "" });
  };

  const updateTask = async (id, updates) => {
    const res = await api.put(`/tasks/${id}`, updates);
    setTasks((prev) => prev.map((t) => (t._id === id ? res.task : t)));
  };

  const deleteTask = async (id) => {
    await api.del(`/tasks/${id}`);
    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  const visibleTasks = useMemo(() => tasks, [tasks]);

  return (
    <div>
      <h2 className="mb-3">Tasks</h2>

      <div className="card mb-4">
        <div className="card-body">
          <form className="row g-2" onSubmit={createTask}>
            <div className="col-12 col-md-4">
              <input
                className="form-control"
                placeholder="Task title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div className="col-12 col-md-5">
              <input
                className="form-control"
                placeholder="Description (optional)"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
            <div className="col-12 col-md-3 d-grid">
              <button className="btn btn-primary">Add Task</button>
            </div>
          </form>
        </div>
      </div>

      <div className="row g-2 mb-3">
        <div className="col-12 col-md-6">
          <input
            className="form-control"
            placeholder="Search by title"
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
          />
        </div>
        <div className="col-12 col-md-4">
          <select
            className="form-select"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All statuses</option>
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div className="col-12 col-md-2 d-grid">
          <button className="btn btn-outline-secondary" onClick={fetchTasks}>
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      <ul className="list-group">
        {visibleTasks.map((task) => (
          <li key={task._id} className="list-group-item">
            <div className="d-flex align-items-center">
              <div className="me-3">
                <select
                  className="form-select form-select-sm"
                  value={task.status}
                  onChange={(e) =>
                    updateTask(task._id, { status: e.target.value })
                  }
                >
                  <option value="todo">Todo</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div className="flex-grow-1">
                <div className="fw-semibold">{task.title}</div>
                {task.description && (
                  <div className="text-muted small">{task.description}</div>
                )}
              </div>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => deleteTask(task._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
        {visibleTasks.length === 0 && (
          <li className="list-group-item text-center text-muted">
            No tasks found
          </li>
        )}
      </ul>
    </div>
  );
}
