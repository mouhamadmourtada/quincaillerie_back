# API Documentation

## Base URL
```
http://localhost:3005/api
```

## Authentication

### Register
- **URL**: `/auth/register`
- **Method**: `POST`
- **Body**:
```json
{
    "firstname": "string",     // 2-50 caractères
    "lastname": "string",      // 2-50 caractères
    "date_naissance": "string", // Format: YYYY-MM-DD (doit être dans le passé)
    "lieu_naissance": "string", // 2-100 caractères
    "username": "string",      // 3-50 caractères, unique
    "email": "string",         // Email valide, unique
    "password": "string",      // Minimum 6 caractères
    "role": "user | admin"     // Optionnel, par défaut "user"
}
```
- **Response**: 
```json
{
    "id": "uuid",
    "firstname": "string",
    "lastname": "string",
    "date_naissance": "string",
    "lieu_naissance": "string",
    "username": "string",
    "email": "string",
    "role": "string",
    "token": "string"
}
```

### Login
- **URL**: `/auth/login`
- **Method**: `POST`
- **Body**:
```json
{
    "email": "string",
    "password": "string"
}
```
- **Response**: 
```json
{
    "id": "uuid",
    "username": "string",
    "email": "string",
    "role": "string",
    "token": "string"
}
```

## Protected Routes
All routes below require Authentication token in header:
```
Authorization: Bearer <token>
```

## Categories

### Create Category
- **URL**: `/categories`
- **Method**: `POST`
- **Body**:
```json
{
    "name": "string",
    "description": "string"
}
```

### Get All Categories
- **URL**: `/categories`
- **Method**: `GET`
- **Query Parameters**:
  - `name`: Filter by name (optional)

### Get Category by ID
- **URL**: `/categories/:id`
- **Method**: `GET`

### Update Category
- **URL**: `/categories/:id`
- **Method**: `PATCH`
- **Body**:
```json
{
    "name": "string",
    "description": "string"
}
```

### Delete Category
- **URL**: `/categories/:id`
- **Method**: `DELETE`

## Products

### Create Product
- **URL**: `/products`
- **Method**: `POST`
- **Body**:
```json
{
    "name": "string",
    "description": "string",
    "price": "number",
    "stock": "number",
    "categoryId": "uuid",
    "supplierId": "uuid"
}
```

### Get All Products
- **URL**: `/products`
- **Method**: `GET`
- **Query Parameters**:
  - `name`: Filter by name (optional)
  - `categoryId`: Filter by category (optional)
  - `minPrice`: Filter by minimum price (optional)
  - `maxPrice`: Filter by maximum price (optional)

### Get Product by ID
- **URL**: `/products/:id`
- **Method**: `GET`

### Update Product
- **URL**: `/products/:id`
- **Method**: `PATCH`
- **Body**:
```json
{
    "name": "string",
    "description": "string",
    "price": "number",
    "stock": "number",
    "categoryId": "uuid",
    "supplierId": "uuid"
}
```

### Delete Product
- **URL**: `/products/:id`
- **Method**: `DELETE`

### Update Product Stock
- **URL**: `/products/:id/stock`
- **Method**: `PATCH`
- **Body**:
```json
{
    "quantity": "number" // Can be positive or negative
}
```

## Sales

### Create Sale
- **URL**: `/sales`
- **Method**: `POST`
- **Body**:
```json
{
    "customerName": "string",
    "customerPhone": "string",
    "paymentType": "CARD | CASH | TRANSFER",
    "items": [
        {
            "productId": "uuid",
            "quantity": "number"
        }
    ],
    "status": "PENDING | PAID | CANCELLED"
}
```

### Get All Sales
- **URL**: `/sales`
- **Method**: `GET`
- **Query Parameters**:
  - `status`: Filter by status (optional)
  - `paymentType`: Filter by payment type (optional)
  - `startDate`: Filter by start date (optional)
  - `endDate`: Filter by end date (optional)

### Get Sale by ID
- **URL**: `/sales/:id`
- **Method**: `GET`

### Update Sale
- **URL**: `/sales/:id`
- **Method**: `PATCH`
- **Body**:
```json
{
    "status": "PENDING | PAID | CANCELLED",
    "paymentType": "CARD | CASH | TRANSFER"
}
```

### Mark Sale as Paid
- **URL**: `/sales/:id/pay`
- **Method**: `POST`
- **Body**:
```json
{
    "paymentType": "CARD | CASH | TRANSFER"  // Optionnel, conserve le type de paiement existant si non fourni
}
```
- **Response**: Retourne la vente mise à jour
- **Erreurs possibles**:
  - 404: Vente non trouvée
  - 400: La vente est déjà payée ou annulée

### Cancel Sale
- **URL**: `/sales/:id/cancel`
- **Method**: `POST`
- **Response**: Retourne la vente mise à jour
- **Description**: Annule la vente et restaure automatiquement le stock des produits
- **Erreurs possibles**:
  - 404: Vente non trouvée
  - 400: La vente est déjà annulée ou payée

### Delete Sale
- **URL**: `/sales/:id`
- **Method**: `DELETE`

## Dashboard

### Get Dashboard Stats
- **URL**: `/dashboard/stats`
- **Method**: `GET`
- **Response**:
```json
{
    "currentMonthStats": {
        "totalSales": "number",
        "totalRevenue": "number"
    },
    "todayStats": {
        "totalSales": "number",
        "totalRevenue": "number"
    },
    "inventory": {
        "totalProducts": "number",
        "totalCategories": "number",
        "lowStockProducts": [
            {
                "id": "uuid",
                "name": "string",
                "stock": "number",
                "category": "string"
            }
        ]
    },
    "paymentStats": [
        {
            "type": "string",
            "count": "number",
            "total": "number"
        }
    ]
}
```

### Get Sales Stats
- **URL**: `/dashboard/sales`
- **Method**: `GET`
- **Query Parameters**:
  - `startDate`: Required, format: YYYY-MM-DD
  - `endDate`: Required, format: YYYY-MM-DD
- **Response**:
```json
[
    {
        "date": "string",
        "totalSales": "number",
        "totalRevenue": "number"
    }
]
```

### Get Inventory Stats
- **URL**: `/dashboard/inventory`
- **Method**: `GET`
- **Response**:
```json
[
    {
        "categoryName": "string",
        "totalProducts": "number",
        "totalStock": "number",
        "lowStockProducts": "number"
    }
]
```

## Error Responses

### 400 Bad Request
```json
{
    "status": "fail",
    "message": "Error message describing the issue"
}
```

### 401 Unauthorized
```json
{
    "message": "Not authorized, no token"
}
```

### 403 Forbidden
```json
{
    "message": "Not authorized as admin"
}
```

### 404 Not Found
```json
{
    "status": "fail",
    "message": "Resource not found"
}
```

### 500 Server Error
```json
{
    "status": "error",
    "message": "Something went wrong"
}
```
