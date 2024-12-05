# import sqlite3

# # Establish a connection to the SQLite database (or create one if it doesn't exist)
# conn = sqlite3.connect("database.db")
# cursor = conn.cursor()

# # Insert additional budgets for new fiscal years
# budget_data = [
#     (1, 2025, 6000.00),  # AI Club, fiscal year 2025
#     (1, 2026, 6500.00),  # AI Club, fiscal year 2026
#     (2, 2025, 8000.00),  # Robotics Club, fiscal year 2025
#     (2, 2026, 8500.00),  # Robotics Club, fiscal year 2026
#     (3, 2025, 2500.00),  # Chess Club, fiscal year 2025
#     (3, 2026, 3000.00),  # Chess Club, fiscal year 2026
# ]

# cursor.executemany(
#     "INSERT INTO Budget (club_id, fiscal_year, total_budget) VALUES (?, ?, ?)", budget_data
# )

# # Insert additional expenses tied to the new fiscal years
# expenses_data = [
#     # AI Club, fiscal year 2025
#     (1, 4, "AI Workshop Materials", "2025-01-10", 400.00, "Materials for workshop.", "Supplies"),
#     (1, 4, "Conference Tickets", "2025-03-15", 1500.00, "Tickets for AI conference.", "Event"),
    
#     # AI Club, fiscal year 2026
#     (1, 5, "Server Subscription", "2026-02-20", 800.00, "Cloud server subscription.", "Other"),
#     (1, 5, "AI Meet-up Catering", "2026-05-10", 600.00, "Catering for meet-up.", "Event"),
    
#     # Robotics Club, fiscal year 2025
#     (2, 6, "Robot Hardware", "2025-01-25", 2000.00, "Hardware for robot build.", "Supplies"),
#     (2, 6, "Competition Registration", "2025-06-30", 500.00, "Registration fee.", "Event"),
    
#     # Robotics Club, fiscal year 2026
#     (2, 7, "Software Licenses", "2026-03-10", 1200.00, "Licenses for simulation tools.", "Supplies"),
#     (2, 7, "Team Jerseys", "2026-04-15", 400.00, "Jerseys for competition.", "Other"),
    
#     # Chess Club, fiscal year 2025
#     (3, 8, "Tournament Prizes", "2025-02-05", 300.00, "Prizes for chess tournament.", "Event"),
#     (3, 8, "Chess Boards", "2025-08-10", 200.00, "New chess boards.", "Supplies"),
    
#     # Chess Club, fiscal year 2026
#     (3, 9, "Coaching Sessions", "2026-01-20", 600.00, "Sessions with a grandmaster.", "Event"),
#     (3, 9, "Event Snacks", "2026-03-15", 150.00, "Snacks for attendees.", "Other"),
# ]

# cursor.executemany(
#     "INSERT INTO Expenses (club_id, budget_id, expense_name, expense_date, expense_amount, description, category) VALUES (?, ?, ?, ?, ?, ?, ?)",
#     expenses_data,
# )

# # Commit changes to the database
# conn.commit()

# print("Added additional budgets and expenses for new fiscal years.")
