"""
MediAssist Flask API - Simple and Clean
"""

from flask import Flask, jsonify
from flask_cors import CORS
import os

# Import prediction routes
from routes.predictions import predictions_bp


# Initialize Flask app
app = Flask(__name__)

# Simple CORS setup - allow requests from frontend
CORS(app, origins=['http://localhost:3000', 'http://localhost:3001'])

# Register prediction routes
app.register_blueprint(predictions_bp)


@app.route('/')
def index():
    """API home page"""
    return jsonify({
        "message": "MediAssist API",
        "endpoints": {
            "health": "GET /api/health",
            "predict_diabetes": "POST /api/predict/diabetes",
            "predict_heart_disease": "POST /api/predict/heart-disease",
            "predict_parkinsons": "POST /api/predict/parkinsons"
        }
    })


@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500


if __name__ == '__main__':
    print("\nMediAssist API Running on http://localhost:5000")
    print("Press CTRL+C to stop\n")
    app.run(host='0.0.0.0', port=5000, debug=True)
