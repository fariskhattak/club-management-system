from app.models import db

class Student(db.Model):
    __tablename__ = 'Students'
    student_id = db.Column(db.String(50), primary_key=True)
    first_name = db.Column(db.String(255), nullable=False)
    last_name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    phone_number = db.Column(db.String(20))
    major = db.Column(db.String(255))
    graduation_year = db.Column(db.Integer)

class EventAttendance(db.Model):
    __tablename__ = 'EventAttendance'
    attendance_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    event_id = db.Column(db.Integer, db.ForeignKey('Events.event_id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('Students.student_id'), nullable=False)
    attendance_status = db.Column(db.String(50))
    check_in_time = db.Column(db.Time)
