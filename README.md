# 🛒 Mercaprice - Mercadona Price Tracker

🚀 **Mercaprice** is a tool designed to track product prices from **Mercadona**, extracting data from their **sitemap** and **API**.  
The project stores product information and price history in a **PostgreSQL database**, using **Prisma ORM** for data management.

---

## 📌 Features

- 📥 **Automated product data extraction** from Mercadona's sitemap.
- 🔄 **Regular price updates** to track historical price changes.
- 🗑️ **Mark outdated products as deleted** if they are no longer in the sitemap or API.
- 🏬 **Warehouse data fetching** based on postal codes.

---

## 📜 Available Scripts

This project includes **three main scripts** located in the `scripts/` folder:

### 1️⃣ **Update Product Data**

📄 **File:** `scripts/loadDataFromSitemap.js`  
🔍 **Description:**  
This script reads the **Mercadona sitemap**, fetches product details from the API, and updates the database.

💾 **Stored Data:**

- Product details (name, image, reference format, etc.).
- Price information (unit price, bulk price).
- Price history for tracking price changes over time.

**Run the script:**

```bash
node scripts/loadDataFromSitemap.js
```

---

### 2️⃣ **Mark Products as Deleted**

📄 **File:** `scripts/markProductAsDeleted.js`  
🗑️ **Description:**  
This script **marks products as deleted** if:

- They are no longer present in the sitemap.
- The API request returns an error (e.g., `410 Gone`).

**Run the script:**

```bash
node scripts/markProductAsDeleted.js
```

---

### 3️⃣ **Update Warehouse Data**

📄 **File:** `scripts/updateWh.js`  
🏬 **Description:**  
This script **fetches all Mercadona warehouses** based on postal codes and stores them in a PostgreSQL table called `Warehouse`.

📍 **Data Sources:**

- Postal codes are stored in text files inside `/data/postalCodes/`.
- All fetched warehouses are saved in `/data/whs.json`.

**Run the script:**

```bash
node scripts/updateWh.js
```

---

## 💾 Database & Prisma Setup

This project uses **Prisma ORM** for database management.  
📌 **Steps to set up the database:**

1️⃣ **Install dependencies**

```bash
yarn install
```

2️⃣ **Set up PostgreSQL connection**  
Make sure you have a `.env` file with the database connection string:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mercaprice"
```

3️⃣ **Run Prisma migrations**

```bash
yarn prisma migrate dev
```

4️⃣ **Generate Prisma Client**

```bash
yarn prisma generate
```

---

## 📈 Price Tracking & API Integration

The project includes a **Next.js API** that allows searching for products and viewing price history.

### **Endpoints**

- 🔍 `/api/search?query=product_name` → Search for products by name.
- 📦 `/api/product/:id` → Get product details.
- 📊 `/api/prices/:id` → Get historical prices for a product.
- 🏬 `/api/proxy/:id` → Get original data from Mercadona

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Prisma ORM
- **Database:** PostgreSQL
- **Web Framework:** Next.js (for API endpoints)
- **Data Fetching:** SWR
- **Graphing Library:** Recharts (for price history visualization)

---

## 🏁 Getting Started

1️⃣ **Clone the repository**

```bash
git clone https://github.com/Miangame/mercaprice.git
cd mercaprice
```

2️⃣ **Install dependencies**

```bash
yarn install
```

3️⃣ **Run Prisma migrations**

```bash
yarn prisma migrate dev
```

4️⃣ **Start the development server**

```bash
yarn dev
```

---

## 📌 Future Improvements

- 🛒 **Real-time price monitoring**
- 📊 **More advanced price analytics**
- 📩 **Telegram notifications for price drops**
- 🍎 **Nutritional information and allergens**

🚀 **Happy tracking with Mercaprice!** 🛍️
