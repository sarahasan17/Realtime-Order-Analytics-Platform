let revenueChart, statusChart, customerChart;

/* ============================= */
/* KPI + TABLE RENDERING */
/* ============================= */

function renderKPIs(data) {
  let totalOrders = data.length;
  let totalRevenue = 0;
  let shipped = 0;
  let failed = 0;

  data.forEach((order) => {
    totalRevenue += order.amount;
    if (order.status === "SHIPPED") shipped++;
    if (order.status === "FAILED") failed++;
  });

  document.getElementById("totalOrders").textContent = totalOrders;
  document.getElementById("totalRevenue").textContent =
    "₹" + totalRevenue.toFixed(2);
  const shippedEl = document.getElementById("shippedCount");
  const failedEl = document.getElementById("failedCount");

  if (shippedEl) shippedEl.textContent = shipped;
  if (failedEl) failedEl.textContent = failed;
}

function renderTable(data) {
  const table = document.getElementById("ordersTable");
  table.innerHTML = "";

  data.slice(0, 10).forEach((order) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${order.orderId}</td>
      <td>${order.customer}</td>
      <td>₹${order.amount}</td>
      <td>${order.status}</td>
      <td>${new Date(order.timestamp * 1000).toLocaleTimeString()}</td>
    `;

    table.appendChild(row);
  });
}

/* ============================= */
/* CHART LOGIC */
/* ============================= */

function processAnalytics(data) {
  let revenueOverTime = {};
  let statusCount = {};
  let customerCount = {};

  data.forEach((order) => {
    const time = new Date(order.timestamp * 1000).toLocaleTimeString();
    revenueOverTime[time] = (revenueOverTime[time] || 0) + order.amount;
    statusCount[order.status] = (statusCount[order.status] || 0) + 1;
    customerCount[order.customer] = (customerCount[order.customer] || 0) + 1;
  });

  updateCharts(revenueOverTime, statusCount, customerCount);
}

function updateCharts(revenueData, statusData, customerData) {
  if (revenueChart) revenueChart.destroy();
  if (statusChart) statusChart.destroy();
  if (customerChart) customerChart.destroy();

  revenueChart = new Chart(document.getElementById("revenueChart"), {
    type: "line",
    data: {
      labels: Object.keys(revenueData),
      datasets: [
        {
          label: "Revenue",
          data: Object.values(revenueData),
          borderWidth: 2,
          tension: 0.3,
        },
      ],
    },
  });

  statusChart = new Chart(document.getElementById("statusChart"), {
    type: "pie",
    data: {
      labels: Object.keys(statusData),
      datasets: [
        {
          data: Object.values(statusData),
        },
      ],
    },
  });

  customerChart = new Chart(document.getElementById("customerChart"), {
    type: "bar",
    data: {
      labels: Object.keys(customerData),
      datasets: [
        {
          label: "Orders",
          data: Object.values(customerData),
        },
      ],
    },
  });
}

/* ============================= */
/* LOAD DATA */
/* ============================= */

function loadData() {
  fetch("/orders")
    .then((res) => res.json())
    .then((data) => {
      renderKPIs(data);
      renderTable(data);
      processAnalytics(data);
    });
}

loadData();
setInterval(loadData, 10000);
