import re
from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.user import User
from app.utils.auth_guard import generate_token, token_required

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

EMAIL_REGEX = r"^[\w\.-]+@[\w\.-]+\.\w+$"

@auth_bp.route("/register", methods=["POST"])
def register():
    """Register a new student account."""
    data = request.get_json() or {}
    
    full_name = data.get("full_name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    college = data.get("college", "").strip()
    target_role = data.get("target_role", "Full Stack Developer").strip()

    # Validation
    if not full_name:
        return jsonify({"success": False, "message": "Full name is required."}), 400
    if not email or not re.match(EMAIL_REGEX, email):
        return jsonify({"success": False, "message": "Please enter a valid email address."}), 400
    if not password or len(password) < 6:
        return jsonify({"success": False, "message": "Password must be at least 6 characters long."}), 400

    # Check if user already exists
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"success": False, "message": "An account with this email already exists."}), 409

    # Create new user with bcrypt-hashed password
    new_user = User(
        full_name=full_name,
        email=email,
        college=college or None,
        target_role=target_role or "Full Stack Developer",
    )
    new_user.set_password(password)

    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": f"Database error during registration: {str(e)}"}), 500

    token = generate_token(new_user.id)
    return jsonify({
        "success": True,
        "message": "Student registration successful!",
        "token": token,
        "user": new_user.to_dict(),
    }), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    """Authenticate student and return JWT token."""
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"success": False, "message": "Both email and password are required."}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"success": False, "message": "Invalid email or password."}), 401

    token = generate_token(user.id)
    return jsonify({
        "success": True,
        "message": f"Welcome back, {user.full_name}!",
        "token": token,
        "user": user.to_dict(),
    }), 200

@auth_bp.route("/profile", methods=["GET"])
@token_required
def get_profile(current_user):
    """Retrieve logged-in student profile."""
    return jsonify({
        "success": True,
        "user": current_user.to_dict(),
    }), 200

@auth_bp.route("/profile", methods=["PUT"])
@token_required
def update_profile(current_user):
    """Update profile information for the authenticated user."""
    data = request.get_json() or {}
    
    if "full_name" in data and data["full_name"].strip():
        current_user.full_name = data["full_name"].strip()
    if "college" in data:
        current_user.college = data["college"].strip()
    if "target_role" in data and data["target_role"].strip():
        current_user.target_role = data["target_role"].strip()
    if "degree" in data and data["degree"].strip():
        current_user.degree = data["degree"].strip()

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": f"Could not update profile: {str(e)}"}), 500

    return jsonify({
        "success": True,
        "message": "Profile updated successfully.",
        "user": current_user.to_dict(),
    }), 200
