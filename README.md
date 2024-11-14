# CSC 4402 Database Project

## Club Management System

### Team Members
- Faris Khattak
- Michelle Vo
- Milan Nguyen
- Austin Cao

## Project Overview
The **College Club Management System** is designed to manage and organize data related to student clubs and organizations on campus. The system includes detailed information on clubs, members, events, roles, budgets, and sponsors.

### Database Components
- **Clubs**: Contains details on various clubs and organizations on campus.
- **Members**: Stores student membership data, linking students to their respective clubs.
- **Events**: Records club events with dates, locations, and descriptions.
- **Event Attendance**: Tracks student attendance at events, linking events and members.
- **Roles**: Defines club member roles (e.g., President, Treasurer) and links them to members.
- **Budget**: Manages financial records and budget allocations for each club.
- **Sponsors**: Lists sponsors supporting each club, linked to clubs and budgets.

## Backend Setup

The backend is built using **Flask** (Python) and handles the server-side logic, including API endpoints and database management.

### Prerequisites

- Python 3.x installed
- SQLite (for local database)
- `pip` package manager

### Installation

1. **Clone the Repository:**
   ```bash
   git clone <repository_url>
   cd CLUB-MANAGEMENT-SYSTEM/backend
   ```

2. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Database Setup:**
   - The `schema.sql` file contains the database schema.
   - Run the following command to set up the SQLite database:
     ```bash
     sqlite3 database.db < schema.sql
     ```

4. **Configuration:**
   - Configure your settings in `config.py` as needed (e.g., database URI).

5. **Run the Backend Server:**
   ```bash
   python app.py
   ```
   - The backend will start on `http://localhost:5001`.

## Frontend Setup

The frontend is built using **React** and provides a user interface for interacting with the backend API.

### Prerequisites

- Node.js installed
- `npm` package manager

### Installation

1. **Navigate to Frontend Directory:**
   ```bash
   cd ../frontend
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Run the Frontend Server:**
   ```bash
   npm start
   ```
   - The frontend will start on `http://localhost:3000`.

### Notes

- Ensure the backend server is running before starting the frontend to prevent CORS issues.
- The React app will make API requests to `http://localhost:5000`.