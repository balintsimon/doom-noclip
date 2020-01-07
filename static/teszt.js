const body = document.getElementById('teszt')
var gun = 1
const gunStats = []
// gunStats[weapon_id] = ['image_name', clip, shootingRate, maxClip, damage,reloadTime]
gunStats[1] = ['gun_1', 30, 100,30,5,2000]
var shooting = false
var bulletTaking = false
var reloading = false

var childs = document.getElementsByTagName('body')[0].children
for ( element of childs){
    element.style.userSelect = 'none'
}

body.addEventListener('mousedown',function () {
    startShooting()
},true)

body.addEventListener('mouseup',function () {
    stopShooting()
},true);

function startShooting(){
    if (reloading){return}
    document.getElementById('gun').setAttribute('src', "static/" + gunStats[gun][0] + ".gif")
    shooting = true
    bulletTaking = setInterval( function () {
        gunStats[gun][1] -= 1;
        document.getElementById('bullet_indicator').innerText = gunStats[gun][1];
        document.getElementById('tdteszt').onmouseover = function () {
            this.innerText = "Assdsda"
        }
        if (gunStats[gun][1] <= 0){startReloading()}
    }, gunStats[gun][2])
}

function startReloading() {
    reloading = true
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
    if ( x > 370 && x < 1348 ){
    document.getElementById('gun').style.left = (x-370) + 'px';
    }else{
        stopShooting()
    }
};

