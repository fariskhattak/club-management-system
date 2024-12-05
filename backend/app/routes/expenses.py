from flask import Blueprint, jsonify, request
from app.models import db, Expense, Budget
from datetime import datetime, date
from sqlalchemy import and_

# Define the blueprint
expenses_bp = Blueprint("expenses", __name__)

@expenses_bp.route("/categories", methods=["GET"])
def get_expense_categories():
    try:
        # Hardcoded list based on the database schema
        categories = ['Event', 'Supplies', 'Travel', 'Food', 'Other']
        return jsonify({"categories": categories}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

# Route to find expenses for a club within the chosen fiscal year
@expenses_bp.route("/<int:club_id>", methods=["GET"])
def get_expenses_for_club(club_id):
    fiscal_year = request.args.get("fiscal_year")  # Get fiscal year from query parameters
    # Query expenses based on club_id
    query = Expense.query.filter_by(club_id=club_id)

    if fiscal_year:
        fiscal_year = int(fiscal_year)

        # Define the start and end dates of the fiscal year
        fiscal_year_start = date(fiscal_year, 1, 1)  # Adjust based on fiscal year start date
        fiscal_year_end = date(fiscal_year + 1, 1, 1)  # Fiscal year ends on the last day before this date

        # Filter expenses based on their date being within the fiscal year range
        query = query.filter(Expense.expense_date >= fiscal_year_start, Expense.expense_date < fiscal_year_end)

    expenses = query.all()

    if not expenses:
        return jsonify({"message": "No expenses found for this club"}), 200

    expense_list = [
        {
            "expense_id": expense.expense_id,
            "expense_name": expense.expense_name,
            "expense_amount": expense.expense_amount,
            "expense_date": expense.expense_date.isoformat(),
            "description": expense.description,
            "category": expense.category,
        }
        for expense in expenses
    ]
    return jsonify({"expenses": expense_list}), 200
    

# Route to add an expense to the club
@expenses_bp.route("/<int:club_id>", methods=["POST"])
def add_expense(club_id):
    data = request.json
    try:
        # Validate input
        if not data.get("expense_name") or not data.get("expense_amount") or not data.get("expense_date"):
            return jsonify({"error": "Expense name, amount, and date are required"}), 400

        # Parse expense date and determine fiscal year
        expense_date = datetime.strptime(data["expense_date"], "%Y-%m-%d").date()
        fiscal_year = expense_date.year

        # Find the appropriate budget for the fiscal year
        budget = Budget.query.filter_by(club_id=club_id, fiscal_year=fiscal_year).first()
        if not budget:
            return jsonify({"error": "No budget found for the given fiscal year"}), 404

        # Create a new expense
        new_expense = Expense(
            club_id=club_id,
            budget_id=budget.budget_id,
            expense_name=data["expense_name"],
            expense_amount=data["expense_amount"],
            expense_date=expense_date,
            description=data.get("description"),
            category=data.get("category"),
        )
        db.session.add(new_expense)
        db.session.commit()

        return jsonify({"message": "Expense added successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    

# Route to remove an expense from the club
@expenses_bp.route("/<int:club_id>/<int:expense_id>", methods=["DELETE"])
def delete_expense(club_id, expense_id):
    try:
        # Find the expense
        expense = Expense.query.filter_by(club_id=club_id, expense_id=expense_id).first()
        if not expense:
            return jsonify({"error": "Expense not found"}), 404

        # Delete the expense
        db.session.delete(expense)
        db.session.commit()
        return jsonify({"message": "Expense deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    

# Route to search expenses based on search params within the chosen fiscal year
@expenses_bp.route("/<int:club_id>/search", methods=["GET"])
def search_expenses(club_id):
    name = request.args.get("expense_name", "").strip()
    category = request.args.get("category", "").strip()
    fiscal_year = request.args.get("fiscal_year")  # Get fiscal year from query parameters

    try:
        # Build query filters
        filters = [Expense.club_id == club_id]
        if name:
            filters.append(Expense.expense_name.ilike(f"%{name}%"))
        if category:
            filters.append(Expense.category.ilike(f"%{category}%"))
        if fiscal_year:
            fiscal_year = int(fiscal_year)
            fiscal_year_start = date(fiscal_year, 1, 1)  # Adjust if fiscal year starts on a different date
            fiscal_year_end = date(fiscal_year + 1, 1, 1)  # End of fiscal year (exclusive)
            filters.append(Expense.expense_date >= fiscal_year_start)
            filters.append(Expense.expense_date < fiscal_year_end)

        # Query expenses
        expenses = Expense.query.filter(and_(*filters)).all()

        if not expenses:
            return jsonify({"expenses": []}), 200

        # Format the result
        expense_list = [
            {
                "expense_id": expense.expense_id,
                "expense_name": expense.expense_name,
                "expense_amount": expense.expense_amount,
                "expense_date": expense.expense_date.isoformat(),
                "description": expense.description,
                "category": expense.category,
            }
            for expense in expenses
        ]

        return jsonify({"expenses": expense_list}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500