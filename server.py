from flask import Flask, render_template, request, g, session, url_for, redirect
import data_manager
app = Flask(__name__)


@app.route('/', methods=['POST', 'GET'])
def index():
    if request.method == "POST":
        username = request.form.get('username')
        player_score = int(request.form.get('score'))
        if not data_manager.get_user(username):
            data_manager.create_user(username, player_score)
        else:
            current_highscore = data_manager.get_user_highscore(username)
            if player_score > current_highscore['high_score']:
                data_manager.write_new_highscore(username, player_score)

        all_high_scores = data_manager.get_highscores()
        return render_template('user-death.html',
                               users=all_high_scores,
                               username=username,
                               new_highscore=player_score)

    all_high_scores = data_manager.get_highscores()
    return render_template('index.html',
                           users=all_high_scores)


@app.route('/high-scores')
def show_high_scores():
    all_high_scores = data_manager.get_highscores()
    return render_template('high_scores.html',
                           users=all_high_scores)


if __name__ == '__main__':
    app.run(debug=True)
