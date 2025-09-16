// dashboard-charts.js
// Uses Chart.js CDN for rendering charts
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { db } from "./firebase-config.js";

// Wait for DOM
window.addEventListener('DOMContentLoaded', async () => {
  await renderCharts();
});

async function renderCharts() {
  // Pie chart: Properties by type (sell/rent)
  const propSnapshot = await getDocs(collection(db, "properties"));
  let sell = 0, rent = 0;
  propSnapshot.forEach(doc => {
    const p = doc.data();
    if (p.type === 'sell') sell++;
    else if (p.type === 'rent') rent++;
  });
  const ctx1 = document.getElementById('chart-properties-type').getContext('2d');
  new window.Chart(ctx1, {
    type: 'pie',
    data: {
      labels: ['Sale', 'Rent'],
      datasets: [{
        data: [sell, rent],
        backgroundColor: ['#007bff', '#ffb300'],
      }]
    },
    options: {
      plugins: { legend: { position: 'bottom' } },
      responsive: true
    }
  });

  // Bar chart: Average price per property (top 5 by price)
  let props = [];
  propSnapshot.forEach(doc => {
    const p = doc.data();
    props.push({ title: p.title, price: p.price });
  });
  props = props.filter(p => typeof p.price === 'number').sort((a, b) => b.price - a.price).slice(0, 5);
  const ctx2 = document.getElementById('chart-properties-price').getContext('2d');
  new window.Chart(ctx2, {
    type: 'bar',
    data: {
      labels: props.map(p => p.title),
      datasets: [{
        label: 'Price',
        data: props.map(p => p.price),
        backgroundColor: '#007bff',
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      responsive: true,
      scales: { y: { beginAtZero: true } }
    }
  });
}
