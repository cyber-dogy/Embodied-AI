# unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__h1_fixed_stats_aug_100__e0100__20260408_124213

## 背景

- task_id: `pdit`
- experiment_name: `h1_fixed_stats_aug_100`
- description: h1 retry with fixed SE3 augmentation semantics

## 本次验证什么

- 围绕 `h1_fixed_stats_aug_100` 固化训练证据、结构化指标和后续可展示素材。

## 核心结果

- trial_score: `-1.0`
- best_success_rate: `0.35`
- best_success_epoch: `100`
- collapse_detected: `True`

## 当前判断

- 归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。

## 证据索引

- `trial_record` -> `metrics/trial_record.json`
- `note::research_desk` -> `notes/research_desk.md`
- `note::fixes` -> `notes/fixes.md`
- `note::2026-04-07-autoresearch-pipeline-zh` -> `notes/2026-04-07-autoresearch-pipeline-zh.md`
- `note::2026-04-07-autoresearch-pipeline` -> `notes/2026-04-07-autoresearch-pipeline.md`
- `note::2026-04-07-training-model-audit-zh` -> `notes/2026-04-07-training-model-audit-zh.md`
- `note::2026-04-07-training-model-audit` -> `notes/2026-04-07-training-model-audit.md`
- `note::2026-04-08-fm-recovery-progress-zh` -> `notes/2026-04-08-fm-recovery-progress-zh.md`

## 大产物索引

- 当前批次没有只索引未复制的大文件。

## 后续动作

- 当前 run 已被标记为 collapse，下一步应回溯 recipe 漂移、成功率断点和保留 checkpoint。
