
import { useCallback, useEffect, useState } from "react";
import { getJSON } from "../api.js";
import CreateProject from "./CreateProject.jsx";
import ManageMembers from "./ManageMembers.jsx";

export default function ProjectDashboard({ user, onLogout }) {
  const [projects, setProjects] = useState([]);
  const [message, setMessage] = useState("");

  const loadProjects = useCallback(async () => {
    const result = await getJSON("/api/projects");

    if (result.success) {
      setProjects(result.projects);
      setMessage("");
    } else {
      setMessage(result.message);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Project Management</h1>
          <p>
            Welcome, {user.f_name} {user.l_name}
          </p>
        </div>

        <button className="logout-button" onClick={onLogout}>
          Log Out
        </button>
      </header>

      <section className="panel">
        <div className="section-heading">
          <h2>All Projects</h2>

          <button type="button" onClick={loadProjects}>
            Refresh
          </button>
        </div>

        {message && <p className="message error">{message}</p>}

        {projects.length === 0 ? (
          <p>No projects have been created yet.</p>
        ) : (
          <div className="project-grid">
            {projects.map((project) => (
              <article className="project-card" key={project._id}>
                <div className="project-card-heading">
                  <h3>{project.name}</h3>

                  <span className={`status ${project.status.toLowerCase()}`}>
                    {project.status}
                  </span>
                </div>

                <p>{project.description}</p>

                <div className="project-details">
                  <span>
                    <strong>Lead:</strong>{" "}
                    {project.projectLead
                      ? `${project.projectLead.f_name} ${project.projectLead.l_name}`
                      : "Unknown"}
                  </span>

                  <span>
                    <strong>Username:</strong>{" "}
                    {project.projectLead?.username || "Unknown"}
                  </span>

                  <span>
                    <strong>Members:</strong> {project.memberCount}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <div className="dashboard-grid">
        <CreateProject onCreated={loadProjects} />

        <ManageMembers
          projects={projects}
          onUpdated={loadProjects}
        />
      </div>
    </main>
  );
}
