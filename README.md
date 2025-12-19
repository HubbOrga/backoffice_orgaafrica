# Orga Africa - Back Office

Application React pour l'administration de la plateforme Orga Africa.

## 🚀 Démarrage

Pour les instructions complètes de démarrage (y compris le backend et la base de données), veuillez consulter le [README principal](../README.md).

### Démarrage rapide (Frontend uniquement)

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:5173`.

## 🛠 Stack Technique

- **Framework** : React + Vite
- **Langage** : TypeScript
- **Styling** : Tailwind CSS v4
- **State Management** : React Query
- **Routing** : React Router v7
- **Icons** : Lucide React

## 🔑 Authentification

Pour vous connecter, assurez-vous que le backend tourne sur `http://localhost:3000`.

Identifiants par défaut :
- **Email** : `admin@orga.africa`
- **Password** : `Admin123!`

## 🐳 Déploiement avec Docker

Pour faciliter le déploiement, un `Dockerfile` et un `docker-compose.yml` sont fournis.

### Utilisation de Docker Compose

```bash
# Construire et démarrer l'application
docker-compose up -d --build
```

L'application sera accessible sur `http://localhost:8080`.

### Utilisation du Dockerfile seul

```bash
# Construire l'image
docker build -t orga-back-office .

# Lancer le conteneur
docker run -p 8080:80 orga-back-office
```
