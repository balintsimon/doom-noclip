const body = document.getElementById('teszt');
var machineGunHitIntervalTimer = false;

//audio
let pistolSound = new Audio("static/sound/dspistol.wav");
let reloadPistolSound = new Audio("static/sound/reload_gun2.mp3");
let machinegunSound = new Audio("static/sound/gun2.mp3");
let reloadMachinegunSound = new Audio("static/sound/gun_cock_slow.mp3");
let cockMachinegunSound = new Audio("static/sound/machine_gun_clip_in.mp3");

let MusicIsPlaying = false;
let music = new Audio("static/sound/doom_gate_music.mp3");

function playSound(sound, loop){
    sound.loop = loop;
    sound.play();
    sound.currentTime = 0;
}

function stopSound(sound) {
    sound.pause();
    sound.currentTime = 0;
}

//music play
let playMusicButton = document.querySelector(".music-button");
playMusicButton.addEventListener("click", function () {
    if (MusicIsPlaying) {
        MusicIsPlaying = false;
        stopSound(music);
        this.innerHTML = "";
        this.innerHTML = "<i id='music-button' class=\"fas fa-volume-off\"></i>"
    } else {
        MusicIsPlaying = true;
        playSound(music, true);
        this.innerHTML = "";
        this.innerHTML = "<i id='music-button' class=\"fas fa-volume-up\"></i>"
    }
});

// enemy related test

let enemy = document.getElementById("enemy_test");
enemy["health"] = 100;

function checkEnemyKill(enemy) {
if (enemy["health"] <= 0) {
    enemy.textContent = "killed"
    }
}
//------------------

// gun
let gun = 1;
let gunStats = [];
let shooting = false;
let bulletTaking = false;
let reloading = false;

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
};

window.onmousemove = function (e) {
    let gun_image = document.getElementById('gun');
    var x = e.clientX,
        y = e.clientY;
    if (x > 300 && x < 1300 && gun === 1) {
        gun_image.style.left = (x - 450) + 'px';
    } else if (x > 250 && x < 1100 && gun === 2) {
        gun_image.style.left = (x - 250) + 'px';
    } else {
        stopShooting()
    }
};

function holdShooting() {
    if (gunStats[gun].fire_type === 'mousedown'){
        shootContinous()
    }
}

function shootSingle() {
    if (gunStats[gun].fire_type === 'mousedown' || reloading ) {return}
    const pistol = document.querySelector('.gun');

    gunStats[gun].clip -= 1;
    document.getElementById('bullet_indicator').innerText = gunStats[gun].clip;
    playSound(pistolSound, false)

    this.removeEventListener('click', shootSingle);
    if (gunStats[gun].clip === 0) {
        pistol.setAttribute('src', '/static/images/pistolShoot.gif');
        setTimeout(() => {
            document.getElementById('bullet_indicator').innerText = 'Reloading'
            reloading = true;
            reloadPistol(pistol, this);
        }, 250);
    } else {
        pistol.setAttribute('src', '/static/images/pistolShoot.gif');
        setTimeout(() => {
            pistol.setAttribute('src', '/static/images/pistol.gif');
            this.addEventListener('click', shootSingle);
        }, 250);
    }
}

function shootContinous() {
    if (reloading) {return}
    document.getElementById('gun').setAttribute('src', "static/" + gunStats[gun].weapon_image + ".gif");
    shooting = true;

    playSound(machinegunSound, true)
    gunStats[gun].clip -= 1;
    document.getElementById('bullet_indicator').innerText = gunStats[gun].clip;

    if (gunStats[gun].clip <= 0) {reloadMachinegun()}

    bulletTaking = setInterval( function () {
        gunStats[gun].clip -= 1;
        document.getElementById('bullet_indicator').innerText = gunStats[gun].clip;
        if (gunStats[gun].clip <= 0){reloadMachinegun()}
    }, gunStats[gun].fire_rate)
}

function MachineGunSpreadFireHit(actual_enemy, gun) {
    machineGunHitIntervalTimer = setInterval(function() {
        if (reloading) {clearInterval(machineGunHitIntervalTimer)}
        actual_enemy["health"] -= gunStats[gun].damage;
        checkEnemyKill(actual_enemy);
    }, gunStats[gun].fire_rate)
}

function HitEnemyByMachineGun(event) {
    let actual_enemy = event.target;
    if (shooting === true) {
        MachineGunSpreadFireHit(actual_enemy, gun);
        checkEnemyKill(actual_enemy);
    } else if (shooting === false) {
        clearInterval(MachineGunSpreadFireHit);
        checkEnemyKill(actual_enemy);
    }
}

window.onkeydown = function (e) {
    try {
        const key = Number(e.key);
        if (gunStats[key]) {
            if (reloading) {return}
            if (key === gun) {return}
            gun = key;
            switchGun()
        }
    } catch {}
};

function switchGun() {
    document.querySelector('.gun').classList.toggle('gun-switch');
    reloading = true;
    setTimeout(() => {
        SwitchDamageTypeOnWeaponSwitch(gun);
        document.getElementById('gun').setAttribute('src', 'static/' + gunStats[gun].weapon_image + '.png');
        document.getElementById('bullet_indicator').innerText = gunStats[gun].clip;
        document.querySelector('.gun').classList.toggle('gun-switch');
        setTimeout(function () {
            reloading = false
        },1000)

    }, 1000);
}

function SwitchDamageTypeOnWeaponSwitch(current_gun) {
    if (current_gun === 1) {
        enemy.addEventListener("mousedown", HitEnemyByMachineGun);
        enemy.addEventListener("mouseenter", HitEnemyByMachineGun);
        enemy.addEventListener("mouseout", function () {
            try {
                clearInterval(machineGunHitIntervalTimer);
            } catch {}
        })
    } else if (current_gun === 2) {
        enemy.addEventListener('mousedown', function (event) {
            if (!reloading) {
                let actual_enemy = event.target;
                actual_enemy["health"] -= gunStats[gun].damage;
                checkEnemyKill(actual_enemy)
            }
        })
    }
}

function reloadPistol(pistol, gameWindow) {
    playSound(reloadPistolSound, false);
    pistol.setAttribute('src', '/static/images/pistolReload.gif');

    setTimeout(() => {
        pistol.setAttribute('src', '/static/images/pistol.gif');
        gameWindow.addEventListener('click', shootSingle);
        gunStats[gun].clip = gunStats[gun].max_clip;
        reloading = false;
        document.getElementById('bullet_indicator').innerText = gunStats[gun].clip;
    }, 1370);
}

function reloadMachinegun() {
    document.querySelector('.gun').classList.toggle('machine-gun-reload');
    reloading = true;
    stopShooting();
    gunStats[gun].clip = gunStats[gun].max_clip;
    //body.style.cursor = 'wait';
    document.getElementById('bullet_indicator').innerText = 'Reloading';
    playSound(reloadMachinegunSound,false);
    playSound(cockMachinegunSound, false);

    var reloadTimer = setInterval(function () {
        //body.style.cursor = 'crosshair';
        document.querySelector('.gun').classList.toggle('machine-gun-reload');
        reloading = false;
        document.getElementById('bullet_indicator').innerText = gunStats[gun].clip;
        clearInterval(reloadTimer)
    }, gunStats[gun].reload_time)
}

function stopShooting() {
    document.getElementById('gun').setAttribute('src', "static/" + gunStats[gun].weapon_image + ".png");
    shooting = false;
    stopSound(machinegunSound);
    try {clearInterval(bulletTaking)} catch {}
    try {clearInterval(machineGunHitIntervalTimer)} catch {}
}

function holdStopShooting() {
    if (gunStats[gun].fire_type === 'mousedown'){
        stopShooting()
    }
}

document.getElementById('gun').ondragstart = function() { return false; };

document.getElementById('game-border').onmouseleave = function(){try{stopShooting()}catch {}};

function startGame() {
    const gameWindow = document.querySelector('.game-display');
    gameWindow.addEventListener('click', shootSingle);
    gameWindow.addEventListener('mousedown', holdShooting, true);
    gameWindow.addEventListener('mouseup', holdStopShooting,true);
    document.getElementById('bullet_indicator').innerText = gunStats[gun].clip;
    const childs = document.getElementsByTagName('body')[0].children;
    for (let element of childs){
        element.style.userSelect = 'none';
    }
    SwitchDamageTypeOnWeaponSwitch(gun);
}

startGame();


/*
showMenu();

function render_game() {
    let new_screen = document.getElementById("teszt");
    new_screen.innerHTML = "";
    let startGameFunction = startGame();
    new_screen.innerHTML = startGameFunction;}

    function showMenu() {
    let screen = document.getElementById("teszt");
    screen.innerHTML = "";
    let menu_items = document.createElement("p");
    let high_score = "<a href='/high_scores'}}'>High scores</a><br>";


    let start_game = "<br><p class='start_button' style='background: white' onclick='render_game()'>JS High Scores</p><br>";

    menu_items.innerHTML = high_score + start_game;

    screen.appendChild(menu_items);
}
*/
