# PDIT vs MDIT

这份文档用来快速区分当前仓库里的两条研究线。

## PDIT

- 输入模态：点云为主
- 目标函数：Flow Matching / Diffusion
- 条件形式：`obs token -> trajectory backbone`
- 当前状态：已验证稳定，当前金标准
- 当前 best：`100 episodes = 0.85`

## MDIT

- 输入模态：RGB + text + state
- 目标函数：faithful MultiTask DiT 风格 Flow Matching
- 条件形式：`vision + text + state -> flat conditioning vector`
- 当前状态：独立研究线，正在 bring-up 和 autoresearch
- 目标：在 `100 episodes` 上严格超过 `pdit 0.85`

## 为什么要并列而不是兼容

原因很简单：

- `pdit` 已经是稳定强基线，不应该为了迁就 `mdit` 改坏
- faithful `mdit` 本身有不同的条件注入和训练假设
- 如果强行兼容，最后很容易得到一条既不像 `pdit` 也不像 `mdit` 的混合线

所以现在的原则是：

- `pdit` 继续做稳定对照组
- `mdit` 独立实现、独立调参、独立评估
- 只有当 `mdit` 在行为结果上真正胜出，才讨论是否把它升级成新的默认方案
