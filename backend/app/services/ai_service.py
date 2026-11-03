import os
import json
import logging
from flask import current_app

logger = logging.getLogger(__name__)

# Safe import for the official Google GenAI SDK (google-genai)
try:
    from google import genai
    from google.genai import types
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False
    logger.warning("google-genai SDK not installed. Defaulting to fallback question/evaluation provider.")

def get_genai_client():
    """Initializes and returns a Google GenAI Client if API key is configured."""
    api_key = current_app.config.get("GEMINI_API_KEY") or os.getenv("GEMINI_API_KEY")
    if not api_key:
        logger.warning("GEMINI_API_KEY is not set in environment or config.")
        return None
    if not GENAI_AVAILABLE:
        logger.warning("google-genai library is not available.")
        return None
    try:
        return genai.Client(api_key=api_key)
    except Exception as e:
        logger.error(f"Error creating GenAI client: {e}")
        return None

def generate_interview_questions(role_name: str, difficulty: str = "beginner", count: int = 5, topic: str = None) -> list:
    """
    Generates tailored interview questions for a job role using Gemini or structured defaults.
    """
    client = get_genai_client()
    if client:
        try:
            topic_clause = f"focusing on the topic '{topic}'" if topic else "covering core fundamentals, coding, and HR"
            prompt = f"""
You are an expert technical interviewer for the job role: {role_name}.
Generate exactly {count} interview questions at {difficulty.upper()} difficulty level {topic_clause}.

Return ONLY a valid JSON array of objects with these exact keys:
[
  {{
    "question_text": "Detailed question prompt",
    "question_type": "technical" | "coding" | "hr",
    "difficulty": "{difficulty}",
    "topic": "Specific subject topic",
    "expected_concepts": "Key bullet points/concepts expected in a good answer",
    "sample_answer": "Model standard answer"
  }}
]
Do not wrap in markdown quotes if possible, or return raw JSON.
"""
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
            )
            raw_text = response.text.strip()
            # Clean possible markdown code fences
            if raw_text.startswith("```"):
                raw_text = raw_text.strip("`").removeprefix("json").strip()
            return json.loads(raw_text)
        except Exception as err:
            logger.error(f"Gemini generation error: {err}. Using fallback questions.")

    # Fallback questions when API key is missing or quota exceeded
    return [
        {
            "question_text": f"Explain the core architecture and fundamental principles used in modern {role_name} workflows.",
            "question_type": "technical",
            "difficulty": difficulty,
            "topic": "Architecture & Fundamentals",
            "expected_concepts": "Component modularity, separation of concerns, scalability, error handling",
            "sample_answer": f"In a {role_name} environment, the architecture emphasizes modular layers, robust state/data pipelines, and standard design patterns."
        },
        {
            "question_text": "Describe the difference between synchronous and asynchronous operations, and when you would prefer one over the other.",
            "question_type": "technical",
            "difficulty": difficulty,
            "topic": "Asynchronous Processing",
            "expected_concepts": "Non-blocking I/O, event loops, latency optimization, concurrency",
            "sample_answer": "Synchronous operations execute sequentially blocking subsequent tasks, whereas asynchronous execution leverages event-driven loops or worker threads for non-blocking I/O."
        },
        {
            "question_text": "How do you optimize SQL database queries and design schemas to prevent performance bottlenecks?",
            "question_type": "technical",
            "difficulty": difficulty,
            "topic": "Database Optimization",
            "expected_concepts": "Indexing (B-Tree), Normalization, EXPLAIN query plans, avoiding N+1 queries",
            "sample_answer": "Performance is optimized via strategic indexing on foreign keys and filter columns, database normalization, query execution plan inspection, and connection pooling."
        },
        {
            "question_text": "Given an array of integers, describe how you would find pairs that sum to a specific target in O(N) time complexity.",
            "question_type": "coding",
            "difficulty": difficulty,
            "topic": "Data Structures & Hash Maps",
            "expected_concepts": "Hash Set / Hash Map lookup, complement calculation (target - num), O(N) time and O(N) space",
            "sample_answer": "Traverse the array once while storing seen numbers in a hash map or hash set. For each element x, check if (target - x) already exists in the set."
        },
        {
            "question_text": "Tell me about a complex project challenge you faced and how you collaborated with your team to deliver on time.",
            "question_type": "hr",
            "difficulty": difficulty,
            "topic": "Behavioral & Teamwork",
            "expected_concepts": "STAR method (Situation, Task, Action, Result), communication, problem-solving mindset",
            "sample_answer": "I use the STAR method: articulate the initial bottleneck, define the team objective, detail my individual contribution and communication cadence, and conclude with measurable impact."
        }
    ][:count]

def evaluate_interview_answer(question_text: str, user_answer: str, expected_concepts: str = "", role_name: str = "Software Engineer") -> dict:
    """
    Evaluates a student's answer using Gemini API with structured scoring out of 10.
    """
    client = get_genai_client()
    if client:
        try:
            prompt = f"""
You are a senior hiring manager and technical interviewer evaluating a student's response.
Job Role: {role_name}
Question: {question_text}
Expected Concepts: {expected_concepts}
Student's Answer: {user_answer}

Evaluate the student's answer and return ONLY a valid JSON object with these keys:
{{
  "score": float between 1.0 and 10.0,
  "conceptual_accuracy_score": float between 1.0 and 10.0,
  "clarity_score": float between 1.0 and 10.0,
  "strengths": "1-2 sentences highlighting what the student explained well",
  "missing_concepts": "Key points or technical details the student omitted",
  "feedback": "Constructive, supportive feedback for improvement",
  "improved_answer": "An industry-standard model answer demonstrating full mastery"
}}
"""
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
            )
            raw_text = response.text.strip()
            if raw_text.startswith("```"):
                raw_text = raw_text.strip("`").removeprefix("json").strip()
            return json.loads(raw_text)
        except Exception as err:
            logger.error(f"Gemini evaluation error: {err}. Using rule-based evaluator.")

    # Rule-based fallback evaluator when API is offline
    word_count = len(user_answer.strip().split())
    base_score = 5.0
    if word_count > 40:
        base_score += 2.5
    if word_count > 80:
        base_score += 1.5

    return {
        "score": min(base_score, 9.0),
        "conceptual_accuracy_score": min(base_score, 8.5),
        "clarity_score": 8.0,
        "strengths": "Answer shows a clear foundational understanding and direct response to the prompt.",
        "missing_concepts": expected_concepts or "Could include deeper performance trade-offs and edge-case handling.",
        "feedback": "Good effort! Try to structure answers using: Core definition, internal mechanism, and real-world application.",
        "improved_answer": "A comprehensive answer defines the concept precisely, explains the underlying data structures or execution model, and mentions production trade-offs (e.g. time/space complexity)."
    }
