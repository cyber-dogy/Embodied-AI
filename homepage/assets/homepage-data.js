window.homepageCuration = {
  hero: {
    title: "把调试过程、实验主线和研究文档沉淀成我自己的研究主页",
    subtitle:
      "这条 homepage 支线不替代 docs，而是把 fixes 总修复年表、PDIT anchor、MDIT faithful journal、LeLaN 执行线，以及你后续给我的新材料，整理成一个可持续扩展的个人研究台。",
    note:
      "默认规则：源材料先进 docs；主页负责自动抓取、组织导航、提炼摘要，再交给我继续帮你润色成能展示的内容。",
    badges: [
      "docs-first",
      "assistant-assisted",
      "PDIT / MDIT / LeLaN",
      "homepage branch",
    ],
    featuredMetrics: [
      { label: "PDIT anchor", value: "1.00 / 0.85" },
      { label: "MDIT anchor", value: "0.55" },
      { label: "Recent fixes", value: "6+" },
    ],
  },
  lines: [
    {
      id: "fixes",
      group: "stable",
      badge: "Debug Ledger",
      status: "Always On",
      title: "fixes.md 作为全局修复年表",
      summary:
        "它是整个仓库的上游总账。无论是 PDIT、MDIT 还是 LeLaN，关键 bug、回滚、环境偏差和阶段性结论都会先沉淀到 fixes.md，再被主页抽成最近修复流与里程碑。",
      stats: [
        { label: "角色", value: "总账" },
        { label: "维护", value: "追加式" },
        { label: "用途", value: "时间线" },
      ],
      bullets: [
        "每条记录都要求写范围、背景、处理、结果，适合后来自动提取成 homepage 卡片。",
        "它不是某一条实验线的附庸，而是所有支线共用的调试上下文。",
        "后续如果你给我新的调试材料，最稳的流程仍然是先落到 fixes，再由主页自动摘出要点。",
      ],
      nextStep:
        "后续把最新 5 到 8 条 fixes 自动映射成主页时间线，形成真正的“最近发生了什么”。",
      docs: [
        {
          title: "fixes.md",
          href: "../docs/fixes.md",
          note: "全局修复总账，agent 修改前必读。",
        },
        {
          title: "fixes 截图 #1",
          href: "../docs/image/fixes/1776007255805.png",
          note: "修复现场截图证据。",
        },
        {
          title: "fixes 截图 #2",
          href: "../docs/image/fixes/1776007270781.png",
          note: "修复现场截图证据。",
        },
      ],
    },
    {
      id: "pdit",
      group: "stable",
      badge: "PDIT Mainline",
      status: "Done",
      title: "PDIT 主线：当前最可信的行为 anchor",
      summary:
        "这条线已经不只是实验过程记录，而是当前仓库里最稳定的基线证据。主页会把它放在稳定锚点区，作为其他线的对照参考。",
      stats: [
        { label: "success@20", value: "1.00" },
        { label: "success@100", value: "0.85" },
        { label: "best@500", value: "0.95" },
      ],
      bullets: [
        "恢复文档已经把主线 bug、训练栈修复和行为回归系统性沉淀清楚。",
        "checkpoint manifest 已经足够像一份证据索引，适合主页直接挂入口。",
        "后续主页中所有新的 challenger 或 branch，都会天然和这条线形成对照。",
      ],
      nextStep:
        "继续把 benchmark、checkpoint 和典型回归问题挂在这条线下面，形成一个稳定的主线档案区。",
      docs: [
        {
          title: "FM/DiT 恢复进展",
          href: "../docs/pdit/2026-04-08-fm-recovery-progress-zh.md",
          note: "主线恢复、审计链和阶段指标。",
        },
        {
          title: "训练模型审计",
          href: "../docs/pdit/2026-04-07-training-model-audit-zh.md",
          note: "训练和评测的正式审计文档。",
        },
        {
          title: "Top10 checkpoint manifest",
          href: "../docs/top10-checkpoint-manifest.json",
          note: "canonical best 和行为回归证据。",
        },
      ],
    },
    {
      id: "mdit",
      group: "active",
      badge: "Faithful MDIT",
      status: "In Process",
      title: "MDIT 研究线：从 run note 进化为 journal + best path",
      summary:
        "MDIT 现在已经不是离散实验笔记，而是一条具备共享审计链、lane search 和最佳路线冻结机制的独立研究线。主页会把它作为“当前推进中”的核心板块。",
      stats: [
        { label: "locked anchor", value: "0.55" },
        { label: "latest lane", value: "500 resume" },
        { label: "状态", value: "takeover" },
      ],
      bullets: [
        "research_journal 正在承担 run-by-run consolidation 的角色，适合主页自动抓最近进展。",
        "latest fixes 里已经出现 100 -> 500 续训兼容与真实后台接管恢复，这些正是主页值得强调的动态。",
        "这条线未来最适合继续扩展：lane 概览、失败原因、当前锚点、接管状态。",
      ],
      nextStep:
        "继续把最新接管、主线续训和审计结果自动摘入 recent docs / latest fixes，再由我帮你提炼成主页卡片语言。",
      docs: [
        {
          title: "MDIT research journal",
          href: "../docs/mdit/research_journal.md",
          note: "run note、修复和审计结论集中地。",
        },
        {
          title: "MDIT 执行手册",
          href: "../docs/mdit/2026-04-16-mdit-execution-manual.md",
          note: "执行命令和工作流约定。",
        },
        {
          title: "MDIT Best Path",
          href: "../docs/mdit/best_path.md",
          note: "最佳路线和选型依据。",
        },
      ],
    },
    {
      id: "lelan",
      group: "active",
      badge: "LeLaN Branch",
      status: "Ready",
      title: "LeLaN 支线：执行规范先立住，再逐步长出档案",
      summary:
        "LeLaN 当前最大的优势不是已有太多实验结果，而是执行计划和正式记录规范已经先被固定下来。这很适合在主页里单独保留一个长期成长的入口。",
      stats: [
        { label: "obs", value: "3" },
        { label: "cams", value: "5" },
        { label: "stage", value: "500ep" },
      ],
      bullets: [
        "现有执行计划足够完整，训练、续训、audit-only 和单 ckpt/all ckpt 评估都已经成文。",
        "research/README 已经规定了正式实验记录的六段式结构，后面很好自动抓。",
        "这条线后续可以自然长成“正式实验陈列区”，主页只需要继续吃它的源文档。",
      ],
      nextStep:
        "等第一批正式 LeLaN run 文档落地后，把它们自动挂到 recent docs 和支线详情里。",
      docs: [
        {
          title: "LeLaN 执行计划",
          href: "../docs/lelan/2026-04-12-lelan-autoresearch-execution-plan-zh.md",
          note: "当前推荐配置与工作流。",
        },
        {
          title: "LeLaN 研究记录 README",
          href: "../docs/lelan/research/README.md",
          note: "正式 run 文档模板和约定。",
        },
      ],
    },
  ],
  milestones: [
    {
      date: "2026-04-18",
      label: "Homepage Branch",
      title: "homepage 支线正式成立",
      desc:
        "从这一刻开始，主页不再是临时展示页，而是一个会自动抓 docs 源材料的长期入口。",
      href: "#featured-lines",
    },
    {
      date: "2026-04-18",
      label: "Takeover Repair",
      title: "MDIT 主线 100->500 续训兼容修复并恢复真实后台接管",
      desc:
        "这条记录说明 autoresearch 不再只是名义存在，而是真的重新接通了最佳路线续训链。",
      href: "../docs/fixes.md",
    },
    {
      date: "2026-04-17",
      label: "Journal Consolidation",
      title: "MDIT 研究线开始从 run note 切到 research journal",
      desc:
        "文档结构从单次记录转向可持续扩展的研究流水线，这是主页能成立的重要前提。",
      href: "../docs/mdit/research_journal.md",
    },
    {
      date: "2026-04-08",
      label: "PDIT Recovery",
      title: "PDIT baseline 修稳并成为 anchor",
      desc:
        "PDIT 已经从恢复报告变成主页上的稳定锚点，其他分支都可以拿它做对照。",
      href: "../docs/pdit/2026-04-08-fm-recovery-progress-zh.md",
    },
  ],
  assistantWorkflow: {
    title: "以后我作为助手，怎么接管你给我的内容",
    intro:
      "你以后不需要自己先把内容整理成主页格式。更自然的方式是把原始材料先给我，我负责把它归档、分析、总结，再挂到 homepage 上。",
    acceptedInputs: [
      "一段新的 Markdown 或命令记录",
      "一个 docs 路径或 run note",
      "W&B 链接、run name、checkpoint 名称",
      "截图、日志片段、结论草稿",
      "你对某轮实验的口头总结",
    ],
    steps: [
      {
        title: "1. 抓取源材料",
        desc:
          "我先读你给我的 docs、日志、截图、run note 或结果表，判断它属于 fixes、PDIT、MDIT、LeLaN 还是通用方法论。",
      },
      {
        title: "2. 提炼主页摘要",
        desc:
          "我把原始材料压成适合 homepage 的形式：标题、一句话摘要、三个关键指标、当前状态和下一步。",
      },
      {
        title: "3. 回写到 docs-first 结构",
        desc:
          "如果内容还没有落在 docs，我会优先帮你补成正式文档；然后主页只引用这些稳定 source，不直接依赖聊天内容。",
      },
      {
        title: "4. 更新 homepage 展示",
        desc:
          "我再把这条内容挂到支线卡片、最近修复流、最近文档区或里程碑区，不需要你手工重新排版。",
      },
    ],
  },
  maintenance: {
    rules: [
      "主页是聚合层，docs 才是 source of truth。",
      "给我新内容时，优先告诉我它要归到 fixes / pdit / mdit / lelan 哪一类；如果你没分，我来分。",
      "同一轮材料优先补正式文档，再改主页摘要，不直接在主页里长篇写原始日志。",
    ],
    steps: [
      {
        title: "A. 先把原始内容给我",
        desc:
          "可以直接给 docs 路径、Markdown、截图、日志片段、run name，甚至一句“这一轮主要修了什么”。",
      },
      {
        title: "B. 我帮你变成 homepage 语言",
        desc:
          "我会把技术过程压成适合展示的摘要，不会要求你自己手工写卡片文案。",
      },
      {
        title: "C. 有新 docs 时重新生成",
        desc:
          "运行生成脚本后，recent docs、latest fixes 和按支线自动发现的文档列表会自动更新。",
      },
    ],
  },
};
