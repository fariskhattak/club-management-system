# import sqlite3

# # Establish a connection to the SQLite database (or create one if it doesn't exist)
# conn = sqlite3.connect("database.db")
# cursor = conn.cursor()

# # Insert test data
# test_data = [
#     # Insert into Clubs
#     (
#         "INSERT INTO Clubs (club_name, club_description, founded_date, contact_email, faculty_advisor) VALUES (?, ?, ?, ?, ?)",
#         [
#             (
#                 "AI Club",
#                 "Focuses on AI projects.",
#                 "2015-03-01",
#                 "ai_club@example.com",
#                 "Dr. Smith",
#             ),
#             (
#                 "Robotics Club",
#                 "Design and build robots.",
#                 "2010-09-15",
#                 "robotics_club@example.com",
#                 "Dr. Johnson",
#             ),
#             (
#                 "Chess Club",
#                 "For chess enthusiasts.",
#                 "2018-01-20",
#                 "chess_club@example.com",
#                 "Dr. Lee",
#             ),
#         ],
#     ),
#     # Insert into Students
#     (
#         "INSERT INTO Students (student_id, first_name, last_name, email, phone_number, major, graduation_year) VALUES (?, ?, ?, ?, ?, ?, ?)",
#         [
#             (
#                 "S001",
#                 "Alice",
#                 "Johnson",
#                 "alice.johnson@example.com",
#                 "123-456-7890",
#                 "Computer Science",
#                 2025,
#             ),
#             (
#                 "S002",
#                 "Bob",
#                 "Smith",
#                 "bob.smith@example.com",
#                 "234-567-8901",
#                 "Mechanical Engineering",
#                 2024,
#             ),
#             (
#                 "S003",
#                 "Charlie",
#                 "Brown",
#                 "charlie.brown@example.com",
#                 "345-678-9012",
#                 "Mathematics",
#                 2026,
#             ),
#             (
#                 "S004",
#                 "Diana",
#                 "Prince",
#                 "diana.prince@example.com",
#                 "456-789-0123",
#                 "Physics",
#                 2025,
#             ),
#             (
#                 "S005",
#                 "Eve",
#                 "Polastri",
#                 "eve.polastri@example.com",
#                 "567-890-1234",
#                 "Biology",
#                 2024,
#             ),
#             (
#                 "S006",
#                 "Frank",
#                 "Castle",
#                 "frank.castle@example.com",
#                 "678-901-2345",
#                 "Civil Engineering",
#                 2025,
#             ),
#         ],
#     ),
#     # Insert into Roles
#     (
#         "INSERT INTO Roles (role_name, role_description) VALUES (?, ?)",
#         [
#             ("President", "Leader of the club."),
#             ("Treasurer", "Manages finances."),
#             ("Secretary", "Maintains records."),
#         ],
#     ),
#     # Insert into ClubRoles
#     (
#         "INSERT INTO ClubRoles (club_id, student_id, role_id) VALUES (?, ?, ?)",
#         [
#             (1, "S001", 1),  # Alice is President of AI Club
#             (2, "S002", 2),  # Bob is Treasurer of Robotics Club
#             (3, "S003", 3),  # Charlie is Secretary of Chess Club
#             (1, "S004", 3),  # Diana is Secretary of AI Club
#             (2, "S005", 1),  # Eve is President of Robotics Club
#             (3, "S006", 2),  # Frank is Treasurer of Chess Club
#         ],
#     ),
#     # Insert into Membership
#     (
#         "INSERT INTO Membership (club_id, student_id, active_status) VALUES (?, ?, ?)",
#         [
#             (1, "S001", "Active"),  # Alice in AI Club
#             (2, "S002", "Active"),  # Bob in Robotics Club
#             (3, "S003", "Inactive"),  # Charlie in Chess Club
#             (1, "S004", "Active"),  # Diana in AI Club
#             (2, "S005", "Pending"),  # Eve in Robotics Club
#             (3, "S006", "Active"),  # Frank in Chess Club
#         ],
#     ),
#     # Insert into Events
#     (
#         "INSERT INTO Events (event_name, event_description, event_date, event_time, location, club_id) VALUES (?, ?, ?, ?, ?, ?)",
#         [
#             (
#                 "AI Workshop",
#                 "Introduction to machine learning.",
#                 "2024-12-10",
#                 "10:00:00",
#                 "Room 101",
#                 1,
#             ),  # AI Club
#             (
#                 "Robotics Competition",
#                 "Annual robotics contest.",
#                 "2024-12-15",
#                 "09:00:00",
#                 "Main Hall",
#                 2,
#             ),  # Robotics Club
#             (
#                 "Chess Tournament",
#                 "Open chess competition.",
#                 "2024-12-20",
#                 "13:00:00",
#                 "Library",
#                 3,
#             ),  # Chess Club
#             (
#                 "AI Club Meet & Greet",
#                 "Networking event for AI enthusiasts.",
#                 "2024-11-01",
#                 "17:00:00",
#                 "Cafeteria",
#                 1,
#             ),  # AI Club
#             (
#                 "Robotics Club Hackathon",
#                 "Building robotic solutions in 24 hours.",
#                 "2024-12-01",
#                 "08:00:00",
#                 "Engineering Hall",
#                 2,
#             ),  # Robotics Club
#             (
#                 "Chess Blitz",
#                 "Quick matches and strategy sessions.",
#                 "2024-11-25",
#                 "15:00:00",
#                 "Game Room",
#                 3,
#             ),  # Chess Club
#         ],
#     ),
#     # Insert into Budget
#     (
#         "INSERT INTO Budget (club_id, fiscal_year, total_budget) VALUES (?, ?, ?)",
#         [(1, 2024, 5000.00), (2, 2024, 7000.00), (3, 2024, 2000.00)],
#     ),
#     # Insert into Expenses
#     (
#         "INSERT INTO Expenses (club_id, budget_id, expense_name, expense_date, expense_amount, description, category) VALUES (?, ?, ?, ?, ?, ?, ?)",
#         [
#             (
#                 1,
#                 1,
#                 "Workshop Materials",
#                 "2024-12-05",
#                 500.00,
#                 "Materials for AI workshop.",
#                 "Supplies",
#             ),
#             (
#                 2,
#                 2,
#                 "Robot Parts",
#                 "2024-12-01",
#                 2000.00,
#                 "Parts for competition.",
#                 "Supplies",
#             ),
#             (3, 3, "Trophies", "2024-12-10", 150.00, "Chess trophies.", "Event"),
#         ],
#     ),
#     # Insert into Sponsors
#     (
#         "INSERT INTO Sponsors (sponsor_name, contact_person, contact_email, phone_number, address) VALUES (?, ?, ?, ?, ?)",
#         [
#             (
#                 "TechCorp",
#                 "Emily Davis",
#                 "emily.davis@techcorp.com",
#                 "456-789-0123",
#                 "123 Tech Street",
#             ),
#             (
#                 "Innovate Inc.",
#                 "Michael Green",
#                 "michael.green@innovate.com",
#                 "567-890-1234",
#                 "456 Innovate Ave",
#             ),
#         ],
#     ),
#     # Insert into SponsorshipContribution
#     (
#         "INSERT INTO SponsorshipContribution (sponsor_id, club_id, contribution_amount, contribution_date) VALUES (?, ?, ?, ?)",
#         [(1, 1, 2000.00, "2024-11-01"), (2, 2, 3000.00, "2024-11-15")],
#     ),
#     # Insert into EventHosting
#     (
#         "INSERT INTO EventHosting (club_id, event_id, hosting_status) VALUES (?, ?, ?)",
#         [(1, 1, "Lead"), (2, 2, "Lead"), (3, 3, "Lead")],
#     ),
# ]

# # Execute all test data insertions
# for query, data in test_data:
#     cursor.executemany(query, data)

# # Commit changes and close the connection
# conn.commit()
# conn.close()

# print("Database populated with test data successfully!")