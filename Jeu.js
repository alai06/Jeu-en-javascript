var canvas, ctx, w, h;
var obstacles = [];
var players=[];
var keys = {}; //Suivi des touches pressées
var win = 0; //Variable de victoire (0 = pas de victoire, 1 = victoire)
var niveau=1;
var dernier_niv=20;
var c;
var ingame;
var checkcol=false;//variable pour detecter une collision
var count=0;
const niveauDisplay = document.getElementById("niveauDisplay");
const countdownElement = document.getElementById("countdown");
let countdownValue = 0;
const countdownInterval = setInterval(updateCountdown, 1000);
let controls = [
    { up: "ArrowUp", down: "ArrowDown", left: "ArrowLeft", right: "ArrowRight" },//J1
    { up: "z", down: "s", left: "q", right: "d" },//J2
    { up: "t", down: "g", left: "f", right: "h" },//J3
    { up: "i", down: "k", left: "j", right: "l" }//J4
];

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
        this.control=controls[this.id-1];
        this.exit=false;
        this.initialX=this.x;
        this.initialY=this.y;
    }
    draw(){
        if(!this.exit){
        drawRect(this.x, this.y, this.size, this.size, this.color);}
    }

    updatePlayer() {
        if(this.exit){return;}
        let diagonalSpeed = this.speed / Math.sqrt(2);
        //si horizontal et vertical en même temps
        if ((keys[this.control.right] || keys[this.control.left]) && (keys[this.control.down] || keys[this.control.up])) {
            if (keys[this.control.right] && this.x + this.size < w) {
                this.x += diagonalSpeed;
            }
            if (keys[this.control.left] && this.x -this.size/2> 10) {
                
                this.x -= diagonalSpeed;
            }
            if (keys[this.control.down] && this.y + this.size/2 < h) {
                this.y += diagonalSpeed;
            }
            if (keys[this.control.up] && this.y -this.size/2> 0) {
                this.y -= diagonalSpeed;
            }
        }
        else {
            if (keys[this.control.right] && this.x + this.size/2 < w) {
                this.x += this.speed;
            }
            if (keys[this.control.left] && this.x -this.size/2> 0) {
                this.x -= this.speed;
            }
            if (keys[this.control.down] && this.y + this.size/2 < h) {
                this.y += this.speed;
            }
            if (keys[this.control.up] && this.y -this.size/2> 0) {
                this.y -= this.speed;
            }
        }
        
    }
    resetPosition() {
        this.x = this.initialX;
        this.y = this.initialY;
    }
    BornAgain(){
        setTimeout(() => {
            this.x = this.initialX;
            this.y = this.initialY;
        }, 210);
    }
    
}

class Score {
    constructor(joueur) {
        this.joueur = joueur;  // Nom du joueur (par exemple "Joueur 1")
        this.score = 0;         // Score initial du joueur
    }

    // Fonction pour attribuer les points en fonction de la position
    attribuerPoints(position) {
        if (position === 1) {
            this.score = 10; // Premier obtient 10 points
        } else if (position === 2) {
            this.score = 6; // Deuxième obtient 6 points
        } else if (position === 3) {
            this.score = 3; // Troisième obtient 3 points
        } else {
            this.score = 0; // Quatrième obtient 0 points
        }
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
    
        if (
            player.x + playerHalfSize > this.x - halfW && //collision rebord droit
            player.x - playerHalfSize < this.x + halfW &&
            player.y + playerHalfSize > this.y - halfH &&
            player.y - playerHalfSize < this.y + halfH
        ) {
            if (player.x < this.x && keys["ArrowRight"]) {
                player.x -= player.speed;//annule mouvement vers la droite
            } else if (player.x > this.x && keys["ArrowLeft"]) {
                player.x += player.speed;
            }
    
            if (player.y < this.y && keys["ArrowDown"]) {
                player.y -= player.speed;//annule mouvement vers le bas
            } else if (player.y > this.y && keys["ArrowUp"]) {
                player.y += player.speed;
            }
    
            if (this.move) {
                player.x += this.speedX;
                player.y += this.speedY;
    
                if (player.x < 10 || player.x > w || player.y < 10 || player.y > h) {
                    player.BornAgain();
                }
                obstacles.forEach(otherObstacle => {
                    if (otherObstacle !== this) {
                        if (
                            player.x < otherObstacle.x + otherObstacle.w &&
                            player.x + playerHalfSize > otherObstacle.x &&
                            player.y < otherObstacle.y + otherObstacle.h &&
                            player.y + playerHalfSize > otherObstacle.y
                        ) {
                            player.BornAgain();
                        }
                    }
                });
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

            //Rebond sur les bords de l'écran
            if (this.x + this.w / 2 > w || this.x - this.w / 2 < 0) {
                this.speedX = -this.speedX;//Inverser la direction en X
            }

            if (this.y + this.h / 2 > h || this.y - this.h / 2 < 0) {
                this.speedY = -this.speedY;//Inverser la direction en Y si tu veux du mouvement vertical
            }
        }
    }
}

class ExitGate{
    constructor(x,y,size){
        this.x=x;
        this.y=y;
        this.size=size;
        this.color="white";
        this.Listeplayers=[];
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
    checkCollision(player) {
        if (
            player.x < this.x + this.size &&
            player.x + player.size > this.x &&
            player.y < this.y + this.size &&
            player.y + player.size > this.y &&
            !player.exit
        ) {
            player.exit=true;
            this.Listeplayers.push(player);
            if (this.Listeplayers.length === players.length) {
                checkcol = true;
            }
            var pointmax =3;
            if(players.length===1){players[0].score+=1;}
            else{
                for(let i=0;i<this.Listeplayers.length;i++){
                    this.Listeplayers[i].score+=pointmax;
                    pointmax--;
                    console.log(this.Listeplayers[i].name,this.Listeplayers[i].score);
                }
            }
        }
        players.forEach((player, index) => {
            // Mettre à jour le texte du score du joueur dans l'élément HTML
            document.getElementById(`scorePlayer${index + 1}`).textContent = `Joueur ${index + 1}: ${player.score}`;
        });
    }
    resetForNextLevel() {
        this.Listeplayers=[];
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

//------------------------------------------------------------------------
window.onload = function init() {
    canvas = document.querySelector("#myCanvas");
    w = canvas.width; 
    h = canvas.height;  
    ctx = canvas.getContext('2d');
    
    window.addEventListener("keydown", function(e) {
        keys[e.key] = true;
    });
    window.addEventListener("keyup", function(e) {
        keys[e.key] = false;
    });
};

document.addEventListener('DOMContentLoaded', function () {
    const menu = document.getElementById('menu');
    const game = document.getElementById('game');
    const playersSelect = document.getElementById('players');
    const playerColorsDiv = document.getElementById('playerColors');
    const startGameButton = document.getElementById('startGame');
    
    //Fonction pour générer les couleurs pour chaque joueur
    function generatePlayerColorOptions(numPlayers) {
        playerColorsDiv.innerHTML = ''; //On efface les anciennes options
        const predefinedColors = ['#FF0000', '#0000FF', '#00FF00', '#FFFF00'];
        for (let i = 1; i <= numPlayers; i++) {
            const label = document.createElement('label');
            label.innerText = `Couleur du Joueur ${i}: `;
            
            const input = document.createElement('input');
            input.type = 'color';
            input.id = `colorPlayer${i}`;
            input.name = `colorPlayer${i}`;
            input.value = predefinedColors[i - 1];//Attribuer la couleur définie
            
            playerColorsDiv.appendChild(label);
            playerColorsDiv.appendChild(input);
            playerColorsDiv.appendChild(document.createElement('br'));
        }
    }

    //Événement lorsque le nombre de joueurs est changé
    playersSelect.addEventListener('change', function () {
        generatePlayerColorOptions(playersSelect.value);
    });

    //Initialiser avec 1 joueur par défaut
    generatePlayerColorOptions(playersSelect.value);

    //Quand le bouton 'Commencer le jeu' est cliqué
    startGameButton.addEventListener('click', function () {
        //Récupérer les informations des joueurs
        const numPlayers = playersSelect.value;
        const playerColors = [];
        for (let i = 1; i <= numPlayers; i++) {
            const colorInput = document.getElementById(`colorPlayer${i}`);
            playerColors.push(colorInput.value);
        }

        //Cacher le menu et afficher le jeu
        menu.style.display = 'none';
        game.style.display = 'block';
        
        initGame(numPlayers, playerColors);
    });

    //Fonction pour initialiser le jeu avec les info des joueurs
    function initGame(numPlayers, playerColors) {
        for (let i = 0; i < numPlayers; i++) {
            players.push(new Player(i + 1, `Joueur ${i + 1}`, 30+ i * 30, 30 , playerColors[i]));
        }
        
        c = new ExitGate(w/2,h/2,25);
        mainLoop();
    }
});

function drawRect(x, y, width, height, c) {
    ctx.save();
    ctx.fillStyle = c;
    ctx.fillRect(x-1/2*width, y-1/2*height, width, height);
    ctx.restore();
}

function Menu(){//inutile
    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.font = "40px Roboto";
    ctx.fillStyle = "blue";
    ctx.textAlign = "center";
    ctx.fillText("Course Cube", w / 2, h / 2 - 50);
    ctx.restore();

    const startButton = document.getElementById("StartButton");
    startButton.style.display = "block";

    startButton.addEventListener("click", function() {
        ingame=true;
        mainLoop();
        
    });

}
const exitButton = document.getElementById("ExitButton");
exitButton.style.display = "block";
exitButton.addEventListener("click", function() {
    ingame=false;
    exitgame();
});

function exitgame(){//inutile
    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.font = "40px Roboto";
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
    // Sélectionner l'élément HTML où afficher le niveau
    const niveauDisplay = document.getElementById("niveauDisplay");
    // Mettre à jour son contenu avec le niveau
    niveauDisplay.textContent = `Niveau : ${niveau}`;
}


function updateCountdown() {//il faut l'afficher
    if (countdownValue > 0) {
        countdownValue--;
        countdownElement.textContent = countdownValue;
    } else {
        // Optionnel : Quand le compteur atteint 0, afficher un message
        clearInterval(countdownInterval); // Arrêter l'intervalle
        countdownElement.textContent = "GO!"; // Afficher "GO!" ou autre
    }
}
function initialiserNiveau() {//modifier
    players.forEach(player => {
        player.resetPosition();
        player.exit=false;
    });
    checkcol = false;
}

function mainLoop() {
    ctx.clearRect(0, 0, w, h);
    afficheNiveau(niveau);
    if (countdownValue > 0) {
        return;
    }

    c.draw();
    players.forEach(player => {
        player.updatePlayer();
        player.draw();
        c.checkCollision(player);
    });

    obstacles.forEach(obstacle => {
        obstacle.moving();
        obstacle.draw();
        players.forEach(player => obstacle.checkCollision(player));
    });
    

    if (checkcol) {
        ctx.save();
        ctx.font = "bold 40px 'Press Start 2P', Roboto"; 
        ctx.fillStyle = "#00ffcc";
        ctx.textAlign = "center";
        ctx.shadowColor = "black";
        ctx.shadowOffsetX = 4;
        ctx.shadowOffsetY = 4;
        ctx.shadowBlur = 5;
        ctx.fillText(`Niveau ${niveau} terminé !`, w / 2, h / 2);
        ctx.strokeText(`Niveau ${niveau} terminé !`, w / 2, h / 2);
        
        ctx.restore(); 
        setTimeout(() => {
            // Passer au niveau suivant
            niveau++;
            if (niveau > dernier_niv) {
                console.log("Félicitations, vous avez terminé le jeu !");
                ctx.clearRect(0, 0, w, h);
                ctx.save();
                ctx.font = "40px Roboto";
                ctx.fillStyle = "green";
                ctx.textAlign = "center";
                ctx.fillText("Félicitations, vous avez terminé le jeu !", w / 2, h / 2);
                ctx.restore();
                return; // Arrêter le jeu
            }

            // Initialiser le niveau suivant
            
            initialiserNiveau();
            initObstacles(niveau); // Charger les obstacles pour le niveau suivant
            c.resetForNextLevel();
            requestAnimationFrame(mainLoop);
        }, 2000); // Pause de 2 secondes avant le prochain niveau
        return; // Suspendre la boucle principale temporairement
    }
    requestAnimationFrame(mainLoop);
}
