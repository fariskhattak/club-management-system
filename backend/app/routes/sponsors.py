from flask import Blueprint, jsonify, request
from app.models import db, Sponsor, SponsorshipContribution
from datetime import datetime
from sqlalchemy import and_

# Define the blueprint
sponsors_bp = Blueprint("sponsors", __name__)

# Route to get all registered sponsors
@sponsors_bp.route("/", methods=["GET"])
def get_all_sponsors():
    """
    Retrieve all sponsors across all clubs.
    """
    try:
        # Query all sponsors
        sponsors = Sponsor.query.all()

        # Format sponsors for JSON response
        sponsor_list = [
            {
                "sponsor_id": sponsor.sponsor_id,
                "sponsor_name": sponsor.sponsor_name,
                "contact_person": sponsor.contact_person,
                "contact_email": sponsor.contact_email,
                "phone_number": sponsor.phone_number,
                "address": sponsor.address,
            }
            for sponsor in sponsors
        ]

        return jsonify({"sponsors": sponsor_list}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Route to find all sponsors associated with a club
@sponsors_bp.route("/<int:club_id>", methods=["GET"])
def get_club_sponsors(club_id):
    sponsors = (
        db.session.query(
            Sponsor.sponsor_id,
            Sponsor.sponsor_name,
            Sponsor.contact_person,
            Sponsor.contact_email,
            Sponsor.phone_number,
            Sponsor.address,
            SponsorshipContribution.sponsorship_id,
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
            "sponsorship_id": sponsor.sponsorship_id,
            "contribution_amount": sponsor.contribution_amount,
            "contribution_date": sponsor.contribution_date.isoformat(),
        }
        for sponsor in sponsors
    ]

    return jsonify({"sponsors": sponsor_list}), 200


# Route to add a new sponsor and/or sponsorship contribution
@sponsors_bp.route("/<int:club_id>", methods=["POST"])
def add_sponsor_or_contribution(club_id):
    data = request.json
    if not data.get("sponsor_name") or not data.get("contribution_amount") or not data.get("contribution_date"):
        return jsonify({"error": "Missing required fields: sponsor_name, contribution_amount, or contribution_date"}), 400

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
    

# Route to search sponsors that contribute to a club based on params
@sponsors_bp.route("/<int:club_id>/search", methods=["GET"])
def search_sponsors(club_id):
    # Get search parameters from the request
    sponsor_name = request.args.get("sponsor_name", "").strip()
    contact_person = request.args.get("contact_person", "").strip()
    contact_email = request.args.get("contact_email", "").strip()
    from_date = request.args.get("from_date", "").strip()  # Search from this date onwards
    to_date = request.args.get("to_date", "").strip()  # Search up to this date

    try:
        # Build query filters
        filters = [SponsorshipContribution.club_id == club_id]

        if sponsor_name:
            filters.append(Sponsor.sponsor_name.ilike(f"%{sponsor_name}%"))
        if contact_person:
            filters.append(Sponsor.contact_person.ilike(f"%{contact_person}%"))
        if contact_email:
            filters.append(Sponsor.contact_email.ilike(f"%{contact_email}%"))
        if from_date:
            from_date_obj = datetime.strptime(from_date, "%Y-%m-%d").date()
            filters.append(SponsorshipContribution.contribution_date >= from_date_obj)
        if to_date:
            to_date_obj = datetime.strptime(to_date, "%Y-%m-%d").date()
            filters.append(SponsorshipContribution.contribution_date <= to_date_obj)

        # Query sponsors
        sponsors = (
            db.session.query(
                Sponsor.sponsor_id,
                Sponsor.sponsor_name,
                Sponsor.contact_person,
                Sponsor.contact_email,
                Sponsor.phone_number,
                Sponsor.address,
                SponsorshipContribution.sponsorship_id,
                SponsorshipContribution.contribution_amount,
                SponsorshipContribution.contribution_date,
            )
            .join(
                SponsorshipContribution,
                SponsorshipContribution.sponsor_id == Sponsor.sponsor_id,
            )
            .filter(and_(*filters))
            .all()
        )

        if not sponsors:
            return jsonify({"sponsors": []}), 200

        # Format sponsors for JSON response
        sponsor_list = [
            {
                "sponsor_id": sponsor.sponsor_id,
                "sponsor_name": sponsor.sponsor_name,
                "contact_person": sponsor.contact_person,
                "contact_email": sponsor.contact_email,
                "phone_number": sponsor.phone_number,
                "address": sponsor.address,
                "sponsorship_id": sponsor.sponsorship_id,
                "contribution_amount": sponsor.contribution_amount,
                "contribution_date": sponsor.contribution_date.isoformat(),
            }
            for sponsor in sponsors
        ]

        return jsonify({"sponsors": sponsor_list}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

# Delete a sponsorhip contribution from a club
@sponsors_bp.route("/<int:club_id>/<int:sponsorship_id>", methods=["DELETE"])
def delete_sponsorship_contribution(club_id, sponsorship_id):
    try:
        # Find the sponsorship contribution by club_id and sponsorship_id
        contribution = SponsorshipContribution.query.filter_by(
            club_id=club_id, sponsorship_id=sponsorship_id
        ).first()

        if not contribution:
            return jsonify({"error": "Sponsorship contribution not found"}), 404

        # Delete the sponsorship contribution
        db.session.delete(contribution)
        db.session.commit()
        return jsonify({"message": "Sponsorship contribution deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500