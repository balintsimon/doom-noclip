const body = document.getElementById('teszt');
let gun = 2;
let gunStats = [];
gunStats[1] = ['gun_1', 30, 100,30,5,2000, 'mousedown'];
gunStats[2] = ['images/pistol',6,100,6,20,2000,'click'];
let shooting = false;
let bulletTaking = false;
let reloading = false;



function startGame() {
    const gameWindow = document.querySelector('.game-display');
    gameWindow.addEventListener('click', shootGun);
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
        const key = Number(e.key);
        if ( gunStats[key]){
            if (reloading){return}
            if (key == gun){return}
            gun = key;
            loadGun()
        }
    }catch{}
}

function loadGun() {
    document.querySelector('.gun').classList.toggle('gun-switch');
    reloading = true;
    setTimeout(() => {
        document.getElementById('gun').setAttribute('src', 'static/' + gunStats[gun][0] + '.png');
        document.getElementById('bullet_indicator').innerText = gunStats[gun][1];
        document.querySelector('.gun').classList.toggle('gun-switch');
        setTimeout(function () {
            reloading = false
        },1000)

    }, 1000);
}

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
    this.removeEventListener('click', shootGun);
    if (gunStats[gun][1] === 0) {
        pistol.setAttribute('src', '/static/images/pistolShoot.gif');
        setTimeout(() => {
            document.getElementById('bullet_indicator').innerText = 'Reloading'
            reloading = true
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
    document.getElementById('gun').setAttribute('src', "static/" + gunStats[gun][0] + ".gif")
    shooting = true;
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
    stopShooting()
    gunStats[gun][1] = gunStats[gun][3]
    body.style.cursor = 'wait';
    document.getElementById('bullet_indicator').innerText = 'Reloading'
    var reloadTimer = setInterval(function () {
        body.style.cursor = 'crosshair'
        reloading = false
        document.getElementById('bullet_indicator').innerText = gunStats[gun][1]
        clearInterval(reloadTimer)
    }, gunStats[gun][5])
}

function stopShooting(){
    document.getElementById('gun').setAttribute('src', "static/" + gunStats[gun][0] + ".png")
    shooting = false
    try{clearInterval(bulletTaking)}catch {}
}

document.getElementById('gun').ondragstart = function() { return false; };

document.getElementById('game-border').onmouseover = function(){try{stopShooting()}catch {
}}

window.onmousemove = function (e) {
    var x = e.clientX,
        y = e.clientY;
    if (x > 300 && x < 1500) {
        document.getElementById('gun').style.left = (x - 370) + 'px';
    } else {
        stopShooting()
    }
}

function reloadGun(pistol, gameWindow) {
    pistol.setAttribute('src', '/static/images/pistolReload.gif');
    setTimeout(() => {
        pistol.setAttribute('src', '/static/images/pistol.gif');
        gameWindow.addEventListener('click', shootGun);
        gunStats[gun][1] = gunStats[gun][3]
        reloading = false;
        document.getElementById('bullet_indicator').innerText = gunStats[gun][1];
    }, 1370);
}

startGame();

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