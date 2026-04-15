# 消融实验手动执行文档

**日期**：2026-04-15
**分支**：`autoresearch/20260409-mdit`（所有代码已在主线，无需切换分支）
**机器**：RTX 5090 24GB，已安装 RLBench
**目标**：交叉验证 MDIT 0.2 低成功率根本原因

---

## 实验配置速查

| 参数                    | pcd_mdit                               | rgb_text_pdit                               |
| ----------------------- | -------------------------------------- | ------------------------------------------- |
| 输入                    | PCD（PointNet 256d）                   | 5RGB + CLIP text                            |
| Transformer             | MDIT flat AdaLN-Zero                   | PDIT DiTTrajectoryBackbone                  |
| FM 训练采样             | beta(1.5, 1.0)                         | uniform                                     |
| FM 推理                 | 50步 均匀 Euler                        | 10步 exp-decay Euler                        |
| Timestep 送入 backbone  | t∈[0,1]                               | t×20∈[0,20]                               |
| batch_size / grad_accum | 32 / 1                                 | 16 / 2                                      |
| effective batch         | 32                                     | 32                                          |
| Success eval 触发       | 每20ep（→20,40,60,80,100）            | 每20ep（→20,40,60,80,100）                 |
| WandB                   | online                                 | online                                      |
| config                  | `configs/ablation/pcd_mdit_100.json` | `configs/ablation/rgb_text_pdit_100.json` |

---

## 准备工作（执行一次）

```bash
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

# 拉取最新主线（含消融代码）
git fetch origin
git checkout autoresearch/20260409-mdit
git pull origin autoresearch/20260409-mdit

# 激活环境
source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env

# 验证配置可以加载
python -c "
from mdit.config.loader import load_config, ensure_ablation_train_config
for p in ['configs/ablation/pcd_mdit_100.json', 'configs/ablation/rgb_text_pdit_100.json']:
    cfg = load_config(p); ensure_ablation_train_config(cfg)
    print(f'OK {p}')
"
```

预期输出：

```
OK configs/ablation/pcd_mdit_100.json
OK configs/ablation/rgb_text_pdit_100.json
```

## 评估链路基准复核（强制先做）

先复核“已知高成功 PDIT checkpoint + EMA”评估链路是否正常，再跑消融。  
这一步失败时，不允许继续解释模型优劣。

```bash
source ~/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

python scripts/eval_pdit_checkpoint.py \
  --ckpt-path ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/epochs/epoch_0500.pt \
  --strategy fm \
  --episodes 20 \
  --max-steps 200 \
  --device cuda \
  --headless \
  --show-progress \
  --prefer-ema
```

期望：`success_rate` 保持高位（历史记录约 `0.85~0.95`）。  
如果明显偏离，优先排查评估链路（环境/命令/错误分桶），不要先改训练配方。

---

## 实验一：pcd_mdit（约 2~3 小时）

### tmux 会话

```bash
tmux new -s pcd_mdit
```

### 训练命令

```bash
source /opt/miniconda3/etc/profile.d/conda.sh && conda activate mdit_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

HF_HUB_OFFLINE=1 python scripts/run_mdit_autoresearch_trial.py \
  --phase full \
  --config configs/ablation/pcd_mdit_100.json \
  --stage-epochs 100 \
  --checkpoint-every 20 \
  --eval-episodes 20 \
  --device cuda \
  --experiment-name pcd_mdit_ablation \
  --run-name ablation_pcd_mdit_100 \
  --description "ablation pcd_mdit: PCD+MDIT-transformer+MDIT-FM bs32 100ep" \
  --headless \
  --show-progress \
  2>&1 | tee logs/run_pcd_mdit_100.log
```

### OOM 降级（如显存不足）

```bash
# 降到 bs=16 accum=2，effective_batch 不变
HF_HUB_OFFLINE=1 python scripts/run_mdit_autoresearch_trial.py \
  --phase full \
  --config configs/ablation/pcd_mdit_100.json \
  --stage-epochs 100 \
  --checkpoint-every 20 \
  --eval-episodes 20 \
  --device cuda \
  --experiment-name pcd_mdit_ablation \
  --run-name ablation_pcd_mdit_100 \
  --description "ablation pcd_mdit: PCD+MDIT-transformer+MDIT-FM bs16 100ep" \
  --headless \
  --show-progress \
  --set batch_size=16 \
  --set grad_accum_steps=2 \
  2>&1 | tee logs/run_pcd_mdit_100.log
```

### 查看进度

```bash
# 另开窗口实时查看
tmux new -s monitor
tail -f logs/run_pcd_mdit_100.log | grep -E "epoch|success|loss"
```

---

## 实验二：rgb_text_pdit（约 4~6 小时）

### tmux 会话

```bash
tmux new -s rgb_pdit
```

### 训练命令

```bash
source ~/miniconda3/etc/profile.d/conda.sh && conda activate mdit_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

HF_HUB_OFFLINE=1 python scripts/run_mdit_autoresearch_trial.py \
  --phase full \
  --config configs/ablation/rgb_text_pdit_100.json \
  --stage-epochs 100 \
  --checkpoint-every 20 \
  --eval-episodes 20 \
  --device cuda \
  --experiment-name rgb_text_pdit_ablation \
  --run-name ablation_rgb_text_pdit_100 \
  --description "ablation rgb_text_pdit: 5RGB+text+PDIT-backbone+PDIT-FM bs16 100ep" \
  --headless \
  --show-progress \
  2>&1 | tee logs/run_rgb_text_pdit_100.log
```

### OOM 降级（如显存不足）

```bash
# 降到 bs=8 accum=4，effective_batch 不变
HF_HUB_OFFLINE=1 python scripts/run_mdit_autoresearch_trial.py \
  --phase full \
  --config configs/ablation/rgb_text_pdit_100.json \
  --stage-epochs 100 \
  --checkpoint-every 20 \
  --eval-episodes 20 \
  --device cuda \
  --experiment-name rgb_text_pdit_ablation \
  --run-name ablation_rgb_text_pdit_100 \
  --description "ablation rgb_text_pdit: 5RGB+text+PDIT-backbone+PDIT-FM bs8 100ep" \
  --headless \
  --show-progress \
  --set batch_size=8 \
  --set grad_accum_steps=4 \
  2>&1 | tee logs/run_rgb_text_pdit_100.log
```

---

## 读取结果

两个实验结束后执行：

```bash
python -c "
import json
from pathlib import Path

runs = {
    'pcd_mdit':      'ckpt/ablation_pcd_mdit_100',
    'rgb_text_pdit': 'ckpt/ablation_rgb_text_pdit_100',
}

for name, run_dir in runs.items():
    run_dir = Path(run_dir)
    print(f'=== {name} ===')

    # valid loss
    summary = run_dir / 'summary.json'
    if summary.exists():
        d = json.loads(summary.read_text())
        print(f'  train_loss_last: {d.get(\"train_loss_last\", \"N/A\")}')
        print(f'  valid_loss_last: {d.get(\"valid_loss_last\", \"N/A\")}')

    # success eval per checkpoint
    hist = run_dir / 'success_eval_history.json'
    if hist.exists():
        records = json.loads(hist.read_text())
        print(f'  success eval history:')
        for r in records:
            ep = r.get('epoch', '?')
            sr = r.get('success_rate', r.get('success_rate_mean', '?'))
            print(f'    ep{ep:>4}: success@20 = {sr:.3f}')
    print()
"
```

---

## 汇总结果到主线

**两个实验全部结束后**执行以下步骤：

### 写入 results.tsv

用实际数值替换 `X.XXX`：

```bash
# 从 success_eval_history.json 读取最后一条（ep100）的 success_rate
PCD_SR=$(python -c "
import json
from pathlib import Path
h = Path('ckpt/ablation_pcd_mdit_100/success_eval_history.json')
records = json.loads(h.read_text())
ep100 = [r for r in records if r.get('epoch') == 100]
print(f'{ep100[0][\"success_rate\"]:.3f}' if ep100 else '?')
")

RGB_SR=$(python -c "
import json
from pathlib import Path
h = Path('ckpt/ablation_rgb_text_pdit_100/success_eval_history.json')
records = json.loads(h.read_text())
ep100 = [r for r in records if r.get('epoch') == 100]
print(f'{ep100[0][\"success_rate\"]:.3f}' if ep100 else '?')
")

echo "pcd_mdit:      success@100ep = $PCD_SR"
echo "rgb_text_pdit: success@100ep = $RGB_SR"

# 追加到 results.tsv
echo -e "pcd_mdit_ablation_100\t0d34b56\t${PCD_SR}\tDONE\tPCD+MDIT-transformer 100ep success@20" >> results.tsv
echo -e "rgb_text_pdit_ablation_100\t0d34b56\t${RGB_SR}\tDONE\t5RGB+text+PDIT-transformer 100ep success@20" >> results.tsv
```

### 写入 docs/fixes.md

```bash
cat >> docs/fixes.md << EOF

## 2026-04-15 消融实验：pcd_mdit vs rgb_text_pdit @100ep

| 实验 | success@100ep | 结论 |
|---|---|---|
| PDIT 原版（PCD + PDIT transformer）| 0.800 | 基准线 |
| pcd_mdit（PCD + MDIT transformer）| ${PCD_SR} | [见决策矩阵] |
| rgb_text_pdit（5RGB+text + PDIT transformer）| ${RGB_SR} | [见决策矩阵] |
| MDIT 主线（5RGB+text + MDIT transformer）| 0.200 | 当前起点 |

决策矩阵：
- pcd_mdit ≥ 0.60 且 rgb_text_pdit ≥ 0.60 → MDIT transformer 是根本问题，主线切 transformer_variant=pdit
- pcd_mdit ≥ 0.60 且 rgb_text_pdit < 0.30 → MDIT transformer 有问题 + RGB 是额外瓶颈
- pcd_mdit < 0.30 且 rgb_text_pdit ≥ 0.60 → MDIT transformer 问题（与输入无关），主线切 pdit backbone
- pcd_mdit < 0.30 且 rgb_text_pdit < 0.30 → 问题在训练配方，回主线做超参消融
EOF
```

### commit & push

```bash
git add results.tsv docs/fixes.md
git commit -m "$(cat <<'CMSG'
experiment: ablation results pcd_mdit and rgb_text_pdit 100ep

pcd_mdit (PCD + MDIT transformer):       success@100ep = ${PCD_SR}
rgb_text_pdit (RGB+text + PDIT transformer): success@100ep = ${RGB_SR}

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
CMSG
)"
git push origin autoresearch/20260409-mdit
```

---

## 决策矩阵

| pcd_mdit@100ep | rgb_text_pdit@100ep | 诊断结论                                 | 下一步                                                  |
| -------------- | ------------------- | ---------------------------------------- | ------------------------------------------------------- |
| ≥ 0.60        | ≥ 0.60             | MDIT transformer 是根因，RGB 输入可用    | 主线改 `transformer_variant=pdit`，继续 RGB+PDIT 路线 |
| ≥ 0.60        | < 0.30              | MDIT transformer 有问题 + RGB 是独立瓶颈 | 先换 transformer，再研究 RGB 增强（数据增广/更多相机）  |
| < 0.30         | ≥ 0.60             | MDIT transformer 问题（与输入无关）      | 主线换 PDIT backbone，保留 RGB 输入                     |
| < 0.30         | < 0.30              | 问题不在 transformer，在训练配方         | 回主线做 LR / horizon / batch 消融                      |

---

## WandB 观察指标

项目：`autodl-unplug-charger-mdit`
两个 run 名：`ablation_pcd_mdit_100` / `ablation_rgb_text_pdit_100`

重点关注：

- `train/loss_total` vs `valid/loss_total`（是否收敛/过拟合）
- `success_rate`（每20ep，含ep40/80/100）
- `valid/loss_grip` + `valid/grip_transition_acc`（夹爪是否学会）
