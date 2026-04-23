🚀 Job Application Tracker

A production-style full-stack web application to track, manage, and secure job applications with proper authentication, database design, and backend architecture.

🔥 Why This Project Exists

Tracking job applications in spreadsheets is inefficient and error-prone.
This system solves that by providing:

Centralized tracking
Secure user isolation
Structured data management
Real-world backend practices
⚙️ Core Capabilities
Authentication System
Secure user signup & login
Password hashing (Werkzeug)
Session-based authentication
Application Management (CRUD)
Add job applications
Edit details (role, company, status)
Delete entries
View personalized dashboard
User Isolation
Each user sees only their own data
Backend-enforced access control
🧠 Architecture Overview
Frontend: Handles UI rendering and user interactions
Flask Backend: Manages routing, authentication, and business logic
MySQL Database: Stores users and job data with relational structure

Basic flow:

User → Frontend → Flask API → MySQL → Response → UI
🛠 Tech Stack

Frontend

HTML5
CSS3
JavaScript

Backend

Python
Flask

Database

MySQL

Tools & Libraries

mysql-connector-python
python-dotenv
Werkzeug
Git & GitHub
🔐 Security Design (Actual Interview-Level Points)
Passwords hashed using generate_password_hash() (no plaintext storage)
Session management prevents unauthorized access
Environment variables used for:
DB credentials
Secret keys
.gitignore blocks sensitive files
Backend validation prevents unauthorized data access
📂 Project Structure
job-tracker/
│── static/
│── templates/
│── app.py
│── db_config.py
│── .env
│── .gitignore
│── requirements.txt
🚀 How to Run
# Clone repo
git clone <your-repo-link>

# Move into project
cd job-tracker

# Create virtual environment
python -m venv venv

# Activate
venv\Scripts\activate   # Windows
source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Run app
python app.py
📈 What This Project Demonstrates
Backend fundamentals (Flask routing, sessions)
Secure authentication design
Database integration with MySQL
CRUD operations with real use-case
Environment-based configuration
Clean separation of concerns
🚧 Limitations
No REST API (monolithic structure)
No pagination or filtering
Basic UI (not production-grade frontend)
No deployment yet
🔮 Future Improvements
Convert to REST API (Flask + React frontend)
JWT-based authentication
Add filters (status, company, date)
Pagination for scalability
Deploy using Docker + cloud (AWS / Render)
Add analytics (application success rate)
