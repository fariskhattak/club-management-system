from flask import Flask
from flask_cors import CORS
from app.models import db
from app.routes import register_blueprints
from app.db_utils import init_db

def create_app(config_class="config.Config"):
    app = Flask(__name__)

    # Enable CORS
    CORS(
        app,
        resources={r"/api/*": {"origins": ["http://localhost:3000", "https://club-management-system-frontend.onrender.com"]}},
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    )

    # Configure the app
    app.config.from_object(config_class)

    # Initialize database
    db.init_app(app)
    with app.app_context():
        init_db(app)  # Initialize SQLite database if not exists

    # Register blueprints
    register_blueprints(app)

    return app
