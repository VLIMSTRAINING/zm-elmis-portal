// ZeLISA — mock rule-based chat assistant. No real backend; keyword-matched canned responses
// for prototyping. Swap `respondTo()` for a real API call when wiring up a production agent.

const ZELISA_RULES = [
  {
    keywords: ["stock", "amiloride", "on hand", "soh", "how much", "quantity"],
    reply: `Based on the latest R&amp;R submission for <strong>Chingola DHO</strong>, Amiloride + Hydrochlorothiazide 5mg/50mg is showing <strong>0 units</strong> on hand with an AMC alert flag. I'd recommend raising an emergency order or checking with the district pharmacist.
      <ul><li>Product code: EM0126</li><li>Status: Below minimum</li><li>Recommended action: Emergency requisition</li></ul>
      <span class="msg-meta">Source: eLMIS Central Edition — Requisition &amp; Reporting (sample data)</span>`
  },
  {
    keywords: ["order", "05457", "05454", "05455", "delivery", "delivered", "shipment", "lead time"],
    reply: `Order <strong>#05457</strong> was submitted on 05 Jan 2026 but shows as <strong>Delivered Late</strong> — actual delivery was 05 Feb 2026, a turnaround of about 1 month. Fill rate for this order was 60%.
      <br><br>You can see full order-level detail on the <a href="analytics.html#distribution">Distribution tab of the Analytics dashboard</a>.`
  },
  {
    keywords: ["password", "reset", "login", "log in", "account", "locked out", "access"],
    reply: `To reset your eLMIS password:
      <ol style="margin:8px 0 0 18px; padding:0;">
        <li>Go to the <a href="https://zm-elmis.org/public/pages/login.html" target="_blank" rel="noopener">Production login page</a></li>
        <li>Click "Forgot password?" below the sign-in form</li>
        <li>Enter your registered username and follow the emailed reset link</li>
      </ol>
      If you don't have access to the registered email, contact your District/Facility eLMIS focal point or log a ticket with the help desk.`
  },
  {
    keywords: ["chw", "mobile app", "download", "apk", "satellite", "community health worker"],
    reply: `The CHW / Satellite Site mobile app (current version <strong>v3.1</strong>, Android, 38 MB) is available on the <a href="tools-guides.html#chw-app">Tools &amp; Guides page</a>, including step-by-step install instructions.`
  },
  {
    keywords: ["rejected", "r&r", "rr", "requisition", "reporting form", "why was"],
    reply: `R&amp;R forms are most commonly rejected for: quantities requested far above the usual AMC without justification, missing signatures/approvals, or submission after the reporting window closes.
      <br><br>Currently <strong>45%</strong> of forms nationally are being rejected — see the <a href="analytics.html#performance">Performance Monitoring tab</a> for a breakdown by province.`
  },
  {
    keywords: ["ticket", "support", "help desk", "issue", "problem", "complaint", "bug"],
    reply: `You can log a support ticket by emailing <a href="mailto:support@zm-elmis.org">support@zm-elmis.org</a> or calling <strong>+260 211 000 000</strong>. Please include your facility code, the module affected, and a screenshot if possible so the team can triage quickly.`
  },
  {
    keywords: ["central edition", "facility edition", "difference", "which one", "ce vs fe", "two editions"],
    reply: `<strong>Facility Edition</strong> is deployed in 1,710 health facilities across Zambia for day-to-day storeroom management, consumption recording, lab equipment monitoring, electronic dispensing, and generating requisitions (R&R).
      <br><br><strong>Central/Web Edition</strong> provides nationwide oversight — aggregating data from every Facility Edition site, integrating with the Warehouse Management System (WMS) and national EHR via APIs, and supporting national procurement planning with role-based access for all stakeholder levels.`
  },
  {
    keywords: ["forecast", "quantification", "accuracy"],
    reply: `Forecast accuracy varies by product and month — see the <a href="analytics.html#quantification">Quantification tab</a> for the full trend line. Large swings usually indicate a need to revisit consumption assumptions during the next quantification cycle. The <strong>QAT Tool</strong> is also used alongside eLMIS for country-led forecasting and supply planning — see <a href="tools-guides.html#tools">Tools &amp; Guides</a>.`
  },
  {
    keywords: ["six rights", "core objective", "fundamental objective", "right quantities", "right commodities"],
    reply: `Every feature of eLMIS is built around the <strong>Six Rights</strong> of logistics:
      <ul>
        <li>Right Quantities — correct stock levels at all times</li>
        <li>Right Commodities — the specific products patients need</li>
        <li>Right Condition — stored and transported to maintain quality</li>
        <li>Right Place — reaching the facility where it's needed</li>
        <li>Right Time — arriving before stock is depleted</li>
        <li>Right Cost — an efficient supply chain that minimizes waste</li>
      </ul>
      See the full breakdown on the <a href="about.html">About page</a>.`
  },
  {
    keywords: ["r&r flow", "approval", "requisition flow", "zammsa", "cmst", "bollor", "who approves", "warehouse"],
    reply: `The R&amp;R approval cycle runs in six stages:
      <ol style="margin:8px 0 0 18px; padding:0;">
        <li>Health Facilities create, submit &amp; authorize R&amp;Rs</li>
        <li>District Health Office — 1st-level review &amp; approval</li>
        <li>ZAMMSA/CMST — 2nd-level approval; converts R&amp;Rs into orders</li>
        <li>CMST/Bolloré — receive, inspect, store &amp; prepare dispatch</li>
        <li>Delivery to DHO/Hospital</li>
        <li>Delivery to Facilities</li>
      </ol>
      ZAMMSA (successor to Medical Stores Limited) is the operational lead for national warehousing and distribution.`
  },
  {
    keywords: ["mos", "months of stock", "amc", "average monthly consumption", "emergency order point", "eop"],
    reply: `<strong>Months of Stock (MOS)</strong> standardizes inventory levels — typically targeting 3.0 MOS (up to 4.0 MOS for Essential Medicines at health centres). Two alerts trigger action: falling below <strong>0.5 MOS</strong> (Emergency Order Point) or exceeding the maximum by more than a month.
      <br><br><strong>Average Monthly Consumption (AMC)</strong> is the basis for order quantities — Central Edition flags R&amp;R lines where the quantity requested is over the usual AMC. See the <a href="analytics.html#alerts">AMC Alerts tab</a>.`
  },
  {
    keywords: ["governance", "who owns", "who runs", "steering committee", "change control", "moh"],
    reply: `eLMIS governance is layered for accountability:
      <ul>
        <li><strong>Ministry of Health</strong> — System Owner and Policy Authority</li>
        <li><strong>ZAMMSA</strong> — Operational Lead for warehousing and distribution</li>
        <li><strong>Operational Steering Committee</strong> — strategic oversight</li>
        <li><strong>Change Control Board</strong> — structured review of system changes</li>
      </ul>`
  },
  {
    keywords: ["history", "background", "what is elmis", "openlmis", "where did elmis come from", "origin"],
    reply: `eLMIS grew out of a global collaboration: the 2006 Rockefeller Foundation e-Health Summit, the 2008 Common Requirements for LMIS, and the 2010 creation of <strong>OpenLMIS</strong> by VillageReach, JSI, PATH and the Rockefeller Foundation. Zambia and Tanzania partnered from 2011 to build a shared eLMIS vision, addressing challenges like 2,000+ unaggregated paper reports a month, chronic stockouts, and arithmetic errors in manual reporting. Read the full story on the <a href="about.html">About page</a>.`
  },
  {
    keywords: ["kpi", "performance framework", "reporting rate", "stock-out rate", "order fill rate", "order cycle time", "expiry rate"],
    reply: `eLMIS tracks six core performance indicators nationally: <strong>Reporting Rate, Stock-Out Rate, Order Fill Rate, Order Cycle Time, Expiry Rate,</strong> and <strong>Average Months of Stock</strong>. These are reviewed routinely to drive accountability at every level — see the <a href="analytics.html#performance">Performance Monitoring tab</a>.`
  },
  {
    keywords: ["hello", "hi", "hey", "morning", "afternoon"],
    reply: `Hello! I'm ZeLISA. You can ask me about stock levels, order status, requisitions, login help, the Six Rights, R&R approval flow, or where to find eLMIS resources.`
  },
  {
    keywords: ["thank", "thanks", "cheers"],
    reply: `You're welcome! Let me know if there's anything else about eLMIS logistics or supply chain you'd like help with.`
  }
];

const FALLBACK_REPLY = `I don't have a specific answer for that yet in this prototype. For real-time support, please contact the eLMIS help desk at <a href="mailto:support@zm-elmis.org">support@zm-elmis.org</a>, or try rephrasing — I can help with stock levels, orders, requisitions, login issues, and system guidance.`;

function respondTo(text) {
  const q = text.toLowerCase();
  for (const rule of ZELISA_RULES) {
    if (rule.keywords.some((k) => q.includes(k))) return rule.reply;
  }
  return FALLBACK_REPLY;
}

document.addEventListener("DOMContentLoaded", () => {
  const messages = document.getElementById("chat-messages");
  const form = document.getElementById("chat-form");
  const input = document.getElementById("chat-input");

  function scrollToBottom() {
    messages.scrollTop = messages.scrollHeight;
  }

  function addMessage(html, sender) {
    const div = document.createElement("div");
    div.className = "msg " + sender;
    div.innerHTML = html;
    messages.appendChild(div);
    scrollToBottom();
    return div;
  }

  function showTyping() {
    const div = document.createElement("div");
    div.className = "msg bot";
    div.id = "typing-indicator";
    div.innerHTML = `<span class="typing-dots"><span></span><span></span><span></span></span>`;
    messages.appendChild(div);
    scrollToBottom();
  }

  function removeTyping() {
    const el = document.getElementById("typing-indicator");
    if (el) el.remove();
  }

  function sendMessage(text) {
    if (!text.trim()) return;
    addMessage(escapeHtml(text), "user");
    input.value = "";
    showTyping();
    const delay = 500 + Math.random() * 700;
    setTimeout(() => {
      removeTyping();
      addMessage(respondTo(text), "bot");
    }, delay);
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    sendMessage(input.value);
  });

  document.querySelectorAll(".suggestion-chip").forEach((chip) => {
    chip.addEventListener("click", () => sendMessage(chip.getAttribute("data-q")));
  });
});
