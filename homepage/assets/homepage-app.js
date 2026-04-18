(function renderHomepage() {
  const curation = window.homepageCuration || {};
  const generated = window.homepageGeneratedData || {};
  const app = document.getElementById("app");

  if (!app) {
    return;
  }

  const lines = (curation.lines || []).map((line) => {
    const branchStats = generated.branchStats?.[line.id] || { doc_count: 0, visible_recent_count: 0 };
    const autoDocs = generated.docsByBranch?.[line.id] || [];
    return {
      ...line,
      branchStats,
      autoDocs,
    };
  });

  const repoRootUrl = new URL("../", window.location.href);
  const homepageUrl = new URL("./", window.location.href);
  const docsUrl = new URL("../docs/", window.location.href);
  const repoBasePath = repoRootUrl.pathname;
  const repoName = generated.repoName || "autodl_unplug_charger_transformer_fm";
  const totalVisibleDocs = generated.totalVisibleDocs || 0;
  const latestFixes = generated.latestFixes || [];
  const recentDocs = generated.recentDocs || [];

  app.innerHTML = `
    ${renderHero()}
    ${renderFeaturedLines()}
    ${renderLatestFixes()}
    ${renderRecentDocs()}
    ${renderMilestones()}
    ${renderDetails()}
    ${renderAssistantWorkflow()}
    ${renderMaintenance()}
  `;

  function renderHero() {
    const featuredMetrics = curation.hero?.featuredMetrics || [];
    return `
      <section class="hero-section">
        <div class="hero-copy">
          <p class="eyebrow">Personal Research Homepage / Docs Aggregator</p>
          <h1>${curation.hero?.title || ""}</h1>
          <p class="hero-subtitle">${curation.hero?.subtitle || ""}</p>
          <p class="hero-note">${curation.hero?.note || ""}</p>
          <div class="badge-row">
            ${(curation.hero?.badges || []).map((badge) => `<span class="badge-pill">${badge}</span>`).join("")}
          </div>
          <div class="hero-metric-grid">
            ${featuredMetrics
              .map(
                (metric) => `
                  <div class="hero-metric">
                    <span class="hero-stat-label">${metric.label}</span>
                    <strong class="hero-metric-value">${metric.value}</strong>
                  </div>
                `,
              )
              .join("")}
          </div>
        </div>
        <aside class="hero-rail">
          <div class="rail-panel">
            <p class="section-kicker">Launch Help</p>
            <h2>这次 404 的真正原因</h2>
            <p>你刚才是从 <code>~/MyProjects</code> 这样的父目录启动了 <code>http.server</code>，所以浏览器里直接访问 <code>/homepage/</code> 会 404。因为 <code>homepage/</code> 实际是在这个 repo 目录里面。</p>
            <div class="launch-list">
              <div class="launch-item">
                <span class="launch-label">当前项目根路径</span>
                <code>${repoBasePath}</code>
              </div>
              <div class="launch-item">
                <span class="launch-label">当前主页地址</span>
                <a href="${homepageUrl.href}">${homepageUrl.href}</a>
              </div>
              <div class="launch-item">
                <span class="launch-label">仓库根目录地址</span>
                <a href="${repoRootUrl.href}">${repoRootUrl.href}</a>
              </div>
              <div class="launch-item">
                <span class="launch-label">docs 地址</span>
                <a href="${docsUrl.href}">${docsUrl.href}</a>
              </div>
            </div>
          </div>
          <div class="rail-panel rail-panel-dark">
            <p class="section-kicker">Repo Snapshot</p>
            <h2>${repoName}</h2>
            <div class="hero-panel-grid">
              ${renderHeroStat("已发现 docs", String(totalVisibleDocs))}
              ${renderHeroStat("最近 fixes", String(latestFixes.length))}
              ${renderHeroStat("首页支线", String(lines.length))}
              ${renderHeroStat("自动抓取", "开启")}
            </div>
            <p class="hero-panel-caption">现在这条主页已经不是手写单页，而是“静态壳 + docs 自动抓取 + 人工精修摘要”的组合。</p>
          </div>
        </aside>
      </section>
    `;
  }

  function renderHeroStat(label, value) {
    return `
      <div class="hero-stat">
        <span class="hero-stat-label">${label}</span>
        <strong class="hero-stat-value">${value}</strong>
      </div>
    `;
  }

  function renderFeaturedLines() {
    return `
      <section class="section-block" id="featured-lines">
        <div class="section-head">
          <div>
            <p class="section-kicker">Featured Branches</p>
            <h2>先看四条最重要的入口线</h2>
          </div>
          <p class="section-desc">这里放的是你以后最常回来的四类内容：全局修复总账、稳定 anchor、当前主线研究和执行规范支线。</p>
        </div>
        <div class="card-grid">
          ${lines.map((line) => renderLineCard(line)).join("")}
        </div>
      </section>
    `;
  }

  function renderLineCard(line) {
    return `
      <a class="line-card" href="#line-${line.id}">
        <span class="line-card-accent"></span>
        <div class="line-card-top">
          <span class="line-badge">${line.badge}</span>
          <span class="line-status">${line.status}</span>
        </div>
        <h3>${line.title}</h3>
        <p class="line-summary">${line.summary}</p>
        <div class="line-meta-row">
          <span>${line.branchStats.doc_count} 个 docs 产物</span>
          <span>${line.branchStats.visible_recent_count} 个最近入口</span>
        </div>
        <div class="line-stats">
          ${line.stats
            .map(
              (stat) => `
                <div class="line-stat">
                  <span class="line-stat-label">${stat.label}</span>
                  <strong class="line-stat-value">${stat.value}</strong>
                </div>
              `,
            )
            .join("")}
        </div>
      </a>
    `;
  }

  function renderLatestFixes() {
    return `
      <section class="section-block" id="latest-fixes">
        <div class="section-head">
          <div>
            <p class="section-kicker">Latest Fixes</p>
            <h2>从 fixes.md 自动摘出来的最近修复流</h2>
          </div>
          <p class="section-desc">这部分是自动抓的，不需要你再手工重写。只要 fixes.md 继续按当前格式追加，主页就能一直更新最近发生了什么。</p>
        </div>
        <div class="fixes-grid">
          ${latestFixes
            .map(
              (entry) => `
                <a class="fix-card" href="${entry.href}">
                  <span class="timeline-date">${entry.date}</span>
                  <h3>${entry.title}</h3>
                  ${entry.run ? `<p class="fix-run">${entry.run}</p>` : ""}
                  ${entry.scope ? `<p class="fix-scope">${entry.scope}</p>` : ""}
                  <p>${entry.preview}</p>
                </a>
              `,
            )
            .join("")}
        </div>
      </section>
    `;
  }

  function renderRecentDocs() {
    return `
      <section class="section-block" id="recent-docs">
        <div class="section-head">
          <div>
            <p class="section-kicker">Recent Docs</p>
            <h2>最近更新的源材料</h2>
          </div>
          <p class="section-desc">这块会自动扫 docs，适合你快速回看最近哪些源文档刚变动，也适合我后续从这里继续帮你提炼成首页摘要。</p>
        </div>
        <div class="doc-grid">
          ${recentDocs
            .map(
              (doc) => `
                <a class="doc-card" href="${doc.href}">
                  <div class="doc-card-top">
                    <span class="doc-branch">${doc.branch}</span>
                    <span class="doc-modified">${doc.modified}</span>
                  </div>
                  <h3>${doc.title}</h3>
                  <p>${doc.preview}</p>
                </a>
              `,
            )
            .join("")}
        </div>
      </section>
    `;
  }

  function renderMilestones() {
    const milestones = curation.milestones || [];
    return `
      <section class="section-block">
        <div class="section-head">
          <div>
            <p class="section-kicker">Milestones</p>
            <h2>我建议你在主页里长期保留的几个折点</h2>
          </div>
          <p class="section-desc">比起把所有日志都堆在首页，留下少量里程碑更像一个成熟的个人研究主页。</p>
        </div>
        <div class="timeline-grid">
          ${milestones
            .map(
              (item) => `
                <a class="timeline-card" href="${item.href}">
                  <span class="timeline-date">${item.date}</span>
                  <span class="timeline-label">${item.label}</span>
                  <h3>${item.title}</h3>
                  <p>${item.desc}</p>
                </a>
              `,
            )
            .join("")}
        </div>
      </section>
    `;
  }

  function renderDetails() {
    return `
      <section class="section-block" id="detail-lines">
        <div class="section-head">
          <div>
            <p class="section-kicker">Branch Details</p>
            <h2>按支线展开的主页正文</h2>
          </div>
          <p class="section-desc">每条支线一边放人工提炼的主页语言，一边挂自动发现的源文档入口。这样后续你让我扩内容时，我就知道该往哪一块接。</p>
        </div>
        <div class="detail-stack">
          ${lines.map((line) => renderDetailPanel(line)).join("")}
        </div>
      </section>
    `;
  }

  function renderDetailPanel(line) {
    return `
      <article class="detail-panel" id="line-${line.id}">
        <div class="detail-copy">
          <div class="detail-head">
            <span class="line-badge">${line.badge}</span>
            <span class="detail-status">${line.status}</span>
          </div>
          <h3>${line.title}</h3>
          <p class="detail-summary">${line.summary}</p>
          <ul class="detail-list">
            ${line.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}
          </ul>
          <div class="next-step">
            <span class="next-step-label">Next</span>
            <p>${line.nextStep}</p>
          </div>
        </div>
        <aside class="detail-aside">
          <div class="doc-panel">
            <h4>精选入口</h4>
            <div class="doc-list">
              ${line.docs
                .map(
                  (doc) => `
                    <a class="doc-item" href="${doc.href}">
                      <strong>${doc.title}</strong>
                      <span>${doc.note}</span>
                    </a>
                  `,
                )
                .join("")}
            </div>
          </div>
          <div class="doc-panel">
            <h4>自动发现</h4>
            <div class="doc-list">
              ${line.autoDocs
                .slice(0, 4)
                .map(
                  (doc) => `
                    <a class="doc-item" href="${doc.href}">
                      <strong>${doc.title}</strong>
                      <span>${doc.preview}</span>
                    </a>
                  `,
                )
                .join("")}
            </div>
          </div>
        </aside>
      </article>
    `;
  }

  function renderAssistantWorkflow() {
    const workflow = curation.assistantWorkflow || {};
    return `
      <section class="section-block" id="assistant-workflow">
        <div class="section-head">
          <div>
            <p class="section-kicker">Assistant Workflow</p>
            <h2>${workflow.title || "助手工作流"}</h2>
          </div>
          <p class="section-desc">${workflow.intro || ""}</p>
        </div>
        <div class="workflow-grid">
          <div class="maintenance-panel">
            <h3>你可以直接给我的内容</h3>
            <ul class="detail-list">
              ${(workflow.acceptedInputs || []).map((item) => `<li>${item}</li>`).join("")}
            </ul>
          </div>
          <div class="maintenance-panel">
            <h3>我会怎么处理</h3>
            <div class="step-list">
              ${(workflow.steps || [])
                .map(
                  (step) => `
                    <article class="step-item">
                      <strong>${step.title}</strong>
                      <p>${step.desc}</p>
                    </article>
                  `,
                )
                .join("")}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function renderMaintenance() {
    const maintenance = curation.maintenance || {};
    return `
      <section class="section-block" id="maintenance">
        <div class="section-head">
          <div>
            <p class="section-kicker">Maintenance</p>
            <h2>这套主页现在该怎么维护</h2>
          </div>
          <p class="section-desc">视觉壳子基本固定了，后续主要维护 docs 和自动抓取产物，再由我帮你继续做精修展示。</p>
        </div>
        <div class="maintenance-grid">
          <div class="maintenance-panel">
            <h3>长期规则</h3>
            <ul class="detail-list">
              ${(maintenance.rules || []).map((rule) => `<li>${rule}</li>`).join("")}
            </ul>
          </div>
          <div class="maintenance-panel">
            <h3>推荐流程</h3>
            <div class="step-list">
              ${(maintenance.steps || [])
                .map(
                  (step) => `
                    <article class="step-item">
                      <strong>${step.title}</strong>
                      <p>${step.desc}</p>
                    </article>
                  `,
                )
                .join("")}
            </div>
          </div>
        </div>
      </section>
    `;
  }
})();
