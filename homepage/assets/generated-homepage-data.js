window.homepageGeneratedData = {
  "generatedAt": "2026-04-18 16:07:46",
  "repoName": "autodl_unplug_charger_transformer_fm",
  "totalVisibleDocs": 23,
  "branchStats": {
    "fixes": {
      "doc_count": 3,
      "visible_recent_count": 3
    },
    "general": {
      "doc_count": 6,
      "visible_recent_count": 6
    },
    "lelan": {
      "doc_count": 2,
      "visible_recent_count": 2
    },
    "mdit": {
      "doc_count": 4,
      "visible_recent_count": 4
    },
    "pdit": {
      "doc_count": 8,
      "visible_recent_count": 8
    }
  },
  "latestFixes": [
    {
      "date": "2026-04-18 09:00:55 +0800",
      "title": "修复主线 100->500 续训兼容并恢复真实后台接管",
      "run": "",
      "scope": "mdit/train/checkpoints.py + mdit/train/runner.py + research/mdit_takeover_controller.py + scripts/run_mdit_takeover_sup…",
      "preview": "当前 best route 已经由后台监督器重新拉起，run=unplug_charger_mdit_rgb_text_3token_100__lane_a_mainline_500_resume__e0500__20260418_005723；新的训练日志已经出现 [resume] skip optimizer_state_dict: ...，随后 epoch 100 继续推进且学习率恢复为约…",
      "href": "../docs/fixes.md"
    },
    {
      "date": "2026-04-18 00:57:23 +0800",
      "title": "接管已有 run 并补齐元数据",
      "run": "unplug_charger_mdit_rgb_text_3token_100__lane_a_mainline_500_resume__e0500__20260418_005723",
      "scope": "research/mdit_trial_runner.py + docs/mdit/research_journal.md + docs/fixes.md",
      "preview": "run_dir=<repo>/ckpt/unplug_charger_mdit_rgb_text_3token_100__lane_a_mainline_500_resume__e0500__20260418_005723；pending_offline_audit=true",
      "href": "../docs/fixes.md"
    },
    {
      "date": "2026-04-18 00:57:23 +0800",
      "title": "接管器触发 500 epoch 最优路线 fallback",
      "run": "",
      "scope": "research/mdit_takeover_controller.py + docs/fixes.md + docs/mdit/research_journal.md",
      "preview": "触发原因：challenger audit reported recipe drift",
      "href": "../docs/fixes.md"
    },
    {
      "date": "2026-04-18 00:57:23 +0800",
      "title": "离线审计完成",
      "run": "unplug_charger_mdit_lane_c_mtdp_strict_fm_v1__lane_c_mtdp_strict_100__e0100__20260417_193720",
      "scope": "research/mdit_trial_runner.py + docs/mdit/research_journal.md + docs/fixes.md",
      "preview": "最佳成功率=未解析；最佳 checkpoint epoch=未解析；trial_score=-1.000；是否 collapse=True；collapse 原因=epoch 100 success None below threshold 0.55；受控配方偏移=state_min None -> [-0.16713987290859222, -0.6003386974334717, 0.78…",
      "href": "../docs/fixes.md"
    },
    {
      "date": "2026-04-18 00:26:53 +0800",
      "title": "训练完成并进入待审计状态",
      "run": "unplug_charger_mdit_lane_c_mtdp_strict_fm_v1__lane_c_mtdp_strict_100__e0100__20260417_193720",
      "scope": "research/mdit_trial_runner.py + docs/mdit/research_journal.md + docs/fixes.md",
      "preview": "run_dir=<repo>/ckpt/unplug_charger_mdit_lane_c_mtdp_strict_fm_v1__lane_c_mtdp_strict_100__e0100__20260417_193720；训练已完成 100 个 epoch（latest_epoch=99）；最佳验证指标 best_metric=0.228，best_epoch=52；保留检查点=best_v…",
      "href": "../docs/fixes.md"
    },
    {
      "date": "2026-04-17 20:03:00 +0800",
      "title": "更新接管器 fallback：最佳路线改为从 100 epoch latest 续到 500",
      "run": "",
      "scope": "research/mdit_takeover_controller.py + scripts/run_mdit_takeover.py + tmux:mdit_autoresearch:takeover_guard + docs/fixe…",
      "preview": "当前 takeover_guard 已采用新的 fallback 逻辑；如果 lane_c_mtdp_strict_100 没超过 0.55，后续会自动拉起一条基于最佳路线 epoch_0100 续训的 500 epoch run，而不是从头重训。",
      "href": "../docs/fixes.md"
    }
  ],
  "recentDocs": [
    {
      "branch": "fixes",
      "title": "fixes.md — MDIT/PDIT 修复记录",
      "preview": "每个 agent 在修改本项目代码前必须先读此文件。 每次发现 bug、做出修改、观察到实验结果后，必须在本文件末尾追加一条记录。 格式固定为：",
      "href": "../docs/fixes.md",
      "modified": "2026-04-18 09:00"
    },
    {
      "branch": "mdit",
      "title": "MDIT Research Journal",
      "preview": "This file is append-only and maintained by autoresearch. Keep best_path.md and the execution manual as separate stable docs; run-by-run notes are consolidated here. Legacy one-fil…",
      "href": "../docs/mdit/research_journal.md",
      "modified": "2026-04-18 09:00"
    },
    {
      "branch": "mdit",
      "title": "MDIT Best Path",
      "preview": "Updated: 2026-04-17T17:20:54+08:00 Experiment: lane_a_mainline_100 Lane: lane_a_mainline Run: unplug_charger_mdit_rgb_text_3token_100 Run dir: <repo>/ckpt/unplug_charger_mdit_rgb_…",
      "href": "../docs/mdit/best_path.md",
      "modified": "2026-04-17 17:20"
    },
    {
      "branch": "mdit",
      "title": "MDIT Audit Note · unplug_charger_mdit_rgb_text_fm_v1__lane_a_stabilized_100__e0100__20260417_112329",
      "preview": "Time: 2026-04-17T17:20:29+08:00 Run: unplug_charger_mdit_rgb_text_fm_v1__lane_a_stabilized_100__e0100__20260417_112329 Phase: audit_only Phenomenon: trial_score=-1.0 | best_succes…",
      "href": "../docs/mdit/2026-04-17-172029-unplug_charger_mdit_rgb_text_fm_v1_lane_a_stabilized_100_e0100_20260417_112329.md",
      "modified": "2026-04-17 17:20"
    },
    {
      "branch": "general",
      "title": "PDIT 项目包装稿",
      "preview": "面向具身操作的点云模仿学习闭环系统",
      "href": "../docs/job/pdit_job_packaging.md",
      "modified": "2026-04-17 16:40"
    },
    {
      "branch": "mdit",
      "title": "MDIT 执行手册（RGB+Text + FM + Transformer）",
      "preview": "更新时间：2026-04-16",
      "href": "../docs/mdit/2026-04-16-mdit-execution-manual.md",
      "modified": "2026-04-17 15:24"
    },
    {
      "branch": "general",
      "title": "代码结构说明",
      "preview": "这份文档回答五个问题：",
      "href": "../docs/code-structure-zh.md",
      "modified": "2026-04-16 10:52"
    },
    {
      "branch": "lelan",
      "title": "2026-04-12 LeLaN Autoresearch 执行计划",
      "preview": "LeLaN 这一轮只做工程链路修复和可自动执行化，不改主体架构，不发明新的 encoder 微调模式。",
      "href": "../docs/lelan/2026-04-12-lelan-autoresearch-execution-plan-zh.md",
      "modified": "2026-04-12 17:22"
    },
    {
      "branch": "lelan",
      "title": "LeLaN 研究记录目录",
      "preview": "每次正式实验结束后，在这里新增一份中文记录，文件名固定为：",
      "href": "../docs/lelan/research/README.md",
      "modified": "2026-04-12 17:09"
    },
    {
      "branch": "pdit",
      "title": "2026-04-07 训练与模型审计",
      "preview": "历史说明 这份审计写于仓库仍使用 src/ 目录布局的阶段。 文中对 src/ 的引用描述的是当时的仓库结构。 旧版源码快照现在保存在 archive/legacy_code/src_layout_snapshot/。",
      "href": "../docs/pdit/2026-04-07-training-model-audit-zh.md",
      "modified": "2026-04-10 22:17"
    }
  ],
  "docsByBranch": {
    "general": [
      {
        "title": "PDIT 项目包装稿",
        "preview": "面向具身操作的点云模仿学习闭环系统",
        "href": "../docs/job/pdit_job_packaging.md",
        "modified": "2026-04-17 16:40"
      },
      {
        "title": "代码结构说明",
        "preview": "这份文档回答五个问题：",
        "href": "../docs/code-structure-zh.md",
        "modified": "2026-04-16 10:52"
      },
      {
        "title": "baseline-regression-reference.json",
        "preview": "baseline 回归参考与对照指标，适合作为主线 sanity check 的证据源。",
        "href": "../docs/baseline-regression-reference.json",
        "modified": "2026-04-10 22:17"
      },
      {
        "title": "代码结构说明",
        "preview": "这份文档回答五个问题：",
        "href": "../docs/code-structure.md",
        "modified": "2026-04-10 22:17"
      },
      {
        "title": "PDIT vs MDIT",
        "preview": "这份文档用来快速区分当前仓库里的两条研究线。",
        "href": "../docs/pdit-vs-mdit.md",
        "modified": "2026-04-10 22:17"
      },
      {
        "title": "top10-checkpoint-manifest.json",
        "preview": "checkpoint 排名、canonical best、post-refactor 行为回归与归档映射。",
        "href": "../docs/top10-checkpoint-manifest.json",
        "modified": "2026-04-10 22:17"
      }
    ],
    "fixes": [
      {
        "title": "fixes.md — MDIT/PDIT 修复记录",
        "preview": "每个 agent 在修改本项目代码前必须先读此文件。 每次发现 bug、做出修改、观察到实验结果后，必须在本文件末尾追加一条记录。 格式固定为：",
        "href": "../docs/fixes.md",
        "modified": "2026-04-18 09:00"
      },
      {
        "title": "1776007255805.png",
        "preview": "图像证据，可在主页中作为修复现场或实验截图引用。",
        "href": "../docs/image/fixes/1776007255805.png",
        "modified": "2026-04-13 01:11"
      },
      {
        "title": "1776007270781.png",
        "preview": "图像证据，可在主页中作为修复现场或实验截图引用。",
        "href": "../docs/image/fixes/1776007270781.png",
        "modified": "2026-04-13 01:11"
      }
    ],
    "lelan": [
      {
        "title": "2026-04-12 LeLaN Autoresearch 执行计划",
        "preview": "LeLaN 这一轮只做工程链路修复和可自动执行化，不改主体架构，不发明新的 encoder 微调模式。",
        "href": "../docs/lelan/2026-04-12-lelan-autoresearch-execution-plan-zh.md",
        "modified": "2026-04-12 17:22"
      },
      {
        "title": "LeLaN 研究记录目录",
        "preview": "每次正式实验结束后，在这里新增一份中文记录，文件名固定为：",
        "href": "../docs/lelan/research/README.md",
        "modified": "2026-04-12 17:09"
      }
    ],
    "mdit": [
      {
        "title": "MDIT Research Journal",
        "preview": "This file is append-only and maintained by autoresearch. Keep best_path.md and the execution manual as separate stable docs; run-by-run notes are consolidated here. Legacy one-fil…",
        "href": "../docs/mdit/research_journal.md",
        "modified": "2026-04-18 09:00"
      },
      {
        "title": "MDIT Audit Note · unplug_charger_mdit_rgb_text_fm_v1__lane_a_stabilized_100__e0100__20260417_112329",
        "preview": "Time: 2026-04-17T17:20:29+08:00 Run: unplug_charger_mdit_rgb_text_fm_v1__lane_a_stabilized_100__e0100__20260417_112329 Phase: audit_only Phenomenon: trial_score=-1.0 | best_succes…",
        "href": "../docs/mdit/2026-04-17-172029-unplug_charger_mdit_rgb_text_fm_v1_lane_a_stabilized_100_e0100_20260417_112329.md",
        "modified": "2026-04-17 17:20"
      },
      {
        "title": "MDIT Best Path",
        "preview": "Updated: 2026-04-17T17:20:54+08:00 Experiment: lane_a_mainline_100 Lane: lane_a_mainline Run: unplug_charger_mdit_rgb_text_3token_100 Run dir: <repo>/ckpt/unplug_charger_mdit_rgb_…",
        "href": "../docs/mdit/best_path.md",
        "modified": "2026-04-17 17:20"
      },
      {
        "title": "MDIT 执行手册（RGB+Text + FM + Transformer）",
        "preview": "更新时间：2026-04-16",
        "href": "../docs/mdit/2026-04-16-mdit-execution-manual.md",
        "modified": "2026-04-17 15:24"
      }
    ],
    "pdit": [
      {
        "title": "FM/DiT 自主研究流程",
        "preview": "scripts/ 和 cli/ 入口现在优先强制导入本仓库的根目录模块，而不是工作区里的同名外部项目。 训练默认参数已调整为更安全的研究行为： resume_from_latest = false checkpoint_every_epochs = 100 best_valid.pt 现在是标准的最佳验证检查点名称。 检查点保存现在是原子的，以避免 lat…",
        "href": "../docs/pdit/2026-04-07-autoresearch-pipeline-zh.md",
        "modified": "2026-04-10 22:17"
      },
      {
        "title": "Autoresearch Pipeline",
        "preview": "当前推荐的实验流水线是两阶段：",
        "href": "../docs/pdit/2026-04-07-autoresearch-pipeline.md",
        "modified": "2026-04-10 22:17"
      },
      {
        "title": "2026-04-07 训练与模型审计",
        "preview": "历史说明 这份审计写于仓库仍使用 src/ 目录布局的阶段。 文中对 src/ 的引用描述的是当时的仓库结构。 旧版源码快照现在保存在 archive/legacy_code/src_layout_snapshot/。",
        "href": "../docs/pdit/2026-04-07-training-model-audit-zh.md",
        "modified": "2026-04-10 22:17"
      },
      {
        "title": "Training / Model Audit",
        "preview": "Historical note This audit was written before the repository was flattened to root-level modules. References to the old src/ tree describe the repository layout at that time. The…",
        "href": "../docs/pdit/2026-04-07-training-model-audit.md",
        "modified": "2026-04-10 22:17"
      },
      {
        "title": "FM/DiT 恢复进展",
        "preview": "日期：2026-04-08 最新更新：2026-04-09",
        "href": "../docs/pdit/2026-04-08-fm-recovery-progress-zh.md",
        "modified": "2026-04-10 22:17"
      },
      {
        "title": "FM/DiT Recovery Progress",
        "preview": "Date: 2026-04-08 Latest update: 2026-04-09",
        "href": "../docs/pdit/2026-04-08-fm-recovery-progress.md",
        "modified": "2026-04-10 22:17"
      },
      {
        "title": "5090 + CUDA 13.0 Environment Setup",
        "preview": "Last updated: 2026-04-10",
        "href": "../docs/pdit/2026-04-10-5090-environment-setup.md",
        "modified": "2026-04-10 22:17"
      },
      {
        "title": "5090 Migration Checklist",
        "preview": "Last updated: 2026-04-10",
        "href": "../docs/pdit/2026-04-10-5090-migration-checklist.md",
        "modified": "2026-04-10 22:17"
      }
    ]
  }
};
