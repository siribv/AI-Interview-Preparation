"""
Database Diagnostic & Connection Test Tool
AI Interview Preparation Platform
"""
import os
import pymysql
from dotenv import load_dotenv

load_dotenv()

DB_HOST = os.getenv("DB_HOST", "127.0.0.1")
DB_PORT = int(os.getenv("DB_PORT", "3306"))
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_NAME = os.getenv("DB_NAME", "ai_interview_db")

def mask(val: str) -> str:
    if not val:
        return "(empty)"
    return "*" * len(val)

def main():
    print("=" * 60)
    print("AI Interview Platform - MySQL Connection Diagnostic")
    print("=" * 60)
    print(f"Host     : {DB_HOST}")
    print(f"Port     : {DB_PORT}")
    print(f"User     : {DB_USER}")
    print(f"Password : {mask(DB_PASSWORD)}")
    print(f"Database : {DB_NAME}")
    print("-" * 60)

    # 1. Test raw TCP / Authentication with MySQL Server
    print(">> Step 1: Connecting to MySQL server instance...")
    try:
        conn = pymysql.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            autocommit=True
        )
        print(">> [SUCCESS] Successfully authenticated with MySQL server!")
    except pymysql.err.OperationalError as e:
        error_code, error_msg = e.args
        print(f"\n>> [FAILED] MySQL Connection Error ({error_code}): {error_msg}")
        if error_code == 1045:
            print("\n>> DIAGNOSIS:")
            print("   The MySQL server is running, but the password provided for user 'root' is incorrect.")
            print("   Please open backend/.env and update DB_PASSWORD with your actual MySQL password.")
            print("   If you forgot your password or installed without one, follow the manual steps provided.")
        elif error_code == 2003:
            print("\n>> DIAGNOSIS:")
            print("   Could not connect to MySQL server on 127.0.0.1:3306.")
            print("   Please verify that the MySQL Windows service is started.")
        print("=" * 60)
        return False

    # 2. Check if ai_interview_db exists; create if missing
    print("\n>> Step 2: Checking database existence...")
    with conn.cursor() as cur:
        cur.execute(f"CREATE DATABASE IF NOT EXISTS `{DB_NAME}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
        print(f">> [SUCCESS] Database '{DB_NAME}' is verified and ready.")

    conn.close()

    # 3. Test SQLAlchemy table creation and seeding
    print("\n>> Step 3: Verifying SQLAlchemy models and seeding tables...")
    try:
        from app import create_app
        from app.extensions import db
        from app.models.interview import JobRole
        from app.models.user import User

        app = create_app("development")
        with app.app_context():
            db.create_all()
            table_names = list(db.metadata.tables.keys())
            print(f">> [SUCCESS] Verified {len(table_names)} tables:")
            for t in table_names:
                print(f"   • {t}")

            # Verify Job Roles seed
            roles_count = JobRole.query.count()
            print(f">> Active Job Roles count: {roles_count}")

            # Verify Users table is queryable
            user_count = User.query.count()
            print(f">> Registered Students count: {user_count}")

    except Exception as e:
        print(f">> [WARNING] Model initialization encountered an issue: {e}")
        return False

    print("=" * 60)
    print(">> ALL DATABASE CHECKS PASSED SUCCESSFULLY!")
    print(">> You can now safely run: python run.py")
    print("=" * 60)
    return True

if __name__ == "__main__":
    main()
