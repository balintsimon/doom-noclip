export function menuTemplate() {
    return `
            <button type="button" id="play-game" class="btn btn-light btn-lg">Play</button>
            <button type="button" id="leaderboards" class="btn btn-light btn-lg">Leaderboards</button>
    `
}

export function gameTemplate() {
    return `
            <img aria-disabled="true" id="gun" class="gun" src="static/gun_1.png" draggable="false">
            <div class="enemies">
                <img class="enemy enemy-1" style="visibility: hidden">
                <img class="enemy enemy-2" style="visibility: hidden">
                <img class="enemy enemy-3" style="visibility: hidden">
            </div>
            <p id="bullet_indicator">30</p>
            <p id="health">100</p>
    `
}

export function deathScreen(score) {
    return `
    <form action="/" method="POST">
        <div class="input-group mb-3">
            <div id="user_name_input_field" class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1">Player's name:</span>
                <input id="username" name="username" type="text" class="form-control" placeholder="Player's name" aria-label="Player's name" aria-describedby="basic-addon1" required>
                <input id="score" name="score" type="hidden" value=${score}>
            </div>
        </div>      
        <button id="player_name_input_submit_button" type="submit">Submit player</button>
    </form>
    `
}