
# Project Management Application

## Overview

This application is a full-stack project management system built using React, Node.js, Express, and MongoDB.

Users can create accounts, log in, create software projects, assign project leads, and manage project membership.

## Features

### User Authentication
- User registration
- User login
- Password hashing using bcrypt

### Project Management
- Create software projects
- Enter a project name and description
- Assign project statuses: Planning, Active, and Completed
- Select a registered user as the project lead
- View all created projects
- Display project lead information

### Project Membership
- Add registered users to projects
- View current project members
- Remove project members
- Automatically add project leads as project members
- Prevent duplicate memberships
- Prevent project leads from being removed

## Technologies Used

- React
- JavaScript
- Node.js
- Express.js
- MongoDB
- Mongoose
- bcryptjs
- CSS

## Project Structure

```text
icsi418-pa2/
├── README.md
├── server/
│   ├── README.md
│   ├── server.js
│   └── models/
│       ├── User.js
│       ├── Project.js
│       └── ProjectMembership.js
└── client/
    ├── README.md
    └── src/
        ├── App.jsx
        ├── App.css
        ├── api.js
        └── components/
            ├── Login.jsx
            ├── Signup.jsx
            ├── Message.jsx
            ├── CreateProject.jsx
            ├── ManageMembers.jsx
            └── ProjectDashboard.jsx
```

## Installation

Clone the repository:

```bash
git clone https://github.com/tahanchanner/icsi418-pa2.git
cd icsi418-pa2
```

Install backend dependencies:

```bash
cd server
npm install
```

Install frontend dependencies:

```bash
cd ../client
npm install
```

## Environment Variables

Create a `.env` file inside the server directory:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Do not commit your `.env` file.

## Running the Application

Start the backend in one terminal:

```bash
cd server
node server.js
```

Start the frontend in another terminal:

```bash
cd client
npm run dev
```

Open the local URL provided by Vite in your browser.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/signup | Register a user |
| POST | /api/login | Log in a user |
| GET | /api/users | Retrieve registered users |
| POST | /api/projects | Create a project |
| GET | /api/projects | Retrieve all projects |
| GET | /api/projects/:projectId/members | Retrieve project members |
| POST | /api/projects/:projectId/members | Add a project member |
| DELETE | /api/projects/:projectId/members/:userId | Remove a project member |

## Database Models

### User
Stores registered user information, including first name, last name, username, and hashed password.

### Project
Stores project name, description, status, and a reference to the project lead.

### ProjectMembership
Stores references connecting users to projects. This supports many-to-many relationships between users and projects.

## Author

Tahan Channer
