const body = document.getElementById('teszt')
var bullet = 30
var gun = 1

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
    document.getElementById('gun').setAttribute('src', "static/gun_" + gun + ".gif")
}

function stopShooting(){
    document.getElementById('gun').setAttribute('src', "static/gun_" + gun + ".png")
}

document.getElementById('gun').ondragstart = function() { return false; };

document.getElementById('game-border').onmouseover = function(){try{stopShooting()}catch {
}}

window.onmousemove = function (e) {
    var x = e.clientX,
        y = e.clientY;
    document.getElementById('hello').innerText = bullet

    if ( x > 370 && x < 1348 ){
    document.getElementById('gun').style.left = (x-370) + 'px';
    }else{
        stopShooting()
    }
};