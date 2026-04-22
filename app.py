from flask import Flask, request, jsonify, render_template, redirect, session
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = "super-secret-key"

# ---------- MYSQL CONNECTION ----------
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="root@sql#890",   
        database="job_tracker"
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
        password = generate_password_hash(request.form["password"])

        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO users (username, password_hash) VALUES (%s,%s)",
                (username, password)
            )
            conn.commit()
            cursor.close()
            conn.close()
            return redirect("/login")
        except:
            return render_template("register.html", error="Username exists")

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
    cursor.execute("SELECT username FROM users WHERE id=%s", (session["user_id"],))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    return render_template("index.html", username=user["username"])

# ---------- API ----------
@app.route("/add", methods=["POST"])
def add_application():
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO applications
        (company_name, role, status, applied_date, user_id, job_url, location, notes)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
    """, (data.get("company"), data.get("role"), data.get("status"), data.get("date"), session["user_id"], data.get("job_url"), data.get("location"), data.get("notes")))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Added"})

@app.route("/applications")
def get_applications():
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
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE applications
        SET company_name=%s, role=%s, status=%s, applied_date=%s, job_url=%s, location=%s, notes=%s
        WHERE id=%s AND user_id=%s
    """, (data.get("company"), data.get("role"), data.get("status"), data.get("date"), data.get("job_url"), data.get("location"), data.get("notes"), id, session["user_id"]))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Updated"})

@app.route("/delete/<int:id>", methods=["DELETE"])
def delete(id):
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

@app.route("/analytics")
def analytics():
    if not is_logged_in():
        return jsonify({"error": "Unauthorized"}), 401
    
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT status, COUNT(*) as count 
        FROM applications 
        WHERE user_id=%s 
        GROUP BY status
    """, (session["user_id"],))
    stats = cursor.fetchall()
    
    cursor.execute("SELECT COUNT(*) as total FROM applications WHERE user_id=%s", (session["user_id"],))
    total = cursor.fetchone()["total"]
    
    cursor.close()
    conn.close()
    
    return jsonify({"stats": stats, "total": total})

if __name__ == "__main__":
    app.run(debug=True)
