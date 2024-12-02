from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Clubs Table
class Club(db.Model):
    __tablename__ = 'Clubs'
    club_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    club_name = db.Column(db.String(255), nullable=False)
    club_description = db.Column(db.Text)
    founded_date = db.Column(db.Date)
    contact_email = db.Column(db.String(255), nullable=False)
    faculty_advisor = db.Column(db.String(255))

# Students Table
class Student(db.Model):
    __tablename__ = 'Students'
    student_id = db.Column(db.String(50), primary_key=True)
    first_name = db.Column(db.String(255), nullable=False)
    last_name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    phone_number = db.Column(db.String(20))
    major = db.Column(db.String(255))
    graduation_year = db.Column(db.Integer)

# Roles Table
class Role(db.Model):
    __tablename__ = 'Roles'
    role_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    role_name = db.Column(db.String(255), nullable=False)
    role_description = db.Column(db.Text)


# Club Roles Junction Table
class ClubRole(db.Model):
    __tablename__ = 'ClubRoles'
    club_role_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    club_id = db.Column(db.Integer, db.ForeignKey('Clubs.club_id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('Students.student_id'), nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey('Roles.role_id'), nullable=False)


# Events Table
class Event(db.Model):
    __tablename__ = 'Events'
    event_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    event_name = db.Column(db.String(255), nullable=False)
    event_description = db.Column(db.Text)
    event_date = db.Column(db.Date, nullable=False)
    event_time = db.Column(db.Time)
    location = db.Column(db.String(255))
    club_id = db.Column(db.Integer, db.ForeignKey('Clubs.club_id'), nullable=False)


# Event Attendance Table
class EventAttendance(db.Model):
    __tablename__ = 'EventAttendance'
    attendance_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    event_id = db.Column(db.Integer, db.ForeignKey('Events.event_id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('Students.student_id'), nullable=False)
    attendance_status = db.Column(db.String(50))
    check_in_time = db.Column(db.Time)

# Membership Junction Table
class Membership(db.Model):
    __tablename__ = 'Membership'
    membership_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    club_id = db.Column(db.Integer, db.ForeignKey('Clubs.club_id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('Students.student_id'), nullable=False)
    active_status = db.Column(db.String(50))

# Budget Table
class Budget(db.Model):
    __tablename__ = 'Budget'
    budget_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    club_id = db.Column(db.Integer, db.ForeignKey('Clubs.club_id'), nullable=False)
    fiscal_year = db.Column(db.Integer, nullable=False)
    total_budget = db.Column(db.Float, nullable=False)


# Sponsors Table
class Sponsor(db.Model):
    __tablename__ = 'Sponsors'
    sponsor_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    sponsor_name = db.Column(db.String(255), nullable=False)
    contact_person = db.Column(db.String(255))
    contact_email = db.Column(db.String(255))
    phone_number = db.Column(db.String(20))
    address = db.Column(db.Text)

# Sponsorship Contribution Junction Table
class SponsorshipContribution(db.Model):
    __tablename__ = 'SponsorshipContribution'
    sponsorship_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    sponsor_id = db.Column(db.Integer, db.ForeignKey('Sponsors.sponsor_id'), nullable=False)
    club_id = db.Column(db.Integer, db.ForeignKey('Clubs.club_id'), nullable=False)
    contribution_amount = db.Column(db.Float, nullable=False)
    contribution_date = db.Column(db.Date)


# Event Hosting Junction Table
class EventHosting(db.Model):
    __tablename__ = 'EventHosting'
    hosting_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    club_id = db.Column(db.Integer, db.ForeignKey('Clubs.club_id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('Events.event_id'), nullable=False)
    hosting_status = db.Column(db.String(50))

# Expense Table
class Expense(db.Model):
    __tablename__ = 'Expenses'
    expense_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    club_id = db.Column(db.Integer, db.ForeignKey('Clubs.club_id'), nullable=False)
    budget_id = db.Column(db.Integer, db.ForeignKey('Budget.budget_id'), nullable=False)
    expense_name = db.Column(db.String(255), nullable=False)  # Name of the expense
    expense_amount = db.Column(db.Float, nullable=False)  # Expense amount
    expense_date = db.Column(db.Date, nullable=False)  # Date the expense occurred
    description = db.Column(db.Text)  # Additional details about the expense
    category = db.Column(db.Text)  # Category of the expense

