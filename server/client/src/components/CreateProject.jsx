
import { useEffect, useState } from "react";
import { getJSON, postJSON } from "../api.js";

const emptyForm = {
  name: "",
  description: "",
  status: "Planning",
  projectLeadId: "",
};

export default function CreateProject({ onCreated }) {
  const [form, setForm] = useState(emptyForm);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadUsers() {
      const result = await getJSON("/api/users");

      if (result.success) {
        setUsers(result.users);
      } else {
        setMessage({
          success: false,
          message: result.message,
        });
      }
    }

    loadUsers();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.description.trim() ||
      !form.projectLeadId
    ) {
      setMessage({
        success: false,
        message: "Please complete every project field.",
      });
      return;
    }

    setLoading(true);

    const result = await postJSON("/api/projects", form);

    setLoading(false);
    setMessage(result);

    if (result.success) {
      setForm(emptyForm);
      onCreated();
    }
  };

  return (
    <section className="panel">
      <h2>Create a Project</h2>

      <form onSubmit={handleSubmit}>
        <label>
          Project Name
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter project name"
          />
        </label>

        <label>
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the project"
            rows="4"
          />
        </label>

        <label>
          Status
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="Planning">Planning</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
          </select>
        </label>

        <label>
          Project Lead
          <select
            name="projectLeadId"
            value={form.projectLeadId}
            onChange={handleChange}
          >
            <option value="">Select a project lead</option>

            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.f_name} {user.l_name} (@{user.username})
              </option>
            ))}
          </select>
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Project"}
        </button>

        {message && (
          <p className={`message ${message.success ? "success" : "error"}`}>
            {message.message}
          </p>
        )}
      </form>
    </section>
  );
}
