<div align="center">

# 🔗 URL Shortener

A full-stack URL shortening service built with Node.js, Express, MongoDB, and a vanilla TypeScript/CSS frontend.

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

</div>

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [API Reference](#api-reference)
- [License](#license)

---

## About

URL Shortener is a lightweight web application that converts long URLs into short, shareable links. It consists of a RESTful backend API and a clean frontend interface — both living in the same monorepo.

---

## Features

- 🔗 Shorten any valid URL into a compact link
- 🔁 Redirect users from short link to original URL
- 📦 Persistent storage with MongoDB
- 🌐 Simple and responsive frontend interface
- ⚡ Fast and lightweight Express.js API

---

## Project Structure

```
url-shortener/
├── backend/          # Node.js + Express REST API
│   ├── src/
│   │   ├── routes/   # API route definitions
│   │   ├── models/   # Mongoose models
│   │   ├── controllers/
│   │   └── index.ts  # App entry point
│   └── package.json
│
├── frontend/         # Vanilla HTML/CSS/TypeScript UI
│   ├── src/
│   │   ├── index.html
│   │   ├── style.css
│   │   └── main.ts
│   └── package.json
│
└── README.md
```

---

## Tech Stack

| Layer    | Technology                    |
|----------|-------------------------------|
| Backend  | Node.js, Express.js           |
| Database | MongoDB (via Mongoose)        |
| Frontend | HTML, CSS, TypeScript         |
| Language | JavaScript / TypeScript       |

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (local or via [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### Installation

1. Clone the repository:

```bash
git clone https://github.com/joao-menezes/url-shortener.git
cd url-shortener
```

2. Install backend dependencies:

```bash
cd backend
npm install
```

3. frontend dependencies:

```bash
none
```

### Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/url-shortener
BASE_URL=http://localhost:3000
```

### Running the App

**Backend:**

```bash
cd backend
npm run dev
```

**Frontend:**

```bash
cd frontend
just run the html file
```

The API will be available at `http://localhost:3000` and the frontend at `http://localhost:5173` (or whichever port Vite assigns).

---

## API Reference

### `POST /api/shorten`

Shortens a given URL.

**Request body:**

```json
{
  "originalUrl": "https://www.example.com/some/very/long/url"
}
```

**Response:**

```json
{
  "shortUrl": "http://localhost:3000/abc123",
  "originalUrl": "https://www.example.com/some/very/long/url",
  "code": "abc123"
}
```

---

### `GET /:code`

Redirects to the original URL associated with the given short code.

**Example:**

```
GET http://localhost:3000/abc123
→ 302 Redirect to https://www.example.com/some/very/long/url
```

---

## License

This project is open-source and available under the [MIT License](LICENSE).

---

<div align="center">
Made by <a href="https://github.com/joao-menezes">João Menezes</a>
</div>
