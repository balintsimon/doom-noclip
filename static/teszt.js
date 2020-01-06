console.log('JE');

var snd = new Audio("static/gun.mp3");
const body = document.getElementById('teszt');


body.addEventListener('mousedown',function () {
    body.style.backgroundColor = 'rgba(255,0,255,255)';
    document.getElementById('gun').setAttribute('src', 'static/gun_1.gif');
    snd.loop = true;
    snd.play();
},true)

body.addEventListener('mouseup',function () {
    document.getElementById('gun').setAttribute('src', 'static/gun_1.png');
    snd.pause();
    snd.currentTime = 0;
},true);


window.onmousemove = function (e) {

    var x = e.clientX,
        y = e.clientY;
    document.getElementById('hello').innerText = x;

    if ( x > 370 && x < 1348 ){
    document.getElementById('gun').style.left = (x-370) + 'px';
    }
};

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

