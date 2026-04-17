# MDIT Research Journal

- This file is append-only and maintained by autoresearch.
- Keep `best_path.md` and the execution manual as separate stable docs; run-by-run notes are consolidated here.
- Legacy one-file-per-run notes have been moved to `docs/mdit/archive/legacy_notes/` so the root `docs/mdit` directory stays clean.

## Historical Migration

### Source `2026-04-17-100433-unplug_charger_mdit_rgb_text_3token_100.md`

#### MDIT Adopt Existing Run · unplug_charger_mdit_rgb_text_3token_100

- Time: 2026-04-17T10:04:33+08:00
- Run: `unplug_charger_mdit_rgb_text_3token_100`
- Phase: `adopt_existing`
- Phenomenon: trial_score=None | best_success_rate=None | collapse=False
- Reasons: none
- Result: best_success_rate=None trial_score=None
- Audit report: none
- Contract issues: none


### Source `2026-04-17-100452-audit-visibility-and-resume-fix.md`

#### MDIT Audit Visibility And Resume Fix

- Time: 2026-04-17T10:04:52+08:00
- Scope: `mdit audit output`, `autoresearch resume gating`
- Phenomenon: `audit-only` 结束后主要信息仍偏机器可读，人在 `tmux` 里不容易第一眼拿到 `success@50/100` 与最佳 checkpoint；同时 autoresearch 会把 `pending_offline_audit=true` 的 screening 记录视作已完成，可能跳过该做的正式审计。
- Cause: `eval_all_checkpoints.py` 与 `mdit_trial_runner.py` 缺少面向人工观察的结论式打印；`research/mdit_autoresearch_loop.py` 对历史记录的完成态判断过宽。
- Fix:
- 在 `mdit/cli/eval_all_checkpoints.py` 中新增 `audit_summary`，显式打印各关键 epoch 的成功率、最佳 checkpoint 与 aggregate success。
- 在 `research/mdit_trial_runner.py` 中新增 `trial_audit_summary`，显式打印 trial 级结论、`best_success`、`trial_score`、`collapse_detected` 与报告路径。
- 在 `research/mdit_autoresearch_loop.py` 中收紧恢复判定，`pending_offline_audit=true` 的记录不再被当成完成态。
- Result: 后续所有 MDIT 审计在终端里都会直接打印关键信息；autoresearch 恢复时会优先把主线候选按正确口径审完，再继续后续筛选与晋级。


### Source `2026-04-17-103735-unplug_charger_mdit_rgb_text_3token_100.md`

#### MDIT Adopt Existing Run · unplug_charger_mdit_rgb_text_3token_100

- Time: 2026-04-17T10:37:35+08:00
- Run: `unplug_charger_mdit_rgb_text_3token_100`
- Phase: `adopt_existing`
- Phenomenon: trial_score=None | best_success_rate=None | collapse=False
- Reasons: none
- Result: best_success_rate=None trial_score=None
- Audit report: none
- Contract issues: none


### Source `2026-04-17-103934-unplug_charger_mdit_rgb_text_3token_100.md`

#### MDIT Adopt Existing Run · unplug_charger_mdit_rgb_text_3token_100

- Time: 2026-04-17T10:39:34+08:00
- Run: `unplug_charger_mdit_rgb_text_3token_100`
- Phase: `adopt_existing`
- Phenomenon: trial_score=None | best_success_rate=None | collapse=False
- Reasons: none
- Result: best_success_rate=None trial_score=None
- Audit report: none
- Contract issues: none


### Source `2026-04-17-104023-unplug_charger_mdit_rgb_text_3token_100.md`

#### MDIT Adopt Existing Run · unplug_charger_mdit_rgb_text_3token_100

- Time: 2026-04-17T10:40:23+08:00
- Run: `unplug_charger_mdit_rgb_text_3token_100`
- Phase: `adopt_existing`
- Phenomenon: trial_score=None | best_success_rate=None | collapse=False
- Reasons: none
- Result: best_success_rate=None trial_score=None
- Audit report: none
- Contract issues: none


### Source `2026-04-17-104109-unplug_charger_mdit_rgb_text_3token_100.md`

#### MDIT Adopt Existing Run · unplug_charger_mdit_rgb_text_3token_100

- Time: 2026-04-17T10:41:09+08:00
- Run: `unplug_charger_mdit_rgb_text_3token_100`
- Phase: `adopt_existing`
- Phenomenon: trial_score=None | best_success_rate=None | collapse=False
- Reasons: none
- Result: best_success_rate=None trial_score=None
- Audit report: none
- Contract issues: none


### Source `2026-04-17-104159-unplug_charger_mdit_rgb_text_3token_100.md`

#### MDIT Adopt Existing Run · unplug_charger_mdit_rgb_text_3token_100

- Time: 2026-04-17T10:41:59+08:00
- Run: `unplug_charger_mdit_rgb_text_3token_100`
- Phase: `adopt_existing`
- Phenomenon: trial_score=None | best_success_rate=None | collapse=False
- Reasons: none
- Result: best_success_rate=None trial_score=None
- Audit report: none
- Contract issues: none


### Source `2026-04-17-105544-unplug_charger_mdit_rgb_text_3token_100.md`

#### MDIT Audit Note · unplug_charger_mdit_rgb_text_3token_100

- Time: 2026-04-17T10:55:44+08:00
- Run: `unplug_charger_mdit_rgb_text_3token_100`
- Phase: `audit_only`
- Phenomenon: trial_score=0.55 | best_success_rate=0.55 | collapse=False
- Reasons: none
- Result: best_success_rate=0.55 trial_score=0.55
- Audit report: `/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/unplug_charger_mdit_rgb_text_3token_100/audit_report.json`
- Contract issues: none


### Source `2026-04-17-110536-provisional-best-lane-a-mainline.md`

#### MDIT Provisional Best Freeze

- Time: 2026-04-17 11:05:36 +0800
- Run: `unplug_charger_mdit_rgb_text_3token_100`
- Experiment: `lane_a_mainline_100`
- Status: provisional best before winner is fixed

## Why This Is The Current Best

- It is the only RGB+text candidate that has already completed the locked shared audit chain.
- The audit used the same evaluation contract restored from checkpoint payload, so there is no train/eval recipe drift.
- It reached `0.55` success rate at `epoch_0100` over `20 episodes`, which is the strongest confirmed result we have on the MDIT RGB+text line so far.

## Confirmed Metrics

- `epoch_0050`: `0.25` (`5/20`)
- `epoch_0100`: `0.55` (`11/20`)
- `best_success`: `0.55 @ epoch 100`
- `mean_steps@best`: `121.75`
- `recipe_drift`: `false`
- `collapse_detected`: `false`

## Current Planning Logic

- **Anchor first**: keep a PDIT-style RGB+text baseline stable before opening wider search.
- **Immediate next experiment**: `lane_a_stabilized_100`
  - changes: `command_mode=mean_first_n`, `average_first_n=2`, `smooth_actions=true`
  - goal: reduce planner rejection and horizon exhaustion without changing RGB+text, FM, or Transformer backbone.
- **Next challenger**: `lane_b_faithful`
  - role: test a faithful alternative RGB+text input path under the same shared audit chain.
- **Promotion rule**: only candidates that beat the current best under the same 20-episode locked audit move forward as the new primary direction.

## Best Route Backup

- Frozen snapshot: `/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/autoresearch_records/frozen_best/2026-04-17-110536__lane_a_mainline_epoch100_s055`
- Stable alias: `/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/autoresearch_records/frozen_best/current_provisional_best`
- Best checkpoint backup: `/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/autoresearch_records/frozen_best/current_provisional_best/best_success.pt`
- Source run: `/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/unplug_charger_mdit_rgb_text_3token_100`

## Guardrails

- The frozen snapshot preserves `best_success.pt`, `best_valid.pt`, `epoch_0050.pt`, and `epoch_0100.pt`.
- Checkpoints inside the frozen snapshot are hard-linked, so they remain recoverable even if the original run is later cleaned by autoresearch.
- Later candidates are allowed to replace the provisional best only after they beat it on the same locked audit path.


### Source `2026-04-17-111609-unplug_charger_mdit_rgb_text_fm_v1_lane_a_stabilized_100_e0100_20260417_105544.md`

#### MDIT Train Failure · unplug_charger_mdit_rgb_text_fm_v1__lane_a_stabilized_100__e0100__20260417_105544

- Time: 2026-04-17T11:16:09+08:00
- Run: `unplug_charger_mdit_rgb_text_fm_v1__lane_a_stabilized_100__e0100__20260417_105544`
- Phase: `train_only`
- Phenomenon: trial_score=-1.0 | best_success_rate=None | collapse=True
- Reasons: [enforce fail at inline_container.cc:664] . unexpected pos 2602795840 vs 2602795728
- Result: best_success_rate=None trial_score=-1.0
- Audit report: none
- Contract issues: none


### Source `2026-04-17-165816-unplug_charger_mdit_rgb_text_fm_v1_lane_a_stabilized_100_e0100_20260417_112329.md`

#### MDIT Train Note · unplug_charger_mdit_rgb_text_fm_v1__lane_a_stabilized_100__e0100__20260417_112329

- Time: 2026-04-17T16:58:16+08:00
- Run: `unplug_charger_mdit_rgb_text_fm_v1__lane_a_stabilized_100__e0100__20260417_112329`
- Phase: `train_only`
- Phenomenon: trial_score=None | best_success_rate=None | collapse=False
- Reasons: none
- Result: best_success_rate=None trial_score=None
- Audit report: none
- Contract issues: none

## 2026-04-17T17:20:44+08:00 · train_only · unplug_charger_mdit_lane_b_faithful_fm_v1__lane_b_faithful_100__e0100__20260417_172029

- Title: MDIT Train Failure · unplug_charger_mdit_lane_b_faithful_fm_v1__lane_b_faithful_100__e0100__20260417_172029
- Run: `unplug_charger_mdit_lane_b_faithful_fm_v1__lane_b_faithful_100__e0100__20260417_172029`
- Phase: `train_only`
- Phenomenon: trial_score=-1.0 | best_success_rate=None | collapse=True
- Reasons: (MaxRetryError("HTTPSConnectionPool(host='huggingface.co', port=443): Max retries exceeded with url: /timm/vit_base_patch16_clip_224.openai/resolve/main/model.safetensors (Caused by ProxyError('Cannot connect to proxy.', TimeoutError('_ssl.c:1000: The handshake operation timed out')))"), '(Request ID: 4de944c2-7728-468a-83d0-51d3b3f6962e)')
- Result: best_success_rate=None trial_score=-1.0
- Audit report: none
- Contract issues: none

## 2026-04-17T17:20:54+08:00 · audit_only · unplug_charger_mdit_rgb_text_fm_v1__lane_a_stabilized_100__e0100__20260417_112329

- Title: Lane A stabilized is weaker than the current mainline anchor
- Run: `unplug_charger_mdit_rgb_text_fm_v1__lane_a_stabilized_100__e0100__20260417_112329`
- Phase: `audit_only`
- Phenomenon: `epoch_0050=0.20 (4/20)` and `epoch_0100=0.35 (7/20)` are both below the current locked anchor `unplug_charger_mdit_rgb_text_3token_100` (`epoch_0100=0.55`).
- Reasons: Failures are still dominated by horizon exhaustion (`at_horizon`), with a small number of `planning_runtime_error`; smoothing the action head did not address the core failure mode.
- Result: This branch is now treated as a weak lane, not a new primary direction. The best RGB+text route remains the original Lane A mainline.
- Audit report: embedded in `autoresearch_records/mdit_loop_state__unplug_rgb_text_search.json`
- Contract issues: none

## 2026-04-17T17:21:30+08:00 · infra_fix · lane_b_faithful_100

- Title: Lane B first launch failed due to remote model fetch, not model quality
- Run: `unplug_charger_mdit_lane_b_faithful_fm_v1__lane_b_faithful_100__e0100__20260417_172029`
- Phase: `train_only`
- Phenomenon: The candidate failed before training started because `timm/vit_base_patch16_clip_224.openai` tried to hit `huggingface.co` and timed out through the proxy.
- Reasons: The process did not force offline loading even though both the TIMM vision checkpoint and the OpenAI CLIP text checkpoint were already present in local cache.
- Result: Patched the autoresearch loop to inject `HF_HUB_OFFLINE=1`, `TRANSFORMERS_OFFLINE=1`, and `HF_HUB_DISABLE_TELEMETRY=1` into child processes whenever the required cached checkpoints are present. Lane B should now restart from local cache instead of being blocked by external network handshakes.
- Audit report: none
- Contract issues: none

## 2026-04-17T19:05:00+08:00 · impl · lane_c_mtdp_strict

- Title: Added a strict MTDP validation lane plus a single-step 12G execution profile
- Run: `lane_c_mtdp_strict_100 / lane_c_mtdp_strict_100_12g`
- Phase: `implementation`
- Phenomenon: Existing RGB+text challengers still did not answer the real question of whether MTDP is viable under our shared evaluation chain.
- Reasons: `lane_b` only approximated MTDP at the concat level; it did not yet introduce global conditioning, RoPE backbone semantics, beta timestep sampling, or MTDP-style state/action min-max normalization.
- Result: Added an isolated strict lane with `clip_rgb_text_mtdp`, `dit_mtdp_rope`, `fm_variant=mtdp_strict`, runtime min-max stats resolution, and a 12G-compatible single-step execution profile (`16x8`, activation checkpointing, camera chunk encode). Existing mainline/eval defaults remain unchanged.
- Audit report: none
- Contract issues: none
