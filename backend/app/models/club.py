from app.models import db

class Club(db.Model):
    __tablename__ = 'Clubs'
    club_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    club_name = db.Column(db.String(255), nullable=False)
    club_description = db.Column(db.Text)
    founded_date = db.Column(db.Date)
    contact_email = db.Column(db.String(255), nullable=False)
    faculty_advisor = db.Column(db.String(255))

class Membership(db.Model):
    __tablename__ = 'Membership'
    membership_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    club_id = db.Column(db.Integer, db.ForeignKey('Clubs.club_id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('Students.student_id'), nullable=False)
    active_status = db.Column(db.String(50))