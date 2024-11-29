import sqlite3
from datetime import datetime, timedelta

# Connect to SQLite database (or create it)
connection = sqlite3.connect("database.db")
cursor = connection.cursor()

# Helper function to execute SQL commands
def execute_script(cursor, commands):
    for command in commands:
        cursor.execute(command)

# Test data insertion script
try:
    # Insert data into Clubs
    clubs = [
        ("Coding Club", "A club for coding enthusiasts.", "2015-08-20", "codingclub@university.edu", "Dr. Smith"),
        ("Art Club", "Explore creativity through various art forms.", "2010-03-15", "artclub@university.edu", "Prof. Johnson"),
        ("Robotics Club", "Build and compete with robots.", "2018-09-01", "robotics@university.edu", "Dr. Lee")
    ]
    cursor.executemany("""
    INSERT INTO Clubs (club_name, club_description, founded_date, contact_email, faculty_advisor)
    VALUES (?, ?, ?, ?, ?)""", clubs)

    # Insert data into Members
    members = [
        ("S123", "Alice", "Johnson", "alice.johnson@university.edu", "1234567890", "Computer Science", 2025),
        ("S124", "Bob", "Smith", "bob.smith@university.edu", "9876543210", "Mechanical Engineering", 2024),
        ("S125", "Charlie", "Brown", "charlie.brown@university.edu", "5556667777", "Art History", 2026),
    ]
    cursor.executemany("""
    INSERT INTO Members (student_id, first_name, last_name, email, phone_number, major, graduation_year)
    VALUES (?, ?, ?, ?, ?, ?, ?)""", members)

    # Insert data into Roles
    roles = [
        ("President", "Leader of the club"),
        ("Vice President", "Assists the president"),
        ("Treasurer", "Handles club finances"),
        ("Secretary", "Maintains records and schedules"),
        ("Member", "A general participant of the club who actively engages in events, meetings, and activities, supporting the club's mission and objectives")
    ]
    cursor.executemany("""
    INSERT INTO Roles (role_name, role_description)
    VALUES (?, ?)""", roles)

    # Insert data into ClubRoles
    club_roles = [
        (1, 1, 1),  # Alice is President of Coding Club
        (1, 2, 2),  # Bob is Vice President of Coding Club
        (2, 3, 3),  # Charlie is Treasurer of Art Club
    ]
    cursor.executemany("""
    INSERT INTO ClubRoles (club_id, member_id, role_id)
    VALUES (?, ?, ?)""", club_roles)

    # Insert data into Events
    events = [
        ("Hackathon 2024", "A 24-hour coding event.", "2024-03-15", "09:00:00", "Computer Lab", "Coding Club event.", 1),
        ("Art Exhibit", "Showcase of student artwork.", "2024-05-10", "16:00:00", "Art Gallery", "Art Club event.", 2),
        ("Robotics Workshop", "Learn to build robots.", "2024-06-20", "13:00:00", "Engineering Building", "Robotics Club event.", 3)
    ]
    cursor.executemany("""
    INSERT INTO Events (event_name, event_description, event_date, event_time, location, description, club_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)""", events)

    # Insert data into EventAttendance
    event_attendance = [
        (1, 1, "Present", "09:10:00"),  # Alice attended Hackathon
        (1, 2, "Present", "09:20:00"),  # Bob attended Hackathon
        (2, 3, "Absent", None)         # Charlie missed the Art Exhibit
    ]
    cursor.executemany("""
    INSERT INTO EventAttendance (event_id, member_id, attendance_status, check_in_time)
    VALUES (?, ?, ?, ?)""", event_attendance)

    # Insert data into Membership
    memberships = [
        (1, 1, "Active"),  # Alice in Coding Club
        (1, 2, "Active"),  # Bob in Coding Club
        (2, 3, "Active")   # Charlie in Art Club
    ]
    cursor.executemany("""
    INSERT INTO Membership (club_id, member_id, active_status)
    VALUES (?, ?, ?)""", memberships)

    # Insert data into Budget
    budgets = [
        (1, 2024, 10000, 2000, 8000),  # Coding Club budget
        (2, 2024, 5000, 1500, 3500),   # Art Club budget
        (3, 2024, 8000, 3000, 5000)    # Robotics Club budget
    ]
    cursor.executemany("""
    INSERT INTO Budget (club_id, fiscal_year, total_budget, spent_amount, remaining_amount)
    VALUES (?, ?, ?, ?, ?)""", budgets)

    # Insert data into Sponsors
    sponsors = [
        ("TechCorp", "Jane Doe", "jane.doe@techcorp.com", "1112223333", "123 Tech Street"),
        ("Art Supplies Inc.", "John Artist", "john.artist@artsupplies.com", "4445556666", "456 Art Lane")
    ]
    cursor.executemany("""
    INSERT INTO Sponsors (sponsor_name, contact_person, contact_email, phone_number, address)
    VALUES (?, ?, ?, ?, ?)""", sponsors)

    # Insert data into SponsorshipContribution
    sponsorships = [
        (1, 1, 5000, "2023-11-01"),  # TechCorp sponsors Coding Club
        (2, 2, 2000, "2023-11-01")   # Art Supplies sponsors Art Club
    ]
    cursor.executemany("""
    INSERT INTO SponsorshipContribution (sponsor_id, club_id, contribution_amount, contribution_date)
    VALUES (?, ?, ?, ?)""", sponsorships)

    # Insert data into EventHosting
    event_hosting = [
        (1, 1, "Confirmed"),  # Coding Club hosts Hackathon
        (2, 2, "Confirmed"),  # Art Club hosts Art Exhibit
        (3, 3, "Confirmed")   # Robotics Club hosts Workshop
    ]
    cursor.executemany("""
    INSERT INTO EventHosting (club_id, event_id, hosting_status)
    VALUES (?, ?, ?)""", event_hosting)

    # Commit changes
    connection.commit()
    print("Test data inserted successfully.")

except Exception as e:
    print("An error occurred:", e)
    connection.rollback()

finally:
    # Close the connection
    connection.close()
