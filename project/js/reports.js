// js/reports.js
import { 
  collection, doc, addDoc, setDoc, deleteDoc, query, where, orderBy, onSnapshot, getDocs, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { auth, db } from "./firebase-config.js";

let currentUser = null;
let editingId = null; // Track report being edited

const params = new URLSearchParams(window.location.search);
let propertyId = params.get('propertyId');

onAuthStateChanged(auth, user => {
  if (!user) return window.location.href = 'login.html';
  currentUser = user;
  loadAllProperties();
  if (propertyId) {
    showPropertySection(propertyId);
  } else {
    document.getElementById('propertyInfo').innerHTML = '<p>Select a property to view or add reports.</p>';
    document.getElementById('reportForm').style.display = 'none';
    document.getElementById('reportsList').innerHTML = '';
    document.getElementById('aggregates').innerHTML = '';
  }
});

const reportForm = document.getElementById('reportForm');
reportForm.addEventListener('submit', async e => {
  e.preventDefault();
  await saveReport(propertyId);
});

function showPropertySection(pid) {
  propertyId = pid;
  loadPropertyInfo(pid);
  subscribeReports(pid);
  computeAggregates(pid);
  document.getElementById('reportForm').style.display = '';
}

async function loadAllProperties() {
  const propertiesList = document.getElementById('propertiesList');
  propertiesList.innerHTML = '<li>Loading...</li>';
  try {
    const snapshot = await getDocs(collection(db, 'properties'));
    propertiesList.innerHTML = '';
    snapshot.forEach(docSnap => {
      const p = docSnap.data();
      const li = document.createElement('li');
      li.innerHTML = `<a href="#" data-id="${docSnap.id}">${escapeHtml(p.title)} (${p.price})</a>`;
      li.querySelector('a').onclick = (e) => {
        e.preventDefault();
        showPropertySection(docSnap.id);
      };
      propertiesList.appendChild(li);
    });
  } catch (err) {
    propertiesList.innerHTML = '<li>Error loading properties</li>';
  }
}

import { getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
async function loadPropertyInfo(pid) {
  try {
    const docSnap = await getDoc(doc(db, "properties", pid));
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

async function saveReport(pid) {
  const rep = {
    propertyId: pid,
    userId: currentUser.uid,
    reportedPrice: Number(document.getElementById('reportedPrice').value),
    trustScore: Number(document.getElementById('trustScore').value),
    feedback: document.getElementById('feedback').value.trim(),
    createdAt: serverTimestamp()
  };

  try {
    if (editingId) {
      // Update existing report
      await setDoc(doc(db, "reports", editingId), rep, { merge: true });
      editingId = null;
    } else {
      // Add new report
      await addDoc(collection(db, "reports"), rep);
    }
    reportForm.reset();
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

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
      ${r.userId === currentUser.uid ? `
        <button onclick="editReport('${docSnap.id}', ${r.reportedPrice}, ${r.trustScore}, '${escapeHtml(r.feedback || '')}')">Edit</button>
        <button onclick="deleteReport('${docSnap.id}')">Delete</button>
      ` : ""}
      <hr>
    `;
    container.appendChild(div);
  });
}

// Edit report
window.editReport = function(id, price, score, feedback) {
  editingId = id;
  document.getElementById('reportedPrice').value = price;
  document.getElementById('trustScore').value = score;
  document.getElementById('feedback').value = feedback;
}

// Delete report
window.deleteReport = async function(id) {
  if (!confirm('Are you sure you want to delete this report?')) return;
  try {
    await deleteDoc(doc(db, "reports", id));
  } catch (err) {
    alert('Error: ' + err.message);
  }
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
