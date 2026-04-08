# Autoresearch Pipeline

当前推荐的实验流水线是两阶段：

1. `train-only`
2. `audit-only`

原因：
- RLBench/CoppeliaSim 在 notebook/ipykernel 里容易卡住
- 训练和 rollout 评估分进程更稳定
- ckpt 选择必须看 audit success，而不是只看 `best_valid.pt`

## 训练

```bash
python scripts/run_autoresearch_trial.py \
  --phase train-only \
  --config configs/fm_autodl_lab.json \
  --strategy fm \
  --stage-epochs 500 \
  --checkpoint-every 100 \
  --experiment-name baseline_500_retrain \
  --no-enable-wandb
```

## 离线 audit

```bash
python scripts/run_autoresearch_trial.py \
  --phase audit-only \
  --run-dir ckpt/<run_name> \
  --eval-episodes 20 \
  --audit-timeout-sec 10800 \
  --headless
```

## artifact 规则

- 大权重不进入 GitHub
- 本地权重位置和 hash 见：
  - [top10-checkpoint-manifest.json](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/top10-checkpoint-manifest.json)
- 当前 canonical best ckpt：
  - `baseline_500 / epoch_0500.pt`
