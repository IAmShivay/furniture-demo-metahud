# LuxeHouse Furniture Catalogue — Local Setup Guide
### (For Non-Technical Users — Just 5 Minutes)

This guide will help you run the furniture catalogue app on your own computer to view and test it. No coding knowledge needed.

---

### What You Need Before You Start

1. **Node.js** — This runs the app. Download it from https://nodejs.org (choose the **LTS** version) and install it. Click "Next" until finished.
2. **The Project Folder** — `furniture-catalogue` (you should already have it).
3. **Internet** — Needed the first time to download files.

> How to check if Node.js is installed?
> Press `Windows Key + R` -> type `cmd` -> press Enter -> type `node -v` -> if you see a version like `v20.11.0`, you're good.

---

### How to Run the App (3 Simple Steps)

#### STEP 1: Open the Project Folder in Terminal
- Go to the folder `furniture-catalogue`
- Click on the address bar at the top, type `cmd` and press **Enter**. A black window will open.

*OR* Right-click inside the folder -> "Open in Terminal"

#### STEP 2: Install Everything (Only the First Time)
In that black window, type this and press Enter:

```
npm install
```
Wait 1-2 minutes. It will download all required files. You only need to do this once.

#### STEP 3: Start the App
Now type:

```
npm run dev
```
Press **Enter**. Wait until you see:
```
✓ Ready in ... 
○ Local: http://localhost:3000
```

**That's it! The app is running.**

#### STEP 4: Open in Browser
Open Google Chrome and go to:

**http://localhost:3000**

You will see the LuxeHouse home page.

> **Already Configured:** The database and image settings (`.env.local`) are already set up for you. You don't need to change anything to test locally.

---

### How to Test the App

#### As a Customer (Shop View):
1. Go to `http://localhost:3000`
2. Browse products at `/products`
3. Click any product to see details

**Customer Login to Test:**
- Go to `http://localhost:3000/login`
- Email: `customer@luxehouse.in`
- Password: `customer123`

#### As an Admin (To Add/Edit Products):
1. Go to `http://localhost:3000/login`
2. Use Admin Login:
   - **Email:** `admin@luxehouse.in`
   - **Password:** `admin123`
3. After login, go to `http://localhost:3000/admin` to see the Dashboard
4. Go to `http://localhost:3000/admin/products` to Add, Edit or Delete products
5. You can upload product images directly — no other setup needed.

**Other Test Accounts:**
| Role | Email | Password | What they can see |
|------|-------|----------|-------------------|
| Admin | `admin@luxehouse.in` | `admin123` | Everything |
| Manager | `manager@luxehouse.in` | `manager123` | Can manage products |
| Support | `support@luxehouse.in` | `support123` | Can view dashboard |
| Customer | `customer@luxehouse.in` | `customer123` | Can shop only |

---

### How to Stop the App
Go back to the black window and press `Ctrl + C` on your keyboard. Press `Y` if it asks.

To run again next time, just open the terminal in the folder again and type `npm run dev`.

---

### If Something Goes Wrong

| Problem | What to Do |
|---------|------------|
| `npm install` shows an error | Make sure Node.js is installed. Close and re-open the terminal and try again. |
| `Port 3000 is already in use` | Close the other app using 3000, or run `npm run dev -- -p 3001` and open `http://localhost:3001` |
| Page shows "Database error" / products not loading | The internet might be off. Check connection. Or run once: `npm run db:seed` |
| Images not uploading in Admin | Internet required for Cloudinary. Check your connection. |
| Can't login | Check you typed the email/password exactly (all small letters). Try `admin@luxehouse.in` / `admin123` |

**Quick Reset (if data looks broken):**
Type this in the terminal:
```
npm run db:reset
```
This will reset and reload all 12 sample furniture products.

---

### Important Pages to Check

- Home: `http://localhost:3000/`
- All Products: `http://localhost:3000/products`
- Login: `http://localhost:3000/login`
- Create Account: `http://localhost:3000/register`
- My Account: `http://localhost:3000/account`
- Admin Dashboard: `http://localhost:3000/admin`
- Admin Products: `http://localhost:3000/admin/products`

---

**Done!** You don't need any paid tools or hosting. Everything runs on your own computer.
If you need help, just share a screenshot of the error you see in the black window.
