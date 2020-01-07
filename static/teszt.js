const body = document.getElementById('teszt')

//sound related stuff
let pistol_sound = new Audio("static/dspistol.wav");
let machinegun_sound = new Audio("static/gun2.mp3");

let play_gun_sound = function(sound) {
    play_sound(sound);
    //setInterval(play_sound(sound), -1000);
};

let play_sound = function(sound) {
    sound.loop = true;
    sound.play();
    sound.currentTime = 0;
};

let stop_gun_sound = function(sound) {
    sound.pause();
    sound.currentTime = 0;
};

//music related stuff
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



var gun = 1;
const gunStats = [];
// gunStats[weapon_id] = ['image_name', clip, shootingRate, maxClip, damage,reloadTime]
gunStats[1] = ['gun_1', 30, 100,30,5,2000];
var shooting = false;
var bulletTaking = false;
var reloading = false;

var childs = document.getElementsByTagName('body')[0].children;
for ( element of childs){
    element.style.userSelect = 'none'
}

body.addEventListener('mousedown',function () {
    startShooting()
},true);

body.addEventListener('mouseup',function () {
    stopShooting()
},true);

function startShooting(){
    if (reloading){return}
    document.getElementById('gun').setAttribute('src', "static/" + gunStats[gun][0] + ".gif");
    shooting = true;
    play_gun_sound(machinegun_sound);
    bulletTaking = setInterval( function () {
        gunStats[gun][1] -= 1;
        document.getElementById('bullet_indicator').innerText = gunStats[gun][1];
        document.getElementById('tdteszt').onmouseover = function () {
            this.innerText = "Assdsda"
        };
        if (gunStats[gun][1] <= 0){startReloading()}
    }, gunStats[gun][2])
}

function startReloading() {
    reloading = true;
    stopShooting();
    gunStats[gun][1] = gunStats[gun][3];
    body.style.cursor = 'wait';
    document.getElementById('bullet_indicator').innerText = 'Reloading';
    var reloadTimer = setInterval(function () {
        body.style.cursor = 'crosshair';
        reloading = false;
        document.getElementById('bullet_indicator').innerText = gunStats[gun][1]
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

document.getElementById('game-border').onmouseover = function(){try{stopShooting()}catch {
}};

window.onmousemove = function (e) {

    var x = e.clientX,
        y = e.clientY;
    //document.getElementById('bullet_indicator').innerText = x;

    if ( x > 370 && x < 1348 ){
    document.getElementById('gun').style.left = (x-370) + 'px';
    }
};