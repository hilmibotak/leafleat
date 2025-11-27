# LeafletJS Frontend and Backend with Database

This project consists of a frontend using LeafletJS for interactive maps and a backend with Node.js, Express, and MongoDB for storing geographic data.

## Setup

### Backend
1. Navigate to the `backend` directory.
2. Run `npm install` to install dependencies.
3. Ensure MongoDB is running on your system (default: localhost:27017).
4. Run `npm start` to start the server on port 3000.

### Frontend
1. Open `frontend/index.html` in a web browser or serve it with a local server.
2. The map will load and fetch locations from the backend.

## Features
- Display interactive map with OpenStreetMap tiles.
- Click on the map to add new locations (prompts for name and description).
- Locations are stored in MongoDB and displayed as markers.

## API Endpoints
- GET /api/locations: Retrieve all locations.
- POST /api/locations: Add a new location (body: {name, description, lat, lng}).
- DELETE /api/locations/:id: Delete a location by ID.