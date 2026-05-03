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
  const showcasePreviewItems = data.showcase?.preview_items || [];
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
          <a href="${navHref("#branches")}">研究线</a>
          <a href="${navHref("#in-progress")}">进行中</a>
          <a href="${navHref("#done")}">已完成</a>
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
    return `
      ${renderHero()}
      ${renderWorkstreamSection()}
      ${renderStatusSection({
        id: "in-progress",
        kicker: "In Progress",
        title: "进行中",
        tag: "In Process",
        tagClass: "wip",
        description: "最新在做的工作放在最前面，方便一进主页就看到当前主推进线。",
        groups: home.in_progress_groups || [],
      })}
      ${renderStatusSection({
        id: "done",
        kicker: "Done",
        title: "已完成",
        tag: "Done",
        tagClass: "done",
        description: "已经形成稳定结论、锚点或可复核阶段成果的任务放在这里。",
        groups: home.done_groups || [],
      })}
      ${renderShowcasePreview(showcasePreviewItems)}
    `;
  }

  function renderHero() {
    const focus = home.current_focus;
    const inlineStats = home.hero_inline_stats || [];
    return `
      <section class="hero-section">
        <div class="hero-copy">
          <p class="eyebrow">Embodied AI Research Archive</p>
          <h1>${escapeHtml(data.site.title)}</h1>
          <p class="hero-slogan">${escapeHtml(data.site.slogan)}</p>
          <div class="hero-inline-stats">
            ${inlineStats.map((metric) => renderHeroInlineStat(metric)).join("")}
          </div>
          <div class="hero-chip-row">
            ${tasks
              .filter((task) => task.id !== "infra-audit")
              .map((task) => `<a class="hero-chip" href="${pathUrl(task.page_path)}">${escapeHtml(task.title)}</a>`)
              .join("")}
          </div>
        </div>
        <aside class="hero-side">
          <div class="hero-focus-card">
            <span class="mini-kicker">Current Focus</span>
            ${
              focus
                ? `
                  <a class="focus-item focus-item-main" href="${pathUrl(focus.path)}">
                    <div class="badge-group">${renderBadgeGroup(buildCardBadges(focus))}</div>
                    <strong>${escapeHtml(focus.title)}</strong>
                    <p>${escapeHtml(focus.summary)}</p>
                    <span>${focus.metrics.map((item) => `${escapeHtml(item.label)} ${escapeHtml(item.value)}`).join(" · ")}</span>
                  </a>
                `
                : `<div class="focus-item"><strong>当前没有可展示的主推进任务</strong></div>`
            }
          </div>
        </aside>
      </section>
    `;
  }

  function renderHeroInlineStat(metric) {
    return `
      <div class="hero-inline-stat">
        <span class="stat-box-label">${escapeHtml(String(metric.label))}</span>
        <strong>${escapeHtml(String(metric.value))}</strong>
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
          <div class="badge-group">${renderBadgeGroup(buildCardBadges(card))}</div>
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

  function renderWorkstreamSection() {
    const groups = home.workstream_groups || [];
    return `
      <section class="section-block" id="branches">
        <div class="section-title-row">
          <div>
            <p class="eyebrow">Workstreams</p>
            <h2>主线分区</h2>
          </div>
          <p class="section-description">首页先按主线分成 Sim2Real / 硬件、模仿学习、VLA、世界模型几个大区块；单独任务页继续保留。</p>
        </div>
        <div class="workstream-stack">
          ${groups.map((group) => renderWorkstreamGroup(group)).join("")}
        </div>
      </section>
    `;
  }

  function renderWorkstreamGroup(group) {
    return `
      <section class="workstream-panel">
        <div class="section-title-row workstream-title-row">
          <div>
            <p class="eyebrow">Workstream</p>
            <h3>${escapeHtml(group.title)}</h3>
          </div>
          <p class="section-description">${escapeHtml(group.summary)}</p>
        </div>
        <div class="branch-grid">
          ${group.cards.map((card) => renderWorkstreamCard(card)).join("")}
        </div>
      </section>
    `;
  }

  function renderWorkstreamCard(card) {
    return `
      <article class="branch-card workstream-card">
        <div class="card-topline">
          <div class="badge-group">${renderBadgeGroup(buildCardBadges(card))}</div>
          <span class="card-meta">${escapeHtml(card.status)}</span>
        </div>
        <h3>${escapeHtml(card.title)}</h3>
        <p class="card-desc">${escapeHtml(card.summary)}</p>
        <p class="branch-result"><strong>当前成果：</strong>${escapeHtml(card.result || "")}</p>
        <div class="stats-row compact">
          ${(card.metrics || []).map((metric) => renderMetric(metric)).join("")}
        </div>
        <div class="card-footer-line">
          <span>${renderEntityTags(card.branch_ids || [], "branch")}</span>
          <a class="text-link" href="${pathUrl(card.path)}">进入任务页</a>
        </div>
      </article>
    `;
  }

  function renderBranchSection() {
    return `
      <section class="section-block" id="branches-legacy">
        <div class="section-title-row">
          <div>
            <p class="eyebrow">Branches</p>
            <h2>研究线入口</h2>
          </div>
          <p class="section-description">研究线详情页仍然保留；首页主入口优先按大区块组织，减少平铺时的阅读负担。</p>
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
          <div class="badge-group">${renderBadgeGroup([{ label: "研究线", tone: "secondary" }])}</div>
          <span class="card-meta">${escapeHtml(branch.status)}</span>
        </div>
        <h3>${escapeHtml(branch.card_title || branch.title)}</h3>
        <p class="card-desc">${escapeHtml(branch.card_summary || branch.summary)}</p>
        <p class="branch-result"><strong>当前成果：</strong>${escapeHtml(branch.card_result || "")}</p>
        <div class="stats-row compact">
          ${branch.hero_metrics.slice(0, 3).map((metric) => renderMetric(metric)).join("")}
        </div>
        <div class="card-footer-line">
          <span>${branch.related_task_ids.map((taskId) => renderEntityTags([taskId], "task")).join("")}</span>
          <a class="text-link" href="${pathUrl(branch.entry_path || branch.page_path)}">${escapeHtml(branch.entry_label || "进入研究线")}</a>
        </div>
      </article>
    `;
  }

  function renderTaskPage(task) {
    const taskCharts =
      task.chart_media_items?.length
        ? task.chart_media_items
        : task.chart_ids.map((chartId) => charts[chartId]).filter(Boolean);
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
          { label: "任务", path: task.status_group === "in_progress" ? "homepage/#in-progress" : "homepage/#done" },
          { label: task.title, path: task.page_path },
        ],
      })}
      ${renderTaskShowcase(task.media_items)}
      ${renderTaskCoreSection(task, branchChips)}
      ${
        taskCharts.length
          ? renderChartSection({
              id: "task-charts",
              kicker: "Training Curves",
              title: "图表分析",
              description: "优先用成功率柱状图、loss 曲线和排行条把结果关系讲清楚，减少只靠长段文字解释。",
              charts: taskCharts,
              dashboard: true,
            })
          : ""
      }
      ${renderTimelineSection(
        task.timeline_groups,
        "Task Timeline",
        "任务时间线",
        "按日期分组，每天直接展开“做了什么 / 发现了什么 / 形成了什么判断”。",
        { primaryBadge: task.task_badge || task.title },
      )}
      ${renderFindingsSection(task.findings)}
      ${renderEvidenceSection(task.evidence_links)}
    `;
  }

  function renderTaskCoreSection(task, branchChips) {
    return `
      <section class="section-block">
        <div class="section-title-row">
          <div>
            <p class="eyebrow">Core Work</p>
            <h2>核心工作</h2>
          </div>
          <p class="section-description">${escapeHtml(task.core_summary || task.summary)}</p>
        </div>
        <div class="entity-chip-row">${branchChips}</div>
        ${task.core_tables?.length ? renderTaskCoreTables(task.core_tables) : `
          <div class="summary-grid">
            ${task.summary_cards.map((card) => renderSummaryCard(card)).join("")}
          </div>
        `}
      </section>
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

  function renderTaskCoreTables(tables) {
    return `
      <div class="table-stack">
        ${tables.map((table) => renderTaskCoreTable(table)).join("")}
      </div>
    `;
  }

  function renderTaskCoreTable(table) {
    return `
      <article class="table-panel">
        <div class="card-topline">
          <span class="badge badge-soft">Table</span>
        </div>
        <h3>${escapeHtml(table.title)}</h3>
        <div class="table-scroll">
          <table class="insight-table">
            <thead>
              <tr>
                ${(table.columns || []).map((column) => `<th>${escapeHtml(column)}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${(table.rows || [])
                .map(
                  (row) => `
                    <tr>
                      ${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}
                    </tr>
                  `,
                )
                .join("")}
            </tbody>
          </table>
        </div>
        ${table.note ? `<p class="chart-note">${escapeHtml(table.note)}</p>` : ""}
      </article>
    `;
  }

  function renderTimelineSection(groups, kicker, title, description, options = {}) {
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
            ? `<div class="timeline-group-list">${groups.map((group) => renderTimelineGroup(group, options)).join("")}</div>`
            : `<div class="empty-panel">当前页面还没有整理出可展示的时间线卡片。</div>`
        }
      </section>
    `;
  }

  function renderTimelineGroup(group, options = {}) {
    return `
      <div class="timeline-group">
        <div class="timeline-group-rail">
          ${renderTimelineDateCard(group.date)}
          <span class="timeline-group-node" aria-hidden="true"></span>
        </div>
        <div class="timeline-group-cards">
          ${group.cards.map((card) => renderTimelineCard(card, options)).join("")}
        </div>
      </div>
    `;
  }

  function renderTimelineCard(card, options = {}) {
    const taskLink =
      card.task_id && taskMap.get(card.task_id)
        ? `<a class="entity-chip" href="${pathUrl(taskMap.get(card.task_id).page_path)}">${escapeHtml(taskMap.get(card.task_id).title)}</a>`
        : "";
    return `
      <article class="timeline-card">
        <div class="card-topline">
          <div class="badge-group">${renderBadgeGroup(buildCardBadges(card, options))}</div>
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

  function renderChartSection({ id, kicker, title, description, charts: chartList, dashboard = false }) {
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
            ? `<div class="chart-grid ${dashboard ? "chart-grid-dashboard" : ""}">${chartList
                .map((chart, index) => renderChartCard(chart, { index, dashboard }))
                .join("")}</div>`
            : `<div class="empty-panel">当前还没有可展示的图表。</div>`
        }
      </section>
    `;
  }

  function renderChartCard(chart, options = {}) {
    const chartTypeLabel =
      chart.type === "media_chart"
        ? chart.source_kind === "manual"
          ? "静态图表"
          : "补充图表"
        : chart.type === "line"
        ? "折线图"
        : chart.type === "compare_cards"
          ? "结果卡片"
          : chart.type === "rank_bar"
            ? "排行条"
            : chart.type === "grouped_bar"
              ? "分组柱状图"
              : "柱状图";
    const chartClass = buildChartCardClass(chart, options);
    return `
      <article class="${escapeHtml(chartClass)}" data-chart-card>
        <div class="card-topline">
          <span class="badge badge-soft">${escapeHtml(chartTypeLabel)}</span>
        </div>
        <h3>${escapeHtml(chart.title)}</h3>
        <p class="card-desc">${escapeHtml(chart.description)}</p>
        <div class="chart-body">
          ${
            chart.type === "media_chart"
              ? renderMediaChart(chart)
              : chart.type === "line"
              ? renderLineChart(chart)
              : chart.type === "compare_cards"
                ? renderCompareCardsChart(chart)
                : chart.type === "grouped_bar"
                  ? renderGroupedBarChart(chart)
                  : chart.type === "rank_bar"
                    ? renderRankBarChart(chart)
                : renderBarChart(chart)
          }
        </div>
        ${chart.note ? `<p class="chart-note">${escapeHtml(chart.note)}</p>` : ""}
        <div class="chart-tooltip" hidden></div>
      </article>
    `;
  }

  function buildChartCardClass(chart, options = {}) {
    const classes = ["chart-card"];
    if (chart.type === "media_chart") {
      classes.push("chart-card-media");
    }
    if (options.dashboard) {
      classes.push("chart-card-dashboard");
      if (chart.type === "rank_bar") {
        classes.push("chart-card-wide");
      } else if (chart.type === "media_chart") {
        classes.push("chart-card-wide");
      } else if (options.index === 0) {
        classes.push("chart-card-feature");
      }
    }
    return classes.join(" ");
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

  function renderMediaChart(chart) {
    if (!chart.path) {
      return `<div class="chart-empty">当前没有可展示的静态图。</div>`;
    }
    return `
      <div class="media-chart-surface">
        <img src="${pathUrl(chart.path)}" alt="${escapeHtml(chart.title)}">
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

  function renderGroupedBarChart(chart) {
    const seriesList = chart.series || [];
    if (!seriesList.length || !chart.categories?.length) {
      return `<div class="chart-empty">当前没有足够的分组柱状数据。</div>`;
    }
    const maxValue = Math.max(
      1,
      ...seriesList.flatMap((series) => (series.values || []).map((value) => Number(value) || 0)),
    );
    const legend = seriesList
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
      <div class="grouped-bar-chart">
        ${chart.categories
          .map(
            (category, index) => `
              <div class="grouped-bar-group">
                <div class="grouped-bar-bars">
                  ${seriesList
                    .map((series) => {
                      const value = Number(series.values?.[index] || 0);
                      const tip = `${series.name} · ${category}: ${formatValue(value, chart.format)}`;
                      return `
                        <div class="grouped-bar-column" data-tip="${escapeHtml(tip)}">
                          <div class="grouped-bar-rail">
                            <div class="grouped-bar-fill" style="height:${(value / maxValue) * 100}%; background:${series.color};"></div>
                          </div>
                          <span class="grouped-bar-value">${escapeHtml(formatValue(value, chart.format))}</span>
                        </div>
                      `;
                    })
                    .join("")}
                </div>
                <span class="grouped-bar-label">${escapeHtml(category)}</span>
              </div>
            `,
          )
          .join("")}
      </div>
      <div class="chart-legend">${legend}</div>
    `;
  }

  function renderRankBarChart(chart) {
    const rows = chart.rows || [];
    if (!rows.length) {
      return `<div class="chart-empty">当前没有足够的排行数据。</div>`;
    }
    const maxValue = Math.max(1, ...rows.map((row) => Number(row.value) || 0));
    return `
      <div class="rank-bar-chart">
        ${rows
          .map((row) => {
            const value = Number(row.value) || 0;
            const tip = `${row.label}: ${formatValue(value, chart.format)}`;
            return `
              <div class="rank-bar-row" data-tip="${escapeHtml(tip)}">
                <span class="rank-bar-label">${escapeHtml(row.label)}</span>
                <div class="rank-bar-track">
                  <div class="rank-bar-fill" style="width:${(value / maxValue) * 100}%; background:${row.color || "var(--rust)"};"></div>
                </div>
                <span class="rank-bar-value">${escapeHtml(formatValue(value, chart.format))}</span>
              </div>
            `;
          })
          .join("")}
      </div>
    `;
  }

  function renderCompareCardsChart(chart) {
    const cards = chart.cards || [];
    if (!cards.length) {
      return `<div class="chart-empty">当前还没有可展示的对照结果。</div>`;
    }
    return `
      <div class="compare-card-grid">
        ${cards
          .map(
            (card) => `
              <article class="compare-mini-card">
                <div class="card-topline">
                  <span class="badge badge-soft">${escapeHtml(card.badge || "Task")}</span>
                </div>
                <h4>${escapeHtml(card.title)}</h4>
                <p class="card-desc">${escapeHtml(card.summary || "")}</p>
                <div class="stats-row compact">
                  ${(card.metrics || []).map((metric) => renderMetric(metric)).join("")}
                </div>
              </article>
            `,
          )
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
    return renderMediaSection({
      items,
      kicker: "Showcase",
      title: "Demo 与现场素材",
      description: "素材会按任务目录递归抓取，图片、GIF、视频都直接继承进任务页；首页只展示关键预览。",
    });
  }

  function renderBranchShowcase(items) {
    return renderMediaSection({
      items,
      kicker: "Branch Demo",
      title: "研究线 Demo 与现场素材",
      description: "研究线页会聚合同一条线下各任务的现场素材，方便直接回看方法落地和系统演示。",
    });
  }

  function renderMediaSection({ items, kicker, title, description }) {
    if (!items.length) {
      return "";
    }
    const showcaseLayout = buildShowcaseLayout(items);
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
          showcaseLayout
            ? `
              <div class="media-section-stack">
                <div class="media-featured-wrap">
                  ${renderMediaCard(showcaseLayout.featured, { featured: true })}
                </div>
                <div class="media-grid media-grid-videos">
                  ${showcaseLayout.videos.map((item) => renderMediaCard(item, { compact: true })).join("")}
                </div>
                ${
                  showcaseLayout.extras.length
                    ? `
                      <div class="media-grid">
                        ${showcaseLayout.extras.map((item) => renderMediaCard(item)).join("")}
                      </div>
                    `
                    : ""
                }
              </div>
            `
            : `
              <div class="media-grid">
                ${items.map((item) => renderMediaCard(item)).join("")}
              </div>
            `
        }
      </section>
    `;
  }

  // 有封面图 + 一组演示视频时，拆成主图和视频带，避免所有素材等大导致阅读拥挤。
  function buildShowcaseLayout(items) {
    const featured = items.find((item) => item.kind === "image");
    if (!featured) {
      return null;
    }
    const videos = items.filter((item) => item.kind === "video");
    if (videos.length < 2) {
      return null;
    }
    const extras = items.filter((item) => item !== featured && item.kind !== "video");
    return { featured, videos, extras };
  }

  function renderMediaCard(item, options = {}) {
    const cardClasses = ["media-card"];
    const surfaceClasses = ["media-surface"];
    const assetClasses = [item.kind === "video" ? "media-asset-video" : "media-asset-image"];
    const isCover = isCoverMedia(item);
    if (options.featured) {
      cardClasses.push("media-card-featured");
      surfaceClasses.push("media-surface-featured");
    }
    if (options.compact) {
      cardClasses.push("media-card-compact");
      surfaceClasses.push("media-surface-compact");
    }
    if (isCover) {
      cardClasses.push("media-card-cover");
      surfaceClasses.push("media-surface-cover");
      assetClasses.push("media-asset-contain");
    }
    return `
      <article class="${cardClasses.join(" ")}">
        <div class="${surfaceClasses.join(" ")}">
          ${
            item.kind === "video"
              ? `<video class="${assetClasses.join(" ")}" controls preload="metadata" src="${pathUrl(item.path)}"></video>`
              : `<img class="${assetClasses.join(" ")}" src="${pathUrl(item.path)}" alt="${escapeHtml(item.title)}">`
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

  // 封面图优先完整显示，避免被统一的 cover 裁切掉关键信息。
  function isCoverMedia(item) {
    if (item.kind !== "image") {
      return false;
    }
    const title = String(item.title || "");
    const path = String(item.path || "").toLowerCase();
    return title.includes("封面") || path.includes("cover") || path.includes("封面");
  }

  function renderBranchPage(branch) {
    const relatedTasks = branch.related_task_ids.map((taskId) => taskMap.get(taskId)).filter(Boolean);
    const branchCharts =
      branch.chart_media_items?.length
        ? branch.chart_media_items
        : (branch.dashboard_chart_ids || branch.chart_ids || []).map((chartId) => charts[chartId]).filter(Boolean);

    return `
      ${renderDetailHero({
        kicker: "Research Line",
        title: branch.title,
        summary: branch.detail_intro || branch.summary,
        status: branch.status,
        metrics: branch.hero_metrics,
        crumbs: [
          { label: "首页", path: "homepage/" },
          { label: "研究线", path: "homepage/#branches" },
          { label: branch.title, path: branch.page_path },
        ],
      })}
      ${renderBranchShowcase(branch.media_items || [])}
      ${branchCharts.length ? renderChartSection({
        kicker: "Branch Dashboard",
        title: "图表分析",
        description: "研究线页优先展示按这条线重画后的总览图，而不是简单复用任务页的图表顺序。",
        charts: branchCharts,
        dashboard: true,
      }) : ""}
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
    if (!items.length) {
      return "";
    }
    return `
      <section class="section-block" id="showcase">
        <div class="section-title-row">
          <div>
            <p class="eyebrow">Showcase</p>
            <h2>Demo 与现场素材</h2>
          </div>
          <p class="section-description">首页只保留已经指定的亮点封面；完整视频和现场素材统一放到任务页和素材页里。</p>
        </div>
        <div class="media-grid media-grid-preview">${items.map((item) => renderMediaCard(item)).join("")}</div>
        <div class="more-link-row"><a class="text-link" href="${pathUrl("homepage/showcase/")}">进入完整素材页</a></div>
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

  function buildCardBadges(card, options = {}) {
    const badges = [];
    const primaryBadge =
      options.primaryBadge ||
      (card.task_id && taskMap.get(card.task_id) ? taskMap.get(card.task_id).task_badge || taskMap.get(card.task_id).title : "");
    if (primaryBadge) {
      badges.push({ label: primaryBadge, tone: "primary" });
    }
    if (card.badge && card.badge !== primaryBadge) {
      badges.push({ label: card.badge, tone: "secondary" });
    }
    return badges.length ? badges : [{ label: "Task", tone: "primary" }];
  }

  function renderBadgeGroup(badges) {
    return badges
      .map((badge) => `<span class="badge ${badge.tone === "secondary" ? "badge-secondary" : ""}">${escapeHtml(badge.label)}</span>`)
      .join("");
  }

  function renderTimelineDateCard(date) {
    const matched = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(date || ""));
    if (!matched) {
      return `<div class="timeline-date-card"><span class="timeline-group-date">${escapeHtml(String(date || ""))}</span></div>`;
    }
    return `
      <div class="timeline-date-card">
        <span class="timeline-date-ym">${escapeHtml(`${matched[1]}.${matched[2]}`)}</span>
        <strong class="timeline-date-day">${escapeHtml(matched[3])}</strong>
        <span class="timeline-group-date">${escapeHtml(date)}</span>
      </div>
    `;
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
