# CSC 4402 Database Project

## Club Management System

### Team Members
- Faris Khattak
- Michelle Vo
- Milan Nguyen
- Austin Cao

## Project Overview
The **College Club Management System** is designed to manage and organize data related to student clubs and organizations on campus. The system includes detailed information on clubs, members, events, roles, budgets, expenses, and sponsors.

### Database Components
- **Clubs**: Contains details on various clubs and organizations on campus.
- **Members**: Stores student membership data, linking students to their respective clubs.
- **Events**: Records club events with dates, locations, and descriptions.
- **Event Attendance**: Tracks student attendance at events, linking events and members.
- **Roles**: Defines club member roles (e.g., President, Treasurer) and links them to members.
- **Budget**: Manages financial records and budget allocations for each club.
- **Expenses**: Tracks expenditures for clubs, linking them to budgets and events.
- **Sponsors**: Lists sponsors supporting each club, linked to clubs and budgets.

## Project Hosting

The project is currently being hosted on Render, with the website [https://club-management-system-frontend.onrender.com](https://club-management-system-frontend.onrender.com), for the foreseeable future.
If the project becomes unavailable at that link, look to [Backend Setup](#Backend-Setup) and [Frontend Setup](#Frontend-Setup) sections for hosting locally.

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
   cd club-management-system/backend
   ```

2. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Database Setup:**
   - The `schema.sql` file contains the database schema.
   - Run the following command to set up the SQLite database:
     ```bash
     # If you are already in /backend
     cd instance
     sqlite3 database.db < schema.sql
     ```
   - **Note**: The database will automatically be set up with seed data when starting up the backend if this step is skipped

4. **Configuration:**
   - Configure your settings in `config.py` as needed (e.g., database URI).

5. **Run the Backend Server:**
   ```bash
   python run.py
   ```
   - The backend will start on `http://localhost:5001`.

6. **Test Queries:**
   - Test queries are located in `/tests/test_queries.sql`.
   - There are 5 queries designed to interact with the database in different ways.

## Frontend Setup

The frontend is built using **Next.js** with TypeScript, providing a server-rendered React framework for improved performance and SEO.

### Prerequisites

- Node.js installed
- `npm` or `yarn` package manager

### Installation

1. **Navigate to Frontend Directory:**
   ```bash
   cd ../frontend
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```
   *or if using yarn:*
   ```bash
   yarn install
   ```

3. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   *or if using yarn:*
   ```bash
   yarn dev
   ```
   - The frontend will start on `http://localhost:3000`.

4. **Build for Production:**
   To build the app for production:
   ```bash
   npm run build
   npm start
   ```
   - This will start the production server on `http://localhost:3000`.

### Environment Configuration

1. Create a `.env.local` file in the `frontend` directory to configure environment variables.
2. Add the following line to the file:

   ```env
   REACT_APP_API_URL=http://localhost:5001/api
   ```

   - This URL points to the backend server for API requests.
   - Ensure the backend server is running before starting the frontend.

3. The `.env.local` file should not be committed to version control. Add it to `.gitignore` if it’s not already ignored.

### TypeScript Notes

- This project uses TypeScript for type safety. Type definitions can be found in the `types` directory.
- To check for TypeScript errors, run:
  ```bash
  npm run type-check
  ```

### Folder Structure

The frontend follows the typical Next.js project structure:
- `pages/`: Contains all the Next.js pages.
- `components/`: Reusable UI components.
- `styles/`: CSS and styling files.
- `types/`: TypeScript type definitions.
- `public/`: Static assets like images.

### Additional Features

- **Server-Side Rendering (SSR)** for better SEO and initial load performance.
- **API Routes** in Next.js for lightweight server-side logic if needed.
- **Environment Variables** are configured in `.env.local`.
