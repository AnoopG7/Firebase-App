// js/reports.js
import { 
  collection, doc, addDoc, query, where, orderBy, onSnapshot, getDocs, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { auth, db } from "./firebase-config.js";

let currentUser = null;
const params = new URLSearchParams(window.location.search);
const propertyId = params.get('propertyId');

if (!propertyId) {
  document.body.innerHTML = '<p>No property selected. Go back and choose a property.</p>';
}

onAuthStateChanged(auth, user => {
  if (!user) return window.location.href = 'login.html';
  currentUser = user;
  loadPropertyInfo(propertyId);
  subscribeReports(propertyId);
  computeAggregates(propertyId);
});

const reportForm = document.getElementById('reportForm');
reportForm.addEventListener('submit', async e => {
  e.preventDefault();
  await createReport(propertyId);
});

async function loadPropertyInfo(pid) {
  try {
    const docSnap = await getDocs(doc(db, "properties", pid));
    const p = docSnap.data();
    if (!p) throw new Error('Property not found');
    document.getElementById('propertyInfo').innerHTML = `
      <h2>${escapeHtml(p.title)}</h2>
      <p>Listed price: ${p.price}</p>
      <p>${escapeHtml(p.description || '')}</p>
    `;
  } catch (err) {
    document.getElementById('propertyInfo').innerText = err.message;
  }
}

async function createReport(pid) {
  const rep = {
    propertyId: pid,
    userId: currentUser.uid,
    reportedPrice: Number(document.getElementById('reportedPrice').value),
    trustScore: Number(document.getElementById('trustScore').value),
    feedback: document.getElementById('feedback').value.trim(),
    createdAt: serverTimestamp()
  };

  try {
    await addDoc(collection(db, "reports"), rep);
    alert('Report submitted');
    reportForm.reset();
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

// Real-time updates
function subscribeReports(pid) {
  const q = query(
    collection(db, "reports"),
    where('propertyId', '==', pid),
    orderBy('createdAt', 'desc')
  );

  onSnapshot(q, snapshot => {
    renderReports(snapshot);
    computeAggregates(pid);
  });
}

function renderReports(snapshot) {
  const container = document.getElementById('reportsList');
  container.innerHTML = '';
  snapshot.forEach(docSnap => {
    const r = docSnap.data();
    const div = document.createElement('div');
    div.className = 'report-item';
    div.innerHTML = `
      <p>Price: ${r.reportedPrice} | Trust: ${r.trustScore}</p>
      <p>${escapeHtml(r.feedback || '')}</p>
      <p>By: ${escapeHtml(r.userId)}</p>
      <hr>
    `;
    container.appendChild(div);
  });
}

async function computeAggregates(pid) {
  const q = query(
    collection(db, "reports"),
    where('propertyId', '==', pid)
  );

  const snapshot = await getDocs(q);
  let sumPrice = 0, sumScore = 0, count = 0;

  snapshot.forEach(docSnap => {
    const d = docSnap.data();
    sumPrice += (d.reportedPrice || 0);
    sumScore += (d.trustScore || 0);
    count++;
  });

  const avgPrice = count ? (sumPrice / count).toFixed(2) : 'N/A';
  const avgScore = count ? (sumScore / count).toFixed(2) : 'N/A';

  document.getElementById('aggregates').innerHTML = `
    <p>Reports: ${count}</p>
    <p>Average community fair price: ${avgPrice}</p>
    <p>Average trust score: ${avgScore}</p>
  `;
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
