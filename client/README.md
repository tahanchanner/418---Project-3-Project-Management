
# Frontend Documentation

## Overview

The frontend is built using React and communicates with the Express backend through HTTP requests.

It provides interfaces for user registration, login, project creation, project viewing, and project membership management.

## Technologies

- React
- JavaScript
- Vite
- CSS

## Installation

From the client directory, install dependencies:

```bash
npm install
```

## Start the Frontend

Run:

```bash
npm run dev
```

Vite will display a local development URL in the terminal.

Open that URL in your browser.

## Components

### App.jsx
Controls the login, signup, and project dashboard views.

### Login.jsx
Allows registered users to log in.

### Signup.jsx
Allows new users to create accounts.

### ProjectDashboard.jsx
Displays all projects and provides access to project creation and member management.

### CreateProject.jsx
Provides a form for entering project details and selecting a project lead.

### ManageMembers.jsx
Allows users to select a project, view its members, add registered users, and remove non-lead members.

### Message.jsx
Displays success and error messages.

## API Integration

The `api.js` helper provides functions for:

- GET requests
- POST requests
- DELETE requests

The frontend communicates with the backend at:

```text
http://localhost:5000
```

This can be changed using the `VITE_API_URL` environment variable.

## Styling

The `App.css` file contains the styling for authentication forms, the project dashboard, project cards, and member management.
