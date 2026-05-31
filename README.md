# MERN Stack Event Feedback Management System

A full-stack application built with MongoDB, Express, React, and Node.js for managing events and collecting feedback from attendees.

## Project Structure

```
├── frontend/                 # React + TypeScript frontend
│   ├── public/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── index.html
│
├── backend/                  # Express + Node.js backend
│   ├── src/
│   │   ├── controllers/      # Route handlers
│   │   ├── models/           # MongoDB Schemas
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Express middleware
│   │   └── index.ts          # Main server file
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
└── package.json              # Root package.json for managing both apps
```

## Features

- **Event Management**: Create, read, update, and delete events
- **Feedback System**: Collect structured feedback from event attendees
- **Analytics**: View feedback analytics and ratings for events
- **Responsive UI**: Modern, responsive React frontend
- **RESTful API**: Clean and organized Express API

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite (Build tool)
- Axios (HTTP client)
- React Router

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication (ready to implement)
- CORS enabled for frontend communication

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas connection string)
- npm or yarn

### Installation & Running

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd feedback-management-system
   ```

2. **Install all dependencies** (root, frontend, and backend)
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**

   **Backend (.env)**
   ```bash
   cp backend/.env.example backend/.env
   ```
   Edit `backend/.env` with your MongoDB connection string and other settings:
   ```
   MONGODB_URI=mongodb://localhost:27017/event-feedback
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_here
   FRONTEND_URL=http://localhost:5173
   ```

   **Frontend (.env)**
   ```bash
   cp frontend/.env.example frontend/.env
   ```

4. **Run the entire application with a single command**
   ```bash
   npm run dev
   ```

   This will start both:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## Available Scripts

### From Root Directory

```bash
# Install all dependencies
npm run install-all

# Run both frontend and backend in development mode
npm run dev

# Run frontend only
npm run dev:frontend

# Run backend only
npm run dev:backend

# Build both frontend and backend
npm run build

# Start entire application (installs dependencies & runs dev)
npm start
```

### Frontend Commands

```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

### Backend Commands

```bash
cd backend

# Start development server (with auto-reload)
npm run dev

# Build TypeScript
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

## API Endpoints

### Events
- `GET /events` - Get all events
- `GET /events/:id` - Get event by ID
- `POST /events` - Create new event
- `PUT /events/:id` - Update event
- `DELETE /events/:id` - Delete event

### Feedback
- `POST /feedback` - Create feedback
- `GET /feedback/:eventId` - Get feedback for an event
- `GET /feedback/:eventId/analytics` - Get event analytics

## MongoDB Models

### Event
```typescript
{
  title: String,
  description: String,
  date: Date,
  location: String,
  capacity: Number,
  attendees: Number,
  status: String (upcoming, ongoing, completed, cancelled),
  createdBy: ObjectId,
  timestamps: true
}
```

### Feedback
```typescript
{
  eventId: ObjectId,
  userId: ObjectId,
  rating: Number (1-5),
  comment: String,
  categories: {
    organization: Number,
    content: Number,
    venue: Number,
    overall: Number
  },
  email: String,
  timestamps: true
}
```

### User
```typescript
{
  name: String,
  email: String,
  password: String,
  role: String (admin, organizer, attendee),
  timestamps: true
}
```

## Development Notes

- The frontend development server is configured to proxy API requests to the backend at `http://localhost:5000`
- CORS is enabled on the backend for the frontend URL
- Both applications use TypeScript for type safety
- Environment variables are managed with `dotenv`

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally or update `MONGODB_URI` in `.env`
- For MongoDB Atlas, use the connection string format: `mongodb+srv://username:password@cluster.mongodb.net/database`

### Port Already in Use
- Frontend default: 5173
- Backend default: 5000
- Change ports in respective `.env` or config files

### Dependencies Not Installing
```bash
# Clear npm cache
npm cache clean --force

# Reinstall all dependencies
npm run install-all
```

## Future Enhancements

- User authentication and authorization
- Email notifications for event updates
- Real-time feedback updates with WebSockets
- Advanced analytics and reporting
- Export feedback to CSV/PDF
- User profiles and personal event calendar
- Social sharing features

## License

MIT

## Support

For issues or questions, please open an issue in the repository.

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
