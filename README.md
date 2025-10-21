# Diabetes Prediction Web Application

A professional, production-ready Flask web application for predicting diabetes progression using machine learning models deployed on Databricks MLflow. This application serves as educational skeleton code for students learning full-stack web development and ML deployment.

[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![Flask](https://img.shields.io/badge/flask-3.0+-green.svg)](https://flask.palletsprojects.com/)
[![Tailwind CSS](https://img.shields.io/badge/tailwind-3.0+-blue.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Code Architecture](#code-architecture)
- [Customization Guide](#customization-guide)
- [Troubleshooting](#troubleshooting)
- [Educational Resources](#educational-resources)
- [Contributing](#contributing)
- [License](#license)

## Features

### User Interface
- ✨ Modern, responsive design using Tailwind CSS
- 📱 Mobile-first approach that works on all device sizes
- 🎨 Beautiful gradient backgrounds and smooth animations
- ♿ Accessible form controls with proper labels and hints
- 🔄 Real-time loading states with animated spinner
- 💬 Clear error feedback and user guidance

### Backend
- 🚀 Professional Flask application structure
- ⚙️ Centralized configuration management
- 🔒 Secure environment variable handling
- ✅ Comprehensive input validation
- 📊 Health check endpoint for monitoring
- 📝 Extensive educational comments

### Code Quality
- 📚 Extensive documentation and inline comments
- 🎓 Educational notes explaining design decisions
- 🔧 Separation of concerns (config, logic, presentation)
- ✨ Clean, maintainable code following best practices
- 🧪 Ready for testing and extension

## Project Structure

```
diabetes_prediction_app/
│
├── diabetes_prediction_app.py    # Main Flask application
├── config.py                      # Configuration management
├── requirements.txt               # Python dependencies
├── .env.example                   # Environment variables template
├── .gitignore                     # Git ignore rules
├── README.md                      # This file
│
├── templates/
│   └── index.html                 # Main page (with Tailwind CSS)
│
└── static/
    ├── style.css                  # Custom CSS (animations)
    └── app.js                     # Frontend JavaScript
```

### File Descriptions

- **[diabetes_prediction_app.py](diabetes_prediction_app.py)**: Core Flask application with routes, validation, and ML model integration
- **[config.py](config.py)**: Centralized configuration with environment variable management
- **[templates/index.html](templates/index.html)**: HTML template with Tailwind CSS styling
- **[static/app.js](static/app.js)**: Client-side JavaScript for form handling and API calls
- **[static/style.css](static/style.css)**: Custom CSS for animations and effects
- **[.env.example](.env.example)**: Template for environment variables (copy to `.env`)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.8 or higher** - [Download Python](https://www.python.org/downloads/)
- **pip** - Python package manager (usually comes with Python)
- **A Databricks workspace** with a deployed MLflow model
- **Databricks personal access token** - [How to generate](https://docs.databricks.com/dev-tools/auth.html#pat)

### Verifying Prerequisites

```bash
# Check Python version (should be 3.8 or higher)
python --version

# Check pip is installed
pip --version
```

## Installation

### Step 1: Clone or Download the Repository

```bash
# If using Git
git clone <repository-url>
cd diabetes_prediction_app

# Or download and extract the ZIP file, then navigate to the folder
```

### Step 2: Create a Virtual Environment (Recommended)

Creating a virtual environment keeps your project dependencies isolated:

```bash
# Create virtual environment
python -m venv venv

# Activate it (macOS/Linux)
source venv/bin/activate

# Activate it (Windows)
venv\Scripts\activate

# You should see (venv) in your terminal prompt
```

### Step 3: Install Dependencies

```bash
# Install all required packages
pip install -r requirements.txt

# Verify installation
pip list
```

## Configuration

### Step 1: Create Your Environment File

```bash
# Copy the example file to create your .env file
cp .env.example .env
```

### Step 2: Edit Your .env File

Open `.env` in your text editor and configure the following:

```bash
# REQUIRED: Your Databricks authentication token
DATABRICKS_TOKEN=your_actual_databricks_token_here

# REQUIRED: Your MLflow model endpoint URL
MLFLOW_ENDPOINT_URL=https://your-workspace.cloud.databricks.com/serving-endpoints/your-model/invocations

# OPTIONAL: Flask configuration
FLASK_DEBUG=True
FLASK_HOST=0.0.0.0
FLASK_PORT=4000
```

### Getting Your Configuration Values

#### Databricks Token:
1. Log into your Databricks workspace
2. Click your profile icon (top right)
3. Select "User Settings"
4. Navigate to "Developer" → "Access tokens"
5. Click "Generate new token"
6. Copy the token (you won't be able to see it again!)

#### MLflow Endpoint URL:
1. In Databricks, go to "Serving" in the left sidebar
2. Click on your model endpoint
3. Copy the "Endpoint URL" or "Invocation URL"

### Security Notes

⚠️ **IMPORTANT**:
- Never commit your `.env` file to version control
- The `.env` file is already in `.gitignore` to prevent accidental commits
- Keep your Databricks token secure and rotate it periodically
- Use different tokens for development and production

## Running the Application

### Quick Start

```bash
# Make sure you're in the project directory and venv is activated
python diabetes_prediction_app.py
```

You should see output like:

```
======================================================================
DIABETES PREDICTION APP - CONFIGURATION STATUS
======================================================================
App Name: Diabetes Progression Predictor
Version: 1.0.0
Debug Mode: True
Host: 0.0.0.0
Port: 4000
----------------------------------------------------------------------
MLflow Configuration:
Endpoint URL: https://your-workspace.cloud.databricks.com/...
Token Set: Yes (***hidden***)
Request Timeout: 30s
----------------------------------------------------------------------

✅ Configuration validated successfully!

🚀 Starting server at http://0.0.0.0:4000
```

### Accessing the Application

Open your web browser and navigate to:
- **Local access**: `http://localhost:4000`
- **Network access**: `http://YOUR_IP_ADDRESS:4000` (if accessing from another device)

### Stopping the Application

Press `Ctrl+C` in the terminal to stop the server.

## Usage

### Making a Prediction

1. **Open the application** in your web browser
2. **Fill in the patient data** - All fields are pre-filled with sample values
3. **Click "Get Prediction"** - The button will show "Predicting..." while processing
4. **View the result** - The prediction will appear in a colorful result card

### Using Sample Data

Click the "Load Sample Data" button at the bottom to populate all fields with example values.

### Understanding the Input Features

All input features are **normalized values** from the diabetes dataset:

| Feature | Description | Typical Range |
|---------|-------------|---------------|
| **Age** | Patient age (normalized) | -0.1 to 0.1 |
| **Sex** | Patient biological sex (normalized) | -0.1 to 0.1 |
| **BMI** | Body Mass Index (normalized) | -0.1 to 0.2 |
| **BP** | Average blood pressure (normalized) | -0.1 to 0.1 |
| **S1** | Total serum cholesterol (normalized) | -0.1 to 0.2 |
| **S2** | Low-density lipoproteins (normalized) | -0.1 to 0.2 |
| **S3** | High-density lipoproteins (normalized) | -0.1 to 0.1 |
| **S4** | Total cholesterol/HDL ratio (normalized) | -0.1 to 0.2 |
| **S5** | Log of serum triglycerides (normalized) | -0.1 to 0.2 |
| **S6** | Blood sugar level (normalized) | -0.1 to 0.1 |

### Understanding the Prediction

The prediction is a quantitative measure of diabetes progression one year after baseline measurements. Higher values indicate greater disease progression.

## API Documentation

### POST /predict

Submit patient data to get a diabetes progression prediction.

**Endpoint**: `POST /predict`

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "age": 0.05,
  "sex": 0.05,
  "bmi": 0.06,
  "bp": 0.02,
  "s1": -0.04,
  "s2": -0.03,
  "s3": 0.00,
  "s4": 0.00,
  "s5": 0.00,
  "s6": -0.03
}
```

**Success Response** (HTTP 200):
```json
{
  "success": true,
  "prediction": 152.5
}
```

**Error Response** (HTTP 400/500):
```json
{
  "success": false,
  "error": "Detailed error message"
}
```

### GET /health

Health check endpoint for monitoring.

**Endpoint**: `GET /health`

**Success Response** (HTTP 200):
```json
{
  "status": "healthy",
  "app": "Diabetes Progression Predictor",
  "version": "1.0.0"
}
```

**Error Response** (HTTP 500):
```json
{
  "status": "unhealthy",
  "errors": ["List of configuration errors"]
}
```

### Example API Usage

#### Using cURL:
```bash
curl -X POST http://localhost:4000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "age": 0.05,
    "sex": 0.05,
    "bmi": 0.06,
    "bp": 0.02,
    "s1": -0.04,
    "s2": -0.03,
    "s3": 0.00,
    "s4": 0.00,
    "s5": 0.00,
    "s6": -0.03
  }'
```

#### Using Python requests:
```python
import requests

url = "http://localhost:4000/predict"
data = {
    "age": 0.05,
    "sex": 0.05,
    "bmi": 0.06,
    "bp": 0.02,
    "s1": -0.04,
    "s2": -0.03,
    "s3": 0.00,
    "s4": 0.00,
    "s5": 0.00,
    "s6": -0.03
}

response = requests.post(url, json=data)
print(response.json())
```

## Code Architecture

### Design Principles

This application demonstrates several important software engineering principles:

1. **Separation of Concerns**: Configuration, business logic, and presentation are separate
2. **DRY (Don't Repeat Yourself)**: Reusable functions and centralized configuration
3. **Defensive Programming**: Input validation and comprehensive error handling
4. **Scalability**: Easy to extend with new features or models
5. **Maintainability**: Clear code structure with extensive documentation

### Configuration Management

All configuration is centralized in [config.py](config.py:1):

```python
from config import Config

# Access configuration values
endpoint = Config.MLFLOW_ENDPOINT_URL
features = Config.MODEL_FEATURES
```

### Request Flow

```
User → Browser → index.html
           ↓
    JavaScript (app.js)
           ↓
    POST /predict → diabetes_prediction_app.py
           ↓
    validate_input_data()
           ↓
    build_dataframe_from_request()
           ↓
    score_model() → Databricks MLflow
           ↓
    Return JSON response
```

### Educational Code Comments

Throughout the codebase, you'll find educational comments marked with:
```python
# Educational Note:
# ----------------
# Explanation of why this code is written this way...
```

These comments explain not just *what* the code does, but *why* it's designed that way.

## Customization Guide

### Changing the Model Endpoint

Edit your `.env` file:
```bash
MLFLOW_ENDPOINT_URL=https://new-endpoint-url/invocations
```

Or modify [config.py](config.py:69) to change the default.

### Adding New Features

If your model requires different features, update [config.py](config.py:91):

```python
MODEL_FEATURES = [
    'feature1',
    'feature2',
    # Add your features here
]
```

Then update the form in [index.html](templates/index.html) and the data collection in [app.js](static/app.js).

### Customizing Styles

#### Colors:
Edit the Tailwind config in [index.html](templates/index.html:22):
```javascript
colors: {
    primary: {
        500: '#your-color-here'
    }
}
```

#### Animations:
Add custom animations in [style.css](static/style.css:29).

### Changing the Port

Edit your `.env` file:
```bash
FLASK_PORT=8080
```

Or use the command line:
```bash
FLASK_PORT=8080 python diabetes_prediction_app.py
```

## Troubleshooting

### Common Issues and Solutions

#### "DATABRICKS_TOKEN is not set"

**Problem**: The application can't find your Databricks token.

**Solutions**:
1. Make sure you created a `.env` file from `.env.example`
2. Verify the token is set in `.env`: `DATABRICKS_TOKEN=your_token`
3. Check for typos in the variable name
4. Ensure no extra spaces around the `=` sign

#### "Request failed with status 401"

**Problem**: Authentication failed with Databricks.

**Solutions**:
1. Verify your token is valid (check in Databricks workspace)
2. Check if the token has expired
3. Generate a new token and update your `.env` file

#### "Request failed with status 404"

**Problem**: The MLflow endpoint URL is incorrect.

**Solutions**:
1. Verify the endpoint URL in Databricks Serving section
2. Make sure to include `/invocations` at the end
3. Check that your model is actually deployed

#### "Port 4000 already in use"

**Problem**: Another application is using port 4000.

**Solutions**:
```bash
# Option 1: Use a different port
FLASK_PORT=5000 python diabetes_prediction_app.py

# Option 2: Find and kill the process using port 4000
# macOS/Linux:
lsof -ti:4000 | xargs kill -9

# Windows:
netstat -ano | findstr :4000
taskkill /PID <PID> /F
```

#### "ModuleNotFoundError: No module named 'flask'"

**Problem**: Dependencies not installed.

**Solution**:
```bash
# Make sure virtual environment is activated
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt
```

#### Predictions are not appearing

**Problem**: JavaScript errors or API issues.

**Solutions**:
1. Open browser developer console (F12) and check for errors
2. Verify the Flask server is running
3. Check network tab in developer tools for failed requests
4. Ensure [app.js](static/app.js) is loading correctly

### Getting Help

If you encounter issues not covered here:

1. Check the browser console for JavaScript errors (F12)
2. Check the Flask terminal output for Python errors
3. Verify all configuration values in `.env`
4. Try the `/health` endpoint: `http://localhost:4000/health`
5. Review the educational comments in the code for guidance

## Educational Resources

### Learning More About the Technologies

- **Flask**: [Official Tutorial](https://flask.palletsprojects.com/tutorial/)
- **Tailwind CSS**: [Documentation](https://tailwindcss.com/docs)
- **JavaScript Fetch API**: [MDN Guide](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- **MLflow**: [Documentation](https://mlflow.org/docs/latest/index.html)
- **Python Type Hints**: [PEP 484](https://peps.python.org/pep-0484/)

### Code Walkthrough

For a detailed understanding of the codebase:

1. Start with [config.py](config.py) to understand configuration
2. Read [diabetes_prediction_app.py](diabetes_prediction_app.py) for backend logic
3. Examine [templates/index.html](templates/index.html) for UI structure
4. Study [static/app.js](static/app.js) for frontend interactions

Each file contains extensive educational comments explaining the code.

### Key Concepts Demonstrated

- **Environment Variables**: Secure configuration management
- **RESTful APIs**: Clean API design with proper HTTP methods
- **Async/Await**: Modern JavaScript asynchronous programming
- **Responsive Design**: Mobile-first CSS with Tailwind
- **Input Validation**: Both client and server-side validation
- **Error Handling**: Graceful failure with user-friendly messages

## Contributing & Extending the Application

This is educational skeleton code designed for students to learn and extend. Below are guidelines and suggestions for improving this project.

### How to Get Started

1. **Fork and Set Up**
   ```bash
   git clone <your-fork-url>
   cd diabetes_prediction_app
   python -m venv venv
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   pip install -r requirements.txt
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Follow the code style used in the project
   - Add educational comments explaining your changes
   - Test thoroughly

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: Brief description of your feature"
   git push origin feature/your-feature-name
   ```

### Code Style Guidelines

#### Python
- Follow PEP 8 style guide
- Use type hints for function parameters and return values
- Add docstrings with parameter descriptions
- Include educational comments for complex logic

Example:
```python
def calculate_average(values: list[float]) -> float:
    """
    Calculate the average of a list of values.

    Args:
        values: List of numerical values

    Returns:
        The arithmetic mean of the values

    Educational Note:
    ----------------
    We validate the input to prevent division by zero errors.
    This demonstrates defensive programming.
    """
    if not values:
        raise ValueError("Cannot calculate average of empty list")
    return sum(values) / len(values)
```

#### JavaScript
- Use modern ES6+ syntax (const/let, arrow functions, async/await)
- Add JSDoc comments for functions
- Follow the existing code structure

#### HTML/CSS
- Use Tailwind utility classes instead of custom CSS when possible
- Maintain responsive design (mobile-first)
- Add comments for complex Tailwind class combinations

### Suggested Improvements for Students

#### 🟢 Beginner Level

1. **Add Input Range Validation**
   - Validate that normalized values are in expected ranges (-0.2 to 0.2)
   - Display helpful error messages for out-of-range values
   - *What you'll learn: Input validation, user experience design*

2. **Improve Error Messages**
   - Make error messages more specific and actionable
   - Add suggestions for fixing common errors
   - *What you'll learn: User experience, error handling*

3. **Add Loading Spinner**
   - Replace text with animated spinner during predictions
   - *What you'll learn: CSS animations, user feedback*

4. **Dark Mode Toggle**
   - Add button to switch between light and dark themes
   - Save user preference in localStorage
   - *What you'll learn: CSS variables, browser storage*

5. **Add Input Placeholders**
   - Show example values in input fields
   - Add tooltips explaining each feature
   - *What you'll learn: HTML attributes, accessibility*

#### 🟡 Intermediate Level

6. **Prediction History**
   - Store recent predictions in localStorage
   - Display history in a table below the form
   - Add ability to clear history
   - *What you'll learn: Browser storage, DOM manipulation*

7. **Batch Predictions from CSV**
   - Add file upload button
   - Parse CSV file and make predictions for each row
   - Download results as CSV
   - *What you'll learn: File handling, CSV parsing, Blob API*

8. **Data Visualization**
   - Add chart showing prediction distribution
   - Visualize input features as radar chart
   - *What you'll learn: Chart.js or D3.js, data visualization*

9. **Add Logging System**
   - Implement Python logging module
   - Log requests, errors, and important events
   - Create log rotation
   - *What you'll learn: Logging, debugging, production practices*

10. **Unit Tests**
    - Write tests for validation functions
    - Test API endpoints
    - Test configuration loading
    - *What you'll learn: pytest, test-driven development*

11. **Rate Limiting**
    - Prevent API abuse with Flask-Limiter
    - Show remaining requests to user
    - *What you'll learn: API security, middleware*

#### 🔴 Advanced Level

12. **User Authentication**
    - User registration and login system
    - Protected routes requiring authentication
    - JWT token management
    - *What you'll learn: Authentication, security, sessions*

13. **Database Integration**
    - Store prediction history in SQLite/PostgreSQL
    - User profiles and preferences
    - Query and display historical data
    - *What you'll learn: SQLAlchemy, database design, ORMs*

14. **Multiple Model Support**
    - Configure multiple MLflow endpoints
    - Allow users to select which model to use
    - Compare predictions from different models
    - *What you'll learn: Multi-model deployment, API design*

15. **Real-time Collaboration**
    - WebSocket support for live updates
    - Share prediction sessions with others
    - *What you'll learn: WebSockets, real-time communication*

16. **Docker Deployment**
    - Create Dockerfile for the application
    - Docker Compose for multi-container setup
    - Environment variable management in containers
    - *What you'll learn: Docker, containerization, deployment*

17. **CI/CD Pipeline**
    - GitHub Actions for automated testing
    - Automatic deployment on merge
    - Code quality checks (linting, formatting)
    - *What you'll learn: DevOps, CI/CD, automation*

18. **API Key Management**
    - Generate API keys for programmatic access
    - Track usage per API key
    - Implement key rotation
    - *What you'll learn: API security, key management*

### Testing Your Changes

```bash
# Manual testing
python diabetes_prediction_app.py
# Open browser and test functionality

# If you add automated tests
pytest

# Code quality checks (optional)
pip install black flake8
black --check .
flake8 .
```

### Commit Message Format

Use descriptive commit messages:

```
feat: Add dark mode toggle

- Implement light/dark theme switching
- Save preference in localStorage
- Add toggle button in header

Educational value: Demonstrates CSS variables and browser storage
```

Commit types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code restructuring without changing functionality
- `test`: Adding tests
- `chore`: Updating build tasks, package manager configs, etc.

### Getting Help

- Read the educational comments in the code
- Check the [Educational Resources](#educational-resources) section
- Review existing code for patterns and examples
- Ask questions by opening an issue

## License

This project is provided as educational material under the MIT License. Feel free to use, modify, and distribute as needed for learning purposes.

---

## Quick Reference Card

### Starting the App
```bash
source venv/bin/activate  # Activate virtual environment
python diabetes_prediction_app.py
```

### Configuration File
```bash
.env  # Edit this file for your settings
```

### Default URL
```
http://localhost:4000
```

### Important Files
- `config.py` - All configuration
- `diabetes_prediction_app.py` - Flask backend
- `templates/index.html` - HTML frontend
- `static/app.js` - JavaScript logic

---

**Built with ❤️ for education**
