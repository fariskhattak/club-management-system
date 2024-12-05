import sqlite3
import os

def init_db(app):
    schema_path = os.path.join(app.instance_path, 'schema.sql')
    db_path = os.path.join(app.instance_path, 'database.db')
    
    if not os.path.exists(db_path):
        with sqlite3.connect(db_path) as conn:
            with open(schema_path, 'r') as f:
                conn.executescript(f.read())
                print("Database initialized with schema.")
