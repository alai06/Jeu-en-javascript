var canvas, ctx, w, h;
var obstacles = [];
var player; // Le joueur
var keys = {}; // Suivi des touches pressées
var win = 0; // Variable de victoire (0 = pas de victoire, 1 = victoire)
var niveau=1;
var dernier_niv=9;
var c;
var ingame;
var checkcol=false;//variable pour detecter une collision

const countdownElement = document.getElementById("countdown");
// Définir la valeur initiale
let countdownValue = 0;
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
        this.speed=3;
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
    resetPosition() {
        this.x = 10;
        this.y = 10;
    }
    
}

class Obstacle {
    constructor(x,y,w,h,move,kill, color){
        this.x=x;
        this.y=y;
        this.w=w;
        this.h=h;
        this.move=move;//true or false
        this.color=color;
        this.cankill=kill;//true or false
    }
    checkCollision(player) {
        let halfW = this.w / 2;
        let halfH = this.h / 2;
        let playerHalfSize = player.size / 2;

        if (
            player.x + playerHalfSize > this.x - halfW && // Collision côté droit du joueur
            player.x - playerHalfSize < this.x + halfW && // Collision côté gauche du joueur
            player.y + playerHalfSize > this.y - halfH && // Collision bas du joueur
            player.y - playerHalfSize < this.y + halfH // Collision haut du joueur
        ) {
            console.log("Collision avec l'obstacle, blocage du joueur");

            // Bloquer le joueur sans téléportation
            if (player.x < this.x && keys["ArrowRight"]) {
                player.x -= player.speed; // Annule le déplacement vers la droite
            } else if (player.x > this.x && keys["ArrowLeft"]) {
                player.x += player.speed; // Annule le déplacement vers la gauche
            }

            if (player.y < this.y && keys["ArrowDown"]) {
                player.y -= player.speed; // Annule le déplacement vers le bas
            } else if (player.y > this.y && keys["ArrowUp"]) {
                player.y += player.speed; // Annule le déplacement vers le haut
            }
        }
    }
    draw(){
        drawRect(this.x, this.y, this.w, this.h, this.color);
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
    modifyCoordExitGate(x, y){
        this.x=x;
        this.y=y;
    }
    checkCollision(player) { // à modifier
        if (
            player.x < this.x + this.size &&
            player.x + player.size > this.x &&
            player.y < this.y + this.size &&
            player.y + player.size > this.y
        ) {
            console.log("Collision détectée : Vous avez touché l'objectif !");
        checkcol=true;
        }
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

    c = new ExitGate(650,600,25);
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
            obstacles.push(new Obstacle(100,0,10,100,false,false,"red"));
            obstacles.push(new Obstacle(200,100,100,100,false,false,"green"));
            c.modifyCoordExitGate(100,600);
            break;
	case 3:
            // Niveau 3 : obstacles verticaux et quelques obstacles horizontaux
            obstacles.push(new Obstacle(100,0,20,200,false,false,"red"));
            obstacles.push(new Obstacle(300,100,20,150,false,false,"blue"));
            obstacles.push(new Obstacle(400,300,100,20,false,false,"red"));
            c.modifyCoordExitGate(400,25);
            break;
        
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
    player.resetPosition();
    ingame = true;
    checkcol = false;
}

function verifierPassageNiveau() {
    if (checkcol) {
        ingame = false; // Fin de la partie pour ce niveau
        return true; // Signal que le niveau est terminé
    }
    return false; // Sinon, continuer
}

function mainLoop() {
    // Réinitialisation du canvas
    ctx.clearRect(0, 0, w, h);

    // Afficher le niveau actuel
    afficheNiveau(niveau);

    // Vérifier le compte à rebours avant de commencer
    if (countdownValue > 0) {
        // Affichage uniquement du compte à rebours
        return; // Ne pas exécuter le reste tant que le compte à rebours n'est pas terminé
    }

    // Mettre à jour et dessiner les éléments du niveau
    player.updatePlayer();
    player.draw();
    c.draw();
    console.log(player.x, player.y);
    // Mettre à jour et dessiner les obstacles
    obstacles.forEach(obstacle => {
        obstacle.draw();
        obstacle.checkCollision(player);
        
        
    });

    // Vérifier si le joueur a atteint la sortie
    c.checkCollision(player);

    if (verifierPassageNiveau()) {
        // Afficher un message de fin de niveau avant de continuer
        ctx.save();
        ctx.font = "30px Arial";
        ctx.fillStyle = "blue";
        ctx.textAlign = "center";
        ctx.fillText(`Niveau ${niveau} terminé !`, w / 2, h / 2);
        ctx.restore();

        setTimeout(() => {
            // Passer au niveau suivant
            niveau++;

            if (niveau > dernier_niv) {
                console.log("Félicitations, vous avez terminé le jeu !");
                ctx.clearRect(0, 0, w, h);
                ctx.save();
                ctx.font = "40px Arial";
                ctx.fillStyle = "green";
                ctx.textAlign = "center";
                ctx.fillText("Félicitations, vous avez terminé le jeu !", w / 2, h / 2);
                ctx.restore();
                return; // Arrêter le jeu
            }

            // Initialiser le niveau suivant
            initialiserNiveau(niveau);
            initObstacles(niveau); // Charger les obstacles pour le niveau suivant
            ingame = true; // Redémarrer la boucle principale
            requestAnimationFrame(mainLoop);
        }, 2000); // Pause de 2 secondes avant le prochain niveau

        return; // Suspendre la boucle principale temporairement
    }

    // Continuer la boucle principale
    if (ingame) {
        requestAnimationFrame(mainLoop);
    }
}
