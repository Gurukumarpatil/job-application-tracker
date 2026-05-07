# 🚀 Job Application Tracker

A secure full-stack web application built to manage, organize, and track job applications efficiently using real-world backend architecture and authentication practices.

---

## ✨ Overview

Managing job applications manually becomes messy fast.  
This project solves that problem by providing a centralized system where users can securely manage applications, monitor progress, and maintain structured records.

The application focuses heavily on:
- Secure authentication
- Backend architecture
- Database integration
- User-specific data isolation
- Real-world CRUD operations

---

# 🔥 Key Features

## 🔐 Authentication & Security
- Secure user registration and login
- Password hashing using `Werkzeug`
- Session-based authentication
- Protected routes and access control
- Environment variable configuration using `.env`
- Sensitive files excluded via `.gitignore`

---

## 📋 Job Application Management
Users can:

- Add new job applications
- Update company details and application status
- Delete applications
- Track application progress
- View all applications in a personalized dashboard

---

## 👤 User Isolation
The system enforces strict backend-level user isolation.

Each user:
- Can only access their own applications
- Cannot modify another user’s data
- Has securely separated records in the database

---

# 🧠 System Architecture

## Application Flow

```txt
User Request
     ↓
Frontend Interface
     ↓
Flask Backend
     ↓
MySQL Database
     ↓
Processed Response
     ↓
Frontend Display
```

---

## Backend Responsibilities
- Authentication handling
- Session management
- CRUD operations
- Route protection
- Database communication
- Request validation

---

## Database Responsibilities
- Store user credentials securely
- Store application records
- Maintain relational data structure
- Ensure data consistency

---

# 🛠 Tech Stack

## Frontend
- HTML5
- CSS3
- JavaScript

## Backend
- Python
- Flask

## Database
- MySQL

## Libraries & Tools
- `mysql-connector-python`
- `Werkzeug`
- `python-dotenv`
- `Git`
- `GitHub`

---

# 📂 Project Structure

```txt
job-tracker/
│
├── static/              # CSS, JS, Assets
├── templates/           # HTML Templates
├── app.py               # Main Flask Application
├── db_config.py         # Database Configuration
├── requirements.txt     # Dependencies
├── .env                 # Environment Variables
├── .gitignore
│
└── README.md
```

---

# 🔐 Security Implementation

## Password Protection
Passwords are never stored in plaintext.

The system uses:
```python
generate_password_hash()
check_password_hash()
```

to securely hash and validate credentials.

---

## Secure Configuration
Sensitive values are stored using environment variables:

```env
DB_HOST=
DB_USER=
DB_PASSWORD=
SECRET_KEY=
```

This prevents credential exposure inside source code.

---

## Access Control
Backend validation ensures:
- Unauthorized users cannot access protected routes
- Users cannot access another user's records
- Sessions are validated before requests are processed

---

# ⚙️ Installation & Setup

## Clone Repository

```bash
git clone <your-repository-link>
```

---

## Navigate to Project

```bash
cd job-tracker
```

---

## Create Virtual Environment

```bash
python -m venv venv
```

---

## Activate Environment

### Windows
```bash
venv\Scripts\activate
```

### Mac/Linux
```bash
source venv/bin/activate
```

---

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Run Application

```bash
python app.py
```

---

# 📈 What This Project Demonstrates

## Backend Development
- Flask application structure
- Route handling
- Request processing

## Authentication Systems
- Login/signup implementation
- Session handling
- Password security

## Database Integration
- MySQL connectivity
- CRUD operations
- Relational data handling

## Secure Development Practices
- Environment-based configuration
- Hashed passwords
- Access control validation

---

# 🚧 Current Limitations

- Monolithic backend architecture
- No REST API implementation
- Basic frontend design
- No pagination support
- No advanced search/filtering
- Not containerized or deployed

---

# 🔮 Future Improvements

## Planned Enhancements
- Convert backend into REST API
- React frontend integration
- JWT authentication
- Search & filtering system
- Pagination support
- Docker containerization
- Cloud deployment
- Analytics dashboard
- Email notifications
- Role-based access control

---

# 💡 Project Goal

This project was built to strengthen practical knowledge of:
- Full-stack development
- Backend architecture
- Authentication systems
- Database design
- Secure web application development

---

<div align="center">

### ⚡ Built for learning real-world backend development practices

</div>
