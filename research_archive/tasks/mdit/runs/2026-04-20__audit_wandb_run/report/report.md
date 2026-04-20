# audit_wandb_run

## 背景

- task_id: `mdit`
- experiment_name: `audit_wandb_run`
- description: 未填写

## 本次验证什么

- 围绕 `audit_wandb_run` 固化训练证据、结构化指标和后续可展示素材。

## 核心结果

- trial_score: `0.6`
- best_success_rate: `0.6`
- best_success_epoch: `100`
- collapse_detected: `False`

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

- `run::best_success.pt` -> `/tmp/tmp1rgr6a63/ckpt/audit_wandb_run/best_success.pt`
- `run::best_valid.pt` -> `/tmp/tmp1rgr6a63/ckpt/audit_wandb_run/best_valid.pt`
- `run::epochs/epoch_0100.pt` -> `/tmp/tmp1rgr6a63/ckpt/audit_wandb_run/epochs/epoch_0100.pt`
- `run::latest.pt` -> `/tmp/tmp1rgr6a63/ckpt/audit_wandb_run/latest.pt`

## 后续动作

- 继续补齐 report/assets 并再决定是否同步到 homepage。
