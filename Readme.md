
# Firebase-App

**Firebase-App** is a modern web application for property price transparency and community-driven insights. Users can list properties for **rent** or **sale**, submit fair price reports, and view analytics in a global dashboard.

**Live Demo:** [https://class-6a3ae.web.app/](https://class-6a3ae.web.app/)

Link for the phases documentation - https://www.notion.so/MongoDB-Project-2763089cf316808aa8c6cffaaf19ded9?source=copy_link

---

## ✨ Key Features for Users

- **Sign Up & Login:**
  - Secure authentication with email and password (powered by Firebase Auth).

- **List Properties (Rent or Sale):**
  - Add new properties for rent or sale, including title, price, description, and category.
  - Instantly view all properties from the Firestore database.

- **Submit Community Reports:**
  - Share your opinion on fair price, trust score, and feedback for any property.
  - Edit or delete your own reports at any time.

- **Dashboard & Analytics:**
  - Visualize property distribution (rent vs sale) with interactive charts.
  - See top properties by price and aggregated fair price/trust metrics.
  - Get a quick overview of all listings and reports in one place.

- **Modern UI:**
  - Clean, responsive design with modular CSS for a seamless experience.

- **Firebase Hosting:**
  - Fast, secure, and always online.

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


## 📝 Notes

* Firestore stores:

  * **users** collection (auth & roles)
  * **properties** collection (listings, with category: rent or sale)
  * **reports** collection (reports tied to properties)


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
---

