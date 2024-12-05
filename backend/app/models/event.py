from app.models import db

class Event(db.Model):
    __tablename__ = 'Events'
    event_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    event_name = db.Column(db.String(255), nullable=False)
    event_description = db.Column(db.Text)
    event_date = db.Column(db.Date, nullable=False)
    event_time = db.Column(db.Time)
    location = db.Column(db.String(255))
    club_id = db.Column(db.Integer, db.ForeignKey('Clubs.club_id'), nullable=False)

class EventHosting(db.Model):
    __tablename__ = 'EventHosting'
    hosting_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    club_id = db.Column(db.Integer, db.ForeignKey('Clubs.club_id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('Events.event_id'), nullable=False)
    hosting_status = db.Column(db.String(50))
