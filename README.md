# Peerly - University Collaboration Platform

![Peerly Logo](c:\Users\HP\Pictures\Picture1.png)

**Peerly** is an innovative educational platform that combines the best elements of social media and forums to create an engaging, interactive space for university students. It helps students collaborate with peers, share academic experiences, and participate in meaningful discussions related to their studies. Peerly enables students to connect with others in the same subject or university, share resources, and work together on projects or assignments.

---

## Table of Contents
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [CI/CD](#cicd)
- [Project Management](#project-management)
- [Contact](#contact)


---

## Technologies Used

### Frontend
- **HTML**: Structure of the platform's pages.
- **CSS**: Styling for a clean and modern look.
- **JavaScript**: Adds interactivity to the web application.
- **PUG**: Templating engine for dynamic HTML generation.

### Backend
- **Node.js**: JavaScript runtime to handle server-side operations.
- **Express.js**: Web framework for building the server and handling routing.
- **MySQL**: Relational database used for storing and retrieving data.

### DevOps
- **Docker**: Containerization platform to package the application for easy deployment.
- **Git**: Version control system for tracking and collaborating on code.
- **GitHub Actions**: Automation tool for CI/CD workflows to ensure smooth testing and deployment.

### Project Management
- **GitHub Projects**: Tool to manage and track project tasks, milestones, and progress.

---

## Installation

### Prerequisites:
- [Install Node.js](https://nodejs.org/)
- [Install MySQL](https://dev.mysql.com/downloads/)
- [Install Docker](https://www.docker.com/get-started)

### Steps to Install:
1. Clone the repository:
   ```bash
   git clone https://github.com/JuginMuz/Peerly.git
   ```

2. Navigate to the project directory:
   ```bash
   cd Peerly
   ```

3. Install dependencies for the frontend:
   ```bash
   npm install
   ```

4. Set environment variables:
   - Create a `.env` file in the root directory and set up the necessary environment variables (e.g., database credentials, port, etc.).

5. Run the application:
   ```bash
   docker-compose up
   ```

6. Access the application at `http://127.0.0.1:3000/`.

---

## CI/CD

This project is set up with **GitHub Actions** for Continuous Integration (CI) and Continuous Deployment (CD). It automates testing, building, and deploying the application.

- **CI Workflow**: Every time code is pushed to the repository, GitHub Actions will automatically run tests to ensure everything is working correctly.
- **CD Workflow**: Upon successful tests, the code will be deployed to the appropriate environment (e.g., staging or production).

---

## Project Management

The project utilizes **GitHub Projects** for tracking tasks, milestones, and progress. You can find our task board [here](https://github.com/users/JuginMuz/projects/3).

---

## Contact

For any inquiries or suggestions, feel free to reach out to the project team:

- **Developers**: Gurkiratjot Singh, Sonjay Kumar, Jugin Muzhaqi, Rabia Arian
- **Emails**: gurkiratjotsingh17@gmail.com, sonjaykumar1404@gmail.com, jugin.muzhaqi@gmail.com, sosanrabia0@gmail.com

--- 
