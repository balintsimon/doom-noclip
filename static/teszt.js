const body = document.getElementById('teszt');
var machineGunHitIntervalTimer = false;
let music_is_playing = false;

//audio
let pistol_sound = new Audio("static/sound/dspistol.wav");
let reload_pistol = new Audio("static/sound/reload_gun2.mp3");
let machinegun_sound = new Audio("static/sound/gun2.mp3");
let reload_machinegun = new Audio("static/sound/gun_cock_slow.mp3");
let cock_machinegun = new Audio("static/sound/machine_gun_clip_in.mp3");

let music = new Audio("static/sound/doom_gate_music.mp3");

let play_sound = function(sound, loop){
    sound.loop = loop;
    sound.play();
    sound.currentTime = 0;
};

let stop_sound = function(sound) {
    sound.pause();
    sound.currentTime = 0;
};

//music play
let music_button = document.getElementById("music-button");
music_button.addEventListener("click", function () {
    if (music_is_playing) {
        music_is_playing = false;
        //console.log(music_is_playing);
        stop_sound(music);
        music_button.textContent = "Restart music";
    } else {
        music_is_playing = true;
        //console.log(music_is_playing);
        play_sound(music, true);
        music_button.textContent = "Stop music";
    }
});


// gun stats
//image, clip_size, fire_rate, max_clip, damage, reload_time, fire type
let gun = 1;
let gunStats = [];

gunStats[1] = {
    weapon_image:'gun_1',
    clip : 30,
    fire_rate : 100,
    max_clip : 30,
    damage : 5,
    reload_time : 2000,
    fire_type : 'mousedown'
};

gunStats[2] = {
    weapon_image: 'images/pistol',
    clip : 6,
    fire_rate : 100,
    max_clip : 6,
    damage: 20,
    reload_time : 2000,
    fire_type : 'click'
}

//gunStats[2] = ['images/pistol', 6, 100, 6, 20, 2000,'click'];

let shooting = false;
let bulletTaking = false;
let reloading = false;

function startGame() {
    const gameWindow = document.querySelector('.game-display');
    gameWindow.addEventListener('click', shootGun);
    gameWindow.addEventListener('mousedown', holdShooting, true);
    gameWindow.addEventListener('mouseup', holdStopShooting,true);
    document.getElementById('bullet_indicator').innerText = gunStats[gun].clip;
    const childs = document.getElementsByTagName('body')[0].children;
    for (let element of childs){
        element.style.userSelect = 'none';
    }
    switch_damage_enemy(gun);
}

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
        document.getElementById('gun').setAttribute('src', 'static/' + gunStats[gun].weapon_image + '.png');
        document.getElementById('bullet_indicator').innerText = gunStats[gun].clip;
        document.querySelector('.gun').classList.toggle('gun-switch');
        setTimeout(function () {
            reloading = false
        },1000)

    }, 1000);
}

// enemy related test

let enemy = document.getElementById("enemy_test");
enemy["health"] = 100;

if (enemy["health"] <= 0) {
    enemy.textContent = "killed"
}
//------------------

let machine_gun_hit_interval = function(actual_enemy, gun) {
    machineGunHitIntervalTimer = setInterval(function() {
        if (reloading) {clearInterval(machineGunHitIntervalTimer)}
        actual_enemy["health"] -= gunStats[gun].damage;
        console.log(actual_enemy["health"]);
    }, gunStats[gun].fire_rate)
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
            }
        }),
        enemy.addEventListener("mouseenter", function (event) {
            let actual_enemy = event.target;
            if (shooting === true) {
                machine_gun_hit_interval(actual_enemy, gun);
            } else if (shooting === false) {
                clearInterval(machine_gun_hit_interval);
                console.log(actual_enemy["health"]);
            }
        }),
        enemy.addEventListener("mouseout", function (event) {
            try {
                clearInterval(machineGunHitIntervalTimer);
            }catch{}
        })
    } else if (current_gun === 2) /*pistol*/ {
        enemy.addEventListener('mousedown', function (event) {
            if (!reloading) {
            let actual_enemy = event.target;
            actual_enemy["health"] -= gunStats[gun].damage;
            console.log(actual_enemy["health"]);
            }
        })
    }
};

function holdShooting() {
    if (gunStats[gun].fire_type === 'mousedown'){
        startShooting()
    }
}

function shootGun() {
    if ( gunStats[gun].fire_type === 'mousedown' || reloading ){return}
    const pistol = document.querySelector('.gun');
    gunStats[gun].clip -= 1;
    document.getElementById('bullet_indicator').innerText = gunStats[gun].clip;
    //play_gun_sound_once(pistol_sound);
    play_sound(pistol_sound, false)
    this.removeEventListener('click', shootGun);
    if (gunStats[gun].clip === 0) {
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
    if (gunStats[gun].fire_type === 'mousedown'){
        stopShooting()
    }
}

function startShooting(){
    if (reloading){return}
    document.getElementById('gun').setAttribute('src', "static/" + gunStats[gun].weapon_image + ".gif");
    shooting = true;
    play_sound(machinegun_sound, true)
    gunStats[gun].clip -= 1;
    document.getElementById('bullet_indicator').innerText = gunStats[gun].clip;
    if (gunStats[gun].clip <= 0){startReloading()}
    bulletTaking = setInterval( function () {
        gunStats[gun].clip -= 1;
        document.getElementById('bullet_indicator').innerText = gunStats[gun].clip;
        if (gunStats[gun].clip <= 0){startReloading()}
    }, gunStats[gun].fire_rate)
}

function startReloading() {
    reloading = true;
    stopShooting();
    gunStats[gun].clip = gunStats[gun].max_clip;
    body.style.cursor = 'wait';
    document.getElementById('bullet_indicator').innerText = 'Reloading';
    //play_gun_sound_once(reload_machinegun);
    //play_gun_sound_once(cock_machinegun);
    play_sound(reload_machinegun,false);
    play_sound(cock_machinegun, false);
    var reloadTimer = setInterval(function () {
        body.style.cursor = 'crosshair';
        reloading = false;
        document.getElementById('bullet_indicator').innerText = gunStats[gun].clip;
        clearInterval(reloadTimer)
    }, gunStats[gun].reload_time)
}

function stopShooting(){
    document.getElementById('gun').setAttribute('src', "static/" + gunStats[gun].weapon_image + ".png");
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
    if (x > 300 && x < 1500 && gun === 1) {
            document.getElementById('gun').style.left = (x - 370) + 'px';
    } else if (x > 300 && x < 1000 && gun === 2) {

        document.getElementById('gun').style.left = (x + 30) + 'px';
    } else {
        stopShooting()
    }
};

function reloadGun(pistol, gameWindow) {
    play_sound(reload_pistol, false)
    //play_gun_sound_once(reload_pistol);
    pistol.setAttribute('src', '/static/images/pistolReload.gif');
    setTimeout(() => {
        pistol.setAttribute('src', '/static/images/pistol.gif');
        gameWindow.addEventListener('click', shootGun);
        gunStats[gun].clip = gunStats[gun].max_clip;
        reloading = false;
        document.getElementById('bullet_indicator').innerText = gunStats[gun].clip;
    }, 1370);
}




startGame();
