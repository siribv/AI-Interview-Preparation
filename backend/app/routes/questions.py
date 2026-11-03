from flask import Blueprint, request, jsonify
from app.models.interview import JobRole, Question
from app.services.ai_service import generate_interview_questions, evaluate_interview_answer
from app.utils.auth_guard import token_required

questions_bp = Blueprint("questions", __name__, url_prefix="/api/questions")

@questions_bp.route("/generate", methods=["GET"])
def generate():
    """Generates questions for a job role and difficulty using Gemini or structured fallback."""
    role_id = request.args.get("role_id", type=int)
    role_slug = request.args.get("slug", "full-stack-developer")
    difficulty = request.args.get("difficulty", "beginner").lower()
    topic = request.args.get("topic", None)
    count = request.args.get("count", 5, type=int)

    role_name = "Full Stack Developer"
    if role_id:
        role = JobRole.query.get(role_id)
        if role:
            role_name = role.role_name
    elif role_slug:
        role = JobRole.query.filter_by(slug=role_slug).first()
        if role:
            role_name = role.role_name

    questions = generate_interview_questions(
        role_name=role_name,
        difficulty=difficulty,
        count=min(count, 10),
        topic=topic
    )

    return jsonify({
        "success": True,
        "role": role_name,
        "difficulty": difficulty,
        "count": len(questions),
        "questions": questions
    }), 200

@questions_bp.route("/evaluate", methods=["POST"])
@token_required
def evaluate(current_user):
    """Evaluates a submitted answer with AI semantic comparison and scores out of 10."""
    data = request.get_json() or {}
    question_text = data.get("question_text", "").strip()
    user_answer = data.get("user_answer", "").strip()
    expected_concepts = data.get("expected_concepts", "")
    role_name = data.get("role_name", current_user.target_role or "Software Engineer")

    if not question_text or not user_answer:
        return jsonify({
            "success": False,
            "message": "Both question_text and user_answer are required for evaluation."
        }), 400

    evaluation = evaluate_interview_answer(
        question_text=question_text,
        user_answer=user_answer,
        expected_concepts=expected_concepts,
        role_name=role_name
    )

    return jsonify({
        "success": True,
        "evaluation": evaluation
    }), 200
