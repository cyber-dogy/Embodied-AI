# MDIT Stable Artifacts

- Updated: 2026-04-19T12:10:00+08:00

## Actual CKPT Anchor

- Alias: `/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/mdit_best`
- Target: `/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/autoresearch_records/frozen_best/2026-04-17-110536__lane_a_mainline_epoch100_s055`
- Role: 当前仍可直接加载、评估、续训的实际 MDIT ckpt 锚点
- Best checkpoint: `/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/mdit_best/best_success.pt`
- Shared audit: `0.55 @ epoch_0100`
- Audit report: `/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/mdit_best/audit_report.json`
- Manifest: `/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/mdit_best/experiment_manifest.json`

## Reference Method Line

- Reference dir: `/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/mdit_reference_line`
- Metadata: `/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/mdit_reference_line.json`
- Role: `0.75@300/500` 的 MDIT 方法参考线
- Shared audit result: `success@epoch_0300 = 0.75`，`success@epoch_0500 = 0.75`
- Best shared success: `0.75 @ epoch_0300`
- Source record: `/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/autoresearch_records/unplug_charger_mdit_rgb_text_3token_100__lane_a_mainline_500_resume__e0500__20260418_005723.json`
- Reference recipe: `/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/mdit_reference_line/reference_line.json`
- Reference audit: `/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/mdit_reference_line/reference_audit_report.json`
- Important note: 原始 `epoch_0300.pt / epoch_0500.pt` 长训 ckpt 已因历史清理漏洞丢失；这里固化的是方法、审计证据和复训 recipe，不是原始权重本体。

## Recommended Usage

- 需要直接加载权重、继续续训或做部署验证时，用 `ckpt/mdit_best`
- 需要回看 `0.75` 这条线到底怎么训出来、后续按同方法重跑时，用 `ckpt/mdit_reference_line`
