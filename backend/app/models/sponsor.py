from app.models import db

class Sponsor(db.Model):
    __tablename__ = 'Sponsors'
    sponsor_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    sponsor_name = db.Column(db.String(255), nullable=False)
    contact_person = db.Column(db.String(255))
    contact_email = db.Column(db.String(255))
    phone_number = db.Column(db.String(20))
    address = db.Column(db.Text)

class SponsorshipContribution(db.Model):
    __tablename__ = 'SponsorshipContribution'
    sponsorship_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    sponsor_id = db.Column(db.Integer, db.ForeignKey('Sponsors.sponsor_id'), nullable=False)
    club_id = db.Column(db.Integer, db.ForeignKey('Clubs.club_id'), nullable=False)
    contribution_amount = db.Column(db.Float, nullable=False)
    contribution_date = db.Column(db.Date)
