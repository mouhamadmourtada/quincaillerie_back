-- Création de la base de données
CREATE DATABASE IF NOT EXISTS quincaillerie_db;
USE quincaillerie_db;

-- Configuration du jeu de caractères
ALTER DATABASE quincaillerie_db CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    date_naissance DATE,
    lieu_naissance VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    isActive BOOLEAN DEFAULT true,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des catégories
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des fournisseurs
CREATE TABLE IF NOT EXISTS suppliers (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des produits
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    categoryId VARCHAR(36) NOT NULL,
    supplierId VARCHAR(36),
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    minStock INT DEFAULT 5,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoryId) REFERENCES categories(id),
    FOREIGN KEY (supplierId) REFERENCES suppliers(id)
);

-- Table des ventes
CREATE TABLE IF NOT EXISTS sales (
    id VARCHAR(36) PRIMARY KEY,
    totalAmount DECIMAL(10, 2) NOT NULL,
    customerName VARCHAR(100) NOT NULL,
    customerPhone VARCHAR(20) NOT NULL,
    saleDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    paymentDate DATETIME,
    paymentType ENUM('CASH', 'CARD', 'TRANSFER') NOT NULL,
    status ENUM('PENDING', 'PAID', 'CANCELLED') DEFAULT 'PENDING',
    userId VARCHAR(36) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id)
);

-- Table des items de vente
CREATE TABLE IF NOT EXISTS sale_items (
    id VARCHAR(36) PRIMARY KEY,
    saleId VARCHAR(36) NOT NULL,
    productId VARCHAR(36) NOT NULL,
    quantity INT NOT NULL,
    unitPrice DECIMAL(10, 2) NOT NULL,
    totalPrice DECIMAL(10, 2) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (saleId) REFERENCES sales(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products(id)
);

-- Index pour améliorer les performances
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_category ON products(categoryId);
CREATE INDEX idx_products_supplier ON products(supplierId);
CREATE INDEX idx_sales_customer ON sales(customerName, customerPhone);
CREATE INDEX idx_sales_date ON sales(saleDate);
CREATE INDEX idx_sales_status ON sales(status);
CREATE INDEX idx_sale_items_sale ON sale_items(saleId);
CREATE INDEX idx_sale_items_product ON sale_items(productId);

-- Insertion d'un utilisateur admin par défaut
-- Mot de passe par défaut : admin123 (à changer après la première connexion)
INSERT INTO users (id, firstname, lastname, username, email, password, role, lieu_naissance)
VALUES (
    UUID(),
    'Admin',
    'System',
    'admin',
    'admin@system.com',
    '$2a$10$rU5HaVtKJZEjfXsWYPMJIeZBBWxUhcCRLVgUQhVXJEgVRz.8Qqbw2',
    'admin',
    'System'
) ON DUPLICATE KEY UPDATE email = email;
