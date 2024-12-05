from flask import Blueprint, jsonify
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