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
        <label for="username">Player's name:</label>
        <input id="username" name="username" type="text" value="Doom Slayer's name" required>
        <input id="score" name="score" type="hidden" value=${score}>
        <button type="submit">Submit player</button>
    </form>
    `
}