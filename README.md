# Sundar Inventory

Sundar Inventory is a full-stack inventory management application designed for tracking items and categories. It features a modern, role-based system built with a Node.js backend and a React frontend.

## Features

-   **Role-Based Access Control:** Differentiated permissions for Superadmin, Admin, and User roles.
-   **Authentication:** Secure user registration and login using JSON Web Tokens (JWT).
-   **Item Management:** Full CRUD (Create, Read, Update, Delete) functionality for inventory items.
-   **Category Management:** Organize items by creating, updating, and deleting categories.
-   **Image Uploads:** Supports uploading multiple images for each item, hosted on Cloudinary.
-   **User Administration:** Superadmins can manage all user accounts, including updating roles and deleting users.
-   **Dynamic UI:** A responsive interface built with React, TypeScript, and shadcn/ui, featuring a filterable item list and various dialogs for a smooth user experience.

## Tech Stack

-   **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, Cloudinary, Multer, Bcrypt.js
-   **Frontend:** React, TypeScript, Vite, Redux Toolkit (RTK Query), React Router, Tailwind CSS, shadcn/ui, Zod, React Hook Form

## Project Structure

The repository is a monorepo containing two main directories:

-   `backend/`: The Node.js/Express server that handles API logic, database interactions with MongoDB, and user authentication.
-   `frontend/`: The React client application that provides the user interface for interacting with the inventory system.

## Getting Started

Follow these instructions to get the project running on your local machine.

### Prerequisites

-   Node.js (v18 or higher)
-   npm (or a compatible package manager)
-   A MongoDB database instance
-   A Cloudinary account for image storage

### Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` directory and add the following environment variables:

    ```env
    # MongoDB connection string
    MONGO_URI=your_mongodb_connection_string

    # JWT configuration
    JWT_SECRET=your_strong_jwt_secret
    JWT_EXPIRES_IN=1d

    # Server port
    PORT=3001

    # Cloudinary credentials
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret

    # Superadmin seeder credentials
    SEED_SUPERADMIN_EMAIL=superadmin@example.com
    SEED_SUPERADMIN_PASSWORD=strongpassword
    SEED_SUPERADMIN_NAME=Super Admin
    ```

4.  To create the initial superadmin user specified in your `.env` file, run the seeder script:
    ```bash
    npm run seed:superadmin
    ```
5.  Start the backend development server:
    ```bash
    npm run dev
    ```
    The server will start on the port specified in your `.env` file (defaults to 3001).

### Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  The frontend is configured to connect to `http://localhost:3001/api`. If your backend is running on a different port, update the `baseUrl` in `frontend/src/redux/features/api.ts`.

4.  Start the frontend development server:
    ```bash
    npm run dev
    ```

The application will be accessible at `http://localhost:5173` (or another port specified by Vite).

## Roles and Permissions

The application implements a three-tiered role system to manage access to different features.

| Role         | Permissions                                                                                             |
| :----------- | :------------------------------------------------------------------------------------------------------ |
| **User**     | Can view all items and categories.                                                                      |
| **Admin**    | All User permissions, plus the ability to create and update items and categories.                         |
| **Superadmin** | All Admin permissions, plus the ability to delete items, delete categories, and manage all user accounts. |

## API Endpoints

The backend provides the following RESTful API endpoints, all prefixed with `/api`.

### Auth Routes (`/auth`)

-   `POST /register`: Register a new user.
-   `POST /login`: Log in to receive a JWT and user data.
-   `GET /me`: [Authenticated] Get the current authenticated user's profile.
-   `GET /users`: [Superadmin] Get a list of all users.
-   `PATCH /users/:userId/role`: [Superadmin] Update a user's role.
-   `DELETE /users/:userId`: [Superadmin] Delete a user account.

### Category Routes (`/categories`)

-   `GET /`: [Authenticated] Get all categories.
-   `POST /`: [Admin/Superadmin] Create a new category.
-   `GET /:slug/items`: [Authenticated] Get all items within a specific category.
-   `PUT /:slug`: [Admin/Superadmin] Update a category by its slug.
-   `DELETE /:slug`: [Superadmin] Delete a category by its slug.

### Item Routes (`/items`)

-   `GET /`: [Authenticated] Get all items.
-   `POST /`: [Admin/Superadmin] Create a new item (multipart/form-data for photo uploads).
-   `GET /:slug`: [Authenticated] Get a single item by its slug.
-   `PATCH /:slug`: [Admin/Superadmin] Update an item by its slug (multipart/form-data for photo uploads).
-   `DELETE /:slug`: [Superadmin] Delete an item by its slug.
