🧹 CleanIQ — AI-Powered Data Cleaning Platform

CleanIQ is a web-based data cleaning platform that helps users upload messy datasets, automatically clean and process the data, and download the cleaned file.

The project combines a modern React frontend with a Python FastAPI backend to create a simple and user-friendly data-cleaning workflow.

🚀 Features

- 📤 Upload CSV datasets
- 🧹 Automated data cleaning
- 🔍 Data preprocessing
- 📊 Easy-to-use web interface
- ⚡ FastAPI backend for data processing
- 📥 Download cleaned datasets
- 🌐 Frontend-backend API integration
- 📱 Responsive and modern interface

🏗️ Project Architecture

User
  ↓
React Frontend
  ↓
FastAPI REST API
  ↓
Python Data Processing
  ↓
Pandas
  ↓
Cleaned Dataset
  ↓
Download

🛠️ Technologies Used

Frontend

- React.js
- Vite
- Axios
- Recharts
- HTML
- CSS
- JavaScript

Backend

- Python
- FastAPI
- Pandas
- Uvicorn

📁 Project Structure

CleanIQ/
│
├── backend/
│   ├── main.py
│   ├── uploads/
│   └── ...
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
└── README.md

🔄 How It Works

1. User uploads a CSV file through the CleanIQ interface.
2. The frontend sends the file to the FastAPI backend.
3. The backend processes the dataset using Python and Pandas.
4. Data is cleaned and processed.
5. CleanIQ generates the cleaned dataset.
6. The user can download the processed file.

⚙️ Backend Setup

Navigate to the backend directory:

cd backend

Install the required Python packages:

pip install -r requirements.txt

Start the FastAPI server:

uvicorn main:app --reload

The backend will run locally on:

http://127.0.0.1:8000

💻 Frontend Setup

Open another terminal and navigate to the frontend:

cd frontend

Install dependencies:

npm install

Start the development server:

npm run dev

The frontend will normally be available at:

http://localhost:5173

📸 Project Screenshots

CleanIQ Dashboard

Add your dashboard screenshot here:

![CleanIQ Dashboard](screenshots/dashboard.png)

Data Upload

![CleanIQ Upload](screenshots/upload.png)

Cleaned Data / Results

![CleanIQ Results](screenshots/results.png)

«Replace the image filenames above with the actual names of your screenshots.»

🎯 Project Objective

The goal of CleanIQ is to simplify the process of preparing datasets for analysis by providing an easy-to-use interface for common data-cleaning operations.

Instead of manually processing datasets using code every time, users can interact with the platform through a web interface.

🔮 Future Improvements

- Support for Excel files
- More advanced data-cleaning techniques
- Automatic data-quality reports
- Missing-value visualization
- Duplicate detection reports
- Outlier detection
- Data profiling
- More visualization options
- User authentication
- Cloud deployment
- Larger dataset support

📌 Use Cases

CleanIQ can be useful for:

- Students learning Data Science
- Data analysts
- Beginners working with datasets
- Data preprocessing workflows
- Educational demonstrations
- Preparing datasets before machine-learning projects

⚠️ Disclaimer

CleanIQ is an educational and portfolio project. Users should verify important datasets after automated cleaning before using them for critical analysis or decision-making.

👨‍💻 Author

Keyur Jain

BSc Data Science Student

GitHub: "@ukawatkeyur-droid" (https://github.com/ukawatkeyur-droid)

---

⭐ If you find CleanIQ useful, consider giving the repository a star!
