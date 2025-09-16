# Firebase-App

A Firebase-powered web app for property price transparency.  
Users can list properties, submit community reports on fair pricing, and view aggregated trust metrics in a global dashboard.  

Live Demo → [https://class-6a3ae.web.app/](https://class-6a3ae.web.app/)

---

## ✨ Features

- **Authentication**
  - Email/password registration and login
  - Firebase Auth for session management
- **Property Listings**
  - Add new properties with title, price, and description
  - View property details dynamically from Firestore
- **Community Reports**
  - Submit reports with fair price, trust score, and feedback
  - Edit or delete your submitted reports
- **Aggregated Insights**
  - Average fair price per property
  - Average trust score per property
  - Global dashboard showing metrics across all properties
- **Dashboard**
  - Displays all properties and associated reports
  - Shows overall totals and averages for quick insights
- **Hosting**
  - Deployed on Firebase Hosting
  - Configured with Firestore + Auth + Hosting only (no Functions yet)

---

## 📂 Project Structure

```
├── 📁 .firebase/ 🚫 (auto-hidden)
├── 📁 .git/ 🚫 (auto-hidden)
├── 📁 .github/
│   └── 📁 workflows/
│       └── ⚙️ firebase-hosting-pull-request.yml
├── 📁 Documentation/
│   ├── 📖 Readme.md
│   └── 📝 Schema.md
├── 📁 project/
│   ├── 📁 css/
│   │   ├── 🎨 auth.css
│   │   ├── 🎨 dashboard.css
│   │   └── 🎨 styles.css
│   ├── 📁 js/
│   │   ├── 📄 auth.js
│   │   ├── 📄 dashboard.js
│   │   ├── 📄 firebase-config.js
│   │   ├── 📄 properties.js
│   │   └── 📄 reports.js
│   ├── 🌐 404.html
│   ├── 🌐 dashboard.html
│   ├── 🌐 index.html
│   ├── 🌐 login.html
│   ├── 🌐 properties.html
│   ├── 🌐 register.html
│   └── 🌐 reports.html
├── 📄 .firebaserc
├── 🚫 .gitignore
└── 📄 firebase.json
```



- **index.html** → Default landing page (Firebase requires this)  
- **dashboard.html** → Main dashboard showing properties & reports  
- **login/register** → Authentication pages  
- **properties.html** → Add & view properties  
- **reports.html** → Add & view reports  

---

## 🚀 Firebase Hosting Setup

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
````

2. Login to Firebase:

   ```bash
   firebase login
   ```

3. Initialize Hosting in the project directory:

   ```bash
   firebase init hosting
   ```

   * Public directory: `project`
   * Single Page App rewrite: No

4. Deploy to Firebase Hosting:

   ```bash
   firebase deploy --only hosting
   ```

---

## 🌐 Live Demo

👉 [https://class-6a3ae.web.app/](https://class-6a3ae.web.app/)

---

## 📝 Notes

* Firestore stores:

  * **users** collection (auth & roles)
  * **properties** collection (listings)
  * **reports** collection (reports tied to properties)
* Default entry point is `index.html`, but you can redirect `/` to `dashboard.html` by editing `firebase.json`:

```json
{
  "hosting": {
    "public": "project",
    "rewrites": [
      { "source": "/", "destination": "/dashboard.html" }
    ]
  }
}
```

Then redeploy with:

```bash
firebase deploy --only hosting
```

---

## ⚡ Quick Commands

* Start a new login → `firebase login`
* Deploy app → `firebase deploy --only hosting`
* Open Firebase Console → [Firebase Console](https://console.firebase.google.com/)

```

This version highlights **Auth, CRUD, Dashboard, Hosting** in a way that looks like a **portfolio-ready project**.  

Do you also want me to add **screenshots placeholders** (like `![Dashboard Screenshot](screenshots/dashboard.png)`) so you can later just drop images and make it more professional?

