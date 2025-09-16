// js/properties.js
let currentUser = null;
let editingId = null;

// redirect non-auth users away from this page
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = 'login.html';
    return;
  }
  currentUser = user;
  // start the real-time listener after auth is known
  subscribeToProperties();
  populateOwnedFlag(); // optional helper if you want to do extra logic
});

const form = document.getElementById('propertyForm');
const submitBtn = document.getElementById('submitBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');

form.addEventListener('submit', e => {
  e.preventDefault();
  if (editingId) updateProperty(editingId);
  else createProperty();
});

cancelEditBtn.addEventListener('click', () => {
  resetForm();
});

function createProperty() {
  const doc = {
    title: document.getElementById('title').value.trim(),
    description: document.getElementById('description').value.trim(),
    location: {
      city: document.getElementById('city').value.trim(),
      state: document.getElementById('state').value.trim(),
      pincode: document.getElementById('pincode').value.trim()
    },
    price: Number(document.getElementById('price').value),
    type: document.getElementById('type').value,
    status: 'available',
    ownerUid: currentUser.uid,
    ownerName: currentUser.displayName || '',
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  db.collection('properties').add(doc)
    .then(() => {
      alert('Property added');
      form.reset();
    })
    .catch(err => alert('Error adding property: ' + err.message));
}

function subscribeToProperties() {
  // real-time listener for properties
  db.collection('properties')
    .orderBy('createdAt', 'desc')
    .onSnapshot(snapshot => {
      renderProperties(snapshot);
    }, err => {
      console.error('Listener error:', err);
    });
}

function renderProperties(snapshot) {
  const container = document.getElementById('propertiesList');
  container.innerHTML = '';

  snapshot.forEach(doc => {
    const p = doc.data();
    const id = doc.id;

    const item = document.createElement('div');
    item.className = 'property-item';
    item.innerHTML = `
      <h3>${escapeHtml(p.title || '')} 
         <small>(${escapeHtml(p.type || '')})</small>
      </h3>
      <p>${escapeHtml(p.description || '')}</p>
      <p>Location: ${escapeHtml(p.location?.city||'')}, ${escapeHtml(p.location?.state||'')} ${escapeHtml(p.location?.pincode||'')}</p>
      <p>Price: ${p.price}</p>
      <p>Status: ${escapeHtml(p.status || '')}</p>
      <p>Owner: ${escapeHtml(p.ownerName || p.ownerUid)}</p>
      <div class="actions"></div>
      <hr>
    `;

    const actions = item.querySelector('.actions');

    // show edit/delete only for owner
    if (currentUser && p.ownerUid === currentUser.uid) {
      const editBtn = document.createElement('button');
      editBtn.textContent = 'Edit';
      editBtn.onclick = () => startEditProperty(id);
      actions.appendChild(editBtn);

      const delBtn = document.createElement('button');
      delBtn.textContent = 'Delete';
      delBtn.onclick = () => deleteProperty(id);
      actions.appendChild(delBtn);
    }

    // link to property reports page
    const reportBtn = document.createElement('button');
    reportBtn.textContent = 'View / Add Reports';
    reportBtn.onclick = () => {
      // pass property id in URL for reports page
      window.location.href = `reports.html?propertyId=${id}`;
    };
    actions.appendChild(reportBtn);

    container.appendChild(item);
  });
}

function startEditProperty(id) {
  db.collection('properties').doc(id).get()
    .then(doc => {
      if (!doc.exists) throw new Error('Property not found');
      const p = doc.data();
      // ensure owner
      if (p.ownerUid !== currentUser.uid) return alert('Not allowed');

      editingId = id;
      document.getElementById('title').value = p.title || '';
      document.getElementById('description').value = p.description || '';
      document.getElementById('city').value = p.location?.city || '';
      document.getElementById('state').value = p.location?.state || '';
      document.getElementById('pincode').value = p.location?.pincode || '';
      document.getElementById('price').value = p.price || '';
      document.getElementById('type').value = p.type || 'sell';

      submitBtn.textContent = 'Update Property';
      cancelEditBtn.style.display = 'inline-block';
    })
    .catch(err => alert(err.message));
}

function updateProperty(id) {
  const update = {
    title: document.getElementById('title').value.trim(),
    description: document.getElementById('description').value.trim(),
    location: {
      city: document.getElementById('city').value.trim(),
      state: document.getElementById('state').value.trim(),
      pincode: document.getElementById('pincode').value.trim()
    },
    price: Number(document.getElementById('price').value),
    type: document.getElementById('type').value,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  // client checks owner before calling update (server rules enforce it)
  db.collection('properties').doc(id).get()
    .then(doc => {
      if (!doc.exists) throw new Error('Not found');
      if (doc.data().ownerUid !== currentUser.uid) throw new Error('Not allowed');
      return db.collection('properties').doc(id).update(update);
    })
    .then(() => {
      alert('Property updated');
      resetForm();
    })
    .catch(err => alert(err.message));
}

function deleteProperty(id) {
  if (!confirm('Delete this property?')) return;
  db.collection('properties').doc(id).get()
    .then(doc => {
      if (!doc.exists) throw new Error('Not found');
      if (doc.data().ownerUid !== currentUser.uid) throw new Error('Not allowed');
      return db.collection('properties').doc(id).delete();
    })
    .then(() => alert('Deleted'))
    .catch(err => alert(err.message));
}

function resetForm() {
  form.reset();
  editingId = null;
  submitBtn.textContent = 'Add Property';
  cancelEditBtn.style.display = 'none';
}

// tiny helper to avoid XSS in innerHTML when inserting user content
function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
}
