# unplug_charger_mdit_rgb_text_3token_100

## 背景

- task_id: `mdit`
- experiment_name: `lane_a_mainline_100`
- description: Lane A mainline: 5RGB + text + CLIP last-block + PDIT FM/DiT semantics

## 本次验证什么

- 围绕 `lane_a_mainline_100` 固化训练证据、结构化指标和后续可展示素材。

## 核心结果

- trial_score: `0.55`
- best_success_rate: `0.55`
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

- `run::best_success.pt` -> `/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/unplug_charger_mdit_rgb_text_3token_100/best_success.pt`
- `run::best_valid.pt` -> `/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/unplug_charger_mdit_rgb_text_3token_100/best_valid.pt`
- `run::epochs/epoch_0050.pt` -> `/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/unplug_charger_mdit_rgb_text_3token_100/epochs/epoch_0050.pt`
- `run::epochs/epoch_0100.pt` -> `/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/unplug_charger_mdit_rgb_text_3token_100/epochs/epoch_0100.pt`
- `run::latest.pt` -> `/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/unplug_charger_mdit_rgb_text_3token_100/latest.pt`

## 后续动作

- 继续补齐 report/assets 并再决定是否同步到 homepage。
