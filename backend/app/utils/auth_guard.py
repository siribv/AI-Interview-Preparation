import jwt
from functools import wraps
from datetime import datetime, timedelta, timezone
from flask import request, jsonify, current_app
from app.models.user import User

def generate_token(user_id: int) -> str:
    """Generates a signed JWT access token valid for 24 hours."""
    payload = {
        "sub": user_id,
        "iat": datetime.now(timezone.utc),
        "exp": datetime.now(timezone.utc) + timedelta(hours=24),
    }
    secret = current_app.config["SECRET_KEY"]
    token = jwt.encode(payload, secret, algorithm="HS256")
    return token

def token_required(f):
    """Decorator to require a valid Bearer JWT in the Authorization header."""
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", None)
        if not auth_header:
            return jsonify({
                "success": False,
                "message": "Authorization token is missing. Please log in."
            }), 401

        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != "bearer":
            return jsonify({
                "success": False,
                "message": "Invalid Authorization header format. Expected 'Bearer <token>'."
            }), 401

        token = parts[1]
        try:
            payload = jwt.decode(token, current_app.config["SECRET_KEY"], algorithms=["HS256"])
            user_id = payload.get("sub")
            current_user = User.query.get(user_id)
            if not current_user:
                return jsonify({
                    "success": False,
                    "message": "User associated with token no longer exists."
                }), 401
        except jwt.ExpiredSignatureError:
            return jsonify({
                "success": False,
                "message": "Session expired. Please log in again."
            }), 401
        except jwt.InvalidTokenError:
            return jsonify({
                "success": False,
                "message": "Invalid authentication token. Please log in."
            }), 401

        return f(current_user, *args, **kwargs)

    return decorated
