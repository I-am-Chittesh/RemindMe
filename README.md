# RemindMe

A progressive web application for task management and reminder notifications.

## Features

- Task Management: Create, edit, and delete tasks
- Push Notifications: Real-time notifications across desktop and mobile devices
- Calendar: Better task management

## TechStack

- Frontend: React 18, Vite, Tailwind CSS, Framer Motion
- Backend: Firebase (Authentication, Firestore, Cloud Functions)
- Notifications: Firebase Cloud Messaging (FCM)
- Hosting: Firebase Hosting

## Prerequisites

- Node.js 18 or higher
- Firebase CLI
- Firebase project with credentials

## Installation

```bash
git clone <https://github.com/I-am-Chittesh/RemindMe>
cd RemindMe

npm install
cd functions && npm install && cd ..
```

## Development

```bash
npm run dev
```

Starts development server at `http://localhost:5173`

## Production Build

```bash
npm run build
firebase deploy
```

Builds optimized production bundle and deploys to Firebase Hosting and Cloud Functions.

## Creator Notes
_Feel free to fork the repo and give pull requests for Open Source Contributions_
### Made by I-am-Chittesh

## License

MIT
