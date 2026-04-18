(function renderHomepage() {
  const data = window.homepageData;
  const pageMeta = window.homepagePageMeta || { type: "home" };
  const app = document.getElementById("app");

  if (!data || !app) {
    return;
  }

  const repoBase = getRepoBase();
  const tasks = data.tasks || [];
  const branches = data.branches || [];
  const charts = data.charts || {};
  const home = data.home || {};
  const timelinePageGroups = data.timeline_page_groups || [];
  const showcaseItems = data.showcase?.items || [];
  const fixHighlights = data.fix_highlights || [];

  const taskMap = new Map(tasks.map((task) => [task.id, task]));
  const branchMap = new Map(branches.map((branch) => [branch.id, branch]));

  app.innerHTML = `
    <div class="page-bg" aria-hidden="true"></div>
    ${renderTopbar()}
    <main class="page-shell">${renderCurrentPage()}</main>
    ${renderFooter()}
  `;

  bindChartTooltips();

  function renderCurrentPage() {
    if (pageMeta.type === "task") {
      const task = taskMap.get(pageMeta.id);
      return task ? renderTaskPage(task) : renderNotFound("任务不存在");
    }
    if (pageMeta.type === "branch") {
      const branch = branchMap.get(pageMeta.id);
      return branch ? renderBranchPage(branch) : renderNotFound("研究线不存在");
    }
    if (pageMeta.type === "timeline") {
      return renderTimelinePage();
    }
    if (pageMeta.type === "showcase") {
      return renderShowcasePage();
    }
    return renderHomePage();
  }

  function renderTopbar() {
    return `
      <header class="topbar">
        <a class="brand" href="${pathUrl("homepage/")}">
          <span class="brand-kicker">Research Desk</span>
          <strong>${escapeHtml(data.site.title)}</strong>
        </a>
        <nav class="topnav" aria-label="主导航">
          <a href="${navHref("#done")}">已完成</a>
          <a href="${navHref("#in-progress")}">进行中</a>
          <a href="${navHref("#atlas")}">图表</a>
          <a href="${navHref("#branches")}">研究线</a>
          <a href="${pageMeta.type === "home" ? "#showcase" : pathUrl("homepage/showcase/")}">Showcase</a>
        </nav>
      </header>
    `;
  }

  function navHref(hash) {
    if (pageMeta.type === "home") {
      return hash;
    }
    return `${pathUrl("homepage/")}${hash}`;
  }

  function renderHomePage() {
    const homeCharts = (data.home_chart_ids || []).map((chartId) => charts[chartId]).filter(Boolean);
    return `
      ${renderHero()}
      ${renderStatusSection({
        id: "done",
        kicker: "Done",
        title: "已完成",
        tag: "Done",
        tagClass: "done",
        description: "已经形成稳定结论、锚点或可复核阶段成果的任务放在这里。",
        groups: home.done_groups || [],
      })}
      ${renderStatusSection({
        id: "in-progress",
        kicker: "In Progress",
        title: "进行中",
        tag: "In Process",
        tagClass: "wip",
        description: "仍在推进、接管或等待下一轮正式结果的任务继续按日期归档在这里。",
        groups: home.in_progress_groups || [],
      })}
      ${renderChartSection({
        id: "atlas",
        kicker: "Result Atlas",
        title: "核心图表",
        description: "首页只保留少量高层图表，详细训练过程统一收进任务页。",
        charts: homeCharts,
      })}
      ${renderBranchSection()}
      ${renderShowcasePreview(showcaseItems.slice(0, 4))}
      ${renderFixHighlights()}
    `;
  }

  function renderHero() {
    return `
      <section class="hero-section">
        <div class="hero-copy">
          <p class="eyebrow">Embodied AI Research Archive</p>
          <h1>${escapeHtml(data.site.title)}</h1>
          <p class="hero-slogan">${escapeHtml(data.site.slogan)}</p>
          <p class="hero-summary">${escapeHtml(data.site.description)}</p>
          <div class="hero-chip-row">
            ${tasks
              .filter((task) => task.id !== "infra-audit")
              .map((task) => `<a class="hero-chip" href="${pathUrl(task.page_path)}">${escapeHtml(task.title)}</a>`)
              .join("")}
          </div>
        </div>
        <aside class="hero-side">
          <div class="hero-stat-card">
            <span class="mini-kicker">Archive Snapshot</span>
            <div class="hero-stat-grid">
              ${renderHeroStat("任务", data.stats.task_count)}
              ${renderHeroStat("研究线", data.stats.branch_count)}
              ${renderHeroStat("时间线事件", data.stats.timeline_count)}
              ${renderHeroStat("图表", data.stats.validated_rows)}
            </div>
          </div>
          <div class="hero-focus-card">
            <span class="mini-kicker">Current Focus</span>
            <div class="focus-list">
              ${tasks
                .filter((task) => task.id !== "infra-audit")
                .slice(0, 3)
                .map(
                  (task) => `
                    <a class="focus-item" href="${pathUrl(task.page_path)}">
                      <strong>${escapeHtml(task.title)}</strong>
                      <span>${task.hero_metrics.map((item) => `${escapeHtml(item.label)} ${escapeHtml(item.value)}`).join(" · ")}</span>
                    </a>
                  `,
                )
                .join("")}
            </div>
          </div>
        </aside>
      </section>
    `;
  }

  function renderHeroStat(label, value) {
    return `
      <div class="hero-stat">
        <span>${escapeHtml(String(label))}</span>
        <strong>${escapeHtml(String(value))}</strong>
      </div>
    `;
  }

  function renderStatusSection({ id, kicker, title, tag, tagClass, description, groups }) {
    return `
      <section class="section-block" id="${escapeHtml(id)}">
        <div class="section-title-row">
          <div>
            <p class="eyebrow">${escapeHtml(kicker)}</p>
            <h2>${escapeHtml(title)} <span class="status-tag ${escapeHtml(tagClass)}">${escapeHtml(tag)}</span></h2>
          </div>
          <p class="section-description">${escapeHtml(description)}</p>
        </div>
        ${
          groups.length
            ? groups.map((group) => renderDateGroup(group, renderHomeCard)).join("")
            : `<div class="empty-panel">当前还没有归到这个分区里的任务卡片。</div>`
        }
      </section>
    `;
  }

  function renderDateGroup(group, renderer) {
    return `
      <div class="date-group">
        <div class="date-label">${escapeHtml(group.date)}</div>
        <div class="card-grid">
          ${group.cards.map((card) => renderer(card)).join("")}
        </div>
      </div>
    `;
  }

  function renderHomeCard(card) {
    return `
      <article class="result-card">
        <span class="card-accent" aria-hidden="true"></span>
        <div class="card-topline">
          <span class="badge">${escapeHtml(card.badge || "Task")}</span>
          <span class="card-meta">${escapeHtml(card.meta || "")}</span>
        </div>
        <h3>${escapeHtml(card.title)}</h3>
        <p class="card-desc">${escapeHtml(card.summary)}</p>
        <div class="stats-row">
          ${card.metrics.map((metric) => renderMetric(metric)).join("")}
        </div>
        <div class="card-footer-line">
          <span>${renderEntityTags(card.branch_ids || [], "branch")}</span>
          <a class="text-link" href="${pathUrl(card.path)}">进入任务页</a>
        </div>
      </article>
    `;
  }

  function renderMetric(metric) {
    return `
      <div class="stat-box">
        <span class="stat-box-label">${escapeHtml(metric.label)}</span>
        <strong class="stat-box-value">${escapeHtml(metric.value)}</strong>
      </div>
    `;
  }

  function renderBranchSection() {
    return `
      <section class="section-block" id="branches">
        <div class="section-title-row">
          <div>
            <p class="eyebrow">Branches</p>
            <h2>研究线入口</h2>
          </div>
          <p class="section-description">首页以成果卡为主，研究线入口退到这里，保持导航清晰但不过度喧宾夺主。</p>
        </div>
        <div class="branch-grid">
          ${branches.map((branch) => renderBranchCard(branch)).join("")}
        </div>
      </section>
    `;
  }

  function renderBranchCard(branch) {
    return `
      <article class="branch-card">
        <div class="card-topline">
          <span class="badge">${escapeHtml(branch.title)}</span>
          <span class="card-meta">${escapeHtml(branch.status)}</span>
        </div>
        <h3>${escapeHtml(branch.summary)}</h3>
        <div class="stats-row compact">
          ${branch.hero_metrics.slice(0, 3).map((metric) => renderMetric(metric)).join("")}
        </div>
        <div class="card-footer-line">
          <span>${branch.related_task_ids.map((taskId) => renderEntityTags([taskId], "task")).join("")}</span>
          <a class="text-link" href="${pathUrl(branch.page_path)}">进入研究线</a>
        </div>
      </article>
    `;
  }

  function renderTaskPage(task) {
    const taskCharts = task.chart_ids.map((chartId) => charts[chartId]).filter(Boolean);
    const branchChips = task.branch_ids
      .map((branchId) => branchMap.get(branchId))
      .filter(Boolean)
      .map((branch) => `<a class="entity-chip" href="${pathUrl(branch.page_path)}">${escapeHtml(branch.title)}</a>`)
      .join("");

    return `
      ${renderDetailHero({
        kicker: "Task Report",
        title: task.title,
        summary: task.report_intro,
        status: task.status,
        metrics: task.hero_metrics,
        crumbs: [
          { label: "首页", path: "homepage/" },
          { label: "任务", path: "homepage/#done" },
          { label: task.title, path: task.page_path },
        ],
      })}
      <section class="section-block">
        <div class="section-title-row">
          <div>
            <p class="eyebrow">Overview</p>
            <h2>任务背景与当前判断</h2>
          </div>
          <p class="section-description">${escapeHtml(task.summary)}</p>
        </div>
        <div class="entity-chip-row">${branchChips}</div>
      </section>
      ${renderSummaryCards(task.summary_cards)}
      ${renderChartSection({
        kicker: "Training Curves",
        title: "训练图表区",
        description: "图表顺序固定为 success → total loss → mse，尽量让训练过程一眼可读。",
        charts: taskCharts,
      })}
      ${renderTimelineSection(task.timeline_groups, "Task Timeline", "任务时间线", "按日期分组，每天直接展开“做了什么 / 发现了什么 / 形成了什么判断”。")}
      ${renderFindingsSection(task.findings)}
      ${renderEvidenceSection(task.evidence_links)}
      ${renderTaskShowcase(task.media_items)}
    `;
  }

  function renderSummaryCards(cards) {
    return `
      <section class="section-block">
        <div class="section-title-row">
          <div>
            <p class="eyebrow">Summary</p>
            <h2>关键成果卡片</h2>
          </div>
          <p class="section-description">先把阶段结论讲清楚，再去看曲线和原始证据。</p>
        </div>
        <div class="summary-grid">
          ${cards.map((card) => renderSummaryCard(card)).join("")}
        </div>
      </section>
    `;
  }

  function renderSummaryCard(card) {
    return `
      <article class="summary-card">
        <span class="badge badge-soft">${escapeHtml(card.eyebrow || "Summary")}</span>
        <h3>${escapeHtml(card.title)}</h3>
        <p class="card-desc">${escapeHtml(card.body)}</p>
        <div class="stats-row">
          ${card.metrics.map((metric) => renderMetric(metric)).join("")}
        </div>
      </article>
    `;
  }

  function renderTimelineSection(groups, kicker, title, description) {
    return `
      <section class="section-block">
        <div class="section-title-row">
          <div>
            <p class="eyebrow">${escapeHtml(kicker)}</p>
            <h2>${escapeHtml(title)}</h2>
          </div>
          <p class="section-description">${escapeHtml(description)}</p>
        </div>
        ${
          groups.length
            ? groups.map((group) => renderDateGroup(group, renderTimelineCard)).join("")
            : `<div class="empty-panel">当前页面还没有整理出可展示的时间线卡片。</div>`
        }
      </section>
    `;
  }

  function renderTimelineCard(card) {
    const taskLink =
      card.task_id && taskMap.get(card.task_id)
        ? `<a class="entity-chip" href="${pathUrl(taskMap.get(card.task_id).page_path)}">${escapeHtml(taskMap.get(card.task_id).title)}</a>`
        : "";
    return `
      <article class="timeline-card">
        <div class="card-topline">
          <span class="badge">${escapeHtml(card.badge || "Event")}</span>
          <span class="card-meta">${taskLink}</span>
        </div>
        <h3>${escapeHtml(card.title)}</h3>
        <p class="card-desc">${escapeHtml(card.summary)}</p>
        <p class="timeline-outcome"><strong>当前判断：</strong>${escapeHtml(card.outcome || "")}</p>
        <div class="stats-row">
          ${(card.metrics || []).map((metric) => renderMetric(metric)).join("")}
        </div>
        <div class="link-row">
          ${(card.links || []).map((link) => renderInlineLink(link)).join("")}
        </div>
      </article>
    `;
  }

  function renderChartSection({ id, kicker, title, description, charts: chartList }) {
    return `
      <section class="section-block" ${id ? `id="${escapeHtml(id)}"` : ""}>
        <div class="section-title-row">
          <div>
            <p class="eyebrow">${escapeHtml(kicker)}</p>
            <h2>${escapeHtml(title)}</h2>
          </div>
          <p class="section-description">${escapeHtml(description)}</p>
        </div>
        ${
          chartList.length
            ? `<div class="chart-grid">${chartList.map((chart) => renderChartCard(chart)).join("")}</div>`
            : `<div class="empty-panel">当前还没有可展示的图表。</div>`
        }
      </section>
    `;
  }

  function renderChartCard(chart) {
    return `
      <article class="chart-card" data-chart-card>
        <div class="card-topline">
          <span class="badge badge-soft">${escapeHtml(chart.type === "line" ? "Line Chart" : "Bar Chart")}</span>
        </div>
        <h3>${escapeHtml(chart.title)}</h3>
        <p class="card-desc">${escapeHtml(chart.description)}</p>
        <div class="chart-body">
          ${chart.type === "line" ? renderLineChart(chart) : renderBarChart(chart)}
        </div>
        ${chart.note ? `<p class="chart-note">${escapeHtml(chart.note)}</p>` : ""}
        <div class="chart-tooltip" hidden></div>
      </article>
    `;
  }

  function renderLineChart(chart) {
    const allPoints = chart.series.flatMap((series) => series.points || []);
    if (!allPoints.length) {
      return `<div class="chart-empty">当前没有足够的曲线数据。</div>`;
    }

    const width = 620;
    const height = 260;
    const left = 48;
    const top = 16;
    const right = 20;
    const bottom = 36;
    const xValues = allPoints.map((point) => point.x);
    const yValues = allPoints.map((point) => point.y);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const maxY = chart.format === "percent" ? Math.max(1, ...yValues) : Math.max(...yValues);
    const minY = chart.format === "percent" ? 0 : Math.min(0, ...yValues);

    function scaleX(value) {
      const domain = maxX === minX ? 1 : maxX - minX;
      return left + ((value - minX) / domain) * (width - left - right);
    }

    function scaleY(value) {
      const domain = maxY === minY ? 1 : maxY - minY;
      return height - bottom - ((value - minY) / domain) * (height - top - bottom);
    }

    const gridValues = [0, 0.25, 0.5, 0.75, 1].map((ratio) => minY + (maxY - minY || 1) * ratio);
    const gridLines = gridValues
      .map((value) => {
        const y = scaleY(value);
        return `
          <line x1="${left}" y1="${y}" x2="${width - right}" y2="${y}" class="chart-grid-line"></line>
          <text x="${left - 8}" y="${y + 4}" class="chart-axis-label chart-axis-label-left">${escapeHtml(
            formatValue(value, chart.format),
          )}</text>
        `;
      })
      .join("");

    const seriesMarkup = chart.series
      .map((series) => {
        const points = series.points || [];
        const path = points
          .map((point, index) => `${index === 0 ? "M" : "L"} ${scaleX(point.x)} ${scaleY(point.y)}`)
          .join(" ");
        const dots = points
          .map((point) => {
            const tip = `${series.name} · ${point.label}: ${formatValue(point.y, chart.format)}`;
            return `
              <circle
                class="chart-point"
                cx="${scaleX(point.x)}"
                cy="${scaleY(point.y)}"
                r="4.8"
                fill="${series.color}"
                data-tip="${escapeHtml(tip)}"
              ></circle>
            `;
          })
          .join("");
        return `
          <path d="${path}" fill="none" stroke="${series.color}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"></path>
          ${dots}
        `;
      })
      .join("");

    const legend = chart.series
      .map(
        (series) => `
          <span class="legend-item">
            <span class="legend-dot" style="background:${series.color}"></span>
            ${escapeHtml(series.name)}
          </span>
        `,
      )
      .join("");

    return `
      <div class="chart-surface">
        <svg viewBox="0 0 ${width} ${height}" class="line-chart" role="img" aria-label="${escapeHtml(chart.title)}">
          ${gridLines}
          ${seriesMarkup}
          <line x1="${left}" y1="${height - bottom}" x2="${width - right}" y2="${height - bottom}" class="chart-axis-line"></line>
        </svg>
        <div class="chart-legend">${legend}</div>
      </div>
    `;
  }

  function renderBarChart(chart) {
    const series = chart.series?.[0];
    if (!series || !chart.categories?.length) {
      return `<div class="chart-empty">当前没有足够的柱状数据。</div>`;
    }
    const maxValue = Math.max(...series.values, 1);
    return `
      <div class="bar-chart">
        ${chart.categories
          .map((category, index) => {
            const value = series.values[index];
            const heightPercent = (value / maxValue) * 100;
            const tip = `${category}: ${formatValue(value, chart.format)}`;
            return `
              <div class="bar-column" data-tip="${escapeHtml(tip)}">
                <span class="bar-value">${escapeHtml(formatValue(value, chart.format))}</span>
                <div class="bar-rail">
                  <div class="bar-fill" style="height:${heightPercent}%; background:${series.color};"></div>
                </div>
                <span class="bar-label">${escapeHtml(category)}</span>
              </div>
            `;
          })
          .join("")}
      </div>
    `;
  }

  function renderFindingsSection(findings) {
    return `
      <section class="section-block">
        <div class="section-title-row">
          <div>
            <p class="eyebrow">Findings</p>
            <h2>关键结论</h2>
          </div>
          <p class="section-description">这里不贴原始文档，而是把已经形成判断的结论直接写出来。</p>
        </div>
        <div class="finding-grid">
          ${findings.map((finding) => renderFindingCard(finding)).join("")}
        </div>
      </section>
    `;
  }

  function renderFindingCard(finding) {
    return `
      <article class="finding-card">
        <h3>${escapeHtml(finding.title)}</h3>
        <p class="card-desc">${escapeHtml(finding.body)}</p>
      </article>
    `;
  }

  function renderEvidenceSection(evidenceLinks) {
    return `
      <section class="section-block">
        <div class="section-title-row">
          <div>
            <p class="eyebrow">Evidence</p>
            <h2>证据链接</h2>
          </div>
          <p class="section-description">原始 Markdown、JSON、audit 和 summary 都退到证据层，不再作为主内容承载面。</p>
        </div>
        <div class="evidence-grid">
          ${evidenceLinks.map((link) => renderEvidenceCard(link)).join("")}
        </div>
      </section>
    `;
  }

  function renderEvidenceCard(link) {
    return `
      <article class="evidence-card">
        <h3>${escapeHtml(link.title)}</h3>
        <p class="card-desc">${escapeHtml(link.summary || "原始记录入口")}</p>
        <a class="text-link" href="${pathUrl(link.path)}">${escapeHtml(link.label || "查看原始记录")}</a>
      </article>
    `;
  }

  function renderTaskShowcase(items) {
    if (!items.length) {
      return "";
    }
    return `
      <section class="section-block">
        <div class="section-title-row">
          <div>
            <p class="eyebrow">Showcase</p>
            <h2>Demo 与现场素材</h2>
          </div>
          <p class="section-description">任务页里的素材展示只承载真正的 demo、截图和 rollout 证据。</p>
        </div>
        <div class="media-grid">
          ${items.map((item) => renderMediaCard(item)).join("")}
        </div>
      </section>
    `;
  }

  function renderMediaCard(item) {
    return `
      <article class="media-card">
        <div class="media-surface">
          ${
            item.kind === "video"
              ? `<video controls preload="metadata" src="${pathUrl(item.path)}"></video>`
              : `<img src="${pathUrl(item.path)}" alt="${escapeHtml(item.title)}">`
          }
        </div>
        <div class="media-copy">
          <h3>${escapeHtml(item.title)}</h3>
          <p class="card-desc">${escapeHtml(item.caption)}</p>
          <a class="text-link" href="${pathUrl(item.path)}">打开原始素材</a>
        </div>
      </article>
    `;
  }

  function renderBranchPage(branch) {
    const relatedTasks = branch.related_task_ids.map((taskId) => taskMap.get(taskId)).filter(Boolean);
    const branchCharts = branch.chart_ids.map((chartId) => charts[chartId]).filter(Boolean);

    return `
      ${renderDetailHero({
        kicker: "Research Line",
        title: branch.title,
        summary: branch.summary,
        status: branch.status,
        metrics: branch.hero_metrics,
        crumbs: [
          { label: "首页", path: "homepage/" },
          { label: "研究线", path: "homepage/#branches" },
          { label: branch.title, path: branch.page_path },
        ],
      })}
      <section class="section-block">
        <div class="section-title-row">
          <div>
            <p class="eyebrow">Related Tasks</p>
            <h2>关联任务</h2>
          </div>
          <p class="section-description">研究线是为了把同一方向上的任务和时间线集中起来看，而不是再复制一遍首页结构。</p>
        </div>
        <div class="summary-grid">
          ${relatedTasks.map((task) => renderRelatedTaskCard(task)).join("")}
        </div>
      </section>
      ${branchCharts.length ? renderChartSection({
        kicker: "Branch Charts",
        title: "支线图表",
        description: "这里只放和这条研究线直接相关的图表，不重复整站所有图。",
        charts: branchCharts,
      }) : ""}
      ${renderTimelineSection(branch.timeline_groups || [], "Timeline", "研究线时间线", "同一条研究线下的任务推进合并到同一时间轴里看。")}
      ${renderEvidenceSection(branch.evidence_links || [])}
    `;
  }

  function renderRelatedTaskCard(task) {
    return `
      <article class="summary-card">
        <span class="badge badge-soft">${escapeHtml(task.status)}</span>
        <h3>${escapeHtml(task.title)}</h3>
        <p class="card-desc">${escapeHtml(task.summary)}</p>
        <div class="stats-row">
          ${task.hero_metrics.slice(0, 3).map((metric) => renderMetric(metric)).join("")}
        </div>
        <div class="card-footer-line">
          <span></span>
          <a class="text-link" href="${pathUrl(task.page_path)}">进入任务页</a>
        </div>
      </article>
    `;
  }

  function renderTimelinePage() {
    return `
      ${renderDetailHero({
        kicker: "Timeline",
        title: "项目时间线",
        summary: "把任务推进按天收束成事件卡片，而不是只甩日期或原始文件名。",
        status: "持续更新",
        metrics: [
          { label: "事件卡片", value: String(data.stats.timeline_count) },
          { label: "任务", value: String(data.stats.task_count) },
          { label: "研究线", value: String(data.stats.branch_count) },
        ],
        crumbs: [
          { label: "首页", path: "homepage/" },
          { label: "项目时间线", path: "homepage/timeline/" },
        ],
      })}
      ${renderTimelineSection(
        timelinePageGroups,
        "Global Timeline",
        "按日期展开的项目推进",
        "这页只保留已经整理好的时间线卡片，目的就是让你不点原始文档也能看懂每天推进了什么。",
      )}
    `;
  }

  function renderShowcasePreview(items) {
    return `
      <section class="section-block" id="showcase">
        <div class="section-title-row">
          <div>
            <p class="eyebrow">Showcase</p>
            <h2>Demo 与现场素材</h2>
          </div>
          <p class="section-description">为每个任务预留独立素材目录，后续可以直接往里放图片、GIF、视频。</p>
        </div>
        ${
          items.length
            ? `<div class="media-grid">${items.map((item) => renderMediaCard(item)).join("")}</div>
               <div class="more-link-row"><a class="text-link" href="${pathUrl("homepage/showcase/")}">进入完整素材页</a></div>`
            : `<div class="empty-panel">当前还没有可展示的 demo 素材。</div>`
        }
      </section>
    `;
  }

  function renderShowcasePage() {
    const groups = tasks
      .map((task) => ({
        task,
        items: showcaseItems.filter((item) => item.task_id === task.id),
      }))
      .filter((group) => group.items.length);

    return `
      ${renderDetailHero({
        kicker: "Showcase",
        title: "Demo Showcase",
        summary: "素材页只负责展示图片、视频和 rollout 片段，不承担任务说明本身。",
        status: "可扩展",
        metrics: [
          { label: "素材数", value: String(showcaseItems.length) },
          { label: "任务组", value: String(groups.length) },
          { label: "支持格式", value: "png / mp4 / webm" },
        ],
        crumbs: [
          { label: "首页", path: "homepage/" },
          { label: "Showcase", path: "homepage/showcase/" },
        ],
      })}
      ${
        groups.length
          ? groups
              .map(
                (group) => `
                  <section class="section-block">
                    <div class="section-title-row">
                      <div>
                        <p class="eyebrow">Task Media</p>
                        <h2>${escapeHtml(group.task.title)}</h2>
                      </div>
                      <p class="section-description"><a class="text-link" href="${pathUrl(group.task.page_path)}">进入任务页</a></p>
                    </div>
                    <div class="media-grid">
                      ${group.items.map((item) => renderMediaCard(item)).join("")}
                    </div>
                  </section>
                `,
              )
              .join("")
          : `<div class="empty-panel">当前还没有素材。</div>`
      }
    `;
  }

  function renderFixHighlights() {
    if (!fixHighlights.length) {
      return "";
    }
    return `
      <section class="section-block">
        <div class="section-title-row">
          <div>
            <p class="eyebrow">Turning Points</p>
            <h2>关键修复 / 关键转折</h2>
          </div>
          <p class="section-description">fixes 继续做事实源，但首页只保留少量关键转折，不再让流水账主导页面节奏。</p>
        </div>
        <div class="fix-grid">
          ${fixHighlights.map((item) => renderFixCard(item)).join("")}
        </div>
      </section>
    `;
  }

  function renderFixCard(item) {
    return `
      <article class="fix-card">
        <div class="card-topline">
          <span class="badge badge-soft">Fix</span>
          <span class="card-meta">${escapeHtml(item.date)}</span>
        </div>
        <h3>${escapeHtml(item.title)}</h3>
        <p class="card-desc">${escapeHtml(item.summary)}</p>
        <a class="text-link" href="${pathUrl(item.path)}">查看 fixes</a>
      </article>
    `;
  }

  function renderInlineLink(link) {
    return `<a class="inline-link" href="${pathUrl(link.path)}">${escapeHtml(link.title)}</a>`;
  }

  function renderDetailHero({ kicker, title, summary, status, metrics, crumbs }) {
    return `
      <section class="detail-hero">
        <div class="detail-copy">
          <div class="crumb-row">
            ${crumbs.map((crumb) => `<a href="${pathUrl(crumb.path)}">${escapeHtml(crumb.label)}</a>`).join("<span>/</span>")}
          </div>
          <p class="eyebrow">${escapeHtml(kicker)}</p>
          <h1>${escapeHtml(title)}</h1>
          <p class="hero-slogan">${escapeHtml(summary)}</p>
        </div>
        <aside class="detail-side">
          <div class="hero-stat-card">
            <span class="mini-kicker">${escapeHtml(status)}</span>
            <div class="detail-metric-column">
              ${metrics.map((metric) => renderDetailMetric(metric)).join("")}
            </div>
          </div>
        </aside>
      </section>
    `;
  }

  function renderDetailMetric(metric) {
    return `
      <div class="detail-metric">
        <span>${escapeHtml(metric.label)}</span>
        <strong>${escapeHtml(metric.value)}</strong>
      </div>
    `;
  }

  function renderFooter() {
    return `
      <footer class="site-footer">
        <div>${escapeHtml(data.site.title)}</div>
        <div>Generated at ${escapeHtml(data.generated_at)}</div>
      </footer>
    `;
  }

  function renderNotFound(title) {
    return `
      <section class="detail-hero">
        <div class="detail-copy">
          <p class="eyebrow">404</p>
          <h1>${escapeHtml(title)}</h1>
          <p class="hero-slogan">当前页面没有生成出来，可以先回到首页。</p>
          <a class="hero-chip" href="${pathUrl("homepage/")}">返回首页</a>
        </div>
      </section>
    `;
  }

  function renderEntityTags(ids, type) {
    return ids
      .map((id) => (type === "task" ? taskMap.get(id) : branchMap.get(id)))
      .filter(Boolean)
      .map((entity) => `<span class="tag-label">${escapeHtml(entity.title)}</span>`)
      .join("");
  }

  function bindChartTooltips() {
    document.querySelectorAll("[data-chart-card]").forEach((card) => {
      const tooltip = card.querySelector(".chart-tooltip");
      if (!tooltip) {
        return;
      }
      card.querySelectorAll("[data-tip]").forEach((node) => {
        node.addEventListener("pointerenter", (event) => showTooltip(event, tooltip, node.dataset.tip));
        node.addEventListener("pointermove", (event) => showTooltip(event, tooltip, node.dataset.tip));
        node.addEventListener("pointerleave", () => hideTooltip(tooltip));
      });
    });
  }

  function showTooltip(event, tooltip, text) {
    tooltip.hidden = false;
    tooltip.textContent = text;
    const cardRect = tooltip.parentElement.getBoundingClientRect();
    tooltip.style.left = `${event.clientX - cardRect.left + 12}px`;
    tooltip.style.top = `${event.clientY - cardRect.top - 14}px`;
  }

  function hideTooltip(tooltip) {
    tooltip.hidden = true;
  }

  function formatValue(value, format) {
    if (value == null || Number.isNaN(Number(value))) {
      return "-";
    }
    if (format === "percent") {
      return Number(value).toFixed(2);
    }
    if (format === "int") {
      return String(Math.round(Number(value)));
    }
    return Number(value).toFixed(3);
  }

  function pathUrl(path) {
    if (!path) {
      return repoBase;
    }
    if (/^(https?:)?\/\//.test(path)) {
      return path;
    }
    const normalized = String(path).replace(/^\/+/, "");
    return `${repoBase}${normalized}`;
  }

  function getRepoBase() {
    const marker = "/homepage/";
    const currentPath = window.location.pathname;
    const index = currentPath.indexOf(marker);
    if (index === -1) {
      return "/";
    }
    const prefix = currentPath.slice(0, index + 1);
    return prefix || "/";
  }

  function escapeHtml(text) {
    return String(text)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }
})();
