import sqlite3
import os

# Check for database files
print('Looking for database files...')
for root, dirs, files in os.walk('.'):
    for file in files:
        if file.endswith('.db'):
            filepath = os.path.join(root, file)
            print(f'Found database: {filepath}')
            
            # Check table contents
            conn = sqlite3.connect(filepath)
            cursor = conn.cursor()
            
            # List all tables
            cursor.execute('SELECT name FROM sqlite_master WHERE type="table";')
            tables = cursor.fetchall()
            print(f'  Tables: {[t[0] for t in tables]}')
            
            # Check companies table if it exists
            if any('companies' in t[0].lower() for t in tables):
                cursor.execute('SELECT COUNT(*) FROM companies;')
                count = cursor.fetchone()[0]
                print(f'  Companies count: {count}')
                
                if count > 0:
                    cursor.execute('SELECT * FROM companies LIMIT 3;')
                    sample = cursor.fetchall()
                    print(f'  Sample companies: {sample}')
            
            conn.close()
            print()