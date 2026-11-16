
import mongoose from "mongoose";

const projectMembershipSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate memberships.
projectMembershipSchema.index(
  { project: 1, user: 1 },
  { unique: true }
);

export default mongoose.models.ProjectMembership ||
  mongoose.model("ProjectMembership", projectMembershipSchema);
