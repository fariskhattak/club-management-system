# app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
from config import DATABASE_URI
from models import db, Club, Member, Role, ClubRole, Event, EventAttendance, Membership, Budget, Sponsor, SponsorshipContribution, EventHosting
from datetime import datetime

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database
db.init_app(app)

# Route to get all clubs
@app.route('/api/clubs', methods=['GET'])
def get_clubs():
    clubs = Club.query.all()
    return jsonify([{
        "club_id": club.club_id,
        "club_name": club.club_name,
        "club_description": club.club_description,
        "founded_date": club.founded_date,
        "contact_email": club.contact_email,
        "faculty_advisor": club.faculty_advisor
    } for club in clubs])

@app.route('/api/clubs', methods=['POST'])
def add_club():
    data = request.json
    try:
        # Convert founded_date to a Python date object if provided
        founded_date = None
        if 'founded_date' in data and data['founded_date']:
            founded_date = datetime.strptime(data['founded_date'], "%Y-%m-%d").date()

        new_club = Club(
            club_name=data['club_name'],
            club_description=data.get('club_description', ''),
            founded_date=founded_date,
            contact_email=data['contact_email'],
            faculty_advisor=data.get('faculty_advisor', '')
        )
        db.session.add(new_club)
        db.session.commit()
        return jsonify({"message": "Club added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# Route to update a club by ID
@app.route('/api/clubs/<int:club_id>', methods=['PUT'])
def update_club(club_id):
    data = request.json
    club = db.session.get(Club, club_id)
    if not club:
        return jsonify({"error": "Club not found"}), 404

    try:
        club.club_name = data.get('club_name', club.club_name)
        club.club_description = data.get('club_description', club.club_description)
        club.founded_date = data.get('founded_date', club.founded_date)
        club.contact_email = data.get('contact_email', club.contact_email)
        club.faculty_advisor = data.get('faculty_advisor', club.faculty_advisor)

        db.session.commit()
        return jsonify({"message": "Club updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/clubs/<int:club_id>', methods=['DELETE'])
def delete_club(club_id):
    club = db.session.get(Club, club_id)
    if not club:
        return jsonify({"error": "Club not found"}), 404

    try:
        # Remove dependencies manually
        db.session.query(ClubRole).filter_by(club_id=club_id).delete()
        db.session.query(EventHosting).filter_by(club_id=club_id).delete()
        db.session.query(SponsorshipContribution).filter_by(club_id=club_id).delete()
        db.session.query(Membership).filter_by(club_id=club_id).delete()
        db.session.query(Budget).filter_by(club_id=club_id).delete()

        # Handle events and their dependencies
        event_ids = [event.event_id for event in db.session.query(Event).filter_by(club_id=club_id).all()]
        db.session.query(EventAttendance).filter(EventAttendance.event_id.in_(event_ids)).delete()
        db.session.query(Event).filter_by(club_id=club_id).delete()

        # Delete the club itself
        db.session.delete(club)
        db.session.commit()
        return jsonify({"message": f"Club with ID {club_id} deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
    
@app.route('/api/clubs/<int:club_id>/members', methods=['GET'])
def get_club_members(club_id):
    # Query to find members associated with the club_id
    members = db.session.query(Member).join(Membership).filter(Membership.club_id == club_id).all()

    # If no members are found, return an empty list
    if not members:
        return jsonify({
            "message": "No members found for the specified club",
            "members": []
        }), 200

    # Format the response
    member_list = [{
        "member_id": member.member_id,
        "student_id": member.student_id,
        "first_name": member.first_name,
        "last_name": member.last_name,
        "email": member.email,
        "phone_number": member.phone_number,
        "major": member.major,
        "graduation_year": member.graduation_year
    } for member in members]

    return jsonify({
        "message": "Members retrieved successfully",
        "members": member_list
    }), 200

@app.route('/api/clubs/<int:club_id>/members', methods=['POST'])
def add_member_to_club(club_id):
    data = request.json

    # Check if the club exists
    club = db.session.get(Club, club_id)
    if not club:
        return jsonify({"error": "Club not found"}), 404

    try:
        # Check if the member already exists
        member = Member.query.filter_by(student_id=data['student_id']).first()
        if not member:
            # Create a new member if they don't exist
            member = Member(
                student_id=data['student_id'],
                first_name=data['first_name'],
                last_name=data['last_name'],
                email=data['email'],
                phone_number=data.get('phone_number'),
                major=data.get('major'),
                graduation_year=data.get('graduation_year'),
            )
            db.session.add(member)
            db.session.commit()

        # Check if the membership already exists
        membership = Membership.query.filter_by(club_id=club_id, member_id=member.member_id).first()
        if membership:
            return jsonify({"message": "Member already exists in this club"}), 200
        if not membership:
            # Link the member to the club if not already linked
            new_membership = Membership(
                club_id=club_id,
                member_id=member.member_id,
                active_status=data.get('active_status', 'Active')
            )
            db.session.add(new_membership)
            db.session.commit()

        # Return the member details
        return jsonify({
            "member_id": member.member_id,
            "student_id": member.student_id,
            "first_name": member.first_name,
            "last_name": member.last_name,
            "email": member.email,
            "phone_number": member.phone_number,
            "major": member.major,
            "graduation_year": member.graduation_year,
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
    
@app.route('/api/clubs/<int:club_id>/members/<int:member_id>', methods=['DELETE'])
def remove_member_from_club(club_id, member_id):
    try:
        # Check if the club exists
        club = db.session.get(Club, club_id)
        if not club:
            return jsonify({"error": "Club not found"}), 404

        # Check if the membership exists
        membership = Membership.query.filter_by(club_id=club_id, member_id=member_id).first()
        if not membership:
            return jsonify({"error": "Member not found in this club"}), 404

        # Remove the membership
        db.session.delete(membership)
        db.session.commit()
        return jsonify({"message": "Member removed from the club"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# Main entry point
if __name__ == '__main__':
    # Create the tables if they don't exist
    with app.app_context():
        db.create_all()

    # Run the Flask app on localhost:5000
    app.run(debug=True, host='0.0.0.0', port=5001)
