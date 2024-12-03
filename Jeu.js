var canvas, ctx, w, h;
var obstacles = [];
var player; // Le joueur
var keys = {}; // Suivi des touches pressées
var win = 0; // Variable de victoire (0 = pas de victoire, 1 = victoire)
var niveau=5;
var dernier_niv=9;
var c;
var ingame;
var checkcol=false;//variable pour detecter une collision

const countdownElement = document.getElementById("countdown");
// Définir la valeur initiale
let countdownValue = 5;
const countdownInterval = setInterval(updateCountdown, 1000);

//classes-----------------------------------------------------------------
class Player {
    constructor(id,name,x,y,color){
        this.id=id;
        this.name=name;
        this.x=x;
        this.y=y;
        this.size=20;
        this.color=color;
        this.speed=5;
        this.score=0;
    }
    draw(){
        drawRect(this.x, this.y, this.size, this.size, this.color);
    }

    updatePlayer() { //gere qu'un perso
        let diagonalSpeed = this.speed / Math.sqrt(2);
        //si horizontal et vertical en même temps
        if ((keys["ArrowRight"] || keys["ArrowLeft"]) && (keys["ArrowDown"] || keys["ArrowUp"])) {
            if (keys["ArrowRight"] && this.x + this.size < w) {
                this.x += diagonalSpeed;
            }
            if (keys["ArrowLeft"] && this.x -this.size/2> 10) {
                
                this.x -= diagonalSpeed;
            }
            if (keys["ArrowDown"] && this.y + this.size/2 < h) {
                this.y += diagonalSpeed;
            }
            if (keys["ArrowUp"] && this.y -this.size/2> 0) {
                this.y -= diagonalSpeed;
            }
        }
        else {
            if (keys["ArrowRight"] && this.x + this.size/2 < w) {
                this.x += this.speed;
            }
            if (keys["ArrowLeft"] && this.x -this.size/2> 0) {
                this.x -= this.speed;
            }
            if (keys["ArrowDown"] && this.y + this.size/2 < h) {
                this.y += this.speed;
            }
            if (keys["ArrowUp"] && this.y -this.size/2> 0) {
                this.y -= this.speed;
            }
        }
        
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
        this.color="white";
    }
    draw(){
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.size,0,2*Math.PI);
        ctx.fillStyle=this.color;
        ctx.fill();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.restore();
    }
    modifyCoordExitGate(exitgate, x, y){
        exitgate.x=x;
        exitgate.y=y;
    }
}

class Level{
    constructor(i,d,eg,listO){
        this.id=i;
        this.difficulty=d;//1, 2 and 3
        this.exitgate=eg;
        this.obstacles=listO;
    }
    afficheLevel(){//on met tout les objets qu'on veut avoir et on changera avec les indices.

    }
}
//------------------------------------------------------------------------
window.onload = function init() {
    canvas = document.querySelector("#myCanvas");
    w = canvas.width; 
    h = canvas.height;  
    ctx = canvas.getContext('2d');

    c = new ExitGate(130,130,25);
    player = new Player(1,"Toto",10,10,"red");

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

function drawRect(x, y, width, height, c) {
    ctx.save();
    ctx.fillStyle = c;
    ctx.fillRect(x-1/2*width, y-1/2*height, width, height);
    ctx.restore();
}

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
    cancelAnimationFrame(mainLoop);//inutile
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

function initObstacles(niveau) {
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

function checkCollision(player, exitgate) { // à modifier
    if (
        player.x < exitgate.x + exitgate.size &&
        player.x + player.size > exitgate.x &&
        player.y < exitgate.y + exitgate.size &&
        player.y + player.size > exitgate.y
    ) {
        console.log("Collision détectée : Vous avez touché l'objectif !");
	checkcol=true;
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
function initialiserNiveau(niv) {
    ingame = true;
    checkcol = false;
}

function verifierPassageNiveau() {
    // Vérifiez ici si les conditions pour changer de niveau sont remplies
    if (checkcol) {
        ingame = false; // Fin de la partie pour ce niveau
        return true; // Signale que le niveau est terminé
    }
    return false; // Sinon, continuer
}

function mainLoop() {
    countdownInterval;
    ctx.clearRect(0,0,w,h);
    afficheNiveau(niveau);
    // Mettre à jour et dessiner les éléments
    player.updatePlayer();
    player.draw();
    c.draw();
    initObstacles(niveau);
    // Dessiner les obstacles => inuile pour le moment
    obstacles.forEach(obstacle => {
        obstacle.update();
        obstacle.draw();
    });
    // Continuer la boucle
    if (ingame) {
        checkcol = false; 
        // Vérifier si on doit passer au niveau suivant
        if (verifierPassageNiveau()) {
            niveau++;
            if (niveau > dernier_niv) {
                console.log("Félicitations, vous avez terminé le jeu !");
                return; // Arrêtez la boucle principale
            }

            // Initialiser le niveau suivant
            initialiserNiveau(niveau);
	    afficheNiveau(niveau);
        }
    }

    // Continuer la boucle
    requestAnimationFrame(mainLoop);
    
}
// Lancer le jeu
initialiserNiveau(niveau);
mainLoop();
