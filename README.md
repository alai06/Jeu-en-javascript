# Jeu-en-javascript
## Codé par Allah-Eddine Cherigui et Mehdi Mansour

Projet dans le cadre d'un cours de JavaScript en Master 1.\
L'objectif était de reproduire un jeu décrit par le professeur.\
Le jeu s'apparente à une course jusqu'à 4 joueurs, premier arrivé à l'objectif (ici un cercle blanc) gagne la course et donc le plus de points.\
Ce jeu est composé de plusieurs niveaux (ici 20 niveaux). Le joueur qui a gagné le plus de points gagne le jeu.\
Jouable en solo (gagner = finir le jeu).

## 1/Choix du nombre de couleurs

On commence le jeu par un menu offrant le choix du nombre de joueur et leur couleur.
### <ins>Commande joueur</ins> :
```
<ins>Ordre des touches</ins> : Haut, gauche, bas, droite
Joueur 1 : les flèches directionnelles
Joueur 2 : zqsd
Joueur 3 : tfgh
Joueur 4 : ijkl
```

## 2/Règles du jeu

Comme décrit un peu plus haut, c'est une course, le premier arrivé au cercle blanc gagne le max de point (ici 3), le deuxieme gagne 1 point de moins que le premier (3-1=2) et ainsi de suite.\
Le dernier quant à lui en gagne 0 (si 4 joueurs, si 2 joueurs le dernier a 2 points, si 3 joueurs le dernier a 1 point).\
Il y'a des obstacles pour empêcher les joueurs d'aller directement à l'objectif. \
Certains sont en mouvement et peuvent tuer les joueurs, en les poussant et écrasant contre les parois ou contre d'autres obstacles (mouvement ou non).\
Les joueurs peuvent se bousculer entre eux.\
Celui qui a le plus de points à la fin du jeu gagne.

## 3/Difficultés rencontrées

- La gestion des collisions entre les Joueurs et les Obstacles fût compliqué mais on a reussi finalement à le faire
- La gestion des collisions entre deux Joueurs, on a pas reussi à gérer si un troisieme joueur entre dans la collision, le joueur entre les deux autres passera à travers  

# NB 

- Nous avons décidé que tout les obstacles en mouvement se traversent entre eux
- A partir du niveau 15 : l'objectif (cercle blanc) se déplacent pour augmenter la difficulté

# Merci Pour votre attention
# Amusez-vous bien !