# Campus Marketplace API Test Collection

## Base URL
http://localhost:5000/api/products

## 1. CREATE - POST
POST /api/products

Test:
Create a new product.

Result:
Product created successfully.

## 2. READ - GET
GET /api/products

Result:
Products retrieved successfully.

## 3. UPDATE - PUT
PUT /api/products/:id

Result:
Product updated successfully.

## 4. DELETE - DELETE
DELETE /api/products/:id

Result:
Product deleted successfully.

## 5. SEARCH
GET /api/products?search=laptop

Result:
Laptop product returned successfully.

## 6. FILTER
GET /api/products?category=Electronics

Result:
Electronics products returned successfully.

## 7. SORT ASCENDING
GET /api/products?sort=price

Result:
Products returned according to price sorting.

## 8. SORT DESCENDING
GET /api/products?sort=-price

Result:
Products returned in descending price order.