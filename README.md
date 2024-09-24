## Description
Ce projet est une plateforme immobilière qui permet aux utilisateurs de créer, consulter et gérer des annonces immobilières. Les utilisateurs peuvent s'inscrire, se connecter, créer des annonces et interagir avec les biens disponibles (liker, partager, voir les détails, déposer une candidature, etc.). La plateforme inclut aussi des fonctionnalités avancées comme une vue en 3D des logements et une carte Google Map intégrée pour la localisation des biens.

## Structure du projet
Le projet est divisé en deux dossiers principaux :
- **back** : Contient la partie backend de l'application.
- **front** : Contient la partie frontend de l'application.

## Installation

1. Clonez le projet sur votre machine locale :
    ```bash 
    git clone https://github.com/AchrefAwaissi/Optilogis
    ```

2. Accédez au dossier du projet :
    ```bash
    cd Optilogis
    ```

3. Installez les dépendances pour le backend et le frontend :
    - Backend :
      ```bash
      cd back
      npm install
      ```
    - Frontend :
      ```bash
      cd ../front
      npm install
      ```

4. Lancez le projet :
    - Backend :
      ```bash
      npm start
      ```
    - Frontend :
      ```bash
      npm start
      ```

5. Accédez à l'application sur votre navigateur à l'adresse suivante : `http://localhost:3000`.

## Fonctionnalités

### Inscription et Connexion
- **Inscription** : Les nouveaux utilisateurs peuvent s'inscrire en fournissant un email, un nom d'utilisateur, un mot de passe et une photo de profil (optionnelle).
- **Connexion** : Une fois inscrits, les utilisateurs peuvent se connecter en entrant leur nom d'utilisateur et leur mot de passe.

### Accueil
- La page d'accueil affiche toutes les annonces disponibles (maisons, appartements, studios).
- **Filtres disponibles** : 
  - Type de logement
  - Fourchette de prix
  - Surface habitable
  - Nombre de pièces
  - Nombre de chambres
  - Étage
  - Surface annexe
- Chaque annonce contient un bouton **Voir les détails** qui permet d'afficher :
  - Le nom, la description, le prix, l'adresse, la ville, le pays, le type de logement, le nombre de pièces, de chambres, la surface habitable, l'accessibilité (étage), la surface annexe, etc.
  - Une carte Google Map indiquant la position du bien.
  - Une fonctionnalité pour **calculer la distance** entre le bien choisi et un point sélectionné par l'utilisateur.
  - La possibilité de **déposer une candidature** pour le bien.
  - Un bouton pour **liker** l'annonce et la **partager sur les réseaux sociaux**.

### Création d'une annonce
- Les utilisateurs peuvent créer une annonce en remplissant les champs suivants :
  - Nom, description, prix, adresse, ville, pays
  - Type de logement
  - Nombre de pièces, nombre de chambres
  - Surface habitable, étage, surface annexe
  - Upload des images

### Mes annonces
- Une page **Mes annonces** qui affiche toutes les annonces que l'utilisateur a publiées.
  
### Vue 3D
- Une page **Vue 3D** permettant de visualiser les logements en 3D.

### Paramètres
- Une page **Paramètres** où les utilisateurs peuvent voir et modifier leurs informations personnelles :
  - Nom d'utilisateur, email, mot de passe, photo de profil

## Technologies Utilisées

- **Frontend** : React, HTML, CSS, TypeScript
- **Backend** : Node.js, Express
- **Base de données** : MongoDB
- **Autres** : Google Maps API, Authentification JWT, etc.



