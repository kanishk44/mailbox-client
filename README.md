# Email Client Application

A modern email client application built with React, Node.js, Express, and MongoDB. This application provides a user-friendly interface for managing emails with features like composing, reading, and organizing messages.

## Features

- **Authentication System**
  - Secure login and registration
  - JWT-based authentication
  - Password hashing with bcrypt

- **Email Management**
  - Compose and send emails
  - View received and sent emails
  - Mark emails as read/unread
  - Delete emails
  - Real-time email updates with polling

- **User Interface**
  - Modern and responsive design with Tailwind CSS
  - Rich text editor for email composition
  - Organized folder structure (Inbox, Sent, etc.)
  - Unread email count indicators
  - Email list with sorting and filtering

## Tech Stack

- **Frontend**
  - React.js
  - Tailwind CSS
  - React Router
  - TinyMCE Rich Text Editor
  - date-fns for date formatting
  - Custom hooks for state management

- **Backend**
  - Node.js
  - Express.js
  - MongoDB
  - JWT for authentication
  - bcrypt for password hashing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mailbox-client
```

2. Install dependencies for both frontend and backend:
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

4. Start the development servers:
```bash
# Start backend server (from root directory)
npm run dev

# Start frontend server (from frontend directory)
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Project Structure

```
mailbox-client/
├── frontend/                 # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── App.jsx         # Main application component
│   │   └── main.jsx        # Entry point
│   └── package.json
├── backend/                 # Node.js backend
│   ├── controllers/        # Route controllers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── server.js         # Server entry point
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token

### Emails
- `GET /api/emails/received` - Get received emails
- `GET /api/emails/sent` - Get sent emails
- `POST /api/emails` - Send a new email
- `PUT /api/emails/:id/read` - Mark email as read
- `DELETE /api/emails/:id` - Delete an email
- `GET /api/emails/unread-counts` - Get unread email counts

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- React.js team for the amazing frontend framework
- MongoDB for the database solution
- Express.js team for the backend framework
- All contributors and maintainers 