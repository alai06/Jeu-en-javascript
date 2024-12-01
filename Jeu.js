var canvas, ctx, w, h;
var obstacles = [];
var player; // Le joueur
var keys = {}; // Suivi des touches pressées
var win = 0; // Variable de victoire (0 = pas de victoire, 1 = victoire)
var niveau=1;
var c;
var ingame;

const countdownElement = document.getElementById("countdown");
// Définir la valeur initiale
let countdownValue = 5;
const countdownInterval = setInterval(updateCountdown, 1000);

//classes-----------------------------------------------------------------
class Player {
    constructor(name,x,y,color){
        this.name=name;
        this.x=x;
        this.y=y;
        this.size=20;
        this.color=color;
        this.speed=5;
        this.score=0;
    }
}

class Obstacle {
    constructor(x,y,size,move,kill){
        this.x=x;
        this.y=y;
        this.size=size;
        this.move=move;//true or false
        this.color="black";
        this.cankill=kill;//true or false
    }
}
class Score{
    constructor(f,s,t,l){
        this.first=f;
        this.second=s;
        this.third=t;
        this.last=l;
    }
}

class ExitGate{
    constructor(x,y,size){
        this.x=x;
        this.y=y;
        this.size=size;
        this.color="blue";
    }
}

class Level{
    constructor(i,d,eg,listO){
        this.id=i;
        this.difficulty=d;//1, 2 and 3
        this.exitgate=eg;
        this.obstacles=listO;
    }
}
//------------------------------------------------------------------------
window.onload = function init() {
    canvas = document.querySelector("#myCanvas");
    w = canvas.width; 
    h = canvas.height;  
    ctx = canvas.getContext('2d');

    c = new ExitGate(130,130,50);
    player = new Player("Toto",50,50,"red");

    // Gérer les événements clavier
    window.addEventListener("keydown", function(e) {
        keys[e.key] = true;
    });
    window.addEventListener("keyup", function(e) {
        keys[e.key] = false;
    });
    
    ingame=false;
    Menu();
};

function Menu(){
    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.font = "40px Arial";
    ctx.fillStyle = "blue";
    ctx.textAlign = "center";
    ctx.fillText("Course Cube", w / 2, h / 2 - 50);
    ctx.restore();

    const startButton = document.getElementById("StartButton");
    const exitButton = document.getElementById("ExitButton");
    startButton.style.display = "block";
    exitButton.style.display = "block";

    startButton.addEventListener("click", function() {
        ingame=true;
        mainLoop();
        
    });
    exitButton.addEventListener("click", function() {
        ingame=false;
        exitgame();
    });
}

function exitgame(){
    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.font = "40px Arial";
    ctx.fillStyle = "blue";
    ctx.textAlign = "center";
    ctx.fillText("C fini", w / 2, h / 2 - 50);
    ctx.restore();
    cancelAnimationFrame(mainLoop);
}

function drawCircle(c){//print exitgate
    ctx.save();
    ctx.beginPath();
    ctx.arc(c.x,c.y,c.size,0,2*Math.PI);
    ctx.fillStyle=c.color;
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.restore();
}

function drawRect(x, y, width, height, c) {
    ctx.save();
    ctx.fillStyle = c;
    ctx.fillRect(x, y, width, height);
    ctx.restore();
}

function drawPlayer(player) {
    drawRect(player.x, player.y, player.size, player.size, player.color);
}

function updatePlayer(player) { //gere qu'un perso
    let diagonalSpeed = player.speed / Math.sqrt(2);
    //si horizontal et vertical en même temps
    if ((keys["ArrowRight"] || keys["ArrowLeft"]) && (keys["ArrowDown"] || keys["ArrowUp"])) {
        if (keys["ArrowRight"] && player.x + player.size < w) {
            player.x += diagonalSpeed;
        }
        if (keys["ArrowLeft"] && player.x > 0) {
            player.x -= diagonalSpeed;
        }
        if (keys["ArrowDown"] && player.y + player.size < h) {
            player.y += diagonalSpeed;
        }
        if (keys["ArrowUp"] && player.y > 0) {
            player.y -= diagonalSpeed;
        }
    }
    else {
        if (keys["ArrowRight"] && player.x + player.size < w) {
            player.x += player.speed;
        }
        if (keys["ArrowLeft"] && player.x > 0) {
            player.x -= player.speed;
        }
        if (keys["ArrowDown"] && player.y + player.size < h) {
            player.y += player.speed;
        }
        if (keys["ArrowUp"] && player.y > 0) {
            player.y -= player.speed;
        }
    }
}

function createMovingObstacle(x, y, width, height, c, direction, speed, type) {
    // Créer l'obstacle et le retourner
    const obst = {
        x: x,
        y: y,
        width: width,
        height: height,
        color: c,
        direction: direction,
        speed: speed,
        type: type,

        // Mise à jour de la position
        update: function () {
            if (this.direction === "vertical") {
                this.y += this.speed;

                // Collision avec les bords supérieur et inférieur
                if (this.y <= 0 || this.y + this.height >= h) {
                    this.speed = -this.speed; // Inverser la direction
                }
            } else if (this.direction === "horizontal") {
                this.x += this.speed;

                // Collision avec les bords gauche et droit
                if (this.x <= 0 || this.x + this.width >= w) {
                    this.speed = -this.speed; // Inverser la direction
                }
            }
        },

        // Dessiner l'obstacle
        draw: function () {
            drawRect(this.x, this.y, this.width, this.height, this.color);
        }
    };

    return obst;
}

function initObstacles() {
    obstacles = []; // Réinitialiser la liste des obstacles

    switch (niveau) {
        case 1:
            // Niveau 1 : pas d'obstacles
            break;

        case 2:
            // Niveau 2 : obstacles verticaux simples
            obstacles.push(createMovingObstacle(100, 0, 20, 200, "red", "vertical", 0, "rectangle"));
            obstacles.push(createMovingObstacle(300, 100, 20, 150, "blue", "vertical", 0, "rectangle"));
            break;

        case 3:
            // Niveau 3 : obstacles verticaux et quelques obstacles horizontaux
            obstacles.push(createMovingObstacle(100, 0, 20, 200, "red", "vertical", 0, "rectangle"));
            obstacles.push(createMovingObstacle(300, 100, 20, 150, "blue", "vertical", 0, "rectangle"));
            obstacles.push(createMovingObstacle(400, 300, 100, 20, "green", "horizontal", 0, "rectangle"));
            break;

        case 4:
            // Niveau 4 : obstacles verticaux avec plus de complexité
            obstacles.push(createMovingObstacle(100, 0, 20, 200, "red", "vertical", 0, "rectangle"));
            obstacles.push(createMovingObstacle(300, 100, 20, 200, "blue", "vertical", 0, "rectangle"));
            obstacles.push(createMovingObstacle(500, 50, 20, 150, "green", "vertical", 0, "rectangle"));
            obstacles.push(createMovingObstacle(200, 300, 100, 20, "purple", "horizontal", 0, "rectangle"));
            break;

        case 5:
            // Niveau 5 : obstacles verticaux et horizontaux avec mouvements alternés
            obstacles.push(createMovingObstacle(100, 0, 20, 100, "red", "vertical", 2, "rectangle"));
            obstacles.push(createMovingObstacle(300, 100, 20, 100, "blue", "horizontal", 3, "rectangle"));
            obstacles.push(createMovingObstacle(500, 50, 20, 100, "green", "vertical", 1, "rectangle"));
            obstacles.push(createMovingObstacle(200, 300, 20, 100, "purple", "horizontal", 4, "rectangle"));
            obstacles.push(createMovingObstacle(600, 500, 20, 150, "orange", "vertical", 1, "rectangle"));
            break;

        case 6:
            // Niveau 6 : obstacles plus nombreux et certains à mouvement plus rapide
            obstacles.push(createMovingObstacle(100, 0, 20, 100, "red", "vertical", 3, "rectangle"));
            obstacles.push(createMovingObstacle(300, 100, 20, 100, "blue", "horizontal", 2, "rectangle"));
            obstacles.push(createMovingObstacle(500, 50, 20, 100, "green", "vertical", 2, "rectangle"));
            obstacles.push(createMovingObstacle(200, 300, 20, 100, "purple", "horizontal", 4, "rectangle"));
            obstacles.push(createMovingObstacle(600, 500, 20, 150, "orange", "vertical", 1, "rectangle"));
            obstacles.push(createMovingObstacle(100, 400, 100, 20, "pink", "horizontal", 3, "rectangle"));
            break;

        case 7:
            // Niveau 7 : obstacles qui se déplacent à des vitesses variées et ajout de chemins complexes
            obstacles.push(createMovingObstacle(100, 0, 20, 100, "red", "vertical", 3, "rectangle"));
            obstacles.push(createMovingObstacle(300, 100, 20, 100, "blue", "horizontal", 2, "rectangle"));
            obstacles.push(createMovingObstacle(500, 50, 20, 100, "green", "vertical", 2, "rectangle"));
            obstacles.push(createMovingObstacle(200, 300, 20, 100, "purple", "horizontal", 4, "rectangle"));
            obstacles.push(createMovingObstacle(600, 500, 20, 150, "orange", "vertical", 1, "rectangle"));
            obstacles.push(createMovingObstacle(100, 400, 100, 20, "pink", "horizontal", 3, "rectangle"));
            obstacles.push(createMovingObstacle(400, 200, 100, 20, "cyan", "vertical", 2, "rectangle"));
            break;

        case 8:
            // Niveau 8 : ajout de plusieurs obstacles mobiles complexes (combinaison horizontaux et verticaux)
            obstacles.push(createMovingObstacle(100, 0, 20, 100, "red", "vertical", 3, "rectangle"));
            obstacles.push(createMovingObstacle(300, 100, 20, 100, "blue", "horizontal", 2, "rectangle"));
            obstacles.push(createMovingObstacle(500, 50, 20, 100, "green", "vertical", 2, "rectangle"));
            obstacles.push(createMovingObstacle(200, 300, 20, 100, "purple", "horizontal", 4, "rectangle"));
            obstacles.push(createMovingObstacle(600, 500, 20, 150, "orange", "vertical", 1, "rectangle"));
            obstacles.push(createMovingObstacle(100, 400, 100, 20, "pink", "horizontal", 3, "rectangle"));
            obstacles.push(createMovingObstacle(400, 200, 100, 20, "cyan", "vertical", 2, "rectangle"));
            obstacles.push(createMovingObstacle(50, 600, 100, 20, "grey", "horizontal", 1, "rectangle"));
            break;

        default:
            // Niveau par défaut pour les niveaux plus élevés
            obstacles.push(createMovingObstacle(100, 0, 20, 100, "red", "vertical", 2, "rectangle"));
            obstacles.push(createMovingObstacle(300, 100, 20, 100, "blue", "horizontal", 3, "rectangle"));
            obstacles.push(createMovingObstacle(500, 50, 20, 100, "green", "vertical", 1, "rectangle"));
            obstacles.push(createMovingObstacle(200, 300, 20, 100, "purple", "horizontal", 4, "rectangle"));
            obstacles.push(createMovingObstacle(600, 500, 20, 150, "orange", "vertical", 1, "rectangle"));
            obstacles.push(createMovingObstacle(100, 400, 100, 20, "pink", "horizontal", 3, "rectangle"));
            obstacles.push(createMovingObstacle(400, 200, 100, 20, "cyan", "vertical", 2, "rectangle"));
            obstacles.push(createMovingObstacle(50, 600, 100, 20, "grey", "horizontal", 1, "rectangle"));
            obstacles.push(createMovingObstacle(700, 700, 20, 100, "brown", "vertical", 2, "rectangle"));
            break;
    }
}

function checkCollision(player, goal) { // à modifier
    // Vérifier la collision entre le joueur et l'objectif
    if (
        player.x < goal.x + goal.size &&
        player.x + player.size > goal.x &&
        player.y < goal.y + goal.size &&
        player.y + player.size > goal.y
    ) {
        console.log("Collision détectée : Vous avez touché l'objectif !");
        return 0; // Retourne 0 si la collision est détectée
    } else {
        return 1; // Retourne 1 si aucune collision n'est détectée
    }
}

function afficheNiveau(niveau) {
    ctx.save();
    ctx.font = "20px Arial";
    ctx.fillStyle = "blue";
    ctx.fillText(`Niveau : ${niveau}`, 10, 30);
    ctx.restore();
}

// Fonction pour mettre à jour le compteur
function updateCountdown() {
    if (countdownValue > 0) {
        countdownValue--;
        countdownElement.textContent = countdownValue;
    } else {
        // Optionnel : Quand le compteur atteint 0, afficher un message
        clearInterval(countdownInterval); // Arrêter l'intervalle
        countdownElement.textContent = "GO!"; // Afficher "GO!" ou autre
    }
}

function mainLoop() {
    niveau=1;
    countdownInterval;
    ctx.clearRect(0,0,w,h);
    afficheNiveau(niveau);
    // Mettre à jour et dessiner les éléments
    updatePlayer(player);
    drawPlayer(player);
    drawCircle(c);

    // Dessiner les obstacles => inuile pour le moment
    obstacles.forEach(obstacle => {
        obstacle.update();
        obstacle.draw();
    });

    // Continuer la boucle
    if (ingame){
        requestAnimationFrame(mainLoop);
    }
    
}