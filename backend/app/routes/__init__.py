from app.routes.clubs import clubs_bp
from app.routes.events import events_bp
from app.routes.sponsors import sponsors_bp
from app.routes.expenses import expenses_bp
from app.routes.students import students_bp
from app.routes.roles import roles_bp

def register_blueprints(app):
    # Register blueprints
    app.register_blueprint(clubs_bp, url_prefix="/api/clubs")
    app.register_blueprint(students_bp, url_prefix="/api/students")
    app.register_blueprint(events_bp, url_prefix="/api/events")
    app.register_blueprint(sponsors_bp, url_prefix="/api/sponsors")
    app.register_blueprint(expenses_bp, url_prefix="/api/expenses")
    app.register_blueprint(roles_bp, url_prefix="/api/roles")
 