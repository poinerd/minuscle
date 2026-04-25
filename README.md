# 🔗 URL Shortener API

A simple and efficient backend service that shortens long URLs and redirects users using unique short codes.

Built as a backend-focused project to demonstrate core concepts in API design, database integration, and routing.

---

## 🚀 Features

* Generate short URLs from long links
* Redirect users using short codes
* PostgreSQL database for persistent storage
* RESTful API built with Express
* Simple and clean architecture

---

## 🧱 Tech Stack

* **Node.js**
* **Express.js**
* **PostgreSQL**
* **pg (node-postgres)**

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/url-shortener.git
cd url-shortener
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgres://username:password@localhost:5432/yourdb
BASE_URL=http://localhost:3000
```

---

### 4. Run the server

```bash
node app.js
```

Server will start on:

```
http://localhost:3000
```

---

## 📡 API Endpoints

### 🔹 Create Short URL

**POST** `/shorten`

#### Request Body:

```json
{
  "url": "https://example.com"
}
```

#### Response:

```json
{
  "shortUrl": "http://localhost:3000/abc123",
  "data": {
    "id": 1,
    "original_url": "https://example.com",
    "short_code": "abc123",
    "created_at": "timestamp"
  }
}
```

---

### 🔹 Redirect to Original URL

**GET** `/:shortCode`

Example:

```
http://localhost:3000/abc123
```

➡️ Redirects to:

```
https://example.com
```

---

## 🗄️ Database Schema

Table: `links`

| Column       | Type      | Description             |
| ------------ | --------- | ----------------------- |
| id           | SERIAL    | Primary key             |
| original_url | TEXT      | The original long URL   |
| short_code   | TEXT      | Unique short identifier |
| created_at   | TIMESTAMP | Time of creation        |

---

## 🧠 How It Works

1. A user submits a long URL via the `/shorten` endpoint
2. The server generates a unique short code
3. The URL and code are stored in PostgreSQL
4. When the short URL is accessed:

   * The server looks up the original URL
   * Redirects the user to the destination

---

## 🔮 Future Improvements

* 📊 Click tracking (analytics)
* 🔗 Custom short URLs (aliases)
* ⏱ Expiration dates for links
* ⚡ Caching with Redis
* 🔐 Rate limiting & security enhancements
* 🌍 Deployment with custom domain

---

## 🧪 Example Use Case

```bash
POST /shorten
→ returns http://localhost:3000/xyz789

GET /xyz789
→ redirects to original URL
```

---

## 📁 Project Structure

```
.
├── app.js
├── routes.js
├── controllers.js
├── db.js
├── .env
├── .gitignore
└── README.md
```

---

## ⚠️ Important Notes

* Ensure your PostgreSQL server is running before starting the app
* Do not commit your `.env` file (it contains sensitive data)
* Always normalize URLs (include `http://` or `https://`)

---

## 👨‍💻 Author

Built by Emmanuel Obadofin as part of backend engineering practice and system design learning.

---

## ⭐ Acknowledgment

This project is part of a journey toward mastering backend engineering, systems design, and building production-ready applications.
