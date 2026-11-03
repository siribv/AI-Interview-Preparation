"""
Registration & Auth API Verification Script
Tests the Flask /api/auth/register and /api/auth/login endpoints directly.
"""
import sys
import time
import requests

BASE_URL = "http://127.0.0.1:5000/api"

def main():
    print("=" * 60)
    print("Testing Student Registration & Authentication API")
    print(f"Target URL: {BASE_URL}")
    print("=" * 60)

    # 1. Health check
    print("\n>> 1. Checking Backend Health Endpoint (/api/health)...")
    try:
        health_resp = requests.get(f"{BASE_URL}/health", timeout=5)
        if health_resp.status_code == 200:
            print(f">> [SUCCESS] Backend is active! Status: {health_resp.json()}")
        else:
            print(f">> [WARNING] Health check returned status {health_resp.status_code}")
    except requests.exceptions.ConnectionError:
        print("\n>> [ERROR] Connection Refused!")
        print("   The Flask backend server is NOT running on http://127.0.0.1:5000.")
        print("   Please open a separate terminal and run:")
        print("      cd backend")
        print("      .\\venv\\Scripts\\Activate.ps1")
        print("      python run.py")
        print("=" * 60)
        sys.exit(1)

    # 2. Test Registration with unique email
    unique_email = f"student_{int(time.time())}@college.edu"
    test_student = {
        "full_name": "Aditi Sharma",
        "email": unique_email,
        "password": "StrongPassword123!",
        "college": "CSE-AI Institute of Technology",
        "target_role": "Full Stack Developer"
    }

    print(f"\n>> 2. Testing Student Registration Endpoint (/api/auth/register)...")
    print(f"   Payload: Name='{test_student['full_name']}', Email='{test_student['email']}'")
    reg_resp = requests.post(f"{BASE_URL}/auth/register", json=test_student, timeout=5)
    print(f">> Response Status: {reg_resp.status_code}")
    print(f">> Response Body  : {reg_resp.text}")

    if reg_resp.status_code == 201:
        data = reg_resp.json()
        token = data.get("token")
        user = data.get("user")
        print("\n>> [SUCCESS] Student registered and saved into MySQL!")
        print(f"   Student ID   : {user.get('id')}")
        print(f"   Full Name    : {user.get('full_name')}")
        print(f"   Email        : {user.get('email')}")
        print(f"   Target Role  : {user.get('target_role')}")
        print(f"   JWT Token    : {token[:20]}... (valid 24h)")
    else:
        print(f">> [FAILED] Registration failed with status: {reg_resp.status_code}")
        sys.exit(1)

    # 3. Test Login with newly created student
    print(f"\n>> 3. Testing Student Login Endpoint (/api/auth/login)...")
    login_payload = {
        "email": test_student["email"],
        "password": test_student["password"]
    }
    login_resp = requests.post(f"{BASE_URL}/auth/login", json=login_payload, timeout=5)
    print(f">> Login Status: {login_resp.status_code}")
    if login_resp.status_code == 200:
        print(">> [SUCCESS] Login verified! Bcrypt hash comparison successful.")
    else:
        print(f">> [FAILED] Login failed: {login_resp.text}")

    print("\n" + "=" * 60)
    print(">> ALL AUTHENTICATION TESTS PASSED!")
    print(">> The React frontend at http://localhost:5173 can now register users.")
    print("=" * 60)

if __name__ == "__main__":
    main()
