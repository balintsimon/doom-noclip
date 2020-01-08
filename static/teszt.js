const body = document.getElementById('teszt');
var machineGunHitIntervalTimer = false;

//sound and music related
let pistol_sound = new Audio("static/sound/dspistol.wav");
let reload_pistol = new Audio("static/sound/reload_gun2.mp3");
let machinegun_sound = new Audio("static/sound/gun2.mp3");
let reload_machinegun = new Audio("static/sound/gun_cock_slow.mp3");
let cock_machinegun = new Audio("static/sound/machine_gun_clip_in.mp3");

let music = new Audio("static/sound/doom_gate_music.mp3");
let music_button = document.getElementById("music-button");
let music_is_playing = 0;

function play_sound(sound, loop) {
    sound.loop = loop;
    sound.play();
    sound.currentTime = 0;
}

let stop_sound = function(sound) {
    sound.pause();
    sound.currentTime = 0;
};

music_button.addEventListener("click", function () {
    if (music_is_playing === 0) {
        music_is_playing = 1;
        play_sound(music, true);
        music_button.textContent = "Stop music";
    } else {
        music_is_playing = 0;
        stop_sound(music);
        music_button.textContent = "Restart music";
    }
});

// gun stats
//image, clip_size, fire_rate, max_clip, damage, reload_time, fire type
let gun = 1;
let gunStats = [];
gunStats[1] = ['gun_1', 30, 100, 30, 5, 2000, 'mousedown'];
gunStats[2] = ['images/pistol', 6, 100, 6, 20, 2000,'click'];
let shooting = false;
let bulletTaking = false;
let reloading = false;

function startGame() {
    const gameWindow = document.querySelector('.game-display');
    gameWindow.addEventListener('click', shootGun);
    gameWindow.addEventListener('mousedown', holdShooting, true);
    gameWindow.addEventListener('mouseup', holdStopShooting,true);
    document.getElementById('bullet_indicator').innerText = gunStats[gun][1];
    displayEnemies();
    const childs = document.getElementsByTagName('body')[0].children;
    for (let element of childs){
        element.style.userSelect = 'none';
    }
    switch_damage_enemy(gun);
}

// merge This code!!

function displayEnemies() {
    const enemySpawnNumber = Math.floor(Math.random() * (10000 - 3000) + 3000); // creates a random number between 3000 and 10000 (milliseconds!)
    setTimeout(checkEmptyPositions, enemySpawnNumber); // use this to run this function when the code is completed
}

function checkEmptyPositions() {
    const enemies = document.querySelectorAll('.enemy'); // enemy object with all the enemies inside
    let emptyPositions = [];
    enemies.forEach(monster => (monster.getAttribute('src')) ? {} : emptyPositions.push(monster));
    (emptyPositions.length === 0) ? displayEnemies() : insertEnemyPicture(emptyPositions)
}

function insertEnemyPicture(positions) {
    const enemyPicture = [{src :'/static/images/enemies/doom-enemy1.gif', health : 100, missChance : 20}];
    const randomEnemyIndex = Math.floor(Math.random() * enemyPicture.length);
    const randomIndex = Math.floor(Math.random() * positions.length);
    positions[randomIndex].setAttribute('src', enemyPicture[randomEnemyIndex].src);
    positions[randomIndex].setAttribute('data-health', enemyPicture[randomEnemyIndex].health);
    positions[randomIndex].setAttribute('data-miss_chance', enemyPicture[randomEnemyIndex].missChance);
    positions[randomIndex].setAttribute('data-enemy_type', randomEnemyIndex);
    return displayEnemies();
}

// THIS THE END

window.onkeydown = function (e) {
    try{
        const key = Number(e.key);
        if ( gunStats[key]){
            if (reloading){return}
            if (key == gun){return}
            gun = key;
            switchGun()
        }
    }catch{}
};

function switchGun() {
    document.querySelector('.gun').classList.toggle('gun-switch');
    reloading = true;
    setTimeout(() => {
        switch_damage_enemy(gun);
        document.getElementById('gun').setAttribute('src', 'static/' + gunStats[gun][0] + '.png');
        document.getElementById('bullet_indicator').innerText = gunStats[gun][1];
        document.querySelector('.gun').classList.toggle('gun-switch');
        setTimeout(function () {
            reloading = false
        },1000)

    }, 1000);
}

// enemy related test

let enemy = document.getElementById("enemy_test");
enemy["health"] = 100;

let enemy_killed = function(enemy) {
    if (enemy["health"] <= 0) {
        enemy.textContent = "killed"
}
}

//------------------

let machine_gun_hit_interval = function(actual_enemy, gun) {
    machineGunHitIntervalTimer = setInterval(function() {
        if (reloading) {clearInterval(machineGunHitIntervalTimer)}
        actual_enemy["health"] -= gunStats[gun][4];
        console.log(actual_enemy["health"]);
        enemy_killed(actual_enemy);
    }, gunStats[gun][2])
};

let switch_damage_enemy = function(current_gun) {
    if (current_gun === 1) /*machinegun*/ {
        enemy.addEventListener("mousedown", function (event) {
            let actual_enemy = event.target;
            if (shooting === true) {
                machine_gun_hit_interval(actual_enemy, gun);
            } else if (shooting === false) {
                clearInterval(machine_gun_hit_interval);
                console.log(actual_enemy["health"]);
                enemy_killed(actual_enemy);
            }
        }),
        enemy.addEventListener("mouseenter", function (event) {
            let actual_enemy = event.target;
            if (shooting === true) {
                machine_gun_hit_interval(actual_enemy, gun);
            } else if (shooting === false) {
                clearInterval(machine_gun_hit_interval);
                console.log(actual_enemy["health"]);
                enemy_killed(actual_enemy);
            }
        }),
        enemy.addEventListener("mouseout", function (event) {
            if (machineGunHitIntervalTimer) {
                clearInterval(machineGunHitIntervalTimer);
            }
        })
    } else if (current_gun === 2) /*pistol*/ {
        enemy.addEventListener('mousedown', function (event) {
            if (!reloading) {
            let actual_enemy = event.target;
            actual_enemy["health"] -= gunStats[gun][4];
            console.log(actual_enemy["health"]);
            enemy_killed(actual_enemy);
            }
        })
    }
};

function holdShooting() {
    if (gunStats[gun][6] === 'mousedown'){
        startShooting()
    }
}

function shootGun() {
    if ( gunStats[gun][6] === 'mousedown' || reloading ){return}
    const pistol = document.querySelector('.gun');
    gunStats[gun][1] -= 1;
    document.getElementById('bullet_indicator').innerText = gunStats[gun][1];
    play_sound(pistol_sound, false);
    this.removeEventListener('click', shootGun);
    if (gunStats[gun][1] === 0) {
        pistol.setAttribute('src', '/static/images/pistolShoot.gif');
        setTimeout(() => {
            document.getElementById('bullet_indicator').innerText = 'Reloading'
            reloading = true;
            reloadGun(pistol, this);
        }, 250);
    } else {
        pistol.setAttribute('src', '/static/images/pistolShoot.gif');
        setTimeout(() => {
            pistol.setAttribute('src', '/static/images/pistol.gif');
            this.addEventListener('click', shootGun);
        }, 250);
    }
}

function holdStopShooting() {
    if (gunStats[gun][6] === 'mousedown'){
        stopShooting()
    }
}

function startShooting(){
    if (reloading){return}
    document.getElementById('gun').setAttribute('src', "static/" + gunStats[gun][0] + ".gif");
    shooting = true;
    play_sound(machinegun_sound, true);
    gunStats[gun][1] -= 1;
    document.getElementById('bullet_indicator').innerText = gunStats[gun][1];
    if (gunStats[gun][1] <= 0){startReloading()}
    bulletTaking = setInterval( function () {
        gunStats[gun][1] -= 1;
        document.getElementById('bullet_indicator').innerText = gunStats[gun][1];
        if (gunStats[gun][1] <= 0){startReloading()}
    }, gunStats[gun][2])
}

function startReloading() {
    reloading = true;
    stopShooting();
    gunStats[gun][1] = gunStats[gun][3];
    body.style.cursor = 'wait';
    document.getElementById('bullet_indicator').innerText = 'Reloading';
    play_sound(reload_machinegun, false);
    play_sound(cock_machinegun, false);
    var reloadTimer = setInterval(function () {
        body.style.cursor = 'crosshair';
        reloading = false;
        document.getElementById('bullet_indicator').innerText = gunStats[gun][1];
        clearInterval(reloadTimer)
    }, gunStats[gun][5])
}

function stopShooting(){
    document.getElementById('gun').setAttribute('src', "static/" + gunStats[gun][0] + ".png");
    shooting = false;
    stop_sound(machinegun_sound);
    try{clearInterval(bulletTaking)}catch {};
    try{clearInterval(machineGunHitIntervalTimer)}catch {};
}

document.getElementById('gun').ondragstart = function() { return false; };

document.getElementById('game-border').onmouseleave = function(){try{stopShooting()}catch {}};

window.onmousemove = function (e) {
    var x = e.clientX,
        y = e.clientY;
    if (x > 300 && x < 1500) {
        document.getElementById('gun').style.left = (x - 370) + 'px';
    } else {
        stopShooting()
    }
};

function reloadGun(pistol, gameWindow) {
    play_sound(reload_pistol, false);
    pistol.setAttribute('src', '/static/images/pistolReload.gif');
    setTimeout(() => {
        pistol.setAttribute('src', '/static/images/pistol.gif');
        gameWindow.addEventListener('click', shootGun);
        gunStats[gun][1] = gunStats[gun][3];
        reloading = false;
        document.getElementById('bullet_indicator').innerText = gunStats[gun][1];
    }, 1370);
}




startGame();