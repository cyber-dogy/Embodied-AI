# MDIT Audit Visibility And Resume Fix

- Time: 2026-04-17T10:04:52+08:00
- Scope: `mdit audit output`, `autoresearch resume gating`
- Phenomenon: `audit-only` 结束后主要信息仍偏机器可读，人在 `tmux` 里不容易第一眼拿到 `success@50/100` 与最佳 checkpoint；同时 autoresearch 会把 `pending_offline_audit=true` 的 screening 记录视作已完成，可能跳过该做的正式审计。
- Cause: `eval_all_checkpoints.py` 与 `mdit_trial_runner.py` 缺少面向人工观察的结论式打印；`research/mdit_autoresearch_loop.py` 对历史记录的完成态判断过宽。
- Fix:
- 在 `mdit/cli/eval_all_checkpoints.py` 中新增 `audit_summary`，显式打印各关键 epoch 的成功率、最佳 checkpoint 与 aggregate success。
- 在 `research/mdit_trial_runner.py` 中新增 `trial_audit_summary`，显式打印 trial 级结论、`best_success`、`trial_score`、`collapse_detected` 与报告路径。
- 在 `research/mdit_autoresearch_loop.py` 中收紧恢复判定，`pending_offline_audit=true` 的记录不再被当成完成态。
- Result: 后续所有 MDIT 审计在终端里都会直接打印关键信息；autoresearch 恢复时会优先把主线候选按正确口径审完，再继续后续筛选与晋级。
