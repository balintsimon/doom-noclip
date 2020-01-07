const body = document.getElementById('teszt');

//sound related
let pistol_sound = new Audio("static/dspistol.wav");
let reload_pistol = new Audio("static/reload_gun2.mp3");
let machinegun_sound = new Audio("static/gun2.mp3");
let reload_machinegun = new Audio("static/gun_cock_slow.mp3");
let cock_machinegun = new Audio("static/machine_gun_clip_in.mp3");

let play_gun_sound_once = function(sound) {
    sound.play();
    sound.currentTime = 0;
};

let play_continous_gun_sound = function(sound) {
    sound.loop = true;
    sound.play();
    sound.currentTime = 0;
};

let stop_gun_sound = function(sound) {
    sound.pause();
    sound.currentTime = 0;
};

//music related
let music = new Audio("static/doom_gate_music.mp3");
let play_music = function() {
    music.loop = true;
    music.play();
};

let stop_music = function() {
    music.pause();
    music.currentTime = 0;
};

let music_button = document.getElementById("music-button");
let music_is_playing = 0;

music_button.addEventListener("click", function () {
    if (music_is_playing === 1) {
        music_is_playing = 0;
        console.log(music_is_playing);
        stop_music();
        music_button.textContent = "Restart music";
    } else if (music_is_playing === 0) {
        music_is_playing = 1;
        console.log(music_is_playing);
        play_music();
        music_button.textContent = "Stop music";
    }
});


// gun stats
//image, clip_size, fire_rate, max_clip, damage, reload_time, fire type
let gun = 2;
let gunStats = [];
gunStats[1] = ['gun_1', 30, 100, 30, 5, 2000, 'mousedown'];
gunStats[2] = ['images/pistol', 6, 100, 6, 20, 2000,'click'];
let shooting = false;
let bulletTaking = false;
let reloading = false;



function startGame() {
    const gameWindow = document.querySelector('.game-display');
    gameWindow.addEventListener('click', shootPistol);
    gameWindow.addEventListener('mousedown', holdShooting, true);
    gameWindow.addEventListener('mouseup', holdStopShooting,true);
    document.getElementById('bullet_indicator').innerText = gunStats[gun][1];
    const childs = document.getElementsByTagName('body')[0].children;
    for (let element of childs){
        element.style.userSelect = 'none';
    }
}

window.onkeydown = function (e) {
    try{
        var key = Number(e.key);
        if ( gunStats[key]){
            if (reloading){return}
            gun = key;
            loadMachineGun()
        }
    }catch{}
};

function loadMachineGun() {
    document.getElementById('gun').setAttribute('src', 'static/' + gunStats[gun][0] + '.png');
    document.getElementById('bullet_indicator').innerText = gunStats[gun][1]
}

function holdShooting() {
    if (gunStats[gun][6] === 'mousedown'){
        startShootingMachinegun()
    }
}

function shootPistol() {
    if (gunStats[gun][6] === 'mousedown'){return}
    const pistol = document.querySelector('.gun');
    gunStats[gun][1] -= 1;
    document.getElementById('bullet_indicator').innerText = gunStats[gun][1];
    play_gun_sound_once(pistol_sound);
    this.removeEventListener('click', shootPistol);

    if (gunStats[gun][1] === 0) {
        pistol.setAttribute('src', '/static/images/pistolShoot.gif');
        setTimeout(() => {
            document.getElementById('bullet_indicator').innerText = 'Reloading';
            reloading = true;
            reloadGun(pistol, this);
        }, 250);
    } else {
        pistol.setAttribute('src', '/static/images/pistolShoot.gif');
        setTimeout(() => {
            pistol.setAttribute('src', '/static/images/pistol.gif');
            this.addEventListener('click', shootPistol);
        }, 250);
    }
}

function holdStopShooting() {
    if (gunStats[gun][6] === 'mousedown') {
        stopShooting()
    }
}

function startShootingMachinegun(){
    if (reloading){return}
    document.getElementById('gun').setAttribute('src', "static/" + gunStats[gun][0] + ".gif");
    shooting = true;
    play_continous_gun_sound(machinegun_sound);
    bulletTaking = setInterval( function () {
        gunStats[gun][1] -= 1;
        document.getElementById('bullet_indicator').innerText = gunStats[gun][1];
        if (gunStats[gun][1] <= 0){startReloadingMachinegun()}
    }, gunStats[gun][2])
}

function startReloadingMachinegun() {
    reloading = true;
    stopShooting();
    gunStats[gun][1] = gunStats[gun][3];
    body.style.cursor = 'wait';
    document.getElementById('bullet_indicator').innerText = 'Reloading';
    play_gun_sound_once(reload_machinegun);
    play_gun_sound_once(cock_machinegun);
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
    stop_gun_sound(machinegun_sound);
    try{clearInterval(bulletTaking)}catch {}
}

document.getElementById('gun').ondragstart = function() { return false; };

document.getElementById('game-border').onmouseleave = function(){try{stopShooting()}catch {}};

window.onmousemove = function (e) {
    var x = e.clientX,
        y = e.clientY;
    if (x > 370 && x < 1348) {
        document.getElementById('gun').style.left = (x - 370) + 'px';
    }
};

function reloadGun(pistol, gameWindow) {
    play_gun_sound_once(reload_pistol);
    pistol.setAttribute('src', '/static/images/pistolReload.gif');
    setTimeout(() => {
        pistol.setAttribute('src', '/static/images/pistol.gif');
        gameWindow.addEventListener('click', shootPistol);
        gunStats[gun][1] = gunStats[gun][3];
        reloading = false;
        document.getElementById('bullet_indicator').innerText = gunStats[gun][1];
    }, 1370);
}

// enemy related test

let enemy = document.getElementById("enemy_test");
enemy["health"] = 100;


if (enemy["health"] <= 0) {
    enemy.textContent = "killed"
}


let enemy_hit_by_machinegun = function(actual_enemy, gun) {
    actual_enemy["health"] -= gunStats[gun][4];
    console.log(actual_enemy["health"]);
};

let machine_gun_hit_interval = function(actual_enemy, gun) {
    setInterval(enemy_hit_by_machinegun(actual_enemy, gun), 10)
};

if (gun === 1) /*machinegun*/ {
    enemy.addEventListener("mouseenter", function(event) {
        let actual_enemy = event.target;
        if (shooting === true) {
            machine_gun_hit_interval(actual_enemy, gun);
        } else if (shooting === false) {
            clearInterval(machine_gun_hit_interval);
            console.log(actual_enemy["health"]);
        }
    })
} else if (gun === 2) /*pistol*/ {
    enemy.addEventListener('mousedown', function (event) {
        let actual_enemy = event.target;
        actual_enemy["health"] -= gunStats[gun][4];
        console.log(actual_enemy["health"]);
    })
}



startGame();
