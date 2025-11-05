# College-Management-System

🏛️ Architecture and Technologies
System Overview: The CMIS is a comprehensive, three-tier software application designed to centralize and streamline college operations and data management (admissions, attendance, marks, fees, etc.).

Architecture: Adheres to a robust Three-Tier Architecture (separating UI, logic, and data storage) for scalability and security.

Key Technologies:

Frontend: React / TypeScript for dynamic UI, styled using Tailwind CSS.

Backend/Data: Handles logic and validation (Inferred: Node.js / Python).

Database: Secure persistence layer (Inferred: PostgreSQL / MySQL).

⚙️ Core Functional Modules
The system is built around four mission-critical modules:

User Authentication & Access

Manages secure login and new user registration.

Security Constraint: Enforces unique email validation.

Mandatory Error: Duplicate attempts must return: "User is already registered. Please login to the application."

Student Marks Management

Allows authorized users to search for and view academic performance.

Displays a clear breakdown of final exam marks and internal assessment scores.

Course & Curriculum Details

Provides a comprehensive listing of all available courses.

Displays all associated course particulars (code, credits, description).

Fees Tracking & Finance

Ensures financial transparency for students and parents.

Tracks and displays both the total fees paid amount and the remaining balance due amount.

🚀 Getting Started

Follow these steps to set up and run the CMIS application locally. Ensure you have Node.js and MongoDB installed.

1. Server Setup (Backend)

The server handles the MongoDB connection and API logic.

# Navigate to the server directory (e.g., 'server/' or 'backend/')
cd server/

npm install

npm run dev
# Expected Output: "MongoDB server connected"



2. Client Setup (Frontend)

The client runs the React application.

# Navigate to the client directory (e.g., 'client/')
cd ../client/

npm install

npm run dev


Run: Start the backend server and client application (e.g., npm run dev).

Access: The application should be accessible at http://localhost:8080/.
