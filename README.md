# The Market

![Home Page](https://i.imgur.com/JUw5Kgj.png)  
_Product showcase and hero section_

![Product Details](https://i.imgur.com/0ppgHoN.png)  
_Product details with cart functionality_

![Admin Dashboard](https://i.imgur.com/CQwIuuK.png)  
_Administrative product and user dashboard_

## Admin Interface Highlights

| User Management                                     | Product Control                                        |
| --------------------------------------------------- | ------------------------------------------------------ |
| ![User Management](https://i.imgur.com/fFfWs1I.png) | ![Product Management](https://i.imgur.com/R8mYrXf.png) |
| _Admin user list with promotion controls_           | _Product inventory with stock tracking_                |

| User Profile                                  | Product Details                                  |
| --------------------------------------------- | ------------------------------------------------ |
| ![View User](https://i.imgur.com/TW9cUHs.png) | ![View Product](https://i.imgur.com/xWRmXzB.png) |
| _Detailed user profile view_                  | _Complete product specifications_                |

| User Editing                                  | Product Creation                                   |
| --------------------------------------------- | -------------------------------------------------- |
| ![Edit User](https://i.imgur.com/IkmJXON.png) | ![Create Product](https://i.imgur.com/zeRxQ3U.png) |
| _User profile modification interface_         | _New product submission form_                      |

## Overview

The Market is a full-stack e-commerce platform. Featuring user authentication, persistent shopping carts, and administration controls.

## Key Features

### User Experience

- Browse products with details view
- Secure registration/login system
- Persistent shopping cart
- Cart management (add/update/remove items)
- Checkout page

### Admin Features

- Full product CRUD operations
- User/Product management
- Inventory tracking
- Admin controls

### Technical Excellence

- JWT authentication
- PostgreSQL database
- Redux state management with RTK Query
- CSS Modules
- API security

## Tech Stack

**Frontend**  
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Redux](https://img.shields.io/badge/Redux_Toolkit-1.9.7-purple)
![React Router](https://img.shields.io/badge/React_Router-6.20.1-orange)

**Backend**  
![Express](https://img.shields.io/badge/Express-5.1.0-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.4-blue)
![JWT](https://img.shields.io/badge/JWT-9.0.2-yellow)

## API Endpoints

Base URL: `https://the-market-backend.onrender.com/api`

### Authentication

| Method | Endpoint         | Description       |
| ------ | ---------------- | ----------------- |
| POST   | `/auth/register` | User registration |
| POST   | `/auth/login`    | User login        |
| GET    | `/auth/me`       | Get current user  |

### Products

| Method | Endpoint        | Description        |
| ------ | --------------- | ------------------ |
| GET    | `/products`     | Get all products   |
| GET    | `/products/:id` | Get single product |

### Cart

| Method | Endpoint        | Description      |
| ------ | --------------- | ---------------- |
| GET    | `/cart`         | Get user cart    |
| POST   | `/cart`         | Add to cart      |
| PUT    | `/cart/:itemId` | Update cart item |
| DELETE | `/cart/:itemId` | Remove from cart |
| POST   | `/checkout`     | Process checkout |

### Admin Endpoints

| Method | Endpoint                 | Description      |
| ------ | ------------------------ | ---------------- |
| GET    | `/admin/users`           | List all users   |
| POST   | `/admin/products`        | Create product   |
| PUT    | `/admin/products/:id`    | Update product   |
| POST   | `/admin/users/:id/admin` | Promote to admin |

## Live Demo

[Frontend Deployment](https://the-market-app.netlify.app/) | [Backend API](https://the-market-backend.onrender.com/api/products)

### 🎥 Walkthrough Video

[![Watch the demo](https://i.imgur.com/UXi3I2Q.png)](https://www.loom.com/share/522cccc5fc324682bad8270982dcfe34?sid=6ca518cc-d29e-4945-a06c-6a817db22803)

## Contact

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue)](https://www.linkedin.com/in/elvis-espinoza/)  
✉️ elvis.espinoza.navarrete@outlook.com

## Acknowledgments

- Fullstack Academy Instructors
- Youtube
