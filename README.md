# RemindMe

A progressive web application for task management and reminder notifications.

## Features

- Task Management: Create, edit, and delete tasks
- Push Notifications: Real-time notifications across desktop and mobile devices
- Authentication: Google Sign-In with role-based access control
- Offline Support: Progressive Web App with service worker caching
- Dark Mode: System theme detection with manual toggle
- Real-time Synchronization: Cloud-based data persistence with Firestore

## Technology Stack

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
git clone <repository-url>
cd RemindMe

npm install
cd functions && npm install && cd ..
```

## Configuration

Create a `.env` file in the project root:

```
VITE_FIREBASE_API_KEY=<your_api_key>
VITE_FIREBASE_AUTH_DOMAIN=<your_auth_domain>
VITE_FIREBASE_PROJECT_ID=<your_project_id>
VITE_FIREBASE_STORAGE_BUCKET=<your_storage_bucket>
VITE_FIREBASE_MESSAGING_SENDER_ID=<your_sender_id>
VITE_FIREBASE_APP_ID=<your_app_id>
VITE_FIREBASE_VAPID_KEY=<your_vapid_key>
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

## License

MIT
