from flask import Blueprint, jsonify
from app.models import Student

# Define the blueprint
students_bp = Blueprint("students", __name__)

# Route to fetch all students
@students_bp.route('/', methods=['GET'])
def get_all_students():
    try:
        # Fetch all students from the database
        students = Student.query.all()

        # Format the students into a list of dictionaries
        student_list = [
            {
                "student_id": student.student_id,
                "first_name": student.first_name,
                "last_name": student.last_name,
                "email": student.email,
                "phone_number": student.phone_number,
                "major": student.major,
                "graduation_year": student.graduation_year,
            }
            for student in students
        ]

        return jsonify({"students": student_list}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500