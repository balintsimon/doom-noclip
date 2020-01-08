from psycopg2 import errors
import psycopg2
import connection


@connection.connection_handler
def create_user(cursor, username, highscore):
    try:
        cursor.execute("""
        INSERT INTO users
        VALUES (DEFAULT , %(username)s, %(registration_time)s, %(high_score)s);
        """, {'username': username,
              'high_score': highscore})
    except psycopg2.errors.UniqueViolation:
        return False
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
    SET highscore = %(highscore)s
    WHERE username = %(username)s""",
   {'highscore': highscore,
    'username': username})

