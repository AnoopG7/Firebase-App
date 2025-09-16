import { 
  collection, doc, addDoc, setDoc, deleteDoc, getDocs, onSnapshot, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { auth, db } from "./firebase-config.js";

let currentUser = null;
let editingId = null;

const propertyForm = document.getElementById("propertyForm");
const propertiesList = document.getElementById("propertiesList");

// Auth check
onAuthStateChanged(auth, user => {
  if (!user) return window.location.href = "login.html";
  currentUser = user;
  subscribeProperties();
});

// Form submit
propertyForm.addEventListener("submit", async e => {
  e.preventDefault();
  const title = document.getElementById("propTitle").value.trim();
  const price = parseFloat(document.getElementById("propPrice").value);
  const description = document.getElementById("propDescription").value.trim();
  const category = document.getElementById("propCategory").value;

  if (!currentUser) return alert("You must be logged in");

  try {
    if (editingId) {
      // Update existing property
      await setDoc(doc(db, "properties", editingId), {
        title,
        price,
        description,
        category,
        ownerUid: currentUser.uid,
        updatedAt: serverTimestamp()
      }, { merge: true });
      editingId = null;
    } else {
      // Create new property
      await addDoc(collection(db, "properties"), {
        title,
        price,
        description,
        category,
        ownerUid: currentUser.uid,
        createdAt: serverTimestamp()
      });
    }

    propertyForm.reset();
  } catch (err) {
    alert("Error: " + err.message);
  }
});

// Subscribe to properties (real-time)
function subscribeProperties() {
  const collRef = collection(db, "properties");
  onSnapshot(collRef, snapshot => {
    renderProperties(snapshot);
  });
}

// Render all properties
function renderProperties(snapshot) {
  propertiesList.innerHTML = "";
  snapshot.forEach(docSnap => {
    const p = docSnap.data();
    const div = document.createElement("div");
    div.className = "property-item";
    div.innerHTML = `
      <h3>${escapeHtml(p.title)}</h3>
      <p>Price: ${p.price}</p>
      <p>Category: <b>${escapeHtml(p.category || "-")}</b></p>
      <p>${escapeHtml(p.description || "")}</p>
      <p>Owner UID: ${p.ownerUid}</p>
      ${currentUser.uid === p.ownerUid ? `
        <button onclick="editProperty('${docSnap.id}', '${escapeHtml(p.title)}', ${p.price}, '${escapeHtml(p.description || "")}', '${escapeHtml(p.category || "")}')">Edit</button>
        <button onclick="deleteProperty('${docSnap.id}')">Delete</button>
      ` : ""}
      <hr>
    `;
    propertiesList.appendChild(div);
  });
}

// Edit property
window.editProperty = function(id, title, price, description, category) {
  editingId = id;
  document.getElementById("propTitle").value = title;
  document.getElementById("propPrice").value = price;
  document.getElementById("propDescription").value = description;
  if (category) document.getElementById("propCategory").value = category;
}

// Delete property
window.deleteProperty = async function(id) {
  try {
    await deleteDoc(doc(db, "properties", id));
  } catch (err) {
    alert("Error: " + err.message);
  }
}

// Escape HTML
function escapeHtml(str) {
  if (!str) return "";
  return String(str).replace(/[&<>"']/g, s => ({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    '"':'&quot;',
    "'":'&#39;'
  }[s]));
}
