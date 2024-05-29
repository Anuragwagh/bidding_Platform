# Real-Time Bidding Platform

This project is a comprehensive RESTful API for a real-time bidding platform built using Node.js, Express, Socket.io, and PostgreSQL. The API supports advanced CRUD operations, user authentication, role-based access control, real-time bidding, and notifications.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Setup](#setup)
  - [Database Setup](#database-setup)
  - [Run the Server](#run-the-server)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [WebSocket Events](#websocket-events)
- [Usage](#usage)
- [Bonus](#bonus)
- [Deliverables](#deliverables)

## Features

- User registration and authentication
- Role-based access control
- Real-time bidding with WebSocket notifications
- Image upload for auction items
- Pagination, search, and filtering for auction items
- Notification system for bid updates and auction status

## Requirements

- Node.js (v14 or later)
- PostgreSQL
- npm (v6 or later)

## Setup

### Database Setup

1. **Create the PostgreSQL database:**

    ```sql
    CREATE DATABASE bidding_platform;
    ```

2. **Create the necessary tables:**

    Save the following SQL script in a file named `schema.sql`:

    ```sql
    -- schema.sql

    -- users table
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        role VARCHAR(10) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- items table
    CREATE TABLE items (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        starting_price DECIMAL(10, 2) NOT NULL,
        current_price DECIMAL(10, 2) DEFAULT NULL,
        image_url VARCHAR(255) NULL,
        end_time TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- bids table
    CREATE TABLE bids (
        id SERIAL PRIMARY KEY,
        item_id INTEGER REFERENCES items(id),
        user_id INTEGER REFERENCES users(id),
        bid_amount DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- notifications table
    CREATE TABLE notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        message VARCHAR(255) NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ```

3. **Apply the database schema:**

    ```bash
    psql -U your_db_user -d bidding_platform -f schema.sql
    ```

### Run the Server

1. **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd bidding-platform
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Create a `.env` file in the root directory and add your database and server configuration:**

    ```plaintext
    DB_USER=your_db_user
    DB_HOST=your_db_host
    DB_NAME=your_db_name
    DB_PASSWORD=your_db_password
    DB_PORT=your_db_port
    PORT=3000
    ```

4. **Create the `server.js` file in the root directory with the following content:**

    ```javascript
    // server.js

    const express = require('express');
    const bodyParser = require('body-parser');
    const { Pool } = require('pg');
    const http = require('http');
    const socketIo = require('socket.io');
    const dotenv = require('dotenv');

    // Load environment variables
    dotenv.config();

    const app = express();
    const server = http.createServer(app);
    const io = socketIo(server);

    // PostgreSQL pool setup
    const pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });

    app.use(bodyParser.json());

    // Simple route to test the server
    app.get('/', (req, res) => {
      res.send('Hello, World!');
    });

    // Start the server
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    io.on('connection', (socket) => {
      console.log('New client connected');

      // Handle bidding events
      socket.on('bid', (data) => {
        console.log('Bid received:', data);
        // Broadcast the new bid to all clients
        io.emit('update', data);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });
    ```

5. **Start the server:**

    ```bash
    npm start
    ```

6. **Open your browser and navigate to `http://localhost:3000` to see the "Hello, World!" message.**

## Database Schema

- **users table:**

    ```sql
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        role VARCHAR(10) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ```

- **items table:**

    ```sql
    CREATE TABLE items (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        starting_price DECIMAL(10, 2) NOT NULL,
        current_price DECIMAL(10, 2) DEFAULT NULL,
        image_url VARCHAR(255) NULL,
        end_time TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ```

- **bids table:**

    ```sql
    CREATE TABLE bids (
        id SERIAL PRIMARY KEY,
        item_id INTEGER REFERENCES items(id),
        user_id INTEGER REFERENCES users(id),
        bid_amount DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ```

- **notifications table:**

    ```sql
    CREATE TABLE notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        message VARCHAR(255) NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ```

## API Endpoints

- **Users:**
  - `POST /users/register` - Register a new user.
  - `POST /users/login` - Authenticate a user and return a token.
  - `GET /users/profile` - Get the profile of the logged-in user.

- **Items:**
  - `GET /items` - Retrieve all auction items (with pagination).
  - `GET /items/:id` - Retrieve a single auction item by ID.
  - `POST /items` - Create a new auction item. (Authenticated users, image upload)
  - `PUT /items/:id` - Update an auction item by ID. (Authenticated users, only item owners or admins)
  - `DELETE /items/:id` - Delete an auction item by ID. (Authenticated users, only item owners or admins)

- **Bids:**
  - `GET /items/:itemId/bids` - Retrieve all bids for a specific item.
  - `POST /items/:itemId/bids` - Place a new bid on a specific item. (Authenticated users)

- **Notifications:**
  - `GET /notifications` - Retrieve notifications for the logged-in user.
  - `POST /notifications/mark-read` - Mark notifications as read.

## WebSocket Events

- **Bidding:**
  - `connection` - Establish a new WebSocket connection.
  - `bid` - Place a new bid on an item.
  - `update` - Notify all connected clients about a new bid on an item.

- **Notifications:**
  - `notify` - Send notifications to users in real-time.

## Usage

- **Authentication and Authorization:**
  - Use JWT (JSON Web Tokens) for authentication.
  - Implement role-based access control to restrict access to certain endpoints based on user roles.
  - Protect the POST, PUT, and DELETE endpoints appropriately.

- **Image Upload:**
  - Implement image upload functionality for auction items using a library like `multer`.
  - Store image URLs in the database.

- **Search and Filtering:**
  - Implement search functionality for auction items.
  - Allow filtering items by status (e.g., active, ended).

- **Pagination:**
  - Implement pagination for the `GET /items` endpoint.
