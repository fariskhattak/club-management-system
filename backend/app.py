# app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
from config import DATABASE_URI
from sqlalchemy import or_, and_
from models import (
    db,
    Club,
    Member,
    Role,
    ClubRole,
    Event,
    EventAttendance,
    Membership,
    Budget,
    Sponsor,
    SponsorshipContribution,
    EventHosting,
    Expense,
)
from datetime import datetime

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URI
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize the database
db.init_app(app)


# Route to get all clubs
@app.route("/api/clubs", methods=["GET"])
def get_clubs():
    clubs = Club.query.all()
    return jsonify(
        [
            {
                "club_id": club.club_id,
                "club_name": club.club_name,
                "club_description": club.club_description,
                "founded_date": club.founded_date,
                "contact_email": club.contact_email,
                "faculty_advisor": club.faculty_advisor,
            }
            for club in clubs
        ]
    )


@app.route("/api/clubs", methods=["POST"])
def add_club():
    data = request.json
    try:
        # Convert founded_date to a Python date object if provided
        founded_date = None
        if "founded_date" in data and data["founded_date"]:
            founded_date = datetime.strptime(data["founded_date"], "%Y-%m-%d").date()

        new_club = Club(
            club_name=data["club_name"],
            club_description=data.get("club_description", ""),
            founded_date=founded_date,
            contact_email=data["contact_email"],
            faculty_advisor=data.get("faculty_advisor", ""),
        )
        db.session.add(new_club)
        db.session.commit()
        return jsonify({"message": "Club added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# Route to update a club by ID
@app.route("/api/clubs/<int:club_id>", methods=["PUT"])
def update_club(club_id):
    data = request.json
    club = db.session.get(Club, club_id)
    if not club:
        return jsonify({"error": "Club not found"}), 404

    try:
        club.club_name = data.get("club_name", club.club_name)
        club.club_description = data.get("club_description", club.club_description)
        club.founded_date = data.get("founded_date", club.founded_date)
        club.contact_email = data.get("contact_email", club.contact_email)
        club.faculty_advisor = data.get("faculty_advisor", club.faculty_advisor)

        db.session.commit()
        return jsonify({"message": "Club updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/api/clubs/<int:club_id>", methods=["DELETE"])
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
        event_ids = [
            event.event_id
            for event in db.session.query(Event).filter_by(club_id=club_id).all()
        ]
        db.session.query(EventAttendance).filter(
            EventAttendance.event_id.in_(event_ids)
        ).delete()
        db.session.query(Event).filter_by(club_id=club_id).delete()

        # Delete the club itself
        db.session.delete(club)
        db.session.commit()
        return jsonify({"message": f"Club with ID {club_id} deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


@app.route("/api/clubs/<int:club_id>/members", methods=["GET"])
def get_club_members(club_id):
    # Query to find members associated with the club_id
    members = (
        db.session.query(Member)
        .join(Membership)
        .filter(Membership.club_id == club_id)
        .all()
    )

    # If no members are found, return an empty list
    if not members:
        return (
            jsonify(
                {"message": "No members found for the specified club", "members": []}
            ),
            200,
        )

    # Format the response
    member_list = [
        {
            "member_id": member.member_id,
            "student_id": member.student_id,
            "first_name": member.first_name,
            "last_name": member.last_name,
            "email": member.email,
            "phone_number": member.phone_number,
            "major": member.major,
            "graduation_year": member.graduation_year,
        }
        for member in members
    ]

    return (
        jsonify({"message": "Members retrieved successfully", "members": member_list}),
        200,
    )


@app.route("/api/clubs/<int:club_id>/members", methods=["POST"])
def add_member_to_club(club_id):
    data = request.json

    # Check if the club exists
    club = db.session.get(Club, club_id)
    if not club:
        return jsonify({"error": "Club not found"}), 404

    try:
        # Check if the member already exists
        member = Member.query.filter_by(student_id=data["student_id"]).first()
        if not member:
            # Create a new member if they don't exist
            member = Member(
                student_id=data["student_id"],
                first_name=data["first_name"],
                last_name=data["last_name"],
                email=data["email"],
                phone_number=data.get("phone_number"),
                major=data.get("major"),
                graduation_year=data.get("graduation_year"),
            )
            db.session.add(member)
            db.session.commit()

        # Check if the membership already exists
        membership = Membership.query.filter_by(
            club_id=club_id, member_id=member.member_id
        ).first()
        if membership:
            return jsonify({"message": "Member already exists in this club"}), 200
        if not membership:
            # Link the member to the club if not already linked
            new_membership = Membership(
                club_id=club_id,
                member_id=member.member_id,
                active_status=data.get("active_status", "Active"),
            )
            db.session.add(new_membership)
            db.session.commit()

        # Return the member details
        return (
            jsonify(
                {
                    "member_id": member.member_id,
                    "student_id": member.student_id,
                    "first_name": member.first_name,
                    "last_name": member.last_name,
                    "email": member.email,
                    "phone_number": member.phone_number,
                    "major": member.major,
                    "graduation_year": member.graduation_year,
                }
            ),
            201,
        )

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


@app.route("/api/clubs/<int:club_id>/members/<int:member_id>", methods=["DELETE"])
def remove_member_from_club(club_id, member_id):
    try:
        # Check if the club exists
        club = db.session.get(Club, club_id)
        if not club:
            return jsonify({"error": "Club not found"}), 404

        # Check if the membership exists
        membership = Membership.query.filter_by(
            club_id=club_id, member_id=member_id
        ).first()
        if not membership:
            return jsonify({"error": "Member not found in this club"}), 404

        # Remove the membership
        db.session.delete(membership)
        db.session.commit()
        return jsonify({"message": "Member removed from the club"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


@app.route("/api/clubs/<int:club_id>/events", methods=["GET"])
def get_events_for_club(club_id):
    events = Event.query.filter_by(club_id=club_id).all()
    return jsonify(
        {
            "events": [
                {
                    "event_id": event.event_id,
                    "event_name": event.event_name,
                    "event_description": event.event_description,
                    "event_date": event.event_date.isoformat(),  # Format date as string
                    "event_time": (
                        event.event_time.strftime("%H:%M:%S")
                        if event.event_time
                        else None
                    ),  # Format time as string
                    "location": event.location,
                }
                for event in events
            ]
        }
    )


@app.route("/api/events/<int:event_id>/attendance", methods=["GET"])
def get_attendance_for_event(event_id):
    attendance = (
        db.session.query(EventAttendance, Member)
        .join(Member)
        .filter(EventAttendance.event_id == event_id)
        .all()
    )

    return jsonify(
        {
            "attendance": [
                {
                    "attendance_id": att.EventAttendance.attendance_id,
                    "member_id": att.EventAttendance.member_id,
                    "attendance_status": att.EventAttendance.attendance_status,
                    "check_in_time": (
                        att.EventAttendance.check_in_time.strftime("%H:%M:%S")
                        if att.EventAttendance.check_in_time
                        else None
                    ),  # Format time
                    "member_name": f"{att.Member.first_name} {att.Member.last_name}",
                }
                for att in attendance
            ]
        }
    )


@app.route("/api/clubs/<int:club_id>/members/search", methods=["GET"])
def search_members(club_id):
    # Get search parameters from the request
    first_name = request.args.get("first_name", "").strip()
    last_name = request.args.get("last_name", "").strip()
    student_id = request.args.get("student_id", "").strip()
    email = request.args.get("email", "").strip()
    major = request.args.get("major", "").strip()
    graduation_year = request.args.get("graduation_year", "").strip()

    try:
        # Build query filters
        filters = [Membership.club_id == club_id]

        if first_name:
            filters.append(Member.first_name.ilike(f"%{first_name}%"))
        if last_name:
            filters.append(Member.last_name.ilike(f"%{last_name}%"))
        if student_id:
            filters.append(Member.student_id.ilike(f"%{student_id}%"))
        if email:
            filters.append(Member.email.ilike(f"%{email}%"))
        if major:
            filters.append(Member.major.ilike(f"%{major}%"))
        if graduation_year:
            filters.append(Member.graduation_year == graduation_year)

        # Query members
        members = db.session.query(Member).join(Membership).filter(and_(*filters)).all()

        if not members:
            return jsonify({"members": []}), 200

        # Format members for JSON response
        member_list = [
            {
                "member_id": member.member_id,
                "first_name": member.first_name,
                "last_name": member.last_name,
                "student_id": member.student_id,
                "email": member.email,
                "phone_number": member.phone_number,
                "major": member.major,
                "graduation_year": member.graduation_year,
            }
            for member in members
        ]

        return jsonify({"members": member_list}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/clubs/<int:club_id>/events/upcoming", methods=["GET"])
def get_upcoming_events(club_id):
    now = datetime.now().date()
    events = Event.query.filter(Event.club_id == club_id, Event.event_date >= now).all()
    return jsonify(
        [
            {
                "event_id": event.event_id,
                "event_name": event.event_name,
                "event_description": event.event_description,
                "event_date": event.event_date.isoformat(),
                "event_time": (
                    event.event_time.isoformat() if event.event_time else None
                ),
                "location": event.location,
            }
            for event in events
        ]
    )


@app.route("/api/clubs/<int:club_id>/events/past", methods=["GET"])
def get_past_events(club_id):
    now = datetime.now().date()
    events = Event.query.filter(Event.club_id == club_id, Event.event_date < now).all()
    return jsonify(
        [
            {
                "event_id": event.event_id,
                "event_name": event.event_name,
                "event_description": event.event_description,
                "event_date": event.event_date.isoformat(),
                "event_time": (
                    event.event_time.isoformat() if event.event_time else None
                ),
                "location": event.location,
            }
            for event in events
        ]
    )


@app.route("/api/clubs/<int:club_id>/sponsors", methods=["GET"])
def get_club_sponsors(club_id):
    sponsors = (
        db.session.query(
            Sponsor.sponsor_id,
            Sponsor.sponsor_name,
            Sponsor.contact_person,
            Sponsor.contact_email,
            Sponsor.phone_number,
            Sponsor.address,
            SponsorshipContribution.contribution_amount,
            SponsorshipContribution.contribution_date,
        )
        .join(
            SponsorshipContribution,
            SponsorshipContribution.sponsor_id == Sponsor.sponsor_id,
        )
        .filter(SponsorshipContribution.club_id == club_id)
        .all()
    )

    sponsor_list = [
        {
            "sponsor_id": sponsor.sponsor_id,
            "sponsor_name": sponsor.sponsor_name,
            "contact_person": sponsor.contact_person,
            "contact_email": sponsor.contact_email,
            "phone_number": sponsor.phone_number,
            "address": sponsor.address,
            "contribution_amount": sponsor.contribution_amount,
            "contribution_date": sponsor.contribution_date,
        }
        for sponsor in sponsors
    ]

    return jsonify({"sponsors": sponsor_list}), 200


@app.route("/api/clubs/<int:club_id>/sponsors", methods=["POST"])
def add_sponsor_or_contribution(club_id):
    data = request.json
    try:
        # Check if sponsor already exists
        sponsor = Sponsor.query.filter_by(sponsor_name=data["sponsor_name"]).first()

        if not sponsor:
            # If sponsor doesn't exist, add to Sponsors table
            sponsor = Sponsor(
                sponsor_name=data["sponsor_name"],
                contact_person=data.get("contact_person"),
                contact_email=data.get("contact_email"),
                phone_number=data.get("phone_number"),
                address=data.get("address"),
            )
            db.session.add(sponsor)
            db.session.commit()

        # Convert contribution_date to datetime.date
        contribution_date = datetime.strptime(
            data["contribution_date"], "%Y-%m-%d"
        ).date()

        # Add a new contribution to the SponsorshipContribution table
        sponsorship = SponsorshipContribution(
            sponsor_id=sponsor.sponsor_id,
            club_id=club_id,
            contribution_amount=data["contribution_amount"],
            contribution_date=contribution_date,
        )
        db.session.add(sponsorship)
        db.session.commit()

        return jsonify({"message": "Sponsor contribution added successfully"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


@app.route("/api/clubs/<int:club_id>/budget", methods=["GET"])
def get_club_budget(club_id):
    fiscal_year = request.args.get("fiscal_year", type=int)

    if not fiscal_year:
        return jsonify({"error": "Fiscal year is required"}), 400

    budget = Budget.query.filter_by(club_id=club_id, fiscal_year=fiscal_year).first()
    if not budget:
        return jsonify({"message": "No budget data found"}), 404

    # Calculate spent amount from Expenses table
    spent = (
        db.session.query(db.func.sum(Expense.amount))
        .filter(
            Expense.club_id == club_id,
            Expense.expense_date.between(
                f"{fiscal_year}-01-01", f"{fiscal_year}-12-31"
            ),
        )
        .scalar()
        or 0
    )

    remaining = budget.total_budget - spent

    # Format the response
    budget_details = {
        "fiscal_year": budget.fiscal_year,
        "total_budget": budget.total_budget,
        "spent_amount": spent,
        "remaining_amount": remaining,
    }

    return jsonify({"budget": budget_details}), 200


@app.route("/api/clubs/<int:club_id>/budget/years", methods=["GET"])
def get_budget_years(club_id):
    fiscal_years = (
        db.session.query(Budget.fiscal_year)
        .filter(Budget.club_id == club_id)
        .distinct()
        .order_by(Budget.fiscal_year.desc())
        .all()
    )
    fiscal_years_list = [year[0] for year in fiscal_years]
    return jsonify({"fiscal_years": fiscal_years_list}), 200

from flask import jsonify, request
from models import db, Budget

@app.route('/api/clubs/<int:club_id>/budget/update', methods=['PUT'])
def update_budget(club_id):
    data = request.json

    try:
        # Validate input data
        fiscal_year = data.get("fiscal_year")
        total_budget = data.get("total_budget")

        if not fiscal_year or not total_budget:
            return jsonify({"error": "fiscal_year and total_budget are required"}), 400

        # Retrieve the budget record for the specified club and fiscal year
        budget = Budget.query.filter_by(club_id=club_id, fiscal_year=fiscal_year).first()

        if not budget:
            return jsonify({"error": "Budget record not found for the given fiscal year"}), 404

        # Update the total_budget and recalculate remaining_amount
        budget.total_budget = total_budget
        budget.remaining_amount = total_budget - budget.spent_amount

        # Commit changes to the database
        db.session.commit()

        return jsonify({
            "fiscal_year": budget.fiscal_year,
            "total_budget": budget.total_budget,
            "spent_amount": budget.spent_amount,
            "remaining_amount": budget.remaining_amount,
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500



# Main entry point
if __name__ == "__main__":
    # Create the tables if they don't exist
    with app.app_context():
        db.create_all()

    # Run the Flask app on localhost:5000
    app.run(debug=True, host="0.0.0.0", port=5001)
