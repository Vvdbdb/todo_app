 📝 Application ToDo List

Description
Cette application est une ToDo List Web collaborative developpee dans le cadre d'un projet pedagogique. Elle permet d'ajouter, modifier, supprimer et consulter des taches. L'application est conteneurisee avec Docker et deployee via Nginx.



Technologies utilisees

- Frontend : React (Vite)
- Backend : Node.js + Express
- Base de donnees : PostgreSQL
- Proxy : Nginx
- Conteneurisation : Docker & Docker Compose
- Gestion de version : Git & GitHub

---

Structure du projet Git

- `main` : branche de production contenant le code final validé.
- `develop` : développement de l’application (issue de la branche infrastructure)
- `infrastructure` : contient les fichiers Docker et la configuration.

Pour les Collaborateurs GitHub

Creation du depot
```bash
Initialiser un depot Git
git init

Ajouter les fichiers
git add .

Lier a GitHub
git remote add origin https://github.com/Vvdbdb/todo_app.git

Pousser le projet
git push -u origin main
```

Ajouter un collaborateur
1. Aller sur GitHub-> votre depot -> Settings -> Collaborators
2. Ajouter l'adresse : roydevman@gmail.com
3. Attendre l'acceptation de l'invitation

Installation des dependances

 1. Backend (Node.js + Express + PostgreSQL)

```bash
Creer et se deplacer dans le dossier du projet
mkdir todo_app
cd todo_app

Initialiser un projet Node.js
npm init -y

Installer les dependances backend
npm install express pg body-parser

Depuis le dossier backend lancer l'application
cd backend
node app.js
```

2. Frontend (React via Vite)

```bash
Creer le frontend avec Vite
npm create vite@latest frontend -- --template react

Se deplacer dans le dossier frontend
cd frontend

Installer les dependances frontend
npm install axios react-router-dom react-spinners

Depuis le dossier frontend lancer l'application
cd frontend
npm run dev
```

 3. PostgreSQL (via Docker)

```bash
Telecharger l'image PostgreSQL
docker pull postgres:15

Lancer les conteneurs Docker (dans le dossier du projet)
docker-compose up --build

Tester la connexion a PostgreSQL
docker exec -it todo-db psql -U postgres -c "\l"

Se connecter manuellement a la DB
docker exec -it todo-db psql -U postgres

Creer la base de donnees
CREATE DATABASE todolist;

Se connecter a la base
\c todolist

Creer la table des taches
CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  completed BOOLEAN DEFAULT FALSE
);
```

## Lancement du projet

```bash
Depuis la racine du projet
docker-compose up --build
```
Acceder a l'application : [http://localhost:8080](http://localhost:8080)

Fonctionnalites

- ✅ Ajout de tache
- ✏️ Modification de tache
- 🗑️ Suppression de tache
- 📋 Visualisation des taches
- 💾 Sauvegarde en base PostgreSQL


Video de demonstration
Detail : demonstration du lancement, de l'utilisation et des roles de chaque membre de l equipe.

lien Drive:
https://esmtsn-my.sharepoint.com/:v:/g/personal/tigwende_kabore_etu_esmt_sn/EWJytl7MS59CntAnPE67bQkBz32B0Xx5c40hUsJiN2GzTA?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=mayL3Q


Repartition des roles

- Developpement : Assiatou BAH
- Infrastructure & Deploiement : 
Docker : Tigwende Timothée KABORE 
SQL : Adam Hissein TYARA
Nginx : Khady DIOP

Licence
Ce projet est a usage pedagogique uniquement.

