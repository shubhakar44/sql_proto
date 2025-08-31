# MySQL Query API

This project is a simple API that connects to a MySQL database and exposes endpoints for executing queries. It is built using Node.js and Express.

## Project Structure

```
mysql-query-api
├── src
│   ├── app.js               # Entry point of the application
│   ├── db.js                # Database connection setup
│   ├── routes
│   │   └── query.js         # API routes for executing queries
│   └── controllers
│       └── queryController.js # Controller for handling query logic
├── package.json             # npm configuration file
└── README.md                # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd mysql-query-api
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Configure the database connection:**
   Update the database connection details in `src/db.js` to match your MySQL server configuration.

4. **Run the application:**
   ```
   npm start
   ```

## API Usage

### Execute Query

- **Endpoint:** `POST /api/query`
- **Request Body:**
  ```json
  {
    "query": "SELECT * FROM your_table"
  }
  ```
- **Response:**
  - On success:
    ```json
    {
      "data": [ ... ]
    }
    ```
  - On error:
    ```json
    {
      "error": "Error message"
    }
    ```

## License

This project is licensed under the MIT License.