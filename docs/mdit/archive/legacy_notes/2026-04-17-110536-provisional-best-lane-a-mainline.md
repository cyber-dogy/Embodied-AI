# MDIT Provisional Best Freeze

- Time: 2026-04-17 11:05:36 +0800
- Run: `unplug_charger_mdit_rgb_text_3token_100`
- Experiment: `lane_a_mainline_100`
- Status: provisional best before winner is fixed

## Why This Is The Current Best

- It is the only RGB+text candidate that has already completed the locked shared audit chain.
- The audit used the same evaluation contract restored from checkpoint payload, so there is no train/eval recipe drift.
- It reached `0.55` success rate at `epoch_0100` over `20 episodes`, which is the strongest confirmed result we have on the MDIT RGB+text line so far.

## Confirmed Metrics

- `epoch_0050`: `0.25` (`5/20`)
- `epoch_0100`: `0.55` (`11/20`)
- `best_success`: `0.55 @ epoch 100`
- `mean_steps@best`: `121.75`
- `recipe_drift`: `false`
- `collapse_detected`: `false`

## Current Planning Logic

- **Anchor first**: keep a PDIT-style RGB+text baseline stable before opening wider search.
- **Immediate next experiment**: `lane_a_stabilized_100`
  - changes: `command_mode=mean_first_n`, `average_first_n=2`, `smooth_actions=true`
  - goal: reduce planner rejection and horizon exhaustion without changing RGB+text, FM, or Transformer backbone.
- **Next challenger**: `lane_b_faithful`
  - role: test a faithful alternative RGB+text input path under the same shared audit chain.
- **Promotion rule**: only candidates that beat the current best under the same 20-episode locked audit move forward as the new primary direction.

## Best Route Backup

- Frozen snapshot: `/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/autoresearch_records/frozen_best/2026-04-17-110536__lane_a_mainline_epoch100_s055`
- Stable alias: `/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/autoresearch_records/frozen_best/current_provisional_best`
- Best checkpoint backup: `/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/autoresearch_records/frozen_best/current_provisional_best/best_success.pt`
- Source run: `/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/unplug_charger_mdit_rgb_text_3token_100`

## Guardrails

- The frozen snapshot preserves `best_success.pt`, `best_valid.pt`, `epoch_0050.pt`, and `epoch_0100.pt`.
- Checkpoints inside the frozen snapshot are hard-linked, so they remain recoverable even if the original run is later cleaned by autoresearch.
- Later candidates are allowed to replace the provisional best only after they beat it on the same locked audit path.
