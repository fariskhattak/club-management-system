from flask import Blueprint, jsonify, request
from app.models import db, Event, Student, EventAttendance
from datetime import datetime

# Define the blueprint
events_bp = Blueprint("events", __name__)

@events_bp.route("/<int:event_id>/attendance", methods=["GET"])
def get_attendance_for_event(event_id):
    attendance = (
        db.session.query(EventAttendance, Student)
        .join(Student)
        .filter(EventAttendance.event_id == event_id)
        .all()
    )

    return jsonify(
        {
            "attendance": [
                {
                    "attendance_id": att.EventAttendance.attendance_id,
                    "student_id": att.EventAttendance.student_id,
                    "attendance_status": att.EventAttendance.attendance_status,
                    "check_in_time": (
                        att.EventAttendance.check_in_time.strftime("%H:%M:%S")
                        if att.EventAttendance.check_in_time
                        else None
                    ),  # Format time
                    "member_name": f"{att.Student.first_name} {att.Student.last_name}",
                }
                for att in attendance
            ]
        }
    )


# Route to get all events for a club
@events_bp.route("/<int:club_id>", methods=["GET"])
def get_events_for_club(club_id):
    events = Event.query.filter_by(club_id=club_id).all()
    return jsonify({
        "events": [{
            "event_id": event.event_id,
            "event_name": event.event_name,
            "event_description": event.event_description,
            "event_date": event.event_date.isoformat(),
            "event_time": event.event_time.strftime("%H:%M:%S") if event.event_time else None,
            "location": event.location,
        } for event in events]
    })


# Route to get all events in the future from present date
@events_bp.route("/<int:club_id>/upcoming", methods=["GET"])
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


# Route to get all events that occurred before present date
@events_bp.route("/<int:club_id>/past", methods=["GET"])
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


@events_bp.route("/<int:club_id>/events", methods=["POST"])
def add_event(club_id):
    data = request.json
    try:
        # Validate required fields
        required_fields = ["event_name", "event_description", "event_date", "event_time", "location"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"'{field}' is required"}), 400

        # Add the event
        new_event = Event(
            event_name=data["event_name"],
            event_description=data["event_description"],
            event_date=datetime.strptime(data["event_date"], "%Y-%m-%d").date(),
            event_time=datetime.strptime(data["event_time"], "%H:%M:%S").time(),
            location=data["location"],
            club_id=club_id,
        )
        db.session.add(new_event)
        db.session.commit()
        return jsonify({"message": "Event added successfully"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    

@events_bp.route("/<int:club_id>/<int:event_id>", methods=["DELETE"])
def delete_event(club_id, event_id):
    try:
        # Find the event
        event = Event.query.filter_by(event_id=event_id, club_id=club_id).first()
        if not event:
            return jsonify({"error": "Event not found for the specified club"}), 404

        # Delete associated attendance records
        db.session.query(EventAttendance).filter_by(event_id=event_id).delete()

        # Delete the event
        db.session.delete(event)
        db.session.commit()
        return jsonify({"message": "Event and associated attendance records deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@events_bp.route("/<int:event_id>/attendance", methods=["POST"])
def add_event_attendance(event_id):
    """
    Add an attendance record for a specific event.
    """
    try:
        data = request.json

        # Ensure the event exists
        event = Event.query.filter_by(event_id=event_id).first()
        if not event:
            return jsonify({"error": "Event not found"}), 404

        # Check if the student is a registered student
        student = Student.query.filter_by(student_id=data["student_id"]).first()
        if not student:
            return jsonify({"error": "Student is not registered"}), 400

        # Check if the member has already attended the event
        existing_attendance = EventAttendance.query.filter_by(
            event_id=event_id, student_id=data["student_id"]
        ).first()
        if existing_attendance:
            return jsonify({"error": "Student has already been recorded for this event"}), 400

        # Validate and convert check_in_time
        try:
            check_in_time = (
                datetime.strptime(data["check_in_time"], "%H:%M").time()
                if data.get("check_in_time")
                else None
            )
        except ValueError:
            return jsonify({"error": "Invalid time format. Use HH:MM"}), 400

        # Create a new attendance record
        new_attendance = EventAttendance(
            event_id=event_id,
            student_id=data["student_id"],
            attendance_status=data["attendance_status"],
            check_in_time=check_in_time,
        )

        db.session.add(new_attendance)
        db.session.commit()
        return jsonify({"message": "Attendance record added successfully"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500



@events_bp.route("/<int:event_id>/attendance/<string:attendance_id>", methods=["DELETE"])
def remove_event_attendance(event_id, attendance_id):
    try:
        # Validate that the event exists
        event = Event.query.filter_by(event_id=event_id).first()
        if not event:
            return jsonify({"error": "Event not found"}), 404

        # Check if the attendance record exists
        attendance = EventAttendance.query.filter_by(event_id=event_id, attendance_id=attendance_id).first()
        if not attendance:
            return jsonify({"error": "Attendance record not found"}), 404

        # Check if the member is actually associated with the attendance record
        student_id = attendance.student_id
        member_exists = Student.query.filter_by(student_id=student_id).first()
        if not member_exists:
            return jsonify({"error": "Student record not found for this attendance"}), 400

        # Delete the attendance record
        db.session.delete(attendance)
        db.session.commit()
        return jsonify({"message": "Attendance record removed successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
