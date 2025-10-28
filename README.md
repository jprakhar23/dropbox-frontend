# Dropbox Clone - Frontend

React frontend for file storage application with responsive design and component-based architecture.

## Here's the demo
[Deployed app](https://tranquil-kleicha-7cc256.netlify.app/)
 - Site got taken down 3 times by netlify, don't know what's the issue :/

## Features

- File upload with drag-and-drop interface
- File list with preview capabilities (txt, json, images, pdf)
- Download and delete operations
- Responsive design with Tailwind CSS
- Modular component library

## Tech Stack

- React 18 with Create React App
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/dropbox-clone-frontend.git
cd dropbox-clone-frontend

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# Development
REACT_APP_API_URL=http://localhost:5000/api

# Production
REACT_APP_API_URL=https://your-backend-api.com/api
```

## Installation

```bash
# Clone and install
git clone <repository-url>
cd dropbox-frontend
npm install

# Configure environment
cp .env.example .env

# Start development server
npm start
```

## 🚀 Deployment

### Development
```bash
npm start
```

### Production Build
```bash
npm run build
```

### Deploy to Netlify/Vercel
```bash
# Build the project
npm run build

# Deploy the build folder to your hosting service
```

## Project Structure

```
src/
├── components/ui/          # Reusable UI components
├── pages/                  # Main page components
├── services/api.js         # Backend API integration
├── App.js                  # Main app with routing
└── index.js               # React entry point
```

## Environment Variables

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Available Scripts

- `npm start` - Development server
- `npm run build` - Production build

App runs on `http://localhost:3000`
