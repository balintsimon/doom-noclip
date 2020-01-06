console.log('JE')
const body = document.getElementById('teszt')



body.addEventListener('mousedown',function () {
    body.style.backgroundColor = 'rgba(255,0,255,255)'
    document.getElementById('gun').setAttribute('src', 'static/gun_1.gif')
},true)

body.addEventListener('mouseup',function () {
    document.getElementById('gun').setAttribute('src', 'static/gun_1.png')

},true)

window.onmousemove = function (e) {

    var x = e.clientX,
        y = e.clientY;
    document.getElementById('hello').innerText = x

    if ( x > 370 && x < 1408 ){
    document.getElementById('gun').style.left = (x-370) + 'px';
    }
};