# collapse_run

## 背景

- task_id: `mdit`
- experiment_name: `collapse_run`
- description: 未填写

## 本次验证什么

- 围绕 `collapse_run` 固化训练证据、结构化指标和后续可展示素材。

## 核心结果

- trial_score: `-1.0`
- best_success_rate: `0.75`
- best_success_epoch: `300`
- collapse_detected: `True`

## 当前判断

- 归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。

## 证据索引

- `trial_record` -> `metrics/trial_record.json`
- `summary` -> `metrics/summary.json`
- `audit_report` -> `metrics/audit_report.json`
- `experiment_manifest` -> `metrics/experiment_manifest.json`
- `trial_request` -> `metrics/trial_request.json`
- `config` -> `metrics/config.json`
- `note::research_desk` -> `notes/research_desk.md`
- `note::fixes` -> `notes/fixes.md`

## 大产物索引

- `run::best_success.pt` -> `/tmp/tmpuvw5go7c/ckpt/collapse_run/best_success.pt`
- `run::best_valid.pt` -> `/tmp/tmpuvw5go7c/ckpt/collapse_run/best_valid.pt`
- `run::epochs/epoch_0300.pt` -> `/tmp/tmpuvw5go7c/ckpt/collapse_run/epochs/epoch_0300.pt`
- `run::epochs/epoch_0500.pt` -> `/tmp/tmpuvw5go7c/ckpt/collapse_run/epochs/epoch_0500.pt`
- `run::latest.pt` -> `/tmp/tmpuvw5go7c/ckpt/collapse_run/latest.pt`

## 后续动作

- 当前 run 已被标记为 collapse，下一步应回溯 recipe 漂移、成功率断点和保留 checkpoint。
