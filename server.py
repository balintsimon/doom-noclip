from flask import Flask, render_template, request, g, session, url_for, redirect
import data_manager
app = Flask(__name__)


@app.route('/', methods=['POST', 'GET'])
def index():
    all_high_scores = data_manager.get_highscores()

    if request.method == "POST":
        username = request.form.get('username')
        new_highscore = request.form.get('highscore')
        if data_manager.get_user(username):
            data_manager.create_user(username, new_highscore)
        else:
            new_highscore = request.form.get('highscore')
            current_highscore = data_manager.get_user_highscore(username)
            if new_highscore > current_highscore:
                data_manager.write_new_highscore(username, new_highscore)
        return render_template('index.html',
                               all_high_scores=all_high_scores,
                               username=username,
                               data_manager=data_manager,
                               current_highscore=current_highscore,
                               new_highscore=new_highscore)

    return render_template('index.html',
                           users=all_high_scores)


@app.route('/high_scores')
def show_high_scores():
    all_high_scores = data_manager.get_highscores()
    return render_template('high_scores.html',
                           users=all_high_scores)


if __name__ == '__main__':
    app.run(debug=True)
