let revenueChart, statusChart, customerChart;

document.addEventListener("DOMContentLoaded", function () {
  async function fetchData() {
    try {
      const res = await fetch("/orders");
      const data = await res.json();
      updateDashboard(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  function updateDashboard(data) {
    if (!Array.isArray(data)) return;

    let totalOrders = data.length;
    let totalRevenue = 0;

    let revenueByTime = {};
    let statusCount = {};
    let customerCount = {};

    data.forEach((order) => {
      totalRevenue += order.amount;

      const date = new Date(order.timestamp).toLocaleDateString();
      revenueByTime[date] = (revenueByTime[date] || 0) + order.amount;

      statusCount[order.status] = (statusCount[order.status] || 0) + 1;
      customerCount[order.customer] = (customerCount[order.customer] || 0) + 1;
    });

    document.getElementById("totalOrders").innerText = totalOrders;
    document.getElementById("totalRevenue").innerText = totalRevenue;

    renderCharts(revenueByTime, statusCount, customerCount);
    renderTable(data);
  }

  function renderCharts(revenueByTime, statusCount, customerCount) {
    if (revenueChart) revenueChart.destroy();
    if (statusChart) statusChart.destroy();
    if (customerChart) customerChart.destroy();

    revenueChart = new Chart(document.getElementById("revenueChart"), {
      type: "line",
      data: {
        labels: Object.keys(revenueByTime),
        datasets: [
          {
            label: "Revenue",
            data: Object.values(revenueByTime),
            borderColor: "#38bdf8",
            fill: false,
          },
        ],
      },
    });

    statusChart = new Chart(document.getElementById("statusChart"), {
      type: "pie",
      data: {
        labels: Object.keys(statusCount),
        datasets: [
          {
            data: Object.values(statusCount),
          },
        ],
      },
    });

    customerChart = new Chart(document.getElementById("customerChart"), {
      type: "bar",
      data: {
        labels: Object.keys(customerCount),
        datasets: [
          {
            label: "Orders",
            data: Object.values(customerCount),
            backgroundColor: "#6366f1",
          },
        ],
      },
    });
  }

  function renderTable(data) {
    const tbody = document.getElementById("ordersTableBody");
    tbody.innerHTML = "";

    if (data.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4">No orders available</td>
        </tr>
      `;
      return;
    }

    data
      .slice(-10)
      .reverse()
      .forEach((order) => {
        const row = document.createElement("tr");

        row.innerHTML = `
        <td>${order.orderId}</td>
        <td>${order.customer}</td>
        <td>${order.amount}</td>
        <td>
          <span class="status ${order.status}">
            ${order.status}
          </span>
        </td>
      `;

        tbody.appendChild(row);
      });
  }

  function clearDashboard() {
    document.getElementById("totalOrders").innerText = 0;
    document.getElementById("totalRevenue").innerText = 0;

    if (revenueChart) revenueChart.destroy();
    if (statusChart) statusChart.destroy();
    if (customerChart) customerChart.destroy();

    document.getElementById("ordersTableBody").innerHTML = "";
  }

  document.getElementById("resetBtn").addEventListener("click", async () => {
    if (!confirm("Are you sure?")) return;

    await fetch("/reset", { method: "DELETE" });
    clearDashboard();
  });

  // Auto refresh every 10 seconds
  setInterval(fetchData, 10000);

  fetchData();
});
