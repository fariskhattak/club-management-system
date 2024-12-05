from flask import Blueprint, jsonify, request
from flask_cors import CORS
from sqlalchemy import and_
from datetime import datetime
from app.models import (
    db,
    Club,
    ClubRole,
    EventHosting,
    Student,
    SponsorshipContribution,
    Expense,
    Membership,
    Budget,
    Event,
    EventAttendance,
    Role,
    ClubRole
)

# Define the blueprint
clubs_bp = Blueprint("clubs", __name__)

# Route to get all clubs
@clubs_bp.route("/", methods=["GET"])
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


# Route to add a new club
@clubs_bp.route("/", methods=["POST"])
def add_club():
    data = request.json
    print(data)
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
@clubs_bp.route("/<int:club_id>", methods=["PUT"])
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

# Delete a club by ID
@clubs_bp.route("/<int:club_id>", methods=["DELETE"])
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
    
# Route to find all members part of specific club
@clubs_bp.route("/<int:club_id>/members", methods=["GET"])
def get_club_members(club_id):
    # Query to find members associated with the club_id
    members = (
        db.session.query(Student)
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


# Route to add a new member to a club
@clubs_bp.route("/<int:club_id>/members", methods=["POST"])
def add_member_to_club(club_id):
    data = request.json

    # Check if the club exists
    club = db.session.get(Club, club_id)
    if not club:
        return jsonify({"error": "Club not found"}), 404

    try:
        # Check if the member already exists
        member = Student.query.filter_by(student_id=data["student_id"]).first()
        if not member:
            # Create a new member if they don't exist
            member = Student(
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
            club_id=club_id, student_id=member.student_id
        ).first()
        if membership:
            return jsonify({"message": "Member already exists in this club"}), 200
        if not membership:
            # Link the member to the club if not already linked
            new_membership = Membership(
                club_id=club_id,
                student_id=member.student_id,
                active_status=data.get("active_status", "Active"),
            )
            db.session.add(new_membership)
            db.session.commit()

        # Return the member details
        return (
            jsonify(
                {
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
    
# Remove a student from a membership of a club
@clubs_bp.route("/<int:club_id>/members/<string:student_id>", methods=["DELETE"])
def remove_member_from_club(club_id, student_id):
    try:
        # Check if the club exists
        club = db.session.get(Club, club_id)
        if not club:
            return jsonify({"error": "Club not found"}), 404

        # Check if the membership exists
        membership = Membership.query.filter_by(
            club_id=club_id, student_id=student_id
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
    

# Route to find members in a club based on search params
@clubs_bp.route("/<int:club_id>/members/search", methods=["GET"])
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
            filters.append(Student.first_name.ilike(f"%{first_name}%"))
        if last_name:
            filters.append(Student.last_name.ilike(f"%{last_name}%"))
        if student_id:
            filters.append(Student.student_id.ilike(f"%{student_id}%"))
        if email:
            filters.append(Student.email.ilike(f"%{email}%"))
        if major:
            filters.append(Student.major.ilike(f"%{major}%"))
        if graduation_year:
            filters.append(Student.graduation_year == graduation_year)

        # Query members
        members = db.session.query(Student).join(Membership).filter(and_(*filters)).all()

        if not members:
            return jsonify({"members": []}), 200

        # Format members for JSON response
        member_list = [
            {
                "student_id": member.student_id,
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
    

# Get the budget of a club based on the provided fiscal year
@clubs_bp.route("/<int:club_id>/budget", methods=["GET"])
def get_club_budget(club_id):
    fiscal_year = request.args.get("fiscal_year", type=int)

    if not fiscal_year:
        return jsonify({"error": "Fiscal year is required"}), 400

    budget = Budget.query.filter_by(club_id=club_id, fiscal_year=fiscal_year).first()
    if not budget:
        return jsonify({"message": "No budget data found"}), 404

    # Calculate spent amount from Expenses table
    spent = (
        db.session.query(db.func.sum(Expense.expense_amount))
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
        "budget_id": budget.budget_id,
        "fiscal_year": budget.fiscal_year,
        "total_budget": budget.total_budget,
        "spent_amount": spent,
        "remaining_amount": remaining,
    }

    return jsonify({"budget": budget_details}), 200


# Route to find all fiscal years stored for a club
@clubs_bp.route("/<int:club_id>/budget/years", methods=["GET"])
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


# Route to update a clubs budget
@clubs_bp.route('/<int:club_id>/budget/update', methods=['PUT'])
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

        # Calculate the spent amount dynamically from the Expenses table
        spent_amount = db.session.query(
            db.func.sum(Expense.expense_amount)
        ).filter(
            Expense.club_id == club_id,
            Expense.budget_id == budget.budget_id
        ).scalar() or 0

        # Update the total_budget and remaining_amount
        budget.total_budget = total_budget
        remaining_amount = total_budget - spent_amount

        # Commit changes to the database
        db.session.commit()

        return jsonify({
            "fiscal_year": budget.fiscal_year,
            "total_budget": budget.total_budget,
            "spent_amount": spent_amount,
            "remaining_amount": remaining_amount,
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    

# Add a budget to a club with a new fiscal year
@clubs_bp.route("/<int:club_id>/budget", methods=["POST"])
def add_budget(club_id):
    data = request.json
    try:
        # Validate input
        fiscal_year = data.get("fiscal_year")
        total_budget = data.get("total_budget")

        if not fiscal_year or not total_budget:
            return jsonify({"error": "Fiscal year and total budget are required"}), 400

        # Check if a budget already exists for the same fiscal year
        existing_budget = Budget.query.filter_by(club_id=club_id, fiscal_year=fiscal_year).first()
        if existing_budget:
            return jsonify({"error": "Budget for this fiscal year already exists"}), 400

        # Create the new budget
        new_budget = Budget(
            club_id=club_id,
            fiscal_year=fiscal_year,
            total_budget=total_budget,
        )
        db.session.add(new_budget)
        db.session.commit()

        return jsonify({"message": "Budget added successfully"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    

@clubs_bp.route("/<int:club_id>/officers", methods=["GET"])
def get_club_officers(club_id):
    try:
        # Query the ClubRoles and join with Students and Roles tables
        officers = (
            db.session.query(
                Student.student_id,
                Student.first_name,
                Student.last_name,
                Student.email,
                Student.phone_number,
                Role.role_id,
                Role.role_name,
                Role.role_description,
            )
            .join(ClubRole, ClubRole.student_id == Student.student_id)
            .join(Role, ClubRole.role_id == Role.role_id)
            .filter(ClubRole.club_id == club_id)
            .all()
        )

        # If no officers are found, return an empty array
        if not officers:
            return jsonify({"officers": []}), 200

        # Format the response
        officer_list = [
            {
                "student_id": officer.student_id,
                "first_name": officer.first_name,
                "last_name": officer.last_name,
                "email": officer.email,
                "phone_number": officer.phone_number,
                "role_id": officer.role_id,
                "role_name": officer.role_name,
                "role_description": officer.role_description,
            }
            for officer in officers
        ]

        return jsonify({"officers": officer_list}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    

@clubs_bp.route("/<int:club_id>/officers", methods=["POST"])
def add_officer_to_club(club_id):
    """
    Add an officer to a specific club, ensuring they are a member first.
    """
    data = request.json
    student_id = data.get("student_id")
    role_id = data.get("role_id")

    if not student_id or not role_id:
        return jsonify({"error": "student_id and role_id are required"}), 400

    try:
        # Check if the student is a member of the club
        membership = Membership.query.filter_by(club_id=club_id, student_id=student_id).first()
        if not membership:
            return jsonify({"error": "Student is not a member of the club"}), 400

        # Check if the officer already exists in the ClubRole table
        existing_officer = ClubRole.query.filter_by(
            club_id=club_id, student_id=student_id, role_id=role_id
        ).first()
        if existing_officer:
            return jsonify({"error": "Student already holds this role in the club"}), 400

        # Add the officer
        new_officer = ClubRole(club_id=club_id, student_id=student_id, role_id=role_id)
        db.session.add(new_officer)
        db.session.commit()

        return jsonify({"message": "Officer added successfully"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500



@clubs_bp.route("/<int:club_id>/officers/<string:student_id>/<int:role_id>", methods=["DELETE"])
def delete_officer_from_club(club_id, student_id, role_id):
    """
    Delete an officer from a specific club.
    """
    try:
        # Check if the officer exists in the ClubRole table
        officer = ClubRole.query.filter_by(
            club_id=club_id, student_id=student_id, role_id=role_id
        ).first()
        if not officer:
            return jsonify({"error": "Officer not found in this role for the club"}), 404

        # Remove the officer
        db.session.delete(officer)
        db.session.commit()

        return jsonify({"message": "Officer removed successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
