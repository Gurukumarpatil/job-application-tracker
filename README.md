job tracker 

# 🚀 Job Application Tracker

A production-style full-stack web application to **track, manage, and secure job applications** with proper authentication, database design, and backend architecture.

---

## 🔥 Why This Project Exists

Tracking job applications in spreadsheets is inefficient and error-prone.  
This system solves that by providing:

- Centralized tracking  
- Secure user isolation  
- Structured data management  
- Real-world backend practices  

---

## ⚙️ Core Capabilities

### Authentication System
- Secure user signup & login  
- Password hashing using Werkzeug  
- Session-based authentication  

### Application Management (CRUD)
- Add job applications  
- Edit job details (role, company, status)  
- Delete applications  
- View personalized dashboard  

### User Isolation
- Each user can only access their own data  
- Backend-enforced access control  

---

## 🧠 Architecture Overview

- **Frontend:** Handles UI and user interaction  
- **Backend (Flask):** Handles routing, authentication, and logic  
- **Database (MySQL):** Stores users and job applications  

**Flow:**
```
User → Frontend → Flask → MySQL → Response → UI
```

---

## 🛠 Tech Stack

### Frontend
- HTML5  
- CSS3  
- JavaScript  

### Backend
- Python  
- Flask  

### Database
- MySQL  

### Libraries & Tools
- mysql-connector-python  
- python-dotenv  
- Werkzeug  
- Git & GitHub  

---

## 🔐 Security Design

- Passwords are hashed (`generate_password_hash`)  
- No plaintext credential storage  
- Session-based authentication  
- Environment variables used for:
  - Database credentials  
  - Secret keys  
- `.gitignore` excludes sensitive files  
- Backend validation prevents unauthorized access  

---

## 📂 Project Structure

```
job-tracker/
│── static/
│── templates/
│── app.py
│── db_config.py
│── .env
│── .gitignore
│── requirements.txt
```

---

## 🚀 How to Run

```bash
# Clone repository
git clone <your-repo-link>

# Navigate into project
cd job-tracker

# Create virtual environment
python -m venv venv

# Activate environment
venv\Scripts\activate      # Windows
source venv/bin/activate   # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Run application
python app.py
```

---

## 📈 What This Project Demonstrates

- Backend development with Flask  
- Authentication and session management  
- Secure password handling  
- MySQL database integration  
- CRUD operations  
- Environment-based configuration  

---

## 🚧 Limitations

- Monolithic structure (no REST API)  
- No pagination or advanced filtering  
- Basic frontend UI  
- Not deployed  

---

## 🔮 Future Improvements

- Convert to REST API (Flask + React)  
- JWT authentication  
- Add filters and search  
- Pagination for large datasets  
- Deploy using Docker and cloud platforms  
- Add analytics dashboard  

---
