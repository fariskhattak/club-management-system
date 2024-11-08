-- Create Clubs Table
CREATE TABLE IF NOT EXISTS Clubs (
    club_id INTEGER PRIMARY KEY AUTOINCREMENT,
    club_name TEXT NOT NULL,
    club_description TEXT,
    founded_date TEXT,
    email TEXT UNIQUE
);

-- Create Members Table
CREATE TABLE IF NOT EXISTS Members (
    member_id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone_number TEXT,
    join_date TEXT,
    club_id INTEGER,
    FOREIGN KEY (club_id) REFERENCES Clubs(club_id) ON DELETE CASCADE
);

-- Create Roles Table
CREATE TABLE IF NOT EXISTS Roles (
    role_id INTEGER PRIMARY KEY AUTOINCREMENT,
    role_name TEXT UNIQUE NOT NULL
);

-- Create MemberRoles Table
CREATE TABLE IF NOT EXISTS MemberRoles (
    member_role_id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id INTEGER,
    club_id INTEGER,
    role_id INTEGER,
    assigned_date TEXT,
    FOREIGN KEY (member_id) REFERENCES Members(member_id) ON DELETE CASCADE,
    FOREIGN KEY (club_id) REFERENCES Clubs(club_id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES Roles(role_id)
);

-- Create Events Table
CREATE TABLE IF NOT EXISTS Events (
    event_id INTEGER PRIMARY KEY AUTOINCREMENT,
    club_id INTEGER,
    event_name TEXT NOT NULL,
    event_description TEXT,
    event_date TEXT,
    location TEXT,
    FOREIGN KEY (club_id) REFERENCES Clubs(club_id) ON DELETE CASCADE
);

-- Create EventAttendance Table
CREATE TABLE IF NOT EXISTS EventAttendance (
    attendance_id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER,
    member_id INTEGER,
    attended BOOLEAN DEFAULT 0,
    check_in_time TEXT,
    FOREIGN KEY (event_id) REFERENCES Events(event_id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES Members(member_id) ON DELETE CASCADE
);

-- Create Budget Table
CREATE TABLE IF NOT EXISTS Budget (
    budget_id INTEGER PRIMARY KEY AUTOINCREMENT,
    club_id INTEGER,
    fiscal_year INTEGER,
    total_budget REAL DEFAULT 0.00,
    spent_amount REAL DEFAULT 0.00,
    FOREIGN KEY (club_id) REFERENCES Clubs(club_id) ON DELETE CASCADE
);

-- Create Sponsors Table
CREATE TABLE IF NOT EXISTS Sponsors (
    sponsor_id INTEGER PRIMARY KEY AUTOINCREMENT,
    sponsor_name TEXT NOT NULL,
    contact_person TEXT,
    contact_email TEXT,
    phone_number TEXT
);

-- Create ClubSponsors Table
CREATE TABLE IF NOT EXISTS ClubSponsors (
    club_sponsor_id INTEGER PRIMARY KEY AUTOINCREMENT,
    club_id INTEGER,
    sponsor_id INTEGER,
    sponsorship_amount REAL DEFAULT 0.00,
    sponsorship_date TEXT,
    FOREIGN KEY (club_id) REFERENCES Clubs(club_id) ON DELETE CASCADE,
    FOREIGN KEY (sponsor_id) REFERENCES Sponsors(sponsor_id) ON DELETE CASCADE
);
