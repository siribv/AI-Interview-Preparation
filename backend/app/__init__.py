import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from app.config import config_by_name
from app.extensions import db, bcrypt

def create_app(config_name=None):
    """Application factory for Flask backend."""
    if not config_name:
        config_name = os.getenv("FLASK_ENV", "development")

    app = Flask(__name__)
    app.config.from_object(config_by_name.get(config_name, config_by_name["default"]))

    # Enable robust CORS for React frontend (supports localhost:5173, 127.0.0.1:5173, etc.)
    CORS(
        app,
        resources={r"/api/*": {"origins": "*"}},
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    )

    # Global preflight and CORS header safeguard
    @app.after_request
    def add_cors_headers(response):
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
        response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
        return response

    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)

    # Health check route
    @app.route("/api/health", methods=["GET"])
    def health():
        return jsonify({
            "status": "healthy",
            "service": "AI Interview Platform API",
            "version": "1.0.0"
        }), 200

    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.roles import roles_bp
    from app.routes.questions import questions_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(roles_bp)
    app.register_blueprint(questions_bp)

    return app
