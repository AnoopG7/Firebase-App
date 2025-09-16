// js/dashboard.js
import { 
  collection, doc, getDocs, onSnapshot, query, where 
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { auth, db } from "./firebase-config.js";

// Wait for DOMContentLoaded before accessing DOM elements
document.addEventListener('DOMContentLoaded', () => {
  onAuthStateChanged(auth, user => {
    if (!user) return window.location.href = "login.html";
    subscribeDashboard();
  });
});

// Real-time subscription to all properties
function subscribeDashboard() {
  const propertiesRef = collection(db, "properties");
  onSnapshot(propertiesRef, async snapshot => {
    await renderProperties(snapshot);
    await computeMetrics(snapshot);
  });
}

// Render all properties with reports summary
async function renderProperties(snapshot) {
  const container = document.getElementById("propertiesList");
  container.innerHTML = "";

  for (const docSnap of snapshot.docs) {
    const p = docSnap.data();

    // Fetch all reports for this property
    const reportsQuery = query(collection(db, "reports"), where("propertyId", "==", docSnap.id));
    const reportsSnapshot = await getDocs(reportsQuery);

    const totalReports = reportsSnapshot.size;
    let sumPrice = 0, sumTrust = 0;
    reportsSnapshot.forEach(r => {
      const d = r.data();
      sumPrice += (d.reportedPrice || 0);
      sumTrust += (d.trustScore || 0);
    });

    const avgPrice = totalReports ? (sumPrice / totalReports).toFixed(2) : "N/A";
    const avgTrust = totalReports ? (sumTrust / totalReports).toFixed(2) : "N/A";

    const div = document.createElement("div");
    div.className = "property-item";
    div.innerHTML = `
      <h3>${escapeHtml(p.title)}</h3>
      <p>Listed Price: ${p.price}</p>
      <p>Description: ${escapeHtml(p.description || "")}</p>
      <p>Total Reports: ${totalReports}</p>
      <p>Average Reported Price: ${avgPrice}</p>
      <p>Average Trust Score: ${avgTrust}</p>
      <hr>
    `;
    container.appendChild(div);
  }
}

// Compute overall metrics
async function computeMetrics(propertiesSnapshot) {
  let totalProperties = propertiesSnapshot.size;
  let totalReports = 0, sumPrice = 0, sumTrust = 0;

  for (const docSnap of propertiesSnapshot.docs) {
    const reportsQuery = query(collection(db, "reports"), where("propertyId", "==", docSnap.id));
    const reportsSnapshot = await getDocs(reportsQuery);

    totalReports += reportsSnapshot.size;
    reportsSnapshot.forEach(r => {
      const d = r.data();
      sumPrice += (d.reportedPrice || 0);
      sumTrust += (d.trustScore || 0);
    });
  }

  const avgPrice = totalReports ? (sumPrice / totalReports).toFixed(2) : "N/A";
  const avgTrust = totalReports ? (sumTrust / totalReports).toFixed(2) : "N/A";

  document.getElementById("totalProperties").innerText = `Total Properties: ${totalProperties}`;
  document.getElementById("totalReports").innerText = `Total Reports: ${totalReports}`;
  document.getElementById("avgPrice").innerText = `Average Price: ${avgPrice}`;
  document.getElementById("avgTrust").innerText = `Average Trust Score: ${avgTrust}`;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, s => ({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    '"':'&quot;',
    "'":'&#39;'
  }[s]));
}

// Logout helper
window.logout = async function() {
  await signOut(auth);
  window.location.href = "login.html";
}
