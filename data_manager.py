from psycopg2 import errors
import psycopg2
import connection


@connection.connection_handler
def create_user(cursor, username, highscore):
    cursor.execute("""
    INSERT INTO users
    VALUES (DEFAULT, %(name)s, %(high_score)s);
    """, {'name': username,
          'high_score': highscore})
    return True


@connection.connection_handler
def get_user(cursor, username):
    cursor.execute("""
    SELECT * FROM users
    WHERE name = %(username)s
    """,
    {'username': username})

    user = cursor.fetchone()
    return user


@connection.connection_handler
def get_user_id(cursor, username):
    cursor.execute("""
    SELECT id from users
    WHERE name = %(username)s;
    """,
    {'username': username})

    user = cursor.fetchone()
    return user['id']


@connection.connection_handler
def get_highscores(cursor):
    cursor.execute("""
    SELECT name, high_score
    FROM users
    ORDER BY high_score DESC
    LIMIT 5
    """)

    users = cursor.fetchall()
    return users


@connection.connection_handler
def get_user_highscore(cursor, username):
    cursor.execute("""
    SELECT name, high_score
    FROM users
    WHERE name = %(username)s
    """,
        {'username': username})

    user = cursor.fetchone()
    return user


@connection.connection_handler
def write_new_highscore(cursor, username, highscore):
    cursor.execute("""
    UPDATE users
    SET high_score = %(highscore)s
    WHERE name = %(username)s""",
   {'highscore': highscore,
    'username': username})

