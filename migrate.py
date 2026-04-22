import mysql.connector

def migrate():
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="root@sql#890",
            database="job_tracker"
        )
        cursor = conn.cursor()
        
        # Add new columns
        alter_queries = [
            "ALTER TABLE applications ADD COLUMN job_url VARCHAR(500) DEFAULT NULL;",
            "ALTER TABLE applications ADD COLUMN location VARCHAR(100) DEFAULT NULL;",
            "ALTER TABLE applications ADD COLUMN notes TEXT DEFAULT NULL;"
        ]

        for query in alter_queries:
            try:
                cursor.execute(query)
                print(f"Executed: {query}")
            except mysql.connector.Error as err:
                # Code 1060: Duplicate column name
                if err.errno == 1060:
                    print(f"Skipping (already exists): {query}")
                else:
                    print(f"Error: {err}")

        conn.commit()
        cursor.close()
        conn.close()
        print("Migration complete!")
    except Exception as e:
        print(f"Migration failed: {e}")

if __name__ == "__main__":
    migrate()
