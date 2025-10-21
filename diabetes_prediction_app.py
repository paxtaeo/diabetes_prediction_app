"""
Diabetes Prediction Web Application

This Flask application provides a web interface for predicting diabetes progression
using a machine learning model deployed on Databricks MLflow.

Educational Overview:
--------------------
This application demonstrates several important software engineering concepts:
1. Separation of Concerns: Configuration separate from business logic
2. RESTful API Design: Clean endpoints for client-server communication
3. Error Handling: Graceful handling of failures with informative messages
4. Input Validation: Ensuring data quality before processing
5. Documentation: Comprehensive comments explaining the "why" behind the code

Architecture:
------------
- Frontend: HTML/JavaScript form that collects patient data
- Backend: Flask server that processes requests and calls the ML model
- ML Service: Databricks MLflow serving endpoint that returns predictions

Author: [Your Name / Team Name]
Last Updated: 2025-01-21
"""

# ============================================================================
# Standard Library Imports
# ============================================================================
import json
import sys
from typing import Dict, Any, Union

# ============================================================================
# Third-Party Imports
# ============================================================================
import requests
import pandas as pd
from flask import Flask, render_template, request, jsonify

# ============================================================================
# Local Imports
# ============================================================================
from config import Config, get_config

# ============================================================================
# Application Initialization
# ============================================================================

# Initialize Flask application
# __name__ tells Flask where to look for templates, static files, etc.
app = Flask(__name__)

# Load configuration from the Config class
# This centralizes all settings in one place for easy management
app.config.from_object(Config)

# Print configuration status on startup for debugging
# This helps students verify their configuration is correct
Config.print_config_status()


# ============================================================================
# Helper Functions
# ============================================================================

def create_tf_serving_json(data: Union[Dict, pd.DataFrame]) -> Dict:
    """
    Converts data to TensorFlow Serving JSON format.

    This function handles the special format required by some TensorFlow models.
    It's a utility function that transforms our Python data structures into
    the format expected by certain model serving frameworks.

    Args:
        data: Input data as either a dictionary or pandas DataFrame

    Returns:
        Dict: Data formatted for TensorFlow Serving API

    Educational Note:
    ----------------
    Different ML frameworks have different input format requirements.
    This helper function encapsulates the transformation logic, making
    the main code cleaner and easier to maintain. If the format changes,
    we only need to update this one function.
    """
    if isinstance(data, dict):
        return {'inputs': {name: data[name].tolist() for name in data.keys()}}
    return {'inputs': data.tolist()}


def validate_input_data(data: Dict) -> tuple[bool, str]:
    """
    Validates the input data from the client.

    This function ensures that all required fields are present and contain
    valid values before attempting to make a prediction.

    Args:
        data: Dictionary containing the input features

    Returns:
        tuple: (is_valid: bool, error_message: str)

    Educational Note:
    ----------------
    Input validation is crucial because:
    1. It prevents errors downstream in the ML model
    2. It provides clear, actionable error messages to users
    3. It protects against malicious or malformed input
    4. It fails fast, saving resources and time
    """
    required_features = Config.MODEL_FEATURES

    # Check if all required features are present
    missing_features = [f for f in required_features if f not in data]
    if missing_features:
        return False, f"Missing required features: {', '.join(missing_features)}"

    # Validate that all values can be converted to float
    for feature in required_features:
        try:
            float(data[feature])
        except (ValueError, TypeError):
            return False, f"Invalid value for feature '{feature}': must be a number"

    return True, ""


def score_model(dataset: pd.DataFrame) -> Dict[str, Any]:
    """
    Sends a prediction request to the MLflow model serving endpoint.

    This function handles the entire process of calling the remote ML model:
    1. Formats the data according to MLflow's expected schema
    2. Adds authentication headers with the Databricks token
    3. Makes the HTTP POST request to the serving endpoint
    4. Handles errors and returns the prediction result

    Args:
        dataset: pandas DataFrame containing the input features

    Returns:
        Dict: The prediction result from the model

    Raises:
        Exception: If the API request fails or returns an error

    Educational Note:
    ----------------
    This function demonstrates the client side of an API integration.
    Key concepts illustrated here:
    - Authentication: Using bearer tokens for secure API access
    - Data serialization: Converting Python objects to JSON
    - Error handling: Checking response status and providing context
    - Timeout handling: Preventing indefinite waits on slow responses
    """
    # Get configuration values
    url = Config.MLFLOW_ENDPOINT_URL
    token = Config.DATABRICKS_TOKEN
    timeout = Config.REQUEST_TIMEOUT

    # Prepare authentication and content-type headers
    # The Authorization header uses the "Bearer" scheme with our token
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }

    # Format the data according to MLflow's expected schema
    # MLflow expects data in a "dataframe_split" format for pandas DataFrames
    if isinstance(dataset, pd.DataFrame):
        data_dict = {'dataframe_split': dataset.to_dict(orient='split')}
    else:
        data_dict = create_tf_serving_json(dataset)

    # Serialize to JSON, allowing NaN values (common in ML datasets)
    data_json = json.dumps(data_dict, allow_nan=True)

    # Make the POST request to the MLflow endpoint
    # We use a timeout to prevent hanging indefinitely on slow responses
    try:
        response = requests.post(
            url=url,
            headers=headers,
            data=data_json,
            timeout=timeout
        )
    except requests.exceptions.Timeout:
        raise Exception(f'Request timed out after {timeout} seconds. The model endpoint may be slow or unavailable.')
    except requests.exceptions.ConnectionError:
        raise Exception('Failed to connect to the model endpoint. Check your internet connection and endpoint URL.')

    # Check if the request was successful (HTTP 200 OK)
    # Any other status code indicates an error
    if response.status_code != 200:
        raise Exception(
            f'Request failed with status {response.status_code}. '
            f'Response: {response.text}'
        )

    # Parse and return the JSON response
    return response.json()


def build_dataframe_from_request(data: Dict) -> pd.DataFrame:
    """
    Builds a pandas DataFrame from the request data.

    This function extracts the feature values from the request and creates
    a DataFrame in the exact format expected by the ML model.

    Args:
        data: Dictionary containing the input features from the request

    Returns:
        pd.DataFrame: Single-row DataFrame with all features

    Educational Note:
    ----------------
    We use pandas DataFrames because:
    1. They maintain column order and names (important for ML models)
    2. They handle type conversions automatically
    3. They integrate seamlessly with scikit-learn and other ML libraries
    4. They make it easy to extend to batch predictions later
    """
    # Create a dictionary with all features, converting values to float
    # Using get() with a default of 0 provides a fallback if a value is missing
    # (though our validation should prevent missing values from reaching here)
    feature_dict = {
        feature: float(data.get(feature, 0))
        for feature in Config.MODEL_FEATURES
    }

    # Create a DataFrame with a single row
    # The model expects a DataFrame even for single predictions
    return pd.DataFrame([feature_dict])


# ============================================================================
# Flask Routes
# ============================================================================

@app.route('/')
def home():
    """
    Serves the main application page.

    This is the landing page of the application where users can input
    patient data and receive predictions.

    Returns:
        Rendered HTML template for the home page

    Educational Note:
    ----------------
    The @app.route decorator maps this function to the '/' URL path.
    When users visit the root of our application, Flask calls this function.
    Flask automatically looks for 'index.html' in the 'templates' directory.
    """
    return render_template('index.html')


@app.route('/predict', methods=['POST'])
def predict():
    """
    Handles prediction requests from the frontend.

    This endpoint receives patient data as JSON, validates it, sends it to
    the ML model, and returns the prediction result.

    Request Format:
        POST /predict
        Content-Type: application/json
        Body: {
            "age": 0.05,
            "sex": 0.05,
            "bmi": 0.06,
            ...
        }

    Response Format (Success):
        {
            "success": true,
            "prediction": 152.5
        }

    Response Format (Error):
        {
            "success": false,
            "error": "Error description"
        }

    Returns:
        JSON response with prediction result or error message

    Educational Note:
    ----------------
    This function demonstrates RESTful API design principles:
    1. Uses POST method for operations that change state or process data
    2. Returns JSON for easy consumption by JavaScript clients
    3. Uses appropriate HTTP status codes (200 for success, 400 for errors)
    4. Provides structured, predictable response formats
    5. Includes comprehensive error handling
    """
    try:
        # Parse JSON data from the request body
        # request.get_json() automatically parses the JSON and returns a dict
        data = request.get_json()

        # Validate that we received data
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided in request body'
            }), 400

        # Validate the input data
        is_valid, error_message = validate_input_data(data)
        if not is_valid:
            return jsonify({
                'success': False,
                'error': error_message
            }), 400

        # Build DataFrame from the validated input data
        df = build_dataframe_from_request(data)

        # Get prediction from the MLflow model
        result = score_model(df)

        # Extract the prediction value from the result
        # Different model types return predictions in different formats
        # This handles both "predictions" array and direct result formats
        if 'predictions' in result:
            prediction_value = result['predictions'][0]
        else:
            prediction_value = result

        # Return successful response with prediction
        return jsonify({
            'success': True,
            'prediction': prediction_value
        })

    except requests.exceptions.RequestException as e:
        # Handle network-related errors specifically
        return jsonify({
            'success': False,
            'error': f'Network error while calling model endpoint: {str(e)}'
        }), 500

    except Exception as e:
        # Catch-all for any other unexpected errors
        # In production, you might want to log these errors to a file or service
        return jsonify({
            'success': False,
            'error': f'An error occurred: {str(e)}'
        }), 400


# ============================================================================
# Health Check Endpoint (Optional but Recommended)
# ============================================================================

@app.route('/health', methods=['GET'])
def health_check():
    """
    Health check endpoint for monitoring and deployment systems.

    This endpoint can be used by load balancers, monitoring tools, or
    container orchestration systems to verify that the application is running.

    Returns:
        JSON response indicating application health status

    Educational Note:
    ----------------
    Health check endpoints are a best practice in production applications.
    They allow automated systems to:
    1. Verify the application is running before routing traffic to it
    2. Detect and restart failed instances
    3. Monitor application uptime and availability
    """
    # Validate configuration
    is_valid, errors = Config.validate_config()

    if is_valid:
        return jsonify({
            'status': 'healthy',
            'app': Config.APP_NAME,
            'version': Config.APP_VERSION
        }), 200
    else:
        return jsonify({
            'status': 'unhealthy',
            'errors': errors
        }), 500


# ============================================================================
# Application Entry Point
# ============================================================================

if __name__ == '__main__':
    """
    Main entry point when running the application directly.

    This block only runs when you execute this file directly (python app.py),
    not when it's imported as a module. It validates configuration and starts
    the Flask development server.

    Educational Note:
    ----------------
    The __name__ == '__main__' pattern is a Python idiom that allows a file to
    be both imported as a module and run as a standalone script. This is useful
    for testing and development.
    """

    print("\n" + "="*70)
    print("STARTING DIABETES PREDICTION APPLICATION")
    print("="*70)

    # Validate configuration before starting the server
    is_valid, errors = Config.validate_config()

    if not is_valid:
        print("\n❌ CONFIGURATION ERROR!\n")
        print("The application cannot start due to configuration issues:\n")
        for error in errors:
            print(f"  • {error}")
        print("\nPlease check your .env file or environment variables.")
        print("See .env.example for a template and configuration instructions.\n")
        sys.exit(1)

    print("\n✅ Configuration validated successfully!\n")
    print(f"🚀 Starting server at http://{Config.HOST}:{Config.PORT}")
    print(f"📊 Model endpoint: {Config.MLFLOW_ENDPOINT_URL}")
    print("\nPress CTRL+C to stop the server\n")
    print("="*70 + "\n")

    # Start the Flask development server
    # WARNING: The Flask development server is not suitable for production!
    # For production, use a WSGI server like Gunicorn or uWSGI
    app.run(
        debug=Config.DEBUG,
        host=Config.HOST,
        port=Config.PORT
    )
