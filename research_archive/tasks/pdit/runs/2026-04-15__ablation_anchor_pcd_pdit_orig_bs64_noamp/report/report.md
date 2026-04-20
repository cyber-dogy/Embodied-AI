# ablation_anchor_pcd_pdit_orig_bs64_noamp

## 背景

- task_id: `pdit`
- experiment_name: `ablation_anchor_pcd_pdit_orig_bs64_noamp_eval50_100`
- description: strict fair anchor A: original pdit line, pcd+pdit, bs64, no-amp, eval@50/100

## 本次验证什么

- 围绕 `ablation_anchor_pcd_pdit_orig_bs64_noamp_eval50_100` 固化训练证据、结构化指标和后续可展示素材。

## 核心结果

- trial_score: `-1.0`
- collapse_detected: `True`

## 当前判断

- 归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。

## 证据索引

- `trial_record` -> `metrics/trial_record.json`
- `summary` -> `metrics/summary.json`
- `trial_request` -> `metrics/trial_request.json`
- `config` -> `metrics/config.json`
- `note::research_desk` -> `notes/research_desk.md`
- `note::fixes` -> `notes/fixes.md`
- `note::2026-04-07-autoresearch-pipeline-zh` -> `notes/2026-04-07-autoresearch-pipeline-zh.md`
- `note::2026-04-07-autoresearch-pipeline` -> `notes/2026-04-07-autoresearch-pipeline.md`

## 大产物索引

- `run::best_valid.pt` -> `/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/ablation_anchor_pcd_pdit_orig_bs64_noamp/best_valid.pt`
- `run::epochs/epoch_0050.pt` -> `/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/ablation_anchor_pcd_pdit_orig_bs64_noamp/epochs/epoch_0050.pt`
- `run::epochs/epoch_0100.pt` -> `/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/ablation_anchor_pcd_pdit_orig_bs64_noamp/epochs/epoch_0100.pt`

## 后续动作

- 当前 run 已被标记为 collapse，下一步应回溯 recipe 漂移、成功率断点和保留 checkpoint。
