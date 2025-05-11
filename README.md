Employee & Project Management System (Trello-Style Clone)
Overview
This is a full-stack Employee & Project Management System developed as part of the ITP module for Misty Productions. The system offers a Trello-like experience for task tracking, project management, and team collaboration. It supports JWT authentication, role-based access control, OTP verification, and AI-based text summarization to help streamline the production process and enhance efficiency.

Features
🔐 JWT Authentication for secure login and session management

🔑 Role-Based Access Control: Different roles including Admin, Manager, and Employee to manage user permissions and access

📊 Project & Task Management: Visual task boards to organize projects and track progress

🧑‍🤝‍🧑 Team Collaboration: Real-time updates for team members to track and update task status

🔧 Board Management: Organize and track different projects and tasks visually

🧩 One-Time Password (OTP): Secure user verification via OTP for account recovery or sensitive actions

🤖 AI Text Summarization: Leverages AI to provide concise, summarized ideas for the production team, helping them make quicker decisions and generate impactful content

🎨 UI Design: Sleek user interface designed using Figma for an intuitive user experience

Tech Stack
Frontend:

React.js: Used to build a dynamic and responsive user interface

Figma: Used for designing the UI/UX

Backend:

Node.js: JavaScript runtime to handle the server-side logic

Express.js: Web framework for Node.js to create RESTful APIs

MongoDB: NoSQL database for storing user and project data

JWT (JSON Web Tokens): Used for user authentication and session management

OTP: For secure user verification and password recovery

AI Integration:

AI Text Summarization: To assist the production team by summarizing long text into concise, actionable content

Setup Instructions
Prerequisites
Node.js (v12 or higher) installed on your system

MongoDB instance running locally or using a cloud service like MongoDB Atlas

Environment Variables: Set up the following variables in your .env file

GMAIL_USER: Your Gmail address for email functionality

GMAIL_PASS: Your Gmail password or app password for email functionality

MONGO_URI: Connection string for MongoDB database

JWT_SECRET: Secret key for JWT token generation

Installation
Clone this repository:

bash
Copy
Edit
git clone https://github.com/your-username/employee-project-management-system.git
cd employee-project-management-system
Install dependencies:

Backend:

cd backend
npm install
Frontend:

cd frontend
npm install
Set up your environment variables (.env file) in both backend and frontend directories.

Start the backend server:

cd backend
npm start
Start the frontend development server:


cd frontend
npm run dev
Open your browser and navigate to http://localhost:4000 to access the application.

Contributions
Feel free to fork this project and contribute! If you have any suggestions or improvements, create an issue or a pull request.

Acknowledgments
Misty Productions for the opportunity to work on this project as part of the ITP module.

Special thanks to Mistika Hewagama, CEO of Misty Productions, for her support and providing the platform to collaborate on this project.

