from app.models import db

class Role(db.Model):
    __tablename__ = 'Roles'
    role_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    role_name = db.Column(db.String(255), nullable=False)
    role_description = db.Column(db.Text)

class ClubRole(db.Model):
    __tablename__ = 'ClubRoles'
    club_role_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    club_id = db.Column(db.Integer, db.ForeignKey('Clubs.club_id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('Students.student_id'), nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey('Roles.role_id'), nullable=False)
