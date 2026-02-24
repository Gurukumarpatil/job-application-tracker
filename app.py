import os
from flask import Flask, request, jsonify, render_template, redirect, session
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY")

# ---------- MYSQL CONNECTION ----------
def get_db_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME")
    )

def is_logged_in():
    return "user_id" in session

# ---------- AUTH ----------
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE username=%s", (username,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if user and check_password_hash(user["password_hash"], password):
            session["user_id"] = user["id"]
            return redirect("/")
        return render_template("login.html", error="Invalid credentials")

    return render_template("login.html")


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form["username"]
        password_hash = generate_password_hash(request.form["password"])

        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO users (username, password_hash) VALUES (%s,%s)",
                (username, password_hash)
            )
            conn.commit()
            cursor.close()
            conn.close()
            return redirect("/login")
        except:
            return render_template("register.html", error="Username already exists")

    return render_template("register.html")


@app.route("/logout")
def logout():
    session.clear()
    return redirect("/login")

# ---------- DASHBOARD ----------
@app.route("/")
def home():
    if not is_logged_in():
        return redirect("/login")

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        "SELECT username FROM users WHERE id=%s",
        (session["user_id"],)
    )
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    return render_template("index.html", username=user["username"])

# ---------- APPLICATION APIs ----------
@app.route("/add", methods=["POST"])
def add_application():
    if not is_logged_in():
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO applications
        (company_name, role, status, applied_date, user_id)
        VALUES (%s,%s,%s,%s,%s)
    """, (
        data["company"],
        data["role"],
        data["status"],
        data["date"],
        session["user_id"]
    ))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Application added"})


@app.route("/applications")
def get_applications():
    if not is_logged_in():
        return jsonify([])

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        "SELECT * FROM applications WHERE user_id=%s",
        (session["user_id"],)
    )
    data = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify(data)


@app.route("/update/<int:id>", methods=["PUT"])
def update_application(id):
    if not is_logged_in():
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE applications
        SET company_name=%s, role=%s, status=%s, applied_date=%s
        WHERE id=%s AND user_id=%s
    """, (
        data["company"],
        data["role"],
        data["status"],
        data["date"],
        id,
        session["user_id"]
    ))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Updated"})


@app.route("/delete/<int:id>", methods=["DELETE"])
def delete_application(id):
    if not is_logged_in():
        return jsonify({"error": "Unauthorized"}), 401

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "DELETE FROM applications WHERE id=%s AND user_id=%s",
        (id, session["user_id"])
    )
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Deleted"})

# ---------- RUN ----------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)