# app.py
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from config import DATABASE_URI

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database
db = SQLAlchemy(app)

# Define the Club model
class Club(db.Model):
    __tablename__ = 'Clubs'
    club_id = db.Column(db.Integer, primary_key=True)
    club_name = db.Column(db.String(100), nullable=False)
    club_description = db.Column(db.Text)
    founded_date = db.Column(db.String(50))
    email = db.Column(db.String(100), unique=True)

# Route to get all clubs
@app.route('/api/clubs', methods=['GET'])
def get_clubs():
    clubs = Club.query.all()
    return jsonify([{
        "club_id": club.club_id,
        "club_name": club.club_name,
        "club_description": club.club_description,
        "founded_date": club.founded_date,
        "email": club.email
    } for club in clubs])

# Route to add a new club
@app.route('/api/clubs', methods=['POST'])
def add_club():
    data = request.json
    new_club = Club(
        club_name=data['club_name'],
        club_description=data.get('club_description', ''),
        founded_date=data.get('founded_date', ''),
        email=data['email']
    )
    db.session.add(new_club)
    db.session.commit()
    return jsonify({"message": "Club added successfully"}), 201

# Route to delete a club
@app.route('/api/clubs/<int:club_id>', methods=['DELETE'])
def delete_club(club_id):
    club = Club.query.get(club_id)
    
    if not club:
        return jsonify({"error": "Club not found"}), 404

    # Delete the club from the database
    db.session.delete(club)
    db.session.commit()
    
    return jsonify({"message": f"Club with ID {club_id} deleted successfully"}), 200

# Main entry point
if __name__ == '__main__':
    # Create the tables if they don't exist
    with app.app_context():
        db.create_all()

    # Run the Flask app on localhost:5000
    app.run(debug=True, host='0.0.0.0', port=5001)
