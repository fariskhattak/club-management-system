# from datetime import datetime
# from app import app
# from models import (
#     db,
#     Club,
#     Student,
#     Role,
#     ClubRole,
#     Event,
#     EventAttendance,
#     Membership,
#     Budget,
#     Sponsor,
#     SponsorshipContribution,
#     EventHosting,
#     Expense,
# )


# # Connect to the database
# def seed_database():
#     with app.app_context():
#         db.drop_all()
#         db.create_all()

#         # Clubs
#         clubs = [
#             Club(
#                 club_name="Art Club",
#                 club_description="A club for art enthusiasts",
#                 founded_date=datetime(2018, 9, 1),
#                 contact_email="artclub@example.com",
#                 faculty_advisor="Dr. Emily Carter",
#             ),
#             Club(
#                 club_name="Robotics Club",
#                 club_description="Exploring robotics and AI",
#                 founded_date=datetime(2016, 5, 20),
#                 contact_email="robotics@example.com",
#                 faculty_advisor="Dr. James Anderson",
#             ),
#             Club(
#                 club_name="Literature Club",
#                 club_description="Discussing and appreciating literature",
#                 founded_date=datetime(2019, 2, 14),
#                 contact_email="literature@example.com",
#                 faculty_advisor="Dr. Anna Taylor",
#             ),
#         ]
#         db.session.add_all(clubs)
#         db.session.commit()

#         # Members
#         members = [
#             Student(
#                 student_id="S001",
#                 first_name="Alice",
#                 last_name="Smith",
#                 email="alice.smith@example.com",
#                 phone_number="1234567890",
#                 major="Fine Arts",
#                 graduation_year=2025,
#             ),
#             Student(
#                 student_id="S002",
#                 first_name="Bob",
#                 last_name="Johnson",
#                 email="bob.johnson@example.com",
#                 phone_number="1234567891",
#                 major="Computer Science",
#                 graduation_year=2024,
#             ),
#             Student(
#                 student_id="S003",
#                 first_name="Charlie",
#                 last_name="Brown",
#                 email="charlie.brown@example.com",
#                 phone_number="1234567892",
#                 major="Robotics",
#                 graduation_year=2026,
#             ),
#             Student(
#                 student_id="S004",
#                 first_name="Diana",
#                 last_name="Prince",
#                 email="diana.prince@example.com",
#                 phone_number="1234567893",
#                 major="Literature",
#                 graduation_year=2023,
#             ),
#             Student(
#                 student_id="S005",
#                 first_name="Edward",
#                 last_name="Norton",
#                 email="edward.norton@example.com",
#                 phone_number="1234567894",
#                 major="Art History",
#                 graduation_year=2024,
#             ),
#         ]
#         db.session.add_all(members)
#         db.session.commit()

#         # Memberships
#         memberships = [
#             Membership(club_id=1, student_id="S001", active_status="Active"),
#             Membership(club_id=1, student_id="S002", active_status="Active"),
#             Membership(club_id=1, student_id="S003", active_status="Inactive"),
#             Membership(club_id=1, student_id="S004", active_status="Active"),
#             Membership(club_id=1, student_id="S005", active_status="Active"),
#             Membership(club_id=2, student_id="S001", active_status="Active"),
#             Membership(club_id=2, student_id="S002", active_status="Active"),
#             Membership(club_id=2, student_id="S003", active_status="Active"),
#             Membership(club_id=2, student_id="S004", active_status="Inactive"),
#             Membership(club_id=2, student_id="S005", active_status="Active"),
#             Membership(club_id=3, student_id="S001", active_status="Inactive"),
#             Membership(club_id=3, student_id="S002", active_status="Active"),
#             Membership(club_id=3, student_id="S003", active_status="Active"),
#             Membership(club_id=3, student_id="S004", active_status="Active"),
#             Membership(club_id=3, student_id="S005", active_status="Active"),
#         ]
#         db.session.add_all(memberships)
#         db.session.commit()

#         # Roles
#         roles = [
#             Role(role_name="President", role_description="Club leader"),
#             Role(role_name="Treasurer", role_description="Manages finances"),
#             Role(role_name="Secretary", role_description="Maintains records"),
#             Role(role_name="Member", role_description="General member"),
#         ]
#         db.session.add_all(roles)
#         db.session.commit()

#         # Club Roles
#         club_roles = [
#             ClubRole(club_id=1, student_id="S001", role_id=1),
#             ClubRole(club_id=1, student_id="S002", role_id=2),
#             ClubRole(club_id=1, student_id="S003", role_id=3),
#             ClubRole(club_id=1, student_id="S004", role_id=4),
#             ClubRole(club_id=1, student_id="S005", role_id=4),
#             ClubRole(club_id=2, student_id="S001", role_id=2),
#             ClubRole(club_id=2, student_id="S002", role_id=1),
#             ClubRole(club_id=2, student_id="S003", role_id=4),
#             ClubRole(club_id=2, student_id="S004", role_id=3),
#             ClubRole(club_id=2, student_id="S005", role_id=4),
#             ClubRole(club_id=3, student_id="S001", role_id=3),
#             ClubRole(club_id=3, student_id="S002", role_id=4),
#             ClubRole(club_id=3, student_id="S003", role_id=2),
#             ClubRole(club_id=3, student_id="S004", role_id=1),
#             ClubRole(club_id=3, student_id="S005", role_id=4),
#         ]
#         db.session.add_all(club_roles)
#         db.session.commit()

#         # Events
#         events = [
#             Event(
#                 event_name="Art Exhibition",
#                 event_description="Annual art showcase",
#                 event_date=datetime(2024, 4, 15),
#                 event_time=datetime.strptime("14:00", "%H:%M").time(),
#                 location="Art Hall",
#                 club_id=1,
#             ),
#             Event(
#                 event_name="Robotics Competition",
#                 event_description="National robotics event",
#                 event_date=datetime(2024, 3, 20),
#                 event_time=datetime.strptime("10:00", "%H:%M").time(),
#                 location="Tech Arena",
#                 club_id=2,
#             ),
#             Event(
#                 event_name="Poetry Reading",
#                 event_description="Celebration of poetry",
#                 event_date=datetime(2024, 5, 12),
#                 event_time=datetime.strptime("17:30", "%H:%M").time(),
#                 location="Library Hall",
#                 club_id=3,
#             ),
#         ]
#         db.session.add_all(events)
#         db.session.commit()

#         # Attendance
#         attendances = [
#             EventAttendance(
#                 event_id=1,
#                 student_id="S001",
#                 attendance_status="Present",
#                 check_in_time=datetime.strptime("14:05", "%H:%M").time(),
#             ),
#             EventAttendance(
#                 event_id=1,
#                 student_id="S002",
#                 attendance_status="Present",
#                 check_in_time=datetime.strptime("14:10", "%H:%M").time(),
#             ),
#             EventAttendance(
#                 event_id=2,
#                 student_id="S003",
#                 attendance_status="Present",
#                 check_in_time=datetime.strptime("10:15", "%H:%M").time(),
#             ),
#             EventAttendance(
#                 event_id=3,
#                 student_id="S004",
#                 attendance_status="Absent",
#                 check_in_time=None,
#             ),
#         ]
#         db.session.add_all(attendances)
#         db.session.commit()

#         # Budgets
#         budgets = [
#             Budget(club_id=1, fiscal_year=2023, total_budget=5000.0),
#             Budget(club_id=1, fiscal_year=2024, total_budget=5500.0),
#             Budget(club_id=2, fiscal_year=2023, total_budget=6000.0),
#             Budget(club_id=2, fiscal_year=2024, total_budget=6500.0),
#             Budget(club_id=3, fiscal_year=2023, total_budget=4000.0),
#             Budget(club_id=3, fiscal_year=2024, total_budget=4500.0),
#         ]
#         db.session.add_all(budgets)
#         db.session.commit()

#         # Sponsors
#         sponsors = [
#             Sponsor(
#                 sponsor_name="Art Supplies Co.",
#                 contact_person="John Doe",
#                 contact_email="john.doe@example.com",
#                 phone_number="123-456-7890",
#                 address="123 Art St.",
#             ),
#             Sponsor(
#                 sponsor_name="Tech Innovators",
#                 contact_person="Jane Smith",
#                 contact_email="jane.smith@example.com",
#                 phone_number="321-654-0987",
#                 address="456 Tech Ave.",
#             ),
#             Sponsor(
#                 sponsor_name="Book Lovers Inc.",
#                 contact_person="Robert Brown",
#                 contact_email="robert.brown@example.com",
#                 phone_number="456-789-1230",
#                 address="789 Literature Rd.",
#             ),
#         ]
#         db.session.add_all(sponsors)
#         db.session.commit()

#         # Sponsorship Contributions
#         sponsorships = [
#             SponsorshipContribution(
#                 sponsor_id=1,
#                 club_id=1,
#                 contribution_amount=2000.0,
#                 contribution_date=datetime(2024, 1, 15),
#             ),
#             SponsorshipContribution(
#                 sponsor_id=2,
#                 club_id=2,
#                 contribution_amount=2500.0,
#                 contribution_date=datetime(2024, 2, 10),
#             ),
#             SponsorshipContribution(
#                 sponsor_id=3,
#                 club_id=3,
#                 contribution_amount=1500.0,
#                 contribution_date=datetime(2024, 3, 5),
#             ),
#         ]
#         db.session.add_all(sponsorships)
#         db.session.commit()

#         # Event Hosting
#         hostings = [
#             EventHosting(club_id=1, event_id=1, hosting_status="Confirmed"),
#             EventHosting(club_id=2, event_id=2, hosting_status="Confirmed"),
#             EventHosting(club_id=3, event_id=3, hosting_status="Pending"),
#         ]
#         db.session.add_all(hostings)
#         db.session.commit()

#         # Expenses
#         expenses = [
#             Expense(
#                 club_id=1,
#                 budget_id=1,
#                 expense_name="Paint Supplies",
#                 expense_date=datetime(2024, 1, 10),
#                 expense_amount=500.0,
#                 description="Supplies for painting",
#                 category="Supplies",
#             ),
#             Expense(
#                 club_id=1,
#                 budget_id=1,
#                 expense_name="Gallery Rent",
#                 expense_date=datetime(2024, 2, 20),
#                 expense_amount=1200.0,
#                 description="Rent for gallery",
#                 category="Event",
#             ),
#             Expense(
#                 club_id=2,
#                 budget_id=2,
#                 expense_name="Robot Parts",
#                 expense_date=datetime(2024, 3, 15),
#                 expense_amount=2000.0,
#                 description="Parts for competition",
#                 category="Supplies",
#             ),
#             Expense(
#                 club_id=3,
#                 budget_id=3,
#                 expense_name="Books Purchase",
#                 expense_date=datetime(2024, 4, 5),
#                 expense_amount=800.0,
#                 description="Books for library",
#                 category="Supplies",
#             ),
#         ]
#         db.session.add_all(expenses)
#         db.session.commit()


# # Run the script
# if __name__ == "__main__":
#     seed_database()
