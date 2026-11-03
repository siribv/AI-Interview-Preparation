from flask import Blueprint, jsonify
from app.models.interview import JobRole

roles_bp = Blueprint("roles", __name__, url_prefix="/api/roles")

@roles_bp.route("", methods=["GET"])
def get_roles():
    """Returns list of active job roles with skill tags."""
    roles = JobRole.query.filter_by(is_active=True).all()
    return jsonify({
        "success": True,
        "roles": [r.to_dict() for r in roles]
    }), 200

@roles_bp.route("/<int:role_id>", methods=["GET"])
def get_role_details(role_id):
    """Returns detailed information for a single job role."""
    role = JobRole.query.get(role_id)
    if not role:
        return jsonify({"success": False, "message": "Job role not found."}), 404
    return jsonify({
        "success": True,
        "role": role.to_dict()
    }), 200
