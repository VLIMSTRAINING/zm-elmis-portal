// Shared footer markup, injected into <footer id="site-footer"> on every page.
document.addEventListener("DOMContentLoaded", () => {
  const footer = document.getElementById("site-footer");
  if (!footer) return;
  footer.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="brand" style="margin-bottom:14px;">
            <span class="brand-mark">eL</span>
            <span class="brand-text"><strong style="color:#fff;">eLMIS Zambia</strong><span style="color:rgba(255,255,255,.6);">Ministry of Health</span></span>
          </div>
          <p style="max-width:320px; font-size:14px;">Zambia's Electronic Logistics Management Information System, connecting central warehouses, hubs, facilities and community health workers on a single supply chain platform.</p>
        </div>
        <div>
          <h4>Platform</h4>
          <ul>
            <li><a href="about.html">About eLMIS</a></li>
            <li><a href="https://zm-elmis.org/public/pages/login.html" target="_blank" rel="noopener">Production Login</a></li>
            <li><a href="index.html#environments">Test / UAT Environment</a></li>
            <li><a href="analytics.html">Data &amp; Analytics</a></li>
          </ul>
        </div>
        <div>
          <h4>Resources</h4>
          <ul>
            <li><a href="news.html">News &amp; Releases</a></li>
            <li><a href="tools-guides.html#user-guides">User Guides</a></li>
            <li><a href="tools-guides.html#chw-app">CHW App Download</a></li>
            <li><a href="zelisa.html">Ask ZeLISA</a></li>
          </ul>
        </div>
        <div>
          <h4>Support</h4>
          <ul>
            <li><a href="zelisa.html">Chat with ZeLISA</a></li>
            <li><a href="mailto:support@zm-elmis.org">support@zm-elmis.org</a></li>
            <li><a href="tel:+260211000000">+260 211 000 000</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© <span data-year></span> eLMIS Zambia · Ministry of Health, Government of the Republic of Zambia</span>
        <span>Prototype build, not for production use</span>
      </div>
    </div>
  `;
  // re-run year fill for newly injected node
  footer.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());
});
