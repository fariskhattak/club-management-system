from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Import all models here
from .club import Club, Membership
from .student import Student, EventAttendance
from .event import Event, EventHosting
from .sponsor import Sponsor, SponsorshipContribution
from .budget import Budget, Expense
from .role import Role, ClubRole