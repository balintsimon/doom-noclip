const body = document.getElementById('teszt')
body.addEventListener('mousedown',function () {
    document.getElementById('gun').setAttribute('src', 'static/xUmdZpU.gif')
},true);

body.addEventListener('mouseup',function () {
    document.getElementById('gun').setAttribute('src', 'static/xUmdZpU.png')

},true);

window.onmousemove = function (e) {
    var x = e.clientX,
        y = e.clientY;
    document.getElementById('hello').innerText = x

    if ( x > 370 && x < 1348 ){
    document.getElementById('gun').style.left = (x-370) + 'px';
    }
};