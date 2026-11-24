# Gabarit

Un jeu de formes en pixel art : dans une forge, une pièce de métal chaud tombe vers un moule creusé dans le sol. Tourne-la, retourne-la et place-la pour qu'elle le remplisse exactement.

*English version: [README.en.md](README.en.md)*

## Commandes de clients et pièces en relief (nouveau en 1.2.0)

- **Six commandes** dans le panneau : un client veut une série d'objets nommés (clou, clé, fer à cheval, marteau, couronne, épée, cloche…), de 4 à 10 objets, avec un chrono au lieu des cœurs.
- Une pièce ratée coûte **10 secondes**. Trois étoiles s'il reste plus de la moitié du temps ; chaque commande livrée ouvre la suivante. Dès la troisième, des faux moules et des pièces retournées.
- Les pièces brûlantes sont dessinées **en relief** (dessus et côté), dorées quand elles remplissent le moule.

## Commandes

- **← →** (ou **Q D**) : déplacer la pièce.
- **↑** (ou **Z**, **X**) : la tourner d'un quart de tour.
- **Maj** (ou **C**) : la retourner, comme dans un miroir.
- **↓** : la faire tomber plus vite. **Espace** : la lâcher d'un coup.
- **Doigt** ou **souris** : à gauche ou à droite pour déplacer, au milieu pour tourner, deux appuis rapides au milieu pour lâcher.
- **P** ou **Échap** : pause, **Entrée** pour reprendre.
- **Plein écran** : le bouton du même nom ; Échap pour en sortir.

## Comment ça marche

- Le **moule** est la forme creusée dans le sol, bordée de rouge. La pièce a la même forme, mais tournée : à toi de la remettre dans le bon sens.
- Le **pointillé** montre où la pièce va tomber.
- Si elle remplit le moule exactement, elle devient de l'or. Sinon, c'est **raté** : un cœur de moins. Trois ratés et la forge s'éteint.
- Les moules grandissent et la pièce tombe de plus en plus vite.
- Dès la **manche 5**, un **faux moule** presque pareil apparaît à côté du vrai. Dès la **manche 8**, il faut parfois **retourner** la pièce.
- Points : 50 par case, plus un bonus si tu places vite, plus 25 % par pièce réussie d'affilée (jusqu'à +100 %).

## Statistiques

Le panneau Records garde ton **meilleur score**, le nombre de **parties** et de **pièces moulées**.

## Données et synchronisation

Ton record et tes totaux sont enregistrés par NeoDex, sauvegardés et synchronisés entre tes PC si la synchro est activée.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Gabarit → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).
