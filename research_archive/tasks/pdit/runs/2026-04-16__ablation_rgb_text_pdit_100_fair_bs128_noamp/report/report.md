# ablation_rgb_text_pdit_100_fair_bs128_noamp

## 背景

- task_id: `pdit`
- experiment_name: `ablation_cross_rgb5text_pdit_adapter_bs128_noamp_eval50_100`
- description: strict fair cross D: 5rgb+text+pdit-adapter, obs2/h100/a24, bs128, no-amp, eval@50/100

## 本次验证什么

- 围绕 `ablation_cross_rgb5text_pdit_adapter_bs128_noamp_eval50_100` 固化训练证据、结构化指标和后续可展示素材。

## 核心结果

- trial_score: `0.05`
- best_success_rate: `0.05`
- best_success_epoch: `49`
- collapse_detected: `False`

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

- 当前 run 仍处于待共享审计状态，下一步应先跑 finalize/audit 再补齐结论。
