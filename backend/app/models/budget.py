from app.models import db

class Budget(db.Model):
    __tablename__ = 'Budget'
    budget_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    club_id = db.Column(db.Integer, db.ForeignKey('Clubs.club_id'), nullable=False)
    fiscal_year = db.Column(db.Integer, nullable=False)
    total_budget = db.Column(db.Float, nullable=False)

class Expense(db.Model):
    __tablename__ = 'Expenses'
    expense_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    club_id = db.Column(db.Integer, db.ForeignKey('Clubs.club_id'), nullable=False)
    budget_id = db.Column(db.Integer, db.ForeignKey('Budget.budget_id'), nullable=False)
    expense_name = db.Column(db.String(255), nullable=False)
    expense_amount = db.Column(db.Float, nullable=False)
    expense_date = db.Column(db.Date, nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.Text)
