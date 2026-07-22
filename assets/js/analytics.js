// Drives the Data & Analytics dashboard: tab switching + Chart.js rendering from data/analytics.json

const CHART_COLORS = {
  teal: "#0b6e6e",
  tealLight: "#5fb3b3",
  orange: "#e2820f",
  green: "#178a4c",
  red: "#d7263d",
  amber: "#f4b400",
  gray: "#9aa8ae"
};

document.addEventListener("DOMContentLoaded", async () => {
  const data = await loadJSON("data/analytics.json");
  const rendered = {};

  // ---------- Tab switching ----------
  const tabs = document.querySelectorAll(".dash-tab");
  const panels = document.querySelectorAll(".dash-panel");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const name = tab.getAttribute("data-tab");
      panels.forEach((p) => {
        p.style.display = p.getAttribute("data-panel") === name ? "block" : "none";
      });
      renderPanel(name);
    });
  });

  function renderPanel(name) {
    if (rendered[name]) return;
    rendered[name] = true;
    if (name === "financing") renderFinancing(data.financing);
    if (name === "inventory") renderInventory(data.inventory);
    if (name === "distribution") renderDistribution(data.distribution);
    if (name === "quantification") renderQuantification(data.quantification);
    if (name === "performance") renderPerformance(data.performanceMonitoring);
    if (name === "alerts") renderAlerts(data.amcAlerts);
  }

  // Support deep-linking to a tab via URL hash, e.g. analytics.html#distribution
  const hashTab = location.hash.replace("#", "");
  const validTabs = Array.from(tabs).map((t) => t.getAttribute("data-tab"));
  const initialTab = validTabs.includes(hashTab) ? hashTab : "financing";

  if (initialTab !== "financing") {
    tabs.forEach((t) => t.classList.toggle("active", t.getAttribute("data-tab") === initialTab));
    panels.forEach((p) => {
      p.style.display = p.getAttribute("data-panel") === initialTab ? "block" : "none";
    });
  }
  renderPanel(initialTab); // default (or deep-linked) visible tab

  // ---------- Financing ----------
  function renderFinancing(f) {
    document.getElementById("financing-cards").innerHTML = f.cards.map(c => `
      <div class="kpi-box">
        <div class="kpi-value">${c.value}</div>
        <div class="kpi-label">${c.label}</div>
      </div>
    `).join("");

    new Chart(document.getElementById("chart-financing-donor"), {
      type: "doughnut",
      data: {
        labels: f.allocationByDonor.labels,
        datasets: [{ data: f.allocationByDonor.values, backgroundColor: [CHART_COLORS.teal, CHART_COLORS.amber, CHART_COLORS.tealLight] }]
      },
      options: { plugins: { legend: { position: "bottom" } } }
    });

    new Chart(document.getElementById("chart-financing-fund"), {
      type: "bar",
      data: {
        labels: f.fundAllocatedVsDisbursed.labels,
        datasets: [{ data: f.fundAllocatedVsDisbursed.values, backgroundColor: [CHART_COLORS.green, CHART_COLORS.orange], borderRadius: 6 }]
      },
      options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
    });
  }

  // ---------- Inventory ----------
  function renderInventory(inv) {
    new Chart(document.getElementById("chart-inventory-stocked"), {
      type: "bar",
      data: {
        labels: inv.stockedVsConsumed.labels,
        datasets: [
          { label: "Stocked", data: inv.stockedVsConsumed.stocked, backgroundColor: CHART_COLORS.tealLight, borderRadius: 4 },
          { label: "Consumed", data: inv.stockedVsConsumed.consumed, backgroundColor: CHART_COLORS.orange, borderRadius: 4 }
        ]
      },
      options: { plugins: { legend: { position: "bottom" } }, scales: { y: { beginAtZero: true } } }
    });

    new Chart(document.getElementById("chart-inventory-emergency"), {
      type: "line",
      data: {
        labels: inv.emergencyOrderTrend.labels,
        datasets: [{ label: "# of requisitions", data: inv.emergencyOrderTrend.values, borderColor: CHART_COLORS.teal, backgroundColor: "rgba(11,110,110,.1)", fill: true, tension: 0.35 }]
      },
      options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
    });

    const w = inv.wastage;
    document.getElementById("wastage-cards").innerHTML = `
      <div class="wastage-box expired"><span class="w-label">Expired</span><span class="w-value">${w.expired}%</span><div class="bar-track"><div class="bar-fill expired" style="width:${w.expired}%;"></div></div></div>
      <div class="wastage-box damaged"><span class="w-label">Damaged</span><span class="w-value">${w.damaged}%</span><div class="bar-track"><div class="bar-fill damaged" style="width:${w.damaged}%;"></div></div></div>
      <div class="wastage-box lost"><span class="w-label">Lost</span><span class="w-value">${w.lost}%</span><div class="bar-track"><div class="bar-fill lost" style="width:${w.lost}%;"></div></div></div>
    `;
  }

  // ---------- Distribution ----------
  function renderDistribution(d) {
    document.getElementById("distribution-kpis").innerHTML = `
      <div class="kpi-box good"><div class="kpi-value">${d.totalOrders.toLocaleString()}</div><div class="kpi-label">Total Orders</div></div>
      <div class="kpi-box danger"><div class="kpi-value">${d.incompleteOrders}</div><div class="kpi-label">Incomplete Orders</div></div>
      <div class="kpi-box"><div class="kpi-value">${d.avgDeliveryDays} Days</div><div class="kpi-label">Avg. Delivery Days</div></div>
      <div class="kpi-box warn"><div class="kpi-value">${d.delayedDeliveries}</div><div class="kpi-label">Delayed Deliveries</div></div>
    `;

    const statusClass = (s) => s === "Delivered on time" ? "ontime" : s === "Delivered Late" ? "late" : s === "Pending" ? "pending" : "notdelivered";

    document.querySelector("#orders-table tbody").innerHTML = d.orders.map(o => `
      <tr>
        <td>${o.id}</td><td>${o.defined}</td><td>${o.submitted}</td><td>${o.actual}</td>
        <td><span class="status-pill ${statusClass(o.status)}">${o.status}</span></td>
        <td>${o.turnaround}</td><td>${o.fillRate}</td>
      </tr>
    `).join("");
  }

  // ---------- Quantification ----------
  function renderQuantification(q) {
    new Chart(document.getElementById("chart-quant-forecast"), {
      type: "line",
      data: {
        labels: q.forecastAccuracy.labels,
        datasets: [{ label: "Forecast Accuracy (%)", data: q.forecastAccuracy.values, borderColor: CHART_COLORS.green, backgroundColor: "rgba(23,138,76,.1)", fill: true, tension: 0.4 }]
      },
      options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100 } } }
    });
  }

  // ---------- Performance Monitoring ----------
  function renderPerformance(p) {
    new Chart(document.getElementById("chart-perf-rr"), {
      type: "line",
      data: {
        labels: p.rrRejected.labels,
        datasets: [{ label: "% Rejected", data: p.rrRejected.values, borderColor: CHART_COLORS.tealLight, tension: 0.4 }]
      },
      options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100 } } }
    });

    new Chart(document.getElementById("chart-perf-timeliness"), {
      type: "line",
      data: {
        labels: p.reportTimeliness.labels,
        datasets: [{ label: "Reports Submitted", data: p.reportTimeliness.values, borderColor: CHART_COLORS.amber, tension: 0.4 }]
      },
      options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
    });

    document.getElementById("performance-kpis").innerHTML = `
      <div class="kpi-box"><div class="kpi-value">${p.totalFormsSubmitted}</div><div class="kpi-label">Total Forms Submitted</div></div>
      <div class="kpi-box good"><div class="kpi-value">${p.acceptedPct}%</div><div class="kpi-label">Accepted Forms</div></div>
      <div class="kpi-box danger"><div class="kpi-value">${p.rejectedPct}%</div><div class="kpi-label">Rejected Forms</div></div>
      <div class="kpi-box"><div class="kpi-value">${p.avgDelayThresholdDays} Days</div><div class="kpi-label">Avg. Delay Threshold</div></div>
    `;
  }

  // ---------- AMC Alerts ----------
  function renderAlerts(rows) {
    document.querySelector("#alerts-table tbody").innerHTML = rows.map(r => `
      <tr>
        <td>${r.code}</td><td>${r.product}</td><td>${r.unit}</td>
        <td>${r.beginning.toLocaleString()}</td><td>${r.received}</td><td>${r.consumed.toLocaleString()}</td>
        <td><span class="soh-cell ${r.level}">${r.soh.toLocaleString()}</span></td>
      </tr>
    `).join("");
  }
});
