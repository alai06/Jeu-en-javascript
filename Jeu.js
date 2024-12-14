var canvas, ctx, w, h;
var obstacles = [];
var player; // Le joueur
var keys = {}; // Suivi des touches pressées
var win = 0; // Variable de victoire (0 = pas de victoire, 1 = victoire)
var niveau=1;
var dernier_niv=20;
var c;
var ingame;
var checkcol=false;//variable pour detecter une collision

const countdownElement = document.getElementById("countdown");
// Définir la valeur initiale
let countdownValue = 0;
const countdownInterval = setInterval(updateCountdown, 1000);


//div hidden html

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
        this.x = 30;
        this.y = 30;
    }
    BornAgain(){
        setTimeout(() => {
            this.x = 30;
            this.y = 30;
        }, 210);
    }
    
}

class Obstacle {
    constructor(x,y,w,h,move,XouY, color){
        this.x=x;
        this.y=y;
        this.w=w;
        this.h=h;
        this.move=move;//true or false
        this.color=color;
        this.XouY=XouY;
        this.speedX=0;
        this.speedY=0;
        if(this.XouY[0]==="X"){
            this.speedX=this.XouY[1];
        }
        if(this.XouY[0]==="Y"){
            this.speedY=this.XouY[1];
        }     
    }
    checkCollision(player) {
        let halfW = this.w / 2;
        let halfH = this.h / 2;
        let playerHalfSize = player.size / 2;
        if(!this.move){
            if (
                player.x + playerHalfSize > this.x - halfW && //Collision côté droit du joueur
                player.x - playerHalfSize < this.x + halfW && //Collision côté gauche du joueur
                player.y + playerHalfSize > this.y - halfH && //Collision bas du joueur
                player.y - playerHalfSize < this.y + halfH //Collision haut du joueur
            ) {
                if (player.x < this.x && keys["ArrowRight"]) {
                    player.x -= player.speed; //annule déplacement vers la droite
                } else if (player.x > this.x && keys["ArrowLeft"]) {
                    player.x += player.speed; //annule déplacement vers la gauche
                }

                if (player.y < this.y && keys["ArrowDown"]) {
                    player.y -= player.speed; //annule déplacement vers le bas
                } else if (player.y > this.y && keys["ArrowUp"]) {
                    player.y += player.speed; //annule déplacement vers le haut
                }
            }
        }
        else{
            if (
                player.x + playerHalfSize > this.x - halfW && //Collision côté droit du joueur
                player.x - playerHalfSize < this.x + halfW && //Collision côté gauche du joueur
                player.y + playerHalfSize > this.y - halfH && //Collision bas du joueur
                player.y - playerHalfSize < this.y + halfH //Collision haut du joueur
            ) {
                if (player.x < this.x && keys["ArrowRight"]) {
                    player.x -= player.speed; //annule déplacement vers la droite
                } else if (player.x > this.x && keys["ArrowLeft"]) {
                    player.x += player.speed; //annule déplacement vers la gauche
                }

                if (player.y < this.y && keys["ArrowDown"]) {
                    player.y -= player.speed; //annule déplacement vers le bas
                } else if (player.y > this.y && keys["ArrowUp"]) {
                    player.y += player.speed; //annule déplacement vers le haut
                }
                player.x += this.speedX;
                player.y += this.speedY;
                if(player.x<10){player.BornAgain();}
                if(player.x>w){player.BornAgain();}
                if(player.y<10){player.BornAgain();}
                if(player.y>h){player.BornAgain();}
            }
        }
    }
    draw(){
        drawRect(this.x, this.y, this.w, this.h, this.color);
    }
    moving() {
        if (this.move) {
            this.x +=this.speedX;
            this.y += this.speedY;

            // Rebond sur les bords de l'écran
            if (this.x + this.w / 2 > w || this.x - this.w / 2 < 0) {
                this.speedX = -this.speedX; // Inverser la direction en X
            }

            if (this.y + this.h / 2 > h || this.y - this.h / 2 < 0) {
                this.speedY = -this.speedY; // Inverser la direction en Y si tu veux du mouvement vertical
            }
        }
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
            //console.log("Collision détectée : Vous avez touché l'objectif !");
        checkcol=true;
        }
    }
    moving(XouY){
        if(XouY==="X"){
            this.x+=1;
        }
        if(XouY==="Y"){
            this.y+=1;
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

    player = new Player(1,"Toto",10,10,"red");
    c = new ExitGate(w/2,h/2,25);
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

function initObstacles(niveau) {
    obstacles = []; // Réinitialiser les obstacles à chaque niveau
    switch (niveau) {
        case 1:
            
            break;
        case 2:
            // Niveau 2 : Deux obstacles simples
            obstacles.push(new Obstacle(150, 0, 10, 1000, false, false, "red"));
            obstacles.push(new Obstacle(500, 600, 10, 1000, false, false, "green"));
            c.modifyCoordExitGate(600, 600);
            break;

        case 3:
            // Niveau 3 : Trois obstacles fixes
            obstacles.push(new Obstacle(250, 0, 50, 400, false, false, "red"));
            obstacles.push(new Obstacle(500, 0, 50, 400, false, false, "blue"));
            obstacles.push(new Obstacle(0, 300, 600, 20, false, false, "red"));
            obstacles.push(new Obstacle(700, 300, 500, 20, false, false, "red"));
            c.modifyCoordExitGate(w/2, 600);
            break;

        case 4:
            // Niveau 4 : Obstacles plus larges et différents
            obstacles.push(new Obstacle(150, 50, 50, 150, true, ["X",1], "purple"));
            obstacles.push(new Obstacle(200, 200, 620, 50, false, false, "yellow"));
            obstacles.push(new Obstacle(600, 100, 30, 200, false, false, "blue"));
            c.modifyCoordExitGate(500, 500);
            break;

        case 5:
            // Niveau 5 : Quatre obstacles
            obstacles.push(new Obstacle(100, 0, 50, 350, false, false, "orange"));
            obstacles.push(new Obstacle(300, 200, 100, 50, true, ["X",2], "red"));
            obstacles.push(new Obstacle(450, 350, 50, 100, true, ["Y",2], "green"));
            obstacles.push(new Obstacle(600, 400, 100, 50, true, ["X",2], "blue"));
            c.modifyCoordExitGate(650, 50);
            break;

        case 6:
            // Niveau 6 : Plus d'obstacles fixes, disposition plus complexe
            obstacles.push(new Obstacle(100, 150, 50, 100, true, ["Y",2], "purple"));
            obstacles.push(new Obstacle(200, 300, 100, 50, true, ["X",2], "green"));
            obstacles.push(new Obstacle(400, 100, 150, 50, true, ["X",2], "red"));
            obstacles.push(new Obstacle(550, 400, 50, 150, true, ["Y",2], "yellow"));
            c.modifyCoordExitGate(w/2, h/2);
            break;

        case 7:
            // Niveau 7 : Obstacles avec plus de variétés
            obstacles.push(new Obstacle(150, 0, 50, 200, true, false, "red"));
            obstacles.push(new Obstacle(350, 150, 100, 50, true, ["Y",2], "blue"));
            obstacles.push(new Obstacle(550, 300, 50, 100, true, ["Y",2], "green"));
            obstacles.push(new Obstacle(300, 400, 150, 50, true, ["Y",3], "purple"));
            obstacles.push(new Obstacle(100, 450, 50, 100, true, ["Y",3], "orange"));
            c.modifyCoordExitGate(600, 50);
            break;

        case 8:
            // Niveau 8 : Obstacles plus nombreux
            obstacles.push(new Obstacle(100, 200, 200, 20, false, false, "green"));
            obstacles.push(new Obstacle(300, 400, 200, 20, false, false, "blue"));
            obstacles.push(new Obstacle(500, 100, 20, 400, false, false, "red"));
            obstacles.push(new Obstacle(600, 300, 50, 150, false, false, "yellow"));
            c.modifyCoordExitGate(600, 50);
            break;

        case 9:
            // Niveau 9 : Obstacles avec plus de complexité
            obstacles.push(new Obstacle(150, 100, 50, 200, false, false, "purple"));
            obstacles.push(new Obstacle(300, 200, 100, 50, false, false, "blue"));
            obstacles.push(new Obstacle(450, 100, 50, 200, false, false, "green"));
            obstacles.push(new Obstacle(600, 250, 150, 50, false, false, "red"));
            c.modifyCoordExitGate(600, 50);
            break;

        case 10:
            // Niveau 10 : Obstacles larges et étroits
            obstacles.push(new Obstacle(100, 150, 300, 50, false, false, "yellow"));
            obstacles.push(new Obstacle(400, 100, 100, 50, false, false, "blue"));
            obstacles.push(new Obstacle(200, 350, 50, 150, false, false, "purple"));
            c.modifyCoordExitGate(600, 50);
            break;

        case 11:
            // Niveau 11 : Obstacle complexe au centre
            obstacles.push(new Obstacle(300, 300, 200, 200, true, ["X",3], "green"));
            obstacles.push(new Obstacle(100, 100, 100, 50, true, ["Y",3], "blue"));
            obstacles.push(new Obstacle(500, 50, 100, 50, true, ["X",3], "red"));
            c.modifyCoordExitGate(50, 600);
            break;

        case 12:
            // Niveau 12 : Mélange de petits et grands obstacles
            obstacles.push(new Obstacle(100, 100, 100, 100, false, false, "orange"));
            obstacles.push(new Obstacle(300, 200, 150, 50, false, false, "red"));
            obstacles.push(new Obstacle(500, 350, 100, 200, false, false, "green"));
            c.modifyCoordExitGate(500, 500);
            break;

        case 13:
            // Niveau 13 : Obstacles en forme de couloirs
            obstacles.push(new Obstacle(100, 100, 400, 20, false, false, "purple"));
            obstacles.push(new Obstacle(200, 300, 300, 20, false, false, "blue"));
            obstacles.push(new Obstacle(400, 400, 20, 150, false, false, "yellow"));
            c.modifyCoordExitGate(600, 50);
            break;

        case 14:
            // Niveau 14 : Obstacles en couloirs plus complexes
            obstacles.push(new Obstacle(150, 100, 50, 300, false, false, "green"));
            obstacles.push(new Obstacle(320, 200, 300, 20, false, false, "red"));
            obstacles.push(new Obstacle(500, 400, 20, 150, false, false, "yellow"));
            c.modifyCoordExitGate(600, 50);
            break;

        case 15:
            // Niveau 15 : Obstacles plus serrés
            obstacles.push(new Obstacle(100, 200, 200, 20, false, false, "blue"));
            obstacles.push(new Obstacle(300, 100, 50, 200, false, false, "purple"));
            obstacles.push(new Obstacle(500, 300, 100, 100, false, false, "red"));
            c.modifyCoordExitGate(50, 600);
            break;

        case 16:
            // Niveau 16 : Grand obstacle au centre
            obstacles.push(new Obstacle(300, 300, 200, 200, false, false, "orange"));
            obstacles.push(new Obstacle(100, 50, 100, 50, false, false, "blue"));
            obstacles.push(new Obstacle(500, 50, 100, 50, false, false, "green"));
            c.modifyCoordExitGate(350, 150);
            break;

        case 17:
            // Niveau 17 : Obstacles plus variés
            obstacles.push(new Obstacle(100, 100, 50, 100, false, false, "purple"));
            obstacles.push(new Obstacle(300, 200, 150, 50, false, false, "yellow"));
            obstacles.push(new Obstacle(500, 300, 50, 100, false, false, "red"));
            obstacles.push(new Obstacle(650, 400, 50, 100, false, false, "green"));
            c.modifyCoordExitGate(500, 500);
            break;

        case 18:
            // Niveau 18 : Obstacles plus nombreux
            obstacles.push(new Obstacle(100, 150, 200, 50, false, false, "blue"));
            obstacles.push(new Obstacle(300, 300, 100, 50, false, false, "green"));
            obstacles.push(new Obstacle(500, 100, 100, 200, false, false, "red"));
            c.modifyCoordExitGate(650, 250);
            break;

        case 19:
            // Niveau 19 : Beaucoup d'obstacles étroits
            obstacles.push(new Obstacle(100, 100, 50, 300, false, false, "yellow"));
            obstacles.push(new Obstacle(300, 200, 50, 100, false, false, "red"));
            obstacles.push(new Obstacle(500, 100, 50, 200, false, false, "green"));
            c.modifyCoordExitGate(560, 600);
            break;

        case 20:
            // Niveau 20 : Final avec obstacles nombreux et serrés
            obstacles.push(new Obstacle(150, 100, 50, 300, false, false, "red"));
            obstacles.push(new Obstacle(300, 200, 50, 200, false, false, "blue"));
            obstacles.push(new Obstacle(450, 300, 50, 100, false, false, "green"));
            obstacles.push(new Obstacle(600, 400, 50, 150, false, false, "yellow"));
            c.modifyCoordExitGate(560, 600);
            break;

        default:
            console.log("Niveau non défini");
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
    ctx.clearRect(0, 0, w, h);
    afficheNiveau(niveau);
    if (countdownValue > 0) {
        return;
    }

    player.updatePlayer();
    player.draw();
    c.draw();

    obstacles.forEach(obstacle => {
        obstacle.moving();
        obstacle.draw();
        obstacle.checkCollision(player); 
    });
    c.checkCollision(player);

    if (verifierPassageNiveau()) {
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
    //var niveau=4;
    //initObstacles(niveau);
    if (ingame) {
        requestAnimationFrame(mainLoop);
    }
}
