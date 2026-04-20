# ablation_rgb_text_pdit_100_fair_bs128_noamp_fix_v2

## 背景

- task_id: `pdit`
- experiment_name: `ablation_rgb5text_pdit_adapter_bs128_noamp_fix_v2`
- description: rgb+text+pdit-adapter bs128 noamp eval@50/100 with action-alignment fix and legacy-interface cleanup

## 本次验证什么

- 围绕 `ablation_rgb5text_pdit_adapter_bs128_noamp_fix_v2` 固化训练证据、结构化指标和后续可展示素材。

## 核心结果

- trial_score: `-1.0`
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
