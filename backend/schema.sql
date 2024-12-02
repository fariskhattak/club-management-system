-- Clubs Table
CREATE TABLE Clubs (
    club_id INTEGER PRIMARY KEY AUTOINCREMENT,
    club_name TEXT NOT NULL,
    club_description TEXT,
    founded_date DATE,
    contact_email TEXT,
    faculty_advisor TEXT
);

-- Members Table
CREATE TABLE Students (
    student_id TEXT PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone_number TEXT,
    major TEXT,
    graduation_year INTEGER
);

-- Roles Table
CREATE TABLE Roles (
    role_id INTEGER PRIMARY KEY AUTOINCREMENT,
    role_name TEXT NOT NULL,
    role_description TEXT
);

-- Club Roles Junction Table
CREATE TABLE ClubRoles (
    club_role_id INTEGER PRIMARY KEY AUTOINCREMENT,
    club_id INTEGER NOT NULL,
    member_id INTEGER NOT NULL,
    role_id INTEGER NOT NULL,
    FOREIGN KEY (club_id) REFERENCES Clubs (club_id),
    FOREIGN KEY (member_id) REFERENCES Members (member_id),
    FOREIGN KEY (role_id) REFERENCES Roles (role_id)
);

-- Events Table
CREATE TABLE Events (
    event_id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_name TEXT NOT NULL,
    event_description TEXT,
    event_date DATE NOT NULL,
    event_time TIME,
    location TEXT,
    club_id INTEGER NOT NULL,
    FOREIGN KEY (club_id) REFERENCES Clubs (club_id)
);

-- Event Attendance Table
CREATE TABLE EventAttendance (
    attendance_id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL,
    member_id INTEGER NOT NULL,
    attendance_status TEXT,
    check_in_time TIME,
    FOREIGN KEY (event_id) REFERENCES Events (event_id),
    FOREIGN KEY (member_id) REFERENCES Members (member_id)
);

-- Membership Junction Table
CREATE TABLE Membership (
    membership_id INTEGER PRIMARY KEY AUTOINCREMENT,
    club_id INTEGER NOT NULL,
    member_id INTEGER NOT NULL,
    active_status TEXT,
    FOREIGN KEY (club_id) REFERENCES Clubs (club_id),
    FOREIGN KEY (member_id) REFERENCES Members (member_id)
);

-- Budget Table
CREATE TABLE Budget (
    budget_id INTEGER PRIMARY KEY AUTOINCREMENT,
    club_id INTEGER NOT NULL,
    fiscal_year INTEGER NOT NULL,
    total_budget REAL NOT NULL,
    FOREIGN KEY (club_id) REFERENCES Clubs (club_id)
);

-- Expenses Table
CREATE TABLE Expenses (
    expense_id INTEGER PRIMARY KEY AUTOINCREMENT,
    club_id INTEGER NOT NULL,
    budget_id INTEGER NOT NULL,
    expense_name TEXT NOT NULL,
    expense_date DATE NOT NULL,
    expense_amount REAL NOT NULL,
    description TEXT NOT NULL,
    category TEXT, -- Optional: To categorize expenses (e.g., "Event", "Supplies", "Travel")
    FOREIGN KEY (club_id) REFERENCES Clubs (club_id),
    FOREIGN KEY (budget_id) REFERENCES Budget (budget_id)
);

-- Sponsors Table
CREATE TABLE Sponsors (
    sponsor_id INTEGER PRIMARY KEY AUTOINCREMENT,
    sponsor_name TEXT NOT NULL,
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
    contribution_amount REAL NOT NULL,
    contribution_date DATE,
    FOREIGN KEY (sponsor_id) REFERENCES Sponsors (sponsor_id),
    FOREIGN KEY (club_id) REFERENCES Clubs (club_id)

);

-- Event Hosting Junction Table
CREATE TABLE EventHosting (
    hosting_id INTEGER PRIMARY KEY AUTOINCREMENT,
    club_id INTEGER NOT NULL,
    event_id INTEGER NOT NULL,
    hosting_status TEXT,
    FOREIGN KEY (club_id) REFERENCES Clubs (club_id),
    FOREIGN KEY (event_id) REFERENCES Events (event_id)
);
