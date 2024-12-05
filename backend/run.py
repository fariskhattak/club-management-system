import os
from app import create_app
from app.models import db

# Load environment variable for the Flask configuration
FLASK_ENV = os.getenv("FLASK_ENV", "development")
CONFIG_CLASS = "config.ProductionConfig" if FLASK_ENV == "production" else "config.Config"

# Create the app using the selected configuration
app = create_app(CONFIG_CLASS)

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=(FLASK_ENV == "development"), host="0.0.0.0", port=5001)
