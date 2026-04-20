# MDIT Reference Line

这不是一份可直接部署的冠军 ckpt，而是一份稳定保存下来的 `0.75@300/500` 方法参考线。

## 角色

- 参考线类型：`reference_method_line`
- 线路：`lane_a_mainline`
- 任务：`unplug_charger`
- 证据来源：`unplug_charger_mdit_rgb_text_3token_100__lane_a_mainline_500_resume__e0500__20260418_005723`

## 已确认结果

- `success@epoch_0300 = 0.75`
- `success@epoch_0500 = 0.75`
- `best_success_rate = 0.75`
- `best_success_epoch = 300`

## 重要说明

- 原始 `0.75` 长训 ckpt 目录已经因历史清理漏洞丢失。
- 这里固化的是“方法和证据”，不是原始 `epoch_0300.pt / epoch_0500.pt` 权重本体。
- 当前仍可直接使用的实际 ckpt 锚点在：`/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/autoresearch_records/frozen_best/2026-04-17-110536__lane_a_mainline_epoch100_s055`

## 推荐用途

- 作为后续 MDIT 复训的参考 recipe
- 作为 autoresearch 的 incumbent 方法线
- 作为复盘 `0.55@100 -> 0.75@300/500` 提升路径的稳定证据
