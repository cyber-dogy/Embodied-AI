# unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741

## 背景

- task_id: `pdit`
- experiment_name: `baseline_500`
- description: baseline 500 epoch mainline

## 本次验证什么

- 围绕 `baseline_500` 固化训练证据、结构化指标和后续可展示素材。

## 核心结果

- trial_score: `-1.0`
- collapse_detected: `True`

## 当前判断

- 归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。

## 证据索引

- `trial_record` -> `metrics/trial_record.json`
- `summary` -> `metrics/summary.json`
- `audit_report` -> `metrics/audit_report.json`
- `trial_request` -> `metrics/trial_request.json`
- `config` -> `metrics/config.json`
- `note::research_desk` -> `notes/research_desk.md`
- `note::fixes` -> `notes/fixes.md`
- `note::2026-04-07-autoresearch-pipeline-zh` -> `notes/2026-04-07-autoresearch-pipeline-zh.md`

## 大产物索引

- `run::best_success.pt` -> `/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/best_success.pt`
- `run::epochs/epoch_0500.pt` -> `/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/epochs/epoch_0500.pt`

## 后续动作

- 当前 run 已被标记为 collapse，下一步应回溯 recipe 漂移、成功率断点和保留 checkpoint。
