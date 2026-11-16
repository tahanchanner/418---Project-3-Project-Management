
import { useEffect, useState } from "react";
import { getJSON, postJSON, deleteJSON } from "../api.js";

export default function ManageMembers({ projects, onUpdated }) {
  const [projectId, setProjectId] = useState("");
  const [members, setMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  async function loadMembers(id) {
    if (!id) {
      setMembers([]);
      return;
    }

    const result = await getJSON(`/api/projects/${id}/members`);

    if (result.success) {
      setMembers(result.members);
    } else {
      setMessage({
        success: false,
        message: result.message,
      });
    }
  }

  useEffect(() => {
    async function loadUsers() {
      const result = await getJSON("/api/users");

      if (result.success) {
        setUsers(result.users);
      }
    }

    loadUsers();
  }, []);

  useEffect(() => {
    loadMembers(projectId);
  }, [projectId]);

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!projectId || !userId) {
      setMessage({
        success: false,
        message: "Select a project and user.",
      });
      return;
    }

    setLoading(true);

    const result = await postJSON(
      `/api/projects/${projectId}/members`,
      { userId }
    );

    setLoading(false);
    setMessage(result);

    if (result.success) {
      setUserId("");
      await loadMembers(projectId);
      onUpdated();
    }
  };

  const handleRemove = async (memberId) => {
    setLoading(true);

    const result = await deleteJSON(
      `/api/projects/${projectId}/members/${memberId}`
    );

    setLoading(false);
    setMessage(result);

    if (result.success) {
      await loadMembers(projectId);
      onUpdated();
    }
  };

  return (
    <section className="panel">
      <h2>Manage Project Members</h2>

      <label>
        Select Project
        <select
          value={projectId}
          onChange={(e) => {
            setProjectId(e.target.value);
            setMessage(null);
          }}
        >
          <option value="">Choose a project</option>

          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </select>
      </label>

      {projectId && (
        <>
          <form onSubmit={handleAdd}>
            <label>
              Add Registered User
              <select
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              >
                <option value="">Select a user</option>

                {users
                  .filter(
                    (user) =>
                      !members.some(
                        (member) => member._id === user._id
                      )
                  )
                  .map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.f_name} {user.l_name} (@{user.username})
                    </option>
                  ))}
              </select>
            </label>

            <button type="submit" disabled={loading}>
              Add Member
            </button>
          </form>

          <h3>Current Members ({members.length})</h3>

          {members.length === 0 ? (
            <p>No members found.</p>
          ) : (
            <ul className="member-list">
              {members.map((member) => (
                <li key={member._id}>
                  <div>
                    <strong>
                      {member.f_name} {member.l_name}
                    </strong>

                    <small>@{member.username}</small>

                    {member.isLead && (
                      <span className="lead-tag">
                        Project Lead
                      </span>
                    )}
                  </div>

                  {!member.isLead && (
                    <button
                      type="button"
                      className="remove-button"
                      disabled={loading}
                      onClick={() => handleRemove(member._id)}
                    >
                      Remove
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {message && (
        <p className={`message ${message.success ? "success" : "error"}`}>
          {message.message}
        </p>
      )}
    </section>
  );
}
