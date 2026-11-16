
# Backend Documentation

## Overview

The backend is built using Node.js, Express.js, and MongoDB. It handles user authentication, project creation, project retrieval, and project membership management.

## Technologies

- Node.js
- Express.js
- MongoDB
- Mongoose
- bcryptjs
- dotenv
- CORS

## Installation

From the server directory, install dependencies:

```bash
npm install
```

## Environment Configuration

Create a `.env` file in the server directory:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

## Start the Server

Run:

```bash
node server.js
```

The server connects to MongoDB and runs on:

```text
http://localhost:5000
```

## API Routes

### Authentication

- `POST /api/signup` — Creates a registered user.
- `POST /api/login` — Authenticates an existing user.

### Users

- `GET /api/users` — Retrieves registered users for project lead and member selection.

### Projects

- `POST /api/projects` — Creates a project.
- `GET /api/projects` — Retrieves all projects and their project lead information.

### Project Membership

- `GET /api/projects/:projectId/members` — Retrieves members of a selected project.
- `POST /api/projects/:projectId/members` — Adds a registered user to a project.
- `DELETE /api/projects/:projectId/members/:userId` — Removes a member from a project.

## Database Models

### User.js
Defines the existing registered user collection.

### Project.js
Defines the project collection, including its name, description, status, and project lead reference.

### ProjectMembership.js
Defines the many-to-many relationship between projects and users using MongoDB ObjectId references.

The compound unique index on project and user prevents duplicate memberships.

## Validation

The backend validates required project fields, project status, user IDs, project IDs, and registered users.

It also prevents duplicate project memberships and prevents project leads from being removed.
