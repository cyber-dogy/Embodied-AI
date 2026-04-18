window.homepageData = {
  "generated_at": "2026-04-18T19:05:58+08:00",
  "site": {
    "title": "GJW · Embodied AI Lab Notes",
    "slogan": "把实验、修复与主线推进整理成清晰可追溯的研究档案。",
    "description": "围绕 unplug charger 任务的策略训练、行为审计、主线比较与执行资料。"
  },
  "stats": {
    "task_count": 5,
    "branch_count": 4,
    "timeline_count": 25,
    "validated_rows": 9
  },
  "home": {
    "done_groups": [
      {
        "date": "2026-04-09",
        "cards": [
          {
            "date": "2026-04-09",
            "group": "done",
            "task_id": "pdit-anchor",
            "branch_ids": [
              "pdit"
            ],
            "badge": "PDIT 主线",
            "title": "PDIT baseline 在 500 epoch 锚定 0.95@20 / 0.85@100",
            "summary": "修复训练与审计链后，点云主线不再在 300-500 epoch 崩塌，当前最强策略已经有 20 回合与 100 回合两轮复核。",
            "metrics": [
              {
                "label": "success@20",
                "value": "0.95"
              },
              {
                "label": "100 回合复核",
                "value": "0.85"
              },
              {
                "label": "锚点",
                "value": "@500"
              }
            ],
            "meta": "PDIT 基线恢复与锚点固化",
            "path": "homepage/tasks/pdit-anchor/"
          }
        ]
      },
      {
        "date": "2026-04-08",
        "cards": [
          {
            "date": "2026-04-08",
            "group": "done",
            "task_id": "pdit-anchor",
            "branch_ids": [
              "pdit"
            ],
            "badge": "Baseline Recovery",
            "title": "点云训练栈修稳后，Baseline@100 重新回到 0.90 success@20",
            "summary": "这一天的核心不是又跑了一次实验，而是把导致历史结论失真的训练、保存和审计问题真正修通了。",
            "metrics": [
              {
                "label": "success@100",
                "value": "0.90"
              },
              {
                "label": "关键修复",
                "value": "6"
              },
              {
                "label": "best valid",
                "value": "0.661"
              }
            ],
            "meta": "从“学不会”转向“后期如何稳住”",
            "path": "homepage/tasks/pdit-anchor/"
          }
        ]
      },
      {
        "date": "2026-04-02",
        "cards": [
          {
            "date": "2026-04-02",
            "group": "done",
            "task_id": "dummy-sim2real-platform",
            "branch_ids": [
              "robot-platform"
            ],
            "badge": "Sim2Real 平台",
            "title": "六轴臂 Sim2Real 采集平台固化完成",
            "summary": "把仿真-真机映射、影子规划、连续示教、数值 IK 和总线保护整合成一套可直接承接模仿学习与世界模型数据采集的六轴臂实验平台。",
            "metrics": [
              {
                "label": "机械臂",
                "value": "6 轴"
              },
              {
                "label": "示教录制",
                "value": "10 Hz"
              },
              {
                "label": "Demo",
                "value": "3 个"
              }
            ],
            "meta": "已完成 · 具身采集平台",
            "path": "homepage/tasks/dummy-sim2real-platform/"
          }
        ]
      }
    ],
    "in_progress_groups": [
      {
        "date": "2026-04-18",
        "cards": [
          {
            "date": "2026-04-18",
            "group": "in_progress",
            "task_id": "mdit-mainline",
            "branch_ids": [
              "mdit"
            ],
            "badge": "MDIT 主线",
            "title": "MDIT 主线恢复 100→500 续训接管",
            "summary": "严格 MTDP 对照没有通过共享审计后，研究预算被收回到唯一过审的 RGB+Text 主线，并把 100→500 续训兼容与 supervisor 一起修通。",
            "metrics": [
              {
                "label": "当前锚点",
                "value": "0.55@100"
              },
              {
                "label": "续训目标",
                "value": "500"
              },
              {
                "label": "状态",
                "value": "恢复中"
              }
            ],
            "meta": "主线从筛选期进入长训接管期",
            "path": "homepage/tasks/mdit-mainline/"
          }
        ]
      },
      {
        "date": "2026-04-17",
        "cards": [
          {
            "date": "2026-04-17",
            "group": "in_progress",
            "task_id": "mdit-mainline",
            "branch_ids": [
              "mdit"
            ],
            "badge": "RGB+Text Anchor",
            "title": "RGB+Text 当前锚点固定为 0.55@100，所有对照暂未越线",
            "summary": "共享 audit 下的 0.55@100 成为当前唯一可信锚点，平滑动作对照和 faithful recipe 对照的首轮推进都没能完成接管。",
            "metrics": [
              {
                "label": "epoch 50",
                "value": "0.25"
              },
              {
                "label": "epoch 100",
                "value": "0.55"
              },
              {
                "label": "对照线",
                "value": "2"
              }
            ],
            "meta": "研究线开始从扩散筛选重新收束",
            "path": "homepage/tasks/mdit-mainline/"
          }
        ]
      },
      {
        "date": "2026-04-12",
        "cards": [
          {
            "date": "2026-04-12",
            "group": "in_progress",
            "task_id": "lelan-pipeline",
            "branch_ids": [
              "lelan"
            ],
            "badge": "LeLaN",
            "title": "LeLaN 自动研究链路完成首轮固化",
            "summary": "先把 5 路 RGB、3 帧观测、8 步动作的主线配方，以及 EMA / eval 双路径和 autoresearch 留痕规范一起固定下来，为后续正式 run 做好底座。",
            "metrics": [
              {
                "label": "观测帧",
                "value": "3"
              },
              {
                "label": "动作步数",
                "value": "8"
              },
              {
                "label": "100 epoch gate",
                "value": "0.45"
              }
            ],
            "meta": "当前还是工程铺设期，结果页会在正式 run 后变厚",
            "path": "homepage/tasks/lelan-pipeline/"
          }
        ]
      }
    ],
    "current_focus": {
      "date": "2026-04-18",
      "group": "in_progress",
      "task_id": "mdit-mainline",
      "branch_ids": [
        "mdit"
      ],
      "badge": "MDIT 主线",
      "title": "MDIT 主线恢复 100→500 续训接管",
      "summary": "严格 MTDP 对照没有通过共享审计后，研究预算被收回到唯一过审的 RGB+Text 主线，并把 100→500 续训兼容与 supervisor 一起修通。",
      "metrics": [
        {
          "label": "当前锚点",
          "value": "0.55@100"
        },
        {
          "label": "续训目标",
          "value": "500"
        },
        {
          "label": "状态",
          "value": "恢复中"
        }
      ],
      "meta": "主线从筛选期进入长训接管期",
      "path": "homepage/tasks/mdit-mainline/"
    }
  },
  "tasks": [
    {
      "id": "dummy-sim2real-platform",
      "title": "六轴臂 Sim2Real 采集平台搭建",
      "summary": "把六轴机械臂的仿真-真机映射、示教回放、正逆运动学控制和总线保护整合成一套可直接承接模仿学习与世界模型的数据采集实验平台。",
      "status": "已完成",
      "status_group": "done",
      "page_path": "homepage/tasks/dummy-sim2real-platform/",
      "branch_ids": [
        "robot-platform"
      ],
      "latest_update": "2026-04-02",
      "hero_metrics": [
        {
          "label": "机械臂",
          "value": "6 轴"
        },
        {
          "label": "IK 精度",
          "value": "< 8 mm"
        },
        {
          "label": "Demo",
          "value": "3 个"
        }
      ],
      "report_intro": "这条项目线已经完成平台搭建并固化到“已完成”区：它把六轴臂的 Sim2Real 映射、示教轨迹采集、正逆运动学控制和总线保护整理成了一套可直接复用的具身学习数据采集平台。",
      "summary_cards": [
        {
          "eyebrow": "Sim2Real",
          "title": "六轴运动映射和数字孪生同步已经打通",
          "body": "把单位制、轴向符号和 J3 的 90° 零位偏置统一进 firmware_to_urdf()，再用 EMA 平滑把真机状态稳定映射到 MuJoCo 侧，真机与仿真终于站到同一坐标口径上。",
          "metrics": [
            {
              "label": "映射轴数",
              "value": "6"
            },
            {
              "label": "仿真同步",
              "value": "20 Hz"
            },
            {
              "label": "J3 偏置",
              "value": "90°"
            }
          ]
        },
        {
          "eyebrow": "Planning",
          "title": "仿真规划、影子预览和示教回放连成了同一条轨迹链路",
          "body": "主体、影子和 IK 各自独立持有 MuJoCo 模型，真机监控与规划预览可以同屏共存；示教则改成带时间戳的连续轨迹记录，天然兼容模仿学习数据格式。",
          "metrics": [
            {
              "label": "影子模型",
              "value": "3 套"
            },
            {
              "label": "示教录制",
              "value": "10 Hz"
            },
            {
              "label": "轨迹压缩",
              "value": "RDP"
            }
          ]
        },
        {
          "eyebrow": "Kinematics",
          "title": "MuJoCo FK 与数值 IK 已经形成闭环控制接口",
          "body": "FK 直接复用 MuJoCo 的完整几何模型，IK 用 L-BFGS-B 和多初始猜测在关节限位内求解目标位姿，再把结果回写到影子预览与真机执行，形成可直接接入模仿学习和世界模型的动作接口。",
          "metrics": [
            {
              "label": "IK 精度",
              "value": "< 8 mm"
            },
            {
              "label": "初始猜测",
              "value": "6 组"
            },
            {
              "label": "FK 引擎",
              "value": "MuJoCo"
            }
          ]
        },
        {
          "eyebrow": "Safety",
          "title": "CAN 限流和示教边界保护把平台从能跑推进到可复用",
          "body": "采样间隔、回放频率、超时保护、RDP 稀疏化和示教退出回退机制补齐后，轨迹回放不再轻易挤爆总线，现场示教也更适合作为长期复用的数据采集流程。",
          "metrics": [
            {
              "label": "最小采样",
              "value": "50 ms"
            },
            {
              "label": "回放上限",
              "value": "20 Hz"
            },
            {
              "label": "双层保护",
              "value": "已补齐"
            }
          ]
        }
      ],
      "timeline_groups": [
        {
          "date": "2026-04-02",
          "cards": [
            {
              "badge": "Safety",
              "title": "补齐 CAN 限流与示教退出保护，平台状态正式固化",
              "summary": "采样节奏、回放上限、超时保护、RDP 稀疏化和退出示教时的平滑回退全部补齐后，这套六轴臂平台不再只是能演示，而是具备长期复用的数据采集稳定性。",
              "metrics": [
                {
                  "label": "阶段",
                  "value": "04"
                },
                {
                  "label": "最小采样",
                  "value": "50 ms"
                },
                {
                  "label": "回放上限",
                  "value": "20 Hz"
                }
              ],
              "outcome": "平台从“功能打通”走到了“可以稳定拿来做真机轨迹采集”的状态，因此被固定进已完成区。",
              "links": [
                {
                  "title": "CAN 通信保护总结",
                  "path": "homepage/external/dummy_controller/CAN_PROTECTION_SUMMARY.md"
                },
                {
                  "title": "示教边界与退出处理",
                  "path": "homepage/external/dummy_controller/TEACH_BOUNDARY_COMPLETE.md"
                }
              ]
            }
          ]
        },
        {
          "date": "2026-03-28",
          "cards": [
            {
              "badge": "Kinematics",
              "title": "用 MuJoCo 正解与数值逆解建立末端闭环控制",
              "summary": "FK 直接复用 MuJoCo 的完整几何与 site 定义，IK 则用 L-BFGS-B 在关节限位内做多初始猜测优化，把“目标位姿 → 逆解 → 影子预览 → 真机下发”串成闭环。",
              "metrics": [
                {
                  "label": "阶段",
                  "value": "03"
                },
                {
                  "label": "IK 精度",
                  "value": "< 8 mm"
                },
                {
                  "label": "初始猜测",
                  "value": "6 组"
                }
              ],
              "outcome": "这套平台已经具备服务模仿学习和世界模型的数据接口，不再只是一个可视化控制 Demo。",
              "links": [
                {
                  "title": "项目总览",
                  "path": "homepage/external/dummy_controller/INTERVIEW_TECH_DOC.md"
                },
                {
                  "title": "正逆运动学技术文档",
                  "path": "homepage/external/dummy_controller/docs/技术文档_正逆运动学与示教系统.md"
                }
              ]
            }
          ]
        },
        {
          "date": "2026-03-22",
          "cards": [
            {
              "badge": "Planning",
              "title": "把仿真规划与示教录制做成连续轨迹链路",
              "summary": "通过主体 / 影子 / IK 三套模型隔离运行状态，让规划预览和真机监控能够同屏；同时把示教记录改成带时间戳的 10 Hz 连续轨迹，并接入 RDP 稀疏化与按节奏回放。",
              "metrics": [
                {
                  "label": "阶段",
                  "value": "02"
                },
                {
                  "label": "模型数",
                  "value": "3"
                },
                {
                  "label": "示教录制",
                  "value": "10 Hz"
                }
              ],
              "outcome": "规划、示教和回放开始共享同一种轨迹格式，这一步已经非常接近模仿学习数据采集。",
              "links": [
                {
                  "title": "项目总览",
                  "path": "homepage/external/dummy_controller/INTERVIEW_TECH_DOC.md"
                }
              ]
            }
          ]
        },
        {
          "date": "2026-03-15",
          "cards": [
            {
              "badge": "Sim2Real",
              "title": "打通六轴映射与真机-仿真数字孪生同步",
              "summary": "围绕单位制、轴向符号和零位偏置统一出一套 firmware_to_urdf() 映射，再用 EMA 平滑把真机轮询稳定映射成 MuJoCo 侧的连续显示，解决了数字孪生最先卡住的坐标系问题。",
              "metrics": [
                {
                  "label": "阶段",
                  "value": "01"
                },
                {
                  "label": "六轴映射",
                  "value": "已打通"
                },
                {
                  "label": "同步节奏",
                  "value": "2 → 20 Hz"
                }
              ],
              "outcome": "真机姿态现在可以稳定映射到 MuJoCo 侧，Sim2Real 这条基础链路已经成立。",
              "links": [
                {
                  "title": "项目总览",
                  "path": "homepage/external/dummy_controller/INTERVIEW_TECH_DOC.md"
                }
              ]
            }
          ]
        }
      ],
      "findings": [
        {
          "title": "这条项目线已经完成平台搭建，可以固定留在“已完成”区",
          "body": "它的价值不在于继续滚动追加训练日志，而在于把具身学习所需的运动映射、示教回放、逆解控制和安全保护一次性搭稳，后续直接作为数据采集底座复用。"
        },
        {
          "title": "三项核心能力已经对齐到具身学习数据采集场景",
          "body": "Sim2Real 运动映射负责真机与仿真的统一坐标口径，示教轨迹负责结构化演示数据，FK/IK 闭环负责把末端目标变成可执行动作，这三者组合起来正好对应模仿学习与世界模型的接口需求。"
        },
        {
          "title": "安全保护不是附属功能，而是平台可复用的前提",
          "body": "如果没有 CAN 限流、RDP 稀疏化、超时保护和边界回退，这套系统只能偶尔演示；正是这些工程约束补齐后，它才有资格成为长期复用的数据采集平台。"
        }
      ],
      "evidence_links": [
        {
          "title": "项目总览",
          "path": "homepage/external/dummy_controller/INTERVIEW_TECH_DOC.md",
          "summary": "| 维度 | 内容 | |------|------| | 硬件 | Dummy V2 六轴串联机械臂，步进电机 + 减速器，CAN 总线通信，串口桥接（ACM） | | 仿真 | MuJoCo 3.x，MJCF 由厂商 URDF 人工转…",
          "label": "查看原始记录"
        },
        {
          "title": "CAN 通信保护总结",
          "path": "homepage/external/dummy_controller/CAN_PROTECTION_SUMMARY.md",
          "summary": "记录示教采样、RDP 稀疏化、回放限流和超时保护的关键参数。",
          "label": "查看原始记录"
        },
        {
          "title": "示教边界与退出处理",
          "path": "homepage/external/dummy_controller/TEACH_BOUNDARY_COMPLETE.md",
          "summary": "记录示教拖动时的边界提示、平滑回退和退出流程。",
          "label": "查看原始记录"
        },
        {
          "title": "正逆运动学技术文档",
          "path": "homepage/external/dummy_controller/docs/技术文档_正逆运动学与示教系统.md",
          "summary": "补充 FK/IK 求解逻辑、关节范围与关键姿态验证结果。",
          "label": "查看原始记录"
        }
      ],
      "chart_ids": [],
      "media_items": [
        {
          "task_id": "dummy-sim2real-platform",
          "kind": "image",
          "title": "六轴臂平台封面",
          "caption": "概览展示这套六轴臂 Sim2Real 采集平台的整体形态，作为首页亮点封面使用。",
          "path": "homepage/media/tasks/dummy-sim2real-platform/images/00-封面图.jpg",
          "showcase_preview": true
        },
        {
          "task_id": "dummy-sim2real-platform",
          "kind": "video",
          "title": "正逆运动解算演示",
          "caption": "展示六轴臂平台里从目标位姿到数值逆解、再到仿真预览与控制联动的过程。",
          "path": "homepage/media/tasks/dummy-sim2real-platform/videos/01-运动逆解算.mp4",
          "showcase_preview": false
        },
        {
          "task_id": "dummy-sim2real-platform",
          "kind": "video",
          "title": "真机-仿真数字孪生同步",
          "caption": "展示真机姿态如何实时映射到仿真侧，验证 Sim2Real 运动映射与数字孪生同步效果。",
          "path": "homepage/media/tasks/dummy-sim2real-platform/videos/02-真机仿真数字孪生.mp4",
          "showcase_preview": false
        },
        {
          "task_id": "dummy-sim2real-platform",
          "kind": "video",
          "title": "规划轨迹真机执行",
          "caption": "展示规划好的关节轨迹如何按照记录节奏下发真机，体现示教回放与总线保护链路。",
          "path": "homepage/media/tasks/dummy-sim2real-platform/videos/03-规划轨迹执行.mp4",
          "showcase_preview": false
        }
      ],
      "home_entries": [
        {
          "date": "2026-04-02",
          "group": "done",
          "task_id": "dummy-sim2real-platform",
          "branch_ids": [
            "robot-platform"
          ],
          "badge": "Sim2Real 平台",
          "title": "六轴臂 Sim2Real 采集平台固化完成",
          "summary": "把仿真-真机映射、影子规划、连续示教、数值 IK 和总线保护整合成一套可直接承接模仿学习与世界模型数据采集的六轴臂实验平台。",
          "metrics": [
            {
              "label": "机械臂",
              "value": "6 轴"
            },
            {
              "label": "示教录制",
              "value": "10 Hz"
            },
            {
              "label": "Demo",
              "value": "3 个"
            }
          ],
          "meta": "已完成 · 具身采集平台",
          "path": "homepage/tasks/dummy-sim2real-platform/"
        }
      ],
      "task_badge": "Sim2Real 平台",
      "docs": [
        "homepage/external/dummy_controller/INTERVIEW_TECH_DOC.md",
        "homepage/external/dummy_controller/CAN_PROTECTION_SUMMARY.md",
        "homepage/external/dummy_controller/TEACH_BOUNDARY_COMPLETE.md",
        "homepage/external/dummy_controller/docs/技术文档_正逆运动学与示教系统.md"
      ]
    },
    {
      "id": "pdit-anchor",
      "title": "PDIT 基线恢复与锚点固化",
      "summary": "把点云主线从工程不稳定状态修回到可复核的行为锚点，并留下 checkpoint、审计与回归证据。",
      "status": "已验证",
      "status_group": "done",
      "page_path": "homepage/tasks/pdit-anchor/",
      "branch_ids": [
        "pdit"
      ],
      "latest_update": "2026-04-09",
      "hero_metrics": [
        {
          "label": "best success@20",
          "value": "0.95"
        },
        {
          "label": "100 回合复核",
          "value": "0.85"
        },
        {
          "label": "best epoch",
          "value": "500"
        }
      ],
      "report_intro": "PDIT 这条线的任务不是继续堆实验数量，而是把点云主线从“曾经不可信的训练栈”修成一个能反复复核、能承接后续比较的稳定锚点。",
      "summary_cards": [
        {
          "eyebrow": "Anchor",
          "title": "行为锚点已经稳定下来",
          "body": "Baseline@500 在离线 20 回合达到 0.95，根目录重整后的 100 回合复核仍有 0.85，说明当前最优策略不是一次性好运气。",
          "metrics": [
            {
              "label": "20 回合",
              "value": "0.95"
            },
            {
              "label": "100 回合",
              "value": "0.85"
            },
            {
              "label": "best epoch",
              "value": "500"
            }
          ]
        },
        {
          "eyebrow": "Repair",
          "title": "训练 / 保存 / 审计三条链都修过一轮",
          "body": "导入路径污染、checkpoint 原子保存、audit-only stage 覆盖和 RLBench 挂起隔离等问题被集中处理，当前结果终于能按同一口径解释。",
          "metrics": [
            {
              "label": "关键修复",
              "value": "6"
            },
            {
              "label": "audit chain",
              "value": "稳定"
            },
            {
              "label": "行为回归",
              "value": "通过"
            }
          ]
        },
        {
          "eyebrow": "Ablation",
          "title": "统计特征增强对照作废，官方式动态候选仍属待证",
          "body": "统计特征增强路径存在语义 bug，不能再拿来支持结构结论；更接近官方 DiT 动态的候选在 valid loss 上有优势，但还没有行为层面的替代证据。",
          "metrics": [
            {
              "label": "增强对照",
              "value": "作废"
            },
            {
              "label": "动态候选 best valid",
              "value": "0.572"
            },
            {
              "label": "当前锚点",
              "value": "baseline"
            }
          ]
        },
        {
          "eyebrow": "Current",
          "title": "现在要解决的是后期稳定性，而不是可训练性",
          "body": "PDIT 已经证明自己能学起来，真正要继续追的是怎样减少中后期漂移、让 success 与 valid signal 更长期对齐。",
          "metrics": [
            {
              "label": "100 epoch",
              "value": "可用"
            },
            {
              "label": "500 epoch",
              "value": "可复核"
            },
            {
              "label": "问题",
              "value": "晚期泛化"
            }
          ]
        }
      ],
      "timeline_groups": [
        {
          "date": "2026-04-09",
          "cards": [
            {
              "badge": "PDIT 主线",
              "title": "根目录重整后的最优策略复核通过",
              "summary": "对同一 best_success checkpoint 重新做行为复核，确认仓库结构重整没有把当前最优策略改坏。",
              "metrics": [
                {
                  "label": "20 回合",
                  "value": "1.00"
                },
                {
                  "label": "100 回合",
                  "value": "0.85"
                },
                {
                  "label": "mean steps@100",
                  "value": "83.82"
                }
              ],
              "outcome": "Baseline@500 继续作为当前 PDIT 行为锚点。",
              "links": [
                {
                  "title": "20 回合复核",
                  "path": "ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/root_layout_recheck_20.json"
                },
                {
                  "title": "100 回合复核",
                  "path": "ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/root_layout_recheck_100.json"
                },
                {
                  "title": "checkpoint manifest",
                  "path": "docs/top10-checkpoint-manifest.json"
                }
              ]
            },
            {
              "badge": "Regression",
              "title": "固定 batch 数值回归重新固化为新基准",
              "summary": "根目录重整后旧 reference 不再 bitwise 对齐，于是把固定 batch regression 重新固化成新的 canonical baseline。",
              "metrics": [
                {
                  "label": "reference",
                  "value": "已重建"
                },
                {
                  "label": "脚本",
                  "value": "verify_baseline_regression.py"
                },
                {
                  "label": "状态",
                  "value": "可重复"
                }
              ],
              "outcome": "后续代码重构有了统一的数值回归锚点。",
              "links": [
                {
                  "title": "新 regression reference",
                  "path": "docs/baseline-regression-reference.json"
                },
                {
                  "title": "恢复进展文档",
                  "path": "docs/pdit/2026-04-08-fm-recovery-progress-zh.md"
                }
              ]
            }
          ]
        },
        {
          "date": "2026-04-08",
          "cards": [
            {
              "badge": "Repair",
              "title": "训练与离线审计链关键 bug 修完",
              "summary": "本地导入污染、FM 导入耦合、PointNet 导入、checkpoint 原子保存、子进程 audit 隔离和 audit-only stage 覆盖问题都在同一轮里修正。",
              "metrics": [
                {
                  "label": "关键修复",
                  "value": "6"
                },
                {
                  "label": "audit-only",
                  "value": "已修"
                },
                {
                  "label": "latest.pt",
                  "value": "原子保存"
                }
              ],
              "outcome": "之前“模型完全学不会”的结论被重新归因为工程与评估链问题。",
              "links": [
                {
                  "title": "恢复进展文档",
                  "path": "docs/pdit/2026-04-08-fm-recovery-progress-zh.md"
                },
                {
                  "title": "训练模型审计",
                  "path": "docs/pdit/2026-04-07-training-model-audit-zh.md"
                }
              ]
            },
            {
              "badge": "Baseline",
              "title": "Baseline@100 恢复到 0.90 success@20",
              "summary": "修复后的 baseline 不再早期崩掉，在 100 epoch 已经能稳定学出可用行为。",
              "metrics": [
                {
                  "label": "success@100",
                  "value": "0.90"
                },
                {
                  "label": "best valid",
                  "value": "0.661"
                },
                {
                  "label": "best epoch",
                  "value": "31"
                }
              ],
              "outcome": "点云主线的可训练性已经重新被确认。",
              "links": [
                {
                  "title": "恢复进展文档",
                  "path": "docs/pdit/2026-04-08-fm-recovery-progress-zh.md"
                },
                {
                  "title": "训练模型审计",
                  "path": "docs/pdit/2026-04-07-training-model-audit-zh.md"
                }
              ]
            },
            {
              "badge": "Anchor",
              "title": "Baseline@500 锚定 0.95 success@20",
              "summary": "100/200/300/400/500 五个检查点的 success 曲线重新梳理后，最强点实际落在 500 epoch，而不是中途崩塌。",
              "metrics": [
                {
                  "label": "100",
                  "value": "0.75"
                },
                {
                  "label": "300",
                  "value": "0.90"
                },
                {
                  "label": "500",
                  "value": "0.95"
                }
              ],
              "outcome": "修复后的 baseline 没有出现之前 feared 的 300→500 崩塌。",
              "links": [
                {
                  "title": "audit report",
                  "path": "ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/audit_report.json"
                },
                {
                  "title": "summary",
                  "path": "ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/summary.json"
                }
              ]
            },
            {
              "badge": "Ablation",
              "title": "统计特征增强对照作废，官方式动态候选仍待验证",
              "summary": "统计特征归一化 + 原始增强这条对照之所以表现差，并不只是超参问题，而是增强实现把 rot6d 当成了可平移点；更接近官方 DiT 动态的候选在 valid loss 上更好，但还没形成新的行为锚点。",
              "metrics": [
                {
                  "label": "增强对照@100",
                  "value": "0.55"
                },
                {
                  "label": "动态候选 best valid",
                  "value": "0.572"
                },
                {
                  "label": "状态",
                  "value": "待行为验证"
                }
              ],
              "outcome": "旧增强对照不再作为结构结论引用，当前锚点仍是 baseline@500。",
              "links": [
                {
                  "title": "恢复进展文档",
                  "path": "docs/pdit/2026-04-08-fm-recovery-progress-zh.md"
                },
                {
                  "title": "训练模型审计",
                  "path": "docs/pdit/2026-04-07-training-model-audit-zh.md"
                }
              ]
            }
          ]
        }
      ],
      "findings": [
        {
          "title": "主因已经从“学不会”转成“如何稳住后期泛化”",
          "body": "修复工程问题之后，PDIT baseline 已经能在 100 epoch 达到 0.90@20，在 500 epoch 达到 0.95@20。当前真正的问题是怎么降低 300-500 epoch 的策略漂移，而不是是否能学起来。"
        },
        {
          "title": "统计特征增强对照的旧结论不能继续沿用",
          "body": "数据增强实现曾经错误地把 rot6d 向量当成三维点平移，所以那条统计特征增强对照的坏结果不能被解读成“数据驱动统计一定无效”。"
        },
        {
          "title": "当前公开最强证据是 0.95@20 / 0.85@100",
          "body": "20 回合短审计把 500 epoch 锚点推到 0.95，根目录重整后又用同一策略做了 100 回合复核，保持在 0.85，足够支撑它继续做主线锚点。"
        }
      ],
      "evidence_links": [
        {
          "title": "FM/DiT 恢复进展",
          "path": "docs/pdit/2026-04-08-fm-recovery-progress-zh.md",
          "summary": "完整记录了修复项、Baseline@100/500、统计特征增强对照与动态候选的判断。",
          "label": "查看原始记录"
        },
        {
          "title": "训练模型审计",
          "path": "docs/pdit/2026-04-07-training-model-audit-zh.md",
          "summary": "补充了修复前后模型与训练行为的核对过程。",
          "label": "查看原始记录"
        },
        {
          "title": "PDIT audit report",
          "path": "ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/audit_report.json",
          "summary": "包含 success_by_epoch 和当前 best checkpoint。",
          "label": "查看原始记录"
        },
        {
          "title": "PDIT summary",
          "path": "ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/summary.json",
          "summary": "包含最新 valid/train 尾段指标与 run 元信息。",
          "label": "查看原始记录"
        },
        {
          "title": "checkpoint manifest",
          "path": "docs/top10-checkpoint-manifest.json",
          "summary": "固化了 canonical best 及其复核证据。",
          "label": "查看原始记录"
        },
        {
          "title": "100 回合复核结果",
          "path": "ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/root_layout_recheck_100.json",
          "summary": "验证根目录重整后最优策略仍然成立。",
          "label": "查看原始记录"
        }
      ],
      "chart_ids": [
        "pdit-success-curve",
        "pdit-loss-tail",
        "pdit-mse-tail"
      ],
      "media_items": [],
      "home_entries": [
        {
          "date": "2026-04-09",
          "group": "done",
          "task_id": "pdit-anchor",
          "branch_ids": [
            "pdit"
          ],
          "badge": "PDIT 主线",
          "title": "PDIT baseline 在 500 epoch 锚定 0.95@20 / 0.85@100",
          "summary": "修复训练与审计链后，点云主线不再在 300-500 epoch 崩塌，当前最强策略已经有 20 回合与 100 回合两轮复核。",
          "metrics": [
            {
              "label": "success@20",
              "value": "0.95"
            },
            {
              "label": "100 回合复核",
              "value": "0.85"
            },
            {
              "label": "锚点",
              "value": "@500"
            }
          ],
          "meta": "PDIT 基线恢复与锚点固化",
          "path": "homepage/tasks/pdit-anchor/"
        },
        {
          "date": "2026-04-08",
          "group": "done",
          "task_id": "pdit-anchor",
          "branch_ids": [
            "pdit"
          ],
          "badge": "Baseline Recovery",
          "title": "点云训练栈修稳后，Baseline@100 重新回到 0.90 success@20",
          "summary": "这一天的核心不是又跑了一次实验，而是把导致历史结论失真的训练、保存和审计问题真正修通了。",
          "metrics": [
            {
              "label": "success@100",
              "value": "0.90"
            },
            {
              "label": "关键修复",
              "value": "6"
            },
            {
              "label": "best valid",
              "value": "0.661"
            }
          ],
          "meta": "从“学不会”转向“后期如何稳住”",
          "path": "homepage/tasks/pdit-anchor/"
        }
      ],
      "task_badge": "PDIT 主线",
      "docs": [
        "docs/pdit/2026-04-08-fm-recovery-progress-zh.md",
        "docs/pdit/2026-04-07-training-model-audit-zh.md",
        "docs/top10-checkpoint-manifest.json"
      ],
      "manifest_note": "代码库的失败并非由单一原因造成。 最强的确认结论是： 原始的低/不稳定性能被训练栈和评估栈的 bug 严重放大。 修复这些问题后，基线已在 20 个离线回合中达到 0.90 success@100。 剩余问题不再是\"为什么它完全无法学习？\" 剩余问题是\"如何防止强大的早期策略在第 300 到 500 epoch 之间…"
    },
    {
      "id": "mdit-mainline",
      "title": "MDIT RGB+Text 主线推进",
      "summary": "围绕 RGB+Text 主线、平滑动作对照、faithful recipe 对照与严格 MTDP 对照的筛选结果，逐步把 100→500 续训接管整理成一条可持续推进的研究主线。",
      "status": "推进中",
      "status_group": "in_progress",
      "page_path": "homepage/tasks/mdit-mainline/",
      "branch_ids": [
        "mdit"
      ],
      "latest_update": "2026-04-18",
      "hero_metrics": [
        {
          "label": "当前锚点",
          "value": "0.55@100"
        },
        {
          "label": "epoch 50",
          "value": "0.25"
        },
        {
          "label": "续训进度",
          "value": "epoch 99"
        }
      ],
      "report_intro": "MDIT 这条线当前最重要的不是再开更多名字相似的 run，而是把 RGB+Text 主线的筛选、冻结、接管和 500 epoch 续训放在同一条研究叙事里看清楚。",
      "summary_cards": [
        {
          "eyebrow": "Anchor",
          "title": "RGB+Text 当前锚点固定在 0.55@100",
          "body": "共享 audit 链确认过的最好结果仍是 epoch50=0.25、epoch100=0.55。这是现在所有其他对照必须超过的门槛。",
          "metrics": [
            {
              "label": "epoch 50",
              "value": "0.25"
            },
            {
              "label": "epoch 100",
              "value": "0.55"
            },
            {
              "label": "状态",
              "value": "已冻结"
            }
          ]
        },
        {
          "eyebrow": "Resume",
          "title": "100→500 续训接管已经恢复",
          "body": "这轮不是随便补跑，而是把 optimizer state 不兼容、scheduler lr 重算和 watchdog 假接管一起修好后，重新把长训挂到当前 best-route 上。",
          "metrics": [
            {
              "label": "目标",
              "value": "500 epoch"
            },
            {
              "label": "当前 best",
              "value": "0.55@100"
            },
            {
              "label": "状态",
              "value": "resume"
            }
          ]
        },
        {
          "eyebrow": "Screening",
          "title": "平滑动作 / faithful / 严格 MTDP 三条对照已经分流",
          "body": "平滑动作对照只到 0.35，faithful recipe 首败是缓存/网络问题，严格 MTDP 对照没过共享 gate。主线不再被弱候选反复打断。",
          "metrics": [
            {
              "label": "stabilized@100",
              "value": "0.35"
            },
            {
              "label": "faithful",
              "value": "offline fix"
            },
            {
              "label": "严格 MTDP",
              "value": "未过 gate"
            }
          ]
        },
        {
          "eyebrow": "Contract",
          "title": "研究线已经有固定的执行与审计口径",
          "body": "执行手册、当前主线路径和研究日志三份文档现在共同定义了 MDIT 的训练、审计、接管和晋级契约。",
          "metrics": [
            {
              "label": "manual",
              "value": "已固化"
            },
            {
              "label": "journal",
              "value": "append-only"
            },
            {
              "label": "audit chain",
              "value": "共享"
            }
          ]
        }
      ],
      "timeline_groups": [
        {
          "date": "2026-04-18",
          "cards": [
            {
              "badge": "Mainline Resume",
              "title": "严格 MTDP 对照未过共享审计后，研究重新收束到 RGB+Text 主线",
              "summary": "严格 MTDP 对照没有通过共享 gate，项目没有继续把预算散到弱候选上，而是立即收回到唯一过审的 RGB+Text 主线。",
              "metrics": [
                {
                  "label": "当前锚点",
                  "value": "0.55@100"
                },
                {
                  "label": "回退动作",
                  "value": "best500 fallback"
                },
                {
                  "label": "原因",
                  "value": "recipe drift"
                }
              ],
              "outcome": "MDIT 重新聚焦到唯一可信的 RGB+Text 主线，而不是继续同时养多个弱对照。",
              "links": [
                {
                  "title": "研究日志",
                  "path": "docs/mdit/research_journal.md"
                },
                {
                  "title": "当前主线路径",
                  "path": "docs/mdit/best_path.md"
                }
              ]
            },
            {
              "badge": "Takeover",
              "title": "100→500 主线续训在 supervisor 下恢复",
              "summary": "早先的 fallback run 首个 optimizer step 就崩掉，后来又确认 watchdog 误判了“已接管但其实空转”的状态；这一天把 optimizer / scheduler 兼容和 supervisor 都补上了。",
              "metrics": [
                {
                  "label": "续训目标",
                  "value": "500 epoch"
                },
                {
                  "label": "当前 best",
                  "value": "0.55@100"
                },
                {
                  "label": "状态",
                  "value": "已恢复"
                }
              ],
              "outcome": "后续 500 epoch 结果会继续积累在同一条主线 lineage 上，而不是再新开匿名 run。",
              "links": [
                {
                  "title": "研究日志",
                  "path": "docs/mdit/research_journal.md"
                },
                {
                  "title": "W&B 摘要",
                  "path": "ckpt/unplug_charger_mdit_rgb_text_3token_100__lane_a_mainline_500_resume__e0500__20260418_005723/wandb/run-20260418_022912-8ikgnzbw/files/wandb-summary.json"
                }
              ]
            }
          ]
        },
        {
          "date": "2026-04-17",
          "cards": [
            {
              "badge": "Anchor",
              "title": "RGB+Text 当前主线被正式冻结为阶段锚点",
              "summary": "在共享 audit 链下，当前 RGB+Text 主线是当时唯一完成锁定审计的候选，因此被正式冻结为主线锚点。",
              "metrics": [
                {
                  "label": "epoch 50",
                  "value": "0.25"
                },
                {
                  "label": "epoch 100",
                  "value": "0.55"
                },
                {
                  "label": "mean steps",
                  "value": "121.75"
                }
              ],
              "outcome": "后续其他对照只有在同一审计口径下超过 0.55，才有资格接管主线。",
              "links": [
                {
                  "title": "当前主线路径",
                  "path": "docs/mdit/best_path.md"
                },
                {
                  "title": "共享审计结果",
                  "path": "ckpt/unplug_charger_mdit_rgb_text_3token_100/audit_report.json"
                }
              ]
            },
            {
              "badge": "Comparison",
              "title": "平滑动作对照审计后确认弱于当前主线",
              "summary": "平滑动作这条对照没有真正触及核心失败模式，在 50 / 100 epoch 的表现都落在当前锚点之下。",
              "metrics": [
                {
                  "label": "epoch 50",
                  "value": "0.20"
                },
                {
                  "label": "epoch 100",
                  "value": "0.35"
                },
                {
                  "label": "主要失败",
                  "value": "超时未完成"
                }
              ],
              "outcome": "这条稳定化对照线被明确降级为参考线，而不是新主线。",
              "links": [
                {
                  "title": "研究日志",
                  "path": "docs/mdit/research_journal.md"
                },
                {
                  "title": "执行手册",
                  "path": "docs/mdit/2026-04-16-mdit-execution-manual.md"
                }
              ]
            },
            {
              "badge": "Infra Fix",
              "title": "faithful recipe 对照的首轮失败被确认是缓存 / 网络问题",
              "summary": "第一次 faithful recipe 对照启动时卡在 Hugging Face 远程握手，而不是训练本身；autoresearch 随后改成优先吃本地缓存并强制 offline。",
              "metrics": [
                {
                  "label": "HF 模式",
                  "value": "offline"
                },
                {
                  "label": "问题归因",
                  "value": "启动链"
                },
                {
                  "label": "模型判断",
                  "value": "未下结论"
                }
              ],
              "outcome": "这条 faithful recipe 对照的首轮失败不再被误记成“方法本身无效”。",
              "links": [
                {
                  "title": "研究日志",
                  "path": "docs/mdit/research_journal.md"
                },
                {
                  "title": "执行手册",
                  "path": "docs/mdit/2026-04-16-mdit-execution-manual.md"
                }
              ]
            }
          ]
        },
        {
          "date": "2026-04-16",
          "cards": [
            {
              "badge": "Manual",
              "title": "MDIT 执行手册定版，主线推进开始有统一口径",
              "summary": "从训练命令、共享评估链、晋级门槛到接管方式，全部被整理成固定手册，后续不再靠零散命令和口口相传维持。",
              "metrics": [
                {
                  "label": "搜索线",
                  "value": "2"
                },
                {
                  "label": "闸门",
                  "value": "100/300/500"
                },
                {
                  "label": "审计链",
                  "value": "锁定"
                }
              ],
              "outcome": "MDIT 开始从零散 run note 转成真正可持续维护的主线研究线。",
              "links": [
                {
                  "title": "执行手册",
                  "path": "docs/mdit/2026-04-16-mdit-execution-manual.md"
                },
                {
                  "title": "研究日志",
                  "path": "docs/mdit/research_journal.md"
                }
              ]
            }
          ]
        }
      ],
      "findings": [
        {
          "title": "当前冠军仍然只有 0.55@100 的 RGB+Text 主线",
          "body": "截至目前，唯一被共享 audit 链确认过的 RGB+Text 主线仍然是当前这条 0.55@100 锚点线。所有对照都还没有超过它。"
        },
        {
          "title": "平滑动作和其他弱对照没有解决核心失败模式",
          "body": "已知失败大头仍是“动作还没做完就到时间上限”，说明只是平滑 action head 或轻微换 recipe 并不能直接解决 MDIT 的行为瓶颈。"
        },
        {
          "title": "真正的下一步是把 100→500 主线续训跑完并审完",
          "body": "现在最重要的不是再开更多对照，而是在同一条 best-route lineage 上拿到完整 500 epoch 的共享 audit 结果。"
        }
      ],
      "evidence_links": [
        {
          "title": "研究日志",
          "path": "docs/mdit/research_journal.md",
          "summary": "append-only 研究日志，记录每条对照线的推进、失败和接管。",
          "label": "查看原始记录"
        },
        {
          "title": "当前主线路径",
          "path": "docs/mdit/best_path.md",
          "summary": "当前主线锚点、best checkpoint 和晋级逻辑。",
          "label": "查看原始记录"
        },
        {
          "title": "执行手册",
          "path": "docs/mdit/2026-04-16-mdit-execution-manual.md",
          "summary": "训练、审计、接管与晋级规则的固定手册。",
          "label": "查看原始记录"
        },
        {
          "title": "共享审计报告",
          "path": "ckpt/unplug_charger_mdit_rgb_text_3token_100/audit_report.json",
          "summary": "0.25@50 / 0.55@100 的共享审计证据。",
          "label": "查看原始记录"
        },
        {
          "title": "主线 summary",
          "path": "ckpt/unplug_charger_mdit_rgb_text_3token_100/summary.json",
          "summary": "1-100 epoch 主线的 summary 与 W&B run URL。",
          "label": "查看原始记录"
        },
        {
          "title": "W&B 摘要快照",
          "path": "ckpt/unplug_charger_mdit_rgb_text_3token_100__lane_a_mainline_500_resume__e0500__20260418_005723/wandb/run-20260418_022912-8ikgnzbw/files/wandb-summary.json",
          "summary": "500 续训接管后的本地 W&B 摘要快照。",
          "label": "查看原始记录"
        }
      ],
      "chart_ids": [
        "mdit-success-curve",
        "mdit-loss-curve",
        "mdit-mse-curve"
      ],
      "media_items": [],
      "home_entries": [
        {
          "date": "2026-04-18",
          "group": "in_progress",
          "task_id": "mdit-mainline",
          "branch_ids": [
            "mdit"
          ],
          "badge": "MDIT 主线",
          "title": "MDIT 主线恢复 100→500 续训接管",
          "summary": "严格 MTDP 对照没有通过共享审计后，研究预算被收回到唯一过审的 RGB+Text 主线，并把 100→500 续训兼容与 supervisor 一起修通。",
          "metrics": [
            {
              "label": "当前锚点",
              "value": "0.55@100"
            },
            {
              "label": "续训目标",
              "value": "500"
            },
            {
              "label": "状态",
              "value": "恢复中"
            }
          ],
          "meta": "主线从筛选期进入长训接管期",
          "path": "homepage/tasks/mdit-mainline/"
        },
        {
          "date": "2026-04-17",
          "group": "in_progress",
          "task_id": "mdit-mainline",
          "branch_ids": [
            "mdit"
          ],
          "badge": "RGB+Text Anchor",
          "title": "RGB+Text 当前锚点固定为 0.55@100，所有对照暂未越线",
          "summary": "共享 audit 下的 0.55@100 成为当前唯一可信锚点，平滑动作对照和 faithful recipe 对照的首轮推进都没能完成接管。",
          "metrics": [
            {
              "label": "epoch 50",
              "value": "0.25"
            },
            {
              "label": "epoch 100",
              "value": "0.55"
            },
            {
              "label": "对照线",
              "value": "2"
            }
          ],
          "meta": "研究线开始从扩散筛选重新收束",
          "path": "homepage/tasks/mdit-mainline/"
        }
      ],
      "task_badge": "MDIT 主线",
      "docs": [
        "docs/mdit/research_journal.md",
        "docs/mdit/best_path.md",
        "docs/mdit/2026-04-16-mdit-execution-manual.md"
      ],
      "event_digest": {
        "resume_recovered": {
          "Title": "Best-route 100->500 resume recovered under supervisor",
          "Run": "unplug_charger_mdit_rgb_text_3token_100__lane_a_mainline_500_resume__e0500__20260418_005723",
          "Phase": "takeover_resume",
          "Phenomenon": "The earlier fallback run crashed at the first optimizer step and the previous guard died, so the project looked “taken over” in tmux but was actually idle.",
          "Reasons": "Legacy optimizer moments were mismatched to the current parameter order; stale heartbeat timestamps and non-training processes also confused the watchdog.",
          "Result": "Resume now skips incompatible optimizer state, recomputes scheduler lr for the 500-epoch horizon, and is supervised by run_mdit_takeover_supervisor.py. Current log already shows epoch 100 continuing with non-zero lr.",
          "Audit report": "pending after training reaches 500 and shared audit starts",
          "Contract issues": "none for the incumbent best-route resume path"
        },
        "fallback_triggered": {
          "Active run": "unplug_charger_mdit_lane_c_mtdp_strict_fm_v1__lane_c_mtdp_strict_100__e0100__20260417_193720",
          "Incumbent run": "unplug_charger_mdit_rgb_text_3token_100",
          "Decision": "trigger best-route 500 fallback",
          "Reason": "challenger audit reported recipe drift"
        },
        "stabilized_lane": {
          "Title": "Lane A stabilized is weaker than the current mainline anchor",
          "Run": "unplug_charger_mdit_rgb_text_fm_v1__lane_a_stabilized_100__e0100__20260417_112329",
          "Phase": "audit_only",
          "Phenomenon": "epoch_0050=0.20 (4/20) and epoch_0100=0.35 (7/20) are both below the current locked anchor unplug_charger_mdit_rgb_text_3token_100 (epoch_0100=0.55).",
          "Reasons": "Failures are still dominated by horizon exhaustion (at_horizon), with a small number of planning_runtime_error; smoothing the action head did not address the core failure mode.",
          "Result": "This branch is now treated as a weak lane, not a new primary direction. The best RGB+text route remains the original Lane A mainline.",
          "Audit report": "embedded in autoresearch_records/mdit_loop_state__unplug_rgb_text_search.json",
          "Contract issues": "none"
        },
        "lane_b_fix": {
          "Title": "Lane B first launch failed due to remote model fetch, not model quality",
          "Run": "unplug_charger_mdit_lane_b_faithful_fm_v1__lane_b_faithful_100__e0100__20260417_172029",
          "Phase": "train_only",
          "Phenomenon": "The candidate failed before training started because timm/vit_base_patch16_clip_224.openai tried to hit huggingface.co and timed out through the proxy.",
          "Reasons": "The process did not force offline loading even though both the TIMM vision checkpoint and the OpenAI CLIP text checkpoint were already present in local cache.",
          "Result": "Patched the autoresearch loop to inject HF_HUB_OFFLINE=1, TRANSFORMERS_OFFLINE=1, and HF_HUB_DISABLE_TELEMETRY=1 into child processes whenever the required cached checkpoints are present. Lane B should now restart from local cache instead of being blocked by external network handshakes.",
          "Audit report": "none",
          "Contract issues": "none"
        }
      }
    },
    {
      "id": "lelan-pipeline",
      "title": "LeLaN 自动研究链路固化",
      "summary": "优先把 LeLaN 的训练、评估、选模与审计留痕规范固定下来，为后续正式 run 和 demo 留出统一入口。",
      "status": "待结果",
      "status_group": "in_progress",
      "page_path": "homepage/tasks/lelan-pipeline/",
      "branch_ids": [
        "lelan"
      ],
      "latest_update": "2026-04-12",
      "hero_metrics": [
        {
          "label": "输入",
          "value": "5 路 RGB / 3 帧"
        },
        {
          "label": "动作步数",
          "value": "8"
        },
        {
          "label": "100 epoch gate",
          "value": "0.45"
        }
      ],
      "report_intro": "LeLaN 这页目前更像“执行链路报告”，因为它的首要目标是把训练、评估、选模和审计变成一套能长期追加的自动研究流程。",
      "summary_cards": [
        {
          "eyebrow": "Recipe",
          "title": "第一轮 recipe 固定，不先碰 backbone",
          "body": "先锁定 5 路 RGB、3 帧观测、horizon=32、8 步动作和 smooth_actions，把工程链路建立清楚再谈结构创新。",
          "metrics": [
            {
              "label": "RGB",
              "value": "5 路"
            },
            {
              "label": "观测帧",
              "value": "3"
            },
            {
              "label": "动作步数",
              "value": "8"
            }
          ]
        },
        {
          "eyebrow": "Eval",
          "title": "训练内 success gate 与离线 eval ckpt 双路径都补齐了",
          "body": "训练可以选择直接做 success eval，也可以完全不依赖 RLBench、按固定节奏保存轻量 eval ckpt，后续审计链不再卡死在单一路径上。",
          "metrics": [
            {
              "label": "EMA",
              "value": "兼容"
            },
            {
              "label": "prefer-ema",
              "value": "已支持"
            },
            {
              "label": "eval ckpt",
              "value": "固定目录"
            }
          ]
        },
        {
          "eyebrow": "Trace",
          "title": "autoresearch 产物和 change summary 已经定版",
          "body": "manifest、summary、dataset_stats、audit_report 和 trial_request 都成为固定产物，change_summary 也必须可被人直接读懂。",
          "metrics": [
            {
              "label": "产物",
              "value": "7+"
            },
            {
              "label": "change_summary",
              "value": "人类可读"
            },
            {
              "label": "状态",
              "value": "可追加"
            }
          ]
        },
        {
          "eyebrow": "Gate",
          "title": "100 / 300 / 500 三段闸门已经固定",
          "body": "当前阶段最重要的是用统一 gate 管住筛选节奏，而不是同时尝试太多方向导致结论无法对比。",
          "metrics": [
            {
              "label": "100",
              "value": "0.45"
            },
            {
              "label": "300",
              "value": "0.55"
            },
            {
              "label": "500",
              "value": "0.60"
            }
          ]
        }
      ],
      "timeline_groups": [
        {
          "date": "2026-04-12",
          "cards": [
            {
              "badge": "Recipe",
              "title": "LeLaN 主线配方先固定为 5 路 RGB、3 帧观测和 8 步动作",
              "summary": "这一轮先固定 5 路 RGB、3 帧观测、horizon=32、8 步动作和平滑动作，再用 100 epoch / 20 episode gate 管住节奏，不急着改 backbone。",
              "metrics": [
                {
                  "label": "RGB",
                  "value": "5 路"
                },
                {
                  "label": "观测帧",
                  "value": "3"
                },
                {
                  "label": "动作步数",
                  "value": "8"
                }
              ],
              "outcome": "LeLaN 第一轮重点从“改模型”转成“先把工程链路立起来”。",
              "links": [
                {
                  "title": "执行计划",
                  "path": "docs/lelan/2026-04-12-lelan-autoresearch-execution-plan-zh.md"
                },
                {
                  "title": "LeLaN research README",
                  "path": "docs/lelan/research/README.md"
                }
              ]
            },
            {
              "badge": "Eval Chain",
              "title": "EMA、success eval 与 offline eval ckpt 双路径补齐",
              "summary": "训练中 success gate 和不依赖 RLBench 的离线 eval ckpt 两条路径被明确分开，resume 和 prefer-ema 也都补齐了兼容。",
              "metrics": [
                {
                  "label": "EMA",
                  "value": "on"
                },
                {
                  "label": "success gate",
                  "value": "100@20"
                },
                {
                  "label": "eval ckpt",
                  "value": "100 epoch"
                }
              ],
              "outcome": "LeLaN 后续 run 不会再出现“训练、评估、选模链路断开”的状态。",
              "links": [
                {
                  "title": "执行计划",
                  "path": "docs/lelan/2026-04-12-lelan-autoresearch-execution-plan-zh.md"
                },
                {
                  "title": "LeLaN research README",
                  "path": "docs/lelan/research/README.md"
                }
              ]
            },
            {
              "badge": "Trace",
              "title": "autoresearch 留痕规范一次性固定下来",
              "summary": "manifest、summary、dataset_stats、audit_report、trial_request 和 change_summary 都被写进固定产物约定里，后续可以直接追加而不是重新发明格式。",
              "metrics": [
                {
                  "label": "核心产物",
                  "value": "7+"
                },
                {
                  "label": "筛选分支",
                  "value": "3"
                },
                {
                  "label": "停止门槛",
                  "value": "0.45"
                }
              ],
              "outcome": "LeLaN 后续最先长出来的是“可审计的工程链路”，而不是无上下文的零散 run。",
              "links": [
                {
                  "title": "执行计划",
                  "path": "docs/lelan/2026-04-12-lelan-autoresearch-execution-plan-zh.md"
                },
                {
                  "title": "LeLaN research README",
                  "path": "docs/lelan/research/README.md"
                }
              ]
            }
          ]
        }
      ],
      "findings": [
        {
          "title": "这一轮先补工程基础，而不是先改结构",
          "body": "LeLaN 当前的核心缺口不是 encoder 设计，而是训练、评估、选模和审计链路没有一体化。"
        },
        {
          "title": "所有 screening 先走统一主线 recipe",
          "body": "只有当三条 100 epoch screening 全都过不了 0.45@20，下一轮才允许更激进的结构改动。"
        },
        {
          "title": "留痕格式已经比结果更早固定",
          "body": "即便本页还没有 success 曲线，后续每条 LeLaN run 也会自动留下 manifest、summary、audit 和 change summary。"
        }
      ],
      "evidence_links": [
        {
          "title": "LeLaN autoresearch 执行计划",
          "path": "docs/lelan/2026-04-12-lelan-autoresearch-execution-plan-zh.md",
          "summary": "定义了本轮目标、主线 recipe、闸门与训练 / 评估约束。",
          "label": "查看原始记录"
        },
        {
          "title": "LeLaN research README",
          "path": "docs/lelan/research/README.md",
          "summary": "定义了后续 run 报告必须具备的结构。",
          "label": "查看原始记录"
        }
      ],
      "chart_ids": [
        "lelan-stage-gates"
      ],
      "media_items": [],
      "home_entries": [
        {
          "date": "2026-04-12",
          "group": "in_progress",
          "task_id": "lelan-pipeline",
          "branch_ids": [
            "lelan"
          ],
          "badge": "LeLaN",
          "title": "LeLaN 自动研究链路完成首轮固化",
          "summary": "先把 5 路 RGB、3 帧观测、8 步动作的主线配方，以及 EMA / eval 双路径和 autoresearch 留痕规范一起固定下来，为后续正式 run 做好底座。",
          "metrics": [
            {
              "label": "观测帧",
              "value": "3"
            },
            {
              "label": "动作步数",
              "value": "8"
            },
            {
              "label": "100 epoch gate",
              "value": "0.45"
            }
          ],
          "meta": "当前还是工程铺设期，结果页会在正式 run 后变厚",
          "path": "homepage/tasks/lelan-pipeline/"
        }
      ],
      "task_badge": "LeLaN",
      "docs": [
        "docs/lelan/2026-04-12-lelan-autoresearch-execution-plan-zh.md",
        "docs/lelan/research/README.md"
      ],
      "manifest_note": "现在每个 LeLaN run 至少保留： config.json experiment_manifest.json summary.json dataset_stats.json success_eval_history.json 或 eval_ckpts/ audit_report.json lelan_trial…"
    },
    {
      "id": "infra-audit",
      "title": "训练与审计基础设施修复",
      "summary": "把训练栈、评估栈、日志记录和修复链路统一起来，确保后续每条研究线都能留下清晰、可复盘的证据。",
      "status": "长期维护",
      "status_group": "in_progress",
      "page_path": "homepage/tasks/infra-audit/",
      "branch_ids": [],
      "latest_update": "2026-04-18",
      "hero_metrics": [
        {
          "label": "fixes",
          "value": "6"
        },
        {
          "label": "PDIT docs",
          "value": "8"
        },
        {
          "label": "MDIT docs",
          "value": "16"
        }
      ],
      "report_intro": "这页只保留真正影响研究推进的基础设施修复，不再把 maintenance 规则和 agent 说明写进公开首页。",
      "summary_cards": [
        {
          "eyebrow": "Fix Log",
          "title": "全局修复账本已经固定成单一事实源",
          "body": "后续每次改动、结论和关键 run 状态都在 fixes.md 里按统一模板追加，不再散落到多个临时文档里。",
          "metrics": [
            {
              "label": "事实源",
              "value": "单一"
            },
            {
              "label": "模板",
              "value": "固定"
            },
            {
              "label": "状态",
              "value": "追加式"
            }
          ]
        },
        {
          "eyebrow": "Archive",
          "title": "研究文档开始按支线收束",
          "body": "PDIT、MDIT、LeLaN 都逐步有自己的 docs 目录和稳定文档，不再把运行记录直接塞进首页或根目录。",
          "metrics": [
            {
              "label": "PDIT docs",
              "value": "8"
            },
            {
              "label": "MDIT docs",
              "value": "16"
            },
            {
              "label": "LeLaN docs",
              "value": "2"
            }
          ]
        }
      ],
      "timeline_groups": [
        {
          "date": "2026-04-18",
          "cards": [
            {
              "badge": "Infra",
              "title": "修复主线 100->500 续训兼容并恢复真实后台接管",
              "summary": "范围：mdit/train/checkpoints.py + mdit/train/runner.py + research/mdit_takeover_controller.py + scripts/run_mdit_takeover_supervisor.py + tmux:mdit_auto…",
              "metrics": [
                {
                  "label": "日期",
                  "value": "2026-04-18"
                },
                {
                  "label": "类型",
                  "value": "修复"
                },
                {
                  "label": "状态",
                  "value": "已记录"
                }
              ],
              "outcome": "这条修复已被收入口径统一的 fixes 账本。",
              "links": [
                {
                  "title": "fixes.md",
                  "path": "docs/fixes.md"
                }
              ]
            },
            {
              "badge": "Infra",
              "title": "离线审计完成",
              "summary": "范围：research/mdit_trial_runner.py + docs/mdit/research_journal.md + docs/fixes.md 背景：候选 run unplug_charger_mdit_lane_c_mtdp_strict_fm_v1__lane_c_mtdp_…",
              "metrics": [
                {
                  "label": "日期",
                  "value": "2026-04-18"
                },
                {
                  "label": "类型",
                  "value": "修复"
                },
                {
                  "label": "状态",
                  "value": "已记录"
                }
              ],
              "outcome": "这条修复已被收入口径统一的 fixes 账本。",
              "links": [
                {
                  "title": "fixes.md",
                  "path": "docs/fixes.md"
                }
              ]
            },
            {
              "badge": "Infra",
              "title": "接管器触发 500 epoch 最优路线 fallback",
              "summary": "范围：research/mdit_takeover_controller.py + docs/fixes.md + docs/mdit/research_journal.md 背景：严格挑战线 unplug_charger_mdit_lane_c_mtdp_strict_fm_v1__lane_c…",
              "metrics": [
                {
                  "label": "日期",
                  "value": "2026-04-18"
                },
                {
                  "label": "类型",
                  "value": "修复"
                },
                {
                  "label": "状态",
                  "value": "已记录"
                }
              ],
              "outcome": "这条修复已被收入口径统一的 fixes 账本。",
              "links": [
                {
                  "title": "fixes.md",
                  "path": "docs/fixes.md"
                }
              ]
            },
            {
              "badge": "Infra",
              "title": "接管已有 run 并补齐元数据",
              "summary": "范围：research/mdit_trial_runner.py + docs/mdit/research_journal.md + docs/fixes.md 背景：现有 run unplug_charger_mdit_rgb_text_3token_100__lane_a_mainline_5…",
              "metrics": [
                {
                  "label": "日期",
                  "value": "2026-04-18"
                },
                {
                  "label": "类型",
                  "value": "修复"
                },
                {
                  "label": "状态",
                  "value": "已记录"
                }
              ],
              "outcome": "这条修复已被收入口径统一的 fixes 账本。",
              "links": [
                {
                  "title": "fixes.md",
                  "path": "docs/fixes.md"
                }
              ]
            },
            {
              "badge": "Infra",
              "title": "训练完成并进入待审计状态",
              "summary": "范围：research/mdit_trial_runner.py + docs/mdit/research_journal.md + docs/fixes.md 背景：候选 run unplug_charger_mdit_lane_c_mtdp_strict_fm_v1__lane_c_mtdp_…",
              "metrics": [
                {
                  "label": "日期",
                  "value": "2026-04-18"
                },
                {
                  "label": "类型",
                  "value": "修复"
                },
                {
                  "label": "状态",
                  "value": "已记录"
                }
              ],
              "outcome": "这条修复已被收入口径统一的 fixes 账本。",
              "links": [
                {
                  "title": "fixes.md",
                  "path": "docs/fixes.md"
                }
              ]
            }
          ]
        },
        {
          "date": "2026-04-17",
          "cards": [
            {
              "badge": "Infra",
              "title": "更新接管器 fallback：最佳路线改为从 100 epoch latest 续到 500",
              "summary": "范围：research/mdit_takeover_controller.py + scripts/run_mdit_takeover.py + tmux:mdit_autoresearch:takeover_guard + docs/fixes.md 背景：此前接管器在 MTDP strict…",
              "metrics": [
                {
                  "label": "日期",
                  "value": "2026-04-17"
                },
                {
                  "label": "类型",
                  "value": "修复"
                },
                {
                  "label": "状态",
                  "value": "已记录"
                }
              ],
              "outcome": "这条修复已被收入口径统一的 fixes 账本。",
              "links": [
                {
                  "title": "fixes.md",
                  "path": "docs/fixes.md"
                }
              ]
            }
          ]
        }
      ],
      "findings": [
        {
          "title": "fixes 账本只做事实源，不再占据公开主页中心",
          "body": "infra 页面保留全局修复脉络，但首页只抽取少量关键转折，不再把调试流水账摆在最前面。"
        },
        {
          "title": "留痕格式已经进入可复用阶段",
          "body": "训练、评估、审计和研究日志都开始有固定产物路径和记录口径，后续 agent 不需要重新发明首页结构。"
        }
      ],
      "evidence_links": [
        {
          "title": "fixes.md",
          "path": "docs/fixes.md",
          "summary": "全局修复与调试事实源。",
          "label": "查看原始记录"
        },
        {
          "title": "代码结构文档",
          "path": "docs/code-structure-zh.md",
          "summary": "补充仓库结构与模块关系。",
          "label": "查看原始记录"
        },
        {
          "title": "PDIT vs MDIT 对照",
          "path": "docs/pdit-vs-mdit.md",
          "summary": "帮助解释两条主线的定位差异。",
          "label": "查看原始记录"
        }
      ],
      "chart_ids": [
        "results-status-overview",
        "branch-doc-volume"
      ],
      "media_items": [
        {
          "task_id": "infra-audit",
          "kind": "image",
          "title": "修复现场截图 A",
          "caption": "记录工程修复过程中的现场证据。",
          "path": "docs/image/fixes/1776007255805.png",
          "showcase_preview": false
        },
        {
          "task_id": "infra-audit",
          "kind": "image",
          "title": "修复现场截图 B",
          "caption": "作为 fixes 时间线的图像补充。",
          "path": "docs/image/fixes/1776007270781.png",
          "showcase_preview": false
        }
      ],
      "home_entries": [],
      "task_badge": "Infra",
      "docs": [
        "docs/fixes.md",
        "docs/code-structure-zh.md",
        "docs/pdit-vs-mdit.md"
      ]
    }
  ],
  "branches": [
    {
      "id": "robot-platform",
      "title": "具身采集平台",
      "summary": "围绕 Sim2Real 映射、数字孪生、示教回放和数值逆解搭起来的六轴臂实验平台，可直接承接具身学习数据采集。",
      "status": "已固化",
      "status_group": "done",
      "page_path": "homepage/branches/robot-platform/",
      "latest_update": "2026-04-02",
      "hero_metrics": [
        {
          "label": "机械臂",
          "value": "6 轴"
        },
        {
          "label": "IK 精度",
          "value": "< 8 mm"
        },
        {
          "label": "Demo",
          "value": "3 个"
        }
      ],
      "related_task_ids": [
        "dummy-sim2real-platform"
      ],
      "timeline_groups": [
        {
          "date": "2026-04-02",
          "cards": [
            {
              "badge": "Safety",
              "title": "补齐 CAN 限流与示教退出保护，平台状态正式固化",
              "summary": "采样节奏、回放上限、超时保护、RDP 稀疏化和退出示教时的平滑回退全部补齐后，这套六轴臂平台不再只是能演示，而是具备长期复用的数据采集稳定性。",
              "metrics": [
                {
                  "label": "阶段",
                  "value": "04"
                },
                {
                  "label": "最小采样",
                  "value": "50 ms"
                },
                {
                  "label": "回放上限",
                  "value": "20 Hz"
                }
              ],
              "outcome": "平台从“功能打通”走到了“可以稳定拿来做真机轨迹采集”的状态，因此被固定进已完成区。",
              "links": [
                {
                  "title": "CAN 通信保护总结",
                  "path": "homepage/external/dummy_controller/CAN_PROTECTION_SUMMARY.md"
                },
                {
                  "title": "示教边界与退出处理",
                  "path": "homepage/external/dummy_controller/TEACH_BOUNDARY_COMPLETE.md"
                }
              ],
              "task_id": "dummy-sim2real-platform",
              "task_title": "六轴臂 Sim2Real 采集平台搭建"
            }
          ]
        },
        {
          "date": "2026-03-28",
          "cards": [
            {
              "badge": "Kinematics",
              "title": "用 MuJoCo 正解与数值逆解建立末端闭环控制",
              "summary": "FK 直接复用 MuJoCo 的完整几何与 site 定义，IK 则用 L-BFGS-B 在关节限位内做多初始猜测优化，把“目标位姿 → 逆解 → 影子预览 → 真机下发”串成闭环。",
              "metrics": [
                {
                  "label": "阶段",
                  "value": "03"
                },
                {
                  "label": "IK 精度",
                  "value": "< 8 mm"
                },
                {
                  "label": "初始猜测",
                  "value": "6 组"
                }
              ],
              "outcome": "这套平台已经具备服务模仿学习和世界模型的数据接口，不再只是一个可视化控制 Demo。",
              "links": [
                {
                  "title": "项目总览",
                  "path": "homepage/external/dummy_controller/INTERVIEW_TECH_DOC.md"
                },
                {
                  "title": "正逆运动学技术文档",
                  "path": "homepage/external/dummy_controller/docs/技术文档_正逆运动学与示教系统.md"
                }
              ],
              "task_id": "dummy-sim2real-platform",
              "task_title": "六轴臂 Sim2Real 采集平台搭建"
            }
          ]
        },
        {
          "date": "2026-03-22",
          "cards": [
            {
              "badge": "Planning",
              "title": "把仿真规划与示教录制做成连续轨迹链路",
              "summary": "通过主体 / 影子 / IK 三套模型隔离运行状态，让规划预览和真机监控能够同屏；同时把示教记录改成带时间戳的 10 Hz 连续轨迹，并接入 RDP 稀疏化与按节奏回放。",
              "metrics": [
                {
                  "label": "阶段",
                  "value": "02"
                },
                {
                  "label": "模型数",
                  "value": "3"
                },
                {
                  "label": "示教录制",
                  "value": "10 Hz"
                }
              ],
              "outcome": "规划、示教和回放开始共享同一种轨迹格式，这一步已经非常接近模仿学习数据采集。",
              "links": [
                {
                  "title": "项目总览",
                  "path": "homepage/external/dummy_controller/INTERVIEW_TECH_DOC.md"
                }
              ],
              "task_id": "dummy-sim2real-platform",
              "task_title": "六轴臂 Sim2Real 采集平台搭建"
            }
          ]
        },
        {
          "date": "2026-03-15",
          "cards": [
            {
              "badge": "Sim2Real",
              "title": "打通六轴映射与真机-仿真数字孪生同步",
              "summary": "围绕单位制、轴向符号和零位偏置统一出一套 firmware_to_urdf() 映射，再用 EMA 平滑把真机轮询稳定映射成 MuJoCo 侧的连续显示，解决了数字孪生最先卡住的坐标系问题。",
              "metrics": [
                {
                  "label": "阶段",
                  "value": "01"
                },
                {
                  "label": "六轴映射",
                  "value": "已打通"
                },
                {
                  "label": "同步节奏",
                  "value": "2 → 20 Hz"
                }
              ],
              "outcome": "真机姿态现在可以稳定映射到 MuJoCo 侧，Sim2Real 这条基础链路已经成立。",
              "links": [
                {
                  "title": "项目总览",
                  "path": "homepage/external/dummy_controller/INTERVIEW_TECH_DOC.md"
                }
              ],
              "task_id": "dummy-sim2real-platform",
              "task_title": "六轴臂 Sim2Real 采集平台搭建"
            }
          ]
        }
      ],
      "evidence_links": [
        {
          "title": "INTERVIEW TECH DOC",
          "path": "homepage/external/dummy_controller/INTERVIEW_TECH_DOC.md",
          "summary": "",
          "label": "查看原始记录"
        },
        {
          "title": "技术文档 正逆运动学与示教系统",
          "path": "homepage/external/dummy_controller/docs/技术文档_正逆运动学与示教系统.md",
          "summary": "",
          "label": "查看原始记录"
        }
      ],
      "chart_ids": [],
      "summary_cards": [
        {
          "eyebrow": "Branch",
          "title": "六轴运动映射和数字孪生同步已经打通",
          "body": "把单位制、轴向符号和 J3 的 90° 零位偏置统一进 firmware_to_urdf()，再用 EMA 平滑把真机状态稳定映射到 MuJoCo 侧，真机与仿真终于站到同一坐标口径上。",
          "metrics": [
            {
              "label": "映射轴数",
              "value": "6"
            },
            {
              "label": "仿真同步",
              "value": "20 Hz"
            },
            {
              "label": "J3 偏置",
              "value": "90°"
            }
          ]
        }
      ]
    },
    {
      "id": "pdit",
      "title": "PDIT 主线",
      "summary": "当前最稳定的点云行为锚点，负责提供可复核的 baseline 与 checkpoint 证据。",
      "status": "稳定锚点",
      "status_group": "done",
      "page_path": "homepage/branches/pdit/",
      "latest_update": "2026-04-09",
      "hero_metrics": [
        {
          "label": "best success@20",
          "value": "0.95"
        },
        {
          "label": "100 回合复核",
          "value": "0.85"
        },
        {
          "label": "best epoch",
          "value": "500"
        }
      ],
      "related_task_ids": [
        "pdit-anchor"
      ],
      "timeline_groups": [
        {
          "date": "2026-04-09",
          "cards": [
            {
              "badge": "PDIT 主线",
              "title": "根目录重整后的最优策略复核通过",
              "summary": "对同一 best_success checkpoint 重新做行为复核，确认仓库结构重整没有把当前最优策略改坏。",
              "metrics": [
                {
                  "label": "20 回合",
                  "value": "1.00"
                },
                {
                  "label": "100 回合",
                  "value": "0.85"
                },
                {
                  "label": "mean steps@100",
                  "value": "83.82"
                }
              ],
              "outcome": "Baseline@500 继续作为当前 PDIT 行为锚点。",
              "links": [
                {
                  "title": "20 回合复核",
                  "path": "ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/root_layout_recheck_20.json"
                },
                {
                  "title": "100 回合复核",
                  "path": "ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/root_layout_recheck_100.json"
                },
                {
                  "title": "checkpoint manifest",
                  "path": "docs/top10-checkpoint-manifest.json"
                }
              ],
              "task_id": "pdit-anchor",
              "task_title": "PDIT 基线恢复与锚点固化"
            },
            {
              "badge": "Regression",
              "title": "固定 batch 数值回归重新固化为新基准",
              "summary": "根目录重整后旧 reference 不再 bitwise 对齐，于是把固定 batch regression 重新固化成新的 canonical baseline。",
              "metrics": [
                {
                  "label": "reference",
                  "value": "已重建"
                },
                {
                  "label": "脚本",
                  "value": "verify_baseline_regression.py"
                },
                {
                  "label": "状态",
                  "value": "可重复"
                }
              ],
              "outcome": "后续代码重构有了统一的数值回归锚点。",
              "links": [
                {
                  "title": "新 regression reference",
                  "path": "docs/baseline-regression-reference.json"
                },
                {
                  "title": "恢复进展文档",
                  "path": "docs/pdit/2026-04-08-fm-recovery-progress-zh.md"
                }
              ],
              "task_id": "pdit-anchor",
              "task_title": "PDIT 基线恢复与锚点固化"
            }
          ]
        },
        {
          "date": "2026-04-08",
          "cards": [
            {
              "badge": "Repair",
              "title": "训练与离线审计链关键 bug 修完",
              "summary": "本地导入污染、FM 导入耦合、PointNet 导入、checkpoint 原子保存、子进程 audit 隔离和 audit-only stage 覆盖问题都在同一轮里修正。",
              "metrics": [
                {
                  "label": "关键修复",
                  "value": "6"
                },
                {
                  "label": "audit-only",
                  "value": "已修"
                },
                {
                  "label": "latest.pt",
                  "value": "原子保存"
                }
              ],
              "outcome": "之前“模型完全学不会”的结论被重新归因为工程与评估链问题。",
              "links": [
                {
                  "title": "恢复进展文档",
                  "path": "docs/pdit/2026-04-08-fm-recovery-progress-zh.md"
                },
                {
                  "title": "训练模型审计",
                  "path": "docs/pdit/2026-04-07-training-model-audit-zh.md"
                }
              ],
              "task_id": "pdit-anchor",
              "task_title": "PDIT 基线恢复与锚点固化"
            },
            {
              "badge": "Baseline",
              "title": "Baseline@100 恢复到 0.90 success@20",
              "summary": "修复后的 baseline 不再早期崩掉，在 100 epoch 已经能稳定学出可用行为。",
              "metrics": [
                {
                  "label": "success@100",
                  "value": "0.90"
                },
                {
                  "label": "best valid",
                  "value": "0.661"
                },
                {
                  "label": "best epoch",
                  "value": "31"
                }
              ],
              "outcome": "点云主线的可训练性已经重新被确认。",
              "links": [
                {
                  "title": "恢复进展文档",
                  "path": "docs/pdit/2026-04-08-fm-recovery-progress-zh.md"
                },
                {
                  "title": "训练模型审计",
                  "path": "docs/pdit/2026-04-07-training-model-audit-zh.md"
                }
              ],
              "task_id": "pdit-anchor",
              "task_title": "PDIT 基线恢复与锚点固化"
            },
            {
              "badge": "Anchor",
              "title": "Baseline@500 锚定 0.95 success@20",
              "summary": "100/200/300/400/500 五个检查点的 success 曲线重新梳理后，最强点实际落在 500 epoch，而不是中途崩塌。",
              "metrics": [
                {
                  "label": "100",
                  "value": "0.75"
                },
                {
                  "label": "300",
                  "value": "0.90"
                },
                {
                  "label": "500",
                  "value": "0.95"
                }
              ],
              "outcome": "修复后的 baseline 没有出现之前 feared 的 300→500 崩塌。",
              "links": [
                {
                  "title": "audit report",
                  "path": "ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/audit_report.json"
                },
                {
                  "title": "summary",
                  "path": "ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/summary.json"
                }
              ],
              "task_id": "pdit-anchor",
              "task_title": "PDIT 基线恢复与锚点固化"
            },
            {
              "badge": "Ablation",
              "title": "统计特征增强对照作废，官方式动态候选仍待验证",
              "summary": "统计特征归一化 + 原始增强这条对照之所以表现差，并不只是超参问题，而是增强实现把 rot6d 当成了可平移点；更接近官方 DiT 动态的候选在 valid loss 上更好，但还没形成新的行为锚点。",
              "metrics": [
                {
                  "label": "增强对照@100",
                  "value": "0.55"
                },
                {
                  "label": "动态候选 best valid",
                  "value": "0.572"
                },
                {
                  "label": "状态",
                  "value": "待行为验证"
                }
              ],
              "outcome": "旧增强对照不再作为结构结论引用，当前锚点仍是 baseline@500。",
              "links": [
                {
                  "title": "恢复进展文档",
                  "path": "docs/pdit/2026-04-08-fm-recovery-progress-zh.md"
                },
                {
                  "title": "训练模型审计",
                  "path": "docs/pdit/2026-04-07-training-model-audit-zh.md"
                }
              ],
              "task_id": "pdit-anchor",
              "task_title": "PDIT 基线恢复与锚点固化"
            }
          ]
        }
      ],
      "evidence_links": [
        {
          "title": "fm recovery progress zh",
          "path": "docs/pdit/2026-04-08-fm-recovery-progress-zh.md",
          "summary": "",
          "label": "查看原始记录"
        },
        {
          "title": "top10 checkpoint manifest",
          "path": "docs/top10-checkpoint-manifest.json",
          "summary": "",
          "label": "查看原始记录"
        }
      ],
      "chart_ids": [
        "pdit-success-curve",
        "pdit-loss-tail",
        "pdit-mse-tail"
      ],
      "summary_cards": [
        {
          "eyebrow": "Branch",
          "title": "行为锚点已经稳定下来",
          "body": "Baseline@500 在离线 20 回合达到 0.95，根目录重整后的 100 回合复核仍有 0.85，说明当前最优策略不是一次性好运气。",
          "metrics": [
            {
              "label": "20 回合",
              "value": "0.95"
            },
            {
              "label": "100 回合",
              "value": "0.85"
            },
            {
              "label": "best epoch",
              "value": "500"
            }
          ]
        }
      ]
    },
    {
      "id": "mdit",
      "title": "MDIT 研究线",
      "summary": "围绕 RGB+Text 主线、关键对照和续训接管形成的研究线，已经沉淀出日志、主线路径和接管记录。",
      "status": "推进中",
      "status_group": "in_progress",
      "page_path": "homepage/branches/mdit/",
      "latest_update": "2026-04-18",
      "hero_metrics": [
        {
          "label": "当前锚点",
          "value": "0.55@100"
        },
        {
          "label": "epoch 50",
          "value": "0.25"
        },
        {
          "label": "续训进度",
          "value": "epoch 99"
        }
      ],
      "related_task_ids": [
        "mdit-mainline"
      ],
      "timeline_groups": [
        {
          "date": "2026-04-18",
          "cards": [
            {
              "badge": "Mainline Resume",
              "title": "严格 MTDP 对照未过共享审计后，研究重新收束到 RGB+Text 主线",
              "summary": "严格 MTDP 对照没有通过共享 gate，项目没有继续把预算散到弱候选上，而是立即收回到唯一过审的 RGB+Text 主线。",
              "metrics": [
                {
                  "label": "当前锚点",
                  "value": "0.55@100"
                },
                {
                  "label": "回退动作",
                  "value": "best500 fallback"
                },
                {
                  "label": "原因",
                  "value": "recipe drift"
                }
              ],
              "outcome": "MDIT 重新聚焦到唯一可信的 RGB+Text 主线，而不是继续同时养多个弱对照。",
              "links": [
                {
                  "title": "研究日志",
                  "path": "docs/mdit/research_journal.md"
                },
                {
                  "title": "当前主线路径",
                  "path": "docs/mdit/best_path.md"
                }
              ],
              "task_id": "mdit-mainline",
              "task_title": "MDIT RGB+Text 主线推进"
            },
            {
              "badge": "Takeover",
              "title": "100→500 主线续训在 supervisor 下恢复",
              "summary": "早先的 fallback run 首个 optimizer step 就崩掉，后来又确认 watchdog 误判了“已接管但其实空转”的状态；这一天把 optimizer / scheduler 兼容和 supervisor 都补上了。",
              "metrics": [
                {
                  "label": "续训目标",
                  "value": "500 epoch"
                },
                {
                  "label": "当前 best",
                  "value": "0.55@100"
                },
                {
                  "label": "状态",
                  "value": "已恢复"
                }
              ],
              "outcome": "后续 500 epoch 结果会继续积累在同一条主线 lineage 上，而不是再新开匿名 run。",
              "links": [
                {
                  "title": "研究日志",
                  "path": "docs/mdit/research_journal.md"
                },
                {
                  "title": "W&B 摘要",
                  "path": "ckpt/unplug_charger_mdit_rgb_text_3token_100__lane_a_mainline_500_resume__e0500__20260418_005723/wandb/run-20260418_022912-8ikgnzbw/files/wandb-summary.json"
                }
              ],
              "task_id": "mdit-mainline",
              "task_title": "MDIT RGB+Text 主线推进"
            }
          ]
        },
        {
          "date": "2026-04-17",
          "cards": [
            {
              "badge": "Anchor",
              "title": "RGB+Text 当前主线被正式冻结为阶段锚点",
              "summary": "在共享 audit 链下，当前 RGB+Text 主线是当时唯一完成锁定审计的候选，因此被正式冻结为主线锚点。",
              "metrics": [
                {
                  "label": "epoch 50",
                  "value": "0.25"
                },
                {
                  "label": "epoch 100",
                  "value": "0.55"
                },
                {
                  "label": "mean steps",
                  "value": "121.75"
                }
              ],
              "outcome": "后续其他对照只有在同一审计口径下超过 0.55，才有资格接管主线。",
              "links": [
                {
                  "title": "当前主线路径",
                  "path": "docs/mdit/best_path.md"
                },
                {
                  "title": "共享审计结果",
                  "path": "ckpt/unplug_charger_mdit_rgb_text_3token_100/audit_report.json"
                }
              ],
              "task_id": "mdit-mainline",
              "task_title": "MDIT RGB+Text 主线推进"
            },
            {
              "badge": "Comparison",
              "title": "平滑动作对照审计后确认弱于当前主线",
              "summary": "平滑动作这条对照没有真正触及核心失败模式，在 50 / 100 epoch 的表现都落在当前锚点之下。",
              "metrics": [
                {
                  "label": "epoch 50",
                  "value": "0.20"
                },
                {
                  "label": "epoch 100",
                  "value": "0.35"
                },
                {
                  "label": "主要失败",
                  "value": "超时未完成"
                }
              ],
              "outcome": "这条稳定化对照线被明确降级为参考线，而不是新主线。",
              "links": [
                {
                  "title": "研究日志",
                  "path": "docs/mdit/research_journal.md"
                },
                {
                  "title": "执行手册",
                  "path": "docs/mdit/2026-04-16-mdit-execution-manual.md"
                }
              ],
              "task_id": "mdit-mainline",
              "task_title": "MDIT RGB+Text 主线推进"
            },
            {
              "badge": "Infra Fix",
              "title": "faithful recipe 对照的首轮失败被确认是缓存 / 网络问题",
              "summary": "第一次 faithful recipe 对照启动时卡在 Hugging Face 远程握手，而不是训练本身；autoresearch 随后改成优先吃本地缓存并强制 offline。",
              "metrics": [
                {
                  "label": "HF 模式",
                  "value": "offline"
                },
                {
                  "label": "问题归因",
                  "value": "启动链"
                },
                {
                  "label": "模型判断",
                  "value": "未下结论"
                }
              ],
              "outcome": "这条 faithful recipe 对照的首轮失败不再被误记成“方法本身无效”。",
              "links": [
                {
                  "title": "研究日志",
                  "path": "docs/mdit/research_journal.md"
                },
                {
                  "title": "执行手册",
                  "path": "docs/mdit/2026-04-16-mdit-execution-manual.md"
                }
              ],
              "task_id": "mdit-mainline",
              "task_title": "MDIT RGB+Text 主线推进"
            }
          ]
        },
        {
          "date": "2026-04-16",
          "cards": [
            {
              "badge": "Manual",
              "title": "MDIT 执行手册定版，主线推进开始有统一口径",
              "summary": "从训练命令、共享评估链、晋级门槛到接管方式，全部被整理成固定手册，后续不再靠零散命令和口口相传维持。",
              "metrics": [
                {
                  "label": "搜索线",
                  "value": "2"
                },
                {
                  "label": "闸门",
                  "value": "100/300/500"
                },
                {
                  "label": "审计链",
                  "value": "锁定"
                }
              ],
              "outcome": "MDIT 开始从零散 run note 转成真正可持续维护的主线研究线。",
              "links": [
                {
                  "title": "执行手册",
                  "path": "docs/mdit/2026-04-16-mdit-execution-manual.md"
                },
                {
                  "title": "研究日志",
                  "path": "docs/mdit/research_journal.md"
                }
              ],
              "task_id": "mdit-mainline",
              "task_title": "MDIT RGB+Text 主线推进"
            }
          ]
        }
      ],
      "evidence_links": [
        {
          "title": "research journal",
          "path": "docs/mdit/research_journal.md",
          "summary": "",
          "label": "查看原始记录"
        },
        {
          "title": "best path",
          "path": "docs/mdit/best_path.md",
          "summary": "",
          "label": "查看原始记录"
        }
      ],
      "chart_ids": [
        "mdit-success-curve",
        "mdit-loss-curve",
        "mdit-mse-curve"
      ],
      "summary_cards": [
        {
          "eyebrow": "Branch",
          "title": "RGB+Text 当前锚点固定在 0.55@100",
          "body": "共享 audit 链确认过的最好结果仍是 epoch50=0.25、epoch100=0.55。这是现在所有其他对照必须超过的门槛。",
          "metrics": [
            {
              "label": "epoch 50",
              "value": "0.25"
            },
            {
              "label": "epoch 100",
              "value": "0.55"
            },
            {
              "label": "状态",
              "value": "已冻结"
            }
          ]
        }
      ]
    },
    {
      "id": "lelan",
      "title": "LeLaN 执行线",
      "summary": "先把训练与审计链路固定，再逐步长成正式实验档案和 demo 展示入口。",
      "status": "铺设中",
      "status_group": "in_progress",
      "page_path": "homepage/branches/lelan/",
      "latest_update": "2026-04-12",
      "hero_metrics": [
        {
          "label": "输入",
          "value": "5 路 RGB / 3 帧"
        },
        {
          "label": "动作步数",
          "value": "8"
        },
        {
          "label": "100 epoch gate",
          "value": "0.45"
        }
      ],
      "related_task_ids": [
        "lelan-pipeline"
      ],
      "timeline_groups": [
        {
          "date": "2026-04-12",
          "cards": [
            {
              "badge": "Recipe",
              "title": "LeLaN 主线配方先固定为 5 路 RGB、3 帧观测和 8 步动作",
              "summary": "这一轮先固定 5 路 RGB、3 帧观测、horizon=32、8 步动作和平滑动作，再用 100 epoch / 20 episode gate 管住节奏，不急着改 backbone。",
              "metrics": [
                {
                  "label": "RGB",
                  "value": "5 路"
                },
                {
                  "label": "观测帧",
                  "value": "3"
                },
                {
                  "label": "动作步数",
                  "value": "8"
                }
              ],
              "outcome": "LeLaN 第一轮重点从“改模型”转成“先把工程链路立起来”。",
              "links": [
                {
                  "title": "执行计划",
                  "path": "docs/lelan/2026-04-12-lelan-autoresearch-execution-plan-zh.md"
                },
                {
                  "title": "LeLaN research README",
                  "path": "docs/lelan/research/README.md"
                }
              ],
              "task_id": "lelan-pipeline",
              "task_title": "LeLaN 自动研究链路固化"
            },
            {
              "badge": "Eval Chain",
              "title": "EMA、success eval 与 offline eval ckpt 双路径补齐",
              "summary": "训练中 success gate 和不依赖 RLBench 的离线 eval ckpt 两条路径被明确分开，resume 和 prefer-ema 也都补齐了兼容。",
              "metrics": [
                {
                  "label": "EMA",
                  "value": "on"
                },
                {
                  "label": "success gate",
                  "value": "100@20"
                },
                {
                  "label": "eval ckpt",
                  "value": "100 epoch"
                }
              ],
              "outcome": "LeLaN 后续 run 不会再出现“训练、评估、选模链路断开”的状态。",
              "links": [
                {
                  "title": "执行计划",
                  "path": "docs/lelan/2026-04-12-lelan-autoresearch-execution-plan-zh.md"
                },
                {
                  "title": "LeLaN research README",
                  "path": "docs/lelan/research/README.md"
                }
              ],
              "task_id": "lelan-pipeline",
              "task_title": "LeLaN 自动研究链路固化"
            },
            {
              "badge": "Trace",
              "title": "autoresearch 留痕规范一次性固定下来",
              "summary": "manifest、summary、dataset_stats、audit_report、trial_request 和 change_summary 都被写进固定产物约定里，后续可以直接追加而不是重新发明格式。",
              "metrics": [
                {
                  "label": "核心产物",
                  "value": "7+"
                },
                {
                  "label": "筛选分支",
                  "value": "3"
                },
                {
                  "label": "停止门槛",
                  "value": "0.45"
                }
              ],
              "outcome": "LeLaN 后续最先长出来的是“可审计的工程链路”，而不是无上下文的零散 run。",
              "links": [
                {
                  "title": "执行计划",
                  "path": "docs/lelan/2026-04-12-lelan-autoresearch-execution-plan-zh.md"
                },
                {
                  "title": "LeLaN research README",
                  "path": "docs/lelan/research/README.md"
                }
              ],
              "task_id": "lelan-pipeline",
              "task_title": "LeLaN 自动研究链路固化"
            }
          ]
        }
      ],
      "evidence_links": [
        {
          "title": "lelan autoresearch execution plan zh",
          "path": "docs/lelan/2026-04-12-lelan-autoresearch-execution-plan-zh.md",
          "summary": "",
          "label": "查看原始记录"
        },
        {
          "title": "README",
          "path": "docs/lelan/research/README.md",
          "summary": "",
          "label": "查看原始记录"
        }
      ],
      "chart_ids": [
        "lelan-stage-gates"
      ],
      "summary_cards": [
        {
          "eyebrow": "Branch",
          "title": "第一轮 recipe 固定，不先碰 backbone",
          "body": "先锁定 5 路 RGB、3 帧观测、horizon=32、8 步动作和 smooth_actions，把工程链路建立清楚再谈结构创新。",
          "metrics": [
            {
              "label": "RGB",
              "value": "5 路"
            },
            {
              "label": "观测帧",
              "value": "3"
            },
            {
              "label": "动作步数",
              "value": "8"
            }
          ]
        }
      ]
    }
  ],
  "timeline_page_groups": [
    {
      "date": "2026-04-18",
      "cards": [
        {
          "badge": "Mainline Resume",
          "title": "严格 MTDP 对照未过共享审计后，研究重新收束到 RGB+Text 主线",
          "summary": "严格 MTDP 对照没有通过共享 gate，项目没有继续把预算散到弱候选上，而是立即收回到唯一过审的 RGB+Text 主线。",
          "metrics": [
            {
              "label": "当前锚点",
              "value": "0.55@100"
            },
            {
              "label": "回退动作",
              "value": "best500 fallback"
            },
            {
              "label": "原因",
              "value": "recipe drift"
            }
          ],
          "outcome": "MDIT 重新聚焦到唯一可信的 RGB+Text 主线，而不是继续同时养多个弱对照。",
          "links": [
            {
              "title": "研究日志",
              "path": "docs/mdit/research_journal.md"
            },
            {
              "title": "当前主线路径",
              "path": "docs/mdit/best_path.md"
            }
          ],
          "task_id": "mdit-mainline",
          "task_title": "MDIT RGB+Text 主线推进",
          "task_path": "homepage/tasks/mdit-mainline/"
        },
        {
          "badge": "Takeover",
          "title": "100→500 主线续训在 supervisor 下恢复",
          "summary": "早先的 fallback run 首个 optimizer step 就崩掉，后来又确认 watchdog 误判了“已接管但其实空转”的状态；这一天把 optimizer / scheduler 兼容和 supervisor 都补上了。",
          "metrics": [
            {
              "label": "续训目标",
              "value": "500 epoch"
            },
            {
              "label": "当前 best",
              "value": "0.55@100"
            },
            {
              "label": "状态",
              "value": "已恢复"
            }
          ],
          "outcome": "后续 500 epoch 结果会继续积累在同一条主线 lineage 上，而不是再新开匿名 run。",
          "links": [
            {
              "title": "研究日志",
              "path": "docs/mdit/research_journal.md"
            },
            {
              "title": "W&B 摘要",
              "path": "ckpt/unplug_charger_mdit_rgb_text_3token_100__lane_a_mainline_500_resume__e0500__20260418_005723/wandb/run-20260418_022912-8ikgnzbw/files/wandb-summary.json"
            }
          ],
          "task_id": "mdit-mainline",
          "task_title": "MDIT RGB+Text 主线推进",
          "task_path": "homepage/tasks/mdit-mainline/"
        },
        {
          "badge": "Infra",
          "title": "修复主线 100->500 续训兼容并恢复真实后台接管",
          "summary": "范围：mdit/train/checkpoints.py + mdit/train/runner.py + research/mdit_takeover_controller.py + scripts/run_mdit_takeover_supervisor.py + tmux:mdit_auto…",
          "metrics": [
            {
              "label": "日期",
              "value": "2026-04-18"
            },
            {
              "label": "类型",
              "value": "修复"
            },
            {
              "label": "状态",
              "value": "已记录"
            }
          ],
          "outcome": "这条修复已被收入口径统一的 fixes 账本。",
          "links": [
            {
              "title": "fixes.md",
              "path": "docs/fixes.md"
            }
          ],
          "task_id": "infra-audit",
          "task_title": "训练与审计基础设施修复",
          "task_path": "homepage/tasks/infra-audit/"
        },
        {
          "badge": "Infra",
          "title": "离线审计完成",
          "summary": "范围：research/mdit_trial_runner.py + docs/mdit/research_journal.md + docs/fixes.md 背景：候选 run unplug_charger_mdit_lane_c_mtdp_strict_fm_v1__lane_c_mtdp_…",
          "metrics": [
            {
              "label": "日期",
              "value": "2026-04-18"
            },
            {
              "label": "类型",
              "value": "修复"
            },
            {
              "label": "状态",
              "value": "已记录"
            }
          ],
          "outcome": "这条修复已被收入口径统一的 fixes 账本。",
          "links": [
            {
              "title": "fixes.md",
              "path": "docs/fixes.md"
            }
          ],
          "task_id": "infra-audit",
          "task_title": "训练与审计基础设施修复",
          "task_path": "homepage/tasks/infra-audit/"
        },
        {
          "badge": "Infra",
          "title": "接管器触发 500 epoch 最优路线 fallback",
          "summary": "范围：research/mdit_takeover_controller.py + docs/fixes.md + docs/mdit/research_journal.md 背景：严格挑战线 unplug_charger_mdit_lane_c_mtdp_strict_fm_v1__lane_c…",
          "metrics": [
            {
              "label": "日期",
              "value": "2026-04-18"
            },
            {
              "label": "类型",
              "value": "修复"
            },
            {
              "label": "状态",
              "value": "已记录"
            }
          ],
          "outcome": "这条修复已被收入口径统一的 fixes 账本。",
          "links": [
            {
              "title": "fixes.md",
              "path": "docs/fixes.md"
            }
          ],
          "task_id": "infra-audit",
          "task_title": "训练与审计基础设施修复",
          "task_path": "homepage/tasks/infra-audit/"
        },
        {
          "badge": "Infra",
          "title": "接管已有 run 并补齐元数据",
          "summary": "范围：research/mdit_trial_runner.py + docs/mdit/research_journal.md + docs/fixes.md 背景：现有 run unplug_charger_mdit_rgb_text_3token_100__lane_a_mainline_5…",
          "metrics": [
            {
              "label": "日期",
              "value": "2026-04-18"
            },
            {
              "label": "类型",
              "value": "修复"
            },
            {
              "label": "状态",
              "value": "已记录"
            }
          ],
          "outcome": "这条修复已被收入口径统一的 fixes 账本。",
          "links": [
            {
              "title": "fixes.md",
              "path": "docs/fixes.md"
            }
          ],
          "task_id": "infra-audit",
          "task_title": "训练与审计基础设施修复",
          "task_path": "homepage/tasks/infra-audit/"
        },
        {
          "badge": "Infra",
          "title": "训练完成并进入待审计状态",
          "summary": "范围：research/mdit_trial_runner.py + docs/mdit/research_journal.md + docs/fixes.md 背景：候选 run unplug_charger_mdit_lane_c_mtdp_strict_fm_v1__lane_c_mtdp_…",
          "metrics": [
            {
              "label": "日期",
              "value": "2026-04-18"
            },
            {
              "label": "类型",
              "value": "修复"
            },
            {
              "label": "状态",
              "value": "已记录"
            }
          ],
          "outcome": "这条修复已被收入口径统一的 fixes 账本。",
          "links": [
            {
              "title": "fixes.md",
              "path": "docs/fixes.md"
            }
          ],
          "task_id": "infra-audit",
          "task_title": "训练与审计基础设施修复",
          "task_path": "homepage/tasks/infra-audit/"
        }
      ]
    },
    {
      "date": "2026-04-17",
      "cards": [
        {
          "badge": "Anchor",
          "title": "RGB+Text 当前主线被正式冻结为阶段锚点",
          "summary": "在共享 audit 链下，当前 RGB+Text 主线是当时唯一完成锁定审计的候选，因此被正式冻结为主线锚点。",
          "metrics": [
            {
              "label": "epoch 50",
              "value": "0.25"
            },
            {
              "label": "epoch 100",
              "value": "0.55"
            },
            {
              "label": "mean steps",
              "value": "121.75"
            }
          ],
          "outcome": "后续其他对照只有在同一审计口径下超过 0.55，才有资格接管主线。",
          "links": [
            {
              "title": "当前主线路径",
              "path": "docs/mdit/best_path.md"
            },
            {
              "title": "共享审计结果",
              "path": "ckpt/unplug_charger_mdit_rgb_text_3token_100/audit_report.json"
            }
          ],
          "task_id": "mdit-mainline",
          "task_title": "MDIT RGB+Text 主线推进",
          "task_path": "homepage/tasks/mdit-mainline/"
        },
        {
          "badge": "Comparison",
          "title": "平滑动作对照审计后确认弱于当前主线",
          "summary": "平滑动作这条对照没有真正触及核心失败模式，在 50 / 100 epoch 的表现都落在当前锚点之下。",
          "metrics": [
            {
              "label": "epoch 50",
              "value": "0.20"
            },
            {
              "label": "epoch 100",
              "value": "0.35"
            },
            {
              "label": "主要失败",
              "value": "超时未完成"
            }
          ],
          "outcome": "这条稳定化对照线被明确降级为参考线，而不是新主线。",
          "links": [
            {
              "title": "研究日志",
              "path": "docs/mdit/research_journal.md"
            },
            {
              "title": "执行手册",
              "path": "docs/mdit/2026-04-16-mdit-execution-manual.md"
            }
          ],
          "task_id": "mdit-mainline",
          "task_title": "MDIT RGB+Text 主线推进",
          "task_path": "homepage/tasks/mdit-mainline/"
        },
        {
          "badge": "Infra Fix",
          "title": "faithful recipe 对照的首轮失败被确认是缓存 / 网络问题",
          "summary": "第一次 faithful recipe 对照启动时卡在 Hugging Face 远程握手，而不是训练本身；autoresearch 随后改成优先吃本地缓存并强制 offline。",
          "metrics": [
            {
              "label": "HF 模式",
              "value": "offline"
            },
            {
              "label": "问题归因",
              "value": "启动链"
            },
            {
              "label": "模型判断",
              "value": "未下结论"
            }
          ],
          "outcome": "这条 faithful recipe 对照的首轮失败不再被误记成“方法本身无效”。",
          "links": [
            {
              "title": "研究日志",
              "path": "docs/mdit/research_journal.md"
            },
            {
              "title": "执行手册",
              "path": "docs/mdit/2026-04-16-mdit-execution-manual.md"
            }
          ],
          "task_id": "mdit-mainline",
          "task_title": "MDIT RGB+Text 主线推进",
          "task_path": "homepage/tasks/mdit-mainline/"
        },
        {
          "badge": "Infra",
          "title": "更新接管器 fallback：最佳路线改为从 100 epoch latest 续到 500",
          "summary": "范围：research/mdit_takeover_controller.py + scripts/run_mdit_takeover.py + tmux:mdit_autoresearch:takeover_guard + docs/fixes.md 背景：此前接管器在 MTDP strict…",
          "metrics": [
            {
              "label": "日期",
              "value": "2026-04-17"
            },
            {
              "label": "类型",
              "value": "修复"
            },
            {
              "label": "状态",
              "value": "已记录"
            }
          ],
          "outcome": "这条修复已被收入口径统一的 fixes 账本。",
          "links": [
            {
              "title": "fixes.md",
              "path": "docs/fixes.md"
            }
          ],
          "task_id": "infra-audit",
          "task_title": "训练与审计基础设施修复",
          "task_path": "homepage/tasks/infra-audit/"
        }
      ]
    },
    {
      "date": "2026-04-16",
      "cards": [
        {
          "badge": "Manual",
          "title": "MDIT 执行手册定版，主线推进开始有统一口径",
          "summary": "从训练命令、共享评估链、晋级门槛到接管方式，全部被整理成固定手册，后续不再靠零散命令和口口相传维持。",
          "metrics": [
            {
              "label": "搜索线",
              "value": "2"
            },
            {
              "label": "闸门",
              "value": "100/300/500"
            },
            {
              "label": "审计链",
              "value": "锁定"
            }
          ],
          "outcome": "MDIT 开始从零散 run note 转成真正可持续维护的主线研究线。",
          "links": [
            {
              "title": "执行手册",
              "path": "docs/mdit/2026-04-16-mdit-execution-manual.md"
            },
            {
              "title": "研究日志",
              "path": "docs/mdit/research_journal.md"
            }
          ],
          "task_id": "mdit-mainline",
          "task_title": "MDIT RGB+Text 主线推进",
          "task_path": "homepage/tasks/mdit-mainline/"
        }
      ]
    },
    {
      "date": "2026-04-12",
      "cards": [
        {
          "badge": "Recipe",
          "title": "LeLaN 主线配方先固定为 5 路 RGB、3 帧观测和 8 步动作",
          "summary": "这一轮先固定 5 路 RGB、3 帧观测、horizon=32、8 步动作和平滑动作，再用 100 epoch / 20 episode gate 管住节奏，不急着改 backbone。",
          "metrics": [
            {
              "label": "RGB",
              "value": "5 路"
            },
            {
              "label": "观测帧",
              "value": "3"
            },
            {
              "label": "动作步数",
              "value": "8"
            }
          ],
          "outcome": "LeLaN 第一轮重点从“改模型”转成“先把工程链路立起来”。",
          "links": [
            {
              "title": "执行计划",
              "path": "docs/lelan/2026-04-12-lelan-autoresearch-execution-plan-zh.md"
            },
            {
              "title": "LeLaN research README",
              "path": "docs/lelan/research/README.md"
            }
          ],
          "task_id": "lelan-pipeline",
          "task_title": "LeLaN 自动研究链路固化",
          "task_path": "homepage/tasks/lelan-pipeline/"
        },
        {
          "badge": "Eval Chain",
          "title": "EMA、success eval 与 offline eval ckpt 双路径补齐",
          "summary": "训练中 success gate 和不依赖 RLBench 的离线 eval ckpt 两条路径被明确分开，resume 和 prefer-ema 也都补齐了兼容。",
          "metrics": [
            {
              "label": "EMA",
              "value": "on"
            },
            {
              "label": "success gate",
              "value": "100@20"
            },
            {
              "label": "eval ckpt",
              "value": "100 epoch"
            }
          ],
          "outcome": "LeLaN 后续 run 不会再出现“训练、评估、选模链路断开”的状态。",
          "links": [
            {
              "title": "执行计划",
              "path": "docs/lelan/2026-04-12-lelan-autoresearch-execution-plan-zh.md"
            },
            {
              "title": "LeLaN research README",
              "path": "docs/lelan/research/README.md"
            }
          ],
          "task_id": "lelan-pipeline",
          "task_title": "LeLaN 自动研究链路固化",
          "task_path": "homepage/tasks/lelan-pipeline/"
        },
        {
          "badge": "Trace",
          "title": "autoresearch 留痕规范一次性固定下来",
          "summary": "manifest、summary、dataset_stats、audit_report、trial_request 和 change_summary 都被写进固定产物约定里，后续可以直接追加而不是重新发明格式。",
          "metrics": [
            {
              "label": "核心产物",
              "value": "7+"
            },
            {
              "label": "筛选分支",
              "value": "3"
            },
            {
              "label": "停止门槛",
              "value": "0.45"
            }
          ],
          "outcome": "LeLaN 后续最先长出来的是“可审计的工程链路”，而不是无上下文的零散 run。",
          "links": [
            {
              "title": "执行计划",
              "path": "docs/lelan/2026-04-12-lelan-autoresearch-execution-plan-zh.md"
            },
            {
              "title": "LeLaN research README",
              "path": "docs/lelan/research/README.md"
            }
          ],
          "task_id": "lelan-pipeline",
          "task_title": "LeLaN 自动研究链路固化",
          "task_path": "homepage/tasks/lelan-pipeline/"
        }
      ]
    },
    {
      "date": "2026-04-09",
      "cards": [
        {
          "badge": "PDIT 主线",
          "title": "根目录重整后的最优策略复核通过",
          "summary": "对同一 best_success checkpoint 重新做行为复核，确认仓库结构重整没有把当前最优策略改坏。",
          "metrics": [
            {
              "label": "20 回合",
              "value": "1.00"
            },
            {
              "label": "100 回合",
              "value": "0.85"
            },
            {
              "label": "mean steps@100",
              "value": "83.82"
            }
          ],
          "outcome": "Baseline@500 继续作为当前 PDIT 行为锚点。",
          "links": [
            {
              "title": "20 回合复核",
              "path": "ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/root_layout_recheck_20.json"
            },
            {
              "title": "100 回合复核",
              "path": "ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/root_layout_recheck_100.json"
            },
            {
              "title": "checkpoint manifest",
              "path": "docs/top10-checkpoint-manifest.json"
            }
          ],
          "task_id": "pdit-anchor",
          "task_title": "PDIT 基线恢复与锚点固化",
          "task_path": "homepage/tasks/pdit-anchor/"
        },
        {
          "badge": "Regression",
          "title": "固定 batch 数值回归重新固化为新基准",
          "summary": "根目录重整后旧 reference 不再 bitwise 对齐，于是把固定 batch regression 重新固化成新的 canonical baseline。",
          "metrics": [
            {
              "label": "reference",
              "value": "已重建"
            },
            {
              "label": "脚本",
              "value": "verify_baseline_regression.py"
            },
            {
              "label": "状态",
              "value": "可重复"
            }
          ],
          "outcome": "后续代码重构有了统一的数值回归锚点。",
          "links": [
            {
              "title": "新 regression reference",
              "path": "docs/baseline-regression-reference.json"
            },
            {
              "title": "恢复进展文档",
              "path": "docs/pdit/2026-04-08-fm-recovery-progress-zh.md"
            }
          ],
          "task_id": "pdit-anchor",
          "task_title": "PDIT 基线恢复与锚点固化",
          "task_path": "homepage/tasks/pdit-anchor/"
        }
      ]
    },
    {
      "date": "2026-04-08",
      "cards": [
        {
          "badge": "Repair",
          "title": "训练与离线审计链关键 bug 修完",
          "summary": "本地导入污染、FM 导入耦合、PointNet 导入、checkpoint 原子保存、子进程 audit 隔离和 audit-only stage 覆盖问题都在同一轮里修正。",
          "metrics": [
            {
              "label": "关键修复",
              "value": "6"
            },
            {
              "label": "audit-only",
              "value": "已修"
            },
            {
              "label": "latest.pt",
              "value": "原子保存"
            }
          ],
          "outcome": "之前“模型完全学不会”的结论被重新归因为工程与评估链问题。",
          "links": [
            {
              "title": "恢复进展文档",
              "path": "docs/pdit/2026-04-08-fm-recovery-progress-zh.md"
            },
            {
              "title": "训练模型审计",
              "path": "docs/pdit/2026-04-07-training-model-audit-zh.md"
            }
          ],
          "task_id": "pdit-anchor",
          "task_title": "PDIT 基线恢复与锚点固化",
          "task_path": "homepage/tasks/pdit-anchor/"
        },
        {
          "badge": "Baseline",
          "title": "Baseline@100 恢复到 0.90 success@20",
          "summary": "修复后的 baseline 不再早期崩掉，在 100 epoch 已经能稳定学出可用行为。",
          "metrics": [
            {
              "label": "success@100",
              "value": "0.90"
            },
            {
              "label": "best valid",
              "value": "0.661"
            },
            {
              "label": "best epoch",
              "value": "31"
            }
          ],
          "outcome": "点云主线的可训练性已经重新被确认。",
          "links": [
            {
              "title": "恢复进展文档",
              "path": "docs/pdit/2026-04-08-fm-recovery-progress-zh.md"
            },
            {
              "title": "训练模型审计",
              "path": "docs/pdit/2026-04-07-training-model-audit-zh.md"
            }
          ],
          "task_id": "pdit-anchor",
          "task_title": "PDIT 基线恢复与锚点固化",
          "task_path": "homepage/tasks/pdit-anchor/"
        },
        {
          "badge": "Anchor",
          "title": "Baseline@500 锚定 0.95 success@20",
          "summary": "100/200/300/400/500 五个检查点的 success 曲线重新梳理后，最强点实际落在 500 epoch，而不是中途崩塌。",
          "metrics": [
            {
              "label": "100",
              "value": "0.75"
            },
            {
              "label": "300",
              "value": "0.90"
            },
            {
              "label": "500",
              "value": "0.95"
            }
          ],
          "outcome": "修复后的 baseline 没有出现之前 feared 的 300→500 崩塌。",
          "links": [
            {
              "title": "audit report",
              "path": "ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/audit_report.json"
            },
            {
              "title": "summary",
              "path": "ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/summary.json"
            }
          ],
          "task_id": "pdit-anchor",
          "task_title": "PDIT 基线恢复与锚点固化",
          "task_path": "homepage/tasks/pdit-anchor/"
        },
        {
          "badge": "Ablation",
          "title": "统计特征增强对照作废，官方式动态候选仍待验证",
          "summary": "统计特征归一化 + 原始增强这条对照之所以表现差，并不只是超参问题，而是增强实现把 rot6d 当成了可平移点；更接近官方 DiT 动态的候选在 valid loss 上更好，但还没形成新的行为锚点。",
          "metrics": [
            {
              "label": "增强对照@100",
              "value": "0.55"
            },
            {
              "label": "动态候选 best valid",
              "value": "0.572"
            },
            {
              "label": "状态",
              "value": "待行为验证"
            }
          ],
          "outcome": "旧增强对照不再作为结构结论引用，当前锚点仍是 baseline@500。",
          "links": [
            {
              "title": "恢复进展文档",
              "path": "docs/pdit/2026-04-08-fm-recovery-progress-zh.md"
            },
            {
              "title": "训练模型审计",
              "path": "docs/pdit/2026-04-07-training-model-audit-zh.md"
            }
          ],
          "task_id": "pdit-anchor",
          "task_title": "PDIT 基线恢复与锚点固化",
          "task_path": "homepage/tasks/pdit-anchor/"
        }
      ]
    },
    {
      "date": "2026-04-02",
      "cards": [
        {
          "badge": "Safety",
          "title": "补齐 CAN 限流与示教退出保护，平台状态正式固化",
          "summary": "采样节奏、回放上限、超时保护、RDP 稀疏化和退出示教时的平滑回退全部补齐后，这套六轴臂平台不再只是能演示，而是具备长期复用的数据采集稳定性。",
          "metrics": [
            {
              "label": "阶段",
              "value": "04"
            },
            {
              "label": "最小采样",
              "value": "50 ms"
            },
            {
              "label": "回放上限",
              "value": "20 Hz"
            }
          ],
          "outcome": "平台从“功能打通”走到了“可以稳定拿来做真机轨迹采集”的状态，因此被固定进已完成区。",
          "links": [
            {
              "title": "CAN 通信保护总结",
              "path": "homepage/external/dummy_controller/CAN_PROTECTION_SUMMARY.md"
            },
            {
              "title": "示教边界与退出处理",
              "path": "homepage/external/dummy_controller/TEACH_BOUNDARY_COMPLETE.md"
            }
          ],
          "task_id": "dummy-sim2real-platform",
          "task_title": "六轴臂 Sim2Real 采集平台搭建",
          "task_path": "homepage/tasks/dummy-sim2real-platform/"
        }
      ]
    },
    {
      "date": "2026-03-28",
      "cards": [
        {
          "badge": "Kinematics",
          "title": "用 MuJoCo 正解与数值逆解建立末端闭环控制",
          "summary": "FK 直接复用 MuJoCo 的完整几何与 site 定义，IK 则用 L-BFGS-B 在关节限位内做多初始猜测优化，把“目标位姿 → 逆解 → 影子预览 → 真机下发”串成闭环。",
          "metrics": [
            {
              "label": "阶段",
              "value": "03"
            },
            {
              "label": "IK 精度",
              "value": "< 8 mm"
            },
            {
              "label": "初始猜测",
              "value": "6 组"
            }
          ],
          "outcome": "这套平台已经具备服务模仿学习和世界模型的数据接口，不再只是一个可视化控制 Demo。",
          "links": [
            {
              "title": "项目总览",
              "path": "homepage/external/dummy_controller/INTERVIEW_TECH_DOC.md"
            },
            {
              "title": "正逆运动学技术文档",
              "path": "homepage/external/dummy_controller/docs/技术文档_正逆运动学与示教系统.md"
            }
          ],
          "task_id": "dummy-sim2real-platform",
          "task_title": "六轴臂 Sim2Real 采集平台搭建",
          "task_path": "homepage/tasks/dummy-sim2real-platform/"
        }
      ]
    },
    {
      "date": "2026-03-22",
      "cards": [
        {
          "badge": "Planning",
          "title": "把仿真规划与示教录制做成连续轨迹链路",
          "summary": "通过主体 / 影子 / IK 三套模型隔离运行状态，让规划预览和真机监控能够同屏；同时把示教记录改成带时间戳的 10 Hz 连续轨迹，并接入 RDP 稀疏化与按节奏回放。",
          "metrics": [
            {
              "label": "阶段",
              "value": "02"
            },
            {
              "label": "模型数",
              "value": "3"
            },
            {
              "label": "示教录制",
              "value": "10 Hz"
            }
          ],
          "outcome": "规划、示教和回放开始共享同一种轨迹格式，这一步已经非常接近模仿学习数据采集。",
          "links": [
            {
              "title": "项目总览",
              "path": "homepage/external/dummy_controller/INTERVIEW_TECH_DOC.md"
            }
          ],
          "task_id": "dummy-sim2real-platform",
          "task_title": "六轴臂 Sim2Real 采集平台搭建",
          "task_path": "homepage/tasks/dummy-sim2real-platform/"
        }
      ]
    },
    {
      "date": "2026-03-15",
      "cards": [
        {
          "badge": "Sim2Real",
          "title": "打通六轴映射与真机-仿真数字孪生同步",
          "summary": "围绕单位制、轴向符号和零位偏置统一出一套 firmware_to_urdf() 映射，再用 EMA 平滑把真机轮询稳定映射成 MuJoCo 侧的连续显示，解决了数字孪生最先卡住的坐标系问题。",
          "metrics": [
            {
              "label": "阶段",
              "value": "01"
            },
            {
              "label": "六轴映射",
              "value": "已打通"
            },
            {
              "label": "同步节奏",
              "value": "2 → 20 Hz"
            }
          ],
          "outcome": "真机姿态现在可以稳定映射到 MuJoCo 侧，Sim2Real 这条基础链路已经成立。",
          "links": [
            {
              "title": "项目总览",
              "path": "homepage/external/dummy_controller/INTERVIEW_TECH_DOC.md"
            }
          ],
          "task_id": "dummy-sim2real-platform",
          "task_title": "六轴臂 Sim2Real 采集平台搭建",
          "task_path": "homepage/tasks/dummy-sim2real-platform/"
        }
      ]
    }
  ],
  "charts": {
    "pdit-success-curve": {
      "id": "pdit-success-curve",
      "type": "line",
      "title": "PDIT success by epoch",
      "description": "按同一离线审计口径汇总 100/200/300/400/500 五个检查点的 success@20。",
      "format": "percent",
      "note": "success 曲线严格按 epoch 升序整理。",
      "series": [
        {
          "name": "success@20",
          "color": "#2b766f",
          "points": [
            {
              "x": 100,
              "y": 0.75,
              "label": "epoch 100"
            },
            {
              "x": 200,
              "y": 0.8,
              "label": "epoch 200"
            },
            {
              "x": 300,
              "y": 0.9,
              "label": "epoch 300"
            },
            {
              "x": 400,
              "y": 0.8,
              "label": "epoch 400"
            },
            {
              "x": 500,
              "y": 0.95,
              "label": "epoch 500"
            }
          ]
        }
      ]
    },
    "pdit-loss-tail": {
      "id": "pdit-loss-tail",
      "type": "line",
      "title": "PDIT train / valid total loss（尾段快照）",
      "description": "当前仓库本地保留的是 495-499 epoch 的 summary 尾段，所以这里展示的是末段训练过程，而不是整条 500 epoch 全历史。",
      "format": "float",
      "note": "如后续补齐更完整的 history，生成脚本会优先替换这张图。",
      "series": [
        {
          "name": "train/loss_total",
          "color": "#b2573f",
          "points": [
            {
              "x": 495,
              "y": 0.014166783119391459,
              "label": "epoch 495"
            },
            {
              "x": 496,
              "y": 0.013624852395185981,
              "label": "epoch 496"
            },
            {
              "x": 497,
              "y": 0.015204953813357026,
              "label": "epoch 497"
            },
            {
              "x": 498,
              "y": 0.015675228350764854,
              "label": "epoch 498"
            },
            {
              "x": 499,
              "y": 0.014862022939450431,
              "label": "epoch 499"
            }
          ]
        },
        {
          "name": "valid/loss_total",
          "color": "#3e7cb1",
          "points": [
            {
              "x": 495,
              "y": 1.4317840543624603,
              "label": "epoch 495"
            },
            {
              "x": 496,
              "y": 1.4330971696732664,
              "label": "epoch 496"
            },
            {
              "x": 497,
              "y": 1.3742421385464503,
              "label": "epoch 497"
            },
            {
              "x": 498,
              "y": 1.3065816750933759,
              "label": "epoch 498"
            },
            {
              "x": 499,
              "y": 1.421892151187517,
              "label": "epoch 499"
            }
          ]
        }
      ]
    },
    "pdit-mse-tail": {
      "id": "pdit-mse-tail",
      "type": "line",
      "title": "PDIT valid MSE（尾段快照）",
      "description": "展示 summary 里保留下来的 valid mse_xyz / mse_rot6d / mse_grip 尾段变化，用来补足 success 曲线背后的误差信号。",
      "format": "float",
      "note": "PDIT 当前没有 W&B history 可抓，因此这里只能展示本地快照。",
      "series": [
        {
          "name": "mse_xyz",
          "color": "#2b766f",
          "points": [
            {
              "x": 495,
              "y": 0.004171040956479325,
              "label": "epoch 495"
            },
            {
              "x": 496,
              "y": 0.0041353397617441305,
              "label": "epoch 496"
            },
            {
              "x": 497,
              "y": 0.004182077718149613,
              "label": "epoch 497"
            },
            {
              "x": 498,
              "y": 0.004180583501836641,
              "label": "epoch 498"
            },
            {
              "x": 499,
              "y": 0.004185949971112055,
              "label": "epoch 499"
            }
          ]
        },
        {
          "name": "mse_rot6d",
          "color": "#a27a32",
          "points": [
            {
              "x": 495,
              "y": 0.06826130063027928,
              "label": "epoch 495"
            },
            {
              "x": 496,
              "y": 0.06807597444391209,
              "label": "epoch 496"
            },
            {
              "x": 497,
              "y": 0.06836638722444677,
              "label": "epoch 497"
            },
            {
              "x": 498,
              "y": 0.0682842567592065,
              "label": "epoch 498"
            },
            {
              "x": 499,
              "y": 0.06828843722144627,
              "label": "epoch 499"
            }
          ]
        },
        {
          "name": "mse_grip",
          "color": "#d4684c",
          "points": [
            {
              "x": 495,
              "y": 0.06348084537614533,
              "label": "epoch 495"
            },
            {
              "x": 496,
              "y": 0.06315782979952442,
              "label": "epoch 496"
            },
            {
              "x": 497,
              "y": 0.06345517631166658,
              "label": "epoch 497"
            },
            {
              "x": 498,
              "y": 0.0635907913636476,
              "label": "epoch 498"
            },
            {
              "x": 499,
              "y": 0.06363932739659539,
              "label": "epoch 499"
            }
          ]
        }
      ]
    },
    "mdit-success-curve": {
      "id": "mdit-success-curve",
      "type": "line",
      "title": "MDIT success by epoch",
      "description": "当前锁定的 RGB+Text 主线只在 50 / 100 epoch 做了共享 audit，因此 success 曲线严格按这两个里程碑展示。",
      "format": "percent",
      "note": "排序严格按 epoch 升序，避免 100 在 50 前面或 500 插到前面。",
      "series": [
        {
          "name": "success@20",
          "color": "#2b766f",
          "points": [
            {
              "x": 50,
              "y": 0.25,
              "label": "epoch 50"
            },
            {
              "x": 100,
              "y": 0.55,
              "label": "epoch 100"
            }
          ]
        }
      ]
    },
    "mdit-loss-curve": {
      "id": "mdit-loss-curve",
      "type": "line",
      "title": "MDIT train / valid total loss",
      "description": "把主线训练过程里的 total train loss 和 total valid loss 放在一张图里，便于直接看收敛与回弹。",
      "format": "float",
      "note": "使用 W&B API 抓取完整 history，展示主线真实训练曲线。",
      "series": [
        {
          "name": "train/loss_total",
          "color": "#b2573f",
          "points": [
            {
              "x": 1,
              "y": 1.8811248540878296,
              "label": "epoch 1"
            },
            {
              "x": 2,
              "y": 1.7818045616149902,
              "label": "epoch 2"
            },
            {
              "x": 3,
              "y": 1.3012994527816772,
              "label": "epoch 3"
            },
            {
              "x": 4,
              "y": 1.461883544921875,
              "label": "epoch 4"
            },
            {
              "x": 5,
              "y": 1.0261638164520264,
              "label": "epoch 5"
            },
            {
              "x": 6,
              "y": 1.0148241519927979,
              "label": "epoch 6"
            },
            {
              "x": 7,
              "y": 0.8061392903327942,
              "label": "epoch 7"
            },
            {
              "x": 8,
              "y": 0.6894184350967407,
              "label": "epoch 8"
            },
            {
              "x": 9,
              "y": 0.5290270447731018,
              "label": "epoch 9"
            },
            {
              "x": 10,
              "y": 0.4071277379989624,
              "label": "epoch 10"
            },
            {
              "x": 11,
              "y": 0.36925530433654785,
              "label": "epoch 11"
            },
            {
              "x": 12,
              "y": 0.48277533054351807,
              "label": "epoch 12"
            },
            {
              "x": 13,
              "y": 0.23586192727088928,
              "label": "epoch 13"
            },
            {
              "x": 14,
              "y": 0.19855204224586487,
              "label": "epoch 14"
            },
            {
              "x": 15,
              "y": 0.274877667427063,
              "label": "epoch 15"
            },
            {
              "x": 16,
              "y": 0.3834046423435211,
              "label": "epoch 16"
            },
            {
              "x": 17,
              "y": 0.3581879734992981,
              "label": "epoch 17"
            },
            {
              "x": 18,
              "y": 0.2255898416042328,
              "label": "epoch 18"
            },
            {
              "x": 19,
              "y": 0.47910135984420776,
              "label": "epoch 19"
            },
            {
              "x": 20,
              "y": 0.16075004637241364,
              "label": "epoch 20"
            },
            {
              "x": 21,
              "y": 0.1853909194469452,
              "label": "epoch 21"
            },
            {
              "x": 22,
              "y": 0.2293793261051178,
              "label": "epoch 22"
            },
            {
              "x": 23,
              "y": 0.30036860704421997,
              "label": "epoch 23"
            },
            {
              "x": 24,
              "y": 0.14241757988929749,
              "label": "epoch 24"
            },
            {
              "x": 25,
              "y": 0.1671147644519806,
              "label": "epoch 25"
            },
            {
              "x": 26,
              "y": 0.1550132930278778,
              "label": "epoch 26"
            },
            {
              "x": 27,
              "y": 0.1252758502960205,
              "label": "epoch 27"
            },
            {
              "x": 28,
              "y": 0.16165050864219666,
              "label": "epoch 28"
            },
            {
              "x": 29,
              "y": 0.21264396607875824,
              "label": "epoch 29"
            },
            {
              "x": 30,
              "y": 0.10617825388908386,
              "label": "epoch 30"
            },
            {
              "x": 31,
              "y": 0.1543416678905487,
              "label": "epoch 31"
            },
            {
              "x": 32,
              "y": 0.2050333023071289,
              "label": "epoch 32"
            },
            {
              "x": 33,
              "y": 0.07365470379590988,
              "label": "epoch 33"
            },
            {
              "x": 34,
              "y": 0.14964795112609863,
              "label": "epoch 34"
            },
            {
              "x": 35,
              "y": 0.07570470124483109,
              "label": "epoch 35"
            },
            {
              "x": 36,
              "y": 0.15567833185195923,
              "label": "epoch 36"
            },
            {
              "x": 37,
              "y": 0.05464204400777817,
              "label": "epoch 37"
            },
            {
              "x": 38,
              "y": 0.10096725821495056,
              "label": "epoch 38"
            },
            {
              "x": 39,
              "y": 0.21085262298583984,
              "label": "epoch 39"
            },
            {
              "x": 40,
              "y": 0.10506041347980499,
              "label": "epoch 40"
            },
            {
              "x": 41,
              "y": 0.15216681361198425,
              "label": "epoch 41"
            },
            {
              "x": 42,
              "y": 0.0642961785197258,
              "label": "epoch 42"
            },
            {
              "x": 43,
              "y": 0.06653305143117905,
              "label": "epoch 43"
            },
            {
              "x": 44,
              "y": 0.09792937338352203,
              "label": "epoch 44"
            },
            {
              "x": 45,
              "y": 0.06129996478557587,
              "label": "epoch 45"
            },
            {
              "x": 46,
              "y": 0.07386570423841476,
              "label": "epoch 46"
            },
            {
              "x": 47,
              "y": 0.0936657041311264,
              "label": "epoch 47"
            },
            {
              "x": 48,
              "y": 0.061165135353803635,
              "label": "epoch 48"
            },
            {
              "x": 49,
              "y": 0.06800831854343414,
              "label": "epoch 49"
            },
            {
              "x": 50,
              "y": 0.1102430522441864,
              "label": "epoch 50"
            },
            {
              "x": 51,
              "y": 0.09182419627904892,
              "label": "epoch 51"
            },
            {
              "x": 52,
              "y": 0.04193383827805519,
              "label": "epoch 52"
            },
            {
              "x": 53,
              "y": 0.06660528481006622,
              "label": "epoch 53"
            },
            {
              "x": 54,
              "y": 0.055518053472042084,
              "label": "epoch 54"
            },
            {
              "x": 55,
              "y": 0.059194259345531464,
              "label": "epoch 55"
            },
            {
              "x": 56,
              "y": 0.07744849473237991,
              "label": "epoch 56"
            },
            {
              "x": 57,
              "y": 0.06294219940900803,
              "label": "epoch 57"
            },
            {
              "x": 58,
              "y": 0.0446041002869606,
              "label": "epoch 58"
            },
            {
              "x": 59,
              "y": 0.038156479597091675,
              "label": "epoch 59"
            },
            {
              "x": 60,
              "y": 0.03721850365400314,
              "label": "epoch 60"
            },
            {
              "x": 61,
              "y": 0.04182671010494232,
              "label": "epoch 61"
            },
            {
              "x": 62,
              "y": 0.05335725471377373,
              "label": "epoch 62"
            },
            {
              "x": 63,
              "y": 0.11905165016651154,
              "label": "epoch 63"
            },
            {
              "x": 64,
              "y": 0.03664613515138626,
              "label": "epoch 64"
            },
            {
              "x": 65,
              "y": 0.06512370705604553,
              "label": "epoch 65"
            },
            {
              "x": 66,
              "y": 0.12008842080831528,
              "label": "epoch 66"
            },
            {
              "x": 67,
              "y": 0.026446927338838577,
              "label": "epoch 67"
            },
            {
              "x": 68,
              "y": 0.06612807512283325,
              "label": "epoch 68"
            },
            {
              "x": 69,
              "y": 0.05180014669895172,
              "label": "epoch 69"
            },
            {
              "x": 70,
              "y": 0.09482777118682861,
              "label": "epoch 70"
            },
            {
              "x": 71,
              "y": 0.06850497424602509,
              "label": "epoch 71"
            },
            {
              "x": 72,
              "y": 0.028636356815695763,
              "label": "epoch 72"
            },
            {
              "x": 73,
              "y": 0.025708205997943878,
              "label": "epoch 73"
            },
            {
              "x": 74,
              "y": 0.026227466762065887,
              "label": "epoch 74"
            },
            {
              "x": 75,
              "y": 0.047418419271707535,
              "label": "epoch 75"
            },
            {
              "x": 76,
              "y": 0.05176446586847305,
              "label": "epoch 76"
            },
            {
              "x": 77,
              "y": 0.02194770984351635,
              "label": "epoch 77"
            },
            {
              "x": 78,
              "y": 0.05957959592342377,
              "label": "epoch 78"
            },
            {
              "x": 79,
              "y": 0.02223757654428482,
              "label": "epoch 79"
            },
            {
              "x": 80,
              "y": 0.023155588656663895,
              "label": "epoch 80"
            },
            {
              "x": 81,
              "y": 0.02649473026394844,
              "label": "epoch 81"
            },
            {
              "x": 82,
              "y": 0.2591487169265747,
              "label": "epoch 82"
            },
            {
              "x": 83,
              "y": 0.023127568885684013,
              "label": "epoch 83"
            },
            {
              "x": 84,
              "y": 0.06958147138357162,
              "label": "epoch 84"
            },
            {
              "x": 85,
              "y": 0.02047659084200859,
              "label": "epoch 85"
            },
            {
              "x": 86,
              "y": 0.06091634929180145,
              "label": "epoch 86"
            },
            {
              "x": 87,
              "y": 0.0689958706498146,
              "label": "epoch 87"
            },
            {
              "x": 88,
              "y": 0.02096344716846943,
              "label": "epoch 88"
            },
            {
              "x": 89,
              "y": 0.04845971614122391,
              "label": "epoch 89"
            },
            {
              "x": 90,
              "y": 0.0528201088309288,
              "label": "epoch 90"
            },
            {
              "x": 91,
              "y": 0.13256607949733734,
              "label": "epoch 91"
            },
            {
              "x": 92,
              "y": 0.02916068024933338,
              "label": "epoch 92"
            },
            {
              "x": 93,
              "y": 0.018684502691030502,
              "label": "epoch 93"
            },
            {
              "x": 94,
              "y": 0.03948673605918884,
              "label": "epoch 94"
            },
            {
              "x": 95,
              "y": 0.07077044248580933,
              "label": "epoch 95"
            },
            {
              "x": 96,
              "y": 0.16078057885169983,
              "label": "epoch 96"
            },
            {
              "x": 97,
              "y": 0.031992316246032715,
              "label": "epoch 97"
            },
            {
              "x": 98,
              "y": 0.01889285445213318,
              "label": "epoch 98"
            },
            {
              "x": 99,
              "y": 0.0304750707000494,
              "label": "epoch 99"
            },
            {
              "x": 101,
              "y": 0.06069759279489517,
              "label": "epoch 101"
            },
            {
              "x": 102,
              "y": 0.13445650041103363,
              "label": "epoch 102"
            },
            {
              "x": 103,
              "y": 0.12797671556472778,
              "label": "epoch 103"
            },
            {
              "x": 104,
              "y": 0.24410302937030792,
              "label": "epoch 104"
            },
            {
              "x": 105,
              "y": 0.10239733755588531,
              "label": "epoch 105"
            },
            {
              "x": 106,
              "y": 0.08776262402534485,
              "label": "epoch 106"
            },
            {
              "x": 107,
              "y": 0.07656773924827576,
              "label": "epoch 107"
            },
            {
              "x": 108,
              "y": 0.053627122193574905,
              "label": "epoch 108"
            },
            {
              "x": 109,
              "y": 0.10249097645282745,
              "label": "epoch 109"
            },
            {
              "x": 110,
              "y": 0.08840983361005783,
              "label": "epoch 110"
            },
            {
              "x": 111,
              "y": 0.03902886062860489,
              "label": "epoch 111"
            },
            {
              "x": 112,
              "y": 0.043251171708106995,
              "label": "epoch 112"
            },
            {
              "x": 113,
              "y": 0.10301090776920319,
              "label": "epoch 113"
            },
            {
              "x": 114,
              "y": 0.1346605271100998,
              "label": "epoch 114"
            },
            {
              "x": 115,
              "y": 0.0855933129787445,
              "label": "epoch 115"
            },
            {
              "x": 116,
              "y": 0.053728923201560974,
              "label": "epoch 116"
            },
            {
              "x": 117,
              "y": 0.23451194167137146,
              "label": "epoch 117"
            },
            {
              "x": 118,
              "y": 0.05261996388435364,
              "label": "epoch 118"
            },
            {
              "x": 119,
              "y": 0.07329298555850983,
              "label": "epoch 119"
            },
            {
              "x": 120,
              "y": 0.057021670043468475,
              "label": "epoch 120"
            },
            {
              "x": 121,
              "y": 0.14271867275238037,
              "label": "epoch 121"
            },
            {
              "x": 122,
              "y": 0.030940622091293335,
              "label": "epoch 122"
            },
            {
              "x": 123,
              "y": 0.07463501393795013,
              "label": "epoch 123"
            },
            {
              "x": 124,
              "y": 0.04984061047434807,
              "label": "epoch 124"
            },
            {
              "x": 125,
              "y": 0.03630019351840019,
              "label": "epoch 125"
            },
            {
              "x": 126,
              "y": 0.07700850814580917,
              "label": "epoch 126"
            },
            {
              "x": 127,
              "y": 0.09859733283519745,
              "label": "epoch 127"
            },
            {
              "x": 128,
              "y": 0.058828409761190414,
              "label": "epoch 128"
            },
            {
              "x": 129,
              "y": 0.036439474672079086,
              "label": "epoch 129"
            },
            {
              "x": 130,
              "y": 0.09324481338262558,
              "label": "epoch 130"
            },
            {
              "x": 131,
              "y": 0.029195480048656464,
              "label": "epoch 131"
            },
            {
              "x": 132,
              "y": 0.067042775452137,
              "label": "epoch 132"
            },
            {
              "x": 133,
              "y": 0.05399119108915329,
              "label": "epoch 133"
            },
            {
              "x": 134,
              "y": 0.02992074191570282,
              "label": "epoch 134"
            },
            {
              "x": 135,
              "y": 0.023466218262910843,
              "label": "epoch 135"
            },
            {
              "x": 136,
              "y": 0.04761100187897682,
              "label": "epoch 136"
            },
            {
              "x": 137,
              "y": 0.12586060166358948,
              "label": "epoch 137"
            },
            {
              "x": 138,
              "y": 0.03715233504772186,
              "label": "epoch 138"
            },
            {
              "x": 139,
              "y": 0.06492768228054047,
              "label": "epoch 139"
            },
            {
              "x": 140,
              "y": 0.025007693096995354,
              "label": "epoch 140"
            },
            {
              "x": 141,
              "y": 0.025872094556689262,
              "label": "epoch 141"
            },
            {
              "x": 142,
              "y": 0.05832534283399582,
              "label": "epoch 142"
            },
            {
              "x": 143,
              "y": 0.05136951804161072,
              "label": "epoch 143"
            },
            {
              "x": 144,
              "y": 0.03690185397863388,
              "label": "epoch 144"
            },
            {
              "x": 145,
              "y": 0.05204625427722931,
              "label": "epoch 145"
            },
            {
              "x": 146,
              "y": 0.04035729914903641,
              "label": "epoch 146"
            },
            {
              "x": 147,
              "y": 0.03569498285651207,
              "label": "epoch 147"
            },
            {
              "x": 148,
              "y": 0.130785271525383,
              "label": "epoch 148"
            },
            {
              "x": 149,
              "y": 0.07883833348751068,
              "label": "epoch 149"
            },
            {
              "x": 150,
              "y": 0.027695432305336,
              "label": "epoch 150"
            },
            {
              "x": 151,
              "y": 0.044797640293836594,
              "label": "epoch 151"
            },
            {
              "x": 152,
              "y": 0.041879791766405106,
              "label": "epoch 152"
            },
            {
              "x": 153,
              "y": 0.02780633419752121,
              "label": "epoch 153"
            },
            {
              "x": 154,
              "y": 0.05666523426771164,
              "label": "epoch 154"
            },
            {
              "x": 155,
              "y": 0.04789434373378754,
              "label": "epoch 155"
            },
            {
              "x": 156,
              "y": 0.030341794714331627,
              "label": "epoch 156"
            },
            {
              "x": 157,
              "y": 0.02960948646068573,
              "label": "epoch 157"
            },
            {
              "x": 158,
              "y": 0.08954484760761261,
              "label": "epoch 158"
            },
            {
              "x": 159,
              "y": 0.029064826667308807,
              "label": "epoch 159"
            },
            {
              "x": 160,
              "y": 0.03707931935787201,
              "label": "epoch 160"
            },
            {
              "x": 161,
              "y": 0.08523140847682953,
              "label": "epoch 161"
            },
            {
              "x": 162,
              "y": 0.025176750496029854,
              "label": "epoch 162"
            },
            {
              "x": 163,
              "y": 0.13749077916145325,
              "label": "epoch 163"
            },
            {
              "x": 164,
              "y": 0.028942596167325974,
              "label": "epoch 164"
            },
            {
              "x": 165,
              "y": 0.019336815923452377,
              "label": "epoch 165"
            },
            {
              "x": 166,
              "y": 0.04871855303645134,
              "label": "epoch 166"
            },
            {
              "x": 167,
              "y": 0.034655917435884476,
              "label": "epoch 167"
            },
            {
              "x": 168,
              "y": 0.14708179235458374,
              "label": "epoch 168"
            },
            {
              "x": 169,
              "y": 0.01870785839855671,
              "label": "epoch 169"
            },
            {
              "x": 170,
              "y": 0.02376430109143257,
              "label": "epoch 170"
            },
            {
              "x": 171,
              "y": 0.01779644936323166,
              "label": "epoch 171"
            },
            {
              "x": 172,
              "y": 0.015785038471221924,
              "label": "epoch 172"
            },
            {
              "x": 173,
              "y": 0.03721433877944946,
              "label": "epoch 173"
            },
            {
              "x": 174,
              "y": 0.08518503606319427,
              "label": "epoch 174"
            },
            {
              "x": 175,
              "y": 0.019128762185573578,
              "label": "epoch 175"
            },
            {
              "x": 176,
              "y": 0.04851396754384041,
              "label": "epoch 176"
            },
            {
              "x": 177,
              "y": 0.02017439901828766,
              "label": "epoch 177"
            },
            {
              "x": 178,
              "y": 0.024287404492497444,
              "label": "epoch 178"
            },
            {
              "x": 179,
              "y": 0.09003244340419769,
              "label": "epoch 179"
            },
            {
              "x": 180,
              "y": 0.23665720224380493,
              "label": "epoch 180"
            },
            {
              "x": 181,
              "y": 0.02323748543858528,
              "label": "epoch 181"
            },
            {
              "x": 182,
              "y": 0.0731753408908844,
              "label": "epoch 182"
            },
            {
              "x": 183,
              "y": 0.035840027034282684,
              "label": "epoch 183"
            },
            {
              "x": 184,
              "y": 0.01754840463399887,
              "label": "epoch 184"
            },
            {
              "x": 185,
              "y": 0.06360553950071335,
              "label": "epoch 185"
            },
            {
              "x": 186,
              "y": 0.018933987244963646,
              "label": "epoch 186"
            },
            {
              "x": 187,
              "y": 0.06877675652503967,
              "label": "epoch 187"
            },
            {
              "x": 188,
              "y": 0.034702252596616745,
              "label": "epoch 188"
            },
            {
              "x": 189,
              "y": 0.05973675101995468,
              "label": "epoch 189"
            },
            {
              "x": 190,
              "y": 0.024736013263463974,
              "label": "epoch 190"
            },
            {
              "x": 191,
              "y": 0.016417061910033226,
              "label": "epoch 191"
            },
            {
              "x": 192,
              "y": 0.03224007040262222,
              "label": "epoch 192"
            },
            {
              "x": 193,
              "y": 0.023573024198412895,
              "label": "epoch 193"
            },
            {
              "x": 194,
              "y": 0.03417586535215378,
              "label": "epoch 194"
            },
            {
              "x": 195,
              "y": 0.041576825082302094,
              "label": "epoch 195"
            },
            {
              "x": 196,
              "y": 0.0160664115101099,
              "label": "epoch 196"
            },
            {
              "x": 197,
              "y": 0.04904966056346893,
              "label": "epoch 197"
            },
            {
              "x": 198,
              "y": 0.021570954471826553,
              "label": "epoch 198"
            },
            {
              "x": 199,
              "y": 0.13128674030303955,
              "label": "epoch 199"
            },
            {
              "x": 200,
              "y": 0.030019883066415787,
              "label": "epoch 200"
            },
            {
              "x": 201,
              "y": 0.05832362920045853,
              "label": "epoch 201"
            },
            {
              "x": 202,
              "y": 0.019533587619662285,
              "label": "epoch 202"
            },
            {
              "x": 203,
              "y": 0.040856968611478806,
              "label": "epoch 203"
            },
            {
              "x": 204,
              "y": 0.03487487882375717,
              "label": "epoch 204"
            },
            {
              "x": 205,
              "y": 0.06259439140558243,
              "label": "epoch 205"
            },
            {
              "x": 206,
              "y": 0.14776010811328888,
              "label": "epoch 206"
            },
            {
              "x": 207,
              "y": 0.0226193368434906,
              "label": "epoch 207"
            },
            {
              "x": 208,
              "y": 0.030789915472269058,
              "label": "epoch 208"
            },
            {
              "x": 209,
              "y": 0.04870134964585304,
              "label": "epoch 209"
            },
            {
              "x": 210,
              "y": 0.03137839213013649,
              "label": "epoch 210"
            },
            {
              "x": 211,
              "y": 0.014213655143976212,
              "label": "epoch 211"
            },
            {
              "x": 212,
              "y": 0.009829108603298664,
              "label": "epoch 212"
            },
            {
              "x": 213,
              "y": 0.030862677842378616,
              "label": "epoch 213"
            },
            {
              "x": 214,
              "y": 0.07576797157526016,
              "label": "epoch 214"
            },
            {
              "x": 215,
              "y": 0.06811198592185974,
              "label": "epoch 215"
            },
            {
              "x": 216,
              "y": 0.015230118297040462,
              "label": "epoch 216"
            },
            {
              "x": 217,
              "y": 0.021434416994452477,
              "label": "epoch 217"
            },
            {
              "x": 218,
              "y": 0.027499547228217125,
              "label": "epoch 218"
            },
            {
              "x": 219,
              "y": 0.017479315400123596,
              "label": "epoch 219"
            },
            {
              "x": 220,
              "y": 0.0572422556579113,
              "label": "epoch 220"
            },
            {
              "x": 221,
              "y": 0.04246623069047928,
              "label": "epoch 221"
            },
            {
              "x": 222,
              "y": 0.01866220496594906,
              "label": "epoch 222"
            },
            {
              "x": 223,
              "y": 0.016717297956347466,
              "label": "epoch 223"
            },
            {
              "x": 224,
              "y": 0.01582573913037777,
              "label": "epoch 224"
            },
            {
              "x": 225,
              "y": 0.026189278811216354,
              "label": "epoch 225"
            },
            {
              "x": 226,
              "y": 0.021605446934700012,
              "label": "epoch 226"
            },
            {
              "x": 227,
              "y": 0.02019849419593811,
              "label": "epoch 227"
            },
            {
              "x": 228,
              "y": 0.05320824310183525,
              "label": "epoch 228"
            },
            {
              "x": 229,
              "y": 0.03678801283240318,
              "label": "epoch 229"
            },
            {
              "x": 230,
              "y": 0.11138790845870972,
              "label": "epoch 230"
            },
            {
              "x": 231,
              "y": 0.07916389405727386,
              "label": "epoch 231"
            },
            {
              "x": 232,
              "y": 0.019566640257835388,
              "label": "epoch 232"
            },
            {
              "x": 233,
              "y": 0.02522740140557289,
              "label": "epoch 233"
            },
            {
              "x": 234,
              "y": 0.0417725145816803,
              "label": "epoch 234"
            },
            {
              "x": 235,
              "y": 0.057514794170856476,
              "label": "epoch 235"
            },
            {
              "x": 236,
              "y": 0.012372856959700584,
              "label": "epoch 236"
            },
            {
              "x": 237,
              "y": 0.032480377703905106,
              "label": "epoch 237"
            },
            {
              "x": 238,
              "y": 0.028928879648447037,
              "label": "epoch 238"
            },
            {
              "x": 239,
              "y": 0.024619879201054573,
              "label": "epoch 239"
            },
            {
              "x": 240,
              "y": 0.06015794724225998,
              "label": "epoch 240"
            },
            {
              "x": 241,
              "y": 0.027514411136507988,
              "label": "epoch 241"
            },
            {
              "x": 242,
              "y": 0.023735392838716507,
              "label": "epoch 242"
            },
            {
              "x": 243,
              "y": 0.040427498519420624,
              "label": "epoch 243"
            },
            {
              "x": 244,
              "y": 0.040828000754117966,
              "label": "epoch 244"
            },
            {
              "x": 245,
              "y": 0.02043900080025196,
              "label": "epoch 245"
            },
            {
              "x": 246,
              "y": 0.01956559345126152,
              "label": "epoch 246"
            },
            {
              "x": 247,
              "y": 0.014971090480685234,
              "label": "epoch 247"
            },
            {
              "x": 248,
              "y": 0.01203360129147768,
              "label": "epoch 248"
            },
            {
              "x": 249,
              "y": 0.0537232868373394,
              "label": "epoch 249"
            },
            {
              "x": 250,
              "y": 0.05592414736747742,
              "label": "epoch 250"
            },
            {
              "x": 251,
              "y": 0.020801423117518425,
              "label": "epoch 251"
            },
            {
              "x": 252,
              "y": 0.012048877775669098,
              "label": "epoch 252"
            },
            {
              "x": 253,
              "y": 0.026979833841323853,
              "label": "epoch 253"
            },
            {
              "x": 254,
              "y": 0.018970130011439323,
              "label": "epoch 254"
            },
            {
              "x": 255,
              "y": 0.012775829993188381,
              "label": "epoch 255"
            },
            {
              "x": 256,
              "y": 0.03355240821838379,
              "label": "epoch 256"
            },
            {
              "x": 257,
              "y": 0.05489391088485718,
              "label": "epoch 257"
            },
            {
              "x": 258,
              "y": 0.024954549968242645,
              "label": "epoch 258"
            },
            {
              "x": 259,
              "y": 0.01595294289290905,
              "label": "epoch 259"
            },
            {
              "x": 260,
              "y": 0.010764596983790398,
              "label": "epoch 260"
            },
            {
              "x": 261,
              "y": 0.012433546595275402,
              "label": "epoch 261"
            },
            {
              "x": 262,
              "y": 0.13464075326919556,
              "label": "epoch 262"
            },
            {
              "x": 263,
              "y": 0.014933613128960133,
              "label": "epoch 263"
            },
            {
              "x": 264,
              "y": 0.04025335609912872,
              "label": "epoch 264"
            },
            {
              "x": 265,
              "y": 0.05015246570110321,
              "label": "epoch 265"
            },
            {
              "x": 266,
              "y": 0.026323895901441574,
              "label": "epoch 266"
            },
            {
              "x": 267,
              "y": 0.00908595323562622,
              "label": "epoch 267"
            }
          ]
        },
        {
          "name": "valid/loss_total",
          "color": "#3e7cb1",
          "points": [
            {
              "x": 1,
              "y": 9.658566462366204,
              "label": "epoch 1"
            },
            {
              "x": 2,
              "y": 8.781862861231753,
              "label": "epoch 2"
            },
            {
              "x": 3,
              "y": 7.865878845516004,
              "label": "epoch 3"
            },
            {
              "x": 4,
              "y": 7.08491880015323,
              "label": "epoch 4"
            },
            {
              "x": 5,
              "y": 6.2267184633957715,
              "label": "epoch 5"
            },
            {
              "x": 6,
              "y": 5.516823655680606,
              "label": "epoch 6"
            },
            {
              "x": 7,
              "y": 4.779243550802532,
              "label": "epoch 7"
            },
            {
              "x": 8,
              "y": 4.10831778300436,
              "label": "epoch 8"
            },
            {
              "x": 9,
              "y": 3.4911094464753805,
              "label": "epoch 9"
            },
            {
              "x": 10,
              "y": 2.974078950129057,
              "label": "epoch 10"
            },
            {
              "x": 11,
              "y": 2.5676021638669466,
              "label": "epoch 11"
            },
            {
              "x": 12,
              "y": 2.1865865650929903,
              "label": "epoch 12"
            },
            {
              "x": 13,
              "y": 1.9162452816963196,
              "label": "epoch 13"
            },
            {
              "x": 14,
              "y": 1.7445032471104671,
              "label": "epoch 14"
            },
            {
              "x": 15,
              "y": 1.6353472847687571,
              "label": "epoch 15"
            },
            {
              "x": 16,
              "y": 1.5440363868286735,
              "label": "epoch 16"
            },
            {
              "x": 17,
              "y": 1.4968322044924687,
              "label": "epoch 17"
            },
            {
              "x": 18,
              "y": 1.4290293925686886,
              "label": "epoch 18"
            },
            {
              "x": 19,
              "y": 1.447648801301655,
              "label": "epoch 19"
            },
            {
              "x": 20,
              "y": 1.4112032526417781,
              "label": "epoch 20"
            },
            {
              "x": 21,
              "y": 1.391393294459895,
              "label": "epoch 21"
            },
            {
              "x": 22,
              "y": 1.3402808904647827,
              "label": "epoch 22"
            },
            {
              "x": 23,
              "y": 1.3040078000018471,
              "label": "epoch 23"
            },
            {
              "x": 24,
              "y": 1.2449984989668195,
              "label": "epoch 24"
            },
            {
              "x": 25,
              "y": 1.2135541227303053,
              "label": "epoch 25"
            },
            {
              "x": 26,
              "y": 1.2153758626235158,
              "label": "epoch 26"
            },
            {
              "x": 27,
              "y": 1.2032722234725952,
              "label": "epoch 27"
            },
            {
              "x": 28,
              "y": 1.0592755989024514,
              "label": "epoch 28"
            },
            {
              "x": 29,
              "y": 1.1020134499198513,
              "label": "epoch 29"
            },
            {
              "x": 30,
              "y": 1.1687807009408349,
              "label": "epoch 30"
            },
            {
              "x": 31,
              "y": 1.0449188328103016,
              "label": "epoch 31"
            },
            {
              "x": 32,
              "y": 1.0746644358885915,
              "label": "epoch 32"
            },
            {
              "x": 33,
              "y": 1.088941319208396,
              "label": "epoch 33"
            },
            {
              "x": 34,
              "y": 1.107332550773495,
              "label": "epoch 34"
            },
            {
              "x": 35,
              "y": 1.117454997018764,
              "label": "epoch 35"
            },
            {
              "x": 36,
              "y": 1.0401362666958256,
              "label": "epoch 36"
            },
            {
              "x": 37,
              "y": 1.0078455060720444,
              "label": "epoch 37"
            },
            {
              "x": 38,
              "y": 0.9916025164880251,
              "label": "epoch 38"
            },
            {
              "x": 39,
              "y": 1.0219304498873258,
              "label": "epoch 39"
            },
            {
              "x": 40,
              "y": 1.048206020734812,
              "label": "epoch 40"
            },
            {
              "x": 41,
              "y": 0.9773481939184038,
              "label": "epoch 41"
            },
            {
              "x": 42,
              "y": 1.0420983621948643,
              "label": "epoch 42"
            },
            {
              "x": 43,
              "y": 0.9651046877628878,
              "label": "epoch 43"
            },
            {
              "x": 44,
              "y": 0.9195729090194953,
              "label": "epoch 44"
            },
            {
              "x": 45,
              "y": 0.9976384996583587,
              "label": "epoch 45"
            },
            {
              "x": 46,
              "y": 1.0418681129813194,
              "label": "epoch 46"
            },
            {
              "x": 47,
              "y": 0.9075019849758399,
              "label": "epoch 47"
            },
            {
              "x": 48,
              "y": 0.9592967731387991,
              "label": "epoch 48"
            },
            {
              "x": 49,
              "y": 0.8604301041678378,
              "label": "epoch 49"
            },
            {
              "x": 50,
              "y": 0.9514821624677432,
              "label": "epoch 50"
            },
            {
              "x": 51,
              "y": 1.0356058333265155,
              "label": "epoch 51"
            },
            {
              "x": 52,
              "y": 1.011835283354709,
              "label": "epoch 52"
            },
            {
              "x": 53,
              "y": 0.9613401438844832,
              "label": "epoch 53"
            },
            {
              "x": 54,
              "y": 0.9653368317767194,
              "label": "epoch 54"
            },
            {
              "x": 55,
              "y": 0.9419778879535826,
              "label": "epoch 55"
            },
            {
              "x": 56,
              "y": 0.9067507484241536,
              "label": "epoch 56"
            },
            {
              "x": 57,
              "y": 0.8976071976909512,
              "label": "epoch 57"
            },
            {
              "x": 58,
              "y": 0.9682812682892147,
              "label": "epoch 58"
            },
            {
              "x": 59,
              "y": 0.9587538471739543,
              "label": "epoch 59"
            },
            {
              "x": 60,
              "y": 0.9430709140081155,
              "label": "epoch 60"
            },
            {
              "x": 61,
              "y": 1.0409723066381718,
              "label": "epoch 61"
            },
            {
              "x": 62,
              "y": 1.0112516664850868,
              "label": "epoch 62"
            },
            {
              "x": 63,
              "y": 0.960419329569528,
              "label": "epoch 63"
            },
            {
              "x": 64,
              "y": 1.037317099637891,
              "label": "epoch 64"
            },
            {
              "x": 65,
              "y": 1.0585999666272026,
              "label": "epoch 65"
            },
            {
              "x": 66,
              "y": 0.9741021143762689,
              "label": "epoch 66"
            },
            {
              "x": 67,
              "y": 0.9473957706634936,
              "label": "epoch 67"
            },
            {
              "x": 68,
              "y": 1.0339404322010906,
              "label": "epoch 68"
            },
            {
              "x": 69,
              "y": 1.1229879596319639,
              "label": "epoch 69"
            },
            {
              "x": 70,
              "y": 1.1049404156051184,
              "label": "epoch 70"
            },
            {
              "x": 71,
              "y": 1.1016992138404595,
              "label": "epoch 71"
            },
            {
              "x": 72,
              "y": 1.2023010041662736,
              "label": "epoch 72"
            },
            {
              "x": 73,
              "y": 1.1255146649323011,
              "label": "epoch 73"
            },
            {
              "x": 74,
              "y": 1.121759177626748,
              "label": "epoch 74"
            },
            {
              "x": 75,
              "y": 1.1210641846746991,
              "label": "epoch 75"
            },
            {
              "x": 76,
              "y": 1.1305402163416147,
              "label": "epoch 76"
            },
            {
              "x": 77,
              "y": 1.282088691809852,
              "label": "epoch 77"
            },
            {
              "x": 78,
              "y": 1.096486966419769,
              "label": "epoch 78"
            },
            {
              "x": 79,
              "y": 1.0864685918204486,
              "label": "epoch 79"
            },
            {
              "x": 80,
              "y": 1.2269081125329984,
              "label": "epoch 80"
            },
            {
              "x": 81,
              "y": 1.173879454451564,
              "label": "epoch 81"
            },
            {
              "x": 82,
              "y": 1.2944869410344644,
              "label": "epoch 82"
            },
            {
              "x": 83,
              "y": 1.3195018515382941,
              "label": "epoch 83"
            },
            {
              "x": 84,
              "y": 1.2959234520400826,
              "label": "epoch 84"
            },
            {
              "x": 85,
              "y": 1.265703536962208,
              "label": "epoch 85"
            },
            {
              "x": 86,
              "y": 1.3846853727866943,
              "label": "epoch 86"
            },
            {
              "x": 87,
              "y": 1.4055331987328827,
              "label": "epoch 87"
            },
            {
              "x": 88,
              "y": 1.340271097068724,
              "label": "epoch 88"
            },
            {
              "x": 89,
              "y": 1.1911802494310235,
              "label": "epoch 89"
            },
            {
              "x": 90,
              "y": 1.278756156318674,
              "label": "epoch 90"
            },
            {
              "x": 91,
              "y": 1.3837710555250708,
              "label": "epoch 91"
            },
            {
              "x": 92,
              "y": 1.3078765170893778,
              "label": "epoch 92"
            },
            {
              "x": 93,
              "y": 1.2952550137660612,
              "label": "epoch 93"
            },
            {
              "x": 94,
              "y": 1.3959263247976963,
              "label": "epoch 94"
            },
            {
              "x": 95,
              "y": 1.4069555052311014,
              "label": "epoch 95"
            },
            {
              "x": 96,
              "y": 1.3564107426883358,
              "label": "epoch 96"
            },
            {
              "x": 97,
              "y": 1.3733277106167454,
              "label": "epoch 97"
            },
            {
              "x": 98,
              "y": 1.5370124267708314,
              "label": "epoch 98"
            },
            {
              "x": 99,
              "y": 1.4277221890607554,
              "label": "epoch 99"
            },
            {
              "x": 101,
              "y": 1.2741519897980125,
              "label": "epoch 101"
            },
            {
              "x": 102,
              "y": 1.2121044760324846,
              "label": "epoch 102"
            },
            {
              "x": 103,
              "y": 1.3789120741972798,
              "label": "epoch 103"
            },
            {
              "x": 104,
              "y": 1.210306548954625,
              "label": "epoch 104"
            },
            {
              "x": 105,
              "y": 1.0994060349552648,
              "label": "epoch 105"
            },
            {
              "x": 106,
              "y": 1.2846925360101618,
              "label": "epoch 106"
            },
            {
              "x": 107,
              "y": 1.0495322905480862,
              "label": "epoch 107"
            },
            {
              "x": 108,
              "y": 1.1242292671415366,
              "label": "epoch 108"
            },
            {
              "x": 109,
              "y": 1.037148844989899,
              "label": "epoch 109"
            },
            {
              "x": 110,
              "y": 1.2820137874468376,
              "label": "epoch 110"
            },
            {
              "x": 111,
              "y": 1.182110291047904,
              "label": "epoch 111"
            },
            {
              "x": 112,
              "y": 1.0663467686819403,
              "label": "epoch 112"
            },
            {
              "x": 113,
              "y": 1.1877191152031485,
              "label": "epoch 113"
            },
            {
              "x": 114,
              "y": 1.1625780028438097,
              "label": "epoch 114"
            },
            {
              "x": 115,
              "y": 1.0974636881759292,
              "label": "epoch 115"
            },
            {
              "x": 116,
              "y": 1.0820611642771645,
              "label": "epoch 116"
            },
            {
              "x": 117,
              "y": 1.12559720658158,
              "label": "epoch 117"
            },
            {
              "x": 118,
              "y": 1.214865013172752,
              "label": "epoch 118"
            },
            {
              "x": 119,
              "y": 1.0045814698709077,
              "label": "epoch 119"
            },
            {
              "x": 120,
              "y": 1.1954206286586428,
              "label": "epoch 120"
            },
            {
              "x": 121,
              "y": 1.105821535971604,
              "label": "epoch 121"
            },
            {
              "x": 122,
              "y": 0.9970487520637873,
              "label": "epoch 122"
            },
            {
              "x": 123,
              "y": 1.0943313639022803,
              "label": "epoch 123"
            },
            {
              "x": 124,
              "y": 1.1704836731874628,
              "label": "epoch 124"
            },
            {
              "x": 125,
              "y": 1.109261563611462,
              "label": "epoch 125"
            },
            {
              "x": 126,
              "y": 0.8079981434060947,
              "label": "epoch 126"
            },
            {
              "x": 127,
              "y": 1.001463888090496,
              "label": "epoch 127"
            },
            {
              "x": 128,
              "y": 1.2875741341298348,
              "label": "epoch 128"
            },
            {
              "x": 129,
              "y": 1.0854426953255345,
              "label": "epoch 129"
            },
            {
              "x": 130,
              "y": 1.100882912912455,
              "label": "epoch 130"
            },
            {
              "x": 131,
              "y": 1.1260040991596485,
              "label": "epoch 131"
            },
            {
              "x": 132,
              "y": 1.1737313444334034,
              "label": "epoch 132"
            },
            {
              "x": 133,
              "y": 1.2228677005163933,
              "label": "epoch 133"
            },
            {
              "x": 134,
              "y": 1.1521760540230102,
              "label": "epoch 134"
            },
            {
              "x": 135,
              "y": 1.258277605655358,
              "label": "epoch 135"
            },
            {
              "x": 136,
              "y": 1.000903242855872,
              "label": "epoch 136"
            },
            {
              "x": 137,
              "y": 1.062699201614841,
              "label": "epoch 137"
            },
            {
              "x": 138,
              "y": 1.1456905736980076,
              "label": "epoch 138"
            },
            {
              "x": 139,
              "y": 1.1079666426307277,
              "label": "epoch 139"
            },
            {
              "x": 140,
              "y": 1.1434962899473153,
              "label": "epoch 140"
            },
            {
              "x": 141,
              "y": 1.0579919734920717,
              "label": "epoch 141"
            },
            {
              "x": 142,
              "y": 1.0509717918344235,
              "label": "epoch 142"
            },
            {
              "x": 143,
              "y": 1.1355793836624606,
              "label": "epoch 143"
            },
            {
              "x": 144,
              "y": 1.0303907544401132,
              "label": "epoch 144"
            },
            {
              "x": 145,
              "y": 1.0300331500751014,
              "label": "epoch 145"
            },
            {
              "x": 146,
              "y": 1.0912740352612578,
              "label": "epoch 146"
            },
            {
              "x": 147,
              "y": 0.927943629139152,
              "label": "epoch 147"
            },
            {
              "x": 148,
              "y": 1.0949859902091128,
              "label": "epoch 148"
            },
            {
              "x": 149,
              "y": 0.9995218808640187,
              "label": "epoch 149"
            },
            {
              "x": 150,
              "y": 1.0621338894002532,
              "label": "epoch 150"
            },
            {
              "x": 151,
              "y": 1.1043396280514763,
              "label": "epoch 151"
            },
            {
              "x": 152,
              "y": 1.1146840497263169,
              "label": "epoch 152"
            },
            {
              "x": 153,
              "y": 1.0493955256809528,
              "label": "epoch 153"
            },
            {
              "x": 154,
              "y": 1.2651437587643926,
              "label": "epoch 154"
            },
            {
              "x": 155,
              "y": 1.067739148011529,
              "label": "epoch 155"
            },
            {
              "x": 156,
              "y": 1.1105516571551561,
              "label": "epoch 156"
            },
            {
              "x": 157,
              "y": 1.0969082787632942,
              "label": "epoch 157"
            },
            {
              "x": 158,
              "y": 1.0670692589820217,
              "label": "epoch 158"
            },
            {
              "x": 159,
              "y": 1.254662013073501,
              "label": "epoch 159"
            },
            {
              "x": 160,
              "y": 1.2079329514925026,
              "label": "epoch 160"
            },
            {
              "x": 161,
              "y": 1.0604308981595463,
              "label": "epoch 161"
            },
            {
              "x": 162,
              "y": 1.159520528585601,
              "label": "epoch 162"
            },
            {
              "x": 163,
              "y": 1.1822837227710377,
              "label": "epoch 163"
            },
            {
              "x": 164,
              "y": 1.1407545753509591,
              "label": "epoch 164"
            },
            {
              "x": 165,
              "y": 1.120417520906286,
              "label": "epoch 165"
            },
            {
              "x": 166,
              "y": 1.1167757916264236,
              "label": "epoch 166"
            },
            {
              "x": 167,
              "y": 1.2179430491340004,
              "label": "epoch 167"
            },
            {
              "x": 168,
              "y": 1.179893516886391,
              "label": "epoch 168"
            },
            {
              "x": 169,
              "y": 1.149878263939172,
              "label": "epoch 169"
            },
            {
              "x": 170,
              "y": 1.2393969665526559,
              "label": "epoch 170"
            },
            {
              "x": 171,
              "y": 1.1949096503177363,
              "label": "epoch 171"
            },
            {
              "x": 172,
              "y": 1.1715894910555922,
              "label": "epoch 172"
            },
            {
              "x": 173,
              "y": 1.1582215221010541,
              "label": "epoch 173"
            },
            {
              "x": 174,
              "y": 1.1863466255660904,
              "label": "epoch 174"
            },
            {
              "x": 175,
              "y": 1.1163664951332306,
              "label": "epoch 175"
            },
            {
              "x": 176,
              "y": 1.0824861772064316,
              "label": "epoch 176"
            },
            {
              "x": 177,
              "y": 1.083622179680357,
              "label": "epoch 177"
            },
            {
              "x": 178,
              "y": 1.209034290066675,
              "label": "epoch 178"
            },
            {
              "x": 179,
              "y": 1.2100447906230234,
              "label": "epoch 179"
            },
            {
              "x": 180,
              "y": 1.1733285448219823,
              "label": "epoch 180"
            },
            {
              "x": 181,
              "y": 1.2724991064322622,
              "label": "epoch 181"
            },
            {
              "x": 182,
              "y": 1.2389399079164785,
              "label": "epoch 182"
            },
            {
              "x": 183,
              "y": 1.1979339353519638,
              "label": "epoch 183"
            },
            {
              "x": 184,
              "y": 1.0773152755818476,
              "label": "epoch 184"
            },
            {
              "x": 185,
              "y": 1.1035088288205628,
              "label": "epoch 185"
            },
            {
              "x": 186,
              "y": 1.2492215496512424,
              "label": "epoch 186"
            },
            {
              "x": 187,
              "y": 1.1035252044369515,
              "label": "epoch 187"
            },
            {
              "x": 188,
              "y": 1.1701964138467844,
              "label": "epoch 188"
            },
            {
              "x": 189,
              "y": 1.0954029426272762,
              "label": "epoch 189"
            },
            {
              "x": 190,
              "y": 1.1285509129397964,
              "label": "epoch 190"
            },
            {
              "x": 191,
              "y": 1.1740031925667274,
              "label": "epoch 191"
            },
            {
              "x": 192,
              "y": 1.26078557995099,
              "label": "epoch 192"
            },
            {
              "x": 193,
              "y": 1.2926684448152388,
              "label": "epoch 193"
            },
            {
              "x": 194,
              "y": 1.1594823960361904,
              "label": "epoch 194"
            },
            {
              "x": 195,
              "y": 1.1757238989597874,
              "label": "epoch 195"
            },
            {
              "x": 196,
              "y": 1.3593290643276352,
              "label": "epoch 196"
            },
            {
              "x": 197,
              "y": 1.2472444835829695,
              "label": "epoch 197"
            },
            {
              "x": 198,
              "y": 1.3011494810006727,
              "label": "epoch 198"
            },
            {
              "x": 199,
              "y": 1.0808607433481436,
              "label": "epoch 199"
            },
            {
              "x": 200,
              "y": 1.0017309254035354,
              "label": "epoch 200"
            },
            {
              "x": 201,
              "y": 1.1731144724854905,
              "label": "epoch 201"
            },
            {
              "x": 202,
              "y": 1.1862415990694182,
              "label": "epoch 202"
            },
            {
              "x": 203,
              "y": 1.188932987542725,
              "label": "epoch 203"
            },
            {
              "x": 204,
              "y": 1.1056433397247212,
              "label": "epoch 204"
            },
            {
              "x": 205,
              "y": 1.1454941171809638,
              "label": "epoch 205"
            },
            {
              "x": 206,
              "y": 1.3412269758501727,
              "label": "epoch 206"
            },
            {
              "x": 207,
              "y": 1.2178515401717864,
              "label": "epoch 207"
            },
            {
              "x": 208,
              "y": 1.2558170480433066,
              "label": "epoch 208"
            },
            {
              "x": 209,
              "y": 1.2741605110074345,
              "label": "epoch 209"
            },
            {
              "x": 210,
              "y": 1.2757843985516382,
              "label": "epoch 210"
            },
            {
              "x": 211,
              "y": 1.0546272545562763,
              "label": "epoch 211"
            },
            {
              "x": 212,
              "y": 1.1592286542352093,
              "label": "epoch 212"
            },
            {
              "x": 213,
              "y": 1.0788753651278584,
              "label": "epoch 213"
            },
            {
              "x": 214,
              "y": 1.3361342480822809,
              "label": "epoch 214"
            },
            {
              "x": 215,
              "y": 1.1854720400695347,
              "label": "epoch 215"
            },
            {
              "x": 216,
              "y": 1.2968201737262701,
              "label": "epoch 216"
            },
            {
              "x": 217,
              "y": 1.352317712453537,
              "label": "epoch 217"
            },
            {
              "x": 218,
              "y": 1.2817154823263224,
              "label": "epoch 218"
            },
            {
              "x": 219,
              "y": 1.1171899646716683,
              "label": "epoch 219"
            },
            {
              "x": 220,
              "y": 1.161503878593641,
              "label": "epoch 220"
            },
            {
              "x": 221,
              "y": 1.2553066092690355,
              "label": "epoch 221"
            },
            {
              "x": 222,
              "y": 1.033655258655352,
              "label": "epoch 222"
            },
            {
              "x": 223,
              "y": 1.0941493563157947,
              "label": "epoch 223"
            },
            {
              "x": 224,
              "y": 1.3274416369631101,
              "label": "epoch 224"
            },
            {
              "x": 225,
              "y": 1.308841387006013,
              "label": "epoch 225"
            },
            {
              "x": 226,
              "y": 1.1375667192532044,
              "label": "epoch 226"
            },
            {
              "x": 227,
              "y": 1.4283504806409932,
              "label": "epoch 227"
            },
            {
              "x": 228,
              "y": 1.3196114856063534,
              "label": "epoch 228"
            },
            {
              "x": 229,
              "y": 1.1430967126629854,
              "label": "epoch 229"
            },
            {
              "x": 230,
              "y": 1.2899518469103466,
              "label": "epoch 230"
            },
            {
              "x": 231,
              "y": 1.4167831562655537,
              "label": "epoch 231"
            },
            {
              "x": 232,
              "y": 1.227713399125557,
              "label": "epoch 232"
            },
            {
              "x": 233,
              "y": 1.4048828472579389,
              "label": "epoch 233"
            },
            {
              "x": 234,
              "y": 1.4582305001340021,
              "label": "epoch 234"
            },
            {
              "x": 235,
              "y": 1.30807020320361,
              "label": "epoch 235"
            },
            {
              "x": 236,
              "y": 1.3088461370452453,
              "label": "epoch 236"
            },
            {
              "x": 237,
              "y": 1.5632114254281317,
              "label": "epoch 237"
            },
            {
              "x": 238,
              "y": 1.3516450575675423,
              "label": "epoch 238"
            },
            {
              "x": 239,
              "y": 1.349605619049582,
              "label": "epoch 239"
            },
            {
              "x": 240,
              "y": 1.2715810110645467,
              "label": "epoch 240"
            },
            {
              "x": 241,
              "y": 1.2205706972285713,
              "label": "epoch 241"
            },
            {
              "x": 242,
              "y": 1.5516798285473334,
              "label": "epoch 242"
            },
            {
              "x": 243,
              "y": 1.3108361874903112,
              "label": "epoch 243"
            },
            {
              "x": 244,
              "y": 1.2433672370634188,
              "label": "epoch 244"
            },
            {
              "x": 245,
              "y": 1.2288092933840264,
              "label": "epoch 245"
            },
            {
              "x": 246,
              "y": 1.347039711771925,
              "label": "epoch 246"
            },
            {
              "x": 247,
              "y": 1.3399730554144633,
              "label": "epoch 247"
            },
            {
              "x": 248,
              "y": 1.2315575631065785,
              "label": "epoch 248"
            },
            {
              "x": 249,
              "y": 1.3149565344945968,
              "label": "epoch 249"
            },
            {
              "x": 250,
              "y": 1.5169839721516167,
              "label": "epoch 250"
            },
            {
              "x": 251,
              "y": 1.3141262185098113,
              "label": "epoch 251"
            },
            {
              "x": 252,
              "y": 1.3011521865050064,
              "label": "epoch 252"
            },
            {
              "x": 253,
              "y": 1.3801603629498889,
              "label": "epoch 253"
            },
            {
              "x": 254,
              "y": 1.1508994311657978,
              "label": "epoch 254"
            },
            {
              "x": 255,
              "y": 1.1631712976254915,
              "label": "epoch 255"
            },
            {
              "x": 256,
              "y": 1.4341580879041238,
              "label": "epoch 256"
            },
            {
              "x": 257,
              "y": 1.3348989894393046,
              "label": "epoch 257"
            },
            {
              "x": 258,
              "y": 1.2506159347678094,
              "label": "epoch 258"
            },
            {
              "x": 259,
              "y": 1.259147003268529,
              "label": "epoch 259"
            },
            {
              "x": 260,
              "y": 1.4421305629963939,
              "label": "epoch 260"
            },
            {
              "x": 261,
              "y": 1.1363540820434297,
              "label": "epoch 261"
            },
            {
              "x": 262,
              "y": 1.428322004276867,
              "label": "epoch 262"
            },
            {
              "x": 263,
              "y": 1.4229134904024632,
              "label": "epoch 263"
            },
            {
              "x": 264,
              "y": 1.279999832377622,
              "label": "epoch 264"
            },
            {
              "x": 265,
              "y": 1.3796920154096657,
              "label": "epoch 265"
            },
            {
              "x": 266,
              "y": 1.3246685840728645,
              "label": "epoch 266"
            },
            {
              "x": 267,
              "y": 1.340374958860737,
              "label": "epoch 267"
            }
          ]
        }
      ]
    },
    "mdit-mse-curve": {
      "id": "mdit-mse-curve",
      "type": "line",
      "title": "MDIT valid MSE",
      "description": "拆开看 xyz / rot6d / grip 三条 valid MSE，避免只盯 total loss 时看不出哪一类误差在拖后腿。",
      "format": "float",
      "note": "使用 W&B API 抓取 valid mse_xyz / mse_rot6d / mse_grip 全量 history。",
      "series": [
        {
          "name": "mse_xyz",
          "color": "#2b766f",
          "points": [
            {
              "x": 1,
              "y": 3.164567238406131,
              "label": "epoch 1"
            },
            {
              "x": 2,
              "y": 2.900932650817068,
              "label": "epoch 2"
            },
            {
              "x": 3,
              "y": 2.6302489983408073,
              "label": "epoch 3"
            },
            {
              "x": 4,
              "y": 2.324283085371319,
              "label": "epoch 4"
            },
            {
              "x": 5,
              "y": 2.0136041703977083,
              "label": "epoch 5"
            },
            {
              "x": 6,
              "y": 1.6703721410349797,
              "label": "epoch 6"
            },
            {
              "x": 7,
              "y": 1.3528390589513277,
              "label": "epoch 7"
            },
            {
              "x": 8,
              "y": 1.050629154631966,
              "label": "epoch 8"
            },
            {
              "x": 9,
              "y": 0.7849966303298348,
              "label": "epoch 9"
            },
            {
              "x": 10,
              "y": 0.5446961937766326,
              "label": "epoch 10"
            },
            {
              "x": 11,
              "y": 0.3633592669901095,
              "label": "epoch 11"
            },
            {
              "x": 12,
              "y": 0.23507727368881828,
              "label": "epoch 12"
            },
            {
              "x": 13,
              "y": 0.15029997457014888,
              "label": "epoch 13"
            },
            {
              "x": 14,
              "y": 0.10114562511444092,
              "label": "epoch 14"
            },
            {
              "x": 15,
              "y": 0.07097072791504233,
              "label": "epoch 15"
            },
            {
              "x": 16,
              "y": 0.054596037652931716,
              "label": "epoch 16"
            },
            {
              "x": 17,
              "y": 0.04238223730537452,
              "label": "epoch 17"
            },
            {
              "x": 18,
              "y": 0.03474457135522052,
              "label": "epoch 18"
            },
            {
              "x": 19,
              "y": 0.029471697432822304,
              "label": "epoch 19"
            },
            {
              "x": 20,
              "y": 0.025476906448602676,
              "label": "epoch 20"
            },
            {
              "x": 21,
              "y": 0.022979455166741422,
              "label": "epoch 21"
            },
            {
              "x": 22,
              "y": 0.02081422115627088,
              "label": "epoch 22"
            },
            {
              "x": 23,
              "y": 0.018483537469843502,
              "label": "epoch 23"
            },
            {
              "x": 24,
              "y": 0.016564381725497936,
              "label": "epoch 24"
            },
            {
              "x": 25,
              "y": 0.015402282612692369,
              "label": "epoch 25"
            },
            {
              "x": 26,
              "y": 0.014435818810996256,
              "label": "epoch 26"
            },
            {
              "x": 27,
              "y": 0.013242102277122046,
              "label": "epoch 27"
            },
            {
              "x": 28,
              "y": 0.012347829258559566,
              "label": "epoch 28"
            },
            {
              "x": 29,
              "y": 0.011242909222155026,
              "label": "epoch 29"
            },
            {
              "x": 30,
              "y": 0.010912189689023714,
              "label": "epoch 30"
            },
            {
              "x": 31,
              "y": 0.010123882344678828,
              "label": "epoch 31"
            },
            {
              "x": 32,
              "y": 0.009864572821626146,
              "label": "epoch 32"
            },
            {
              "x": 33,
              "y": 0.00884381984360516,
              "label": "epoch 33"
            },
            {
              "x": 34,
              "y": 0.008716580004578358,
              "label": "epoch 34"
            },
            {
              "x": 35,
              "y": 0.008288854806634941,
              "label": "epoch 35"
            },
            {
              "x": 36,
              "y": 0.007922226066799149,
              "label": "epoch 36"
            },
            {
              "x": 37,
              "y": 0.007514773221612957,
              "label": "epoch 37"
            },
            {
              "x": 38,
              "y": 0.007297989360890106,
              "label": "epoch 38"
            },
            {
              "x": 39,
              "y": 0.006982677634560356,
              "label": "epoch 39"
            },
            {
              "x": 40,
              "y": 0.006490975808303215,
              "label": "epoch 40"
            },
            {
              "x": 41,
              "y": 0.006587671137439381,
              "label": "epoch 41"
            },
            {
              "x": 42,
              "y": 0.005850652064270291,
              "label": "epoch 42"
            },
            {
              "x": 43,
              "y": 0.005979355479786663,
              "label": "epoch 43"
            },
            {
              "x": 44,
              "y": 0.005873009024837397,
              "label": "epoch 44"
            },
            {
              "x": 45,
              "y": 0.005620191272005047,
              "label": "epoch 45"
            },
            {
              "x": 46,
              "y": 0.005455499475111107,
              "label": "epoch 46"
            },
            {
              "x": 47,
              "y": 0.005303190929177953,
              "label": "epoch 47"
            },
            {
              "x": 48,
              "y": 0.005240376354011364,
              "label": "epoch 48"
            },
            {
              "x": 49,
              "y": 0.005232909865873425,
              "label": "epoch 49"
            },
            {
              "x": 50,
              "y": 0.005048489473809145,
              "label": "epoch 50"
            },
            {
              "x": 51,
              "y": 0.005119394838785459,
              "label": "epoch 51"
            },
            {
              "x": 52,
              "y": 0.004917435934705856,
              "label": "epoch 52"
            },
            {
              "x": 53,
              "y": 0.004843038258657448,
              "label": "epoch 53"
            },
            {
              "x": 54,
              "y": 0.004754789928770869,
              "label": "epoch 54"
            },
            {
              "x": 55,
              "y": 0.004622219962153682,
              "label": "epoch 55"
            },
            {
              "x": 56,
              "y": 0.004496020929716332,
              "label": "epoch 56"
            },
            {
              "x": 57,
              "y": 0.004541778425367451,
              "label": "epoch 57"
            },
            {
              "x": 58,
              "y": 0.0046137806424858836,
              "label": "epoch 58"
            },
            {
              "x": 59,
              "y": 0.004285388960852288,
              "label": "epoch 59"
            },
            {
              "x": 60,
              "y": 0.00445626467224333,
              "label": "epoch 60"
            },
            {
              "x": 61,
              "y": 0.004465737500332149,
              "label": "epoch 61"
            },
            {
              "x": 62,
              "y": 0.004336302216152514,
              "label": "epoch 62"
            },
            {
              "x": 63,
              "y": 0.004393853544331107,
              "label": "epoch 63"
            },
            {
              "x": 64,
              "y": 0.004290408316975166,
              "label": "epoch 64"
            },
            {
              "x": 65,
              "y": 0.00428447370550681,
              "label": "epoch 65"
            },
            {
              "x": 66,
              "y": 0.004293839887970152,
              "label": "epoch 66"
            },
            {
              "x": 67,
              "y": 0.00418742085649252,
              "label": "epoch 67"
            },
            {
              "x": 68,
              "y": 0.004243144220948268,
              "label": "epoch 68"
            },
            {
              "x": 69,
              "y": 0.004203879670776108,
              "label": "epoch 69"
            },
            {
              "x": 70,
              "y": 0.0041286814774043465,
              "label": "epoch 70"
            },
            {
              "x": 71,
              "y": 0.00422977570384606,
              "label": "epoch 71"
            },
            {
              "x": 72,
              "y": 0.004101368249011054,
              "label": "epoch 72"
            },
            {
              "x": 73,
              "y": 0.0040523368397292585,
              "label": "epoch 73"
            },
            {
              "x": 74,
              "y": 0.0041523346329708334,
              "label": "epoch 74"
            },
            {
              "x": 75,
              "y": 0.004074431084231229,
              "label": "epoch 75"
            },
            {
              "x": 76,
              "y": 0.0040621684686476854,
              "label": "epoch 76"
            },
            {
              "x": 77,
              "y": 0.004157820900696893,
              "label": "epoch 77"
            },
            {
              "x": 78,
              "y": 0.004071687039533189,
              "label": "epoch 78"
            },
            {
              "x": 79,
              "y": 0.004087675542426663,
              "label": "epoch 79"
            },
            {
              "x": 80,
              "y": 0.004154971051320899,
              "label": "epoch 80"
            },
            {
              "x": 81,
              "y": 0.004076506392218442,
              "label": "epoch 81"
            },
            {
              "x": 82,
              "y": 0.004060097128737988,
              "label": "epoch 82"
            },
            {
              "x": 83,
              "y": 0.004041785915002325,
              "label": "epoch 83"
            },
            {
              "x": 84,
              "y": 0.0041501188369645545,
              "label": "epoch 84"
            },
            {
              "x": 85,
              "y": 0.0039923888670225435,
              "label": "epoch 85"
            },
            {
              "x": 86,
              "y": 0.003992298935037597,
              "label": "epoch 86"
            },
            {
              "x": 87,
              "y": 0.00400309889166812,
              "label": "epoch 87"
            },
            {
              "x": 88,
              "y": 0.004018441712679832,
              "label": "epoch 88"
            },
            {
              "x": 89,
              "y": 0.003956463945015505,
              "label": "epoch 89"
            },
            {
              "x": 90,
              "y": 0.004003024558378935,
              "label": "epoch 90"
            },
            {
              "x": 91,
              "y": 0.0039765004380330395,
              "label": "epoch 91"
            },
            {
              "x": 92,
              "y": 0.00398220654345718,
              "label": "epoch 92"
            },
            {
              "x": 93,
              "y": 0.004044746408333977,
              "label": "epoch 93"
            },
            {
              "x": 94,
              "y": 0.003974125014026772,
              "label": "epoch 94"
            },
            {
              "x": 95,
              "y": 0.00396793701867481,
              "label": "epoch 95"
            },
            {
              "x": 96,
              "y": 0.0039648688080457135,
              "label": "epoch 96"
            },
            {
              "x": 97,
              "y": 0.003962987862522775,
              "label": "epoch 97"
            },
            {
              "x": 98,
              "y": 0.003990766806773057,
              "label": "epoch 98"
            },
            {
              "x": 99,
              "y": 0.00396996099880198,
              "label": "epoch 99"
            },
            {
              "x": 101,
              "y": 0.004017324124824403,
              "label": "epoch 101"
            },
            {
              "x": 102,
              "y": 0.004025649948935576,
              "label": "epoch 102"
            },
            {
              "x": 103,
              "y": 0.004107683013946945,
              "label": "epoch 103"
            },
            {
              "x": 104,
              "y": 0.004014906144890885,
              "label": "epoch 104"
            },
            {
              "x": 105,
              "y": 0.004006757148186137,
              "label": "epoch 105"
            },
            {
              "x": 106,
              "y": 0.003995382989447343,
              "label": "epoch 106"
            },
            {
              "x": 107,
              "y": 0.004026494054031852,
              "label": "epoch 107"
            },
            {
              "x": 108,
              "y": 0.004029722230610021,
              "label": "epoch 108"
            },
            {
              "x": 109,
              "y": 0.004021139680653026,
              "label": "epoch 109"
            },
            {
              "x": 110,
              "y": 0.0040378257276882466,
              "label": "epoch 110"
            },
            {
              "x": 111,
              "y": 0.004015231150812102,
              "label": "epoch 111"
            },
            {
              "x": 112,
              "y": 0.00403146484275471,
              "label": "epoch 112"
            },
            {
              "x": 113,
              "y": 0.004030653409963155,
              "label": "epoch 113"
            },
            {
              "x": 114,
              "y": 0.004046717073115839,
              "label": "epoch 114"
            },
            {
              "x": 115,
              "y": 0.004034923203059742,
              "label": "epoch 115"
            },
            {
              "x": 116,
              "y": 0.003990472571642481,
              "label": "epoch 116"
            },
            {
              "x": 117,
              "y": 0.003991818559849267,
              "label": "epoch 117"
            },
            {
              "x": 118,
              "y": 0.004061673869728111,
              "label": "epoch 118"
            },
            {
              "x": 119,
              "y": 0.00403113627812433,
              "label": "epoch 119"
            },
            {
              "x": 120,
              "y": 0.004007284688046447,
              "label": "epoch 120"
            },
            {
              "x": 121,
              "y": 0.003997419861231097,
              "label": "epoch 121"
            },
            {
              "x": 122,
              "y": 0.003979400969049158,
              "label": "epoch 122"
            },
            {
              "x": 123,
              "y": 0.0039970866679428394,
              "label": "epoch 123"
            },
            {
              "x": 124,
              "y": 0.003945470704868632,
              "label": "epoch 124"
            },
            {
              "x": 125,
              "y": 0.0040184390194266785,
              "label": "epoch 125"
            },
            {
              "x": 126,
              "y": 0.003989335527876392,
              "label": "epoch 126"
            },
            {
              "x": 127,
              "y": 0.004033946911237619,
              "label": "epoch 127"
            },
            {
              "x": 128,
              "y": 0.004001470482188252,
              "label": "epoch 128"
            },
            {
              "x": 129,
              "y": 0.003997710230530509,
              "label": "epoch 129"
            },
            {
              "x": 130,
              "y": 0.003996731177099527,
              "label": "epoch 130"
            },
            {
              "x": 131,
              "y": 0.004003907100061616,
              "label": "epoch 131"
            },
            {
              "x": 132,
              "y": 0.004039991489997574,
              "label": "epoch 132"
            },
            {
              "x": 133,
              "y": 0.004052826271953036,
              "label": "epoch 133"
            },
            {
              "x": 134,
              "y": 0.004027285253917063,
              "label": "epoch 134"
            },
            {
              "x": 135,
              "y": 0.004015406733838302,
              "label": "epoch 135"
            },
            {
              "x": 136,
              "y": 0.0040705403643139446,
              "label": "epoch 136"
            },
            {
              "x": 137,
              "y": 0.004025872349876935,
              "label": "epoch 137"
            },
            {
              "x": 138,
              "y": 0.004023616403987705,
              "label": "epoch 138"
            },
            {
              "x": 139,
              "y": 0.004021311457970449,
              "label": "epoch 139"
            },
            {
              "x": 140,
              "y": 0.004018916690256447,
              "label": "epoch 140"
            },
            {
              "x": 141,
              "y": 0.00403342885118419,
              "label": "epoch 141"
            },
            {
              "x": 142,
              "y": 0.004020647225460331,
              "label": "epoch 142"
            },
            {
              "x": 143,
              "y": 0.004031720750055301,
              "label": "epoch 143"
            },
            {
              "x": 144,
              "y": 0.003997026683416487,
              "label": "epoch 144"
            },
            {
              "x": 145,
              "y": 0.004035847461062459,
              "label": "epoch 145"
            },
            {
              "x": 146,
              "y": 0.004021839979702092,
              "label": "epoch 146"
            },
            {
              "x": 147,
              "y": 0.004019031197362653,
              "label": "epoch 147"
            },
            {
              "x": 148,
              "y": 0.004033535188921776,
              "label": "epoch 148"
            },
            {
              "x": 149,
              "y": 0.004006811482739929,
              "label": "epoch 149"
            },
            {
              "x": 150,
              "y": 0.0040185565395452275,
              "label": "epoch 150"
            },
            {
              "x": 151,
              "y": 0.004023380192321431,
              "label": "epoch 151"
            },
            {
              "x": 152,
              "y": 0.004051631647407224,
              "label": "epoch 152"
            },
            {
              "x": 153,
              "y": 0.004020909066878774,
              "label": "epoch 153"
            },
            {
              "x": 154,
              "y": 0.0039935010097810605,
              "label": "epoch 154"
            },
            {
              "x": 155,
              "y": 0.00398638305035236,
              "label": "epoch 155"
            },
            {
              "x": 156,
              "y": 0.004066434282178402,
              "label": "epoch 156"
            },
            {
              "x": 157,
              "y": 0.004014189768656108,
              "label": "epoch 157"
            },
            {
              "x": 158,
              "y": 0.004028901915406,
              "label": "epoch 158"
            },
            {
              "x": 159,
              "y": 0.004048589887373198,
              "label": "epoch 159"
            },
            {
              "x": 160,
              "y": 0.004047379959190853,
              "label": "epoch 160"
            },
            {
              "x": 161,
              "y": 0.004052799286958026,
              "label": "epoch 161"
            },
            {
              "x": 162,
              "y": 0.004038532860010348,
              "label": "epoch 162"
            },
            {
              "x": 163,
              "y": 0.004046377437924476,
              "label": "epoch 163"
            },
            {
              "x": 164,
              "y": 0.004035870970064455,
              "label": "epoch 164"
            },
            {
              "x": 165,
              "y": 0.004085754436872728,
              "label": "epoch 165"
            },
            {
              "x": 166,
              "y": 0.004075375215554806,
              "label": "epoch 166"
            },
            {
              "x": 167,
              "y": 0.004069001717174328,
              "label": "epoch 167"
            },
            {
              "x": 168,
              "y": 0.004057908263348509,
              "label": "epoch 168"
            },
            {
              "x": 169,
              "y": 0.004059939608085092,
              "label": "epoch 169"
            },
            {
              "x": 170,
              "y": 0.004058434062723168,
              "label": "epoch 170"
            },
            {
              "x": 171,
              "y": 0.004042799283189724,
              "label": "epoch 171"
            },
            {
              "x": 172,
              "y": 0.004069726273883134,
              "label": "epoch 172"
            },
            {
              "x": 173,
              "y": 0.00404195910347258,
              "label": "epoch 173"
            },
            {
              "x": 174,
              "y": 0.0040650770794232625,
              "label": "epoch 174"
            },
            {
              "x": 175,
              "y": 0.004094584775693396,
              "label": "epoch 175"
            },
            {
              "x": 176,
              "y": 0.00407022318579134,
              "label": "epoch 176"
            },
            {
              "x": 177,
              "y": 0.004096823467606507,
              "label": "epoch 177"
            },
            {
              "x": 178,
              "y": 0.004132763591003727,
              "label": "epoch 178"
            },
            {
              "x": 179,
              "y": 0.00409129088151722,
              "label": "epoch 179"
            },
            {
              "x": 180,
              "y": 0.004149004412235962,
              "label": "epoch 180"
            },
            {
              "x": 181,
              "y": 0.004118281017949094,
              "label": "epoch 181"
            },
            {
              "x": 182,
              "y": 0.004106358066277799,
              "label": "epoch 182"
            },
            {
              "x": 183,
              "y": 0.004120617128424591,
              "label": "epoch 183"
            },
            {
              "x": 184,
              "y": 0.00414158030693407,
              "label": "epoch 184"
            },
            {
              "x": 185,
              "y": 0.004113298897113725,
              "label": "epoch 185"
            },
            {
              "x": 186,
              "y": 0.004145801268015547,
              "label": "epoch 186"
            },
            {
              "x": 187,
              "y": 0.004119363242735792,
              "label": "epoch 187"
            },
            {
              "x": 188,
              "y": 0.004120676957475217,
              "label": "epoch 188"
            },
            {
              "x": 189,
              "y": 0.004165797834024201,
              "label": "epoch 189"
            },
            {
              "x": 190,
              "y": 0.004162743150357672,
              "label": "epoch 190"
            },
            {
              "x": 191,
              "y": 0.004158202495186981,
              "label": "epoch 191"
            },
            {
              "x": 192,
              "y": 0.00415494564061335,
              "label": "epoch 192"
            },
            {
              "x": 193,
              "y": 0.004158872418644789,
              "label": "epoch 193"
            },
            {
              "x": 194,
              "y": 0.0041640686724445245,
              "label": "epoch 194"
            },
            {
              "x": 195,
              "y": 0.0041727104356763635,
              "label": "epoch 195"
            },
            {
              "x": 196,
              "y": 0.0042092939486457525,
              "label": "epoch 196"
            },
            {
              "x": 197,
              "y": 0.0041768127737572954,
              "label": "epoch 197"
            },
            {
              "x": 198,
              "y": 0.004180684690302434,
              "label": "epoch 198"
            },
            {
              "x": 199,
              "y": 0.004190670314097875,
              "label": "epoch 199"
            },
            {
              "x": 200,
              "y": 0.0041872254483965475,
              "label": "epoch 200"
            },
            {
              "x": 201,
              "y": 0.00418214234454545,
              "label": "epoch 201"
            },
            {
              "x": 202,
              "y": 0.0042127618737714855,
              "label": "epoch 202"
            },
            {
              "x": 203,
              "y": 0.004227269406424296,
              "label": "epoch 203"
            },
            {
              "x": 204,
              "y": 0.00419626639823515,
              "label": "epoch 204"
            },
            {
              "x": 205,
              "y": 0.004161614806339219,
              "label": "epoch 205"
            },
            {
              "x": 206,
              "y": 0.0042085723536346405,
              "label": "epoch 206"
            },
            {
              "x": 207,
              "y": 0.004210188845861826,
              "label": "epoch 207"
            },
            {
              "x": 208,
              "y": 0.004237920500408539,
              "label": "epoch 208"
            },
            {
              "x": 209,
              "y": 0.00422785668649196,
              "label": "epoch 209"
            },
            {
              "x": 210,
              "y": 0.004247866564439487,
              "label": "epoch 210"
            },
            {
              "x": 211,
              "y": 0.004200160514109915,
              "label": "epoch 211"
            },
            {
              "x": 212,
              "y": 0.004221242020369238,
              "label": "epoch 212"
            },
            {
              "x": 213,
              "y": 0.004232480439608672,
              "label": "epoch 213"
            },
            {
              "x": 214,
              "y": 0.004222386470677233,
              "label": "epoch 214"
            },
            {
              "x": 215,
              "y": 0.0042307876065024175,
              "label": "epoch 215"
            },
            {
              "x": 216,
              "y": 0.00422854096464825,
              "label": "epoch 216"
            },
            {
              "x": 217,
              "y": 0.004218628842959572,
              "label": "epoch 217"
            },
            {
              "x": 218,
              "y": 0.00423219130990267,
              "label": "epoch 218"
            },
            {
              "x": 219,
              "y": 0.004224247089663741,
              "label": "epoch 219"
            },
            {
              "x": 220,
              "y": 0.004222250664545419,
              "label": "epoch 220"
            },
            {
              "x": 221,
              "y": 0.004230664545167728,
              "label": "epoch 221"
            },
            {
              "x": 222,
              "y": 0.004255098147519962,
              "label": "epoch 222"
            },
            {
              "x": 223,
              "y": 0.0042488111541483945,
              "label": "epoch 223"
            },
            {
              "x": 224,
              "y": 0.004250753680504491,
              "label": "epoch 224"
            },
            {
              "x": 225,
              "y": 0.0042333171490769785,
              "label": "epoch 225"
            },
            {
              "x": 226,
              "y": 0.004220402251935172,
              "label": "epoch 226"
            },
            {
              "x": 227,
              "y": 0.004264263765913998,
              "label": "epoch 227"
            },
            {
              "x": 228,
              "y": 0.004259596651919358,
              "label": "epoch 228"
            },
            {
              "x": 229,
              "y": 0.0042607507826974865,
              "label": "epoch 229"
            },
            {
              "x": 230,
              "y": 0.004248281420778336,
              "label": "epoch 230"
            },
            {
              "x": 231,
              "y": 0.0042798427465114445,
              "label": "epoch 231"
            },
            {
              "x": 232,
              "y": 0.004277767503624905,
              "label": "epoch 232"
            },
            {
              "x": 233,
              "y": 0.004245324599890553,
              "label": "epoch 233"
            },
            {
              "x": 234,
              "y": 0.004279888433398139,
              "label": "epoch 234"
            },
            {
              "x": 235,
              "y": 0.004279493642235665,
              "label": "epoch 235"
            },
            {
              "x": 236,
              "y": 0.004255779253741677,
              "label": "epoch 236"
            },
            {
              "x": 237,
              "y": 0.004251400695801222,
              "label": "epoch 237"
            },
            {
              "x": 238,
              "y": 0.00423671233109321,
              "label": "epoch 238"
            },
            {
              "x": 239,
              "y": 0.004233072863395424,
              "label": "epoch 239"
            },
            {
              "x": 240,
              "y": 0.004222501739844263,
              "label": "epoch 240"
            },
            {
              "x": 241,
              "y": 0.004232538289981771,
              "label": "epoch 241"
            },
            {
              "x": 242,
              "y": 0.00420941131137385,
              "label": "epoch 242"
            },
            {
              "x": 243,
              "y": 0.004233100897660111,
              "label": "epoch 243"
            },
            {
              "x": 244,
              "y": 0.004258738203804425,
              "label": "epoch 244"
            },
            {
              "x": 245,
              "y": 0.0042417058935634005,
              "label": "epoch 245"
            },
            {
              "x": 246,
              "y": 0.0042484963426096855,
              "label": "epoch 246"
            },
            {
              "x": 247,
              "y": 0.004272638045030793,
              "label": "epoch 247"
            },
            {
              "x": 248,
              "y": 0.004280111226283847,
              "label": "epoch 248"
            },
            {
              "x": 249,
              "y": 0.004257520521748934,
              "label": "epoch 249"
            },
            {
              "x": 250,
              "y": 0.004265525237745973,
              "label": "epoch 250"
            },
            {
              "x": 251,
              "y": 0.004282134371782089,
              "label": "epoch 251"
            },
            {
              "x": 252,
              "y": 0.004279293850949647,
              "label": "epoch 252"
            },
            {
              "x": 253,
              "y": 0.004260501178290916,
              "label": "epoch 253"
            },
            {
              "x": 254,
              "y": 0.004268603864674285,
              "label": "epoch 254"
            },
            {
              "x": 255,
              "y": 0.004283138506396331,
              "label": "epoch 255"
            },
            {
              "x": 256,
              "y": 0.004260290890478676,
              "label": "epoch 256"
            },
            {
              "x": 257,
              "y": 0.004248455718640655,
              "label": "epoch 257"
            },
            {
              "x": 258,
              "y": 0.004281669405923151,
              "label": "epoch 258"
            },
            {
              "x": 259,
              "y": 0.004247190798387716,
              "label": "epoch 259"
            },
            {
              "x": 260,
              "y": 0.004242549196964032,
              "label": "epoch 260"
            },
            {
              "x": 261,
              "y": 0.004259911334788501,
              "label": "epoch 261"
            },
            {
              "x": 262,
              "y": 0.004252565326169133,
              "label": "epoch 262"
            },
            {
              "x": 263,
              "y": 0.0042351610827608965,
              "label": "epoch 263"
            },
            {
              "x": 264,
              "y": 0.004230348342389334,
              "label": "epoch 264"
            },
            {
              "x": 265,
              "y": 0.0042455369770514634,
              "label": "epoch 265"
            },
            {
              "x": 266,
              "y": 0.0042322122811272395,
              "label": "epoch 266"
            },
            {
              "x": 267,
              "y": 0.004257977702333224,
              "label": "epoch 267"
            }
          ]
        },
        {
          "name": "mse_rot6d",
          "color": "#a27a32",
          "points": [
            {
              "x": 1,
              "y": 2.7409903752176383,
              "label": "epoch 1"
            },
            {
              "x": 2,
              "y": 2.5666570475226953,
              "label": "epoch 2"
            },
            {
              "x": 3,
              "y": 2.3751048037880347,
              "label": "epoch 3"
            },
            {
              "x": 4,
              "y": 2.1733574522169015,
              "label": "epoch 4"
            },
            {
              "x": 5,
              "y": 1.9566013060118024,
              "label": "epoch 5"
            },
            {
              "x": 6,
              "y": 1.7233132249430607,
              "label": "epoch 6"
            },
            {
              "x": 7,
              "y": 1.489056292333101,
              "label": "epoch 7"
            },
            {
              "x": 8,
              "y": 1.245927465589423,
              "label": "epoch 8"
            },
            {
              "x": 9,
              "y": 1.0213636724572432,
              "label": "epoch 9"
            },
            {
              "x": 10,
              "y": 0.8078540077334956,
              "label": "epoch 10"
            },
            {
              "x": 11,
              "y": 0.6319769856176878,
              "label": "epoch 11"
            },
            {
              "x": 12,
              "y": 0.4898300014044109,
              "label": "epoch 12"
            },
            {
              "x": 13,
              "y": 0.38687128259947423,
              "label": "epoch 13"
            },
            {
              "x": 14,
              "y": 0.32426224531311737,
              "label": "epoch 14"
            },
            {
              "x": 15,
              "y": 0.2826756670286781,
              "label": "epoch 15"
            },
            {
              "x": 16,
              "y": 0.25223379072390106,
              "label": "epoch 16"
            },
            {
              "x": 17,
              "y": 0.2247446469570461,
              "label": "epoch 17"
            },
            {
              "x": 18,
              "y": 0.20351659153637133,
              "label": "epoch 18"
            },
            {
              "x": 19,
              "y": 0.18706458307018406,
              "label": "epoch 19"
            },
            {
              "x": 20,
              "y": 0.16987472968666176,
              "label": "epoch 20"
            },
            {
              "x": 21,
              "y": 0.15870819721174867,
              "label": "epoch 21"
            },
            {
              "x": 22,
              "y": 0.14677211603051737,
              "label": "epoch 22"
            },
            {
              "x": 23,
              "y": 0.13678506095158427,
              "label": "epoch 23"
            },
            {
              "x": 24,
              "y": 0.12644832385213753,
              "label": "epoch 24"
            },
            {
              "x": 25,
              "y": 0.11938568979109589,
              "label": "epoch 25"
            },
            {
              "x": 26,
              "y": 0.11186598099179958,
              "label": "epoch 26"
            },
            {
              "x": 27,
              "y": 0.10566720332166082,
              "label": "epoch 27"
            },
            {
              "x": 28,
              "y": 0.10185090771042987,
              "label": "epoch 28"
            },
            {
              "x": 29,
              "y": 0.09783568983211328,
              "label": "epoch 29"
            },
            {
              "x": 30,
              "y": 0.09336210463784243,
              "label": "epoch 30"
            },
            {
              "x": 31,
              "y": 0.09043870280545793,
              "label": "epoch 31"
            },
            {
              "x": 32,
              "y": 0.0884877370278302,
              "label": "epoch 32"
            },
            {
              "x": 33,
              "y": 0.08323197628028299,
              "label": "epoch 33"
            },
            {
              "x": 34,
              "y": 0.08187411889727962,
              "label": "epoch 34"
            },
            {
              "x": 35,
              "y": 0.08077180471369311,
              "label": "epoch 35"
            },
            {
              "x": 36,
              "y": 0.07915749998861238,
              "label": "epoch 36"
            },
            {
              "x": 37,
              "y": 0.0760609887319764,
              "label": "epoch 37"
            },
            {
              "x": 38,
              "y": 0.07536414976378805,
              "label": "epoch 38"
            },
            {
              "x": 39,
              "y": 0.07308935693857309,
              "label": "epoch 39"
            },
            {
              "x": 40,
              "y": 0.07237338003285818,
              "label": "epoch 40"
            },
            {
              "x": 41,
              "y": 0.07177512640574653,
              "label": "epoch 41"
            },
            {
              "x": 42,
              "y": 0.06966665786641993,
              "label": "epoch 42"
            },
            {
              "x": 43,
              "y": 0.07002149054192398,
              "label": "epoch 43"
            },
            {
              "x": 44,
              "y": 0.06876870581120449,
              "label": "epoch 44"
            },
            {
              "x": 45,
              "y": 0.06731060309041488,
              "label": "epoch 45"
            },
            {
              "x": 46,
              "y": 0.06738850434531311,
              "label": "epoch 46"
            },
            {
              "x": 47,
              "y": 0.06613853482505012,
              "label": "epoch 47"
            },
            {
              "x": 48,
              "y": 0.06633262190428611,
              "label": "epoch 48"
            },
            {
              "x": 49,
              "y": 0.06605781101327586,
              "label": "epoch 49"
            },
            {
              "x": 50,
              "y": 0.06479189290640582,
              "label": "epoch 50"
            },
            {
              "x": 51,
              "y": 0.06582704274057362,
              "label": "epoch 51"
            },
            {
              "x": 52,
              "y": 0.06481677855328216,
              "label": "epoch 52"
            },
            {
              "x": 53,
              "y": 0.06414655923818875,
              "label": "epoch 53"
            },
            {
              "x": 54,
              "y": 0.06426745553893086,
              "label": "epoch 54"
            },
            {
              "x": 55,
              "y": 0.06344931813471608,
              "label": "epoch 55"
            },
            {
              "x": 56,
              "y": 0.06409532936921,
              "label": "epoch 56"
            },
            {
              "x": 57,
              "y": 0.06360066248300045,
              "label": "epoch 57"
            },
            {
              "x": 58,
              "y": 0.06369035874530182,
              "label": "epoch 58"
            },
            {
              "x": 59,
              "y": 0.0628169459209618,
              "label": "epoch 59"
            },
            {
              "x": 60,
              "y": 0.06329000119034103,
              "label": "epoch 60"
            },
            {
              "x": 61,
              "y": 0.06288087434950285,
              "label": "epoch 61"
            },
            {
              "x": 62,
              "y": 0.06334117605690967,
              "label": "epoch 62"
            },
            {
              "x": 63,
              "y": 0.06294963267627234,
              "label": "epoch 63"
            },
            {
              "x": 64,
              "y": 0.06302682858528753,
              "label": "epoch 64"
            },
            {
              "x": 65,
              "y": 0.06315603543962904,
              "label": "epoch 65"
            },
            {
              "x": 66,
              "y": 0.06263279437629726,
              "label": "epoch 66"
            },
            {
              "x": 67,
              "y": 0.0629911063186132,
              "label": "epoch 67"
            },
            {
              "x": 68,
              "y": 0.06297999959497247,
              "label": "epoch 68"
            },
            {
              "x": 69,
              "y": 0.06235811635097458,
              "label": "epoch 69"
            },
            {
              "x": 70,
              "y": 0.06231174786042079,
              "label": "epoch 70"
            },
            {
              "x": 71,
              "y": 0.062423583302389535,
              "label": "epoch 71"
            },
            {
              "x": 72,
              "y": 0.06249021677304929,
              "label": "epoch 72"
            },
            {
              "x": 73,
              "y": 0.06230618189798215,
              "label": "epoch 73"
            },
            {
              "x": 74,
              "y": 0.06259901893760175,
              "label": "epoch 74"
            },
            {
              "x": 75,
              "y": 0.06293253630467102,
              "label": "epoch 75"
            },
            {
              "x": 76,
              "y": 0.06244447696065579,
              "label": "epoch 76"
            },
            {
              "x": 77,
              "y": 0.06278092406443504,
              "label": "epoch 77"
            },
            {
              "x": 78,
              "y": 0.06281465946659937,
              "label": "epoch 78"
            },
            {
              "x": 79,
              "y": 0.062253210886985086,
              "label": "epoch 79"
            },
            {
              "x": 80,
              "y": 0.06219907655376071,
              "label": "epoch 80"
            },
            {
              "x": 81,
              "y": 0.06228825946470208,
              "label": "epoch 81"
            },
            {
              "x": 82,
              "y": 0.062214572198603206,
              "label": "epoch 82"
            },
            {
              "x": 83,
              "y": 0.06253719197334967,
              "label": "epoch 83"
            },
            {
              "x": 84,
              "y": 0.06240786273586931,
              "label": "epoch 84"
            },
            {
              "x": 85,
              "y": 0.06196306048322616,
              "label": "epoch 85"
            },
            {
              "x": 86,
              "y": 0.06208856254402475,
              "label": "epoch 86"
            },
            {
              "x": 87,
              "y": 0.06217620579187305,
              "label": "epoch 87"
            },
            {
              "x": 88,
              "y": 0.062028702883445044,
              "label": "epoch 88"
            },
            {
              "x": 89,
              "y": 0.06198277327233594,
              "label": "epoch 89"
            },
            {
              "x": 90,
              "y": 0.06213001384840984,
              "label": "epoch 90"
            },
            {
              "x": 91,
              "y": 0.06220718617834408,
              "label": "epoch 91"
            },
            {
              "x": 92,
              "y": 0.06211706198519096,
              "label": "epoch 92"
            },
            {
              "x": 93,
              "y": 0.06232635440813426,
              "label": "epoch 93"
            },
            {
              "x": 94,
              "y": 0.062247139944750084,
              "label": "epoch 94"
            },
            {
              "x": 95,
              "y": 0.06219361183665521,
              "label": "epoch 95"
            },
            {
              "x": 96,
              "y": 0.06212384345972647,
              "label": "epoch 96"
            },
            {
              "x": 97,
              "y": 0.06223988661919353,
              "label": "epoch 97"
            },
            {
              "x": 98,
              "y": 0.06228032487936281,
              "label": "epoch 98"
            },
            {
              "x": 99,
              "y": 0.0621755134144271,
              "label": "epoch 99"
            },
            {
              "x": 101,
              "y": 0.06210285011950059,
              "label": "epoch 101"
            },
            {
              "x": 102,
              "y": 0.06236065802276196,
              "label": "epoch 102"
            },
            {
              "x": 103,
              "y": 0.06252211414654371,
              "label": "epoch 103"
            },
            {
              "x": 104,
              "y": 0.06241966302714948,
              "label": "epoch 104"
            },
            {
              "x": 105,
              "y": 0.06241219246409233,
              "label": "epoch 105"
            },
            {
              "x": 106,
              "y": 0.06246648866401397,
              "label": "epoch 106"
            },
            {
              "x": 107,
              "y": 0.06249377415990334,
              "label": "epoch 107"
            },
            {
              "x": 108,
              "y": 0.06258159366284656,
              "label": "epoch 108"
            },
            {
              "x": 109,
              "y": 0.06266769533249317,
              "label": "epoch 109"
            },
            {
              "x": 110,
              "y": 0.0625577525819321,
              "label": "epoch 110"
            },
            {
              "x": 111,
              "y": 0.0626631192748104,
              "label": "epoch 111"
            },
            {
              "x": 112,
              "y": 0.06294701227039025,
              "label": "epoch 112"
            },
            {
              "x": 113,
              "y": 0.0627122884600938,
              "label": "epoch 113"
            },
            {
              "x": 114,
              "y": 0.06267774242013202,
              "label": "epoch 114"
            },
            {
              "x": 115,
              "y": 0.06284046519622759,
              "label": "epoch 115"
            },
            {
              "x": 116,
              "y": 0.06266348359119882,
              "label": "epoch 116"
            },
            {
              "x": 117,
              "y": 0.06259844393092576,
              "label": "epoch 117"
            },
            {
              "x": 118,
              "y": 0.06260422411249142,
              "label": "epoch 118"
            },
            {
              "x": 119,
              "y": 0.06255025064609454,
              "label": "epoch 119"
            },
            {
              "x": 120,
              "y": 0.06251516480436917,
              "label": "epoch 120"
            },
            {
              "x": 121,
              "y": 0.06264264806745096,
              "label": "epoch 121"
            },
            {
              "x": 122,
              "y": 0.06256580609241562,
              "label": "epoch 122"
            },
            {
              "x": 123,
              "y": 0.0626231850435847,
              "label": "epoch 123"
            },
            {
              "x": 124,
              "y": 0.06263634170969262,
              "label": "epoch 124"
            },
            {
              "x": 125,
              "y": 0.06263881569382072,
              "label": "epoch 125"
            },
            {
              "x": 126,
              "y": 0.06266112006529798,
              "label": "epoch 126"
            },
            {
              "x": 127,
              "y": 0.06302917993161827,
              "label": "epoch 127"
            },
            {
              "x": 128,
              "y": 0.06267317065526425,
              "label": "epoch 128"
            },
            {
              "x": 129,
              "y": 0.06264129925310906,
              "label": "epoch 129"
            },
            {
              "x": 130,
              "y": 0.06279027960447006,
              "label": "epoch 130"
            },
            {
              "x": 131,
              "y": 0.06265526508727098,
              "label": "epoch 131"
            },
            {
              "x": 132,
              "y": 0.06270793491344911,
              "label": "epoch 132"
            },
            {
              "x": 133,
              "y": 0.0628309728214701,
              "label": "epoch 133"
            },
            {
              "x": 134,
              "y": 0.06269153324645135,
              "label": "epoch 134"
            },
            {
              "x": 135,
              "y": 0.06286228946210988,
              "label": "epoch 135"
            },
            {
              "x": 136,
              "y": 0.06299887992607087,
              "label": "epoch 136"
            },
            {
              "x": 137,
              "y": 0.06271915833732285,
              "label": "epoch 137"
            },
            {
              "x": 138,
              "y": 0.06262921764688431,
              "label": "epoch 138"
            },
            {
              "x": 139,
              "y": 0.06247316725976385,
              "label": "epoch 139"
            },
            {
              "x": 140,
              "y": 0.06258972116598957,
              "label": "epoch 140"
            },
            {
              "x": 141,
              "y": 0.06260536147486787,
              "label": "epoch 141"
            },
            {
              "x": 142,
              "y": 0.06260222297293551,
              "label": "epoch 142"
            },
            {
              "x": 143,
              "y": 0.06254984707208534,
              "label": "epoch 143"
            },
            {
              "x": 144,
              "y": 0.06262265607265842,
              "label": "epoch 144"
            },
            {
              "x": 145,
              "y": 0.06255760390960954,
              "label": "epoch 145"
            },
            {
              "x": 146,
              "y": 0.06245136250838282,
              "label": "epoch 146"
            },
            {
              "x": 147,
              "y": 0.06250126214581542,
              "label": "epoch 147"
            },
            {
              "x": 148,
              "y": 0.062468513230621615,
              "label": "epoch 148"
            },
            {
              "x": 149,
              "y": 0.0625675577374702,
              "label": "epoch 149"
            },
            {
              "x": 150,
              "y": 0.06263290156647072,
              "label": "epoch 150"
            },
            {
              "x": 151,
              "y": 0.06253983155903897,
              "label": "epoch 151"
            },
            {
              "x": 152,
              "y": 0.06262172609537006,
              "label": "epoch 152"
            },
            {
              "x": 153,
              "y": 0.0627043994452259,
              "label": "epoch 153"
            },
            {
              "x": 154,
              "y": 0.06261448576390792,
              "label": "epoch 154"
            },
            {
              "x": 155,
              "y": 0.06274170135791217,
              "label": "epoch 155"
            },
            {
              "x": 156,
              "y": 0.06267731110213055,
              "label": "epoch 156"
            },
            {
              "x": 157,
              "y": 0.06270434675082613,
              "label": "epoch 157"
            },
            {
              "x": 158,
              "y": 0.0627138832971564,
              "label": "epoch 158"
            },
            {
              "x": 159,
              "y": 0.06284229285665788,
              "label": "epoch 159"
            },
            {
              "x": 160,
              "y": 0.06273863994321896,
              "label": "epoch 160"
            },
            {
              "x": 161,
              "y": 0.06274733643926754,
              "label": "epoch 161"
            },
            {
              "x": 162,
              "y": 0.06282890300989445,
              "label": "epoch 162"
            },
            {
              "x": 163,
              "y": 0.06286637505974413,
              "label": "epoch 163"
            },
            {
              "x": 164,
              "y": 0.06269152943308368,
              "label": "epoch 164"
            },
            {
              "x": 165,
              "y": 0.06283474042950395,
              "label": "epoch 165"
            },
            {
              "x": 166,
              "y": 0.06284264154428935,
              "label": "epoch 166"
            },
            {
              "x": 167,
              "y": 0.06260609393786198,
              "label": "epoch 167"
            },
            {
              "x": 168,
              "y": 0.06276793797587743,
              "label": "epoch 168"
            },
            {
              "x": 169,
              "y": 0.06276727267820541,
              "label": "epoch 169"
            },
            {
              "x": 170,
              "y": 0.06286229612918473,
              "label": "epoch 170"
            },
            {
              "x": 171,
              "y": 0.06266281551583425,
              "label": "epoch 171"
            },
            {
              "x": 172,
              "y": 0.06274449848110396,
              "label": "epoch 172"
            },
            {
              "x": 173,
              "y": 0.06284024890766504,
              "label": "epoch 173"
            },
            {
              "x": 174,
              "y": 0.06281232047637643,
              "label": "epoch 174"
            },
            {
              "x": 175,
              "y": 0.06286197620188193,
              "label": "epoch 175"
            },
            {
              "x": 176,
              "y": 0.06302162372479583,
              "label": "epoch 176"
            },
            {
              "x": 177,
              "y": 0.06285005593159249,
              "label": "epoch 177"
            },
            {
              "x": 178,
              "y": 0.06281472087338395,
              "label": "epoch 178"
            },
            {
              "x": 179,
              "y": 0.06304739579929064,
              "label": "epoch 179"
            },
            {
              "x": 180,
              "y": 0.06291518543883667,
              "label": "epoch 180"
            },
            {
              "x": 181,
              "y": 0.06285087235109561,
              "label": "epoch 181"
            },
            {
              "x": 182,
              "y": 0.06295078384765045,
              "label": "epoch 182"
            },
            {
              "x": 183,
              "y": 0.06289119983021489,
              "label": "epoch 183"
            },
            {
              "x": 184,
              "y": 0.06289178720984828,
              "label": "epoch 184"
            },
            {
              "x": 185,
              "y": 0.06291843874887011,
              "label": "epoch 185"
            },
            {
              "x": 186,
              "y": 0.06288511900359146,
              "label": "epoch 186"
            },
            {
              "x": 187,
              "y": 0.06286673441890774,
              "label": "epoch 187"
            },
            {
              "x": 188,
              "y": 0.062968168349088,
              "label": "epoch 188"
            },
            {
              "x": 189,
              "y": 0.06293690581189462,
              "label": "epoch 189"
            },
            {
              "x": 190,
              "y": 0.06293178834235541,
              "label": "epoch 190"
            },
            {
              "x": 191,
              "y": 0.06288972300056853,
              "label": "epoch 191"
            },
            {
              "x": 192,
              "y": 0.06288396765625007,
              "label": "epoch 192"
            },
            {
              "x": 193,
              "y": 0.06298308531978891,
              "label": "epoch 193"
            },
            {
              "x": 194,
              "y": 0.06285845843836126,
              "label": "epoch 194"
            },
            {
              "x": 195,
              "y": 0.0628441062837833,
              "label": "epoch 195"
            },
            {
              "x": 196,
              "y": 0.06299074178949875,
              "label": "epoch 196"
            },
            {
              "x": 197,
              "y": 0.06285519711366903,
              "label": "epoch 197"
            },
            {
              "x": 198,
              "y": 0.0628088524995531,
              "label": "epoch 198"
            },
            {
              "x": 199,
              "y": 0.0630050899382791,
              "label": "epoch 199"
            },
            {
              "x": 200,
              "y": 0.06281145138372697,
              "label": "epoch 200"
            },
            {
              "x": 201,
              "y": 0.06273649508396997,
              "label": "epoch 201"
            },
            {
              "x": 202,
              "y": 0.06285635726511062,
              "label": "epoch 202"
            },
            {
              "x": 203,
              "y": 0.06286672619879889,
              "label": "epoch 203"
            },
            {
              "x": 204,
              "y": 0.06287855126203412,
              "label": "epoch 204"
            },
            {
              "x": 205,
              "y": 0.06277856116426656,
              "label": "epoch 205"
            },
            {
              "x": 206,
              "y": 0.06278368241175103,
              "label": "epoch 206"
            },
            {
              "x": 207,
              "y": 0.0628685424691005,
              "label": "epoch 207"
            },
            {
              "x": 208,
              "y": 0.06277324439112195,
              "label": "epoch 208"
            },
            {
              "x": 209,
              "y": 0.06277357675093012,
              "label": "epoch 209"
            },
            {
              "x": 210,
              "y": 0.06281501943177366,
              "label": "epoch 210"
            },
            {
              "x": 211,
              "y": 0.06274462981941485,
              "label": "epoch 211"
            },
            {
              "x": 212,
              "y": 0.06289435700014828,
              "label": "epoch 212"
            },
            {
              "x": 213,
              "y": 0.06284394628049708,
              "label": "epoch 213"
            },
            {
              "x": 214,
              "y": 0.06282649570896051,
              "label": "epoch 214"
            },
            {
              "x": 215,
              "y": 0.06287811399976674,
              "label": "epoch 215"
            },
            {
              "x": 216,
              "y": 0.06282095429196488,
              "label": "epoch 216"
            },
            {
              "x": 217,
              "y": 0.0628216057362136,
              "label": "epoch 217"
            },
            {
              "x": 218,
              "y": 0.0628163504556333,
              "label": "epoch 218"
            },
            {
              "x": 219,
              "y": 0.0629417007801653,
              "label": "epoch 219"
            },
            {
              "x": 220,
              "y": 0.06293713152014166,
              "label": "epoch 220"
            },
            {
              "x": 221,
              "y": 0.06290938034822159,
              "label": "epoch 221"
            },
            {
              "x": 222,
              "y": 0.06295780072411473,
              "label": "epoch 222"
            },
            {
              "x": 223,
              "y": 0.0631568399097121,
              "label": "epoch 223"
            },
            {
              "x": 224,
              "y": 0.06319213898696992,
              "label": "epoch 224"
            },
            {
              "x": 225,
              "y": 0.06302572590701809,
              "label": "epoch 225"
            },
            {
              "x": 226,
              "y": 0.06316142354204969,
              "label": "epoch 226"
            },
            {
              "x": 227,
              "y": 0.0630703955122092,
              "label": "epoch 227"
            },
            {
              "x": 228,
              "y": 0.06311230109598623,
              "label": "epoch 228"
            },
            {
              "x": 229,
              "y": 0.06302237752740773,
              "label": "epoch 229"
            },
            {
              "x": 230,
              "y": 0.06315678591406475,
              "label": "epoch 230"
            },
            {
              "x": 231,
              "y": 0.06311207347684294,
              "label": "epoch 231"
            },
            {
              "x": 232,
              "y": 0.06314582060689358,
              "label": "epoch 232"
            },
            {
              "x": 233,
              "y": 0.0631488154013871,
              "label": "epoch 233"
            },
            {
              "x": 234,
              "y": 0.06310810153579376,
              "label": "epoch 234"
            },
            {
              "x": 235,
              "y": 0.06308562314753592,
              "label": "epoch 235"
            },
            {
              "x": 236,
              "y": 0.06310136805251731,
              "label": "epoch 236"
            },
            {
              "x": 237,
              "y": 0.06302486001636441,
              "label": "epoch 237"
            },
            {
              "x": 238,
              "y": 0.06312915639941102,
              "label": "epoch 238"
            },
            {
              "x": 239,
              "y": 0.06316059458990103,
              "label": "epoch 239"
            },
            {
              "x": 240,
              "y": 0.06307512034139731,
              "label": "epoch 240"
            },
            {
              "x": 241,
              "y": 0.06316851354705777,
              "label": "epoch 241"
            },
            {
              "x": 242,
              "y": 0.06325834868824275,
              "label": "epoch 242"
            },
            {
              "x": 243,
              "y": 0.06330840749280087,
              "label": "epoch 243"
            },
            {
              "x": 244,
              "y": 0.06331754567853702,
              "label": "epoch 244"
            },
            {
              "x": 245,
              "y": 0.06326025489589053,
              "label": "epoch 245"
            },
            {
              "x": 246,
              "y": 0.06331716120870337,
              "label": "epoch 246"
            },
            {
              "x": 247,
              "y": 0.06326130902839634,
              "label": "epoch 247"
            },
            {
              "x": 248,
              "y": 0.06337993934300214,
              "label": "epoch 248"
            },
            {
              "x": 249,
              "y": 0.06340112143669485,
              "label": "epoch 249"
            },
            {
              "x": 250,
              "y": 0.06339071124736954,
              "label": "epoch 250"
            },
            {
              "x": 251,
              "y": 0.06355738499290678,
              "label": "epoch 251"
            },
            {
              "x": 252,
              "y": 0.06341790345935519,
              "label": "epoch 252"
            },
            {
              "x": 253,
              "y": 0.06345577435039511,
              "label": "epoch 253"
            },
            {
              "x": 254,
              "y": 0.06354248935914304,
              "label": "epoch 254"
            },
            {
              "x": 255,
              "y": 0.06352986433500375,
              "label": "epoch 255"
            },
            {
              "x": 256,
              "y": 0.06345446436056304,
              "label": "epoch 256"
            },
            {
              "x": 257,
              "y": 0.06357440541385011,
              "label": "epoch 257"
            },
            {
              "x": 258,
              "y": 0.06352187240286424,
              "label": "epoch 258"
            },
            {
              "x": 259,
              "y": 0.06354541876154192,
              "label": "epoch 259"
            },
            {
              "x": 260,
              "y": 0.06352355037999682,
              "label": "epoch 260"
            },
            {
              "x": 261,
              "y": 0.06352358832143516,
              "label": "epoch 261"
            },
            {
              "x": 262,
              "y": 0.06348845330610761,
              "label": "epoch 262"
            },
            {
              "x": 263,
              "y": 0.06349218621720579,
              "label": "epoch 263"
            },
            {
              "x": 264,
              "y": 0.06350471379655094,
              "label": "epoch 264"
            },
            {
              "x": 265,
              "y": 0.06349792189384491,
              "label": "epoch 265"
            },
            {
              "x": 266,
              "y": 0.0635577277379956,
              "label": "epoch 266"
            },
            {
              "x": 267,
              "y": 0.0635712822190008,
              "label": "epoch 267"
            }
          ]
        },
        {
          "name": "mse_grip",
          "color": "#d4684c",
          "points": [
            {
              "x": 1,
              "y": 3.7504225090930334,
              "label": "epoch 1"
            },
            {
              "x": 2,
              "y": 3.380906004654734,
              "label": "epoch 2"
            },
            {
              "x": 3,
              "y": 3.0685699080166065,
              "label": "epoch 3"
            },
            {
              "x": 4,
              "y": 2.719399514951204,
              "label": "epoch 4"
            },
            {
              "x": 5,
              "y": 2.402141982003262,
              "label": "epoch 5"
            },
            {
              "x": 6,
              "y": 2.0762193485310205,
              "label": "epoch 6"
            },
            {
              "x": 7,
              "y": 1.773995019887623,
              "label": "epoch 7"
            },
            {
              "x": 8,
              "y": 1.471770288128602,
              "label": "epoch 8"
            },
            {
              "x": 9,
              "y": 1.1795851509822042,
              "label": "epoch 9"
            },
            {
              "x": 10,
              "y": 0.9404202331053583,
              "label": "epoch 10"
            },
            {
              "x": 11,
              "y": 0.7337585405299538,
              "label": "epoch 11"
            },
            {
              "x": 12,
              "y": 0.5689433930735839,
              "label": "epoch 12"
            },
            {
              "x": 13,
              "y": 0.4377611852005908,
              "label": "epoch 13"
            },
            {
              "x": 14,
              "y": 0.3462214375797071,
              "label": "epoch 14"
            },
            {
              "x": 15,
              "y": 0.29069930393444865,
              "label": "epoch 15"
            },
            {
              "x": 16,
              "y": 0.2439543812682754,
              "label": "epoch 16"
            },
            {
              "x": 17,
              "y": 0.21205631506286168,
              "label": "epoch 17"
            },
            {
              "x": 18,
              "y": 0.18779645232777847,
              "label": "epoch 18"
            },
            {
              "x": 19,
              "y": 0.17181535829838954,
              "label": "epoch 19"
            },
            {
              "x": 20,
              "y": 0.16046468697880445,
              "label": "epoch 20"
            },
            {
              "x": 21,
              "y": 0.1490391418337822,
              "label": "epoch 21"
            },
            {
              "x": 22,
              "y": 0.14234506044732897,
              "label": "epoch 22"
            },
            {
              "x": 23,
              "y": 0.1339341712821471,
              "label": "epoch 23"
            },
            {
              "x": 24,
              "y": 0.1262841082521175,
              "label": "epoch 24"
            },
            {
              "x": 25,
              "y": 0.12164650117292215,
              "label": "epoch 25"
            },
            {
              "x": 26,
              "y": 0.11704820325892222,
              "label": "epoch 26"
            },
            {
              "x": 27,
              "y": 0.11451350789713233,
              "label": "epoch 27"
            },
            {
              "x": 28,
              "y": 0.11336457273481708,
              "label": "epoch 28"
            },
            {
              "x": 29,
              "y": 0.11313370527013351,
              "label": "epoch 29"
            },
            {
              "x": 30,
              "y": 0.10979392761854749,
              "label": "epoch 30"
            },
            {
              "x": 31,
              "y": 0.10863429386364787,
              "label": "epoch 31"
            },
            {
              "x": 32,
              "y": 0.10651294965493052,
              "label": "epoch 32"
            },
            {
              "x": 33,
              "y": 0.10392316830295481,
              "label": "epoch 33"
            },
            {
              "x": 34,
              "y": 0.10181554034352303,
              "label": "epoch 34"
            },
            {
              "x": 35,
              "y": 0.09969086050497074,
              "label": "epoch 35"
            },
            {
              "x": 36,
              "y": 0.09652716543917593,
              "label": "epoch 36"
            },
            {
              "x": 37,
              "y": 0.09681022900009625,
              "label": "epoch 37"
            },
            {
              "x": 38,
              "y": 0.0947621486786949,
              "label": "epoch 38"
            },
            {
              "x": 39,
              "y": 0.09318500044020384,
              "label": "epoch 39"
            },
            {
              "x": 40,
              "y": 0.09109779268405155,
              "label": "epoch 40"
            },
            {
              "x": 41,
              "y": 0.08878510858324405,
              "label": "epoch 41"
            },
            {
              "x": 42,
              "y": 0.08669361456199304,
              "label": "epoch 42"
            },
            {
              "x": 43,
              "y": 0.08374631800688803,
              "label": "epoch 43"
            },
            {
              "x": 44,
              "y": 0.0842483579548762,
              "label": "epoch 44"
            },
            {
              "x": 45,
              "y": 0.0828981302972687,
              "label": "epoch 45"
            },
            {
              "x": 46,
              "y": 0.07921952659901428,
              "label": "epoch 46"
            },
            {
              "x": 47,
              "y": 0.0787276571592022,
              "label": "epoch 47"
            },
            {
              "x": 48,
              "y": 0.07802002385601793,
              "label": "epoch 48"
            },
            {
              "x": 49,
              "y": 0.07677876392354895,
              "label": "epoch 49"
            },
            {
              "x": 50,
              "y": 0.07570289656225788,
              "label": "epoch 50"
            },
            {
              "x": 51,
              "y": 0.07576127006598797,
              "label": "epoch 51"
            },
            {
              "x": 52,
              "y": 0.07417060969716036,
              "label": "epoch 52"
            },
            {
              "x": 53,
              "y": 0.07410230489423204,
              "label": "epoch 53"
            },
            {
              "x": 54,
              "y": 0.07243682764850459,
              "label": "epoch 54"
            },
            {
              "x": 55,
              "y": 0.07146770257110659,
              "label": "epoch 55"
            },
            {
              "x": 56,
              "y": 0.0713312683908857,
              "label": "epoch 56"
            },
            {
              "x": 57,
              "y": 0.07080770576201183,
              "label": "epoch 57"
            },
            {
              "x": 58,
              "y": 0.0706150604130112,
              "label": "epoch 58"
            },
            {
              "x": 59,
              "y": 0.06968357665525553,
              "label": "epoch 59"
            },
            {
              "x": 60,
              "y": 0.0692797738960699,
              "label": "epoch 60"
            },
            {
              "x": 61,
              "y": 0.06881885055918247,
              "label": "epoch 61"
            },
            {
              "x": 62,
              "y": 0.06842352920916471,
              "label": "epoch 62"
            },
            {
              "x": 63,
              "y": 0.06774041192042396,
              "label": "epoch 63"
            },
            {
              "x": 64,
              "y": 0.06743468054705054,
              "label": "epoch 64"
            },
            {
              "x": 65,
              "y": 0.06811333899263684,
              "label": "epoch 65"
            },
            {
              "x": 66,
              "y": 0.06676716949809097,
              "label": "epoch 66"
            },
            {
              "x": 67,
              "y": 0.06684204702507582,
              "label": "epoch 67"
            },
            {
              "x": 68,
              "y": 0.06704645443670942,
              "label": "epoch 68"
            },
            {
              "x": 69,
              "y": 0.066546071594195,
              "label": "epoch 69"
            },
            {
              "x": 70,
              "y": 0.06663110000724708,
              "label": "epoch 70"
            },
            {
              "x": 71,
              "y": 0.06623286688332691,
              "label": "epoch 71"
            },
            {
              "x": 72,
              "y": 0.06578480062422673,
              "label": "epoch 72"
            },
            {
              "x": 73,
              "y": 0.06500646425296222,
              "label": "epoch 73"
            },
            {
              "x": 74,
              "y": 0.06463295554414417,
              "label": "epoch 74"
            },
            {
              "x": 75,
              "y": 0.06526252485185212,
              "label": "epoch 75"
            },
            {
              "x": 76,
              "y": 0.06556556572468253,
              "label": "epoch 76"
            },
            {
              "x": 77,
              "y": 0.06537130733608808,
              "label": "epoch 77"
            },
            {
              "x": 78,
              "y": 0.06510834544889421,
              "label": "epoch 78"
            },
            {
              "x": 79,
              "y": 0.06454975505192506,
              "label": "epoch 79"
            },
            {
              "x": 80,
              "y": 0.06508619457255056,
              "label": "epoch 80"
            },
            {
              "x": 81,
              "y": 0.06454230913445108,
              "label": "epoch 81"
            },
            {
              "x": 82,
              "y": 0.06456449551957408,
              "label": "epoch 82"
            },
            {
              "x": 83,
              "y": 0.06457928817402908,
              "label": "epoch 83"
            },
            {
              "x": 84,
              "y": 0.06413432144664082,
              "label": "epoch 84"
            },
            {
              "x": 85,
              "y": 0.06391258937228965,
              "label": "epoch 85"
            },
            {
              "x": 86,
              "y": 0.06372967158083491,
              "label": "epoch 86"
            },
            {
              "x": 87,
              "y": 0.06403960963268075,
              "label": "epoch 87"
            },
            {
              "x": 88,
              "y": 0.06386637853685036,
              "label": "epoch 88"
            },
            {
              "x": 89,
              "y": 0.0637821692584303,
              "label": "epoch 89"
            },
            {
              "x": 90,
              "y": 0.06374262101766554,
              "label": "epoch 90"
            },
            {
              "x": 91,
              "y": 0.06392371638848042,
              "label": "epoch 91"
            },
            {
              "x": 92,
              "y": 0.0637969054745506,
              "label": "epoch 92"
            },
            {
              "x": 93,
              "y": 0.06410185022258175,
              "label": "epoch 93"
            },
            {
              "x": 94,
              "y": 0.06339065777516034,
              "label": "epoch 94"
            },
            {
              "x": 95,
              "y": 0.06400194542567605,
              "label": "epoch 95"
            },
            {
              "x": 96,
              "y": 0.0635626536974374,
              "label": "epoch 96"
            },
            {
              "x": 97,
              "y": 0.0636380003131523,
              "label": "epoch 97"
            },
            {
              "x": 98,
              "y": 0.06358996952715906,
              "label": "epoch 98"
            },
            {
              "x": 99,
              "y": 0.06372388746985723,
              "label": "epoch 99"
            },
            {
              "x": 101,
              "y": 0.06380008045526235,
              "label": "epoch 101"
            },
            {
              "x": 102,
              "y": 0.06392417499812023,
              "label": "epoch 102"
            },
            {
              "x": 103,
              "y": 0.06298543685629977,
              "label": "epoch 103"
            },
            {
              "x": 104,
              "y": 0.06399049852528774,
              "label": "epoch 104"
            },
            {
              "x": 105,
              "y": 0.06329301879231695,
              "label": "epoch 105"
            },
            {
              "x": 106,
              "y": 0.06367151399954789,
              "label": "epoch 106"
            },
            {
              "x": 107,
              "y": 0.0635199046738116,
              "label": "epoch 107"
            },
            {
              "x": 108,
              "y": 0.06367644859078848,
              "label": "epoch 108"
            },
            {
              "x": 109,
              "y": 0.06334590226864939,
              "label": "epoch 109"
            },
            {
              "x": 110,
              "y": 0.06335501135373833,
              "label": "epoch 110"
            },
            {
              "x": 111,
              "y": 0.06353532478851776,
              "label": "epoch 111"
            },
            {
              "x": 112,
              "y": 0.06302678495780799,
              "label": "epoch 112"
            },
            {
              "x": 113,
              "y": 0.06393607030415631,
              "label": "epoch 113"
            },
            {
              "x": 114,
              "y": 0.06353972087289979,
              "label": "epoch 114"
            },
            {
              "x": 115,
              "y": 0.06389941271506634,
              "label": "epoch 115"
            },
            {
              "x": 116,
              "y": 0.0630777429608459,
              "label": "epoch 116"
            },
            {
              "x": 117,
              "y": 0.06425533026985202,
              "label": "epoch 117"
            },
            {
              "x": 118,
              "y": 0.06354442855260793,
              "label": "epoch 118"
            },
            {
              "x": 119,
              "y": 0.06374599648092714,
              "label": "epoch 119"
            },
            {
              "x": 120,
              "y": 0.06367949006135189,
              "label": "epoch 120"
            },
            {
              "x": 121,
              "y": 0.06369252304399484,
              "label": "epoch 121"
            },
            {
              "x": 122,
              "y": 0.06329622047187992,
              "label": "epoch 122"
            },
            {
              "x": 123,
              "y": 0.06360438490197626,
              "label": "epoch 123"
            },
            {
              "x": 124,
              "y": 0.06413217837512332,
              "label": "epoch 124"
            },
            {
              "x": 125,
              "y": 0.06386413476820962,
              "label": "epoch 125"
            },
            {
              "x": 126,
              "y": 0.06376940064398552,
              "label": "epoch 126"
            },
            {
              "x": 127,
              "y": 0.06375903397671018,
              "label": "epoch 127"
            },
            {
              "x": 128,
              "y": 0.06408639880024375,
              "label": "epoch 128"
            },
            {
              "x": 129,
              "y": 0.06399611304749142,
              "label": "epoch 129"
            },
            {
              "x": 130,
              "y": 0.06416126254825222,
              "label": "epoch 130"
            },
            {
              "x": 131,
              "y": 0.06409878097396789,
              "label": "epoch 131"
            },
            {
              "x": 132,
              "y": 0.06392284023413115,
              "label": "epoch 132"
            },
            {
              "x": 133,
              "y": 0.06367473379142259,
              "label": "epoch 133"
            },
            {
              "x": 134,
              "y": 0.0644013464900701,
              "label": "epoch 134"
            },
            {
              "x": 135,
              "y": 0.06403324824562237,
              "label": "epoch 135"
            },
            {
              "x": 136,
              "y": 0.0643861257739158,
              "label": "epoch 136"
            },
            {
              "x": 137,
              "y": 0.06462703162225425,
              "label": "epoch 137"
            },
            {
              "x": 138,
              "y": 0.06437872865628953,
              "label": "epoch 138"
            },
            {
              "x": 139,
              "y": 0.06378408902719457,
              "label": "epoch 139"
            },
            {
              "x": 140,
              "y": 0.06413614038352104,
              "label": "epoch 140"
            },
            {
              "x": 141,
              "y": 0.06436939512121553,
              "label": "epoch 141"
            },
            {
              "x": 142,
              "y": 0.06425005389969317,
              "label": "epoch 142"
            },
            {
              "x": 143,
              "y": 0.06417495032853462,
              "label": "epoch 143"
            },
            {
              "x": 144,
              "y": 0.06441184432006403,
              "label": "epoch 144"
            },
            {
              "x": 145,
              "y": 0.06413275155096256,
              "label": "epoch 145"
            },
            {
              "x": 146,
              "y": 0.0641998053767781,
              "label": "epoch 146"
            },
            {
              "x": 147,
              "y": 0.06425878120377379,
              "label": "epoch 147"
            },
            {
              "x": 148,
              "y": 0.06423283785668325,
              "label": "epoch 148"
            },
            {
              "x": 149,
              "y": 0.06430598378999189,
              "label": "epoch 149"
            },
            {
              "x": 150,
              "y": 0.06456110384004587,
              "label": "epoch 150"
            },
            {
              "x": 151,
              "y": 0.06467163029557062,
              "label": "epoch 151"
            },
            {
              "x": 152,
              "y": 0.06391601173398062,
              "label": "epoch 152"
            },
            {
              "x": 153,
              "y": 0.06372558185924056,
              "label": "epoch 153"
            },
            {
              "x": 154,
              "y": 0.06388349082075556,
              "label": "epoch 154"
            },
            {
              "x": 155,
              "y": 0.06384754519548981,
              "label": "epoch 155"
            },
            {
              "x": 156,
              "y": 0.06398107717536493,
              "label": "epoch 156"
            },
            {
              "x": 157,
              "y": 0.06383095914823475,
              "label": "epoch 157"
            },
            {
              "x": 158,
              "y": 0.06399081458096134,
              "label": "epoch 158"
            },
            {
              "x": 159,
              "y": 0.06324218365717857,
              "label": "epoch 159"
            },
            {
              "x": 160,
              "y": 0.06430113477522593,
              "label": "epoch 160"
            },
            {
              "x": 161,
              "y": 0.06393138580368654,
              "label": "epoch 161"
            },
            {
              "x": 162,
              "y": 0.06370298745489315,
              "label": "epoch 162"
            },
            {
              "x": 163,
              "y": 0.06445885233649494,
              "label": "epoch 163"
            },
            {
              "x": 164,
              "y": 0.06348228219133632,
              "label": "epoch 164"
            },
            {
              "x": 165,
              "y": 0.06403934930178941,
              "label": "epoch 165"
            },
            {
              "x": 166,
              "y": 0.06439838284371179,
              "label": "epoch 166"
            },
            {
              "x": 167,
              "y": 0.0643016049098031,
              "label": "epoch 167"
            },
            {
              "x": 168,
              "y": 0.0638430677028653,
              "label": "epoch 168"
            },
            {
              "x": 169,
              "y": 0.0641701495852239,
              "label": "epoch 169"
            },
            {
              "x": 170,
              "y": 0.06418625398385445,
              "label": "epoch 170"
            },
            {
              "x": 171,
              "y": 0.06425535450314687,
              "label": "epoch 171"
            },
            {
              "x": 172,
              "y": 0.0644756151110462,
              "label": "epoch 172"
            },
            {
              "x": 173,
              "y": 0.06461476490772168,
              "label": "epoch 173"
            },
            {
              "x": 174,
              "y": 0.06401559411990308,
              "label": "epoch 174"
            },
            {
              "x": 175,
              "y": 0.06454187734773673,
              "label": "epoch 175"
            },
            {
              "x": 176,
              "y": 0.06462814819602308,
              "label": "epoch 176"
            },
            {
              "x": 177,
              "y": 0.06428518207080981,
              "label": "epoch 177"
            },
            {
              "x": 178,
              "y": 0.06445112745275669,
              "label": "epoch 178"
            },
            {
              "x": 179,
              "y": 0.06424080191934416,
              "label": "epoch 179"
            },
            {
              "x": 180,
              "y": 0.06429644029811386,
              "label": "epoch 180"
            },
            {
              "x": 181,
              "y": 0.06477703018118805,
              "label": "epoch 181"
            },
            {
              "x": 182,
              "y": 0.06470299645788576,
              "label": "epoch 182"
            },
            {
              "x": 183,
              "y": 0.06423557048609789,
              "label": "epoch 183"
            },
            {
              "x": 184,
              "y": 0.06482956404935473,
              "label": "epoch 184"
            },
            {
              "x": 185,
              "y": 0.06500351963671248,
              "label": "epoch 185"
            },
            {
              "x": 186,
              "y": 0.06469541945778856,
              "label": "epoch 186"
            },
            {
              "x": 187,
              "y": 0.06453291664302852,
              "label": "epoch 187"
            },
            {
              "x": 188,
              "y": 0.06476657360479676,
              "label": "epoch 188"
            },
            {
              "x": 189,
              "y": 0.06430222597320703,
              "label": "epoch 189"
            },
            {
              "x": 190,
              "y": 0.06501956560597184,
              "label": "epoch 190"
            },
            {
              "x": 191,
              "y": 0.06485884027519635,
              "label": "epoch 191"
            },
            {
              "x": 192,
              "y": 0.06403660495348767,
              "label": "epoch 192"
            },
            {
              "x": 193,
              "y": 0.06471790075712354,
              "label": "epoch 193"
            },
            {
              "x": 194,
              "y": 0.06462419233485218,
              "label": "epoch 194"
            },
            {
              "x": 195,
              "y": 0.06405285613695205,
              "label": "epoch 195"
            },
            {
              "x": 196,
              "y": 0.06427521635109051,
              "label": "epoch 196"
            },
            {
              "x": 197,
              "y": 0.06421721253729486,
              "label": "epoch 197"
            },
            {
              "x": 198,
              "y": 0.06486139136818804,
              "label": "epoch 198"
            },
            {
              "x": 199,
              "y": 0.06470814209938835,
              "label": "epoch 199"
            },
            {
              "x": 200,
              "y": 0.06394178981869166,
              "label": "epoch 200"
            },
            {
              "x": 201,
              "y": 0.06482438173201756,
              "label": "epoch 201"
            },
            {
              "x": 202,
              "y": 0.06426252144766104,
              "label": "epoch 202"
            },
            {
              "x": 203,
              "y": 0.06421260909570792,
              "label": "epoch 203"
            },
            {
              "x": 204,
              "y": 0.06375517942441739,
              "label": "epoch 204"
            },
            {
              "x": 205,
              "y": 0.0637368930424241,
              "label": "epoch 205"
            },
            {
              "x": 206,
              "y": 0.06390025751086102,
              "label": "epoch 206"
            },
            {
              "x": 207,
              "y": 0.06405360993037328,
              "label": "epoch 207"
            },
            {
              "x": 208,
              "y": 0.06386076682407281,
              "label": "epoch 208"
            },
            {
              "x": 209,
              "y": 0.06398240046920173,
              "label": "epoch 209"
            },
            {
              "x": 210,
              "y": 0.06438115018246256,
              "label": "epoch 210"
            },
            {
              "x": 211,
              "y": 0.06373523221188741,
              "label": "epoch 211"
            },
            {
              "x": 212,
              "y": 0.06352370092119934,
              "label": "epoch 212"
            },
            {
              "x": 213,
              "y": 0.06364900344763819,
              "label": "epoch 213"
            },
            {
              "x": 214,
              "y": 0.0638843744481655,
              "label": "epoch 214"
            },
            {
              "x": 215,
              "y": 0.06393712332946004,
              "label": "epoch 215"
            },
            {
              "x": 216,
              "y": 0.06399824182588083,
              "label": "epoch 216"
            },
            {
              "x": 217,
              "y": 0.06402704580915197,
              "label": "epoch 217"
            },
            {
              "x": 218,
              "y": 0.0637279649829811,
              "label": "epoch 218"
            },
            {
              "x": 219,
              "y": 0.06426360922479919,
              "label": "epoch 219"
            },
            {
              "x": 220,
              "y": 0.0637702481096348,
              "label": "epoch 220"
            },
            {
              "x": 221,
              "y": 0.06351058986839282,
              "label": "epoch 221"
            },
            {
              "x": 222,
              "y": 0.06405547756227,
              "label": "epoch 222"
            },
            {
              "x": 223,
              "y": 0.06414764680587089,
              "label": "epoch 223"
            },
            {
              "x": 224,
              "y": 0.06412425583588581,
              "label": "epoch 224"
            },
            {
              "x": 225,
              "y": 0.06398511548819909,
              "label": "epoch 225"
            },
            {
              "x": 226,
              "y": 0.06433641876668317,
              "label": "epoch 226"
            },
            {
              "x": 227,
              "y": 0.06384511123419663,
              "label": "epoch 227"
            },
            {
              "x": 228,
              "y": 0.06395296351533823,
              "label": "epoch 228"
            },
            {
              "x": 229,
              "y": 0.06453839863805917,
              "label": "epoch 229"
            },
            {
              "x": 230,
              "y": 0.06414462702601118,
              "label": "epoch 230"
            },
            {
              "x": 231,
              "y": 0.06416239736385203,
              "label": "epoch 231"
            },
            {
              "x": 232,
              "y": 0.06406184461582143,
              "label": "epoch 232"
            },
            {
              "x": 233,
              "y": 0.06446551687085389,
              "label": "epoch 233"
            },
            {
              "x": 234,
              "y": 0.06437080965517489,
              "label": "epoch 234"
            },
            {
              "x": 235,
              "y": 0.06426565957557566,
              "label": "epoch 235"
            },
            {
              "x": 236,
              "y": 0.06426002354196439,
              "label": "epoch 236"
            },
            {
              "x": 237,
              "y": 0.06437102988557124,
              "label": "epoch 237"
            },
            {
              "x": 238,
              "y": 0.06517001099859954,
              "label": "epoch 238"
            },
            {
              "x": 239,
              "y": 0.0647457707608966,
              "label": "epoch 239"
            },
            {
              "x": 240,
              "y": 0.06446840266983743,
              "label": "epoch 240"
            },
            {
              "x": 241,
              "y": 0.06452221868695879,
              "label": "epoch 241"
            },
            {
              "x": 242,
              "y": 0.06456211068521461,
              "label": "epoch 242"
            },
            {
              "x": 243,
              "y": 0.06444857244844714,
              "label": "epoch 243"
            },
            {
              "x": 244,
              "y": 0.06450325001169763,
              "label": "epoch 244"
            },
            {
              "x": 245,
              "y": 0.06426034790119597,
              "label": "epoch 245"
            },
            {
              "x": 246,
              "y": 0.06464267939044607,
              "label": "epoch 246"
            },
            {
              "x": 247,
              "y": 0.06437107006775022,
              "label": "epoch 247"
            },
            {
              "x": 248,
              "y": 0.06474546996881408,
              "label": "epoch 248"
            },
            {
              "x": 249,
              "y": 0.06456247527042155,
              "label": "epoch 249"
            },
            {
              "x": 250,
              "y": 0.06450260599118444,
              "label": "epoch 250"
            },
            {
              "x": 251,
              "y": 0.06455227046806637,
              "label": "epoch 251"
            },
            {
              "x": 252,
              "y": 0.06462288629569757,
              "label": "epoch 252"
            },
            {
              "x": 253,
              "y": 0.06455447698978763,
              "label": "epoch 253"
            },
            {
              "x": 254,
              "y": 0.06429118998922352,
              "label": "epoch 254"
            },
            {
              "x": 255,
              "y": 0.06490978623379592,
              "label": "epoch 255"
            },
            {
              "x": 256,
              "y": 0.06438233803929076,
              "label": "epoch 256"
            },
            {
              "x": 257,
              "y": 0.0643785691770697,
              "label": "epoch 257"
            },
            {
              "x": 258,
              "y": 0.064439505270987,
              "label": "epoch 258"
            },
            {
              "x": 259,
              "y": 0.06474119111080774,
              "label": "epoch 259"
            },
            {
              "x": 260,
              "y": 0.06466956197947052,
              "label": "epoch 260"
            },
            {
              "x": 261,
              "y": 0.0648515635296606,
              "label": "epoch 261"
            },
            {
              "x": 262,
              "y": 0.06479879697546141,
              "label": "epoch 262"
            },
            {
              "x": 263,
              "y": 0.06521651656111926,
              "label": "epoch 263"
            },
            {
              "x": 264,
              "y": 0.06506100836012545,
              "label": "epoch 264"
            },
            {
              "x": 265,
              "y": 0.06521006050044625,
              "label": "epoch 265"
            },
            {
              "x": 266,
              "y": 0.06465101591266294,
              "label": "epoch 266"
            },
            {
              "x": 267,
              "y": 0.06495641929048863,
              "label": "epoch 267"
            }
          ]
        }
      ]
    },
    "lelan-stage-gates": {
      "id": "lelan-stage-gates",
      "type": "bar",
      "title": "LeLaN 阶段闸门",
      "description": "LeLaN 目前还在铺设工程链路，所以最重要的不是已有结果，而是把 100 / 300 / 500 epoch 的晋级门槛固定清楚。",
      "format": "percent",
      "note": "这是一张任务规则图，不是训练曲线图。",
      "categories": [
        "100 epoch",
        "300 epoch",
        "500 epoch"
      ],
      "series": [
        {
          "name": "LeLaN 阶段闸门",
          "values": [
            0.45,
            0.55,
            0.6
          ],
          "color": "#2b766f"
        }
      ]
    },
    "results-status-overview": {
      "id": "results-status-overview",
      "type": "bar",
      "title": "任务状态分布",
      "description": "首页只保留高层状态分布，帮助快速看当前有哪些任务已经形成锚点，哪些还在推进中。",
      "format": "int",
      "note": "",
      "categories": [
        "已验证",
        "推进中",
        "待结果",
        "长期维护"
      ],
      "series": [
        {
          "name": "任务状态分布",
          "values": [
            1,
            1,
            1,
            1
          ],
          "color": "#b2573f"
        }
      ]
    },
    "branch-doc-volume": {
      "id": "branch-doc-volume",
      "type": "bar",
      "title": "文档沉淀规模",
      "description": "按支线统计当前 docs 下已沉淀的 Markdown / JSON 文档数量，用来反映哪条研究线的留痕已经成体系。",
      "format": "int",
      "note": "",
      "categories": [
        "PDIT",
        "MDIT",
        "LeLaN"
      ],
      "series": [
        {
          "name": "文档沉淀规模",
          "values": [
            8.0,
            16.0,
            2.0
          ],
          "color": "#3e7cb1"
        }
      ]
    },
    "task-anchor-overview": {
      "id": "task-anchor-overview",
      "type": "compare_cards",
      "title": "当前主任务产出对照",
      "description": "不用抽象进度圈，而是直接列出各任务当前最重要的成功率、里程碑或产出，让比较口径一眼可读。",
      "cards": [
        {
          "badge": "Sim2Real 平台",
          "title": "六轴臂 Sim2Real 采集平台搭建",
          "summary": "六轴运动映射和数字孪生同步已经打通",
          "metrics": [
            {
              "label": "机械臂",
              "value": "6 轴"
            },
            {
              "label": "IK 精度",
              "value": "< 8 mm"
            },
            {
              "label": "Demo",
              "value": "3 个"
            }
          ]
        },
        {
          "badge": "PDIT 主线",
          "title": "PDIT 基线恢复与锚点固化",
          "summary": "行为锚点已经稳定下来",
          "metrics": [
            {
              "label": "best success@20",
              "value": "0.95"
            },
            {
              "label": "100 回合复核",
              "value": "0.85"
            },
            {
              "label": "best epoch",
              "value": "500"
            }
          ]
        },
        {
          "badge": "MDIT 主线",
          "title": "MDIT RGB+Text 主线推进",
          "summary": "RGB+Text 当前锚点固定在 0.55@100",
          "metrics": [
            {
              "label": "当前锚点",
              "value": "0.55@100"
            },
            {
              "label": "epoch 50",
              "value": "0.25"
            },
            {
              "label": "续训进度",
              "value": "epoch 99"
            }
          ]
        },
        {
          "badge": "LeLaN",
          "title": "LeLaN 自动研究链路固化",
          "summary": "第一轮 recipe 固定，不先碰 backbone",
          "metrics": [
            {
              "label": "输入",
              "value": "5 路 RGB / 3 帧"
            },
            {
              "label": "动作步数",
              "value": "8"
            },
            {
              "label": "100 epoch gate",
              "value": "0.45"
            }
          ]
        }
      ]
    }
  },
  "home_chart_ids": [
    "task-anchor-overview",
    "pdit-success-curve",
    "mdit-success-curve"
  ],
  "showcase": {
    "items": [
      {
        "task_id": "dummy-sim2real-platform",
        "kind": "image",
        "title": "六轴臂平台封面",
        "caption": "概览展示这套六轴臂 Sim2Real 采集平台的整体形态，作为首页亮点封面使用。",
        "path": "homepage/media/tasks/dummy-sim2real-platform/images/00-封面图.jpg",
        "showcase_preview": true
      },
      {
        "task_id": "dummy-sim2real-platform",
        "kind": "video",
        "title": "正逆运动解算演示",
        "caption": "展示六轴臂平台里从目标位姿到数值逆解、再到仿真预览与控制联动的过程。",
        "path": "homepage/media/tasks/dummy-sim2real-platform/videos/01-运动逆解算.mp4",
        "showcase_preview": false
      },
      {
        "task_id": "dummy-sim2real-platform",
        "kind": "video",
        "title": "真机-仿真数字孪生同步",
        "caption": "展示真机姿态如何实时映射到仿真侧，验证 Sim2Real 运动映射与数字孪生同步效果。",
        "path": "homepage/media/tasks/dummy-sim2real-platform/videos/02-真机仿真数字孪生.mp4",
        "showcase_preview": false
      },
      {
        "task_id": "dummy-sim2real-platform",
        "kind": "video",
        "title": "规划轨迹真机执行",
        "caption": "展示规划好的关节轨迹如何按照记录节奏下发真机，体现示教回放与总线保护链路。",
        "path": "homepage/media/tasks/dummy-sim2real-platform/videos/03-规划轨迹执行.mp4",
        "showcase_preview": false
      },
      {
        "task_id": "infra-audit",
        "kind": "image",
        "title": "修复现场截图 A",
        "caption": "记录工程修复过程中的现场证据。",
        "path": "docs/image/fixes/1776007255805.png",
        "showcase_preview": false
      },
      {
        "task_id": "infra-audit",
        "kind": "image",
        "title": "修复现场截图 B",
        "caption": "作为 fixes 时间线的图像补充。",
        "path": "docs/image/fixes/1776007270781.png",
        "showcase_preview": false
      }
    ],
    "preview_items": [
      {
        "task_id": "dummy-sim2real-platform",
        "kind": "image",
        "title": "六轴臂平台封面",
        "caption": "概览展示这套六轴臂 Sim2Real 采集平台的整体形态，作为首页亮点封面使用。",
        "path": "homepage/media/tasks/dummy-sim2real-platform/images/00-封面图.jpg",
        "showcase_preview": true
      }
    ]
  },
  "fix_highlights": [
    {
      "date": "2026-04-18",
      "title": "修复主线 100->500 续训兼容并恢复真实后台接管",
      "summary": "范围：mdit/train/checkpoints.py + mdit/train/runner.py + research/mdit_takeover_controller.py + scripts/run_mdit_takeover_supervisor.py + tmux:mdit_auto…",
      "path": "docs/fixes.md"
    },
    {
      "date": "2026-04-18",
      "title": "离线审计完成",
      "summary": "范围：research/mdit_trial_runner.py + docs/mdit/research_journal.md + docs/fixes.md 背景：候选 run unplug_charger_mdit_lane_c_mtdp_strict_fm_v1__lane_c_mtdp_…",
      "path": "docs/fixes.md"
    },
    {
      "date": "2026-04-18",
      "title": "接管器触发 500 epoch 最优路线 fallback",
      "summary": "范围：research/mdit_takeover_controller.py + docs/fixes.md + docs/mdit/research_journal.md 背景：严格挑战线 unplug_charger_mdit_lane_c_mtdp_strict_fm_v1__lane_c…",
      "path": "docs/fixes.md"
    },
    {
      "date": "2026-04-18",
      "title": "接管已有 run 并补齐元数据",
      "summary": "范围：research/mdit_trial_runner.py + docs/mdit/research_journal.md + docs/fixes.md 背景：现有 run unplug_charger_mdit_rgb_text_3token_100__lane_a_mainline_5…",
      "path": "docs/fixes.md"
    }
  ]
};
