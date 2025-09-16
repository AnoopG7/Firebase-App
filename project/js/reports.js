// js/reports.js
let currentUser = null;
const params = new URLSearchParams(window.location.search);
const propertyId = params.get('propertyId');

if (!propertyId) {
  document.body.innerHTML = '<p>No property selected. Go back and choose a property.</p>';
}

// ensure auth
auth.onAuthStateChanged(user => {
  if (!user) return window.location.href = 'login.html';
  currentUser = user;
  loadPropertyInfo(propertyId);
  subscribeReports(propertyId);
  computeAggregates(propertyId);
});

const reportForm = document.getElementById('reportForm');
reportForm.addEventListener('submit', e => {
  e.preventDefault();
  createReport(propertyId);
});

function loadPropertyInfo(pid) {
  db.collection('properties').doc(pid).get()
    .then(doc => {
      if (!doc.exists) throw new Error('Property not found');
      const p = doc.data();
      document.getElementById('propertyInfo').innerHTML = `<h2>${escapeHtml(p.title)}</h2>
        <p>Listed price: ${p.price}</p>
        <p>${escapeHtml(p.description || '')}</p>`;
    })
    .catch(err => document.getElementById('propertyInfo').innerText = err.message);
}

function createReport(pid) {
  const rep = {
    propertyId: pid,
    userId: currentUser.uid,
    reportedPrice: Number(document.getElementById('reportedPrice').value),
    trustScore: Number(document.getElementById('trustScore').value),
    feedback: document.getElementById('feedback').value.trim(),
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  db.collection('reports').add(rep)
    .then(() => {
      alert('Report submitted');
      reportForm.reset();
      computeAggregates(pid); // recompute on submit
    })
    .catch(err => alert('Error: ' + err.message));
}

function subscribeReports(pid) {
  db.collection('reports')
    .where('propertyId', '==', pid)
    .orderBy('createdAt', 'desc')
    .onSnapshot(snapshot => {
      renderReports(snapshot);
      computeAggregates(pid);
    });
}

function renderReports(snapshot) {
  const container = document.getElementById('reportsList');
  container.innerHTML = '';
  snapshot.forEach(doc => {
    const r = doc.data();
    const div = document.createElement('div');
    div.className = 'report-item';
    div.innerHTML = `<p>Price: ${r.reportedPrice} | Trust: ${r.trustScore}</p>
      <p>${escapeHtml(r.feedback || '')}</p>
      <p>By: ${escapeHtml(r.userId)}</p>
      <hr>`;
    container.appendChild(div);
  });
}

function computeAggregates(pid) {
  db.collection('reports').where('propertyId', '==', pid).get()
    .then(qs => {
      let sumPrice = 0, sumScore = 0, count = 0;
      qs.forEach(doc => {
        const d = doc.data();
        sumPrice += (d.reportedPrice || 0);
        sumScore += (d.trustScore || 0);
        count++;
      });
      const avgPrice = count ? (sumPrice / count).toFixed(2) : 'N/A';
      const avgScore = count ? (sumScore / count).toFixed(2) : 'N/A';
      document.getElementById('aggregates').innerHTML =
        `<p>Reports: ${count}</p>
         <p>Average community fair price: ${avgPrice}</p>
         <p>Average trust score: ${avgScore}</p>`;
    });
}

// reuse escapeHtml from properties.js or copy it here
function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
}
