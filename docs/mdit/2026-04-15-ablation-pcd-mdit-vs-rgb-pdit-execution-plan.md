# 消融实验执行计划：pcd_mdit vs rgb_text_pdit

**创建日期**：2026-04-15  
**执行机器**：RTX 5090，已安装 RLBench，可做 success eval  
**目标**：交叉验证 MDIT 主线（0.2 @ 100ep）低成功率的根本原因——transformer 结构还是输入模态

---

## 背景与假设

| 已知结果 | 成功率 |
|---|---|
| PDIT 原版（PCD + PDIT DiT transformer） | ~0.80 @ 100ep |
| MDIT 主线（5RGB+text + MDIT flat AdaLN transformer） | ~0.20 @ 100ep |

**两个消融实验**：

| 分支 | 输入 | Transformer | FM | 验证假设 |
|---|---|---|---|---|
| `ablation/pcd_mdit` | PCD（PointNet） | MDIT flat AdaLN-Zero | MDIT FM（beta，50步） | 换掉 transformer，PCD 还能高吗？→ 判断 MDIT transformer 是否有问题 |
| `ablation/rgb_text_pdit` | 5RGB+text（5×CLIP ViT） | PDIT DiTTrajectoryBackbone | PDIT FM（uniform，exp-schedule，10步） | 换掉 transformer，RGB 能高吗？→ 判断 RGB 输入是否是瓶颈 |

---

## Part 1：环境准备（在目标机器执行一次）

```bash
# 1. 进入项目目录
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

# 2. 拉取所有新分支
git fetch origin
git checkout ablation/pcd_mdit
git pull origin ablation/pcd_mdit
git checkout ablation/rgb_text_pdit
git pull origin ablation/rgb_text_pdit

# 3. 验证分支存在
git branch | grep ablation

# 4. 激活环境
source ~/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env

# 5. 快速验证两个 config 能加载（无需 GPU）
python -c "
from mdit.config.loader import load_config, ensure_ablation_train_config
for path in ['configs/ablation/pcd_mdit_100.json', 'configs/ablation/rgb_text_pdit_100.json']:
    cfg = load_config(path)
    ensure_ablation_train_config(cfg)
    print(f'OK: {path} | transformer={cfg.transformer_variant} | use_pcd={cfg.use_pcd}')
"
```

预期输出：
```
OK: configs/ablation/pcd_mdit_100.json | transformer=mdit | use_pcd=True
OK: configs/ablation/rgb_text_pdit_100.json | transformer=pdit | use_pcd=False
```

---

## Part 2：实验一 — pcd_mdit（100 epoch）

### 切分支

```bash
git checkout ablation/pcd_mdit
```

### 训练命令

```bash
source ~/miniconda3/etc/profile.d/conda.sh && conda activate mdit_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

RUN_NAME="ablation_pcd_mdit_100ep"

HF_HUB_OFFLINE=1 python scripts/run_mdit_autoresearch_trial.py \
  --phase full \
  --config configs/ablation/pcd_mdit_100.json \
  --stage-epochs 100 \
  --checkpoint-every 20 \
  --eval-episodes 20 \
  --device cuda \
  --experiment-name pcd_mdit_ablation_100 \
  --run-name "$RUN_NAME" \
  --description "ablation: PCD input + MDIT flat AdaLN transformer + MDIT FM beta 50steps" \
  --headless \
  --show-progress \
  2>&1 | tee run_pcd_mdit_100.log
```

### 训练结束后读取结果

```bash
python -c "
import json
from pathlib import Path
p = Path('ckpt/ablation_pcd_mdit_100ep/summary.json')
d = json.loads(p.read_text())
print('train_loss_last:', d.get('train_loss_last'))
print('valid_loss_last:', d.get('valid_loss_last'))
"

# success eval 结果在此文件
cat ckpt/ablation_pcd_mdit_100ep/success_eval_history.json | python -m json.tool | tail -30
```

---

## Part 3：实验二 — rgb_text_pdit（100 epoch）

### 切分支

```bash
git checkout ablation/rgb_text_pdit
```

### 训练命令

```bash
source ~/miniconda3/etc/profile.d/conda.sh && conda activate mdit_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

RUN_NAME="ablation_rgb_text_pdit_100ep"

HF_HUB_OFFLINE=1 python scripts/run_mdit_autoresearch_trial.py \
  --phase full \
  --config configs/ablation/rgb_text_pdit_100.json \
  --stage-epochs 100 \
  --checkpoint-every 20 \
  --eval-episodes 20 \
  --device cuda \
  --experiment-name rgb_text_pdit_ablation_100 \
  --run-name "$RUN_NAME" \
  --description "ablation: 5RGB+text + PDIT DiTTrajectory backbone + PDIT FM uniform+exp" \
  --headless \
  --show-progress \
  2>&1 | tee run_rgb_text_pdit_100.log
```

### 训练结束后读取结果

```bash
python -c "
import json
from pathlib import Path
p = Path('ckpt/ablation_rgb_text_pdit_100ep/summary.json')
d = json.loads(p.read_text())
print('train_loss_last:', d.get('train_loss_last'))
print('valid_loss_last:', d.get('valid_loss_last'))
"

cat ckpt/ablation_rgb_text_pdit_100ep/success_eval_history.json | python -m json.tool | tail -30
```

---

## Part 4：结果汇总回 MDIT 主线

**两个实验全部跑完后**，执行以下步骤将结论写回主线。

### Step 1：切回主线

```bash
git checkout autoresearch/20260409-mdit
```

### Step 2：写入 results.tsv

格式为：`experiment\tcommit\tsuccess@20\tstatus\tdescription`

```bash
# 示例（将 X.XX 替换为实际数值）
echo -e "pcd_mdit_100\tce4bb17\t0.XX\tDONE\tPCD+MDIT-transformer 100ep success@20" >> results.tsv
echo -e "rgb_text_pdit_100\t02bc489\t0.XX\tDONE\t5RGB+text+PDIT-transformer 100ep success@20" >> results.tsv
```

### Step 3：写入 docs/fixes.md

在 `docs/fixes.md` 末尾追加一条：

```markdown
## 2026-04-15 消融实验结果：pcd_mdit vs rgb_text_pdit

| 实验 | success@20 | valid_loss | 结论 |
|---|---|---|---|
| PDIT 原版（PCD + PDIT transformer） | 0.80 | - | 基准线 |
| pcd_mdit（PCD + MDIT transformer） | X.XX | X.XXX | [填写] |
| rgb_text_pdit（RGB+text + PDIT transformer） | X.XX | X.XXX | [填写] |
| MDIT 主线（RGB+text + MDIT transformer） | 0.20 | - | 当前问题基准 |

**结论**：[agent 根据数据填写]
**下一步方向**：[agent 根据矩阵分析填写]
```

### Step 4：提交到主线

```bash
git add results.tsv docs/fixes.md
git commit -m "experiment: ablation results pcd_mdit and rgb_text_pdit 100ep

pcd_mdit success@20: X.XX (PCD input + MDIT transformer)
rgb_text_pdit success@20: X.XX (RGB+text + PDIT transformer)
Conclusion: [填写根本原因]

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
git push origin autoresearch/20260409-mdit
```

---

## Part 5：结果解读矩阵（agent 决策依据）

执行完后按下表判断：

| pcd_mdit | rgb_text_pdit | 结论 | 下一步 |
|---|---|---|---|
| ≥0.60 | ≥0.60 | MDIT transformer 是问题根源，RGB 输入可行 | 主线切换至 PDIT transformer（`transformer_variant=pdit`） |
| ≥0.60 | ＜0.30 | MDIT transformer 是问题，同时 RGB 也是瓶颈 | 先解决 transformer，再研究 RGB 增强 |
| ＜0.30 | ≥0.60 | MDIT transformer 本身是问题（与输入无关）；RGB+PDIT 可行 | 主线切换 PDIT transformer |
| ＜0.30 | ＜0.30 | 问题不在 transformer，在训练配方（LR/batch/horizon 等） | 回到 MDIT 主线做超参消融 |

---

## 关键文件路径

| 用途 | 路径 |
|---|---|
| 实验一配置 | `configs/ablation/pcd_mdit_100.json` |
| 实验二配置 | `configs/ablation/rgb_text_pdit_100.json` |
| 实验一分支 | `ablation/pcd_mdit` (commit `ce4bb17`) |
| 实验二分支 | `ablation/rgb_text_pdit` (commit `02bc489`) |
| 主线分支 | `autoresearch/20260409-mdit` |
| 结果记录 | `results.tsv` |
| 修复记录 | `docs/fixes.md` |
| Remote | `git@github.com:cyber-dogy/Embodied-AI.git` |

---

## 执行纪律

- **两个实验必须在各自分支上运行**，不能混用配置
- **不允许在消融分支上改代码**，发现 bug 先记录，回主线后再修
- **每个实验独立 `run_name`**，ckpt 目录不能重叠
- 实验完成后**必须切回主线**再写 results.tsv 和 fixes.md
- success@20 数值必须来自 `success_eval_history.json`，不能用 valid_loss 代替
