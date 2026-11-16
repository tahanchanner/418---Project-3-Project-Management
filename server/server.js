
import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import User from "./models/User.js";
import Project from "./models/Project.js";
import ProjectMembership from "./models/ProjectMembership.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const isBlank = (value) =>
  typeof value !== "string" || value.trim() === "";

const validId = (id) => mongoose.Types.ObjectId.isValid(id);

const publicUser = (user) => ({
  _id: user._id,
  f_name: user.f_name,
  l_name: user.l_name,
  username: user.username,
});

// ---------------- SIGNUP ----------------

app.post("/api/signup", async (req, res) => {
  try {
    const { f_name, l_name, username, password } = req.body;

    if ([f_name, l_name, username, password].some(isBlank)) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const existing = await User.findOne({
      username: username.trim(),
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Username already exists.",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      f_name: f_name.trim(),
      l_name: l_name.trim(),
      username: username.trim(),
      password: hashed,
    });

    return res.status(201).json({
      success: true,
      message: `User "${user.username}" created successfully.`,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Username already exists.",
      });
    }

    console.error("Signup error:", err);

    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
});

// ---------------- LOGIN ----------------

app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (isBlank(username) || isBlank(password)) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required.",
      });
    }

    const user = await User.findOne({
      username: username.trim(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Username does not exist.",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Login successful. Welcome, ${user.f_name} ${user.l_name}!`,
      user: publicUser(user),
    });
  } catch (err) {
    console.error("Login error:", err);

    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
});

// ---------------- GET REGISTERED USERS ----------------

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find()
      .select("f_name l_name username")
      .sort({ username: 1 });

    return res.json({
      success: true,
      users,
    });
  } catch (err) {
    console.error("Get users error:", err);

    return res.status(500).json({
      success: false,
      message: "Could not retrieve users.",
    });
  }
});

// ---------------- CREATE PROJECT ----------------

app.post("/api/projects", async (req, res) => {
  try {
    const { name, description, status, projectLeadId } = req.body;

    if (
      isBlank(name) ||
      isBlank(description) ||
      isBlank(status) ||
      isBlank(projectLeadId)
    ) {
      return res.status(400).json({
        success: false,
        message: "All project fields are required.",
      });
    }

    if (!["Planning", "Active", "Completed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project status.",
      });
    }

    if (!validId(projectLeadId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project lead ID.",
      });
    }

    const lead = await User.findById(projectLeadId);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Selected project lead does not exist.",
      });
    }

    const project = await Project.create({
      name: name.trim(),
      description: description.trim(),
      status,
      projectLead: lead._id,
    });

    try {
      // Automatically add the project lead as a member.
      await ProjectMembership.create({
        project: project._id,
        user: lead._id,
      });
    } catch (membershipError) {
      await Project.findByIdAndDelete(project._id);
      throw membershipError;
    }

    const populatedProject = await Project.findById(project._id)
      .populate("projectLead", "f_name l_name username");

    return res.status(201).json({
      success: true,
      message: "Project created successfully.",
      project: populatedProject,
    });
  } catch (err) {
    console.error("Create project error:", err);

    return res.status(500).json({
      success: false,
      message: "Could not create project. Please try again.",
    });
  }
});

// ---------------- GET ALL PROJECTS ----------------

app.get("/api/projects", async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("projectLead", "f_name l_name username")
      .sort({ createdAt: -1 });

    const results = await Promise.all(
      projects.map(async (project) => {
        const memberCount = await ProjectMembership.countDocuments({
          project: project._id,
        });

        return {
          ...project.toObject(),
          memberCount,
        };
      })
    );

    return res.json({
      success: true,
      projects: results,
    });
  } catch (err) {
    console.error("Get projects error:", err);

    return res.status(500).json({
      success: false,
      message: "Could not retrieve projects.",
    });
  }
});

// ---------------- GET PROJECT MEMBERS ----------------

app.get("/api/projects/:projectId/members", async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!validId(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID.",
      });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    const memberships = await ProjectMembership.find({
      project: projectId,
    }).populate("user", "f_name l_name username");

    return res.json({
      success: true,
      members: memberships
        .filter((membership) => membership.user)
        .map((membership) => ({
          ...membership.user.toObject(),
          isLead:
            membership.user._id.toString() ===
            project.projectLead.toString(),
        })),
    });
  } catch (err) {
    console.error("Get members error:", err);

    return res.status(500).json({
      success: false,
      message: "Could not retrieve project members.",
    });
  }
});

// ---------------- ADD PROJECT MEMBER ----------------

app.post("/api/projects/:projectId/members", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userId } = req.body;

    if (!validId(projectId) || !validId(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project or user ID.",
      });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const existing = await ProjectMembership.findOne({
      project: projectId,
      user: userId,
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "This user is already a project member.",
      });
    }

    await ProjectMembership.create({
      project: projectId,
      user: userId,
    });

    return res.status(201).json({
      success: true,
      message: `${user.username} added to the project.`,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This user is already a project member.",
      });
    }

    console.error("Add member error:", err);

    return res.status(500).json({
      success: false,
      message: "Could not add project member.",
    });
  }
});

// ---------------- REMOVE PROJECT MEMBER ----------------

app.delete(
  "/api/projects/:projectId/members/:userId",
  async (req, res) => {
    try {
      const { projectId, userId } = req.params;

      if (!validId(projectId) || !validId(userId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid project or user ID.",
        });
      }

      const project = await Project.findById(projectId);

      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found.",
        });
      }

      if (project.projectLead.toString() === userId) {
        return res.status(400).json({
          success: false,
          message: "The project lead cannot be removed.",
        });
      }

      const membership = await ProjectMembership.findOneAndDelete({
        project: projectId,
        user: userId,
      });

      if (!membership) {
        return res.status(404).json({
          success: false,
          message: "Project membership not found.",
        });
      }

      return res.json({
        success: true,
        message: "Project member removed successfully.",
      });
    } catch (err) {
      console.error("Remove member error:", err);

      return res.status(500).json({
        success: false,
        message: "Could not remove project member.",
      });
    }
  }
);

// ---------------- DATABASE CONNECTION ----------------

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
