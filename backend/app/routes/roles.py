from flask import Blueprint, jsonify
from app.models import Role

# Define the blueprint
roles_bp = Blueprint("roles", __name__)

# Route to fetch all roles
@roles_bp.route("/", methods=["GET"])
def get_roles():
    try:
        # Query all roles
        roles = Role.query.all()

        # Format the response
        role_list = [
            {
                "role_id": role.role_id,
                "role_name": role.role_name,
                "role_description": role.role_description,
            }
            for role in roles
        ]

        return jsonify({"roles": role_list}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500