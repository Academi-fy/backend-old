# Academi-fy

Academi-fy is a comprehensive school management system built with JavaScript and MongoDB. It provides a robust and
scalable solution for managing courses, classes, and users within an educational institution.

## Features

- **Course Management**: Define and manage courses with associated members, classes, teachers, chats, and subjects.
- **Class Management**: Manage actual school classes, including a list of students, teachers, and associated courses.
- **User Management**: Handle users within the system, including both students and teachers.
- **Cache System**: Improve performance and reduce database load with a caching system that updates every 5 minutes.
- **Robust Error Handling**: Includes custom error classes for handling retrieval, database, and cache errors.

## Tech-Stack

- **Language**: JavaScript
- **Database**: MongoDB
- **ORM**: Mongoose
- **Cache**: Node-Cache

## Project Structure

The project is divided into several directories:

- `mongoDb/schemas/general`: Contains the MongoDB schemas for the different entities in the system.
- `httpServer/models/general`: Contains the models for the different entities, including methods for CRUD operations and
  cache management.
- `wiki/models/general`: Contains markdown files with detailed descriptions of the different entities.

## Setup

To set up the project, you need to have Node.js and MongoDB installed on your machine. Then, follow these steps:

1. Clone the repository.
2. Navigate to the project directory.
3. Run `npm install` to install the dependencies.
4. Start the MongoDB server.
5. Run `npm start` to start the application.

## Usage

The application provides a set of HTTP endpoints for interacting with the system. For example:

- `GET /api/classes`: Retrieve all classes.
- `GET /api/classes/:id`: Retrieve a class by its ID.
- `PUT /api/classes/<class>`: Create or update a class.
- `DELETE /api/classes/:id`: Delete a class.

For more details on the available endpoints and their usage, refer to the individual markdown files in
the `wiki/models/general` directory.

## Contributing

Contributions are currently not planned.

## License

This project is licensed under the terms of the MIT license.

<sub>© Copyright: Daniel Dopatka, Linus Bung (2023)</sub>
