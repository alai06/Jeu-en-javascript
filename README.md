# Jeu-en-javascript
## Codé par Allah-Eddine Cherigui et Mehdi Mansour

Projet dans le cadre d'un cours de JavaScript en Master 1.\
L'objectif était de reproduire un jeu décrit par le professeur.\
Le jeu s'apparente à une course jusqu'à 4 joueurs, premier arrivé à l'objectif (ici un cercle blanc) gagne la course et donc le plus de points.\
Ce jeu est composé de plusieurs niveaux (ici 20 niveaux). Le joueur qui a gagné le plus de points gagne le jeu.\
Jouable en solo (gagner = finir le jeu).

## 1/Choix du nombre de couleur.

On commence le jeu par un menu offrant le choix du nombre de joueur et leur couleur.
### Commande joueur :
```
Joueur 1 : les fleches directionnelles
Joueur 2 : zqsd
Joueur 3 : tfgh
Joueur 4 : ijkl
```

## 2/Règle du jeu.

Comme décrit un peu plus haut, c'est une course, le premier arrivé au cercle blanc gagne le max de point (ici 3), le deuxieme gagne 1 point de moins que le premier et ainsi de suite.\
Le dernier quant a lui en gagne 0 (si 4 joueurs, si 2 Joueurs le dernier à 2 points).\
Il y'a des obstacles pour empecher les Joueurs d'aller directement à l'objectif. \
Certains seront en mouvement et pourront tuer les Joueurs s'ils les ecrasent les Joueurs contre les parois ou contre d'autre obstacle.\
Les joueurs peuvent se bousculer entre eux.\
Celui qui a le plus de points à la fin du jeu gagne.

## 3/Difficulté rencontré

- La gestion des collisions entre les Joueurs et les Obstacles fût compliqué mais on a reussi finalement à le faire
- La gestion des collisions entre deux Joueurs, on a pas reussi à gérer ces collision si un troisieme joueur entre dans la collision 

# NB 

- Nous avons décidé que tout les obstacles en mouvement se traversent entre eux
- A partir du niveau 15 : l'objectif (cercle blanc) se déplacent pour augmenter la difficulté

# Merci Pour votre attention
# Amusez-vous bien !