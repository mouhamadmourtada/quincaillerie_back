# API de Gestion de Quincaillerie

Cette API RESTful est conçue pour gérer une quincaillerie, permettant la gestion des utilisateurs, des produits, des catégories, des fournisseurs et des ventes.

## Table des matières
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Documentation des Routes](#documentation-des-routes)
  - [Authentification](#authentification)
  - [Utilisateurs](#utilisateurs)
  - [Catégories](#catégories)
  - [Produits](#produits)
  - [Fournisseurs](#fournisseurs)
  - [Ventes](#ventes)
  - [Tableau de bord](#tableau-de-bord)

## Prérequis

- Node.js (v14 ou supérieur)
- MySQL (v8.0 ou supérieur)
- npm ou yarn

## Installation

1. Cloner le dépôt :
```bash
git clone [URL_DU_REPO]
cd back-end
```

2. Installer les dépendances :
```bash
npm install
```

3. Créer la base de données :
```bash
mysql -u root -p < database.sql
```

4. Configurer les variables d'environnement :
```bash
cp .env.example .env
```
Puis modifiez le fichier `.env` avec vos configurations.

5. Démarrer le serveur :
```bash
npm run dev
```

## Configuration

Le fichier `.env` doit contenir les variables suivantes :

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=quincaillerie_db
DB_PORT=3306

# JWT Configuration
JWT_SECRET=votre_secret_jwt_super_securise

# Server Configuration
PORT=3005
```

## Documentation des Routes

### Authentification
| Méthode | Route | Description | Corps de la requête | Réponse |
|---------|-------|-------------|-------------------|----------|
| POST | `/api/auth/register` | Inscription d'un nouvel utilisateur | `{ username, email, password }` | `{ id, username, email, token }` |
| POST | `/api/auth/login` | Connexion | `{ email, password }` | `{ id, username, email, token }` |
| GET | `/api/auth/me` | Obtenir le profil de l'utilisateur connecté | - | `{ id, username, email }` |
| POST | `/api/auth/change-password` | Changer son mot de passe | `{ currentPassword, newPassword }` | `{ message }` |
| POST | `/api/auth/reset-password` | Réinitialiser le mot de passe (admin) | `{ userId, newPassword }` | `{ message }` |

### Utilisateurs
| Méthode | Route | Description | Corps de la requête | Réponse |
|---------|-------|-------------|-------------------|----------|
| GET | `/api/users` | Liste des utilisateurs | - | `[{ id, username, email }]` |
| GET | `/api/users/:id` | Détails d'un utilisateur | - | `{ id, username, email }` |
| PUT | `/api/users/:id` | Modifier un utilisateur | `{ username, email }` | `{ id, username, email }` |
| DELETE | `/api/users/:id` | Supprimer un utilisateur | - | `{ message }` |

### Catégories
| Méthode | Route | Description | Corps de la requête | Réponse |
|---------|-------|-------------|-------------------|----------|
| GET | `/api/categories` | Liste des catégories | - | `[{ id, name, description }]` |
| POST | `/api/categories` | Créer une catégorie | `{ name, description }` | `{ id, name, description }` |
| GET | `/api/categories/:id` | Détails d'une catégorie | - | `{ id, name, description }` |
| PUT | `/api/categories/:id` | Modifier une catégorie | `{ name, description }` | `{ id, name, description }` |
| DELETE | `/api/categories/:id` | Supprimer une catégorie | - | `{ message }` |

### Produits
| Méthode | Route | Description | Corps de la requête | Réponse |
|---------|-------|-------------|-------------------|----------|
| GET | `/api/products` | Liste des produits | - | `[{ id, name, price, stock }]` |
| POST | `/api/products` | Créer un produit | `{ name, categoryId, price, stock }` | `{ id, name, price, stock }` |
| GET | `/api/products/:id` | Détails d'un produit | - | `{ id, name, price, stock }` |
| PUT | `/api/products/:id` | Modifier un produit | `{ name, price, stock }` | `{ id, name, price, stock }` |
| DELETE | `/api/products/:id` | Supprimer un produit | - | `{ message }` |

### Fournisseurs
| Méthode | Route | Description | Corps de la requête | Réponse |
|---------|-------|-------------|-------------------|----------|
| GET | `/api/suppliers` | Liste des fournisseurs | - | `[{ id, name, email, phone }]` |
| POST | `/api/suppliers` | Créer un fournisseur | `{ name, email, phone, address }` | `{ id, name, email, phone }` |
| GET | `/api/suppliers/:id` | Détails d'un fournisseur | - | `{ id, name, email, phone, address }` |
| PUT | `/api/suppliers/:id` | Modifier un fournisseur | `{ name, email, phone, address }` | `{ id, name, email, phone }` |
| DELETE | `/api/suppliers/:id` | Supprimer un fournisseur | - | `{ message }` |

### Ventes
| Méthode | Route | Description | Corps de la requête | Réponse |
|---------|-------|-------------|-------------------|----------|
| GET | `/api/sales` | Liste des ventes | - | `[{ id, totalAmount, status }]` |
| POST | `/api/sales` | Créer une vente | `{ items, customerName, customerPhone, paymentType }` | `{ id, totalAmount, status }` |
| GET | `/api/sales/:id` | Détails d'une vente | - | `{ id, totalAmount, items }` |
| PUT | `/api/sales/:id` | Modifier une vente | `{ status, paymentType }` | `{ id, totalAmount, status }` |
| POST | `/api/sales/:id/pay` | Marquer une vente comme payée | `{ paymentType }` | `{ id, status }` |
| POST | `/api/sales/:id/cancel` | Annuler une vente | - | `{ id, status }` |

### Tableau de bord
| Méthode | Route | Description | Corps de la requête | Réponse |
|---------|-------|-------------|-------------------|----------|
| GET | `/api/dashboard/sales-summary` | Résumé des ventes | - | `{ totalSales, dailySales }` |
| GET | `/api/dashboard/stock-alerts` | Alertes de stock | - | `[{ id, name, stock }]` |

## Authentification

L'API utilise JWT (JSON Web Tokens) pour l'authentification. Pour accéder aux routes protégées, incluez le token dans l'en-tête de la requête :

```
Authorization: Bearer votre_token_jwt
```

## Gestion des erreurs

L'API renvoie des erreurs au format suivant :

```json
{
    "message": "Description de l'erreur"
}
```

Les codes HTTP standards sont utilisés :
- 200 : Succès
- 201 : Création réussie
- 400 : Erreur de requête
- 401 : Non authentifié
- 403 : Non autorisé
- 404 : Ressource non trouvée
- 500 : Erreur serveur

## Tests

Pour exécuter les tests :
```bash
npm test
```

## Contribution

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.
