console.log('JE');

const body = document.getElementById('teszt');

//sound related stuff
let pistol_sound = new Audio("static/dspistol.wav");
let machinegun_sound = new Audio("static/gun2.mp3");

let play_gun_sound = function(sound) {
    setInterval(play_sound(sound), -1000);
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


body.addEventListener('mousedown',function () {
    body.style.backgroundColor = 'rgba(255,0,255,255)';
    document.getElementById('gun').setAttribute('src', 'static/gun_1.gif');
    play_gun_sound(machinegun_sound); //play gun sound
},true);

body.addEventListener('mouseup',function () {
    document.getElementById('gun').setAttribute('src', 'static/gun_1.png');
    stop_gun_sound(machinegun_sound); //stop gun sound
},true);


window.onmousemove = function (e) {

    var x = e.clientX,
        y = e.clientY;
    document.getElementById('hello').innerText = x;

    if ( x > 370 && x < 1348 ){
    document.getElementById('gun').style.left = (x-370) + 'px';
    }
};
