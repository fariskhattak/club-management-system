-- Clubs Table
CREATE TABLE Clubs (
    club_id INTEGER PRIMARY KEY AUTOINCREMENT,
    club_name TEXT NOT NULL UNIQUE,
    club_description TEXT,
    founded_date DATE,
    contact_email TEXT NOT NULL,
    faculty_advisor TEXT
);

-- Students Table
CREATE TABLE Students (
    student_id TEXT PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone_number TEXT,
    major TEXT,
    graduation_year INTEGER CHECK(graduation_year BETWEEN 2000 AND 2100)
);

-- Roles Table
CREATE TABLE Roles (
    role_id INTEGER PRIMARY KEY AUTOINCREMENT,
    role_name TEXT NOT NULL UNIQUE,
    role_description TEXT
);

-- Club Roles Junction Table
CREATE TABLE ClubRoles (
    club_role_id INTEGER PRIMARY KEY AUTOINCREMENT,
    club_id INTEGER NOT NULL,
    student_id TEXT NOT NULL,
    role_id INTEGER NOT NULL,
    FOREIGN KEY (club_id) REFERENCES Clubs (club_id),
    FOREIGN KEY (student_id) REFERENCES Students (student_id),
    FOREIGN KEY (role_id) REFERENCES Roles (role_id),
    UNIQUE (club_id, student_id, role_id)
);

-- Events Table
CREATE TABLE Events (
    event_id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_name TEXT NOT NULL,
    event_description TEXT,
    event_date DATE NOT NULL,
    event_time TIME,
    location TEXT NOT NULL,
    club_id INTEGER NOT NULL,
    FOREIGN KEY (club_id) REFERENCES Clubs (club_id)
);

-- Event Attendance Table
CREATE TABLE EventAttendance (
    attendance_id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL,
    student_id TEXT NOT NULL,
    attendance_status TEXT CHECK(attendance_status IN ('Present', 'Absent', 'Excused')),
    check_in_time TIME,
    FOREIGN KEY (event_id) REFERENCES Events (event_id),
    FOREIGN KEY (student_id) REFERENCES Students (student_id),
    UNIQUE (event_id, student_id)
);

-- Membership Junction Table
CREATE TABLE Membership (
    membership_id INTEGER PRIMARY KEY AUTOINCREMENT,
    club_id INTEGER NOT NULL,
    student_id TEXT NOT NULL,
    active_status TEXT CHECK(active_status IN ('Active', 'Inactive', 'Pending')), -- Standardize membership statuses
    FOREIGN KEY (club_id) REFERENCES Clubs (club_id),
    FOREIGN KEY (student_id) REFERENCES Students (student_id),
    UNIQUE (club_id, student_id)
);

-- Budget Table
CREATE TABLE Budget (
    budget_id INTEGER PRIMARY KEY AUTOINCREMENT,
    club_id INTEGER NOT NULL,
    fiscal_year INTEGER NOT NULL,
    total_budget REAL NOT NULL CHECK(total_budget >= 0),
    FOREIGN KEY (club_id) REFERENCES Clubs (club_id),
    UNIQUE (club_id, fiscal_year)
);

-- Expenses Table
CREATE TABLE Expenses ( 
    expense_id INTEGER PRIMARY KEY AUTOINCREMENT,
    club_id INTEGER NOT NULL,
    budget_id INTEGER NOT NULL,
    expense_name TEXT NOT NULL,
    expense_date DATE NOT NULL,
    expense_amount REAL NOT NULL CHECK(expense_amount >= 0),
    description TEXT, -- Made optional
    category TEXT CHECK(category IN ('Event', 'Supplies', 'Travel', 'Food', 'Other')),
    FOREIGN KEY (club_id) REFERENCES Clubs (club_id),
    FOREIGN KEY (budget_id) REFERENCES Budget (budget_id)
);

-- Sponsors Table
CREATE TABLE Sponsors (
    sponsor_id INTEGER PRIMARY KEY AUTOINCREMENT,
    sponsor_name TEXT NOT NULL UNIQUE,
    contact_person TEXT,
    contact_email TEXT,
    phone_number TEXT,
    address TEXT
);

-- Sponsorship Contribution Junction Table
CREATE TABLE SponsorshipContribution (
    sponsorship_id INTEGER PRIMARY KEY AUTOINCREMENT,
    sponsor_id INTEGER NOT NULL,
    club_id INTEGER NOT NULL,
    contribution_amount REAL NOT NULL CHECK(contribution_amount >= 0),
    contribution_date DATE,
    FOREIGN KEY (sponsor_id) REFERENCES Sponsors (sponsor_id),
    FOREIGN KEY (club_id) REFERENCES Clubs (club_id),
    UNIQUE (sponsor_id, club_id, contribution_date)
);

-- Event Hosting Junction Table
CREATE TABLE EventHosting (
    hosting_id INTEGER PRIMARY KEY AUTOINCREMENT,
    club_id INTEGER NOT NULL,
    event_id INTEGER NOT NULL,
    hosting_status TEXT CHECK(hosting_status IN ('Lead', 'Support')),
    FOREIGN KEY (club_id) REFERENCES Clubs (club_id),
    FOREIGN KEY (event_id) REFERENCES Events (event_id),
    UNIQUE (club_id, event_id)
);
