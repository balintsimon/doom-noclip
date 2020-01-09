import {menuTemplate, gameTemplate, deathScreen} from "./dom.js";

const body = document.getElementById('teszt'); // ezek kellenek?
let machineGunHitIntervalTimer = false;

//audio
let kills = 0;
let score = 0;
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
playMusicButton.addEventListener("click", toggleMusic);

function toggleMusic() {
    if (MusicIsPlaying) {
        this.parentNode.classList.toggle('music-on');
        MusicIsPlaying = false;
        stopSound(music);
    } else {
        this.parentNode.classList.toggle('music-on');
        MusicIsPlaying = true;
        playSound(music, true)
    }
}

// enemy related test
let enemies = [];

function killEnemy(enemy) {
    if (enemy.dataset.health <= 0) {
        stopEnemyDamage(enemy);
        kills += 1;
        score += Number(enemy.dataset.add_score);
        givePlayerHealth(Number(enemy.dataset.hp_give));
        let imageInd = Number(enemy.dataset.enemy_type) + 1;
        enemy.setAttribute('src', `static/images/enemies/enemy-${imageInd}-death.gif`);
        setTimeout(function () {
            enemy.style.visibility = "hidden";
            setTimeout(function () {
                enemy.removeAttribute('src')
            },1000)

        },1710)
    }
}

function givePlayerHealth(plusHealth) {
    let actualHP = Number(document.getElementById('gun').dataset.hp);
    let newHealth = 0;
    if ((actualHP + plusHealth) > 110) {
        newHealth = 110;
    } else {
        newHealth = actualHP + plusHealth;
    }
    document.getElementById('gun').setAttribute('data-hp', newHealth);
}

//------------------

// gun
let gun = 1;
let gunStats = [];
let shooting = false;
let bulletTaking = false;
let reloading = false;
let enemyTimeout = false;

gunStats[1] = {
    weapon_image:'gun_1',
    clip : 30,
    fire_rate : 100,
    max_clip : 30,
    damage : 10,
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

function moveWeaponOnScreen (e) {
    let gun_image = document.getElementById('gun');
    let x = e.clientX;
    if (x > 300 && x < 1300 && gun === 1) {
        gun_image.style.left = (x - 450) + 'px';
    } else if (x > 250 && x < 1100 && gun === 2) {
        gun_image.style.left = (x - 250) + 'px';
    } else {
        stopShooting()
    }
}

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
    playSound(pistolSound, false);

    this.removeEventListener('click', shootSingle);
    if (gunStats[gun].clip === 0) {
        pistol.setAttribute('src', '/static/images/pistolShoot.gif');
        setTimeout(() => {
            reloadPistol();
        }, 250);
    } else {
        reloading = true;
        pistol.setAttribute('src', '/static/images/pistolShoot.gif');
        setTimeout(() => {
            pistol.setAttribute('src', '/static/images/pistol.gif');
            if ( pistol.dataset.hp > 0){
                this.addEventListener('click', shootSingle);
            }
            reloading = false
        }, 250);
    }
}

function shootContinous() {
    if (reloading) {return}
    const machineGun = document.getElementById('gun');
    machineGun.setAttribute('src', "static/" + gunStats[gun].weapon_image + ".gif");
    machineGun.classList.toggle('shooting');
    shooting = true;

    playSound(machinegunSound, true);
    gunStats[gun].clip -= 1;
    document.getElementById('bullet_indicator').innerText = gunStats[gun].clip;

    if (gunStats[gun].clip <= 0) {reloadMachinegun()}

    bulletTaking = setInterval( function () {
        gunStats[gun].clip -= 1;
        document.getElementById('bullet_indicator').innerText = gunStats[gun].clip;
        if (gunStats[gun].clip <= 0){
            machineGun.classList.toggle('shooting');
            reloadMachinegun()
        }
    }, gunStats[gun].fire_rate)
}

function MachineGunSpreadFireHit(actual_enemy, gun) {
    actual_enemy.setAttribute('data-hit_interval',
        setInterval(function() {
            damageEnemy(actual_enemy, gunStats[gun].damage)
        }, gunStats[gun].fire_rate)
    )
}

function stopEnemyDamage(enemy) {
    clearInterval(enemy.dataset.hit_interval);
    enemy.setAttribute('data-hit-interval', false)
}

function damageEnemy(actual_enemy, damage) {
    if ( reloading){try{clearInterval(actual_enemy.dataset.hit_interval)}catch {}}
    let actual_hp = Number(actual_enemy.dataset.health);
    console.log(actual_enemy);
    console.log(actual_hp);
    if ( actual_hp > 0){
        let new_hp = actual_hp - damage;
        actual_enemy.setAttribute('data-health', new_hp);
        killEnemy(actual_enemy)
    }
    //console.log(actual_enemy + " kapott HPja: " + new_hp)
}

function displayEnemies() {
    let enemySpawnNumber;
    if ( kills > 7){
        enemySpawnNumber = Math.floor(Math.random() * (11000 - (kills*1000) - 3000) + 3000); // creates a random number between 3000 and 10000 (milliseconds!)
    }else{
        enemySpawnNumber = Math.floor(Math.random() * (3000 - 3000) + 3000);
    }
    enemyTimeout = setTimeout(checkEmptyPositions, enemySpawnNumber); // use this to run this function when the code is completed
}

function stopSpawnEnemies() {
    clearTimeout(enemyTimeout);
    enemyTimeout = false;
    console.log('Enemy spawning disabled');
    for (let enemy of document.querySelectorAll('.enemy')){
        (enemy.getAttribute('src') ? clearInterval(enemy.dataset.interval) : {} )
    }
}

function checkEmptyPositions() {
    const enemies = document.querySelectorAll('.enemy'); // enemy object with all the enemies inside
    let emptyPositions = [];
    enemies.forEach(monster => (monster.getAttribute('src')) ? {} : emptyPositions.push(monster));
    (emptyPositions.length === 0) ? displayEnemies() : insertEnemyPicture(emptyPositions)
}

function insertEnemyPicture(positions) {
    const enemyStats = [
        {damage : 1, health : 30, missChance : 20, hitRate: 400, hpGiven: 10, scoreValue: 1},
        {damage: 2, health: 120, missChance: 10, hitRate: 800, hpGiven: 20, scoreValue: 2},
        {damage: 3, health : 140, missChance: 30, hitRate: 600, hpGiven: 30, scoreValue: 4}];
    const randomEnemyIndex = Math.floor(Math.random() * enemyStats.length);
    const randomIndex = Math.floor(Math.random() * positions.length);
    positions[randomIndex].ondragstart = function() { return false; };
    enemies.push(positions[randomIndex]);
    positions[randomIndex].style.visibility = "visible";
    SwitchDamageTypeOnWeaponSwitch(gun);
    console.log('Moving');
    CreateEnemyMovement(positions[randomIndex]);
    var imageInd = (randomEnemyIndex+1);
    positions[randomIndex].setAttribute('src', `/static/images/enemies/enemy-${imageInd}-walking.gif`);
    positions[randomIndex].setAttribute('data-health', enemyStats[randomEnemyIndex].health);
    positions[randomIndex].setAttribute('data-miss_chance', enemyStats[randomEnemyIndex].missChance);
    positions[randomIndex].setAttribute('data-enemy_type', randomEnemyIndex);
    positions[randomIndex].setAttribute('data-damage',enemyStats[randomEnemyIndex].damage);
    positions[randomIndex].setAttribute('data-hit_rate',enemyStats[randomEnemyIndex].hitRate);
    positions[randomIndex].setAttribute('data-hp_give',enemyStats[randomEnemyIndex].hpGiven);
    positions[randomIndex].setAttribute('data-add_score',enemyStats[randomEnemyIndex].scoreValue);
    //enemies = positions
    return displayEnemies();
}

function CreateEnemyMovement(actual_enemy) {
    setTimeout( function () {
        const imageInd = Number(actual_enemy.dataset.enemy_type) + 1;
        actual_enemy.setAttribute('src', `/static/images/enemies/enemy-${imageInd}-attack.gif`);
        let interval = setInterval(
            function () {
                let chance = (Math.floor(Math.random() * 100));
                if (actual_enemy.dataset.health > 0){
                    (chance <= Number(actual_enemy.dataset.miss_chance)) ? console.log("missed") : damagePlayer(actual_enemy.dataset.damage);
                }else{
                    clearInterval(interval)
                }
            },Number(actual_enemy.dataset.hit_rate)
        );
        actual_enemy.setAttribute('data-interval', interval)
    }, 1000)
}

function damagePlayer(damage) {
    let actualHP = Number(document.getElementById('gun').dataset.hp);
    const currentHealth = actualHP - damage;
    document.getElementById('gun').setAttribute('data-hp', currentHealth);
    actualHP = Number(document.getElementById('gun').dataset.hp);
    document.getElementById('health').innerText =
        `HP: ${actualHP}
        Kills: ${kills}
        Score: ${score}`;
    if ( actualHP <= 0 ){
        endGame()
    }
}

function HitEnemyByMachineGun(event) {
    let actual_enemy = event.target;
    if (shooting === true) {
        console.log(actual_enemy.dataset.health);
        MachineGunSpreadFireHit(actual_enemy, gun);
        killEnemy(actual_enemy);
    } else if (shooting === false) {
        clearInterval(MachineGunSpreadFireHit);
        killEnemy(actual_enemy);
    }
}

function changeWeapon(e) {
    try {
        const key = Number(e.key);
        if (gunStats[key]) {
            if (reloading) {return}
            if (key === gun) {return}
            gun = key;
            switchGun()
        }
    } catch {}
    console.log("Key : " + e.key )
    if (e.key === "r"){
        if ( gunStats[gun].clip == gunStats[gun].max_clip){return}
        if (gunStats[gun].fire_type === "click" ){
            reloadPistol()
        }else{
            reloadMachinegun()
        }
    }
}

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
    for (let enemy of enemies){
        if (current_gun === 1) /*machinegun*/ {
            enemy.removeEventListener("mousedown", hitEnemyByPistol);
            enemy.addEventListener("mousedown", HitEnemyByMachineGun);
            enemy.addEventListener("mouseenter", HitEnemyByMachineGun);
            enemy.addEventListener("mouseout", machineGunMouseOut);
        } else if (current_gun === 2) /*pistol*/ {
            enemy.removeEventListener("mousedown", HitEnemyByMachineGun);
            enemy.removeEventListener("mouseenter", HitEnemyByMachineGun);
            enemy.removeEventListener("mouseout", machineGunMouseOut);
            enemy.addEventListener('mousedown', hitEnemyByPistol);
        }
    }
}

function removeGunEventListeners() {
    for (let enemy of enemies){
        enemy.removeEventListener("mousedown", HitEnemyByMachineGun);
        enemy.removeEventListener("mouseenter", HitEnemyByMachineGun);
        enemy.removeEventListener("mouseout", machineGunMouseOut);
        enemy.removeEventListener("mousedown", hitEnemyByPistol)
    }
}

function hitEnemyByPistol(event) {
    const actual_enemy = event.target;
    damageEnemy(actual_enemy, gunStats[gun].damage);
    actual_enemy.removeEventListener('mousedown', hitEnemyByPistol);
    setTimeout(function () {
        if (document.getElementById('gun').dataset.hp > 0){
            SwitchDamageTypeOnWeaponSwitch(gun)
        }
    },250)
}

function machineGunMouseOut() {
    console.log(this);
    try {
        for (let enemy of enemies){
            clearInterval(enemy.dataset.hit_interval);
        }
    } catch {}
}

function reloadPistol() {
    document.getElementById('bullet_indicator').innerText = 'Reloading';
    playSound(reloadPistolSound, false);
    document.getElementById('gun').setAttribute('src', '/static/images/pistolReload.gif');
    reloading = true
    setTimeout(() => {
        document.getElementById('gun').setAttribute('src', '/static/images/pistol.gif');
        document.getElementById('teszt').addEventListener('click', shootSingle);
        gunStats[gun].clip = gunStats[gun].max_clip;
        reloading = false;
        document.getElementById('bullet_indicator').innerText = gunStats[gun].clip;
    }, 1370);
}

function reloadMachinegun() {
    const machineGun = document.querySelector('.gun');
    // machineGun.classList.toggle('shooting');
    machineGun.classList.toggle('machine-gun-reload');
    reloading = true;
    stopShooting();
    gunStats[gun].clip = gunStats[gun].max_clip;
    document.getElementById('bullet_indicator').innerText = 'Reloading';
    playSound(reloadMachinegunSound,false);
    playSound(cockMachinegunSound, false);

    let reloadTimer = setInterval(function () {
        document.querySelector('.gun').classList.toggle('machine-gun-reload');
        reloading = false;
        document.getElementById('bullet_indicator').innerText = gunStats[gun].clip;
        clearInterval(reloadTimer)
    }, gunStats[gun].reload_time)
}

function stopShooting() {
    const machineGun = document.getElementById('gun');
    machineGun.setAttribute('src', "static/" + gunStats[gun].weapon_image + ".png");
    machineGun.classList.toggle('shooting');
    shooting = false;
    stopSound(machinegunSound);
    try {clearInterval(bulletTaking)} catch {}
    for (const enemy of enemies){
        try {clearInterval(enemy.dataset.hit_interval)} catch {}
    }
}

function holdStopShooting() {
    if (gunStats[gun].fire_type === 'mousedown'){
        stopShooting()
    }
}

function disableGunDragBug(){
    return
}

function disableShootOutsideWindowBug() {
    try{stopShooting()}catch {}
}

function startGame() {
    kills = 0;
    score = 0;
    const gameWindow = document.querySelector('.game-display');
    gameWindow.classList.toggle('menu');
    gameWindow.innerHTML = "";
    gameWindow.classList.toggle('play-game');
    gameWindow.innerHTML = gameTemplate();
    document.getElementById('bullet_indicator').innerText = gunStats[gun].clip;
    const childs = document.getElementsByTagName('body')[0].children;
    for (let element of childs){
        element.style.userSelect = 'none';
    }
    SwitchDamageTypeOnWeaponSwitch(gun);
    document.getElementById('gun').setAttribute('data-hp', 100);
    damagePlayer(0);
    displayEnemies();

    // EVENT HANDLERS \\
    window.addEventListener('mousemove', moveWeaponOnScreen);
    window.addEventListener('keydown', changeWeapon);
    //document.getElementById('gun').ondragstart = disableGunDragBug()
    document.getElementById('gun').addEventListener('dragstart', function () {
        return
    });
    document.getElementById('game-border').addEventListener('mouseleave', disableShootOutsideWindowBug);
    gameWindow.addEventListener('click', shootSingle);
    gameWindow.addEventListener('mousedown', holdShooting, true);
    gameWindow.addEventListener('mouseup', holdStopShooting,true);

    // EVENT HANDLERS \\


}

function endGame() {
    const gameWindow = document.querySelector('.game-display');
    // EVENT HANDLER REMOVE \\
    window.removeEventListener('mousemove', moveWeaponOnScreen);
    window.removeEventListener('keydown', changeWeapon);
    document.getElementById('gun').removeEventListener('dragstart', disableGunDragBug);
    document.getElementById('game-border').removeEventListener('mouseleave', disableShootOutsideWindowBug);
    gameWindow.removeEventListener('click', shootSingle);
    gameWindow.removeEventListener('mousedown', holdShooting, true);
    gameWindow.removeEventListener('mouseup', holdStopShooting,true);

    removeGunEventListeners();
    stopSpawnEnemies();
    // EVENT HANDLER REMOVE \\
    try{stopShooting()} catch {}
    gameWindow.innerHTML = "";
    gameWindow.innerHTML = deathScreen(score);
    console.log("died");

    // Add end game dom manipulation
}

function displayMenu() { // TODO: add eventlistener to the leaderboard button at the end of this function!
    const tvScreen = document.querySelector('.game-display');
    tvScreen.classList.toggle('menu');
    tvScreen.innerHTML = "";
    tvScreen.innerHTML = menuTemplate();
    const playGameButton = document.querySelector('#play-game');
    playGameButton.addEventListener('click', startGame);
    const highScoreButton = document.querySelector('#leaderboards');
    highScoreButton.addEventListener('click', renderHighScorePage)
}

function renderHighScorePage () {
    window.location.href = "/high-scores";
}

displayMenu();
