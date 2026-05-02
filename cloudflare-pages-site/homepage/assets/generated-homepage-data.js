window.homepageData = {
  "generated_at": "2026-05-02T19:09:16+08:00",
  "site": {
    "title": "GJW · Embodied AI Lab Notes",
    "slogan": "把实验、修复与主线推进整理成清晰可追溯的研究档案。",
    "description": ""
  },
  "stats": {
    "task_count": 7,
    "branch_count": 6,
    "timeline_count": 27,
    "validated_rows": 15,
    "archive_entry_count": 38,
    "archive_milestone_count": 3,
    "archive_complete_count": 12
  },
  "home": {
    "done_groups": [
      {
        "date": "2026-05-01",
        "cards": [
          {
            "date": "2026-05-01",
            "group": "done",
            "task_id": "act-lerobot-demo",
            "branch_ids": [
              "act"
            ],
            "badge": "ACT Demo",
            "title": "LeRobot + ACT 具身模仿学习闭环完成落地",
            "summary": "把自研 Dummy V2 机械臂、世界坐标示教、LeRobot v3、多视角 RGB-D、Isaac warm-start 和 ACT 部署串成了一条可展示的具身模仿学习工作线。",
            "metrics": [
              {
                "label": "episodes",
                "value": "5"
              },
              {
                "label": "frames",
                "value": "4379"
              },
              {
                "label": "demo",
                "value": "已打通"
              }
            ],
            "meta": "已完成 · ACT 模仿学习线",
            "path": "homepage/tasks/act-lerobot-demo/"
          }
        ]
      },
      {
        "date": "2026-04-19",
        "cards": [
          {
            "date": "2026-04-19",
            "group": "done",
            "task_id": "mdit-mainline",
            "branch_ids": [
              "mdit"
            ],
            "badge": "MDIT 主线",
            "title": "MDIT 主线固化 0.75@500，并收束出可复现的多模态配方",
            "summary": "当前工作重点已经从继续开相似对照，转成补齐共享审计点位，并把 3-token 条件组织、分阶段多模态适配、encoder-decoder DiT 与 uniform FM 路径固定为主线配方。",
            "metrics": [
              {
                "label": "best success@20",
                "value": "0.75"
              },
              {
                "label": "100 epoch 锚点",
                "value": "0.55"
              },
              {
                "label": "best epoch",
                "value": "300"
              }
            ],
            "meta": "长训结果与主线配方已收束",
            "path": "homepage/tasks/mdit-mainline/"
          }
        ]
      },
      {
        "date": "2026-04-17",
        "cards": [
          {
            "date": "2026-04-17",
            "group": "done",
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
            "title": "点云 baseline 恢复为行为锚点",
            "summary": "PDIT 已经从“能不能学起来”的问题，转成“后期泛化能否继续稳定”的问题。",
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
            ],
            "meta": "阶段总结 · Research Desk",
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
            "badge": "PDIT 主线",
            "title": "DiT 动力学改良候选达到 0.65@100，但还不能直接替代 baseline",
            "summary": "这条动力学候选证明“结构改进方向值得继续研究”，但它还没有完成对 500 epoch 行为锚点的替代。",
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
            ],
            "meta": "阶段总结 · Research Desk",
            "path": "homepage/tasks/pdit-anchor/"
          },
          {
            "date": "2026-04-08",
            "group": "done",
            "task_id": "pdit-anchor",
            "branch_ids": [
              "pdit"
            ],
            "badge": "PDIT 主线",
            "title": "数据统计增强路线被确认掺入观测语义错误，原有通过闸门的结果作废",
            "summary": "原来那条 0.55 结果不能再作为“数据统计增强可行”的证据，应该被解释为被 bug 污染的历史记录。",
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
            ],
            "meta": "阶段总结 · Research Desk",
            "path": "homepage/tasks/pdit-anchor/"
          },
          {
            "date": "2026-04-08",
            "group": "done",
            "task_id": "pdit-anchor",
            "branch_ids": [
              "pdit"
            ],
            "badge": "PDIT 主线",
            "title": "500 epoch 主线通过补评估保住长期行为锚点",
            "summary": "PDIT 不仅在短周期上恢复了可训练性，也在长周期上保住了可复核的行为锚点。",
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
            ],
            "meta": "阶段总结 · Research Desk",
            "path": "homepage/tasks/pdit-anchor/"
          },
          {
            "date": "2026-04-08",
            "group": "done",
            "task_id": "pdit-anchor",
            "branch_ids": [
              "pdit"
            ],
            "badge": "PDIT 主线",
            "title": "100 epoch 离线审计确认修复后 baseline 不再“学不会”",
            "summary": "这一轮审计把问题从“PDIT 学不会”改写成“修复工程链后它其实能学起来，而且已经明显超过最低可用门槛”。",
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
            ],
            "meta": "阶段总结 · Research Desk",
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
        "date": "2026-04-20",
        "cards": [
          {
            "date": "2026-04-20",
            "group": "in_progress",
            "task_id": "lingbot-va-world-model",
            "branch_ids": [
              "lingbot-va"
            ],
            "badge": "世界模型线",
            "title": "LingBot-VA 世界模型后训练已打通单任务 smoke 与离线 demo",
            "summary": "这条线现在的关键不是直接报 success rate，而是已经打通视频 latent + 动作联合后训练的最小链路，并明确了单卡显存边界与后续多卡 / PEFT 方向。",
            "metrics": [
              {
                "label": "smoke step",
                "value": "1"
              },
              {
                "label": "offline action_mse",
                "value": "0.0067"
              },
              {
                "label": "当前阶段",
                "value": "smoke+demo"
              }
            ],
            "meta": "LingBot-VA 世界模型研究切入",
            "path": "homepage/tasks/lingbot-va-world-model/"
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
            "badge": "LeLaN 执行线",
            "title": "自动研究链路与 100/300/500 闸门定版",
            "summary": "LeLaN 现在首先是一条“执行线”，目标是把正式实验沉淀成可长期追加的研究档案；",
            "metrics": [
              {
                "label": "观测设置",
                "value": "5 路 RGB / 3 帧"
              },
              {
                "label": "动作步数",
                "value": "8"
              },
              {
                "label": "gate@100",
                "value": "0.45"
              }
            ],
            "meta": "阶段总结 · Research Desk",
            "path": "homepage/tasks/lelan-pipeline/"
          }
        ]
      }
    ],
    "current_focus": {
      "date": "2026-04-20",
      "group": "in_progress",
      "task_id": "lingbot-va-world-model",
      "branch_ids": [
        "lingbot-va"
      ],
      "badge": "世界模型线",
      "title": "LingBot-VA 世界模型后训练已打通单任务 smoke 与离线 demo",
      "summary": "这条线现在的关键不是直接报 success rate，而是已经打通视频 latent + 动作联合后训练的最小链路，并明确了单卡显存边界与后续多卡 / PEFT…",
      "metrics": [
        {
          "label": "smoke step",
          "value": "1"
        },
        {
          "label": "offline action_mse",
          "value": "0.0067"
        },
        {
          "label": "当前阶段",
          "value": "smoke+demo"
        }
      ],
      "meta": "LingBot-VA 世界模型研究切入",
      "path": "homepage/tasks/lingbot-va-world-model/"
    },
    "hero_inline_stats": [
      {
        "label": "任务",
        "value": "7"
      },
      {
        "label": "研究线",
        "value": "6"
      },
      {
        "label": "归档条目",
        "value": "38"
      },
      {
        "label": "milestone",
        "value": "3"
      }
    ]
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
                  "path": "homepage/external/dummy_controller/项目总览.md"
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
                  "path": "homepage/external/dummy_controller/项目总览.md"
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
                  "path": "homepage/external/dummy_controller/项目总览.md"
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
          "path": "homepage/external/dummy_controller/项目总览.md",
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
          "path": "research_archive/tasks/infra/media/demo/images/dummy-sim2real-platform/00-封面图.jpg",
          "showcase_preview": true
        },
        {
          "task_id": "dummy-sim2real-platform",
          "kind": "image",
          "title": "三维建模与仿真资产准备",
          "caption": "用三维建模补齐机械结构、关节关系与几何尺度，为后续导出 URDF 和整理碰撞/惯性参数打底。这一步把平台从单纯的运动控制，推进到可接入 Isaac 或 MuJoCo 的动力学仿真资产层。",
          "path": "research_archive/tasks/infra/media/demo/images/dummy-sim2real-platform/01-SW三维模型.png",
          "showcase_preview": false
        },
        {
          "task_id": "dummy-sim2real-platform",
          "kind": "video",
          "title": "URDF 与动力学仿真链路",
          "caption": "展示从三维建模到仿真资产落地的流程：先把机械结构整理成可导出的 URDF，再接入动力学引擎做运动与接触验证。它为后续在 Isaac / MuJoCo 中复现实验、扩展数据采集与世界模型环境提供了统一底座。",
          "path": "research_archive/tasks/infra/media/demo/videos/dummy-sim2real-platform/00-三维建模与动力学仿真-1.mp4",
          "showcase_preview": false
        },
        {
          "task_id": "dummy-sim2real-platform",
          "kind": "video",
          "title": "正逆运动解算演示",
          "caption": "展示六轴臂平台里从目标位姿到数值逆解、再到仿真预览与控制联动的过程。",
          "path": "research_archive/tasks/infra/media/demo/videos/dummy-sim2real-platform/01-运动逆解算.mp4",
          "showcase_preview": false
        },
        {
          "task_id": "dummy-sim2real-platform",
          "kind": "video",
          "title": "真机-仿真数字孪生同步",
          "caption": "展示真机姿态如何实时映射到仿真侧，验证 Sim2Real 运动映射与数字孪生同步效果。",
          "path": "research_archive/tasks/infra/media/demo/videos/dummy-sim2real-platform/02-真机仿真数字孪生.mp4",
          "showcase_preview": false
        },
        {
          "task_id": "dummy-sim2real-platform",
          "kind": "video",
          "title": "规划轨迹真机执行",
          "caption": "展示规划好的关节轨迹如何按照记录节奏下发真机，体现示教回放与总线保护链路。",
          "path": "research_archive/tasks/infra/media/demo/videos/dummy-sim2real-platform/03-规划轨迹执行.mp4",
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
        "homepage/external/dummy_controller/项目总览.md",
        "homepage/external/dummy_controller/CAN_PROTECTION_SUMMARY.md",
        "homepage/external/dummy_controller/TEACH_BOUNDARY_COMPLETE.md",
        "homepage/external/dummy_controller/docs/技术文档_正逆运动学与示教系统.md"
      ],
      "chart_media_items": []
    },
    {
      "id": "pdit-anchor",
      "title": "PDIT 基线恢复与锚点固化",
      "summary": "PDIT 现在仍是全仓库最稳定的行为锚点。训练链、保存链和离线审计链修稳后，点云 baseline 在 100 epoch 上先证明“不是学不会”，在 500 epoch 上又通过补评估保住了 0.95 的最佳行为结果，根目录重整后的 100 回合成功率 复核仍有 0.85。",
      "core_summary": "PDIT 这一页先展示我已经搭起来的模仿学习主线能力，再展示关键路线对照和审计证据，而不是把实验日志原样搬上来。",
      "status": "已验证",
      "status_group": "done",
      "page_path": "homepage/tasks/pdit-anchor/",
      "branch_ids": [
        "pdit"
      ],
      "latest_update": "2026-04-16",
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
      "report_intro": "PDIT 现在仍是全仓库最稳定的行为锚点。训练链、保存链和离线审计链修稳后，点云 baseline 在 100 epoch 上先证明“不是学不会”，在 500 epoch 上又通过补评估保住了 0.95 的最佳行为结果，根目录重整后的 100 回合成功率 复核仍有 0.85。",
      "summary_cards": [
        {
          "eyebrow": "IL Framework",
          "title": "把点云观测到 action chunk 的模仿学习主线真正搭起来了",
          "body": "这条线已经不只是“能训练一个模型”，而是从 3 帧点云观测到 32 步动作 chunk 的策略学习链路、损失监控和离线行为评估全都打通了。",
          "metrics": [
            {
              "label": "观测帧",
              "value": "3"
            },
            {
              "label": "动作 chunk",
              "value": "32"
            },
            {
              "label": "obs",
              "value": "point cloud"
            }
          ]
        },
        {
          "eyebrow": "Evaluation",
          "title": "把训练、选模和行为审计做成了可复核的闭环",
          "body": "最强点不再靠单次试验自证，而是同时拥有 train/valid loss、离线 success 审计、20 回合短审计和 100 回合复核四层证据。",
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
              "label": "锚点",
              "value": "@500"
            }
          ]
        },
        {
          "eyebrow": "Extensibility",
          "title": "主线之外已经留出了向多模态策略继续扩展的接口",
          "body": "PDIT 线里除了点云 baseline，还已经开始做 RGB+Text / adapter 公平对照与迁移接口，这意味着这条主线后面可以自然接向更强的多模态策略或世界模型数据层。",
          "metrics": [
            {
              "label": "公平对照",
              "value": "已铺开"
            },
            {
              "label": "adapter 线",
              "value": "已接入"
            },
            {
              "label": "扩展方向",
              "value": "RGB+Text"
            }
          ]
        },
        {
          "eyebrow": "Archive",
          "title": "research_archive 已固化 11 条run与 0 个 milestone",
          "body": "页面里的证据层、归档时间线和后续专题页素材现在都可以优先从 research_archive 消费，不必再回翻零散的 ckpt、autoresearch_records 和 docs 目录。",
          "metrics": [
            {
              "label": "归档条目",
              "value": "11"
            },
            {
              "label": "完整条目",
              "value": "0"
            },
            {
              "label": "milestone",
              "value": "0"
            }
          ]
        }
      ],
      "core_tables": [
        {
          "title": "PDIT 关键结果对照",
          "columns": [
            "路线",
            "关键结果",
            "长回合复核",
            "当前判断"
          ],
          "rows": [
            [
              "Baseline@100",
              "0.90@20",
              "-",
              "证明点云主线可训练性恢复"
            ],
            [
              "Baseline@500",
              "0.95@20",
              "0.85@100",
              "当前行为锚点"
            ],
            [
              "H1 统计增强",
              "0.55@100",
              "-",
              "弱于 baseline，不再作为主结论"
            ],
            [
              "H2 动力学候选",
              "0.65@100",
              "-",
              "有提升，但证据不足以接管主线"
            ]
          ],
          "note": "这张表先回答“哪条路线当前成立”，再谈具体结构；对外展示时，PDIT 最重要的结论仍是 baseline@500 已经站成锚点。"
        },
        {
          "title": "PDIT 核心技术模块",
          "columns": [
            "技术模块",
            "当前采用",
            "当前作用",
            "后续升级位"
          ],
          "rows": [
            [
              "时序点云观测",
              "3 帧 point cloud 条件输入",
              "把几何观测稳定送进策略，而不是只依赖单步状态回归。",
              "可以升级成 RGB / RGB+text 多模态观测编码。"
            ],
            [
              "Flow Matching + DiT 策略骨架",
              "6-block DiT + FM action trajectory generation",
              "用序列生成方式预测未来动作过程，而不是只做一步动作分类。",
              "可继续扩成更强的序列生成策略或 latent trajectory 建模。"
            ],
            [
              "Action chunk 表达",
              "32 步未来轨迹",
              "让策略直接学习执行过程，对 manipulation 比单步动作更友好。",
              "可接 subgoal / subtask 边界或层级动作抽象。"
            ],
            [
              "行为审计闭环",
              "loss + rollout success + 20/100 回合复核",
              "把训练结果和真实 rollout 表现绑到同一套选模口径上。",
              "后续可直接复用到多模态策略、VLA 或世界模型对照实验。"
            ]
          ],
          "note": "当前训练数据规模约为 train 10573 / valid 1189；这张表只保留对外展示真正重要的技术结构，不再重复训练时间线。"
        }
      ],
      "timeline_groups": [
        {
          "date": "2026-04-16",
          "cards": [
            {
              "badge": "Archive Run",
              "title": "RGB+文本跨线公平对照",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-16",
              "metrics": [
                {
                  "label": "best success",
                  "value": "0.05"
                },
                {
                  "label": "best epoch",
                  "value": "49"
                },
                {
                  "label": "归档",
                  "value": "待补齐"
                }
              ],
              "outcome": "归档里已经固定 0.05@49 的结果，后续页面与专题页都可以直接复用。",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/pdit/runs/2026-04-16__ablation_rgb_text_pdit_100_fair_bs128_noamp/report/report.md"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/pdit/runs/2026-04-16__ablation_rgb_text_pdit_100_fair_bs128_noamp/archive_manifest.json"
                }
              ]
            },
            {
              "badge": "Archive Run",
              "title": "RGB+文本适配器修正版",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-16",
              "metrics": [
                {
                  "label": "归档",
                  "value": "待补齐"
                },
                {
                  "label": "缺失",
                  "value": "3 项"
                }
              ],
              "outcome": "trial_score: -1.0 collapse_detected: True",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/pdit/runs/2026-04-16__ablation_rgb_text_pdit_100_fair_bs128_noamp_fix_v2/report/report.md"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/pdit/runs/2026-04-16__ablation_rgb_text_pdit_100_fair_bs128_noamp_fix_v2/archive_manifest.json"
                }
              ]
            }
          ]
        },
        {
          "date": "2026-04-15",
          "cards": [
            {
              "badge": "Archive Run",
              "title": "原始 PDIT 公平锚点（bs224）",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-15",
              "metrics": [
                {
                  "label": "归档",
                  "value": "待补齐"
                },
                {
                  "label": "缺失",
                  "value": "3 项"
                }
              ],
              "outcome": "trial_score: -1.0 collapse_detected: True",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/pdit/runs/2026-04-15__ablation_anchor_pcd_pdit_orig_bs224_noamp/report/report.md"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/pdit/runs/2026-04-15__ablation_anchor_pcd_pdit_orig_bs224_noamp/archive_manifest.json"
                }
              ]
            },
            {
              "badge": "Archive Run",
              "title": "原始 PDIT 公平锚点（bs64）",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-15",
              "metrics": [
                {
                  "label": "归档",
                  "value": "待补齐"
                },
                {
                  "label": "缺失",
                  "value": "2 项"
                }
              ],
              "outcome": "trial_score: -1.0 collapse_detected: True",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/pdit/runs/2026-04-15__ablation_anchor_pcd_pdit_orig_bs64_noamp/report/report.md"
                },
                {
                  "title": "archive summary",
                  "path": "research_archive/tasks/pdit/runs/2026-04-15__ablation_anchor_pcd_pdit_orig_bs64_noamp/metrics/summary.json"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/pdit/runs/2026-04-15__ablation_anchor_pcd_pdit_orig_bs64_noamp/archive_manifest.json"
                }
              ]
            },
            {
              "badge": "Archive Run",
              "title": "RGB+文本迁移候选",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-15",
              "metrics": [
                {
                  "label": "best success",
                  "value": "0.05"
                },
                {
                  "label": "best epoch",
                  "value": "40"
                },
                {
                  "label": "归档",
                  "value": "待补齐"
                }
              ],
              "outcome": "归档里已经固定 0.05@40 的结果，后续页面与专题页都可以直接复用。",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/pdit/runs/2026-04-15__ablation_rgb_text_pdit_100/report/report.md"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/pdit/runs/2026-04-15__ablation_rgb_text_pdit_100/archive_manifest.json"
                }
              ]
            },
            {
              "badge": "Archive Run",
              "title": "RGB+文本迁移候选",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-15",
              "metrics": [
                {
                  "label": "归档",
                  "value": "待补齐"
                },
                {
                  "label": "缺失",
                  "value": "3 项"
                }
              ],
              "outcome": "trial_score: -1.0 collapse_detected: True",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/pdit/runs/2026-04-15__ablation_rgb_text_pdit_100ep/report/report.md"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/pdit/runs/2026-04-15__ablation_rgb_text_pdit_100ep/archive_manifest.json"
                }
              ]
            }
          ]
        },
        {
          "date": "2026-04-10",
          "cards": [
            {
              "badge": "Archive Run",
              "title": "Baseline@100 恢复验证",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-10",
              "metrics": [
                {
                  "label": "best success",
                  "value": "0.90"
                },
                {
                  "label": "best epoch",
                  "value": "100"
                },
                {
                  "label": "归档",
                  "value": "待补齐"
                }
              ],
              "outcome": "归档里已经固定 0.90@100 的结果，后续页面与专题页都可以直接复用。",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/pdit/runs/2026-04-10__unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1_baseline_100_e0100_20260408_002048/report/report.md"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/pdit/runs/2026-04-10__unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1_baseline_100_e0100_20260408_002048/archive_manifest.json"
                }
              ]
            },
            {
              "badge": "Archive Run",
              "title": "Baseline@500 行为锚点",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-10",
              "metrics": [
                {
                  "label": "归档",
                  "value": "待补齐"
                },
                {
                  "label": "缺失",
                  "value": "experiment_manifest"
                }
              ],
              "outcome": "trial_score: -1.0 collapse_detected: True",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/pdit/runs/2026-04-10__unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1_baseline_500_e0500_20260408_011741/report/report.md"
                },
                {
                  "title": "archive summary",
                  "path": "research_archive/tasks/pdit/runs/2026-04-10__unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1_baseline_500_e0500_20260408_011741/metrics/summary.json"
                },
                {
                  "title": "archive audit",
                  "path": "research_archive/tasks/pdit/runs/2026-04-10__unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1_baseline_500_e0500_20260408_011741/metrics/audit_report.json"
                }
              ]
            },
            {
              "badge": "Archive Run",
              "title": "统计特征增强重试",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-10",
              "metrics": [
                {
                  "label": "best success",
                  "value": "0.35"
                },
                {
                  "label": "best epoch",
                  "value": "100"
                },
                {
                  "label": "归档",
                  "value": "待补齐"
                }
              ],
              "outcome": "归档里已经固定 0.35@100 的结果，后续页面与专题页都可以直接复用。",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/pdit/runs/2026-04-10__unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1_h1_fixed_stats_aug_100_e0100_20260408_124213/report/report.md"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/pdit/runs/2026-04-10__unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1_h1_fixed_stats_aug_100_e0100_20260408_124213/archive_manifest.json"
                }
              ]
            },
            {
              "badge": "Archive Run",
              "title": "统计特征增强初版",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-10",
              "metrics": [
                {
                  "label": "best success",
                  "value": "0.55"
                },
                {
                  "label": "best epoch",
                  "value": "100"
                },
                {
                  "label": "归档",
                  "value": "待补齐"
                }
              ],
              "outcome": "归档里已经固定 0.55@100 的结果，后续页面与专题页都可以直接复用。",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/pdit/runs/2026-04-10__unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1_h1_stats_aug_100_e0100_20260408_103914/report/report.md"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/pdit/runs/2026-04-10__unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1_h1_stats_aug_100_e0100_20260408_103914/archive_manifest.json"
                }
              ]
            },
            {
              "badge": "Archive Run",
              "title": "DiT 动力学候选",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-10",
              "metrics": [
                {
                  "label": "best success",
                  "value": "0.65"
                },
                {
                  "label": "best epoch",
                  "value": "100"
                },
                {
                  "label": "归档",
                  "value": "待补齐"
                }
              ],
              "outcome": "归档里已经固定 0.65@100 的结果，后续页面与专题页都可以直接复用。",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/pdit/runs/2026-04-10__unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1_h2_dit_dynamics_100_e0100_20260408_114130/report/report.md"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/pdit/runs/2026-04-10__unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1_h2_dit_dynamics_100_e0100_20260408_114130/archive_manifest.json"
                }
              ]
            }
          ]
        },
        {
          "date": "2026-04-09",
          "cards": [
            {
              "badge": "PDIT 主线",
              "title": "点云 baseline 恢复为行为锚点",
              "summary": "PDIT 早期的低成功率同时混杂了训练、保存和离线审计链路的问题，导致当时很难判断是策略学不会，还是工程链路把原本可用的结果压坏了。",
              "date_key": "2026-04-09",
              "metrics": [
                {
                  "label": "线路",
                  "value": "PDIT 主线"
                },
                {
                  "label": "日期",
                  "value": "2026-04-09"
                },
                {
                  "label": "来源",
                  "value": "research desk"
                }
              ],
              "outcome": "PDIT 已经从“能不能学起来”的问题，转成“后期泛化能否继续稳定”的问题。",
              "links": [
                {
                  "title": "PDIT 恢复进展",
                  "path": "docs/pdit/2026-04-08-fm-recovery-progress-zh.md"
                },
                {
                  "title": "训练模型审计",
                  "path": "docs/pdit/2026-04-07-training-model-audit-zh.md"
                },
                {
                  "title": "checkpoint 清单",
                  "path": "docs/top10-checkpoint-manifest.json"
                }
              ],
              "task_id": "pdit-anchor"
            },
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
              "badge": "PDIT 主线",
              "title": "DiT 动力学改良候选达到 0.65@100，但还不能直接替代 baseline",
              "summary": "在 baseline 已经恢复后，项目需要判断晚期漂移有没有结构层面的改良方向，而不是只知道“当前基线能跑”。",
              "date_key": "2026-04-08",
              "metrics": [
                {
                  "label": "线路",
                  "value": "PDIT 主线"
                },
                {
                  "label": "日期",
                  "value": "2026-04-08"
                },
                {
                  "label": "来源",
                  "value": "research desk"
                }
              ],
              "outcome": "这条动力学候选证明“结构改进方向值得继续研究”，但它还没有完成对 500 epoch 行为锚点的替代。",
              "links": [
                {
                  "title": "DiT 动力学候选审计记录",
                  "path": "autoresearch_records/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__h2_dit_dynamics_100__e0100__20260408_114130.json"
                },
                {
                  "title": "DiT 动力学候选审计日志",
                  "path": "autoresearch_records/logs/h2_dit_dynamics_100_audit.log"
                },
                {
                  "title": "PDIT 恢复进展",
                  "path": "docs/pdit/2026-04-08-fm-recovery-progress-zh.md"
                }
              ],
              "task_id": "pdit-anchor"
            },
            {
              "badge": "PDIT 主线",
              "title": "数据统计增强路线被确认掺入观测语义错误，原有通过闸门的结果作废",
              "summary": "最初“数据统计 + 数据增强”路线在 100 epoch 上一度拿到 0.55，表面上像是一条勉强可保留的候选，但这条结果后来被发现不能直接支持结构结论。",
              "date_key": "2026-04-08",
              "metrics": [
                {
                  "label": "线路",
                  "value": "PDIT 主线"
                },
                {
                  "label": "日期",
                  "value": "2026-04-08"
                },
                {
                  "label": "来源",
                  "value": "research desk"
                }
              ],
              "outcome": "原来那条 0.55 结果不能再作为“数据统计增强可行”的证据，应该被解释为被 bug 污染的历史记录。",
              "links": [
                {
                  "title": "原始数据统计增强审计记录",
                  "path": "autoresearch_records/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__h1_stats_aug_100__e0100__20260408_103914.json"
                },
                {
                  "title": "修正后重跑审计记录",
                  "path": "autoresearch_records/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__h1_fixed_stats_aug_100__e0100__20260408_124213.json"
                },
                {
                  "title": "PDIT 恢复进展",
                  "path": "docs/pdit/2026-04-08-fm-recovery-progress-zh.md"
                }
              ],
              "task_id": "pdit-anchor"
            },
            {
              "badge": "PDIT 主线",
              "title": "500 epoch 主线通过补评估保住长期行为锚点",
              "summary": "500 epoch 主线训练完成后，原始的全量 audit sweep 一度因为超时看起来像失败，如果直接把这件事解释成训练崩溃，就会把已经跑出来的长期主线误判为无效。",
              "date_key": "2026-04-08",
              "metrics": [
                {
                  "label": "线路",
                  "value": "PDIT 主线"
                },
                {
                  "label": "日期",
                  "value": "2026-04-08"
                },
                {
                  "label": "来源",
                  "value": "research desk"
                }
              ],
              "outcome": "PDIT 不仅在短周期上恢复了可训练性，也在长周期上保住了可复核的行为锚点。",
              "links": [
                {
                  "title": "baseline_500 审计报告",
                  "path": "ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/audit_report.json"
                },
                {
                  "title": "epoch_0500 人工评估",
                  "path": "ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/epoch_0500_manual_eval.json"
                },
                {
                  "title": "100 回合复核",
                  "path": "ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/root_layout_recheck_100.json"
                }
              ],
              "task_id": "pdit-anchor"
            },
            {
              "badge": "PDIT 主线",
              "title": "100 epoch 离线审计确认修复后 baseline 不再“学不会”",
              "summary": "在修复训练、保存和审计链之前，PDIT 的低成功率很难解释清楚，到底是任务本身太难，还是工程链路把本来可用的策略压坏了。",
              "date_key": "2026-04-08",
              "metrics": [
                {
                  "label": "线路",
                  "value": "PDIT 主线"
                },
                {
                  "label": "日期",
                  "value": "2026-04-08"
                },
                {
                  "label": "来源",
                  "value": "research desk"
                }
              ],
              "outcome": "这一轮审计把问题从“PDIT 学不会”改写成“修复工程链后它其实能学起来，而且已经明显超过最低可用门槛”。",
              "links": [
                {
                  "title": "baseline_100 审计记录",
                  "path": "autoresearch_records/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_100__e0100__20260408_002048.json"
                },
                {
                  "title": "baseline_100 审计日志",
                  "path": "autoresearch_records/logs/baseline_100_audit.log"
                },
                {
                  "title": "PDIT 恢复进展",
                  "path": "docs/pdit/2026-04-08-fm-recovery-progress-zh.md"
                }
              ],
              "task_id": "pdit-anchor"
            },
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
          "title": "archive 报告 · RGB+文本跨线公平对照",
          "path": "research_archive/tasks/pdit/runs/2026-04-16__ablation_rgb_text_pdit_100_fair_bs128_noamp/report/report.md",
          "summary": "archive 内的背景、核心结果与证据索引已经整理成可直接消费的报告页。",
          "label": "打开归档报告"
        },
        {
          "title": "archive 报告 · RGB+文本适配器修正版",
          "path": "research_archive/tasks/pdit/runs/2026-04-16__ablation_rgb_text_pdit_100_fair_bs128_noamp_fix_v2/report/report.md",
          "summary": "archive 内的背景、核心结果与证据索引已经整理成可直接消费的报告页。",
          "label": "打开归档报告"
        },
        {
          "title": "archive 报告 · 原始 PDIT 公平锚点（bs224）",
          "path": "research_archive/tasks/pdit/runs/2026-04-15__ablation_anchor_pcd_pdit_orig_bs224_noamp/report/report.md",
          "summary": "archive 内的背景、核心结果与证据索引已经整理成可直接消费的报告页。",
          "label": "打开归档报告"
        },
        {
          "title": "archive 报告 · 原始 PDIT 公平锚点（bs64）",
          "path": "research_archive/tasks/pdit/runs/2026-04-15__ablation_anchor_pcd_pdit_orig_bs64_noamp/report/report.md",
          "summary": "archive 内的背景、核心结果与证据索引已经整理成可直接消费的报告页。",
          "label": "打开归档报告"
        },
        {
          "title": "archive summary · 原始 PDIT 公平锚点（bs64）",
          "path": "research_archive/tasks/pdit/runs/2026-04-15__ablation_anchor_pcd_pdit_orig_bs64_noamp/metrics/summary.json",
          "summary": "训练后固化的结构化 summary，会作为后续图表和专题页的统一输入。",
          "label": "打开 summary"
        },
        {
          "title": "archive 报告 · RGB+文本迁移候选",
          "path": "research_archive/tasks/pdit/runs/2026-04-15__ablation_rgb_text_pdit_100/report/report.md",
          "summary": "archive 内的背景、核心结果与证据索引已经整理成可直接消费的报告页。",
          "label": "打开归档报告"
        },
        {
          "title": "PDIT 关键结果表",
          "path": "research_archive/tasks/pdit/media/tables/pdit_key_results.csv",
          "summary": "结构化汇总当前主线和关键 challenger 的结果判断。",
          "label": "查看原始记录"
        },
        {
          "title": "PDIT 技术模块表",
          "path": "research_archive/tasks/pdit/media/tables/pdit_core_modules.csv",
          "summary": "结构化汇总当前主线的技术骨架与扩展方向。",
          "label": "查看原始记录"
        },
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
        "pdit-checkpoint-rank",
        "pdit-loss-tail",
        "pdit-mse-tail"
      ],
      "media_items": [
        {
          "task_id": "pdit-anchor",
          "kind": "image",
          "title": "PDIT 点云主线封面",
          "caption": "作为当前 PDIT 主线封面，概括点云观测、动作生成与行为审计这条模仿学习主线的整体结构。",
          "path": "research_archive/tasks/pdit/media/demo/images/pdit.png",
          "showcase_preview": false
        },
        {
          "task_id": "pdit-anchor",
          "kind": "video",
          "title": "PDIT 点云策略关门演示",
          "caption": "展示点云主线在后期 checkpoint 上的仿真执行效果，说明 point cloud 到 action chunk 的策略已经能稳定落到具体 manipulation 动作。",
          "path": "research_archive/tasks/pdit/media/demo/videos/epoch_0450_pcd.mp4",
          "showcase_preview": false
        },
        {
          "task_id": "pdit-anchor",
          "kind": "video",
          "title": "Franka 拔插头仿真执行",
          "caption": "展示 PDIT 在拔插头任务中的仿真执行现场：策略从观测编码到 action chunk 输出后，驱动 Franka 机械臂完成接近、对位与执行动作。",
          "path": "research_archive/tasks/pdit/media/demo/videos/仿真-1.mp4",
          "showcase_preview": false
        }
      ],
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
      "manifest_note": "代码库的失败并非由单一原因造成。 最强的确认结论是： 原始的低/不稳定性能被训练栈和评估栈的 bug 严重放大。 修复这些问题后，基线已在 20 个离线回合中达到 0.90 success@100。 剩余问题不再是\"为什么它完全无法学习？\" 剩余问题是\"如何防止强大的早期策略在第 300 到 500 epoch 之间…",
      "chart_media_items": [
        {
          "id": "archive-chart-pdit-anchor-01-pdit-rank-overview-svg",
          "type": "media_chart",
          "title": "PDIT 关键结果排行",
          "description": "把关键 checkpoint 和 100 回合复核放到同一张图里，直接看当前该认哪一个锚点。",
          "path": "research_archive/tasks/pdit/media/charts/01-pdit_rank_overview.svg",
          "kind": "image",
          "source_kind": "manual",
          "note": "epoch 500 仍然是当前最稳的行为锚点，100 回合复核也继续站得住。"
        },
        {
          "id": "archive-chart-pdit-anchor-02-pdit-best-loss-curve-svg",
          "type": "media_chart",
          "title": "PDIT 最优组 loss 尾段",
          "description": "围绕当前最优 baseline@500，直接看 train / valid total loss 的尾段关系。",
          "path": "research_archive/tasks/pdit/media/charts/02-pdit_best_loss_curve.svg",
          "kind": "image",
          "source_kind": "manual",
          "note": "当前 baseline@500 训练记录里没有可回抓的 W&B history，因此这里只能展示本地 summary 保留下来的 495-499 epoch 尾段快照。"
        },
        {
          "id": "archive-chart-pdit-anchor-03-pdit-best-mse-curve-svg",
          "type": "media_chart",
          "title": "PDIT 最优组 MSE 尾段",
          "description": "把 xyz / rot6d / grip 三条误差拆开，解释当前行为锚点背后的误差结构。",
          "path": "research_archive/tasks/pdit/media/charts/03-pdit_best_mse_curve.svg",
          "kind": "image",
          "source_kind": "manual",
          "note": "PDIT 当前没有可用的 W&B history，这张图与 loss 图一样来自本地 summary 尾段快照。"
        }
      ]
    },
    {
      "id": "mdit-mainline",
      "title": "MDIT RGB+Text 主线推进",
      "summary": "MDIT 当前最稳的早期锚点仍是 0.55@100 的 RGB+文本主线。稳定化对照弱于主线，faithful 对照的首轮失败被确认是缓存和网络问题，严格 MTDP 对照没有通过共享闸门；",
      "core_summary": "当前主线已经在共享审计下站稳 0.75@500；页面重点不再是继续扩散相似对照，而是把已经收束出来的主线配方、图表证据和时间线判断讲清楚。",
      "status": "已验证",
      "status_group": "done",
      "page_path": "homepage/tasks/mdit-mainline/",
      "branch_ids": [
        "mdit"
      ],
      "latest_update": "2026-04-21",
      "hero_metrics": [
        {
          "label": "best success@20",
          "value": "0.75"
        },
        {
          "label": "100 epoch 锚点",
          "value": "0.55"
        },
        {
          "label": "best epoch",
          "value": "300"
        }
      ],
      "report_intro": "MDIT 当前已经不是“哪条对照还要不要再试”的阶段，而是“0.75@500 的主线结果已经站住，接下来要把主线配方和共享审计叙事一起固定下来”的阶段。",
      "summary_cards": [
        {
          "eyebrow": "Multimodal IL",
          "title": "把 5 路 RGB + 文本到 action chunk 的多模态主线真正立起来了",
          "body": "这条线已经明确落成了以 CLIP 视觉语义和任务文本为条件的多模态策略主线，而不是停留在“加点视觉、加点文本”的 loose idea。",
          "metrics": [
            {
              "label": "RGB 视角",
              "value": "5"
            },
            {
              "label": "观测帧",
              "value": "3"
            },
            {
              "label": "动作 chunk",
              "value": "32"
            }
          ]
        },
        {
          "eyebrow": "Takeover",
          "title": "把同一条主线的 100→500 续训接管与共享审计真正打通了",
          "body": "这不是重新起一个匿名长训 run，而是把已有最优主线在同一 lineage 上接管到 500，并继续用共享审计口径去判断它是否真的变好。",
          "metrics": [
            {
              "label": "epoch 100",
              "value": "0.55"
            },
            {
              "label": "epoch 300",
              "value": "0.75"
            },
            {
              "label": "epoch 500",
              "value": "0.75"
            }
          ]
        },
        {
          "eyebrow": "Screening",
          "title": "把对照路线放进同一 gate 体系后，主线终于收束了",
          "body": "stabilized、faithful、strict MTDP 三条路线都已经在统一共享审计口径下被筛过，这条线不再是零散试验堆积，而是有明确淘汰与接管规则的主线研究。",
          "metrics": [
            {
              "label": "stabilized@100",
              "value": "0.35"
            },
            {
              "label": "faithful",
              "value": "启动链故障"
            },
            {
              "label": "严格 MTDP",
              "value": "未过 gate"
            }
          ]
        },
        {
          "eyebrow": "Archive",
          "title": "research_archive 已固化 9 条run与 3 个 milestone",
          "body": "页面里的证据层、归档时间线和后续专题页素材现在都可以优先从 research_archive 消费，不必再回翻零散的 ckpt、autoresearch_records 和 docs 目录。",
          "metrics": [
            {
              "label": "归档条目",
              "value": "9"
            },
            {
              "label": "完整条目",
              "value": "6"
            },
            {
              "label": "milestone",
              "value": "3"
            }
          ]
        }
      ],
      "core_tables": [
        {
          "title": "MDIT 关键结果对照",
          "columns": [
            "路线",
            "关键点位",
            "长训结果",
            "当前判断"
          ],
          "rows": [
            [
              "RGB+Text 主线",
              "0.25@50 / 0.55@100",
              "0.75@300 / 0.75@500",
              "当前继续推进的主线"
            ],
            [
              "Stabilized 对照",
              "0.35@100",
              "-",
              "弱于主线，只保留参考价值"
            ],
            [
              "Faithful recipe",
              "-",
              "-",
              "首轮卡在启动链，暂不作为方法结论"
            ],
            [
              "Strict MTDP",
              "-",
              "-",
              "当前未通过同一 gate，不接管主线"
            ]
          ],
          "note": "这张表先说明哪条路线真的成立，再谈多模态结构和扩展方向；当前最重要的结论，是 RGB+Text 主线已经把共享审计从 0.55@100 抬到 0.75@300/500。"
        },
        {
          "title": "MDIT 核心技术调整",
          "columns": [
            "调整点",
            "原版做法",
            "当前做法",
            "调整意义"
          ],
          "rows": [
            [
              "条件组织",
              "robot state + 多相机 CLS + text 展平成单个全局条件向量",
              "按观测步组织 3 个 cond token，再送入 backbone",
              "把多视角与文本条件从“压成一个向量”改成“保留短序列结构”，减少全局向量对时序语义的过度压缩。"
            ],
            [
              "多模态融合",
              "观测直接 concat / flatten 后统一进入主干",
              "5 路 CLIP 视觉、文本和状态先各自适配，再在 step 内融合",
              "先对齐模态尺度再融合，减轻视觉、文本和状态直接拼接造成的语义污染，多模态条件更稳定。"
            ],
            [
              "骨干结构",
              "单塔 DiT 直接在动作序列 + 全局条件上做噪声预测",
              "encoder 先编码 cond tokens，decoder 再生成动作轨迹",
              "把条件建模和动作生成拆开，避免条件语义与动作噪声混在一条通路里，长程控制更可解释。"
            ],
            [
              "FM 动力学",
              "beta timestep sampling + 100-step Euler ODE",
              "uniform 采样 + exp flow schedule + 10-step 推理",
              "把训练与推理路径压到当前算力能稳定迭代的区间，先保证主线可持续审计，再谈更重的 ODE 配置。"
            ],
            [
              "时序与执行口径",
              "2 obs / 100 horizon + state/action min-max + 原生推理接口",
              "3 obs / 32 pred + legacy 状态归一化 + 共享动作后处理链",
              "把训练窗口、归一化和 rollout 执行口径统一到同一主线，减少训练结果与共享审计之间的接口漂移。"
            ]
          ],
          "note": "当前训练数据规模约为 train 10573 / valid 1189；这里保留的是已经改变主线语义和训练口径的结构调整，而不是实验过程记录。"
        }
      ],
      "timeline_groups": [
        {
          "date": "2026-04-21",
          "cards": [
            {
              "badge": "Archive Run",
              "title": "Put books on bookshelf MDIT mainline 50…",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-21",
              "metrics": [
                {
                  "label": "归档",
                  "value": "待补齐"
                },
                {
                  "label": "缺失",
                  "value": "audit_report"
                }
              ],
              "outcome": "collapse_detected: False",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/mdit/runs/2026-04-21__put_books_on_bookshelf_mdit_rgb_text_3token_500/report/report.md"
                },
                {
                  "title": "archive summary",
                  "path": "research_archive/tasks/mdit/runs/2026-04-21__put_books_on_bookshelf_mdit_rgb_text_3token_500/metrics/summary.json"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/mdit/runs/2026-04-21__put_books_on_bookshelf_mdit_rgb_text_3token_500/archive_manifest.json"
                }
              ]
            }
          ]
        },
        {
          "date": "2026-04-20",
          "cards": [
            {
              "badge": "Archive Run",
              "title": "audit_wandb_run",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-20",
              "metrics": [
                {
                  "label": "best success",
                  "value": "0.60"
                },
                {
                  "label": "best epoch",
                  "value": "100"
                },
                {
                  "label": "归档",
                  "value": "完整"
                }
              ],
              "outcome": "归档里已经固定 0.60@100 的结果，后续页面与专题页都可以直接复用。",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/mdit/runs/2026-04-20__audit_wandb_run/report/report.md"
                },
                {
                  "title": "archive summary",
                  "path": "research_archive/tasks/mdit/runs/2026-04-20__audit_wandb_run/metrics/summary.json"
                },
                {
                  "title": "archive audit",
                  "path": "research_archive/tasks/mdit/runs/2026-04-20__audit_wandb_run/metrics/audit_report.json"
                }
              ]
            },
            {
              "badge": "Archive Run",
              "title": "collapse_run",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-20",
              "metrics": [
                {
                  "label": "best success",
                  "value": "0.75"
                },
                {
                  "label": "best epoch",
                  "value": "300"
                },
                {
                  "label": "归档",
                  "value": "完整"
                }
              ],
              "outcome": "归档里已经固定 0.75@300 的结果，后续页面与专题页都可以直接复用。",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/mdit/runs/2026-04-20__collapse_run/report/report.md"
                },
                {
                  "title": "archive summary",
                  "path": "research_archive/tasks/mdit/runs/2026-04-20__collapse_run/metrics/summary.json"
                },
                {
                  "title": "archive audit",
                  "path": "research_archive/tasks/mdit/runs/2026-04-20__collapse_run/metrics/audit_report.json"
                }
              ]
            }
          ]
        },
        {
          "date": "2026-04-19",
          "cards": [
            {
              "badge": "MDIT 主线",
              "title": "100→500 主线续训完成共享审计并把长训结果抬到 0.75",
              "summary": "100 epoch 锁定锚点之后，MDIT 一直缺一条真正跑完并完成同口径共享审计的长训主线。",
              "date_key": "2026-04-19",
              "metrics": [
                {
                  "label": "线路",
                  "value": "MDIT 主线"
                },
                {
                  "label": "日期",
                  "value": "2026-04-19"
                },
                {
                  "label": "来源",
                  "value": "research desk"
                }
              ],
              "outcome": "MDIT 现在最重要的新结论不是“续训已经恢复”，而是“同一条 RGB+文本主线在共享审计下已经从 0.55@100 抬到了 0.75@300/500”。",
              "links": [
                {
                  "title": "500 续训审计记录",
                  "path": "autoresearch_records/unplug_charger_mdit_rgb_text_3token_100__lane_a_mainline_500_resume__e0500__20260418_005723.json"
                },
                {
                  "title": "MDIT 研究日志",
                  "path": "docs/mdit/research_journal.md"
                },
                {
                  "title": "修复留痕总表",
                  "path": "docs/fixes.md"
                }
              ],
              "task_id": "mdit-mainline"
            },
            {
              "badge": "Archive Run",
              "title": "100→500 主线续训",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-19",
              "metrics": [
                {
                  "label": "best success",
                  "value": "0.75"
                },
                {
                  "label": "best epoch",
                  "value": "300"
                },
                {
                  "label": "归档",
                  "value": "待补齐"
                }
              ],
              "outcome": "归档里已经固定 0.75@300 的结果，后续页面与专题页都可以直接复用。",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/mdit/runs/2026-04-19__unplug_charger_mdit_rgb_text_3token_100_lane_a_mainline_500_resume_e0500_20260418_005723/report/report.md"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/mdit/runs/2026-04-19__unplug_charger_mdit_rgb_text_3token_100_lane_a_mainline_500_resume_e0500_20260418_005723/archive_manifest.json"
                }
              ]
            },
            {
              "badge": "Archive Milestone",
              "title": "参考线快照",
              "summary": "该 milestone 快照已经固化，可直接作为主页和专题页的证据入口。",
              "date_key": "2026-04-19",
              "metrics": [
                {
                  "label": "类型",
                  "value": "reference_line"
                },
                {
                  "label": "缺失",
                  "value": "完整"
                }
              ],
              "outcome": "该目录已经作为 milestone 快照固化，可用于后续 best path / frozen best 展示。",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/mdit/milestones/2026-04-19__mdit_reference_line/report/report.md"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/mdit/milestones/2026-04-19__mdit_reference_line/archive_manifest.json"
                }
              ]
            }
          ]
        },
        {
          "date": "2026-04-18",
          "cards": [
            {
              "badge": "MDIT 主线",
              "title": "恢复 100→500 续训接管",
              "summary": "严格 MTDP 对照未过闸门后，理论上应该立即把预算收回到当前最佳路线继续长训，但实际接管时暴露出旧 checkpoint 的优化器状态和当前参数顺序不兼容，后台还会误把旧心跳当成新进度。",
              "date_key": "2026-04-18",
              "metrics": [
                {
                  "label": "线路",
                  "value": "MDIT 主线"
                },
                {
                  "label": "日期",
                  "value": "2026-04-18"
                },
                {
                  "label": "来源",
                  "value": "research desk"
                }
              ],
              "outcome": "MDIT 现在最重要的工作已经明确，不是再开更多相似候选，而是把当前最佳路线稳定推进到 500 epoch 并完成共享审计。",
              "links": [
                {
                  "title": "MDIT 研究日志",
                  "path": "docs/mdit/research_journal.md"
                },
                {
                  "title": "当前主线路径",
                  "path": "docs/mdit/best_path.md"
                },
                {
                  "title": "修复留痕总表",
                  "path": "docs/fixes.md"
                }
              ],
              "task_id": "mdit-mainline"
            },
            {
              "badge": "MDIT 对照线",
              "title": "严格 MTDP 对照未过共享闸门",
              "summary": "在稳定化和 faithful 对照之后，项目需要回答一个更强的问题：严格 MTDP 语义在当前共享评估链下是否真的值得替代现有 RGB+文本主线。",
              "date_key": "2026-04-18",
              "metrics": [
                {
                  "label": "线路",
                  "value": "MDIT 对照线"
                },
                {
                  "label": "日期",
                  "value": "2026-04-18"
                },
                {
                  "label": "来源",
                  "value": "research desk"
                }
              ],
              "outcome": "严格 MTDP 对照已经完成“值得不值得继续投入”的首轮回答，目前结论是否定的。",
              "links": [
                {
                  "title": "MDIT 研究日志",
                  "path": "docs/mdit/research_journal.md"
                },
                {
                  "title": "修复留痕总表",
                  "path": "docs/fixes.md"
                }
              ],
              "task_id": "mdit-mainline"
            },
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
            },
            {
              "badge": "Archive Run",
              "title": "严格 MTDP 对照",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-18",
              "metrics": [
                {
                  "label": "归档",
                  "value": "待补齐"
                },
                {
                  "label": "缺失",
                  "value": "3 项"
                }
              ],
              "outcome": "trial_score: -1.0 collapse_detected: True",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/mdit/runs/2026-04-18__unplug_charger_mdit_lane_c_mtdp_strict_fm_v1_lane_c_mtdp_strict_100_e0100_20260417_193720/report/report.md"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/mdit/runs/2026-04-18__unplug_charger_mdit_lane_c_mtdp_strict_fm_v1_lane_c_mtdp_strict_100_e0100_20260417_193720/archive_manifest.json"
                }
              ]
            }
          ]
        },
        {
          "date": "2026-04-17",
          "cards": [
            {
              "badge": "MDIT 对照线",
              "title": "稳定化与 faithful 对照完成分流，主线不再被弱候选带偏",
              "summary": "在主线锚点出现后，仍需要确认稳定化对照和 faithful 对照到底是在挑战主线，还是只是在制造更多噪声；",
              "date_key": "2026-04-17",
              "metrics": [
                {
                  "label": "线路",
                  "value": "MDIT 对照线"
                },
                {
                  "label": "日期",
                  "value": "2026-04-17"
                },
                {
                  "label": "来源",
                  "value": "research desk"
                }
              ],
              "outcome": "稳定化对照已经被判定为弱线，不再作为主方向推进；",
              "links": [
                {
                  "title": "MDIT 研究日志",
                  "path": "docs/mdit/research_journal.md"
                },
                {
                  "title": "修复留痕总表",
                  "path": "docs/fixes.md"
                }
              ],
              "task_id": "mdit-mainline"
            },
            {
              "badge": "MDIT 主线",
              "title": "共享审计确认 0.55@100 锚点并冻结当前最佳路线",
              "summary": "当时需要一条已经过共享审计链验证的 RGB+文本锚点，否则后续所有候选都没有统一参照物，也很难决定谁该继续推进。",
              "date_key": "2026-04-17",
              "metrics": [
                {
                  "label": "线路",
                  "value": "MDIT 主线"
                },
                {
                  "label": "日期",
                  "value": "2026-04-17"
                },
                {
                  "label": "来源",
                  "value": "research desk"
                }
              ],
              "outcome": "0.55@100 是当前唯一经过共享审计链确认的 RGB+文本锚点。",
              "links": [
                {
                  "title": "MDIT 研究日志",
                  "path": "docs/mdit/research_journal.md"
                },
                {
                  "title": "当前主线路径",
                  "path": "docs/mdit/best_path.md"
                },
                {
                  "title": "修复留痕总表",
                  "path": "docs/fixes.md"
                }
              ],
              "task_id": "mdit-mainline"
            },
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
            },
            {
              "badge": "Archive Run",
              "title": "faithful recipe 对照",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-17",
              "metrics": [
                {
                  "label": "归档",
                  "value": "待补齐"
                },
                {
                  "label": "缺失",
                  "value": "3 项"
                }
              ],
              "outcome": "trial_score: -1.0 collapse_detected: True",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/mdit/runs/2026-04-17__unplug_charger_mdit_lane_b_faithful_fm_v1_lane_b_faithful_100_e0100_20260417_172029/report/report.md"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/mdit/runs/2026-04-17__unplug_charger_mdit_lane_b_faithful_fm_v1_lane_b_faithful_100_e0100_20260417_172029/archive_manifest.json"
                }
              ]
            },
            {
              "badge": "Archive Run",
              "title": "RGB+文本主线 100 轮锚点",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-17",
              "metrics": [
                {
                  "label": "best success",
                  "value": "0.55"
                },
                {
                  "label": "best epoch",
                  "value": "100"
                },
                {
                  "label": "归档",
                  "value": "完整"
                }
              ],
              "outcome": "归档里已经固定 0.55@100 的结果，后续页面与专题页都可以直接复用。",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/mdit/runs/2026-04-17__unplug_charger_mdit_rgb_text_3token_100/report/report.md"
                },
                {
                  "title": "archive summary",
                  "path": "research_archive/tasks/mdit/runs/2026-04-17__unplug_charger_mdit_rgb_text_3token_100/metrics/summary.json"
                },
                {
                  "title": "archive audit",
                  "path": "research_archive/tasks/mdit/runs/2026-04-17__unplug_charger_mdit_rgb_text_3token_100/metrics/audit_report.json"
                }
              ]
            },
            {
              "badge": "Archive Run",
              "title": "平滑动作稳定化对照",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-17",
              "metrics": [
                {
                  "label": "归档",
                  "value": "待补齐"
                },
                {
                  "label": "缺失",
                  "value": "3 项"
                }
              ],
              "outcome": "trial_score: -1.0 collapse_detected: True",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/mdit/runs/2026-04-17__unplug_charger_mdit_rgb_text_fm_v1_lane_a_stabilized_100_e0100_20260417_105544/report/report.md"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/mdit/runs/2026-04-17__unplug_charger_mdit_rgb_text_fm_v1_lane_a_stabilized_100_e0100_20260417_105544/archive_manifest.json"
                }
              ]
            },
            {
              "badge": "Archive Run",
              "title": "平滑动作稳定化对照",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-17",
              "metrics": [
                {
                  "label": "best success",
                  "value": "0.35"
                },
                {
                  "label": "best epoch",
                  "value": "100"
                },
                {
                  "label": "归档",
                  "value": "待补齐"
                }
              ],
              "outcome": "归档里已经固定 0.35@100 的结果，后续页面与专题页都可以直接复用。",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/mdit/runs/2026-04-17__unplug_charger_mdit_rgb_text_fm_v1_lane_a_stabilized_100_e0100_20260417_112329/report/report.md"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/mdit/runs/2026-04-17__unplug_charger_mdit_rgb_text_fm_v1_lane_a_stabilized_100_e0100_20260417_112329/archive_manifest.json"
                }
              ]
            },
            {
              "badge": "Archive Milestone",
              "title": "冻结最优快照",
              "summary": "该 milestone 快照已经固化，可直接作为主页和专题页的证据入口。",
              "date_key": "2026-04-17",
              "metrics": [
                {
                  "label": "类型",
                  "value": "frozen_best_snapshot"
                },
                {
                  "label": "缺失",
                  "value": "完整"
                }
              ],
              "outcome": "该目录已经作为 milestone 快照固化，可用于后续 best path / frozen best 展示。",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/mdit/milestones/2026-04-17__2026_04_17_110536_lane_a_mainline_epoch100_s055/report/report.md"
                },
                {
                  "title": "archive summary",
                  "path": "research_archive/tasks/mdit/milestones/2026-04-17__2026_04_17_110536_lane_a_mainline_epoch100_s055/metrics/summary.json"
                },
                {
                  "title": "archive audit",
                  "path": "research_archive/tasks/mdit/milestones/2026-04-17__2026_04_17_110536_lane_a_mainline_epoch100_s055/metrics/audit_report.json"
                }
              ]
            },
            {
              "badge": "Archive Milestone",
              "title": "冻结最优快照",
              "summary": "该 milestone 快照已经固化，可直接作为主页和专题页的证据入口。",
              "date_key": "2026-04-17",
              "metrics": [
                {
                  "label": "类型",
                  "value": "frozen_best_snapshot"
                },
                {
                  "label": "缺失",
                  "value": "完整"
                }
              ],
              "outcome": "该目录已经作为 milestone 快照固化，可用于后续 best path / frozen best 展示。",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/mdit/milestones/2026-04-17__current_provisional_best/report/report.md"
                },
                {
                  "title": "archive summary",
                  "path": "research_archive/tasks/mdit/milestones/2026-04-17__current_provisional_best/metrics/summary.json"
                },
                {
                  "title": "archive audit",
                  "path": "research_archive/tasks/mdit/milestones/2026-04-17__current_provisional_best/metrics/audit_report.json"
                }
              ]
            }
          ]
        },
        {
          "date": "2026-04-16",
          "cards": [
            {
              "badge": "MDIT 主线",
              "title": "共享评估契约与后台守护链固化为标准执行方式",
              "summary": "即便主线配方已经回收完成，只要训练口径、评估口径、冠军冻结和后台接管没有锁死，后续 run 依然会因为配方漂移或中断恢复而失去继承关系。",
              "date_key": "2026-04-16",
              "metrics": [
                {
                  "label": "线路",
                  "value": "MDIT 主线"
                },
                {
                  "label": "日期",
                  "value": "2026-04-16"
                },
                {
                  "label": "来源",
                  "value": "research desk"
                }
              ],
              "outcome": "MDIT 从这一步起不再只是零散实验集合，而是一条可托管、可恢复、可比较的研究线；",
              "links": [
                {
                  "title": "MDIT 执行手册",
                  "path": "docs/mdit/2026-04-16-mdit-execution-manual.md"
                },
                {
                  "title": "MDIT 研究日志",
                  "path": "docs/mdit/research_journal.md"
                },
                {
                  "title": "当前主线路径",
                  "path": "docs/mdit/best_path.md"
                }
              ],
              "task_id": "mdit-mainline"
            },
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
        },
        {
          "date": "2026-04-15",
          "cards": [
            {
              "badge": "MDIT 主线",
              "title": "faithful RGB+文本默认路径与共享评估口径定版",
              "summary": "在这一步之前，MDIT 主线仍混入了点云兼容默认路径、PDIT 语义残留和 EMA 默认分支，导致“当前到底在跑什么配方”无法一句话说清。",
              "date_key": "2026-04-15",
              "metrics": [
                {
                  "label": "线路",
                  "value": "MDIT 主线"
                },
                {
                  "label": "日期",
                  "value": "2026-04-15"
                },
                {
                  "label": "来源",
                  "value": "research desk"
                }
              ],
              "outcome": "从这一步开始，MDIT 主线终于拥有可以持续复现和解释的默认配方；",
              "links": [
                {
                  "title": "修复留痕总表",
                  "path": "docs/fixes.md"
                },
                {
                  "title": "MDIT 执行手册",
                  "path": "docs/mdit/2026-04-16-mdit-execution-manual.md"
                }
              ],
              "task_id": "mdit-mainline"
            }
          ]
        },
        {
          "date": "2026-04-13",
          "cards": [
            {
              "badge": "MDIT 主线",
              "title": "早期兼容排查确认混合消融不能直接支持结构结论",
              "summary": "MDIT 早期在 RGB、点云、PDIT backbone、PDIT 条件路径等多种改动之间来回排查时，表面上虽然不断有训练现象和验证损失，但很难说明到底是哪一个因素真正起作用。",
              "date_key": "2026-04-13",
              "metrics": [
                {
                  "label": "线路",
                  "value": "MDIT 主线"
                },
                {
                  "label": "日期",
                  "value": "2026-04-13"
                },
                {
                  "label": "来源",
                  "value": "research desk"
                }
              ],
              "outcome": "MDIT 不能靠“把能跑的东西拼起来”推进；",
              "links": [
                {
                  "title": "PDIT 与 MDIT 定位对照",
                  "path": "docs/pdit-vs-mdit.md"
                },
                {
                  "title": "修复留痕总表",
                  "path": "docs/fixes.md"
                }
              ],
              "task_id": "mdit-mainline"
            }
          ]
        }
      ],
      "findings": [
        {
          "title": "早期锚点是 0.55@100，但长训主线已经把 300/500 拉到 0.75",
          "body": "当前最稳的早期锚点仍是 0.55@100 的 RGB+文本主线；在同一条 best-route lineage 上，100→500 续训后的共享审计已经给出 0.75@300 和 0.75@500，说明长训确实把行为上限抬了上去。"
        },
        {
          "title": "平滑动作和其他弱对照没有解决核心失败模式",
          "body": "已知失败大头仍是“动作还没做完就到时间上限”，说明只是平滑 action head 或轻微换 recipe 并不能直接解决 MDIT 的行为瓶颈。"
        },
        {
          "title": "当前缺口不是再开新线，而是补齐 100 epoch 点位并收束共享审计叙事",
          "body": "这次 500 续训 run 的共享审计已经证明 300/500 表现提升到 0.75，但因为 epoch_0100 点位缺失，trial_score 仍按 collapse 落档。下一步更像是补齐审计口径，而不是再新开相似路线。"
        }
      ],
      "evidence_links": [
        {
          "title": "archive 报告 · Put books on bookshelf MDIT mainline 50…",
          "path": "research_archive/tasks/mdit/runs/2026-04-21__put_books_on_bookshelf_mdit_rgb_text_3token_500/report/report.md",
          "summary": "archive 内的背景、核心结果与证据索引已经整理成可直接消费的报告页。",
          "label": "打开归档报告"
        },
        {
          "title": "archive summary · Put books on bookshelf MDIT mainline 50…",
          "path": "research_archive/tasks/mdit/runs/2026-04-21__put_books_on_bookshelf_mdit_rgb_text_3token_500/metrics/summary.json",
          "summary": "训练后固化的结构化 summary，会作为后续图表和专题页的统一输入。",
          "label": "打开 summary"
        },
        {
          "title": "archive 报告 · audit_wandb_run",
          "path": "research_archive/tasks/mdit/runs/2026-04-20__audit_wandb_run/report/report.md",
          "summary": "archive 内的背景、核心结果与证据索引已经整理成可直接消费的报告页。",
          "label": "打开归档报告"
        },
        {
          "title": "archive summary · audit_wandb_run",
          "path": "research_archive/tasks/mdit/runs/2026-04-20__audit_wandb_run/metrics/summary.json",
          "summary": "训练后固化的结构化 summary，会作为后续图表和专题页的统一输入。",
          "label": "打开 summary"
        },
        {
          "title": "archive audit · audit_wandb_run",
          "path": "research_archive/tasks/mdit/runs/2026-04-20__audit_wandb_run/metrics/audit_report.json",
          "summary": "共享审计或行为审计结果已复制进 archive，可直接作为后续展示证据。",
          "label": "打开 audit"
        },
        {
          "title": "archive 报告 · collapse_run",
          "path": "research_archive/tasks/mdit/runs/2026-04-20__collapse_run/report/report.md",
          "summary": "archive 内的背景、核心结果与证据索引已经整理成可直接消费的报告页。",
          "label": "打开归档报告"
        },
        {
          "title": "MDIT 关键结果表",
          "path": "research_archive/tasks/mdit/media/tables/mdit_key_results.csv",
          "summary": "结构化汇总主线、stabilized 与对照路线的当前判断。",
          "label": "查看原始记录"
        },
        {
          "title": "MDIT 技术模块表",
          "path": "research_archive/tasks/mdit/media/tables/mdit_core_modules.csv",
          "summary": "结构化汇总多模态主线当前已经落成的核心技术模块。",
          "label": "查看原始记录"
        },
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
          "title": "500 续训审计记录",
          "path": "autoresearch_records/unplug_charger_mdit_rgb_text_3token_100__lane_a_mainline_500_resume__e0500__20260418_005723.json",
          "summary": "记录了 100→500 续训主线的 0.75@300 / 0.75@500 结果，以及当前 trial_score 仍为 -1 的原因。",
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
        "mdit-audit-rank",
        "mdit-loss-curve",
        "mdit-mse-curve"
      ],
      "media_items": [
        {
          "task_id": "mdit-mainline",
          "kind": "image",
          "title": "MDIT RGB+Text 主线封面",
          "caption": "作为当前 MDIT 主线封面，概括多视角视觉、文本条件与动作生成之间的整体结构。",
          "path": "research_archive/tasks/mdit/media/demo/images/mtdp_architecture.png",
          "showcase_preview": false
        },
        {
          "task_id": "mdit-mainline",
          "kind": "video",
          "title": "MDIT RGB+Text 关门仿真演示",
          "caption": "该片段来自 RGB+Text 主线训练后的关门仿真，说明语言条件已经能落到可执行动作轨迹。它对应的是一条更贴近 VLA / 世界模型接口的多模态策略路径：先对齐视觉与文本语义，再生成 action chunk。",
          "path": "research_archive/tasks/mdit/media/demo/videos/关门仿真-1.mp4",
          "showcase_preview": false
        }
      ],
      "home_entries": [
        {
          "date": "2026-04-19",
          "group": "done",
          "task_id": "mdit-mainline",
          "branch_ids": [
            "mdit"
          ],
          "badge": "MDIT 主线",
          "title": "MDIT 主线固化 0.75@500，并收束出可复现的多模态配方",
          "summary": "当前工作重点已经从继续开相似对照，转成补齐共享审计点位，并把 3-token 条件组织、分阶段多模态适配、encoder-decoder DiT 与 uniform FM 路径固定为主线配方。",
          "metrics": [
            {
              "label": "best success@20",
              "value": "0.75"
            },
            {
              "label": "100 epoch 锚点",
              "value": "0.55"
            },
            {
              "label": "best epoch",
              "value": "300"
            }
          ],
          "meta": "长训结果与主线配方已收束",
          "path": "homepage/tasks/mdit-mainline/"
        },
        {
          "date": "2026-04-17",
          "group": "done",
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
      "prefer_home_entries": true,
      "preserve_report_intro": true,
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
        },
        "resume_audit": {
          "best_success_rate": 0.75,
          "best_success_epoch": 300,
          "success_300": 0.75,
          "success_500": 0.75,
          "trial_score": -1.0
        }
      },
      "chart_media_items": [
        {
          "id": "archive-chart-mdit-mainline-01-mdit-rank-overview-svg",
          "type": "media_chart",
          "title": "MDIT 关键结果排行",
          "description": "把主线关键节点和共享审计结果放到一张图里，直接看当前真正成立的阶段结果。",
          "path": "research_archive/tasks/mdit/media/charts/01-mdit_rank_overview.svg",
          "kind": "image",
          "source_kind": "manual",
          "note": "300 / 500 epoch 已经超过早期 0.55@100 锚点，因此这条线后面更应该看 loss 与 MSE 怎样支撑这个提升。"
        },
        {
          "id": "archive-chart-mdit-mainline-02-mdit-mainline-loss-curve-svg",
          "type": "media_chart",
          "title": "MDIT 主线 loss 趋势",
          "description": "围绕 100→500 主线续训，直接看 train / valid total loss 如何收束。",
          "path": "research_archive/tasks/mdit/media/charts/02-mdit_mainline_loss_curve.svg",
          "kind": "image",
          "source_kind": "manual",
          "note": "使用 W&B API 抓取完整 history，展示主线真实训练曲线。"
        },
        {
          "id": "archive-chart-mdit-mainline-03-mdit-mainline-mse-curve-svg",
          "type": "media_chart",
          "title": "MDIT 主线 MSE 变化",
          "description": "把 xyz / rot6d / grip 三条误差拆开，解释长训结果为什么能抬到 0.75。",
          "path": "research_archive/tasks/mdit/media/charts/03-mdit_mainline_mse_curve.svg",
          "kind": "image",
          "source_kind": "manual",
          "note": "使用 W&B API 抓取 valid mse_xyz / mse_rot6d / mse_grip 全量 history。"
        }
      ]
    },
    {
      "id": "act-lerobot-demo",
      "title": "Dummy V2 LeRobot + ACT 具身模仿学习 Demo",
      "summary": "把自研机械臂、世界坐标示教、LeRobot v3 数据、多视角 RGB-D 感知、Isaac 预训练和 ACT 策略部署串成一条可展示的具身模仿学习闭环。",
      "core_summary": "这条线的重点不是再解释一次控制平台，而是突出自研机械臂如何被整理成 LeRobot + ACT 可直接消费的具身模仿学习闭环。",
      "status": "已完成",
      "status_group": "done",
      "page_path": "homepage/tasks/act-lerobot-demo/",
      "branch_ids": [
        "act"
      ],
      "latest_update": "2026-05-01",
      "hero_metrics": [
        {
          "label": "episodes",
          "value": "5"
        },
        {
          "label": "frames",
          "value": "4379"
        },
        {
          "label": "fps",
          "value": "10Hz"
        }
      ],
      "report_intro": "ACT 这条线现在已经从“自研机械臂能不能采到数据”推进到“LeRobot 数据、Isaac warm-start 和 ACT 部署能否组成可展示的具身模仿学习闭环”。页面重点是把这条工作线里真正可复用的技术资产讲清楚。",
      "summary_cards": [
        {
          "eyebrow": "LeRobot",
          "title": "把自研机械臂整理成 LeRobot 可直接消费的数据和回放入口",
          "body": "这条线真正完成的不是单个 demo 视频，而是把世界坐标示教、多视角感知、关节安全回放和 LeRobot v3 结构统一成同一套具身数据接口。",
          "metrics": [
            {
              "label": "episodes",
              "value": "5"
            },
            {
              "label": "frames",
              "value": "4379"
            },
            {
              "label": "camera",
              "value": "3"
            }
          ]
        },
        {
          "eyebrow": "ACT",
          "title": "ACT 已经在 Dummy V2 上完成可展示的方块操作部署",
          "body": "策略侧不再停留在离线训练说明，而是能够接到真实机械臂的数据、通过安全链下发动作，并完成方块抓取与叠放 demo。",
          "metrics": [
            {
              "label": "policy",
              "value": "ACT"
            },
            {
              "label": "task",
              "value": "抓取 / 叠放"
            },
            {
              "label": "deploy",
              "value": "已完成"
            }
          ]
        }
      ],
      "core_tables": [
        {
          "title": "ACT 核心能力模块",
          "columns": [
            "模块",
            "当前做法",
            "直接意义",
            "后续扩展"
          ],
          "rows": [
            [
              "世界坐标示教",
              "操作员先在任务空间给出 TCP 路线，再经 posture-biased IK、安全边界和连续性约束生成动作。",
              "示范数据直接对应“机器人该怎么完成任务”，而不是低层关节抖动。",
              "可自然接语言子任务、VLA 指令和更长 horizon 任务分解。"
            ],
            [
              "LeRobot v3 数据层",
              "低维状态写 Parquet，多相机画面写 MP4，并保留真机安全回放索引。",
              "训练、审计和真机 replay 统一到同一份数据资产里。",
              "后续可直接接 ACT、Diffusion Policy、VLA 或世界模型。"
            ],
            [
              "多视角 RGB-D 感知",
              "D405 RGB、D405 Depth 伪彩和 UVC RGB 与 proprioception 同步记录。",
              "策略同时拿到近景几何线索和外部全局视角，监督信号更完整。",
              "可继续扩展语言条件或多任务视觉提示。"
            ],
            [
              "双动作接口",
              "同时保存任务空间 action 和 action.joints，部署优先走 joint replay 安全链。",
              "兼顾策略学习表达能力和真机执行稳定性。",
              "后续可在任务空间接口上继续接在线规划或 VLA 输出。"
            ],
            [
              "Sim2Real warm-start",
              "Isaac Lab 先做 Reach / PreGrasp / GraspLift 课程预训练，再用真实 rollout 微调 ACT。",
              "把稀缺真机数据留给接触与策略细化，而不是从零学基础运动。",
              "可继续扩展到更多桌面 manipulation 任务和 sim2real 对齐研究。"
            ]
          ],
          "note": "这张表强调的是 ACT 线已经沉淀下来的技术资产，而不是单次 demo 的叙事包装。"
        },
        {
          "title": "ACT 数据与系统验收",
          "columns": [
            "条目",
            "当前结果",
            "当前意义"
          ],
          "rows": [
            [
              "LeRobotDataset",
              "5 个 cleaned episodes / 4379 帧 / 10Hz",
              "证明数据已经过清洗，能直接进入训练与回放。"
            ],
            [
              "视觉观测",
              "3 路输入：D405 RGB + D405 Depth + UVC RGB",
              "支撑 ACT 当前部署，也为 VLA / 世界模型保留多模态入口。"
            ],
            [
              "机器人接口",
              "6DoF 机械臂 + 二值夹爪 + joint replay",
              "把策略输出落到真实执行时仍能保持安全和稳定。"
            ],
            [
              "仿真预训练",
              "Isaac PPO 三阶段课程：Reach / PreGrasp / GraspLift",
              "说明这条线不仅能采数据，也能往 sim2real 预训练推进。"
            ],
            [
              "部署结果",
              "ACT 叠方块 demo 已打通",
              "形成可展示的具身模仿学习闭环，而不只是离线训练记录。"
            ]
          ],
          "note": "ACT 这条线当前最适合展示的是“系统闭环已经成立”，因此页面优先放数据、接口和部署验收，而不是堆训练日志。"
        }
      ],
      "timeline_groups": [
        {
          "date": "2026-05-01",
          "cards": [
            {
              "badge": "Demo",
              "title": "LeRobot 采集、ACT 部署与 VLA 扩展接口在同一天收束成可展示闭环",
              "summary": "三路相机、LeRobot v3 数据集、真实回放索引和 ACT demo 在这一天被整理成统一成果线，项目从“控制平台”正式推进到“具身模仿学习 demo”。",
              "metrics": [
                {
                  "label": "episodes",
                  "value": "5"
                },
                {
                  "label": "frames",
                  "value": "4379"
                },
                {
                  "label": "demo",
                  "value": "已打通"
                }
              ],
              "outcome": "ACT 线已经形成完整闭环，后续可以在同一数据和动作接口上继续挂 VLA / 世界模型研究。",
              "links": [
                {
                  "title": "ACT / LeRobot 实践记录",
                  "path": "research_archive/tasks/act/notes/DummyV2_LeRobot_ACT实践记录.md"
                },
                {
                  "title": "关键结果表",
                  "path": "research_archive/tasks/act/media/tables/act_key_results.csv"
                }
              ]
            }
          ]
        },
        {
          "date": "2026-04-29",
          "cards": [
            {
              "badge": "RL Warm-start",
              "title": "Isaac Lab PPO 课程预训练把接触前后动作拆成三阶段",
              "summary": "Reach、PreGrasp、GraspLift 被拆成统一动作接口下的三阶段课程，用并行环境把空间移动与抓取抬升的基础先验先学出来。",
              "metrics": [
                {
                  "label": "curriculum",
                  "value": "3 阶段"
                },
                {
                  "label": "parallel envs",
                  "value": "128"
                },
                {
                  "label": "action dim",
                  "value": "7"
                }
              ],
              "outcome": "真实 ACT 训练不必从零学习基础运动，sim2real 桥接路线开始成立。",
              "links": [
                {
                  "title": "ACT / LeRobot 实践记录",
                  "path": "research_archive/tasks/act/notes/DummyV2_LeRobot_ACT实践记录.md"
                }
              ]
            }
          ]
        },
        {
          "date": "2026-04-27",
          "cards": [
            {
              "badge": "Hardware",
              "title": "夹爪固件、电流阈值和受保护开合逻辑完成定版",
              "summary": "线轨夹爪的静摩擦、电流阈值和 disable 保护被真正落到控制链里，夹爪不再被当成普通关节直接暴力驱动。",
              "metrics": [
                {
                  "label": "夹爪控制",
                  "value": "独立命令"
                },
                {
                  "label": "保护",
                  "value": "open / close / disable"
                },
                {
                  "label": "静摩擦",
                  "value": "约 0.7A"
                }
              ],
              "outcome": "真实回放和策略部署终于有了稳定、可重复的末端执行条件。",
              "links": [
                {
                  "title": "ACT / LeRobot 实践记录",
                  "path": "research_archive/tasks/act/notes/DummyV2_LeRobot_ACT实践记录.md"
                }
              ]
            }
          ]
        },
        {
          "date": "2026-04-24",
          "cards": [
            {
              "badge": "Teleoperation",
              "title": "世界坐标 Jog、MuJoCo 同步和 posture-biased IK 串成同一条示教链路",
              "summary": "操作员输入先落到 TCP，再经 IK、连续性约束和安全边界转成可记录动作，示教从关节拖动升级成任务空间路线采集。",
              "metrics": [
                {
                  "label": "动作口径",
                  "value": "TCP → joints"
                },
                {
                  "label": "预览",
                  "value": "MuJoCo"
                },
                {
                  "label": "目标",
                  "value": "任务空间示教"
                }
              ],
              "outcome": "示范数据语义更干净，也更适合后续 ACT / VLA 学习。",
              "links": [
                {
                  "title": "ACT / LeRobot 实践记录",
                  "path": "research_archive/tasks/act/notes/DummyV2_LeRobot_ACT实践记录.md"
                }
              ]
            }
          ]
        },
        {
          "date": "2026-04-21",
          "cards": [
            {
              "badge": "Control",
              "title": "先把真机控制、边界保护和回放安全链打稳",
              "summary": "在引入 LeRobot 和 ACT 之前，先明确关节限位、用户软边界、回放节奏和 CAN / 串口保护，确保后续学习链路建立在安全控制底座上。",
              "metrics": [
                {
                  "label": "robot",
                  "value": "6DoF + 二值夹爪"
                },
                {
                  "label": "回放",
                  "value": "受保护"
                },
                {
                  "label": "目标",
                  "value": "长期复用"
                }
              ],
              "outcome": "ACT 这条线从一开始就不是孤立 demo，而是建立在可长期复用的控制与采集平台之上。",
              "links": [
                {
                  "title": "ACT / LeRobot 实践记录",
                  "path": "research_archive/tasks/act/notes/DummyV2_LeRobot_ACT实践记录.md"
                }
              ]
            }
          ]
        }
      ],
      "findings": [
        {
          "title": "ACT 线真正完成的是“数据-策略-回放”闭环，而不是单个视频演示",
          "body": "世界坐标示教、多视角 RGB-D、LeRobot v3、Isaac 预训练和 ACT 部署已经共用同一套动作与数据口径，这比单独展示一次 rollout 更有长期价值。"
        },
        {
          "title": "世界坐标示教让示范数据从“关节痕迹”升级成“任务空间监督”",
          "body": "人类输入先定义任务空间目标，再经 IK 和安全过滤转成动作，这让后续模仿学习更直接对齐任务意图，也更适合继续接语言条件和子任务分解。"
        },
        {
          "title": "这条线天然贴近 VLA / 世界模型，而不是只能停在低层行为克隆",
          "body": "当前数据已经同时具备多视角图像、低维状态、动作序列和真实 replay 接口，后续可以在同一底座上继续接入语言、视频 latent 和长 horizon 预测模型。"
        }
      ],
      "evidence_links": [
        {
          "title": "ACT / LeRobot 实践记录",
          "path": "research_archive/tasks/act/notes/DummyV2_LeRobot_ACT实践记录.md",
          "summary": "",
          "label": "查看原始记录"
        },
        {
          "title": "ACT 关键结果表",
          "path": "research_archive/tasks/act/media/tables/act_key_results.csv",
          "summary": "把 cleaned episodes、frames、相机流和预训练阶段整理成结构化结果表。",
          "label": "查看原始记录"
        },
        {
          "title": "ACT 核心模块表",
          "path": "research_archive/tasks/act/media/tables/act_core_modules.csv",
          "summary": "把世界坐标示教、LeRobot 数据层、ACT 输出接口和 sim2real warm-start 压成统一模块表。",
          "label": "查看原始记录"
        }
      ],
      "chart_ids": [
        "act-dataset-overview",
        "act-stack-coverage",
        "act-policy-interface"
      ],
      "media_items": [
        {
          "task_id": "act-lerobot-demo",
          "kind": "video",
          "title": "LeRobot + ACT 叠方块 Demo",
          "caption": "展示 Dummy V2 基于 LeRobot v3 数据和 ACT 策略完成方块抓取与叠放的具身模仿学习 demo。这条线已经把采集、训练、部署和安全回放接成闭环，并为后续 VLA / 世界模型继续接入保留了统一动作接口。",
          "path": "research_archive/tasks/act/media/demo/videos/01-LeRobot框架与ACTdemo.mp4",
          "showcase_preview": false
        }
      ],
      "home_entries": [
        {
          "date": "2026-05-01",
          "group": "done",
          "task_id": "act-lerobot-demo",
          "branch_ids": [
            "act"
          ],
          "badge": "ACT Demo",
          "title": "LeRobot + ACT 具身模仿学习闭环完成落地",
          "summary": "把自研 Dummy V2 机械臂、世界坐标示教、LeRobot v3、多视角 RGB-D、Isaac warm-start 和 ACT 部署串成了一条可展示的具身模仿学习工作线。",
          "metrics": [
            {
              "label": "episodes",
              "value": "5"
            },
            {
              "label": "frames",
              "value": "4379"
            },
            {
              "label": "demo",
              "value": "已打通"
            }
          ],
          "meta": "已完成 · ACT 模仿学习线",
          "path": "homepage/tasks/act-lerobot-demo/"
        }
      ],
      "prefer_home_entries": true,
      "task_badge": "ACT Demo",
      "docs": [
        "research_archive/tasks/act/notes/DummyV2_LeRobot_ACT实践记录.md"
      ],
      "chart_media_items": []
    },
    {
      "id": "lingbot-va-world-model",
      "title": "LingBot-VA 世界模型后训练切入",
      "summary": "围绕视频 latent + 动作联合建模的后训练项目，先把单任务 smoke、离线 demo 导出与单卡显存边界摸清，再往正式世界模型训练与评测推进。",
      "core_summary": "这页先把 LingBot-VA 世界模型后训练已经站住的能力讲清楚：单任务 smoke、离线 demo 导出和单卡边界都已经有证据，再往更正式的训练与评测推进。",
      "status": "推进中",
      "status_group": "in_progress",
      "page_path": "homepage/tasks/lingbot-va-world-model/",
      "branch_ids": [
        "lingbot-va"
      ],
      "latest_update": "2026-04-19",
      "hero_metrics": [
        {
          "label": "smoke step",
          "value": "1"
        },
        {
          "label": "offline action_mse",
          "value": "0.0067"
        },
        {
          "label": "当前阶段",
          "value": "smoke+demo"
        }
      ],
      "report_intro": "LingBot-VA 这条线现在最重要的不是直接报一个 manipulation success rate，而是已经把视频 latent + 动作联合建模的最小训练闭环、离线 demo 可视化和单卡训练边界全部摸清。",
      "summary_cards": [
        {
          "eyebrow": "World Model",
          "title": "视频 latent + 动作联合后训练入口已打通",
          "body": "这条线已经从“只会看代码”推进到“能跑 smoke、能导 demo、知道算力边界”，适合继续往世界模型 / VLA 后训练深入。",
          "metrics": [
            {
              "label": "任务",
              "value": "click_bell"
            },
            {
              "label": "模式",
              "value": "single-task smoke"
            },
            {
              "label": "状态",
              "value": "推进中"
            }
          ]
        }
      ],
      "core_tables": [
        {
          "title": "LingBot-VA 关键结果对照",
          "columns": [
            "验证项",
            "当前结果",
            "当前含义",
            "后续推进"
          ],
          "rows": [
            [
              "单任务 smoke",
              "1 step + checkpoint + WandB",
              "最小训练闭环已经打通",
              "继续放大到更长步数或更完整训练对象"
            ],
            [
              "离线 demo exporter",
              "video_mse=0.0036 / action_mse=0.0067",
              "预测视频与动作已经能一起导出并量化",
              "接正式评测脚本或更多任务片段"
            ],
            [
              "单卡全参数 post-train",
              "当前受限",
              "24GB 单卡不能直接做全参数 RoboTwin post-train",
              "转向多卡或参数高效训练方案"
            ],
            [
              "任务定位",
              "世界模型 / VLA 后训练",
              "不再把这条线误解成 RL success rate 训练",
              "把重点放到模型结构、训练策略和评测闭环"
            ]
          ],
          "note": "这张表先回答“这条世界模型线已经站住了什么”，再讨论更长训练或更重算力配置。"
        },
        {
          "title": "LingBot-VA 核心技术模块",
          "columns": [
            "技术模块",
            "当前采用",
            "当前作用",
            "扩展方向"
          ],
          "rows": [
            [
              "视频 latent + 动作联合建模",
              "同一 transformer 同时建模视频 latent、动作与文本条件",
              "让世界模型和动作生成在一个统一 backbone 里对齐。",
              "继续往更完整的 VLA / 世界模型评测推进。"
            ],
            [
              "SMOKE_MODE 最小训练链",
              "只训练输出头，先验证训练闭环",
              "把工程可行性和方法效果拆开，先确认训练链能跑通。",
              "逐步放开更多层，探索参数高效训练。"
            ],
            [
              "离线 demo exporter",
              "prediction / metrics / summary 一起导出",
              "让这条线不只剩下 loss，而是有视频和动作层面的可视化证据。",
              "接更多任务、更多片段和正式评测脚本。"
            ],
            [
              "语言条件与任务语义",
              "文本 embedding 已进入训练输入",
              "已经具备向语言监督与更强任务条件控制扩展的基础。",
              "后续可继续往 subtask、instruction 或更强 VLA 条件推进。"
            ]
          ],
          "note": "这张表强调的是世界模型后训练真正已经落地的技术模块，而不是把外部仓库里的全部组件都搬上来。"
        }
      ],
      "timeline_groups": [
        {
          "date": "2026-04-19",
          "cards": [
            {
              "badge": "Smoke",
              "title": "单任务单卡 smoke 训练链路跑通",
              "summary": "先把 LingBot-VA 的最小训练闭环跑通：单任务数据读取、前向、反向、optimizer update、checkpoint 保存和 WandB 记录都在一条链上验证过了。",
              "metrics": [
                {
                  "label": "latent_loss",
                  "value": "0.0422"
                },
                {
                  "label": "action_loss",
                  "value": "0.7244"
                },
                {
                  "label": "grad_norm",
                  "value": "3.78"
                }
              ],
              "outcome": "世界模型后训练的最小可复现入口已经站住，后续不需要再从“机器能不能跑”重新摸索。",
              "links": [
                {
                  "title": "项目速读",
                  "path": "homepage/external/lingbot_va/docs/project_guide.md"
                },
                {
                  "title": "阶段 desk",
                  "path": "homepage/external/lingbot_va/docs/research_desk.md"
                }
              ]
            },
            {
              "badge": "Demo Export",
              "title": "离线 demo exporter 打通本地单任务验证",
              "summary": "预测视频、动作对照和误差指标已经能从同一次导出里一起产出，不再只是拿 loss 判断这条线有没有学到东西。",
              "metrics": [
                {
                  "label": "video_mse",
                  "value": "0.0036"
                },
                {
                  "label": "action_mse",
                  "value": "0.0067"
                },
                {
                  "label": "pred frames",
                  "value": "45"
                }
              ],
              "outcome": "这条线已经从“只有训练日志”推进到“有视频预测和离线指标”的可展示阶段。",
              "links": [
                {
                  "title": "离线导出总结",
                  "path": "homepage/external/lingbot_va/eval/summary.json"
                },
                {
                  "title": "summary.csv",
                  "path": "homepage/external/lingbot_va/eval/summary.csv"
                }
              ]
            },
            {
              "badge": "Boundary",
              "title": "单卡全参数 post-train 的真实边界被明确暴露出来",
              "summary": "当前 24GB 单卡不能直接承载全参数 RoboTwin post-train，世界模型这条线后面必须朝多卡或参数高效训练方案推进。",
              "metrics": [
                {
                  "label": "显存",
                  "value": "24GB"
                },
                {
                  "label": "full FT",
                  "value": "受限"
                },
                {
                  "label": "下一步",
                  "value": "多卡 / PEFT"
                }
              ],
              "outcome": "后续研究方向已经从“再硬挤单卡”切到“明确训练策略与评测链路”，路线判断更清晰了。",
              "links": [
                {
                  "title": "阶段 desk",
                  "path": "homepage/external/lingbot_va/docs/research_desk.md"
                },
                {
                  "title": "问题修复日志",
                  "path": "homepage/external/lingbot_va/docs/fixes.md"
                }
              ]
            }
          ]
        }
      ],
      "findings": [
        {
          "title": "这条线本质上是视频 latent + 动作联合建模，不是 RL 成功率训练",
          "body": "LingBot-VA 当前更接近视频世界模型 / VLA 后训练：输入是视频 latent、动作序列和文本条件，训练目标是新的 transformer 权重，真正的任务效果要靠后续推理或评测去验证。"
        },
        {
          "title": "当前最值钱的进展不是数值有多高，而是最小训练闭环和离线展示链已经打通",
          "body": "Smoke 路径、checkpoint 保存、WandB 记录和离线 demo exporter 一起站住之后，后面可以把主要精力放到训练策略和评测，而不是继续做纯工程排障。"
        },
        {
          "title": "单卡全参数训练受限已经是明确事实，后续推进要围绕多卡或参数高效训练来设计",
          "body": "当前机器不能直接承载全参数单卡 RoboTwin post-train，这个边界已经在工程上被验证过了；下一步更重要的是如何缩窄训练对象、调度算力和构造评测闭环。"
        }
      ],
      "evidence_links": [
        {
          "title": "LingBot-VA 项目速读",
          "path": "homepage/external/lingbot_va/docs/project_guide.md",
          "summary": "快速说明视频 latent、动作序列、文本条件和 transformer 后训练之间的关系。",
          "label": "查看原始记录"
        },
        {
          "title": "LingBot-VA 研究 desk",
          "path": "homepage/external/lingbot_va/docs/research_desk.md",
          "summary": "当前阶段结论、成功 smoke、离线 demo exporter 与机器边界的集中总结。",
          "label": "查看原始记录"
        },
        {
          "title": "LingBot-VA fixes",
          "path": "homepage/external/lingbot_va/docs/fixes.md",
          "summary": "保留 smoke、导出链和单卡显存问题的事实源。",
          "label": "查看原始记录"
        },
        {
          "title": "LingBot-VA docs README",
          "path": "homepage/external/lingbot_va/docs/README.md",
          "summary": "外部仓库文档入口。",
          "label": "查看原始记录"
        },
        {
          "title": "离线导出 summary.json",
          "path": "homepage/external/lingbot_va/eval/summary.json",
          "summary": "包含 video_mse、action_mse 与导出参数。",
          "label": "查看原始记录"
        },
        {
          "title": "离线导出 summary.csv",
          "path": "homepage/external/lingbot_va/eval/summary.csv",
          "summary": "适合后续直接进表格或专题页。",
          "label": "查看原始记录"
        },
        {
          "title": "Smoke WandB summary",
          "path": "homepage/external/lingbot_va/wandb/smoke-wandb-summary.json",
          "summary": "保留 latent_loss、action_loss、grad_norm 的最小训练指标。",
          "label": "查看原始记录"
        }
      ],
      "chart_ids": [
        "lingbot-smoke-metrics",
        "lingbot-offline-eval",
        "lingbot-system-boundary"
      ],
      "media_items": [
        {
          "task_id": "lingbot-va-world-model",
          "kind": "image",
          "title": "LingBot-VA 世界模型线封面",
          "caption": "用 RoboTwin 任务场景作为切入口，展示这条线当前聚焦的视频 latent + 动作联合后训练方向。",
          "path": "research_archive/tasks/lingbot/media/demo/images/00-lingbot-va-cover.png",
          "showcase_preview": true
        }
      ],
      "home_entries": [
        {
          "date": "2026-04-20",
          "group": "in_progress",
          "task_id": "lingbot-va-world-model",
          "branch_ids": [
            "lingbot-va"
          ],
          "badge": "世界模型线",
          "title": "LingBot-VA 世界模型后训练已打通单任务 smoke 与离线 demo",
          "summary": "这条线现在的关键不是直接报 success rate，而是已经打通视频 latent + 动作联合后训练的最小链路，并明确了单卡显存边界与后续多卡 / PEFT 方向。",
          "metrics": [
            {
              "label": "smoke step",
              "value": "1"
            },
            {
              "label": "offline action_mse",
              "value": "0.0067"
            },
            {
              "label": "当前阶段",
              "value": "smoke+demo"
            }
          ],
          "meta": "LingBot-VA 世界模型研究切入",
          "path": "homepage/tasks/lingbot-va-world-model/"
        }
      ],
      "task_badge": "世界模型线",
      "docs": [
        "homepage/external/lingbot_va/docs/project_guide.md",
        "homepage/external/lingbot_va/docs/research_desk.md",
        "homepage/external/lingbot_va/docs/fixes.md",
        "homepage/external/lingbot_va/docs/README.md"
      ],
      "manifest_note": "# LingBot-VA Research Desk ## 当前阶段结论 ### 2026-04-19 · 单任务单卡 smoke 已测通 成功任务：click_bell-aloha-agilex_randomized…",
      "chart_media_items": []
    },
    {
      "id": "lelan-pipeline",
      "title": "LeLaN 自动研究链路固化",
      "summary": "LeLaN 当前的重点仍是把执行链路固化成可长期追加的自动研究流程，而不是抢先做更激进的结构搜索。训练、评估、EMA 兼容、离线审计和 100/300/500 epoch 闸门规则已经定版，但正式 run 的行为结果还没有形成足够强的阶段结论，需要后续补齐。",
      "status": "待结果",
      "status_group": "in_progress",
      "page_path": "homepage/tasks/lelan-pipeline/",
      "branch_ids": [
        "lelan"
      ],
      "latest_update": "2026-04-12",
      "hero_metrics": [
        {
          "label": "观测设置",
          "value": "5 路 RGB / 3 帧"
        },
        {
          "label": "动作步数",
          "value": "8"
        },
        {
          "label": "gate@100",
          "value": "0.45"
        }
      ],
      "report_intro": "LeLaN 当前的重点仍是把执行链路固化成可长期追加的自动研究流程，而不是抢先做更激进的结构搜索。训练、评估、EMA 兼容、离线审计和 100/300/500 epoch 闸门规则已经定版，但正式 run 的行为结果还没有形成足够强的阶段结论，需要后续补齐。",
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
              "badge": "LeLaN 执行线",
              "title": "自动研究链路与 100/300/500 闸门定版",
              "summary": "LeLaN 当时更缺的是训练、评估、选模和留痕的统一入口，而不是立即继续做新的结构尝试；",
              "date_key": "2026-04-12",
              "metrics": [
                {
                  "label": "线路",
                  "value": "LeLaN 执行线"
                },
                {
                  "label": "日期",
                  "value": "2026-04-12"
                },
                {
                  "label": "来源",
                  "value": "research desk"
                }
              ],
              "outcome": "LeLaN 现在首先是一条“执行线”，目标是把正式实验沉淀成可长期追加的研究档案；",
              "links": [
                {
                  "title": "LeLaN 执行计划",
                  "path": "docs/lelan/2026-04-12-lelan-autoresearch-execution-plan-zh.md"
                },
                {
                  "title": "LeLaN 研究记录约定",
                  "path": "docs/lelan/research/README.md"
                }
              ],
              "task_id": "lelan-pipeline"
            },
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
              "label": "观测设置",
              "value": "5 路 RGB / 3 帧"
            },
            {
              "label": "动作步数",
              "value": "8"
            },
            {
              "label": "gate@100",
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
      "manifest_note": "现在每个 LeLaN run 至少保留： config.json experiment_manifest.json summary.json dataset_stats.json success_eval_history.json 或 eval_ckpts/ audit_report.json lelan_trial…",
      "chart_media_items": []
    },
    {
      "id": "infra-audit",
      "title": "训练与审计基础设施修复",
      "summary": "当前最重要的共性收敛不是再补一个日志文件，而是把“事实留痕”和“阶段总结”彻底分层。fixes.md 继续做事实源，research_desk.md 承担跨线路阶段总结，docs/mdit/research_journal.md、docs/mdit/best_path.md 以及各线路稳定文档继续保存可回查证据；",
      "status": "长期维护",
      "status_group": "in_progress",
      "page_path": "homepage/tasks/infra-audit/",
      "branch_ids": [],
      "latest_update": "2026-04-19",
      "hero_metrics": [
        {
          "label": "desk 条目",
          "value": "15"
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
      "report_intro": "当前最重要的共性收敛不是再补一个日志文件，而是把“事实留痕”和“阶段总结”彻底分层。fixes.md 继续做事实源，research_desk.md 承担跨线路阶段总结，docs/mdit/research_journal.md、docs/mdit/best_path.md 以及各线路稳定文档继续保存可回查证据；",
      "summary_cards": [
        {
          "eyebrow": "Research Desk",
          "title": "阶段总结已经从 fixes 日志中抽离出来",
          "body": "research_desk 负责讲清“哪条线现在走到哪里、为什么这样判断、下一步是什么”，避免 homepage 继续从机械式记录里反向拼叙事。",
          "metrics": [
            {
              "label": "总结源",
              "value": "research desk"
            },
            {
              "label": "结构",
              "value": "固定"
            },
            {
              "label": "写法",
              "value": "人工提炼"
            }
          ]
        },
        {
          "eyebrow": "Evidence",
          "title": "事实源和稳定证据文档继续保留",
          "body": "fixes、研究日志、best_path 和各线路稳定文档仍然保留原始事实与证据，desk 只负责把真正改变研究判断的节点压缩出来。",
          "metrics": [
            {
              "label": "fixes",
              "value": "6"
            },
            {
              "label": "LeLaN docs",
              "value": "7"
            },
            {
              "label": "状态",
              "value": "并行保留"
            }
          ]
        },
        {
          "eyebrow": "Archive",
          "title": "research_archive 已固化 18 条记录与 0 个 milestone",
          "body": "页面里的证据层、归档时间线和后续专题页素材现在都可以优先从 research_archive 消费，不必再回翻零散的 ckpt、autoresearch_records 和 docs 目录。",
          "metrics": [
            {
              "label": "归档条目",
              "value": "18"
            },
            {
              "label": "完整条目",
              "value": "6"
            },
            {
              "label": "milestone",
              "value": "0"
            }
          ]
        }
      ],
      "timeline_groups": [
        {
          "date": "2026-04-19",
          "cards": [
            {
              "badge": "MDIT 主线",
              "title": "100→500 主线续训完成共享审计并把长训结果抬到 0.75",
              "summary": "100 epoch 锁定锚点之后，MDIT 一直缺一条真正跑完并完成同口径共享审计的长训主线。",
              "date_key": "2026-04-19",
              "metrics": [
                {
                  "label": "线路",
                  "value": "MDIT 主线"
                },
                {
                  "label": "日期",
                  "value": "2026-04-19"
                },
                {
                  "label": "来源",
                  "value": "research desk"
                }
              ],
              "outcome": "MDIT 现在最重要的新结论不是“续训已经恢复”，而是“同一条 RGB+文本主线在共享审计下已经从 0.55@100 抬到了 0.75@300/500”。",
              "links": [
                {
                  "title": "500 续训审计记录",
                  "path": "autoresearch_records/unplug_charger_mdit_rgb_text_3token_100__lane_a_mainline_500_resume__e0500__20260418_005723.json"
                },
                {
                  "title": "MDIT 研究日志",
                  "path": "docs/mdit/research_journal.md"
                },
                {
                  "title": "修复留痕总表",
                  "path": "docs/fixes.md"
                }
              ],
              "task_id": "mdit-mainline"
            },
            {
              "badge": "Archive Record",
              "title": "code structure",
              "summary": "该文档已经被纳入统一 archive，可作为后续专题页或 homepage 摘要的事实源。",
              "date_key": "2026-04-19",
              "metrics": [
                {
                  "label": "归档",
                  "value": "完整"
                },
                {
                  "label": "缺失",
                  "value": "完整"
                }
              ],
              "outcome": "该条 run 已经进入统一 archive，后续整理页面时可以直接消费归档产物。",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/infra/records/2026-04-19__code_structure/report/report.md"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/infra/records/2026-04-19__code_structure/archive_manifest.json"
                }
              ]
            },
            {
              "badge": "Archive Record",
              "title": "code structure zh",
              "summary": "该文档已经被纳入统一 archive，可作为后续专题页或 homepage 摘要的事实源。",
              "date_key": "2026-04-19",
              "metrics": [
                {
                  "label": "归档",
                  "value": "完整"
                },
                {
                  "label": "缺失",
                  "value": "完整"
                }
              ],
              "outcome": "该条 run 已经进入统一 archive，后续整理页面时可以直接消费归档产物。",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/infra/records/2026-04-19__code_structure_zh/report/report.md"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/infra/records/2026-04-19__code_structure_zh/archive_manifest.json"
                }
              ]
            },
            {
              "badge": "Archive Record",
              "title": "fixes",
              "summary": "该文档已经被纳入统一 archive，可作为后续专题页或 homepage 摘要的事实源。",
              "date_key": "2026-04-19",
              "metrics": [
                {
                  "label": "归档",
                  "value": "完整"
                },
                {
                  "label": "缺失",
                  "value": "完整"
                }
              ],
              "outcome": "该条 run 已经进入统一 archive，后续整理页面时可以直接消费归档产物。",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/infra/records/2026-04-19__fixes/report/report.md"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/infra/records/2026-04-19__fixes/archive_manifest.json"
                }
              ]
            },
            {
              "badge": "Archive Record",
              "title": "homepage media dummy sim2real platform",
              "summary": "该文档已经被纳入统一 archive，可作为后续专题页或 homepage 摘要的事实源。",
              "date_key": "2026-04-19",
              "metrics": [
                {
                  "label": "归档",
                  "value": "完整"
                },
                {
                  "label": "缺失",
                  "value": "完整"
                }
              ],
              "outcome": "该条 run 已经进入统一 archive，后续整理页面时可以直接消费归档产物。",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/infra/records/2026-04-19__homepage_media_dummy_sim2real_platform/report/report.md"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/infra/records/2026-04-19__homepage_media_dummy_sim2real_platform/archive_manifest.json"
                }
              ]
            },
            {
              "badge": "Archive Record",
              "title": "mdit_takeover_state__lane_c_then_best500",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-19",
              "metrics": [
                {
                  "label": "归档",
                  "value": "待补齐"
                },
                {
                  "label": "缺失",
                  "value": "3 项"
                }
              ],
              "outcome": "trial record 已归档，但目前没有可展示的核心指标。",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/infra/records/2026-04-19__mdit_takeover_state_lane_c_then_best500/report/report.md"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/infra/records/2026-04-19__mdit_takeover_state_lane_c_then_best500/archive_manifest.json"
                }
              ]
            },
            {
              "badge": "Archive Record",
              "title": "pdit job packaging",
              "summary": "该文档已经被纳入统一 archive，可作为后续专题页或 homepage 摘要的事实源。",
              "date_key": "2026-04-19",
              "metrics": [
                {
                  "label": "归档",
                  "value": "完整"
                },
                {
                  "label": "缺失",
                  "value": "完整"
                }
              ],
              "outcome": "该条 run 已经进入统一 archive，后续整理页面时可以直接消费归档产物。",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/infra/records/2026-04-19__pdit_job_packaging/report/report.md"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/infra/records/2026-04-19__pdit_job_packaging/archive_manifest.json"
                }
              ]
            },
            {
              "badge": "Archive Record",
              "title": "research desk",
              "summary": "该文档已经被纳入统一 archive，可作为后续专题页或 homepage 摘要的事实源。",
              "date_key": "2026-04-19",
              "metrics": [
                {
                  "label": "归档",
                  "value": "完整"
                },
                {
                  "label": "缺失",
                  "value": "完整"
                }
              ],
              "outcome": "该条 run 已经进入统一 archive，后续整理页面时可以直接消费归档产物。",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/infra/records/2026-04-19__research_desk/report/report.md"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/infra/records/2026-04-19__research_desk/archive_manifest.json"
                }
              ]
            }
          ]
        },
        {
          "date": "2026-04-18",
          "cards": [
            {
              "badge": "基础设施",
              "title": "建立 research desk 作为 homepage 的阶段总结总账本",
              "summary": "fixes.md 继续追加之后逐渐同时承担了事实留痕、自动状态流和阶段总结三种职责，读者需要先跨过大量日志样式条目才能看见真正改变研究判断的节点，homepage 也只能从偏机械的记录里反向猜主线叙事。",
              "date_key": "2026-04-18",
              "metrics": [
                {
                  "label": "线路",
                  "value": "基础设施"
                },
                {
                  "label": "日期",
                  "value": "2026-04-18"
                },
                {
                  "label": "来源",
                  "value": "research desk"
                }
              ],
              "outcome": "从现在起，项目形成了 fixes.md 记事实、research_desk.md 做阶段总结、各线路稳定文档保留证据的三层文档结构。",
              "links": [
                {
                  "title": "修复留痕总表",
                  "path": "docs/fixes.md"
                },
                {
                  "title": "MDIT 研究日志",
                  "path": "docs/mdit/research_journal.md"
                },
                {
                  "title": "Homepage 维护规则",
                  "path": "homepage/MAINTENANCE.md"
                }
              ],
              "task_id": "infra-audit"
            },
            {
              "badge": "MDIT 主线",
              "title": "恢复 100→500 续训接管",
              "summary": "严格 MTDP 对照未过闸门后，理论上应该立即把预算收回到当前最佳路线继续长训，但实际接管时暴露出旧 checkpoint 的优化器状态和当前参数顺序不兼容，后台还会误把旧心跳当成新进度。",
              "date_key": "2026-04-18",
              "metrics": [
                {
                  "label": "线路",
                  "value": "MDIT 主线"
                },
                {
                  "label": "日期",
                  "value": "2026-04-18"
                },
                {
                  "label": "来源",
                  "value": "research desk"
                }
              ],
              "outcome": "MDIT 现在最重要的工作已经明确，不是再开更多相似候选，而是把当前最佳路线稳定推进到 500 epoch 并完成共享审计。",
              "links": [
                {
                  "title": "MDIT 研究日志",
                  "path": "docs/mdit/research_journal.md"
                },
                {
                  "title": "当前主线路径",
                  "path": "docs/mdit/best_path.md"
                },
                {
                  "title": "修复留痕总表",
                  "path": "docs/fixes.md"
                }
              ],
              "task_id": "mdit-mainline"
            },
            {
              "badge": "MDIT 对照线",
              "title": "严格 MTDP 对照未过共享闸门",
              "summary": "在稳定化和 faithful 对照之后，项目需要回答一个更强的问题：严格 MTDP 语义在当前共享评估链下是否真的值得替代现有 RGB+文本主线。",
              "date_key": "2026-04-18",
              "metrics": [
                {
                  "label": "线路",
                  "value": "MDIT 对照线"
                },
                {
                  "label": "日期",
                  "value": "2026-04-18"
                },
                {
                  "label": "来源",
                  "value": "research desk"
                }
              ],
              "outcome": "严格 MTDP 对照已经完成“值得不值得继续投入”的首轮回答，目前结论是否定的。",
              "links": [
                {
                  "title": "MDIT 研究日志",
                  "path": "docs/mdit/research_journal.md"
                },
                {
                  "title": "修复留痕总表",
                  "path": "docs/fixes.md"
                }
              ],
              "task_id": "mdit-mainline"
            }
          ]
        },
        {
          "date": "2026-04-17",
          "cards": [
            {
              "badge": "MDIT 对照线",
              "title": "稳定化与 faithful 对照完成分流，主线不再被弱候选带偏",
              "summary": "在主线锚点出现后，仍需要确认稳定化对照和 faithful 对照到底是在挑战主线，还是只是在制造更多噪声；",
              "date_key": "2026-04-17",
              "metrics": [
                {
                  "label": "线路",
                  "value": "MDIT 对照线"
                },
                {
                  "label": "日期",
                  "value": "2026-04-17"
                },
                {
                  "label": "来源",
                  "value": "research desk"
                }
              ],
              "outcome": "稳定化对照已经被判定为弱线，不再作为主方向推进；",
              "links": [
                {
                  "title": "MDIT 研究日志",
                  "path": "docs/mdit/research_journal.md"
                },
                {
                  "title": "修复留痕总表",
                  "path": "docs/fixes.md"
                }
              ],
              "task_id": "mdit-mainline"
            },
            {
              "badge": "MDIT 主线",
              "title": "共享审计确认 0.55@100 锚点并冻结当前最佳路线",
              "summary": "当时需要一条已经过共享审计链验证的 RGB+文本锚点，否则后续所有候选都没有统一参照物，也很难决定谁该继续推进。",
              "date_key": "2026-04-17",
              "metrics": [
                {
                  "label": "线路",
                  "value": "MDIT 主线"
                },
                {
                  "label": "日期",
                  "value": "2026-04-17"
                },
                {
                  "label": "来源",
                  "value": "research desk"
                }
              ],
              "outcome": "0.55@100 是当前唯一经过共享审计链确认的 RGB+文本锚点。",
              "links": [
                {
                  "title": "MDIT 研究日志",
                  "path": "docs/mdit/research_journal.md"
                },
                {
                  "title": "当前主线路径",
                  "path": "docs/mdit/best_path.md"
                },
                {
                  "title": "修复留痕总表",
                  "path": "docs/fixes.md"
                }
              ],
              "task_id": "mdit-mainline"
            },
            {
              "badge": "Archive Record",
              "title": "mdit_loop_state__unplug_rgb_text_search",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-17",
              "metrics": [
                {
                  "label": "归档",
                  "value": "待补齐"
                },
                {
                  "label": "缺失",
                  "value": "3 项"
                }
              ],
              "outcome": "trial record 已归档，但目前没有可展示的核心指标。",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/infra/records/2026-04-17__mdit_loop_state_unplug_rgb_text_search/report/report.md"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/infra/records/2026-04-17__mdit_loop_state_unplug_rgb_text_search/archive_manifest.json"
                }
              ]
            }
          ]
        },
        {
          "date": "2026-04-16",
          "cards": [
            {
              "badge": "MDIT 主线",
              "title": "共享评估契约与后台守护链固化为标准执行方式",
              "summary": "即便主线配方已经回收完成，只要训练口径、评估口径、冠军冻结和后台接管没有锁死，后续 run 依然会因为配方漂移或中断恢复而失去继承关系。",
              "date_key": "2026-04-16",
              "metrics": [
                {
                  "label": "线路",
                  "value": "MDIT 主线"
                },
                {
                  "label": "日期",
                  "value": "2026-04-16"
                },
                {
                  "label": "来源",
                  "value": "research desk"
                }
              ],
              "outcome": "MDIT 从这一步起不再只是零散实验集合，而是一条可托管、可恢复、可比较的研究线；",
              "links": [
                {
                  "title": "MDIT 执行手册",
                  "path": "docs/mdit/2026-04-16-mdit-execution-manual.md"
                },
                {
                  "title": "MDIT 研究日志",
                  "path": "docs/mdit/research_journal.md"
                },
                {
                  "title": "当前主线路径",
                  "path": "docs/mdit/best_path.md"
                }
              ],
              "task_id": "mdit-mainline"
            }
          ]
        },
        {
          "date": "2026-04-15",
          "cards": [
            {
              "badge": "MDIT 主线",
              "title": "faithful RGB+文本默认路径与共享评估口径定版",
              "summary": "在这一步之前，MDIT 主线仍混入了点云兼容默认路径、PDIT 语义残留和 EMA 默认分支，导致“当前到底在跑什么配方”无法一句话说清。",
              "date_key": "2026-04-15",
              "metrics": [
                {
                  "label": "线路",
                  "value": "MDIT 主线"
                },
                {
                  "label": "日期",
                  "value": "2026-04-15"
                },
                {
                  "label": "来源",
                  "value": "research desk"
                }
              ],
              "outcome": "从这一步开始，MDIT 主线终于拥有可以持续复现和解释的默认配方；",
              "links": [
                {
                  "title": "修复留痕总表",
                  "path": "docs/fixes.md"
                },
                {
                  "title": "MDIT 执行手册",
                  "path": "docs/mdit/2026-04-16-mdit-execution-manual.md"
                }
              ],
              "task_id": "mdit-mainline"
            }
          ]
        },
        {
          "date": "2026-04-13",
          "cards": [
            {
              "badge": "MDIT 主线",
              "title": "早期兼容排查确认混合消融不能直接支持结构结论",
              "summary": "MDIT 早期在 RGB、点云、PDIT backbone、PDIT 条件路径等多种改动之间来回排查时，表面上虽然不断有训练现象和验证损失，但很难说明到底是哪一个因素真正起作用。",
              "date_key": "2026-04-13",
              "metrics": [
                {
                  "label": "线路",
                  "value": "MDIT 主线"
                },
                {
                  "label": "日期",
                  "value": "2026-04-13"
                },
                {
                  "label": "来源",
                  "value": "research desk"
                }
              ],
              "outcome": "MDIT 不能靠“把能跑的东西拼起来”推进；",
              "links": [
                {
                  "title": "PDIT 与 MDIT 定位对照",
                  "path": "docs/pdit-vs-mdit.md"
                },
                {
                  "title": "修复留痕总表",
                  "path": "docs/fixes.md"
                }
              ],
              "task_id": "mdit-mainline"
            }
          ]
        },
        {
          "date": "2026-04-12",
          "cards": [
            {
              "badge": "LeLaN 执行线",
              "title": "自动研究链路与 100/300/500 闸门定版",
              "summary": "LeLaN 当时更缺的是训练、评估、选模和留痕的统一入口，而不是立即继续做新的结构尝试；",
              "date_key": "2026-04-12",
              "metrics": [
                {
                  "label": "线路",
                  "value": "LeLaN 执行线"
                },
                {
                  "label": "日期",
                  "value": "2026-04-12"
                },
                {
                  "label": "来源",
                  "value": "research desk"
                }
              ],
              "outcome": "LeLaN 现在首先是一条“执行线”，目标是把正式实验沉淀成可长期追加的研究档案；",
              "links": [
                {
                  "title": "LeLaN 执行计划",
                  "path": "docs/lelan/2026-04-12-lelan-autoresearch-execution-plan-zh.md"
                },
                {
                  "title": "LeLaN 研究记录约定",
                  "path": "docs/lelan/research/README.md"
                }
              ],
              "task_id": "lelan-pipeline"
            },
            {
              "badge": "Archive Record",
              "title": "VRAM probe for batch_size=12",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-12",
              "metrics": [
                {
                  "label": "归档",
                  "value": "待补齐"
                },
                {
                  "label": "缺失",
                  "value": "3 项"
                }
              ],
              "outcome": "trial_score: -1.0 collapse_detected: True",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/infra/records/2026-04-12__vram_probe_bs12_test_1775990954/report/report.md"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/infra/records/2026-04-12__vram_probe_bs12_test_1775990954/archive_manifest.json"
                }
              ]
            },
            {
              "badge": "Archive Record",
              "title": "VRAM probe for batch_size=16",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-12",
              "metrics": [
                {
                  "label": "归档",
                  "value": "待补齐"
                },
                {
                  "label": "缺失",
                  "value": "3 项"
                }
              ],
              "outcome": "trial_score: -1.0 collapse_detected: True",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/infra/records/2026-04-12__vram_probe_bs16_1775990761/report/report.md"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/infra/records/2026-04-12__vram_probe_bs16_1775990761/archive_manifest.json"
                }
              ]
            },
            {
              "badge": "Archive Record",
              "title": "VRAM probe for batch_size=20",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-12",
              "metrics": [
                {
                  "label": "归档",
                  "value": "待补齐"
                },
                {
                  "label": "缺失",
                  "value": "3 项"
                }
              ],
              "outcome": "trial_score: -1.0 collapse_detected: True",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/infra/records/2026-04-12__vram_probe_bs20_1775990570/report/report.md"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/infra/records/2026-04-12__vram_probe_bs20_1775990570/archive_manifest.json"
                }
              ]
            },
            {
              "badge": "Archive Record",
              "title": "VRAM probe for batch_size=24",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-12",
              "metrics": [
                {
                  "label": "归档",
                  "value": "待补齐"
                },
                {
                  "label": "缺失",
                  "value": "3 项"
                }
              ],
              "outcome": "trial_score: -1.0 collapse_detected: True",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/infra/records/2026-04-12__vram_probe_bs24_1775990374/report/report.md"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/infra/records/2026-04-12__vram_probe_bs24_1775990374/archive_manifest.json"
                }
              ]
            },
            {
              "badge": "Archive Record",
              "title": "VRAM probe for batch_size=8",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-12",
              "metrics": [
                {
                  "label": "归档",
                  "value": "待补齐"
                },
                {
                  "label": "缺失",
                  "value": "3 项"
                }
              ],
              "outcome": "collapse_detected: False",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/infra/records/2026-04-12__vram_probe_bs8_1775991433/report/report.md"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/infra/records/2026-04-12__vram_probe_bs8_1775991433/archive_manifest.json"
                }
              ]
            }
          ]
        },
        {
          "date": "2026-04-10",
          "cards": [
            {
              "badge": "Archive Record",
              "title": "dummy_smoke_root_layout",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-10",
              "metrics": [
                {
                  "label": "归档",
                  "value": "待补齐"
                },
                {
                  "label": "缺失",
                  "value": "3 项"
                }
              ],
              "outcome": "collapse_detected: False",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/infra/records/2026-04-10__dummy_smoke_root_layout/report/report.md"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/infra/records/2026-04-10__dummy_smoke_root_layout/archive_manifest.json"
                }
              ]
            },
            {
              "badge": "Archive Record",
              "title": "cross attn smoke",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-10",
              "metrics": [
                {
                  "label": "归档",
                  "value": "待补齐"
                },
                {
                  "label": "缺失",
                  "value": "3 项"
                }
              ],
              "outcome": "collapse_detected: False",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/infra/records/2026-04-10__smoke_h3_train/report/report.md"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/infra/records/2026-04-10__smoke_h3_train/archive_manifest.json"
                }
              ]
            },
            {
              "badge": "Archive Record",
              "title": "smoke_modular_dummy",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-10",
              "metrics": [
                {
                  "label": "归档",
                  "value": "待补齐"
                },
                {
                  "label": "缺失",
                  "value": "3 项"
                }
              ],
              "outcome": "collapse_detected: False",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/infra/records/2026-04-10__unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1_smoke_modular_dummy_e0001_20260409_manual/report/report.md"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/infra/records/2026-04-10__unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1_smoke_modular_dummy_e0001_20260409_manual/archive_manifest.json"
                }
              ]
            },
            {
              "badge": "Archive Record",
              "title": "real smoke timeout",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-10",
              "metrics": [
                {
                  "label": "归档",
                  "value": "待补齐"
                },
                {
                  "label": "缺失",
                  "value": "3 项"
                }
              ],
              "outcome": "trial_score: -1.0 collapse_detected: True",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/infra/records/2026-04-10__unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1_smoke_timeout_e0001_20260407_232344/report/report.md"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/infra/records/2026-04-10__unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1_smoke_timeout_e0001_20260407_232344/archive_manifest.json"
                }
              ]
            },
            {
              "badge": "Archive Record",
              "title": "早期试跑记录",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-10",
              "metrics": [
                {
                  "label": "归档",
                  "value": "待补齐"
                },
                {
                  "label": "缺失",
                  "value": "3 项"
                }
              ],
              "outcome": "trial_score: -1.0 collapse_detected: True",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/infra/records/2026-04-10__unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1_smoke_train_only_e0001_20260407_233423/report/report.md"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/infra/records/2026-04-10__unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1_smoke_train_only_e0001_20260407_233423/archive_manifest.json"
                }
              ]
            }
          ]
        },
        {
          "date": "2026-04-09",
          "cards": [
            {
              "badge": "PDIT 主线",
              "title": "点云 baseline 恢复为行为锚点",
              "summary": "PDIT 早期的低成功率同时混杂了训练、保存和离线审计链路的问题，导致当时很难判断是策略学不会，还是工程链路把原本可用的结果压坏了。",
              "date_key": "2026-04-09",
              "metrics": [
                {
                  "label": "线路",
                  "value": "PDIT 主线"
                },
                {
                  "label": "日期",
                  "value": "2026-04-09"
                },
                {
                  "label": "来源",
                  "value": "research desk"
                }
              ],
              "outcome": "PDIT 已经从“能不能学起来”的问题，转成“后期泛化能否继续稳定”的问题。",
              "links": [
                {
                  "title": "PDIT 恢复进展",
                  "path": "docs/pdit/2026-04-08-fm-recovery-progress-zh.md"
                },
                {
                  "title": "训练模型审计",
                  "path": "docs/pdit/2026-04-07-training-model-audit-zh.md"
                },
                {
                  "title": "checkpoint 清单",
                  "path": "docs/top10-checkpoint-manifest.json"
                }
              ],
              "task_id": "pdit-anchor"
            }
          ]
        },
        {
          "date": "2026-04-08",
          "cards": [
            {
              "badge": "PDIT 主线",
              "title": "DiT 动力学改良候选达到 0.65@100，但还不能直接替代 baseline",
              "summary": "在 baseline 已经恢复后，项目需要判断晚期漂移有没有结构层面的改良方向，而不是只知道“当前基线能跑”。",
              "date_key": "2026-04-08",
              "metrics": [
                {
                  "label": "线路",
                  "value": "PDIT 主线"
                },
                {
                  "label": "日期",
                  "value": "2026-04-08"
                },
                {
                  "label": "来源",
                  "value": "research desk"
                }
              ],
              "outcome": "这条动力学候选证明“结构改进方向值得继续研究”，但它还没有完成对 500 epoch 行为锚点的替代。",
              "links": [
                {
                  "title": "DiT 动力学候选审计记录",
                  "path": "autoresearch_records/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__h2_dit_dynamics_100__e0100__20260408_114130.json"
                },
                {
                  "title": "DiT 动力学候选审计日志",
                  "path": "autoresearch_records/logs/h2_dit_dynamics_100_audit.log"
                },
                {
                  "title": "PDIT 恢复进展",
                  "path": "docs/pdit/2026-04-08-fm-recovery-progress-zh.md"
                }
              ],
              "task_id": "pdit-anchor"
            },
            {
              "badge": "PDIT 主线",
              "title": "数据统计增强路线被确认掺入观测语义错误，原有通过闸门的结果作废",
              "summary": "最初“数据统计 + 数据增强”路线在 100 epoch 上一度拿到 0.55，表面上像是一条勉强可保留的候选，但这条结果后来被发现不能直接支持结构结论。",
              "date_key": "2026-04-08",
              "metrics": [
                {
                  "label": "线路",
                  "value": "PDIT 主线"
                },
                {
                  "label": "日期",
                  "value": "2026-04-08"
                },
                {
                  "label": "来源",
                  "value": "research desk"
                }
              ],
              "outcome": "原来那条 0.55 结果不能再作为“数据统计增强可行”的证据，应该被解释为被 bug 污染的历史记录。",
              "links": [
                {
                  "title": "原始数据统计增强审计记录",
                  "path": "autoresearch_records/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__h1_stats_aug_100__e0100__20260408_103914.json"
                },
                {
                  "title": "修正后重跑审计记录",
                  "path": "autoresearch_records/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__h1_fixed_stats_aug_100__e0100__20260408_124213.json"
                },
                {
                  "title": "PDIT 恢复进展",
                  "path": "docs/pdit/2026-04-08-fm-recovery-progress-zh.md"
                }
              ],
              "task_id": "pdit-anchor"
            },
            {
              "badge": "PDIT 主线",
              "title": "500 epoch 主线通过补评估保住长期行为锚点",
              "summary": "500 epoch 主线训练完成后，原始的全量 audit sweep 一度因为超时看起来像失败，如果直接把这件事解释成训练崩溃，就会把已经跑出来的长期主线误判为无效。",
              "date_key": "2026-04-08",
              "metrics": [
                {
                  "label": "线路",
                  "value": "PDIT 主线"
                },
                {
                  "label": "日期",
                  "value": "2026-04-08"
                },
                {
                  "label": "来源",
                  "value": "research desk"
                }
              ],
              "outcome": "PDIT 不仅在短周期上恢复了可训练性，也在长周期上保住了可复核的行为锚点。",
              "links": [
                {
                  "title": "baseline_500 审计报告",
                  "path": "ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/audit_report.json"
                },
                {
                  "title": "epoch_0500 人工评估",
                  "path": "ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/epoch_0500_manual_eval.json"
                },
                {
                  "title": "100 回合复核",
                  "path": "ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/root_layout_recheck_100.json"
                }
              ],
              "task_id": "pdit-anchor"
            },
            {
              "badge": "PDIT 主线",
              "title": "100 epoch 离线审计确认修复后 baseline 不再“学不会”",
              "summary": "在修复训练、保存和审计链之前，PDIT 的低成功率很难解释清楚，到底是任务本身太难，还是工程链路把本来可用的策略压坏了。",
              "date_key": "2026-04-08",
              "metrics": [
                {
                  "label": "线路",
                  "value": "PDIT 主线"
                },
                {
                  "label": "日期",
                  "value": "2026-04-08"
                },
                {
                  "label": "来源",
                  "value": "research desk"
                }
              ],
              "outcome": "这一轮审计把问题从“PDIT 学不会”改写成“修复工程链后它其实能学起来，而且已经明显超过最低可用门槛”。",
              "links": [
                {
                  "title": "baseline_100 审计记录",
                  "path": "autoresearch_records/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_100__e0100__20260408_002048.json"
                },
                {
                  "title": "baseline_100 审计日志",
                  "path": "autoresearch_records/logs/baseline_100_audit.log"
                },
                {
                  "title": "PDIT 恢复进展",
                  "path": "docs/pdit/2026-04-08-fm-recovery-progress-zh.md"
                }
              ],
              "task_id": "pdit-anchor"
            }
          ]
        }
      ],
      "findings": [
        {
          "title": "research_desk 负责阶段总结，fixes 退回事实源",
          "body": "首页与全局时间线优先展示人工提炼过的阶段进展；需要回查具体 bug、run 状态和路径时，再回到 fixes 账本。"
        },
        {
          "title": "跨线路整理终于有了单一入口",
          "body": "PDIT、MDIT、LeLaN 和文档治理的关键阶段变化现在可以汇总到同一份 desk 文档，homepage 不必再从多份自动日志里反向猜结论。"
        }
      ],
      "evidence_links": [
        {
          "title": "archive 报告 · code structure",
          "path": "research_archive/tasks/infra/records/2026-04-19__code_structure/report/report.md",
          "summary": "archive 内的背景、核心结果与证据索引已经整理成可直接消费的报告页。",
          "label": "打开归档报告"
        },
        {
          "title": "archive 报告 · code structure zh",
          "path": "research_archive/tasks/infra/records/2026-04-19__code_structure_zh/report/report.md",
          "summary": "archive 内的背景、核心结果与证据索引已经整理成可直接消费的报告页。",
          "label": "打开归档报告"
        },
        {
          "title": "archive 报告 · fixes",
          "path": "research_archive/tasks/infra/records/2026-04-19__fixes/report/report.md",
          "summary": "archive 内的背景、核心结果与证据索引已经整理成可直接消费的报告页。",
          "label": "打开归档报告"
        },
        {
          "title": "archive 报告 · homepage media dummy sim2real platform",
          "path": "research_archive/tasks/infra/records/2026-04-19__homepage_media_dummy_sim2real_platform/report/report.md",
          "summary": "archive 内的背景、核心结果与证据索引已经整理成可直接消费的报告页。",
          "label": "打开归档报告"
        },
        {
          "title": "archive 报告 · mdit_takeover_state__lane_c_then_best500",
          "path": "research_archive/tasks/infra/records/2026-04-19__mdit_takeover_state_lane_c_then_best500/report/report.md",
          "summary": "archive 内的背景、核心结果与证据索引已经整理成可直接消费的报告页。",
          "label": "打开归档报告"
        },
        {
          "title": "archive 报告 · pdit job packaging",
          "path": "research_archive/tasks/infra/records/2026-04-19__pdit_job_packaging/report/report.md",
          "summary": "archive 内的背景、核心结果与证据索引已经整理成可直接消费的报告页。",
          "label": "打开归档报告"
        },
        {
          "title": "research_desk.md",
          "path": "docs/research_desk.md",
          "summary": "跨线路阶段总结总账本，供 homepage 优先提炼。",
          "label": "查看原始记录"
        },
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
        "docs/research_desk.md",
        "docs/fixes.md",
        "docs/code-structure-zh.md",
        "docs/pdit-vs-mdit.md"
      ],
      "chart_media_items": []
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
      "card_title": "具身采集平台",
      "card_summary": "围绕 Sim2Real 映射、示教轨迹和 FK/IK 控制，搭起可复用的六轴臂采集平台。",
      "card_result": "当前成果：平台已固化，可直接承接具身学习数据采集。",
      "detail_intro": "围绕 Sim2Real 映射、示教轨迹和 FK/IK 控制，搭起可复用的六轴臂采集平台。 当前成果：平台已固化，可直接承接具身学习数据采集。",
      "entry_path": "homepage/tasks/dummy-sim2real-platform/",
      "entry_label": "进入任务页",
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
                  "path": "homepage/external/dummy_controller/项目总览.md"
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
                  "path": "homepage/external/dummy_controller/项目总览.md"
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
                  "path": "homepage/external/dummy_controller/项目总览.md"
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
          "title": "项目总览",
          "path": "homepage/external/dummy_controller/项目总览.md",
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
      "dashboard_chart_ids": [
        "branch-robot-capabilities",
        "branch-robot-milestones"
      ],
      "chart_media_items": [],
      "media_items": [
        {
          "task_id": "dummy-sim2real-platform",
          "kind": "image",
          "title": "六轴臂平台封面",
          "caption": "概览展示这套六轴臂 Sim2Real 采集平台的整体形态，作为首页亮点封面使用。",
          "path": "research_archive/tasks/infra/media/demo/images/dummy-sim2real-platform/00-封面图.jpg",
          "showcase_preview": true
        },
        {
          "task_id": "dummy-sim2real-platform",
          "kind": "image",
          "title": "三维建模与仿真资产准备",
          "caption": "用三维建模补齐机械结构、关节关系与几何尺度，为后续导出 URDF 和整理碰撞/惯性参数打底。这一步把平台从单纯的运动控制，推进到可接入 Isaac 或 MuJoCo 的动力学仿真资产层。",
          "path": "research_archive/tasks/infra/media/demo/images/dummy-sim2real-platform/01-SW三维模型.png",
          "showcase_preview": false
        },
        {
          "task_id": "dummy-sim2real-platform",
          "kind": "video",
          "title": "URDF 与动力学仿真链路",
          "caption": "展示从三维建模到仿真资产落地的流程：先把机械结构整理成可导出的 URDF，再接入动力学引擎做运动与接触验证。它为后续在 Isaac / MuJoCo 中复现实验、扩展数据采集与世界模型环境提供了统一底座。",
          "path": "research_archive/tasks/infra/media/demo/videos/dummy-sim2real-platform/00-三维建模与动力学仿真-1.mp4",
          "showcase_preview": false
        },
        {
          "task_id": "dummy-sim2real-platform",
          "kind": "video",
          "title": "正逆运动解算演示",
          "caption": "展示六轴臂平台里从目标位姿到数值逆解、再到仿真预览与控制联动的过程。",
          "path": "research_archive/tasks/infra/media/demo/videos/dummy-sim2real-platform/01-运动逆解算.mp4",
          "showcase_preview": false
        },
        {
          "task_id": "dummy-sim2real-platform",
          "kind": "video",
          "title": "真机-仿真数字孪生同步",
          "caption": "展示真机姿态如何实时映射到仿真侧，验证 Sim2Real 运动映射与数字孪生同步效果。",
          "path": "research_archive/tasks/infra/media/demo/videos/dummy-sim2real-platform/02-真机仿真数字孪生.mp4",
          "showcase_preview": false
        },
        {
          "task_id": "dummy-sim2real-platform",
          "kind": "video",
          "title": "规划轨迹真机执行",
          "caption": "展示规划好的关节轨迹如何按照记录节奏下发真机，体现示教回放与总线保护链路。",
          "path": "research_archive/tasks/infra/media/demo/videos/dummy-sim2real-platform/03-规划轨迹执行.mp4",
          "showcase_preview": false
        }
      ],
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
      "summary": "PDIT 现在仍是全仓库最稳定的行为锚点。训练链、保存链和离线审计链修稳后，点云 baseline 在 100 epoch 上先证明“不是学不会”，在 500 epoch 上又通过补评估保住了 0.95 的最佳行为结果，根目录重整后的 100 回合成功率 复核仍有 0.85。",
      "status": "稳定锚点",
      "status_group": "done",
      "page_path": "homepage/branches/pdit/",
      "latest_update": "2026-04-16",
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
      "card_title": "PDIT 主线",
      "card_summary": "围绕点云 DiT 主线，把训练、保存和离线审计修回到可复核的行为锚点。",
      "card_result": "当前成果：best success 0.95@20，100 回合复核 0.85。",
      "detail_intro": "围绕点云 DiT 主线，把训练、保存和离线审计修回到可复核的行为锚点。 当前成果：best success 0.95@20，100 回合复核 0.85。 当前已在 archive 中固化 11 条归档条目与 0 个 milestone。",
      "entry_path": "homepage/tasks/pdit-anchor/",
      "entry_label": "进入任务页",
      "related_task_ids": [
        "pdit-anchor"
      ],
      "timeline_groups": [
        {
          "date": "2026-04-16",
          "cards": [
            {
              "badge": "Archive Run",
              "title": "RGB+文本跨线公平对照",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-16",
              "metrics": [
                {
                  "label": "best success",
                  "value": "0.05"
                },
                {
                  "label": "best epoch",
                  "value": "49"
                },
                {
                  "label": "归档",
                  "value": "待补齐"
                }
              ],
              "outcome": "归档里已经固定 0.05@49 的结果，后续页面与专题页都可以直接复用。",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/pdit/runs/2026-04-16__ablation_rgb_text_pdit_100_fair_bs128_noamp/report/report.md"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/pdit/runs/2026-04-16__ablation_rgb_text_pdit_100_fair_bs128_noamp/archive_manifest.json"
                }
              ],
              "task_id": "pdit-anchor",
              "task_title": "PDIT 基线恢复与锚点固化"
            },
            {
              "badge": "Archive Run",
              "title": "RGB+文本适配器修正版",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-16",
              "metrics": [
                {
                  "label": "归档",
                  "value": "待补齐"
                },
                {
                  "label": "缺失",
                  "value": "3 项"
                }
              ],
              "outcome": "trial_score: -1.0 collapse_detected: True",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/pdit/runs/2026-04-16__ablation_rgb_text_pdit_100_fair_bs128_noamp_fix_v2/report/report.md"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/pdit/runs/2026-04-16__ablation_rgb_text_pdit_100_fair_bs128_noamp_fix_v2/archive_manifest.json"
                }
              ],
              "task_id": "pdit-anchor",
              "task_title": "PDIT 基线恢复与锚点固化"
            }
          ]
        },
        {
          "date": "2026-04-15",
          "cards": [
            {
              "badge": "Archive Run",
              "title": "原始 PDIT 公平锚点（bs224）",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-15",
              "metrics": [
                {
                  "label": "归档",
                  "value": "待补齐"
                },
                {
                  "label": "缺失",
                  "value": "3 项"
                }
              ],
              "outcome": "trial_score: -1.0 collapse_detected: True",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/pdit/runs/2026-04-15__ablation_anchor_pcd_pdit_orig_bs224_noamp/report/report.md"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/pdit/runs/2026-04-15__ablation_anchor_pcd_pdit_orig_bs224_noamp/archive_manifest.json"
                }
              ],
              "task_id": "pdit-anchor",
              "task_title": "PDIT 基线恢复与锚点固化"
            },
            {
              "badge": "Archive Run",
              "title": "原始 PDIT 公平锚点（bs64）",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-15",
              "metrics": [
                {
                  "label": "归档",
                  "value": "待补齐"
                },
                {
                  "label": "缺失",
                  "value": "2 项"
                }
              ],
              "outcome": "trial_score: -1.0 collapse_detected: True",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/pdit/runs/2026-04-15__ablation_anchor_pcd_pdit_orig_bs64_noamp/report/report.md"
                },
                {
                  "title": "archive summary",
                  "path": "research_archive/tasks/pdit/runs/2026-04-15__ablation_anchor_pcd_pdit_orig_bs64_noamp/metrics/summary.json"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/pdit/runs/2026-04-15__ablation_anchor_pcd_pdit_orig_bs64_noamp/archive_manifest.json"
                }
              ],
              "task_id": "pdit-anchor",
              "task_title": "PDIT 基线恢复与锚点固化"
            },
            {
              "badge": "Archive Run",
              "title": "RGB+文本迁移候选",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-15",
              "metrics": [
                {
                  "label": "best success",
                  "value": "0.05"
                },
                {
                  "label": "best epoch",
                  "value": "40"
                },
                {
                  "label": "归档",
                  "value": "待补齐"
                }
              ],
              "outcome": "归档里已经固定 0.05@40 的结果，后续页面与专题页都可以直接复用。",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/pdit/runs/2026-04-15__ablation_rgb_text_pdit_100/report/report.md"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/pdit/runs/2026-04-15__ablation_rgb_text_pdit_100/archive_manifest.json"
                }
              ],
              "task_id": "pdit-anchor",
              "task_title": "PDIT 基线恢复与锚点固化"
            },
            {
              "badge": "Archive Run",
              "title": "RGB+文本迁移候选",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-15",
              "metrics": [
                {
                  "label": "归档",
                  "value": "待补齐"
                },
                {
                  "label": "缺失",
                  "value": "3 项"
                }
              ],
              "outcome": "trial_score: -1.0 collapse_detected: True",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/pdit/runs/2026-04-15__ablation_rgb_text_pdit_100ep/report/report.md"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/pdit/runs/2026-04-15__ablation_rgb_text_pdit_100ep/archive_manifest.json"
                }
              ],
              "task_id": "pdit-anchor",
              "task_title": "PDIT 基线恢复与锚点固化"
            }
          ]
        },
        {
          "date": "2026-04-10",
          "cards": [
            {
              "badge": "Archive Run",
              "title": "Baseline@100 恢复验证",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-10",
              "metrics": [
                {
                  "label": "best success",
                  "value": "0.90"
                },
                {
                  "label": "best epoch",
                  "value": "100"
                },
                {
                  "label": "归档",
                  "value": "待补齐"
                }
              ],
              "outcome": "归档里已经固定 0.90@100 的结果，后续页面与专题页都可以直接复用。",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/pdit/runs/2026-04-10__unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1_baseline_100_e0100_20260408_002048/report/report.md"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/pdit/runs/2026-04-10__unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1_baseline_100_e0100_20260408_002048/archive_manifest.json"
                }
              ],
              "task_id": "pdit-anchor",
              "task_title": "PDIT 基线恢复与锚点固化"
            },
            {
              "badge": "Archive Run",
              "title": "Baseline@500 行为锚点",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-10",
              "metrics": [
                {
                  "label": "归档",
                  "value": "待补齐"
                },
                {
                  "label": "缺失",
                  "value": "experiment_manifest"
                }
              ],
              "outcome": "trial_score: -1.0 collapse_detected: True",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/pdit/runs/2026-04-10__unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1_baseline_500_e0500_20260408_011741/report/report.md"
                },
                {
                  "title": "archive summary",
                  "path": "research_archive/tasks/pdit/runs/2026-04-10__unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1_baseline_500_e0500_20260408_011741/metrics/summary.json"
                },
                {
                  "title": "archive audit",
                  "path": "research_archive/tasks/pdit/runs/2026-04-10__unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1_baseline_500_e0500_20260408_011741/metrics/audit_report.json"
                }
              ],
              "task_id": "pdit-anchor",
              "task_title": "PDIT 基线恢复与锚点固化"
            },
            {
              "badge": "Archive Run",
              "title": "统计特征增强重试",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-10",
              "metrics": [
                {
                  "label": "best success",
                  "value": "0.35"
                },
                {
                  "label": "best epoch",
                  "value": "100"
                },
                {
                  "label": "归档",
                  "value": "待补齐"
                }
              ],
              "outcome": "归档里已经固定 0.35@100 的结果，后续页面与专题页都可以直接复用。",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/pdit/runs/2026-04-10__unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1_h1_fixed_stats_aug_100_e0100_20260408_124213/report/report.md"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/pdit/runs/2026-04-10__unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1_h1_fixed_stats_aug_100_e0100_20260408_124213/archive_manifest.json"
                }
              ],
              "task_id": "pdit-anchor",
              "task_title": "PDIT 基线恢复与锚点固化"
            },
            {
              "badge": "Archive Run",
              "title": "统计特征增强初版",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-10",
              "metrics": [
                {
                  "label": "best success",
                  "value": "0.55"
                },
                {
                  "label": "best epoch",
                  "value": "100"
                },
                {
                  "label": "归档",
                  "value": "待补齐"
                }
              ],
              "outcome": "归档里已经固定 0.55@100 的结果，后续页面与专题页都可以直接复用。",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/pdit/runs/2026-04-10__unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1_h1_stats_aug_100_e0100_20260408_103914/report/report.md"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/pdit/runs/2026-04-10__unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1_h1_stats_aug_100_e0100_20260408_103914/archive_manifest.json"
                }
              ],
              "task_id": "pdit-anchor",
              "task_title": "PDIT 基线恢复与锚点固化"
            },
            {
              "badge": "Archive Run",
              "title": "DiT 动力学候选",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-10",
              "metrics": [
                {
                  "label": "best success",
                  "value": "0.65"
                },
                {
                  "label": "best epoch",
                  "value": "100"
                },
                {
                  "label": "归档",
                  "value": "待补齐"
                }
              ],
              "outcome": "归档里已经固定 0.65@100 的结果，后续页面与专题页都可以直接复用。",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/pdit/runs/2026-04-10__unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1_h2_dit_dynamics_100_e0100_20260408_114130/report/report.md"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/pdit/runs/2026-04-10__unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1_h2_dit_dynamics_100_e0100_20260408_114130/archive_manifest.json"
                }
              ],
              "task_id": "pdit-anchor",
              "task_title": "PDIT 基线恢复与锚点固化"
            }
          ]
        },
        {
          "date": "2026-04-09",
          "cards": [
            {
              "badge": "PDIT 主线",
              "title": "点云 baseline 恢复为行为锚点",
              "summary": "PDIT 早期的低成功率同时混杂了训练、保存和离线审计链路的问题，导致当时很难判断是策略学不会，还是工程链路把原本可用的结果压坏了。",
              "date_key": "2026-04-09",
              "metrics": [
                {
                  "label": "线路",
                  "value": "PDIT 主线"
                },
                {
                  "label": "日期",
                  "value": "2026-04-09"
                },
                {
                  "label": "来源",
                  "value": "research desk"
                }
              ],
              "outcome": "PDIT 已经从“能不能学起来”的问题，转成“后期泛化能否继续稳定”的问题。",
              "links": [
                {
                  "title": "PDIT 恢复进展",
                  "path": "docs/pdit/2026-04-08-fm-recovery-progress-zh.md"
                },
                {
                  "title": "训练模型审计",
                  "path": "docs/pdit/2026-04-07-training-model-audit-zh.md"
                },
                {
                  "title": "checkpoint 清单",
                  "path": "docs/top10-checkpoint-manifest.json"
                }
              ],
              "task_id": "pdit-anchor",
              "task_title": "PDIT 基线恢复与锚点固化"
            },
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
              "badge": "PDIT 主线",
              "title": "DiT 动力学改良候选达到 0.65@100，但还不能直接替代 baseline",
              "summary": "在 baseline 已经恢复后，项目需要判断晚期漂移有没有结构层面的改良方向，而不是只知道“当前基线能跑”。",
              "date_key": "2026-04-08",
              "metrics": [
                {
                  "label": "线路",
                  "value": "PDIT 主线"
                },
                {
                  "label": "日期",
                  "value": "2026-04-08"
                },
                {
                  "label": "来源",
                  "value": "research desk"
                }
              ],
              "outcome": "这条动力学候选证明“结构改进方向值得继续研究”，但它还没有完成对 500 epoch 行为锚点的替代。",
              "links": [
                {
                  "title": "DiT 动力学候选审计记录",
                  "path": "autoresearch_records/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__h2_dit_dynamics_100__e0100__20260408_114130.json"
                },
                {
                  "title": "DiT 动力学候选审计日志",
                  "path": "autoresearch_records/logs/h2_dit_dynamics_100_audit.log"
                },
                {
                  "title": "PDIT 恢复进展",
                  "path": "docs/pdit/2026-04-08-fm-recovery-progress-zh.md"
                }
              ],
              "task_id": "pdit-anchor",
              "task_title": "PDIT 基线恢复与锚点固化"
            },
            {
              "badge": "PDIT 主线",
              "title": "数据统计增强路线被确认掺入观测语义错误，原有通过闸门的结果作废",
              "summary": "最初“数据统计 + 数据增强”路线在 100 epoch 上一度拿到 0.55，表面上像是一条勉强可保留的候选，但这条结果后来被发现不能直接支持结构结论。",
              "date_key": "2026-04-08",
              "metrics": [
                {
                  "label": "线路",
                  "value": "PDIT 主线"
                },
                {
                  "label": "日期",
                  "value": "2026-04-08"
                },
                {
                  "label": "来源",
                  "value": "research desk"
                }
              ],
              "outcome": "原来那条 0.55 结果不能再作为“数据统计增强可行”的证据，应该被解释为被 bug 污染的历史记录。",
              "links": [
                {
                  "title": "原始数据统计增强审计记录",
                  "path": "autoresearch_records/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__h1_stats_aug_100__e0100__20260408_103914.json"
                },
                {
                  "title": "修正后重跑审计记录",
                  "path": "autoresearch_records/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__h1_fixed_stats_aug_100__e0100__20260408_124213.json"
                },
                {
                  "title": "PDIT 恢复进展",
                  "path": "docs/pdit/2026-04-08-fm-recovery-progress-zh.md"
                }
              ],
              "task_id": "pdit-anchor",
              "task_title": "PDIT 基线恢复与锚点固化"
            },
            {
              "badge": "PDIT 主线",
              "title": "500 epoch 主线通过补评估保住长期行为锚点",
              "summary": "500 epoch 主线训练完成后，原始的全量 audit sweep 一度因为超时看起来像失败，如果直接把这件事解释成训练崩溃，就会把已经跑出来的长期主线误判为无效。",
              "date_key": "2026-04-08",
              "metrics": [
                {
                  "label": "线路",
                  "value": "PDIT 主线"
                },
                {
                  "label": "日期",
                  "value": "2026-04-08"
                },
                {
                  "label": "来源",
                  "value": "research desk"
                }
              ],
              "outcome": "PDIT 不仅在短周期上恢复了可训练性，也在长周期上保住了可复核的行为锚点。",
              "links": [
                {
                  "title": "baseline_500 审计报告",
                  "path": "ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/audit_report.json"
                },
                {
                  "title": "epoch_0500 人工评估",
                  "path": "ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/epoch_0500_manual_eval.json"
                },
                {
                  "title": "100 回合复核",
                  "path": "ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/root_layout_recheck_100.json"
                }
              ],
              "task_id": "pdit-anchor",
              "task_title": "PDIT 基线恢复与锚点固化"
            },
            {
              "badge": "PDIT 主线",
              "title": "100 epoch 离线审计确认修复后 baseline 不再“学不会”",
              "summary": "在修复训练、保存和审计链之前，PDIT 的低成功率很难解释清楚，到底是任务本身太难，还是工程链路把本来可用的策略压坏了。",
              "date_key": "2026-04-08",
              "metrics": [
                {
                  "label": "线路",
                  "value": "PDIT 主线"
                },
                {
                  "label": "日期",
                  "value": "2026-04-08"
                },
                {
                  "label": "来源",
                  "value": "research desk"
                }
              ],
              "outcome": "这一轮审计把问题从“PDIT 学不会”改写成“修复工程链后它其实能学起来，而且已经明显超过最低可用门槛”。",
              "links": [
                {
                  "title": "baseline_100 审计记录",
                  "path": "autoresearch_records/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_100__e0100__20260408_002048.json"
                },
                {
                  "title": "baseline_100 审计日志",
                  "path": "autoresearch_records/logs/baseline_100_audit.log"
                },
                {
                  "title": "PDIT 恢复进展",
                  "path": "docs/pdit/2026-04-08-fm-recovery-progress-zh.md"
                }
              ],
              "task_id": "pdit-anchor",
              "task_title": "PDIT 基线恢复与锚点固化"
            },
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
          "title": "archive 报告 · RGB+文本跨线公平对照",
          "path": "research_archive/tasks/pdit/runs/2026-04-16__ablation_rgb_text_pdit_100_fair_bs128_noamp/report/report.md",
          "summary": "archive 内的背景、核心结果与证据索引已经整理成可直接消费的报告页。",
          "label": "打开归档报告"
        },
        {
          "title": "archive 报告 · RGB+文本适配器修正版",
          "path": "research_archive/tasks/pdit/runs/2026-04-16__ablation_rgb_text_pdit_100_fair_bs128_noamp_fix_v2/report/report.md",
          "summary": "archive 内的背景、核心结果与证据索引已经整理成可直接消费的报告页。",
          "label": "打开归档报告"
        },
        {
          "title": "archive 报告 · 原始 PDIT 公平锚点（bs224）",
          "path": "research_archive/tasks/pdit/runs/2026-04-15__ablation_anchor_pcd_pdit_orig_bs224_noamp/report/report.md",
          "summary": "archive 内的背景、核心结果与证据索引已经整理成可直接消费的报告页。",
          "label": "打开归档报告"
        },
        {
          "title": "archive 报告 · 原始 PDIT 公平锚点（bs64）",
          "path": "research_archive/tasks/pdit/runs/2026-04-15__ablation_anchor_pcd_pdit_orig_bs64_noamp/report/report.md",
          "summary": "archive 内的背景、核心结果与证据索引已经整理成可直接消费的报告页。",
          "label": "打开归档报告"
        },
        {
          "title": "archive summary · 原始 PDIT 公平锚点（bs64）",
          "path": "research_archive/tasks/pdit/runs/2026-04-15__ablation_anchor_pcd_pdit_orig_bs64_noamp/metrics/summary.json",
          "summary": "训练后固化的结构化 summary，会作为后续图表和专题页的统一输入。",
          "label": "打开 summary"
        },
        {
          "title": "archive 报告 · RGB+文本迁移候选",
          "path": "research_archive/tasks/pdit/runs/2026-04-15__ablation_rgb_text_pdit_100/report/report.md",
          "summary": "archive 内的背景、核心结果与证据索引已经整理成可直接消费的报告页。",
          "label": "打开归档报告"
        },
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
        "pdit-checkpoint-rank",
        "pdit-loss-tail",
        "pdit-mse-tail"
      ],
      "dashboard_chart_ids": [
        "branch-pdit-rank",
        "branch-pdit-loss",
        "branch-pdit-mse"
      ],
      "chart_media_items": [
        {
          "id": "archive-chart-pdit-anchor-01-pdit-rank-overview-svg",
          "type": "media_chart",
          "title": "PDIT 关键结果排行",
          "description": "把关键 checkpoint 和 100 回合复核放到同一张图里，直接看当前该认哪一个锚点。",
          "path": "research_archive/tasks/pdit/media/charts/01-pdit_rank_overview.svg",
          "kind": "image",
          "source_kind": "manual",
          "note": "epoch 500 仍然是当前最稳的行为锚点，100 回合复核也继续站得住。"
        },
        {
          "id": "archive-chart-pdit-anchor-02-pdit-best-loss-curve-svg",
          "type": "media_chart",
          "title": "PDIT 最优组 loss 尾段",
          "description": "围绕当前最优 baseline@500，直接看 train / valid total loss 的尾段关系。",
          "path": "research_archive/tasks/pdit/media/charts/02-pdit_best_loss_curve.svg",
          "kind": "image",
          "source_kind": "manual",
          "note": "当前 baseline@500 训练记录里没有可回抓的 W&B history，因此这里只能展示本地 summary 保留下来的 495-499 epoch 尾段快照。"
        },
        {
          "id": "archive-chart-pdit-anchor-03-pdit-best-mse-curve-svg",
          "type": "media_chart",
          "title": "PDIT 最优组 MSE 尾段",
          "description": "把 xyz / rot6d / grip 三条误差拆开，解释当前行为锚点背后的误差结构。",
          "path": "research_archive/tasks/pdit/media/charts/03-pdit_best_mse_curve.svg",
          "kind": "image",
          "source_kind": "manual",
          "note": "PDIT 当前没有可用的 W&B history，这张图与 loss 图一样来自本地 summary 尾段快照。"
        }
      ],
      "media_items": [
        {
          "task_id": "pdit-anchor",
          "kind": "image",
          "title": "PDIT 点云主线封面",
          "caption": "作为当前 PDIT 主线封面，概括点云观测、动作生成与行为审计这条模仿学习主线的整体结构。",
          "path": "research_archive/tasks/pdit/media/demo/images/pdit.png",
          "showcase_preview": false
        },
        {
          "task_id": "pdit-anchor",
          "kind": "video",
          "title": "PDIT 点云策略关门演示",
          "caption": "展示点云主线在后期 checkpoint 上的仿真执行效果，说明 point cloud 到 action chunk 的策略已经能稳定落到具体 manipulation 动作。",
          "path": "research_archive/tasks/pdit/media/demo/videos/epoch_0450_pcd.mp4",
          "showcase_preview": false
        },
        {
          "task_id": "pdit-anchor",
          "kind": "video",
          "title": "Franka 拔插头仿真执行",
          "caption": "展示 PDIT 在拔插头任务中的仿真执行现场：策略从观测编码到 action chunk 输出后，驱动 Franka 机械臂完成接近、对位与执行动作。",
          "path": "research_archive/tasks/pdit/media/demo/videos/仿真-1.mp4",
          "showcase_preview": false
        }
      ],
      "summary_cards": [
        {
          "eyebrow": "Branch",
          "title": "把点云观测到 action chunk 的模仿学习主线真正搭起来了",
          "body": "这条线已经不只是“能训练一个模型”，而是从 3 帧点云观测到 32 步动作 chunk 的策略学习链路、损失监控和离线行为评估全都打通了。",
          "metrics": [
            {
              "label": "观测帧",
              "value": "3"
            },
            {
              "label": "动作 chunk",
              "value": "32"
            },
            {
              "label": "obs",
              "value": "point cloud"
            }
          ]
        },
        {
          "eyebrow": "Archive",
          "title": "research_archive 已固化 11 条run与 0 个 milestone",
          "body": "页面里的证据层、归档时间线和后续专题页素材现在都可以优先从 research_archive 消费，不必再回翻零散的 ckpt、autoresearch_records 和 docs 目录。",
          "metrics": [
            {
              "label": "归档条目",
              "value": "11"
            },
            {
              "label": "完整条目",
              "value": "0"
            },
            {
              "label": "milestone",
              "value": "0"
            }
          ]
        }
      ]
    },
    {
      "id": "mdit",
      "title": "MDIT 研究线",
      "summary": "MDIT 当前最稳的早期锚点仍是 0.55@100 的 RGB+文本主线。稳定化对照弱于主线，faithful 对照的首轮失败被确认是缓存和网络问题，严格 MTDP 对照没有通过共享闸门；",
      "status": "已验证",
      "status_group": "done",
      "page_path": "homepage/branches/mdit/",
      "latest_update": "2026-04-21",
      "hero_metrics": [
        {
          "label": "best success@20",
          "value": "0.75"
        },
        {
          "label": "100 epoch 锚点",
          "value": "0.55"
        },
        {
          "label": "best epoch",
          "value": "300"
        }
      ],
      "card_title": "MDIT 研究线",
      "card_summary": "围绕 RGB+文本主线、对照出清和 100→500 续训接管，收束成同一条可审计的多模态主线。",
      "card_result": "当前成果：best success 已稳定在 0.75@500，共享审计已越过早期 0.55@100 锚点。",
      "detail_intro": "围绕 RGB+文本主线、对照出清和 100→500 续训接管，收束成同一条可审计的多模态主线。 当前成果：best success 已稳定在 0.75@500，共享审计已越过早期 0.55@100 锚点。 当前已在 archive 中固化 9 条归档条目与 3 个 milestone。",
      "entry_path": "homepage/tasks/mdit-mainline/",
      "entry_label": "进入任务页",
      "related_task_ids": [
        "mdit-mainline"
      ],
      "timeline_groups": [
        {
          "date": "2026-04-21",
          "cards": [
            {
              "badge": "Archive Run",
              "title": "Put books on bookshelf MDIT mainline 50…",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-21",
              "metrics": [
                {
                  "label": "归档",
                  "value": "待补齐"
                },
                {
                  "label": "缺失",
                  "value": "audit_report"
                }
              ],
              "outcome": "collapse_detected: False",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/mdit/runs/2026-04-21__put_books_on_bookshelf_mdit_rgb_text_3token_500/report/report.md"
                },
                {
                  "title": "archive summary",
                  "path": "research_archive/tasks/mdit/runs/2026-04-21__put_books_on_bookshelf_mdit_rgb_text_3token_500/metrics/summary.json"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/mdit/runs/2026-04-21__put_books_on_bookshelf_mdit_rgb_text_3token_500/archive_manifest.json"
                }
              ],
              "task_id": "mdit-mainline",
              "task_title": "MDIT RGB+Text 主线推进"
            }
          ]
        },
        {
          "date": "2026-04-20",
          "cards": [
            {
              "badge": "Archive Run",
              "title": "audit_wandb_run",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-20",
              "metrics": [
                {
                  "label": "best success",
                  "value": "0.60"
                },
                {
                  "label": "best epoch",
                  "value": "100"
                },
                {
                  "label": "归档",
                  "value": "完整"
                }
              ],
              "outcome": "归档里已经固定 0.60@100 的结果，后续页面与专题页都可以直接复用。",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/mdit/runs/2026-04-20__audit_wandb_run/report/report.md"
                },
                {
                  "title": "archive summary",
                  "path": "research_archive/tasks/mdit/runs/2026-04-20__audit_wandb_run/metrics/summary.json"
                },
                {
                  "title": "archive audit",
                  "path": "research_archive/tasks/mdit/runs/2026-04-20__audit_wandb_run/metrics/audit_report.json"
                }
              ],
              "task_id": "mdit-mainline",
              "task_title": "MDIT RGB+Text 主线推进"
            },
            {
              "badge": "Archive Run",
              "title": "collapse_run",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-20",
              "metrics": [
                {
                  "label": "best success",
                  "value": "0.75"
                },
                {
                  "label": "best epoch",
                  "value": "300"
                },
                {
                  "label": "归档",
                  "value": "完整"
                }
              ],
              "outcome": "归档里已经固定 0.75@300 的结果，后续页面与专题页都可以直接复用。",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/mdit/runs/2026-04-20__collapse_run/report/report.md"
                },
                {
                  "title": "archive summary",
                  "path": "research_archive/tasks/mdit/runs/2026-04-20__collapse_run/metrics/summary.json"
                },
                {
                  "title": "archive audit",
                  "path": "research_archive/tasks/mdit/runs/2026-04-20__collapse_run/metrics/audit_report.json"
                }
              ],
              "task_id": "mdit-mainline",
              "task_title": "MDIT RGB+Text 主线推进"
            }
          ]
        },
        {
          "date": "2026-04-19",
          "cards": [
            {
              "badge": "MDIT 主线",
              "title": "100→500 主线续训完成共享审计并把长训结果抬到 0.75",
              "summary": "100 epoch 锁定锚点之后，MDIT 一直缺一条真正跑完并完成同口径共享审计的长训主线。",
              "date_key": "2026-04-19",
              "metrics": [
                {
                  "label": "线路",
                  "value": "MDIT 主线"
                },
                {
                  "label": "日期",
                  "value": "2026-04-19"
                },
                {
                  "label": "来源",
                  "value": "research desk"
                }
              ],
              "outcome": "MDIT 现在最重要的新结论不是“续训已经恢复”，而是“同一条 RGB+文本主线在共享审计下已经从 0.55@100 抬到了 0.75@300/500”。",
              "links": [
                {
                  "title": "500 续训审计记录",
                  "path": "autoresearch_records/unplug_charger_mdit_rgb_text_3token_100__lane_a_mainline_500_resume__e0500__20260418_005723.json"
                },
                {
                  "title": "MDIT 研究日志",
                  "path": "docs/mdit/research_journal.md"
                },
                {
                  "title": "修复留痕总表",
                  "path": "docs/fixes.md"
                }
              ],
              "task_id": "mdit-mainline",
              "task_title": "MDIT RGB+Text 主线推进"
            },
            {
              "badge": "Archive Run",
              "title": "100→500 主线续训",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-19",
              "metrics": [
                {
                  "label": "best success",
                  "value": "0.75"
                },
                {
                  "label": "best epoch",
                  "value": "300"
                },
                {
                  "label": "归档",
                  "value": "待补齐"
                }
              ],
              "outcome": "归档里已经固定 0.75@300 的结果，后续页面与专题页都可以直接复用。",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/mdit/runs/2026-04-19__unplug_charger_mdit_rgb_text_3token_100_lane_a_mainline_500_resume_e0500_20260418_005723/report/report.md"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/mdit/runs/2026-04-19__unplug_charger_mdit_rgb_text_3token_100_lane_a_mainline_500_resume_e0500_20260418_005723/archive_manifest.json"
                }
              ],
              "task_id": "mdit-mainline",
              "task_title": "MDIT RGB+Text 主线推进"
            },
            {
              "badge": "Archive Milestone",
              "title": "参考线快照",
              "summary": "该 milestone 快照已经固化，可直接作为主页和专题页的证据入口。",
              "date_key": "2026-04-19",
              "metrics": [
                {
                  "label": "类型",
                  "value": "reference_line"
                },
                {
                  "label": "缺失",
                  "value": "完整"
                }
              ],
              "outcome": "该目录已经作为 milestone 快照固化，可用于后续 best path / frozen best 展示。",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/mdit/milestones/2026-04-19__mdit_reference_line/report/report.md"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/mdit/milestones/2026-04-19__mdit_reference_line/archive_manifest.json"
                }
              ],
              "task_id": "mdit-mainline",
              "task_title": "MDIT RGB+Text 主线推进"
            }
          ]
        },
        {
          "date": "2026-04-18",
          "cards": [
            {
              "badge": "MDIT 主线",
              "title": "恢复 100→500 续训接管",
              "summary": "严格 MTDP 对照未过闸门后，理论上应该立即把预算收回到当前最佳路线继续长训，但实际接管时暴露出旧 checkpoint 的优化器状态和当前参数顺序不兼容，后台还会误把旧心跳当成新进度。",
              "date_key": "2026-04-18",
              "metrics": [
                {
                  "label": "线路",
                  "value": "MDIT 主线"
                },
                {
                  "label": "日期",
                  "value": "2026-04-18"
                },
                {
                  "label": "来源",
                  "value": "research desk"
                }
              ],
              "outcome": "MDIT 现在最重要的工作已经明确，不是再开更多相似候选，而是把当前最佳路线稳定推进到 500 epoch 并完成共享审计。",
              "links": [
                {
                  "title": "MDIT 研究日志",
                  "path": "docs/mdit/research_journal.md"
                },
                {
                  "title": "当前主线路径",
                  "path": "docs/mdit/best_path.md"
                },
                {
                  "title": "修复留痕总表",
                  "path": "docs/fixes.md"
                }
              ],
              "task_id": "mdit-mainline",
              "task_title": "MDIT RGB+Text 主线推进"
            },
            {
              "badge": "MDIT 对照线",
              "title": "严格 MTDP 对照未过共享闸门",
              "summary": "在稳定化和 faithful 对照之后，项目需要回答一个更强的问题：严格 MTDP 语义在当前共享评估链下是否真的值得替代现有 RGB+文本主线。",
              "date_key": "2026-04-18",
              "metrics": [
                {
                  "label": "线路",
                  "value": "MDIT 对照线"
                },
                {
                  "label": "日期",
                  "value": "2026-04-18"
                },
                {
                  "label": "来源",
                  "value": "research desk"
                }
              ],
              "outcome": "严格 MTDP 对照已经完成“值得不值得继续投入”的首轮回答，目前结论是否定的。",
              "links": [
                {
                  "title": "MDIT 研究日志",
                  "path": "docs/mdit/research_journal.md"
                },
                {
                  "title": "修复留痕总表",
                  "path": "docs/fixes.md"
                }
              ],
              "task_id": "mdit-mainline",
              "task_title": "MDIT RGB+Text 主线推进"
            },
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
            },
            {
              "badge": "Archive Run",
              "title": "严格 MTDP 对照",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-18",
              "metrics": [
                {
                  "label": "归档",
                  "value": "待补齐"
                },
                {
                  "label": "缺失",
                  "value": "3 项"
                }
              ],
              "outcome": "trial_score: -1.0 collapse_detected: True",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/mdit/runs/2026-04-18__unplug_charger_mdit_lane_c_mtdp_strict_fm_v1_lane_c_mtdp_strict_100_e0100_20260417_193720/report/report.md"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/mdit/runs/2026-04-18__unplug_charger_mdit_lane_c_mtdp_strict_fm_v1_lane_c_mtdp_strict_100_e0100_20260417_193720/archive_manifest.json"
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
              "badge": "MDIT 对照线",
              "title": "稳定化与 faithful 对照完成分流，主线不再被弱候选带偏",
              "summary": "在主线锚点出现后，仍需要确认稳定化对照和 faithful 对照到底是在挑战主线，还是只是在制造更多噪声；",
              "date_key": "2026-04-17",
              "metrics": [
                {
                  "label": "线路",
                  "value": "MDIT 对照线"
                },
                {
                  "label": "日期",
                  "value": "2026-04-17"
                },
                {
                  "label": "来源",
                  "value": "research desk"
                }
              ],
              "outcome": "稳定化对照已经被判定为弱线，不再作为主方向推进；",
              "links": [
                {
                  "title": "MDIT 研究日志",
                  "path": "docs/mdit/research_journal.md"
                },
                {
                  "title": "修复留痕总表",
                  "path": "docs/fixes.md"
                }
              ],
              "task_id": "mdit-mainline",
              "task_title": "MDIT RGB+Text 主线推进"
            },
            {
              "badge": "MDIT 主线",
              "title": "共享审计确认 0.55@100 锚点并冻结当前最佳路线",
              "summary": "当时需要一条已经过共享审计链验证的 RGB+文本锚点，否则后续所有候选都没有统一参照物，也很难决定谁该继续推进。",
              "date_key": "2026-04-17",
              "metrics": [
                {
                  "label": "线路",
                  "value": "MDIT 主线"
                },
                {
                  "label": "日期",
                  "value": "2026-04-17"
                },
                {
                  "label": "来源",
                  "value": "research desk"
                }
              ],
              "outcome": "0.55@100 是当前唯一经过共享审计链确认的 RGB+文本锚点。",
              "links": [
                {
                  "title": "MDIT 研究日志",
                  "path": "docs/mdit/research_journal.md"
                },
                {
                  "title": "当前主线路径",
                  "path": "docs/mdit/best_path.md"
                },
                {
                  "title": "修复留痕总表",
                  "path": "docs/fixes.md"
                }
              ],
              "task_id": "mdit-mainline",
              "task_title": "MDIT RGB+Text 主线推进"
            },
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
            },
            {
              "badge": "Archive Run",
              "title": "faithful recipe 对照",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-17",
              "metrics": [
                {
                  "label": "归档",
                  "value": "待补齐"
                },
                {
                  "label": "缺失",
                  "value": "3 项"
                }
              ],
              "outcome": "trial_score: -1.0 collapse_detected: True",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/mdit/runs/2026-04-17__unplug_charger_mdit_lane_b_faithful_fm_v1_lane_b_faithful_100_e0100_20260417_172029/report/report.md"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/mdit/runs/2026-04-17__unplug_charger_mdit_lane_b_faithful_fm_v1_lane_b_faithful_100_e0100_20260417_172029/archive_manifest.json"
                }
              ],
              "task_id": "mdit-mainline",
              "task_title": "MDIT RGB+Text 主线推进"
            },
            {
              "badge": "Archive Run",
              "title": "RGB+文本主线 100 轮锚点",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-17",
              "metrics": [
                {
                  "label": "best success",
                  "value": "0.55"
                },
                {
                  "label": "best epoch",
                  "value": "100"
                },
                {
                  "label": "归档",
                  "value": "完整"
                }
              ],
              "outcome": "归档里已经固定 0.55@100 的结果，后续页面与专题页都可以直接复用。",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/mdit/runs/2026-04-17__unplug_charger_mdit_rgb_text_3token_100/report/report.md"
                },
                {
                  "title": "archive summary",
                  "path": "research_archive/tasks/mdit/runs/2026-04-17__unplug_charger_mdit_rgb_text_3token_100/metrics/summary.json"
                },
                {
                  "title": "archive audit",
                  "path": "research_archive/tasks/mdit/runs/2026-04-17__unplug_charger_mdit_rgb_text_3token_100/metrics/audit_report.json"
                }
              ],
              "task_id": "mdit-mainline",
              "task_title": "MDIT RGB+Text 主线推进"
            },
            {
              "badge": "Archive Run",
              "title": "平滑动作稳定化对照",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-17",
              "metrics": [
                {
                  "label": "归档",
                  "value": "待补齐"
                },
                {
                  "label": "缺失",
                  "value": "3 项"
                }
              ],
              "outcome": "trial_score: -1.0 collapse_detected: True",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/mdit/runs/2026-04-17__unplug_charger_mdit_rgb_text_fm_v1_lane_a_stabilized_100_e0100_20260417_105544/report/report.md"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/mdit/runs/2026-04-17__unplug_charger_mdit_rgb_text_fm_v1_lane_a_stabilized_100_e0100_20260417_105544/archive_manifest.json"
                }
              ],
              "task_id": "mdit-mainline",
              "task_title": "MDIT RGB+Text 主线推进"
            },
            {
              "badge": "Archive Run",
              "title": "平滑动作稳定化对照",
              "summary": "归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
              "date_key": "2026-04-17",
              "metrics": [
                {
                  "label": "best success",
                  "value": "0.35"
                },
                {
                  "label": "best epoch",
                  "value": "100"
                },
                {
                  "label": "归档",
                  "value": "待补齐"
                }
              ],
              "outcome": "归档里已经固定 0.35@100 的结果，后续页面与专题页都可以直接复用。",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/mdit/runs/2026-04-17__unplug_charger_mdit_rgb_text_fm_v1_lane_a_stabilized_100_e0100_20260417_112329/report/report.md"
                },
                {
                  "title": "archive manifest",
                  "path": "research_archive/tasks/mdit/runs/2026-04-17__unplug_charger_mdit_rgb_text_fm_v1_lane_a_stabilized_100_e0100_20260417_112329/archive_manifest.json"
                }
              ],
              "task_id": "mdit-mainline",
              "task_title": "MDIT RGB+Text 主线推进"
            },
            {
              "badge": "Archive Milestone",
              "title": "冻结最优快照",
              "summary": "该 milestone 快照已经固化，可直接作为主页和专题页的证据入口。",
              "date_key": "2026-04-17",
              "metrics": [
                {
                  "label": "类型",
                  "value": "frozen_best_snapshot"
                },
                {
                  "label": "缺失",
                  "value": "完整"
                }
              ],
              "outcome": "该目录已经作为 milestone 快照固化，可用于后续 best path / frozen best 展示。",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/mdit/milestones/2026-04-17__2026_04_17_110536_lane_a_mainline_epoch100_s055/report/report.md"
                },
                {
                  "title": "archive summary",
                  "path": "research_archive/tasks/mdit/milestones/2026-04-17__2026_04_17_110536_lane_a_mainline_epoch100_s055/metrics/summary.json"
                },
                {
                  "title": "archive audit",
                  "path": "research_archive/tasks/mdit/milestones/2026-04-17__2026_04_17_110536_lane_a_mainline_epoch100_s055/metrics/audit_report.json"
                }
              ],
              "task_id": "mdit-mainline",
              "task_title": "MDIT RGB+Text 主线推进"
            },
            {
              "badge": "Archive Milestone",
              "title": "冻结最优快照",
              "summary": "该 milestone 快照已经固化，可直接作为主页和专题页的证据入口。",
              "date_key": "2026-04-17",
              "metrics": [
                {
                  "label": "类型",
                  "value": "frozen_best_snapshot"
                },
                {
                  "label": "缺失",
                  "value": "完整"
                }
              ],
              "outcome": "该目录已经作为 milestone 快照固化，可用于后续 best path / frozen best 展示。",
              "links": [
                {
                  "title": "归档报告",
                  "path": "research_archive/tasks/mdit/milestones/2026-04-17__current_provisional_best/report/report.md"
                },
                {
                  "title": "archive summary",
                  "path": "research_archive/tasks/mdit/milestones/2026-04-17__current_provisional_best/metrics/summary.json"
                },
                {
                  "title": "archive audit",
                  "path": "research_archive/tasks/mdit/milestones/2026-04-17__current_provisional_best/metrics/audit_report.json"
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
              "badge": "MDIT 主线",
              "title": "共享评估契约与后台守护链固化为标准执行方式",
              "summary": "即便主线配方已经回收完成，只要训练口径、评估口径、冠军冻结和后台接管没有锁死，后续 run 依然会因为配方漂移或中断恢复而失去继承关系。",
              "date_key": "2026-04-16",
              "metrics": [
                {
                  "label": "线路",
                  "value": "MDIT 主线"
                },
                {
                  "label": "日期",
                  "value": "2026-04-16"
                },
                {
                  "label": "来源",
                  "value": "research desk"
                }
              ],
              "outcome": "MDIT 从这一步起不再只是零散实验集合，而是一条可托管、可恢复、可比较的研究线；",
              "links": [
                {
                  "title": "MDIT 执行手册",
                  "path": "docs/mdit/2026-04-16-mdit-execution-manual.md"
                },
                {
                  "title": "MDIT 研究日志",
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
        },
        {
          "date": "2026-04-15",
          "cards": [
            {
              "badge": "MDIT 主线",
              "title": "faithful RGB+文本默认路径与共享评估口径定版",
              "summary": "在这一步之前，MDIT 主线仍混入了点云兼容默认路径、PDIT 语义残留和 EMA 默认分支，导致“当前到底在跑什么配方”无法一句话说清。",
              "date_key": "2026-04-15",
              "metrics": [
                {
                  "label": "线路",
                  "value": "MDIT 主线"
                },
                {
                  "label": "日期",
                  "value": "2026-04-15"
                },
                {
                  "label": "来源",
                  "value": "research desk"
                }
              ],
              "outcome": "从这一步开始，MDIT 主线终于拥有可以持续复现和解释的默认配方；",
              "links": [
                {
                  "title": "修复留痕总表",
                  "path": "docs/fixes.md"
                },
                {
                  "title": "MDIT 执行手册",
                  "path": "docs/mdit/2026-04-16-mdit-execution-manual.md"
                }
              ],
              "task_id": "mdit-mainline",
              "task_title": "MDIT RGB+Text 主线推进"
            }
          ]
        },
        {
          "date": "2026-04-13",
          "cards": [
            {
              "badge": "MDIT 主线",
              "title": "早期兼容排查确认混合消融不能直接支持结构结论",
              "summary": "MDIT 早期在 RGB、点云、PDIT backbone、PDIT 条件路径等多种改动之间来回排查时，表面上虽然不断有训练现象和验证损失，但很难说明到底是哪一个因素真正起作用。",
              "date_key": "2026-04-13",
              "metrics": [
                {
                  "label": "线路",
                  "value": "MDIT 主线"
                },
                {
                  "label": "日期",
                  "value": "2026-04-13"
                },
                {
                  "label": "来源",
                  "value": "research desk"
                }
              ],
              "outcome": "MDIT 不能靠“把能跑的东西拼起来”推进；",
              "links": [
                {
                  "title": "PDIT 与 MDIT 定位对照",
                  "path": "docs/pdit-vs-mdit.md"
                },
                {
                  "title": "修复留痕总表",
                  "path": "docs/fixes.md"
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
          "title": "archive 报告 · Put books on bookshelf MDIT mainline 50…",
          "path": "research_archive/tasks/mdit/runs/2026-04-21__put_books_on_bookshelf_mdit_rgb_text_3token_500/report/report.md",
          "summary": "archive 内的背景、核心结果与证据索引已经整理成可直接消费的报告页。",
          "label": "打开归档报告"
        },
        {
          "title": "archive summary · Put books on bookshelf MDIT mainline 50…",
          "path": "research_archive/tasks/mdit/runs/2026-04-21__put_books_on_bookshelf_mdit_rgb_text_3token_500/metrics/summary.json",
          "summary": "训练后固化的结构化 summary，会作为后续图表和专题页的统一输入。",
          "label": "打开 summary"
        },
        {
          "title": "archive 报告 · audit_wandb_run",
          "path": "research_archive/tasks/mdit/runs/2026-04-20__audit_wandb_run/report/report.md",
          "summary": "archive 内的背景、核心结果与证据索引已经整理成可直接消费的报告页。",
          "label": "打开归档报告"
        },
        {
          "title": "archive summary · audit_wandb_run",
          "path": "research_archive/tasks/mdit/runs/2026-04-20__audit_wandb_run/metrics/summary.json",
          "summary": "训练后固化的结构化 summary，会作为后续图表和专题页的统一输入。",
          "label": "打开 summary"
        },
        {
          "title": "archive audit · audit_wandb_run",
          "path": "research_archive/tasks/mdit/runs/2026-04-20__audit_wandb_run/metrics/audit_report.json",
          "summary": "共享审计或行为审计结果已复制进 archive，可直接作为后续展示证据。",
          "label": "打开 audit"
        },
        {
          "title": "archive 报告 · collapse_run",
          "path": "research_archive/tasks/mdit/runs/2026-04-20__collapse_run/report/report.md",
          "summary": "archive 内的背景、核心结果与证据索引已经整理成可直接消费的报告页。",
          "label": "打开归档报告"
        },
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
        "mdit-audit-rank",
        "mdit-loss-curve",
        "mdit-mse-curve"
      ],
      "dashboard_chart_ids": [
        "branch-mdit-rank",
        "branch-mdit-loss",
        "branch-mdit-mse"
      ],
      "chart_media_items": [
        {
          "id": "archive-chart-mdit-mainline-01-mdit-rank-overview-svg",
          "type": "media_chart",
          "title": "MDIT 关键结果排行",
          "description": "把主线关键节点和共享审计结果放到一张图里，直接看当前真正成立的阶段结果。",
          "path": "research_archive/tasks/mdit/media/charts/01-mdit_rank_overview.svg",
          "kind": "image",
          "source_kind": "manual",
          "note": "300 / 500 epoch 已经超过早期 0.55@100 锚点，因此这条线后面更应该看 loss 与 MSE 怎样支撑这个提升。"
        },
        {
          "id": "archive-chart-mdit-mainline-02-mdit-mainline-loss-curve-svg",
          "type": "media_chart",
          "title": "MDIT 主线 loss 趋势",
          "description": "围绕 100→500 主线续训，直接看 train / valid total loss 如何收束。",
          "path": "research_archive/tasks/mdit/media/charts/02-mdit_mainline_loss_curve.svg",
          "kind": "image",
          "source_kind": "manual",
          "note": "使用 W&B API 抓取完整 history，展示主线真实训练曲线。"
        },
        {
          "id": "archive-chart-mdit-mainline-03-mdit-mainline-mse-curve-svg",
          "type": "media_chart",
          "title": "MDIT 主线 MSE 变化",
          "description": "把 xyz / rot6d / grip 三条误差拆开，解释长训结果为什么能抬到 0.75。",
          "path": "research_archive/tasks/mdit/media/charts/03-mdit_mainline_mse_curve.svg",
          "kind": "image",
          "source_kind": "manual",
          "note": "使用 W&B API 抓取 valid mse_xyz / mse_rot6d / mse_grip 全量 history。"
        }
      ],
      "media_items": [
        {
          "task_id": "mdit-mainline",
          "kind": "image",
          "title": "MDIT RGB+Text 主线封面",
          "caption": "作为当前 MDIT 主线封面，概括多视角视觉、文本条件与动作生成之间的整体结构。",
          "path": "research_archive/tasks/mdit/media/demo/images/mtdp_architecture.png",
          "showcase_preview": false
        },
        {
          "task_id": "mdit-mainline",
          "kind": "video",
          "title": "MDIT RGB+Text 关门仿真演示",
          "caption": "该片段来自 RGB+Text 主线训练后的关门仿真，说明语言条件已经能落到可执行动作轨迹。它对应的是一条更贴近 VLA / 世界模型接口的多模态策略路径：先对齐视觉与文本语义，再生成 action chunk。",
          "path": "research_archive/tasks/mdit/media/demo/videos/关门仿真-1.mp4",
          "showcase_preview": false
        }
      ],
      "summary_cards": [
        {
          "eyebrow": "Branch",
          "title": "把 5 路 RGB + 文本到 action chunk 的多模态主线真正立起来了",
          "body": "这条线已经明确落成了以 CLIP 视觉语义和任务文本为条件的多模态策略主线，而不是停留在“加点视觉、加点文本”的 loose idea。",
          "metrics": [
            {
              "label": "RGB 视角",
              "value": "5"
            },
            {
              "label": "观测帧",
              "value": "3"
            },
            {
              "label": "动作 chunk",
              "value": "32"
            }
          ]
        },
        {
          "eyebrow": "Archive",
          "title": "research_archive 已固化 9 条run与 3 个 milestone",
          "body": "页面里的证据层、归档时间线和后续专题页素材现在都可以优先从 research_archive 消费，不必再回翻零散的 ckpt、autoresearch_records 和 docs 目录。",
          "metrics": [
            {
              "label": "归档条目",
              "value": "9"
            },
            {
              "label": "完整条目",
              "value": "6"
            },
            {
              "label": "milestone",
              "value": "3"
            }
          ]
        }
      ]
    },
    {
      "id": "act",
      "title": "ACT 模仿学习线",
      "summary": "围绕 LeRobot v3 数据、世界坐标示教、多视角 RGB-D 感知和 ACT 策略部署，把自研机械臂整理成一条可展示的具身模仿学习工作线。",
      "status": "已完成",
      "status_group": "done",
      "page_path": "homepage/branches/act/",
      "latest_update": "2026-05-01",
      "hero_metrics": [
        {
          "label": "episodes",
          "value": "5"
        },
        {
          "label": "frames",
          "value": "4379"
        },
        {
          "label": "fps",
          "value": "10Hz"
        }
      ],
      "card_title": "ACT 模仿学习线",
      "card_summary": "围绕 LeRobot v3 数据、世界坐标示教和 ACT 策略部署，把自研机械臂整理成可展示的具身模仿学习闭环。",
      "card_result": "当前成果：5 个 cleaned episodes、4379 帧多视角数据和方块叠放 ACT demo 已打通。",
      "detail_intro": "围绕 LeRobot v3 数据、世界坐标示教和 ACT 策略部署，把自研机械臂整理成可展示的具身模仿学习闭环。 当前成果：5 个 cleaned episodes、4379 帧多视角数据和方块叠放 ACT demo 已打通。",
      "entry_path": "homepage/tasks/act-lerobot-demo/",
      "entry_label": "进入任务页",
      "related_task_ids": [
        "act-lerobot-demo"
      ],
      "timeline_groups": [
        {
          "date": "2026-05-01",
          "cards": [
            {
              "badge": "Demo",
              "title": "LeRobot 采集、ACT 部署与 VLA 扩展接口在同一天收束成可展示闭环",
              "summary": "三路相机、LeRobot v3 数据集、真实回放索引和 ACT demo 在这一天被整理成统一成果线，项目从“控制平台”正式推进到“具身模仿学习 demo”。",
              "metrics": [
                {
                  "label": "episodes",
                  "value": "5"
                },
                {
                  "label": "frames",
                  "value": "4379"
                },
                {
                  "label": "demo",
                  "value": "已打通"
                }
              ],
              "outcome": "ACT 线已经形成完整闭环，后续可以在同一数据和动作接口上继续挂 VLA / 世界模型研究。",
              "links": [
                {
                  "title": "ACT / LeRobot 实践记录",
                  "path": "research_archive/tasks/act/notes/DummyV2_LeRobot_ACT实践记录.md"
                },
                {
                  "title": "关键结果表",
                  "path": "research_archive/tasks/act/media/tables/act_key_results.csv"
                }
              ],
              "task_id": "act-lerobot-demo",
              "task_title": "Dummy V2 LeRobot + ACT 具身模仿学习 Demo"
            }
          ]
        },
        {
          "date": "2026-04-29",
          "cards": [
            {
              "badge": "RL Warm-start",
              "title": "Isaac Lab PPO 课程预训练把接触前后动作拆成三阶段",
              "summary": "Reach、PreGrasp、GraspLift 被拆成统一动作接口下的三阶段课程，用并行环境把空间移动与抓取抬升的基础先验先学出来。",
              "metrics": [
                {
                  "label": "curriculum",
                  "value": "3 阶段"
                },
                {
                  "label": "parallel envs",
                  "value": "128"
                },
                {
                  "label": "action dim",
                  "value": "7"
                }
              ],
              "outcome": "真实 ACT 训练不必从零学习基础运动，sim2real 桥接路线开始成立。",
              "links": [
                {
                  "title": "ACT / LeRobot 实践记录",
                  "path": "research_archive/tasks/act/notes/DummyV2_LeRobot_ACT实践记录.md"
                }
              ],
              "task_id": "act-lerobot-demo",
              "task_title": "Dummy V2 LeRobot + ACT 具身模仿学习 Demo"
            }
          ]
        },
        {
          "date": "2026-04-27",
          "cards": [
            {
              "badge": "Hardware",
              "title": "夹爪固件、电流阈值和受保护开合逻辑完成定版",
              "summary": "线轨夹爪的静摩擦、电流阈值和 disable 保护被真正落到控制链里，夹爪不再被当成普通关节直接暴力驱动。",
              "metrics": [
                {
                  "label": "夹爪控制",
                  "value": "独立命令"
                },
                {
                  "label": "保护",
                  "value": "open / close / disable"
                },
                {
                  "label": "静摩擦",
                  "value": "约 0.7A"
                }
              ],
              "outcome": "真实回放和策略部署终于有了稳定、可重复的末端执行条件。",
              "links": [
                {
                  "title": "ACT / LeRobot 实践记录",
                  "path": "research_archive/tasks/act/notes/DummyV2_LeRobot_ACT实践记录.md"
                }
              ],
              "task_id": "act-lerobot-demo",
              "task_title": "Dummy V2 LeRobot + ACT 具身模仿学习 Demo"
            }
          ]
        },
        {
          "date": "2026-04-24",
          "cards": [
            {
              "badge": "Teleoperation",
              "title": "世界坐标 Jog、MuJoCo 同步和 posture-biased IK 串成同一条示教链路",
              "summary": "操作员输入先落到 TCP，再经 IK、连续性约束和安全边界转成可记录动作，示教从关节拖动升级成任务空间路线采集。",
              "metrics": [
                {
                  "label": "动作口径",
                  "value": "TCP → joints"
                },
                {
                  "label": "预览",
                  "value": "MuJoCo"
                },
                {
                  "label": "目标",
                  "value": "任务空间示教"
                }
              ],
              "outcome": "示范数据语义更干净，也更适合后续 ACT / VLA 学习。",
              "links": [
                {
                  "title": "ACT / LeRobot 实践记录",
                  "path": "research_archive/tasks/act/notes/DummyV2_LeRobot_ACT实践记录.md"
                }
              ],
              "task_id": "act-lerobot-demo",
              "task_title": "Dummy V2 LeRobot + ACT 具身模仿学习 Demo"
            }
          ]
        },
        {
          "date": "2026-04-21",
          "cards": [
            {
              "badge": "Control",
              "title": "先把真机控制、边界保护和回放安全链打稳",
              "summary": "在引入 LeRobot 和 ACT 之前，先明确关节限位、用户软边界、回放节奏和 CAN / 串口保护，确保后续学习链路建立在安全控制底座上。",
              "metrics": [
                {
                  "label": "robot",
                  "value": "6DoF + 二值夹爪"
                },
                {
                  "label": "回放",
                  "value": "受保护"
                },
                {
                  "label": "目标",
                  "value": "长期复用"
                }
              ],
              "outcome": "ACT 这条线从一开始就不是孤立 demo，而是建立在可长期复用的控制与采集平台之上。",
              "links": [
                {
                  "title": "ACT / LeRobot 实践记录",
                  "path": "research_archive/tasks/act/notes/DummyV2_LeRobot_ACT实践记录.md"
                }
              ],
              "task_id": "act-lerobot-demo",
              "task_title": "Dummy V2 LeRobot + ACT 具身模仿学习 Demo"
            }
          ]
        }
      ],
      "evidence_links": [
        {
          "title": "DummyV2 LeRobot ACT实践记录",
          "path": "research_archive/tasks/act/notes/DummyV2_LeRobot_ACT实践记录.md",
          "summary": "",
          "label": "查看原始记录"
        }
      ],
      "chart_ids": [
        "act-dataset-overview",
        "act-stack-coverage",
        "act-policy-interface"
      ],
      "dashboard_chart_ids": [
        "branch-act-dataset",
        "branch-act-stack",
        "branch-act-policy"
      ],
      "chart_media_items": [],
      "media_items": [
        {
          "task_id": "act-lerobot-demo",
          "kind": "video",
          "title": "LeRobot + ACT 叠方块 Demo",
          "caption": "展示 Dummy V2 基于 LeRobot v3 数据和 ACT 策略完成方块抓取与叠放的具身模仿学习 demo。这条线已经把采集、训练、部署和安全回放接成闭环，并为后续 VLA / 世界模型继续接入保留了统一动作接口。",
          "path": "research_archive/tasks/act/media/demo/videos/01-LeRobot框架与ACTdemo.mp4",
          "showcase_preview": false
        }
      ],
      "summary_cards": [
        {
          "eyebrow": "Branch",
          "title": "把自研机械臂整理成 LeRobot 可直接消费的数据和回放入口",
          "body": "这条线真正完成的不是单个 demo 视频，而是把世界坐标示教、多视角感知、关节安全回放和 LeRobot v3 结构统一成同一套具身数据接口。",
          "metrics": [
            {
              "label": "episodes",
              "value": "5"
            },
            {
              "label": "frames",
              "value": "4379"
            },
            {
              "label": "camera",
              "value": "3"
            }
          ]
        }
      ]
    },
    {
      "id": "lingbot-va",
      "title": "LingBot-VA 世界模型线",
      "summary": "围绕视频 latent + 动作联合建模、单任务 smoke 与离线 demo exporter，逐步切入 LingBot-VA 的世界模型后训练研究。",
      "status": "推进中",
      "status_group": "in_progress",
      "page_path": "homepage/branches/lingbot-va/",
      "latest_update": "2026-04-19",
      "hero_metrics": [
        {
          "label": "smoke step",
          "value": "1"
        },
        {
          "label": "offline action_mse",
          "value": "0.0067"
        },
        {
          "label": "当前阶段",
          "value": "smoke+demo"
        }
      ],
      "card_title": "LingBot-VA 世界模型线",
      "card_summary": "围绕视频 latent + 动作联合建模的世界模型后训练，先把单任务 smoke、离线 demo 导出和显存边界摸清。",
      "card_result": "当前成果：单任务单卡 smoke、checkpoint 保存和离线 demo exporter 都已打通。",
      "detail_intro": "围绕视频 latent + 动作联合建模的世界模型后训练，先把单任务 smoke、离线 demo 导出和显存边界摸清。 当前成果：单任务单卡 smoke、checkpoint 保存和离线 demo exporter 都已打通。",
      "entry_path": "homepage/tasks/lingbot-va-world-model/",
      "entry_label": "进入任务页",
      "related_task_ids": [
        "lingbot-va-world-model"
      ],
      "timeline_groups": [
        {
          "date": "2026-04-19",
          "cards": [
            {
              "badge": "Smoke",
              "title": "单任务单卡 smoke 训练链路跑通",
              "summary": "先把 LingBot-VA 的最小训练闭环跑通：单任务数据读取、前向、反向、optimizer update、checkpoint 保存和 WandB 记录都在一条链上验证过了。",
              "metrics": [
                {
                  "label": "latent_loss",
                  "value": "0.0422"
                },
                {
                  "label": "action_loss",
                  "value": "0.7244"
                },
                {
                  "label": "grad_norm",
                  "value": "3.78"
                }
              ],
              "outcome": "世界模型后训练的最小可复现入口已经站住，后续不需要再从“机器能不能跑”重新摸索。",
              "links": [
                {
                  "title": "项目速读",
                  "path": "homepage/external/lingbot_va/docs/project_guide.md"
                },
                {
                  "title": "阶段 desk",
                  "path": "homepage/external/lingbot_va/docs/research_desk.md"
                }
              ],
              "task_id": "lingbot-va-world-model",
              "task_title": "LingBot-VA 世界模型后训练切入"
            },
            {
              "badge": "Demo Export",
              "title": "离线 demo exporter 打通本地单任务验证",
              "summary": "预测视频、动作对照和误差指标已经能从同一次导出里一起产出，不再只是拿 loss 判断这条线有没有学到东西。",
              "metrics": [
                {
                  "label": "video_mse",
                  "value": "0.0036"
                },
                {
                  "label": "action_mse",
                  "value": "0.0067"
                },
                {
                  "label": "pred frames",
                  "value": "45"
                }
              ],
              "outcome": "这条线已经从“只有训练日志”推进到“有视频预测和离线指标”的可展示阶段。",
              "links": [
                {
                  "title": "离线导出总结",
                  "path": "homepage/external/lingbot_va/eval/summary.json"
                },
                {
                  "title": "summary.csv",
                  "path": "homepage/external/lingbot_va/eval/summary.csv"
                }
              ],
              "task_id": "lingbot-va-world-model",
              "task_title": "LingBot-VA 世界模型后训练切入"
            },
            {
              "badge": "Boundary",
              "title": "单卡全参数 post-train 的真实边界被明确暴露出来",
              "summary": "当前 24GB 单卡不能直接承载全参数 RoboTwin post-train，世界模型这条线后面必须朝多卡或参数高效训练方案推进。",
              "metrics": [
                {
                  "label": "显存",
                  "value": "24GB"
                },
                {
                  "label": "full FT",
                  "value": "受限"
                },
                {
                  "label": "下一步",
                  "value": "多卡 / PEFT"
                }
              ],
              "outcome": "后续研究方向已经从“再硬挤单卡”切到“明确训练策略与评测链路”，路线判断更清晰了。",
              "links": [
                {
                  "title": "阶段 desk",
                  "path": "homepage/external/lingbot_va/docs/research_desk.md"
                },
                {
                  "title": "问题修复日志",
                  "path": "homepage/external/lingbot_va/docs/fixes.md"
                }
              ],
              "task_id": "lingbot-va-world-model",
              "task_title": "LingBot-VA 世界模型后训练切入"
            }
          ]
        }
      ],
      "evidence_links": [
        {
          "title": "project guide",
          "path": "homepage/external/lingbot_va/docs/project_guide.md",
          "summary": "",
          "label": "查看原始记录"
        },
        {
          "title": "research desk",
          "path": "homepage/external/lingbot_va/docs/research_desk.md",
          "summary": "",
          "label": "查看原始记录"
        }
      ],
      "chart_ids": [
        "lingbot-smoke-metrics",
        "lingbot-offline-eval",
        "lingbot-system-boundary"
      ],
      "dashboard_chart_ids": [
        "branch-lingbot-smoke",
        "branch-lingbot-eval",
        "branch-lingbot-boundary"
      ],
      "chart_media_items": [],
      "media_items": [
        {
          "task_id": "lingbot-va-world-model",
          "kind": "image",
          "title": "LingBot-VA 世界模型线封面",
          "caption": "用 RoboTwin 任务场景作为切入口，展示这条线当前聚焦的视频 latent + 动作联合后训练方向。",
          "path": "research_archive/tasks/lingbot/media/demo/images/00-lingbot-va-cover.png",
          "showcase_preview": true
        }
      ],
      "summary_cards": [
        {
          "eyebrow": "Branch",
          "title": "视频 latent + 动作联合后训练入口已打通",
          "body": "这条线已经从“只会看代码”推进到“能跑 smoke、能导 demo、知道算力边界”，适合继续往世界模型 / VLA 后训练深入。",
          "metrics": [
            {
              "label": "任务",
              "value": "click_bell"
            },
            {
              "label": "模式",
              "value": "single-task smoke"
            },
            {
              "label": "状态",
              "value": "推进中"
            }
          ]
        }
      ]
    },
    {
      "id": "lelan",
      "title": "LeLaN 执行线",
      "summary": "LeLaN 当前的重点仍是把执行链路固化成可长期追加的自动研究流程，而不是抢先做更激进的结构搜索。训练、评估、EMA 兼容、离线审计和 100/300/500 epoch 闸门规则已经定版，但正式 run 的行为结果还没有形成足够强的阶段结论，需要后续补齐。",
      "status": "铺设中",
      "status_group": "in_progress",
      "page_path": "homepage/branches/lelan/",
      "latest_update": "2026-04-12",
      "hero_metrics": [
        {
          "label": "观测设置",
          "value": "5 路 RGB / 3 帧"
        },
        {
          "label": "动作步数",
          "value": "8"
        },
        {
          "label": "gate@100",
          "value": "0.45"
        }
      ],
      "card_title": "LeLaN 执行线",
      "card_summary": "围绕 LeLaN 的训练、评估、选模和审计流程，先把自动研究执行链路固化下来。",
      "card_result": "当前成果：100 / 300 / 500 gate 已定版，等待正式 run 结果。",
      "detail_intro": "围绕 LeLaN 的训练、评估、选模和审计流程，先把自动研究执行链路固化下来。 当前成果：100 / 300 / 500 gate 已定版，等待正式 run 结果。",
      "entry_path": "homepage/tasks/lelan-pipeline/",
      "entry_label": "进入任务页",
      "related_task_ids": [
        "lelan-pipeline"
      ],
      "timeline_groups": [
        {
          "date": "2026-04-12",
          "cards": [
            {
              "badge": "LeLaN 执行线",
              "title": "自动研究链路与 100/300/500 闸门定版",
              "summary": "LeLaN 当时更缺的是训练、评估、选模和留痕的统一入口，而不是立即继续做新的结构尝试；",
              "date_key": "2026-04-12",
              "metrics": [
                {
                  "label": "线路",
                  "value": "LeLaN 执行线"
                },
                {
                  "label": "日期",
                  "value": "2026-04-12"
                },
                {
                  "label": "来源",
                  "value": "research desk"
                }
              ],
              "outcome": "LeLaN 现在首先是一条“执行线”，目标是把正式实验沉淀成可长期追加的研究档案；",
              "links": [
                {
                  "title": "LeLaN 执行计划",
                  "path": "docs/lelan/2026-04-12-lelan-autoresearch-execution-plan-zh.md"
                },
                {
                  "title": "LeLaN 研究记录约定",
                  "path": "docs/lelan/research/README.md"
                }
              ],
              "task_id": "lelan-pipeline",
              "task_title": "LeLaN 自动研究链路固化"
            },
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
      "dashboard_chart_ids": [
        "branch-lelan-gate",
        "branch-lelan-readiness"
      ],
      "chart_media_items": [],
      "media_items": [],
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
      "date": "2026-05-01",
      "cards": [
        {
          "badge": "Demo",
          "title": "LeRobot 采集、ACT 部署与 VLA 扩展接口在同一天收束成可展示闭环",
          "summary": "三路相机、LeRobot v3 数据集、真实回放索引和 ACT demo 在这一天被整理成统一成果线，项目从“控制平台”正式推进到“具身模仿学习 demo”。",
          "metrics": [
            {
              "label": "episodes",
              "value": "5"
            },
            {
              "label": "frames",
              "value": "4379"
            },
            {
              "label": "demo",
              "value": "已打通"
            }
          ],
          "outcome": "ACT 线已经形成完整闭环，后续可以在同一数据和动作接口上继续挂 VLA / 世界模型研究。",
          "links": [
            {
              "title": "ACT / LeRobot 实践记录",
              "path": "research_archive/tasks/act/notes/DummyV2_LeRobot_ACT实践记录.md"
            },
            {
              "title": "关键结果表",
              "path": "research_archive/tasks/act/media/tables/act_key_results.csv"
            }
          ],
          "task_id": "act-lerobot-demo",
          "task_title": "Dummy V2 LeRobot + ACT 具身模仿学习 Demo",
          "task_path": "homepage/tasks/act-lerobot-demo/"
        }
      ]
    },
    {
      "date": "2026-04-29",
      "cards": [
        {
          "badge": "RL Warm-start",
          "title": "Isaac Lab PPO 课程预训练把接触前后动作拆成三阶段",
          "summary": "Reach、PreGrasp、GraspLift 被拆成统一动作接口下的三阶段课程，用并行环境把空间移动与抓取抬升的基础先验先学出来。",
          "metrics": [
            {
              "label": "curriculum",
              "value": "3 阶段"
            },
            {
              "label": "parallel envs",
              "value": "128"
            },
            {
              "label": "action dim",
              "value": "7"
            }
          ],
          "outcome": "真实 ACT 训练不必从零学习基础运动，sim2real 桥接路线开始成立。",
          "links": [
            {
              "title": "ACT / LeRobot 实践记录",
              "path": "research_archive/tasks/act/notes/DummyV2_LeRobot_ACT实践记录.md"
            }
          ],
          "task_id": "act-lerobot-demo",
          "task_title": "Dummy V2 LeRobot + ACT 具身模仿学习 Demo",
          "task_path": "homepage/tasks/act-lerobot-demo/"
        }
      ]
    },
    {
      "date": "2026-04-27",
      "cards": [
        {
          "badge": "Hardware",
          "title": "夹爪固件、电流阈值和受保护开合逻辑完成定版",
          "summary": "线轨夹爪的静摩擦、电流阈值和 disable 保护被真正落到控制链里，夹爪不再被当成普通关节直接暴力驱动。",
          "metrics": [
            {
              "label": "夹爪控制",
              "value": "独立命令"
            },
            {
              "label": "保护",
              "value": "open / close / disable"
            },
            {
              "label": "静摩擦",
              "value": "约 0.7A"
            }
          ],
          "outcome": "真实回放和策略部署终于有了稳定、可重复的末端执行条件。",
          "links": [
            {
              "title": "ACT / LeRobot 实践记录",
              "path": "research_archive/tasks/act/notes/DummyV2_LeRobot_ACT实践记录.md"
            }
          ],
          "task_id": "act-lerobot-demo",
          "task_title": "Dummy V2 LeRobot + ACT 具身模仿学习 Demo",
          "task_path": "homepage/tasks/act-lerobot-demo/"
        }
      ]
    },
    {
      "date": "2026-04-24",
      "cards": [
        {
          "badge": "Teleoperation",
          "title": "世界坐标 Jog、MuJoCo 同步和 posture-biased IK 串成同一条示教链路",
          "summary": "操作员输入先落到 TCP，再经 IK、连续性约束和安全边界转成可记录动作，示教从关节拖动升级成任务空间路线采集。",
          "metrics": [
            {
              "label": "动作口径",
              "value": "TCP → joints"
            },
            {
              "label": "预览",
              "value": "MuJoCo"
            },
            {
              "label": "目标",
              "value": "任务空间示教"
            }
          ],
          "outcome": "示范数据语义更干净，也更适合后续 ACT / VLA 学习。",
          "links": [
            {
              "title": "ACT / LeRobot 实践记录",
              "path": "research_archive/tasks/act/notes/DummyV2_LeRobot_ACT实践记录.md"
            }
          ],
          "task_id": "act-lerobot-demo",
          "task_title": "Dummy V2 LeRobot + ACT 具身模仿学习 Demo",
          "task_path": "homepage/tasks/act-lerobot-demo/"
        }
      ]
    },
    {
      "date": "2026-04-21",
      "cards": [
        {
          "badge": "Control",
          "title": "先把真机控制、边界保护和回放安全链打稳",
          "summary": "在引入 LeRobot 和 ACT 之前，先明确关节限位、用户软边界、回放节奏和 CAN / 串口保护，确保后续学习链路建立在安全控制底座上。",
          "metrics": [
            {
              "label": "robot",
              "value": "6DoF + 二值夹爪"
            },
            {
              "label": "回放",
              "value": "受保护"
            },
            {
              "label": "目标",
              "value": "长期复用"
            }
          ],
          "outcome": "ACT 这条线从一开始就不是孤立 demo，而是建立在可长期复用的控制与采集平台之上。",
          "links": [
            {
              "title": "ACT / LeRobot 实践记录",
              "path": "research_archive/tasks/act/notes/DummyV2_LeRobot_ACT实践记录.md"
            }
          ],
          "task_id": "act-lerobot-demo",
          "task_title": "Dummy V2 LeRobot + ACT 具身模仿学习 Demo",
          "task_path": "homepage/tasks/act-lerobot-demo/"
        }
      ]
    },
    {
      "date": "2026-04-19",
      "cards": [
        {
          "badge": "MDIT 主线",
          "title": "100→500 主线续训完成共享审计并把长训结果抬到 0.75",
          "summary": "100 epoch 锁定锚点之后，MDIT 一直缺一条真正跑完并完成同口径共享审计的长训主线。",
          "date_key": "2026-04-19",
          "metrics": [
            {
              "label": "线路",
              "value": "MDIT 主线"
            },
            {
              "label": "日期",
              "value": "2026-04-19"
            },
            {
              "label": "来源",
              "value": "research desk"
            }
          ],
          "outcome": "MDIT 现在最重要的新结论不是“续训已经恢复”，而是“同一条 RGB+文本主线在共享审计下已经从 0.55@100 抬到了 0.75@300/500”。",
          "links": [
            {
              "title": "500 续训审计记录",
              "path": "autoresearch_records/unplug_charger_mdit_rgb_text_3token_100__lane_a_mainline_500_resume__e0500__20260418_005723.json"
            },
            {
              "title": "MDIT 研究日志",
              "path": "docs/mdit/research_journal.md"
            },
            {
              "title": "修复留痕总表",
              "path": "docs/fixes.md"
            }
          ],
          "task_id": "mdit-mainline",
          "task_title": "MDIT RGB+Text 主线推进",
          "task_path": "homepage/tasks/mdit-mainline/"
        },
        {
          "badge": "Smoke",
          "title": "单任务单卡 smoke 训练链路跑通",
          "summary": "先把 LingBot-VA 的最小训练闭环跑通：单任务数据读取、前向、反向、optimizer update、checkpoint 保存和 WandB 记录都在一条链上验证过了。",
          "metrics": [
            {
              "label": "latent_loss",
              "value": "0.0422"
            },
            {
              "label": "action_loss",
              "value": "0.7244"
            },
            {
              "label": "grad_norm",
              "value": "3.78"
            }
          ],
          "outcome": "世界模型后训练的最小可复现入口已经站住，后续不需要再从“机器能不能跑”重新摸索。",
          "links": [
            {
              "title": "项目速读",
              "path": "homepage/external/lingbot_va/docs/project_guide.md"
            },
            {
              "title": "阶段 desk",
              "path": "homepage/external/lingbot_va/docs/research_desk.md"
            }
          ],
          "task_id": "lingbot-va-world-model",
          "task_title": "LingBot-VA 世界模型后训练切入",
          "task_path": "homepage/tasks/lingbot-va-world-model/"
        },
        {
          "badge": "Demo Export",
          "title": "离线 demo exporter 打通本地单任务验证",
          "summary": "预测视频、动作对照和误差指标已经能从同一次导出里一起产出，不再只是拿 loss 判断这条线有没有学到东西。",
          "metrics": [
            {
              "label": "video_mse",
              "value": "0.0036"
            },
            {
              "label": "action_mse",
              "value": "0.0067"
            },
            {
              "label": "pred frames",
              "value": "45"
            }
          ],
          "outcome": "这条线已经从“只有训练日志”推进到“有视频预测和离线指标”的可展示阶段。",
          "links": [
            {
              "title": "离线导出总结",
              "path": "homepage/external/lingbot_va/eval/summary.json"
            },
            {
              "title": "summary.csv",
              "path": "homepage/external/lingbot_va/eval/summary.csv"
            }
          ],
          "task_id": "lingbot-va-world-model",
          "task_title": "LingBot-VA 世界模型后训练切入",
          "task_path": "homepage/tasks/lingbot-va-world-model/"
        },
        {
          "badge": "Boundary",
          "title": "单卡全参数 post-train 的真实边界被明确暴露出来",
          "summary": "当前 24GB 单卡不能直接承载全参数 RoboTwin post-train，世界模型这条线后面必须朝多卡或参数高效训练方案推进。",
          "metrics": [
            {
              "label": "显存",
              "value": "24GB"
            },
            {
              "label": "full FT",
              "value": "受限"
            },
            {
              "label": "下一步",
              "value": "多卡 / PEFT"
            }
          ],
          "outcome": "后续研究方向已经从“再硬挤单卡”切到“明确训练策略与评测链路”，路线判断更清晰了。",
          "links": [
            {
              "title": "阶段 desk",
              "path": "homepage/external/lingbot_va/docs/research_desk.md"
            },
            {
              "title": "问题修复日志",
              "path": "homepage/external/lingbot_va/docs/fixes.md"
            }
          ],
          "task_id": "lingbot-va-world-model",
          "task_title": "LingBot-VA 世界模型后训练切入",
          "task_path": "homepage/tasks/lingbot-va-world-model/"
        }
      ]
    },
    {
      "date": "2026-04-18",
      "cards": [
        {
          "badge": "基础设施",
          "title": "建立 research desk 作为 homepage 的阶段总结总账本",
          "summary": "fixes.md 继续追加之后逐渐同时承担了事实留痕、自动状态流和阶段总结三种职责，读者需要先跨过大量日志样式条目才能看见真正改变研究判断的节点，homepage 也只能从偏机械的记录里反向猜主线叙事。",
          "date_key": "2026-04-18",
          "metrics": [
            {
              "label": "线路",
              "value": "基础设施"
            },
            {
              "label": "日期",
              "value": "2026-04-18"
            },
            {
              "label": "来源",
              "value": "research desk"
            }
          ],
          "outcome": "从现在起，项目形成了 fixes.md 记事实、research_desk.md 做阶段总结、各线路稳定文档保留证据的三层文档结构。",
          "links": [
            {
              "title": "修复留痕总表",
              "path": "docs/fixes.md"
            },
            {
              "title": "MDIT 研究日志",
              "path": "docs/mdit/research_journal.md"
            },
            {
              "title": "Homepage 维护规则",
              "path": "homepage/MAINTENANCE.md"
            }
          ],
          "task_id": "infra-audit",
          "task_title": "训练与审计基础设施修复",
          "task_path": "homepage/tasks/infra-audit/"
        },
        {
          "badge": "MDIT 主线",
          "title": "恢复 100→500 续训接管",
          "summary": "严格 MTDP 对照未过闸门后，理论上应该立即把预算收回到当前最佳路线继续长训，但实际接管时暴露出旧 checkpoint 的优化器状态和当前参数顺序不兼容，后台还会误把旧心跳当成新进度。",
          "date_key": "2026-04-18",
          "metrics": [
            {
              "label": "线路",
              "value": "MDIT 主线"
            },
            {
              "label": "日期",
              "value": "2026-04-18"
            },
            {
              "label": "来源",
              "value": "research desk"
            }
          ],
          "outcome": "MDIT 现在最重要的工作已经明确，不是再开更多相似候选，而是把当前最佳路线稳定推进到 500 epoch 并完成共享审计。",
          "links": [
            {
              "title": "MDIT 研究日志",
              "path": "docs/mdit/research_journal.md"
            },
            {
              "title": "当前主线路径",
              "path": "docs/mdit/best_path.md"
            },
            {
              "title": "修复留痕总表",
              "path": "docs/fixes.md"
            }
          ],
          "task_id": "mdit-mainline",
          "task_title": "MDIT RGB+Text 主线推进",
          "task_path": "homepage/tasks/mdit-mainline/"
        },
        {
          "badge": "MDIT 对照线",
          "title": "严格 MTDP 对照未过共享闸门",
          "summary": "在稳定化和 faithful 对照之后，项目需要回答一个更强的问题：严格 MTDP 语义在当前共享评估链下是否真的值得替代现有 RGB+文本主线。",
          "date_key": "2026-04-18",
          "metrics": [
            {
              "label": "线路",
              "value": "MDIT 对照线"
            },
            {
              "label": "日期",
              "value": "2026-04-18"
            },
            {
              "label": "来源",
              "value": "research desk"
            }
          ],
          "outcome": "严格 MTDP 对照已经完成“值得不值得继续投入”的首轮回答，目前结论是否定的。",
          "links": [
            {
              "title": "MDIT 研究日志",
              "path": "docs/mdit/research_journal.md"
            },
            {
              "title": "修复留痕总表",
              "path": "docs/fixes.md"
            }
          ],
          "task_id": "mdit-mainline",
          "task_title": "MDIT RGB+Text 主线推进",
          "task_path": "homepage/tasks/mdit-mainline/"
        }
      ]
    },
    {
      "date": "2026-04-17",
      "cards": [
        {
          "badge": "MDIT 对照线",
          "title": "稳定化与 faithful 对照完成分流，主线不再被弱候选带偏",
          "summary": "在主线锚点出现后，仍需要确认稳定化对照和 faithful 对照到底是在挑战主线，还是只是在制造更多噪声；",
          "date_key": "2026-04-17",
          "metrics": [
            {
              "label": "线路",
              "value": "MDIT 对照线"
            },
            {
              "label": "日期",
              "value": "2026-04-17"
            },
            {
              "label": "来源",
              "value": "research desk"
            }
          ],
          "outcome": "稳定化对照已经被判定为弱线，不再作为主方向推进；",
          "links": [
            {
              "title": "MDIT 研究日志",
              "path": "docs/mdit/research_journal.md"
            },
            {
              "title": "修复留痕总表",
              "path": "docs/fixes.md"
            }
          ],
          "task_id": "mdit-mainline",
          "task_title": "MDIT RGB+Text 主线推进",
          "task_path": "homepage/tasks/mdit-mainline/"
        },
        {
          "badge": "MDIT 主线",
          "title": "共享审计确认 0.55@100 锚点并冻结当前最佳路线",
          "summary": "当时需要一条已经过共享审计链验证的 RGB+文本锚点，否则后续所有候选都没有统一参照物，也很难决定谁该继续推进。",
          "date_key": "2026-04-17",
          "metrics": [
            {
              "label": "线路",
              "value": "MDIT 主线"
            },
            {
              "label": "日期",
              "value": "2026-04-17"
            },
            {
              "label": "来源",
              "value": "research desk"
            }
          ],
          "outcome": "0.55@100 是当前唯一经过共享审计链确认的 RGB+文本锚点。",
          "links": [
            {
              "title": "MDIT 研究日志",
              "path": "docs/mdit/research_journal.md"
            },
            {
              "title": "当前主线路径",
              "path": "docs/mdit/best_path.md"
            },
            {
              "title": "修复留痕总表",
              "path": "docs/fixes.md"
            }
          ],
          "task_id": "mdit-mainline",
          "task_title": "MDIT RGB+Text 主线推进",
          "task_path": "homepage/tasks/mdit-mainline/"
        }
      ]
    },
    {
      "date": "2026-04-16",
      "cards": [
        {
          "badge": "MDIT 主线",
          "title": "共享评估契约与后台守护链固化为标准执行方式",
          "summary": "即便主线配方已经回收完成，只要训练口径、评估口径、冠军冻结和后台接管没有锁死，后续 run 依然会因为配方漂移或中断恢复而失去继承关系。",
          "date_key": "2026-04-16",
          "metrics": [
            {
              "label": "线路",
              "value": "MDIT 主线"
            },
            {
              "label": "日期",
              "value": "2026-04-16"
            },
            {
              "label": "来源",
              "value": "research desk"
            }
          ],
          "outcome": "MDIT 从这一步起不再只是零散实验集合，而是一条可托管、可恢复、可比较的研究线；",
          "links": [
            {
              "title": "MDIT 执行手册",
              "path": "docs/mdit/2026-04-16-mdit-execution-manual.md"
            },
            {
              "title": "MDIT 研究日志",
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
        }
      ]
    },
    {
      "date": "2026-04-15",
      "cards": [
        {
          "badge": "MDIT 主线",
          "title": "faithful RGB+文本默认路径与共享评估口径定版",
          "summary": "在这一步之前，MDIT 主线仍混入了点云兼容默认路径、PDIT 语义残留和 EMA 默认分支，导致“当前到底在跑什么配方”无法一句话说清。",
          "date_key": "2026-04-15",
          "metrics": [
            {
              "label": "线路",
              "value": "MDIT 主线"
            },
            {
              "label": "日期",
              "value": "2026-04-15"
            },
            {
              "label": "来源",
              "value": "research desk"
            }
          ],
          "outcome": "从这一步开始，MDIT 主线终于拥有可以持续复现和解释的默认配方；",
          "links": [
            {
              "title": "修复留痕总表",
              "path": "docs/fixes.md"
            },
            {
              "title": "MDIT 执行手册",
              "path": "docs/mdit/2026-04-16-mdit-execution-manual.md"
            }
          ],
          "task_id": "mdit-mainline",
          "task_title": "MDIT RGB+Text 主线推进",
          "task_path": "homepage/tasks/mdit-mainline/"
        }
      ]
    },
    {
      "date": "2026-04-13",
      "cards": [
        {
          "badge": "MDIT 主线",
          "title": "早期兼容排查确认混合消融不能直接支持结构结论",
          "summary": "MDIT 早期在 RGB、点云、PDIT backbone、PDIT 条件路径等多种改动之间来回排查时，表面上虽然不断有训练现象和验证损失，但很难说明到底是哪一个因素真正起作用。",
          "date_key": "2026-04-13",
          "metrics": [
            {
              "label": "线路",
              "value": "MDIT 主线"
            },
            {
              "label": "日期",
              "value": "2026-04-13"
            },
            {
              "label": "来源",
              "value": "research desk"
            }
          ],
          "outcome": "MDIT 不能靠“把能跑的东西拼起来”推进；",
          "links": [
            {
              "title": "PDIT 与 MDIT 定位对照",
              "path": "docs/pdit-vs-mdit.md"
            },
            {
              "title": "修复留痕总表",
              "path": "docs/fixes.md"
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
          "badge": "LeLaN 执行线",
          "title": "自动研究链路与 100/300/500 闸门定版",
          "summary": "LeLaN 当时更缺的是训练、评估、选模和留痕的统一入口，而不是立即继续做新的结构尝试；",
          "date_key": "2026-04-12",
          "metrics": [
            {
              "label": "线路",
              "value": "LeLaN 执行线"
            },
            {
              "label": "日期",
              "value": "2026-04-12"
            },
            {
              "label": "来源",
              "value": "research desk"
            }
          ],
          "outcome": "LeLaN 现在首先是一条“执行线”，目标是把正式实验沉淀成可长期追加的研究档案；",
          "links": [
            {
              "title": "LeLaN 执行计划",
              "path": "docs/lelan/2026-04-12-lelan-autoresearch-execution-plan-zh.md"
            },
            {
              "title": "LeLaN 研究记录约定",
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
          "title": "点云 baseline 恢复为行为锚点",
          "summary": "PDIT 早期的低成功率同时混杂了训练、保存和离线审计链路的问题，导致当时很难判断是策略学不会，还是工程链路把原本可用的结果压坏了。",
          "date_key": "2026-04-09",
          "metrics": [
            {
              "label": "线路",
              "value": "PDIT 主线"
            },
            {
              "label": "日期",
              "value": "2026-04-09"
            },
            {
              "label": "来源",
              "value": "research desk"
            }
          ],
          "outcome": "PDIT 已经从“能不能学起来”的问题，转成“后期泛化能否继续稳定”的问题。",
          "links": [
            {
              "title": "PDIT 恢复进展",
              "path": "docs/pdit/2026-04-08-fm-recovery-progress-zh.md"
            },
            {
              "title": "训练模型审计",
              "path": "docs/pdit/2026-04-07-training-model-audit-zh.md"
            },
            {
              "title": "checkpoint 清单",
              "path": "docs/top10-checkpoint-manifest.json"
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
          "badge": "PDIT 主线",
          "title": "DiT 动力学改良候选达到 0.65@100，但还不能直接替代 baseline",
          "summary": "在 baseline 已经恢复后，项目需要判断晚期漂移有没有结构层面的改良方向，而不是只知道“当前基线能跑”。",
          "date_key": "2026-04-08",
          "metrics": [
            {
              "label": "线路",
              "value": "PDIT 主线"
            },
            {
              "label": "日期",
              "value": "2026-04-08"
            },
            {
              "label": "来源",
              "value": "research desk"
            }
          ],
          "outcome": "这条动力学候选证明“结构改进方向值得继续研究”，但它还没有完成对 500 epoch 行为锚点的替代。",
          "links": [
            {
              "title": "DiT 动力学候选审计记录",
              "path": "autoresearch_records/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__h2_dit_dynamics_100__e0100__20260408_114130.json"
            },
            {
              "title": "DiT 动力学候选审计日志",
              "path": "autoresearch_records/logs/h2_dit_dynamics_100_audit.log"
            },
            {
              "title": "PDIT 恢复进展",
              "path": "docs/pdit/2026-04-08-fm-recovery-progress-zh.md"
            }
          ],
          "task_id": "pdit-anchor",
          "task_title": "PDIT 基线恢复与锚点固化",
          "task_path": "homepage/tasks/pdit-anchor/"
        },
        {
          "badge": "PDIT 主线",
          "title": "数据统计增强路线被确认掺入观测语义错误，原有通过闸门的结果作废",
          "summary": "最初“数据统计 + 数据增强”路线在 100 epoch 上一度拿到 0.55，表面上像是一条勉强可保留的候选，但这条结果后来被发现不能直接支持结构结论。",
          "date_key": "2026-04-08",
          "metrics": [
            {
              "label": "线路",
              "value": "PDIT 主线"
            },
            {
              "label": "日期",
              "value": "2026-04-08"
            },
            {
              "label": "来源",
              "value": "research desk"
            }
          ],
          "outcome": "原来那条 0.55 结果不能再作为“数据统计增强可行”的证据，应该被解释为被 bug 污染的历史记录。",
          "links": [
            {
              "title": "原始数据统计增强审计记录",
              "path": "autoresearch_records/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__h1_stats_aug_100__e0100__20260408_103914.json"
            },
            {
              "title": "修正后重跑审计记录",
              "path": "autoresearch_records/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__h1_fixed_stats_aug_100__e0100__20260408_124213.json"
            },
            {
              "title": "PDIT 恢复进展",
              "path": "docs/pdit/2026-04-08-fm-recovery-progress-zh.md"
            }
          ],
          "task_id": "pdit-anchor",
          "task_title": "PDIT 基线恢复与锚点固化",
          "task_path": "homepage/tasks/pdit-anchor/"
        },
        {
          "badge": "PDIT 主线",
          "title": "500 epoch 主线通过补评估保住长期行为锚点",
          "summary": "500 epoch 主线训练完成后，原始的全量 audit sweep 一度因为超时看起来像失败，如果直接把这件事解释成训练崩溃，就会把已经跑出来的长期主线误判为无效。",
          "date_key": "2026-04-08",
          "metrics": [
            {
              "label": "线路",
              "value": "PDIT 主线"
            },
            {
              "label": "日期",
              "value": "2026-04-08"
            },
            {
              "label": "来源",
              "value": "research desk"
            }
          ],
          "outcome": "PDIT 不仅在短周期上恢复了可训练性，也在长周期上保住了可复核的行为锚点。",
          "links": [
            {
              "title": "baseline_500 审计报告",
              "path": "ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/audit_report.json"
            },
            {
              "title": "epoch_0500 人工评估",
              "path": "ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/epoch_0500_manual_eval.json"
            },
            {
              "title": "100 回合复核",
              "path": "ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/root_layout_recheck_100.json"
            }
          ],
          "task_id": "pdit-anchor",
          "task_title": "PDIT 基线恢复与锚点固化",
          "task_path": "homepage/tasks/pdit-anchor/"
        },
        {
          "badge": "PDIT 主线",
          "title": "100 epoch 离线审计确认修复后 baseline 不再“学不会”",
          "summary": "在修复训练、保存和审计链之前，PDIT 的低成功率很难解释清楚，到底是任务本身太难，还是工程链路把本来可用的策略压坏了。",
          "date_key": "2026-04-08",
          "metrics": [
            {
              "label": "线路",
              "value": "PDIT 主线"
            },
            {
              "label": "日期",
              "value": "2026-04-08"
            },
            {
              "label": "来源",
              "value": "research desk"
            }
          ],
          "outcome": "这一轮审计把问题从“PDIT 学不会”改写成“修复工程链后它其实能学起来，而且已经明显超过最低可用门槛”。",
          "links": [
            {
              "title": "baseline_100 审计记录",
              "path": "autoresearch_records/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_100__e0100__20260408_002048.json"
            },
            {
              "title": "baseline_100 审计日志",
              "path": "autoresearch_records/logs/baseline_100_audit.log"
            },
            {
              "title": "PDIT 恢复进展",
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
              "path": "homepage/external/dummy_controller/项目总览.md"
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
              "path": "homepage/external/dummy_controller/项目总览.md"
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
              "path": "homepage/external/dummy_controller/项目总览.md"
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
    "pdit-loss-tail": {
      "id": "pdit-loss-tail",
      "type": "line",
      "title": "PDIT 最优组 train / valid loss 尾段",
      "description": "围绕当前最优的 baseline@500 组，直接看尾段 train / valid total loss 的收敛关系，而不是再重复摆一张 success 柱状图。",
      "format": "float",
      "note": "当前 baseline@500 训练记录里没有可回抓的 W&B history，因此这里只能展示本地 summary 保留下来的 495-499 epoch 尾段快照。",
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
      "title": "PDIT 最优组 valid MSE 尾段",
      "description": "把最优组尾段的 xyz / rot6d / grip 三条误差单独拆开，直接解释当前行为锚点背后的误差结构。",
      "format": "float",
      "note": "PDIT 当前没有可用的 W&B history，这张图与 loss 图一样来自本地 summary 尾段快照。",
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
    "pdit-checkpoint-rank": {
      "id": "pdit-checkpoint-rank",
      "type": "rank_bar",
      "title": "PDIT 关键结果排行",
      "description": "PDIT 只保留一张行为结果图，把关键 checkpoint 和 100 回合复核放在同一张排行条里，直接回答当前该认哪一个锚点。",
      "format": "percent",
      "note": "epoch 500 仍然是当前最稳的行为锚点，100 回合复核也继续站得住。",
      "rows": [
        {
          "label": "epoch 500",
          "value": 0.95,
          "color": "#b2573f"
        },
        {
          "label": "epoch 300",
          "value": 0.9,
          "color": "#2b766f"
        },
        {
          "label": "epoch 200",
          "value": 0.8,
          "color": "#2b766f"
        },
        {
          "label": "epoch 400",
          "value": 0.8,
          "color": "#2b766f"
        },
        {
          "label": "epoch 100",
          "value": 0.75,
          "color": "#2b766f"
        },
        {
          "label": "100 回合复核",
          "value": 0.85,
          "color": "#3e7cb1"
        }
      ]
    },
    "mdit-loss-curve": {
      "id": "mdit-loss-curve",
      "type": "line",
      "title": "MDIT 主线 train / valid total loss",
      "description": "保留一张完整的主线 loss 曲线，直接看 100→500 续训过程中收敛、波动和回弹是怎样展开的。",
      "format": "float",
      "note": "W&B API 当前不可用，回退为本地 audit_report 的 1-100 epoch 历史。",
      "series": [
        {
          "name": "train/loss_total",
          "color": "#b2573f",
          "points": [
            {
              "x": 1,
              "y": 4.502119945975589,
              "label": "epoch 1"
            },
            {
              "x": 2,
              "y": 1.7319250668643824,
              "label": "epoch 2"
            },
            {
              "x": 3,
              "y": 1.4923248618751135,
              "label": "epoch 3"
            },
            {
              "x": 4,
              "y": 1.3107282038541719,
              "label": "epoch 4"
            },
            {
              "x": 5,
              "y": 1.1491770220307065,
              "label": "epoch 5"
            },
            {
              "x": 6,
              "y": 0.9728903244629368,
              "label": "epoch 6"
            },
            {
              "x": 7,
              "y": 0.7901876361708626,
              "label": "epoch 7"
            },
            {
              "x": 8,
              "y": 0.6802084558499903,
              "label": "epoch 8"
            },
            {
              "x": 9,
              "y": 0.5785548823837787,
              "label": "epoch 9"
            },
            {
              "x": 10,
              "y": 0.5107805155375212,
              "label": "epoch 10"
            },
            {
              "x": 11,
              "y": 0.46178803235022325,
              "label": "epoch 11"
            },
            {
              "x": 12,
              "y": 0.41252474536348327,
              "label": "epoch 12"
            },
            {
              "x": 13,
              "y": 0.3846010560805704,
              "label": "epoch 13"
            },
            {
              "x": 14,
              "y": 0.34599573347503687,
              "label": "epoch 14"
            },
            {
              "x": 15,
              "y": 0.3088634764589932,
              "label": "epoch 15"
            },
            {
              "x": 16,
              "y": 0.2844493862725457,
              "label": "epoch 16"
            },
            {
              "x": 17,
              "y": 0.2778671919129046,
              "label": "epoch 17"
            },
            {
              "x": 18,
              "y": 0.2528846088312904,
              "label": "epoch 18"
            },
            {
              "x": 19,
              "y": 0.2390189370945141,
              "label": "epoch 19"
            },
            {
              "x": 20,
              "y": 0.23090337626523483,
              "label": "epoch 20"
            },
            {
              "x": 21,
              "y": 0.20923205449321838,
              "label": "epoch 21"
            },
            {
              "x": 22,
              "y": 0.20208761233307443,
              "label": "epoch 22"
            },
            {
              "x": 23,
              "y": 0.19842286657800848,
              "label": "epoch 23"
            },
            {
              "x": 24,
              "y": 0.18613503898108474,
              "label": "epoch 24"
            },
            {
              "x": 25,
              "y": 0.18309754099460526,
              "label": "epoch 25"
            },
            {
              "x": 26,
              "y": 0.17258024803191152,
              "label": "epoch 26"
            },
            {
              "x": 27,
              "y": 0.16731626211786557,
              "label": "epoch 27"
            },
            {
              "x": 28,
              "y": 0.15367346362765102,
              "label": "epoch 28"
            },
            {
              "x": 29,
              "y": 0.1546496002515637,
              "label": "epoch 29"
            },
            {
              "x": 30,
              "y": 0.14325236065420138,
              "label": "epoch 30"
            },
            {
              "x": 31,
              "y": 0.14288083898336865,
              "label": "epoch 31"
            },
            {
              "x": 32,
              "y": 0.14397106293780207,
              "label": "epoch 32"
            },
            {
              "x": 33,
              "y": 0.13613468042808358,
              "label": "epoch 33"
            },
            {
              "x": 34,
              "y": 0.13275822781003854,
              "label": "epoch 34"
            },
            {
              "x": 35,
              "y": 0.1295407566149069,
              "label": "epoch 35"
            },
            {
              "x": 36,
              "y": 0.11806328339203967,
              "label": "epoch 36"
            },
            {
              "x": 37,
              "y": 0.1167900040295549,
              "label": "epoch 37"
            },
            {
              "x": 38,
              "y": 0.11976084797403963,
              "label": "epoch 38"
            },
            {
              "x": 39,
              "y": 0.11397341258396194,
              "label": "epoch 39"
            },
            {
              "x": 40,
              "y": 0.11216831264674124,
              "label": "epoch 40"
            },
            {
              "x": 41,
              "y": 0.1104054108397118,
              "label": "epoch 41"
            },
            {
              "x": 42,
              "y": 0.10636869473579787,
              "label": "epoch 42"
            },
            {
              "x": 43,
              "y": 0.10605166540720312,
              "label": "epoch 43"
            },
            {
              "x": 44,
              "y": 0.10615335673859112,
              "label": "epoch 44"
            },
            {
              "x": 45,
              "y": 0.10638174107382666,
              "label": "epoch 45"
            },
            {
              "x": 46,
              "y": 0.0978873451873435,
              "label": "epoch 46"
            },
            {
              "x": 47,
              "y": 0.09719419047191424,
              "label": "epoch 47"
            },
            {
              "x": 48,
              "y": 0.0919448065478636,
              "label": "epoch 48"
            },
            {
              "x": 49,
              "y": 0.08901826455468857,
              "label": "epoch 49"
            },
            {
              "x": 50,
              "y": 0.0883360983539384,
              "label": "epoch 50"
            },
            {
              "x": 51,
              "y": 0.08714421373704768,
              "label": "epoch 51"
            },
            {
              "x": 52,
              "y": 0.08487389426892257,
              "label": "epoch 52"
            },
            {
              "x": 53,
              "y": 0.08861959628828342,
              "label": "epoch 53"
            },
            {
              "x": 54,
              "y": 0.0874775259887794,
              "label": "epoch 54"
            },
            {
              "x": 55,
              "y": 0.07978734601390326,
              "label": "epoch 55"
            },
            {
              "x": 56,
              "y": 0.08193617255576068,
              "label": "epoch 56"
            },
            {
              "x": 57,
              "y": 0.07868635909367364,
              "label": "epoch 57"
            },
            {
              "x": 58,
              "y": 0.08123421908167734,
              "label": "epoch 58"
            },
            {
              "x": 59,
              "y": 0.07413933518429898,
              "label": "epoch 59"
            },
            {
              "x": 60,
              "y": 0.07682797888974768,
              "label": "epoch 60"
            },
            {
              "x": 61,
              "y": 0.07706630393705159,
              "label": "epoch 61"
            },
            {
              "x": 62,
              "y": 0.07489412004448856,
              "label": "epoch 62"
            },
            {
              "x": 63,
              "y": 0.06843565420171646,
              "label": "epoch 63"
            },
            {
              "x": 64,
              "y": 0.0718918119154848,
              "label": "epoch 64"
            },
            {
              "x": 65,
              "y": 0.07058084437066514,
              "label": "epoch 65"
            },
            {
              "x": 66,
              "y": 0.06667643427015972,
              "label": "epoch 66"
            },
            {
              "x": 67,
              "y": 0.06587633178245805,
              "label": "epoch 67"
            },
            {
              "x": 68,
              "y": 0.06355884789385104,
              "label": "epoch 68"
            },
            {
              "x": 69,
              "y": 0.0598319091431774,
              "label": "epoch 69"
            },
            {
              "x": 70,
              "y": 0.06623514512064234,
              "label": "epoch 70"
            },
            {
              "x": 71,
              "y": 0.062025587234837413,
              "label": "epoch 71"
            },
            {
              "x": 72,
              "y": 0.06265250236651329,
              "label": "epoch 72"
            },
            {
              "x": 73,
              "y": 0.06007146691830317,
              "label": "epoch 73"
            },
            {
              "x": 74,
              "y": 0.05464159087292017,
              "label": "epoch 74"
            },
            {
              "x": 75,
              "y": 0.06006326557916457,
              "label": "epoch 75"
            },
            {
              "x": 76,
              "y": 0.05606840796250951,
              "label": "epoch 76"
            },
            {
              "x": 77,
              "y": 0.05815981948618802,
              "label": "epoch 77"
            },
            {
              "x": 78,
              "y": 0.055687182129915025,
              "label": "epoch 78"
            },
            {
              "x": 79,
              "y": 0.05417725507428819,
              "label": "epoch 79"
            },
            {
              "x": 80,
              "y": 0.052299071317172846,
              "label": "epoch 80"
            },
            {
              "x": 81,
              "y": 0.053778082847009974,
              "label": "epoch 81"
            },
            {
              "x": 82,
              "y": 0.05211325770587269,
              "label": "epoch 82"
            },
            {
              "x": 83,
              "y": 0.05435466287471917,
              "label": "epoch 83"
            },
            {
              "x": 84,
              "y": 0.04857038562762863,
              "label": "epoch 84"
            },
            {
              "x": 85,
              "y": 0.04975693118603748,
              "label": "epoch 85"
            },
            {
              "x": 86,
              "y": 0.053832430640106115,
              "label": "epoch 86"
            },
            {
              "x": 87,
              "y": 0.05115885411605824,
              "label": "epoch 87"
            },
            {
              "x": 88,
              "y": 0.04464473160619642,
              "label": "epoch 88"
            },
            {
              "x": 89,
              "y": 0.05072600929364787,
              "label": "epoch 89"
            },
            {
              "x": 90,
              "y": 0.045805281844113886,
              "label": "epoch 90"
            },
            {
              "x": 91,
              "y": 0.05028320199548298,
              "label": "epoch 91"
            },
            {
              "x": 92,
              "y": 0.04731650530920558,
              "label": "epoch 92"
            },
            {
              "x": 93,
              "y": 0.0491143375426936,
              "label": "epoch 93"
            },
            {
              "x": 94,
              "y": 0.047406018064483954,
              "label": "epoch 94"
            },
            {
              "x": 95,
              "y": 0.04520268515146301,
              "label": "epoch 95"
            },
            {
              "x": 96,
              "y": 0.04835269340451841,
              "label": "epoch 96"
            },
            {
              "x": 97,
              "y": 0.04797260735037644,
              "label": "epoch 97"
            },
            {
              "x": 98,
              "y": 0.04589231367985468,
              "label": "epoch 98"
            },
            {
              "x": 99,
              "y": 0.04624973470485823,
              "label": "epoch 99"
            },
            {
              "x": 100,
              "y": 0.04896333100403634,
              "label": "epoch 100"
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
              "x": 100,
              "y": 1.481423760323148,
              "label": "epoch 100"
            }
          ]
        }
      ]
    },
    "mdit-mse-curve": {
      "id": "mdit-mse-curve",
      "type": "line",
      "title": "MDIT 主线 valid MSE 变化",
      "description": "把 xyz / rot6d / grip 三条 valid MSE 拆开来看，用误差结构解释主线为什么能把共享审计抬到 0.75。",
      "format": "float",
      "note": "W&B API 当前不可用，因此 mse 曲线回退到 summary 里保留下来的 95-99 epoch 尾段快照。",
      "series": [
        {
          "name": "mse_xyz",
          "color": "#2b766f",
          "points": [
            {
              "x": 95,
              "y": 0.0039648688080457135,
              "label": "epoch 95"
            },
            {
              "x": 96,
              "y": 0.003962987862522775,
              "label": "epoch 96"
            },
            {
              "x": 97,
              "y": 0.003990766806773057,
              "label": "epoch 97"
            },
            {
              "x": 98,
              "y": 0.00396996099880198,
              "label": "epoch 98"
            },
            {
              "x": 99,
              "y": 0.003953923623875629,
              "label": "epoch 99"
            }
          ]
        },
        {
          "name": "mse_rot6d",
          "color": "#a27a32",
          "points": [
            {
              "x": 95,
              "y": 0.06212384345972647,
              "label": "epoch 95"
            },
            {
              "x": 96,
              "y": 0.06223988661919353,
              "label": "epoch 96"
            },
            {
              "x": 97,
              "y": 0.06228032487936281,
              "label": "epoch 97"
            },
            {
              "x": 98,
              "y": 0.0621755134144271,
              "label": "epoch 98"
            },
            {
              "x": 99,
              "y": 0.0621499864523924,
              "label": "epoch 99"
            }
          ]
        },
        {
          "name": "mse_grip",
          "color": "#d4684c",
          "points": [
            {
              "x": 95,
              "y": 0.0635626536974374,
              "label": "epoch 95"
            },
            {
              "x": 96,
              "y": 0.0636380003131523,
              "label": "epoch 96"
            },
            {
              "x": 97,
              "y": 0.06358996952715906,
              "label": "epoch 97"
            },
            {
              "x": 98,
              "y": 0.06372388746985723,
              "label": "epoch 98"
            },
            {
              "x": 99,
              "y": 0.0638245981167529,
              "label": "epoch 99"
            }
          ]
        }
      ]
    },
    "mdit-audit-rank": {
      "id": "mdit-audit-rank",
      "type": "rank_bar",
      "title": "MDIT 审计结果排行",
      "description": "MDIT 只保留一张行为结果图，把关键里程碑和稳定化对照放到同一张排行条里，直接回答当前最能代表主线结果的是谁。",
      "format": "percent",
      "note": "300 / 500 epoch 已经超过早期 0.55@100 锚点，因此这条线后面更应该看 loss 与 MSE 怎样支撑这个提升。",
      "rows": [
        {
          "label": "epoch 300",
          "value": 0.75,
          "color": "#b2573f"
        },
        {
          "label": "epoch 400",
          "value": 0.75,
          "color": "#2b766f"
        },
        {
          "label": "epoch 500",
          "value": 0.75,
          "color": "#b2573f"
        },
        {
          "label": "epoch 200",
          "value": 0.6,
          "color": "#2b766f"
        },
        {
          "label": "epoch 100",
          "value": 0.55,
          "color": "#2b766f"
        },
        {
          "label": "epoch 50",
          "value": 0.25,
          "color": "#2b766f"
        }
      ]
    },
    "act-dataset-overview": {
      "id": "act-dataset-overview",
      "type": "compare_cards",
      "title": "LeRobot 数据与感知验收",
      "description": "先看 ACT 这条线到底沉淀了什么样的数据底座：示范是否结构化、感知是否多视角、回放是否可复现。",
      "cards": [
        {
          "badge": "Dataset",
          "title": "LeRobotDataset v3 已落成可训练数据闭环",
          "summary": "低维状态、动作、关节目标和多路视频已经统一落到 LeRobot v3 结构里，不再需要为训练和真机回放维护两套数据格式。",
          "metrics": [
            {
              "label": "episodes",
              "value": "5"
            },
            {
              "label": "frames",
              "value": "4379"
            },
            {
              "label": "fps",
              "value": "10Hz"
            }
          ]
        },
        {
          "badge": "Perception",
          "title": "多视角 RGB-D 观测已经对齐到策略输入侧",
          "summary": "D405 RGB、D405 Depth 伪彩和 UVC RGB 三路画面与低维 proprioception 同步记录，足以支撑 ACT、VLA 和世界模型后续接入。",
          "metrics": [
            {
              "label": "camera streams",
              "value": "3"
            },
            {
              "label": "robot",
              "value": "6DoF + 二值夹爪"
            },
            {
              "label": "dataset",
              "value": "LeRobot v3"
            }
          ]
        }
      ]
    },
    "act-stack-coverage": {
      "id": "act-stack-coverage",
      "type": "grouped_bar",
      "title": "ACT 具身栈当前覆盖范围",
      "description": "这张图不讲 success rate，而是明确这条线哪些层已经真正打通，哪些层已经具备继续扩展的接口。",
      "format": "percent",
      "note": "这里的 1.0 表示基础链路已经实际跑通；VLA / 世界模型当前不是“从零开始”，而是建立在同一套数据、动作和回放接口之上继续扩展。",
      "categories": [
        "真机控制",
        "世界坐标示教",
        "LeRobot 数据",
        "MuJoCo 预览",
        "Isaac 预训练",
        "ACT 部署",
        "VLA 接口"
      ],
      "series": [
        {
          "name": "已打通",
          "values": [
            1,
            1,
            1,
            1,
            1,
            1,
            1
          ],
          "color": "#2b766f"
        },
        {
          "name": "待深化",
          "values": [
            0,
            0,
            0,
            0,
            0,
            0,
            1
          ],
          "color": "#a27a32"
        }
      ]
    },
    "act-policy-interface": {
      "id": "act-policy-interface",
      "type": "compare_cards",
      "title": "ACT 部署接口与 Sim2Real 桥接",
      "description": "重点看这条线如何把策略输出、真机安全回放和后续多模态模型扩展放进同一套动作口径。",
      "cards": [
        {
          "badge": "Policy IO",
          "title": "ACT 直接预测 future action chunk 与 action.joints",
          "summary": "策略既可以输出任务空间目标，也可以同步输出关节动作，部署时优先走安全回放链，避免在线 IK 抖动直接污染模型评估。",
          "metrics": [
            {
              "label": "输入",
              "value": "RGB-D + state"
            },
            {
              "label": "输出",
              "value": "action chunk"
            },
            {
              "label": "回放",
              "value": "joint replay"
            }
          ]
        },
        {
          "badge": "Sim2Real",
          "title": "Isaac warm-start 与真实 rollout 通过同一动作接口衔接",
          "summary": "Reach / PreGrasp / GraspLift 课程预训练先提供空间移动与接触阶段先验，再用真实 LeRobot rollout 做 ACT 微调，形成可复用的 sim2real 路线。",
          "metrics": [
            {
              "label": "curriculum",
              "value": "3 阶段"
            },
            {
              "label": "warm-start",
              "value": "已打通"
            },
            {
              "label": "扩展",
              "value": "VLA / 世界模型"
            }
          ]
        }
      ]
    },
    "lingbot-smoke-metrics": {
      "id": "lingbot-smoke-metrics",
      "type": "compare_cards",
      "title": "LingBot-VA smoke 训练指标",
      "description": "先把单任务单卡 smoke 跑通，用最小可复现链路验证视频 latent + 动作联合后训练是否真的能前向、反向、更新和保存。",
      "cards": [
        {
          "badge": "Smoke",
          "title": "单任务单卡训练链路已贯通",
          "summary": "当前 smoke 使用单任务、单步、只训练输出头的配置，重点验证训练链路而不是追求最终任务效果。",
          "metrics": [
            {
              "label": "latent_loss",
              "value": "0.0422"
            },
            {
              "label": "action_loss",
              "value": "0.7244"
            },
            {
              "label": "grad_norm",
              "value": "3.78"
            }
          ]
        },
        {
          "badge": "Checkpoint",
          "title": "checkpoint 与 WandB 记录已经稳定产出",
          "summary": "这条线现在已经能稳定保存新的 transformer checkpoint，并把最小训练指标留到 WandB，后面可以在这个基础上继续扩展正式训练。",
          "metrics": [
            {
              "label": "step",
              "value": "1"
            },
            {
              "label": "WandB",
              "value": "已打通"
            },
            {
              "label": "状态",
              "value": "可复现"
            }
          ]
        }
      ]
    },
    "lingbot-offline-eval": {
      "id": "lingbot-offline-eval",
      "type": "bar",
      "title": "LingBot-VA 离线 demo 指标",
      "description": "离线 demo exporter 已经能把模型预测视频、动作轨迹和误差统计一起导出来，用最小指标先看预测质量是否站住。",
      "format": "float",
      "note": "当前导出使用 6 chunks / 2 video steps / 4 action steps，最终得到 45 帧预测视频和 192 个预测动作步，优先验证本地可视化链路。",
      "categories": [
        "video_mse",
        "action_mse"
      ],
      "series": [
        {
          "name": "LingBot-VA 离线 demo 指标",
          "values": [
            0.003563144477084279,
            0.006736649200320244
          ],
          "color": "#3e7cb1"
        }
      ]
    },
    "lingbot-system-boundary": {
      "id": "lingbot-system-boundary",
      "type": "grouped_bar",
      "title": "单卡路径与当前边界",
      "description": "这张图不讲 success rate，而是明确现在这台 24GB 卡到底能做什么、卡在什么地方，避免后续世界模型推进时误判算力边界。",
      "format": "percent",
      "note": "当前 RTX 5090 D v2 24GB 已确认可以完成 smoke 和离线 demo，但不能直接承载全参数单卡 RoboTwin post-train。",
      "categories": [
        "单任务 smoke",
        "离线 demo 导出",
        "全参数单卡 post-train"
      ],
      "series": [
        {
          "name": "已验证",
          "values": [
            1.0,
            1.0,
            0.0
          ],
          "color": "#2b766f"
        },
        {
          "name": "当前受限",
          "values": [
            0.0,
            0.0,
            1.0
          ],
          "color": "#b2573f"
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
            7.0
          ],
          "color": "#3e7cb1"
        }
      ]
    },
    "branch-robot-capabilities": {
      "id": "branch-robot-capabilities",
      "type": "bar",
      "title": "平台能力构成",
      "description": "这条线不是训练线，所以图表重点改成展示平台已经打通了哪些关键能力模块。",
      "format": "percent",
      "note": "四项能力都已经固化，可直接承接真机数据采集。",
      "categories": [
        "Sim2Real",
        "示教轨迹",
        "FK/IK",
        "CAN 保护"
      ],
      "series": [
        {
          "name": "平台能力构成",
          "values": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "color": "#3e7cb1"
        }
      ]
    },
    "branch-robot-milestones": {
      "id": "branch-robot-milestones",
      "type": "rank_bar",
      "title": "平台阶段完成度",
      "description": "按阶段看这套平台从坐标映射、示教录制到控制闭环和总线保护是怎样逐步收口的。",
      "format": "percent",
      "note": "这张图表达的是平台搭建完成度，而不是训练结果。",
      "rows": [
        {
          "label": "阶段 01 运动映射",
          "value": 0.25,
          "color": "#2b766f"
        },
        {
          "label": "阶段 02 示教轨迹",
          "value": 0.5,
          "color": "#a27a32"
        },
        {
          "label": "阶段 03 FK/IK 闭环",
          "value": 0.75,
          "color": "#3e7cb1"
        },
        {
          "label": "阶段 04 稳定固化",
          "value": 1.0,
          "color": "#b2573f"
        }
      ]
    },
    "branch-pdit-rank": {
      "id": "branch-pdit-rank",
      "type": "rank_bar",
      "title": "PDIT 关键结果排行",
      "description": "研究线页也只保留一张行为结果图，把关键 checkpoint 和长回合复核放在同一张排行条里，直接看当前行为锚点是谁。",
      "format": "percent",
      "note": "epoch 500 仍然是当前最稳的行为锚点，100 回合复核也继续站得住。",
      "rows": [
        {
          "label": "epoch 500",
          "value": 0.95,
          "color": "#b2573f"
        },
        {
          "label": "epoch 300",
          "value": 0.9,
          "color": "#2b766f"
        },
        {
          "label": "epoch 200",
          "value": 0.8,
          "color": "#2b766f"
        },
        {
          "label": "epoch 400",
          "value": 0.8,
          "color": "#2b766f"
        },
        {
          "label": "epoch 100",
          "value": 0.75,
          "color": "#2b766f"
        },
        {
          "label": "100 回合复核",
          "value": 0.85,
          "color": "#3e7cb1"
        }
      ]
    },
    "branch-pdit-loss": {
      "id": "branch-pdit-loss",
      "type": "line",
      "title": "PDIT 最优组 loss 尾段",
      "description": "围绕当前最优组，直接看 train/valid total loss 的尾段关系，而不是重复摆第二张 success 图。",
      "format": "float",
      "note": "当前 baseline@500 训练记录里没有可回抓的 W&B history，因此这里只能展示本地 summary 保留下来的 495-499 epoch 尾段快照。",
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
    "branch-pdit-mse": {
      "id": "branch-pdit-mse",
      "type": "line",
      "title": "PDIT 最优组 MSE 尾段",
      "description": "拆开 xyz / rot6d / grip 误差，直接解释当前行为锚点背后的误差结构。",
      "format": "float",
      "note": "PDIT 当前没有可用的 W&B history，这张图与 loss 图一样来自本地 summary 尾段快照。",
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
    "branch-mdit-rank": {
      "id": "branch-mdit-rank",
      "type": "rank_bar",
      "title": "MDIT 关键结果排行",
      "description": "研究线页同样只保留一张行为结果图，用排行条直接看当前最能代表这条研究线阶段成果的是哪个 checkpoint 或对照结果。",
      "format": "percent",
      "note": "300 / 500 epoch 已经超过早期 0.55@100 锚点，因此这条线后面更应该看 loss 与 MSE 怎样支撑这个提升。",
      "rows": [
        {
          "label": "epoch 300",
          "value": 0.75,
          "color": "#b2573f"
        },
        {
          "label": "epoch 400",
          "value": 0.75,
          "color": "#2b766f"
        },
        {
          "label": "epoch 500",
          "value": 0.75,
          "color": "#b2573f"
        },
        {
          "label": "epoch 200",
          "value": 0.6,
          "color": "#2b766f"
        },
        {
          "label": "epoch 100",
          "value": 0.55,
          "color": "#2b766f"
        },
        {
          "label": "epoch 50",
          "value": 0.25,
          "color": "#2b766f"
        }
      ]
    },
    "branch-mdit-loss": {
      "id": "branch-mdit-loss",
      "type": "line",
      "title": "MDIT 主线 loss 趋势",
      "description": "保留一张完整主线 loss 曲线，直接看 100→500 续训是怎样把训练过程收束下来的。",
      "format": "float",
      "note": "W&B API 当前不可用，回退为本地 audit_report 的 1-100 epoch 历史。",
      "series": [
        {
          "name": "train/loss_total",
          "color": "#b2573f",
          "points": [
            {
              "x": 1,
              "y": 4.502119945975589,
              "label": "epoch 1"
            },
            {
              "x": 2,
              "y": 1.7319250668643824,
              "label": "epoch 2"
            },
            {
              "x": 3,
              "y": 1.4923248618751135,
              "label": "epoch 3"
            },
            {
              "x": 4,
              "y": 1.3107282038541719,
              "label": "epoch 4"
            },
            {
              "x": 5,
              "y": 1.1491770220307065,
              "label": "epoch 5"
            },
            {
              "x": 6,
              "y": 0.9728903244629368,
              "label": "epoch 6"
            },
            {
              "x": 7,
              "y": 0.7901876361708626,
              "label": "epoch 7"
            },
            {
              "x": 8,
              "y": 0.6802084558499903,
              "label": "epoch 8"
            },
            {
              "x": 9,
              "y": 0.5785548823837787,
              "label": "epoch 9"
            },
            {
              "x": 10,
              "y": 0.5107805155375212,
              "label": "epoch 10"
            },
            {
              "x": 11,
              "y": 0.46178803235022325,
              "label": "epoch 11"
            },
            {
              "x": 12,
              "y": 0.41252474536348327,
              "label": "epoch 12"
            },
            {
              "x": 13,
              "y": 0.3846010560805704,
              "label": "epoch 13"
            },
            {
              "x": 14,
              "y": 0.34599573347503687,
              "label": "epoch 14"
            },
            {
              "x": 15,
              "y": 0.3088634764589932,
              "label": "epoch 15"
            },
            {
              "x": 16,
              "y": 0.2844493862725457,
              "label": "epoch 16"
            },
            {
              "x": 17,
              "y": 0.2778671919129046,
              "label": "epoch 17"
            },
            {
              "x": 18,
              "y": 0.2528846088312904,
              "label": "epoch 18"
            },
            {
              "x": 19,
              "y": 0.2390189370945141,
              "label": "epoch 19"
            },
            {
              "x": 20,
              "y": 0.23090337626523483,
              "label": "epoch 20"
            },
            {
              "x": 21,
              "y": 0.20923205449321838,
              "label": "epoch 21"
            },
            {
              "x": 22,
              "y": 0.20208761233307443,
              "label": "epoch 22"
            },
            {
              "x": 23,
              "y": 0.19842286657800848,
              "label": "epoch 23"
            },
            {
              "x": 24,
              "y": 0.18613503898108474,
              "label": "epoch 24"
            },
            {
              "x": 25,
              "y": 0.18309754099460526,
              "label": "epoch 25"
            },
            {
              "x": 26,
              "y": 0.17258024803191152,
              "label": "epoch 26"
            },
            {
              "x": 27,
              "y": 0.16731626211786557,
              "label": "epoch 27"
            },
            {
              "x": 28,
              "y": 0.15367346362765102,
              "label": "epoch 28"
            },
            {
              "x": 29,
              "y": 0.1546496002515637,
              "label": "epoch 29"
            },
            {
              "x": 30,
              "y": 0.14325236065420138,
              "label": "epoch 30"
            },
            {
              "x": 31,
              "y": 0.14288083898336865,
              "label": "epoch 31"
            },
            {
              "x": 32,
              "y": 0.14397106293780207,
              "label": "epoch 32"
            },
            {
              "x": 33,
              "y": 0.13613468042808358,
              "label": "epoch 33"
            },
            {
              "x": 34,
              "y": 0.13275822781003854,
              "label": "epoch 34"
            },
            {
              "x": 35,
              "y": 0.1295407566149069,
              "label": "epoch 35"
            },
            {
              "x": 36,
              "y": 0.11806328339203967,
              "label": "epoch 36"
            },
            {
              "x": 37,
              "y": 0.1167900040295549,
              "label": "epoch 37"
            },
            {
              "x": 38,
              "y": 0.11976084797403963,
              "label": "epoch 38"
            },
            {
              "x": 39,
              "y": 0.11397341258396194,
              "label": "epoch 39"
            },
            {
              "x": 40,
              "y": 0.11216831264674124,
              "label": "epoch 40"
            },
            {
              "x": 41,
              "y": 0.1104054108397118,
              "label": "epoch 41"
            },
            {
              "x": 42,
              "y": 0.10636869473579787,
              "label": "epoch 42"
            },
            {
              "x": 43,
              "y": 0.10605166540720312,
              "label": "epoch 43"
            },
            {
              "x": 44,
              "y": 0.10615335673859112,
              "label": "epoch 44"
            },
            {
              "x": 45,
              "y": 0.10638174107382666,
              "label": "epoch 45"
            },
            {
              "x": 46,
              "y": 0.0978873451873435,
              "label": "epoch 46"
            },
            {
              "x": 47,
              "y": 0.09719419047191424,
              "label": "epoch 47"
            },
            {
              "x": 48,
              "y": 0.0919448065478636,
              "label": "epoch 48"
            },
            {
              "x": 49,
              "y": 0.08901826455468857,
              "label": "epoch 49"
            },
            {
              "x": 50,
              "y": 0.0883360983539384,
              "label": "epoch 50"
            },
            {
              "x": 51,
              "y": 0.08714421373704768,
              "label": "epoch 51"
            },
            {
              "x": 52,
              "y": 0.08487389426892257,
              "label": "epoch 52"
            },
            {
              "x": 53,
              "y": 0.08861959628828342,
              "label": "epoch 53"
            },
            {
              "x": 54,
              "y": 0.0874775259887794,
              "label": "epoch 54"
            },
            {
              "x": 55,
              "y": 0.07978734601390326,
              "label": "epoch 55"
            },
            {
              "x": 56,
              "y": 0.08193617255576068,
              "label": "epoch 56"
            },
            {
              "x": 57,
              "y": 0.07868635909367364,
              "label": "epoch 57"
            },
            {
              "x": 58,
              "y": 0.08123421908167734,
              "label": "epoch 58"
            },
            {
              "x": 59,
              "y": 0.07413933518429898,
              "label": "epoch 59"
            },
            {
              "x": 60,
              "y": 0.07682797888974768,
              "label": "epoch 60"
            },
            {
              "x": 61,
              "y": 0.07706630393705159,
              "label": "epoch 61"
            },
            {
              "x": 62,
              "y": 0.07489412004448856,
              "label": "epoch 62"
            },
            {
              "x": 63,
              "y": 0.06843565420171646,
              "label": "epoch 63"
            },
            {
              "x": 64,
              "y": 0.0718918119154848,
              "label": "epoch 64"
            },
            {
              "x": 65,
              "y": 0.07058084437066514,
              "label": "epoch 65"
            },
            {
              "x": 66,
              "y": 0.06667643427015972,
              "label": "epoch 66"
            },
            {
              "x": 67,
              "y": 0.06587633178245805,
              "label": "epoch 67"
            },
            {
              "x": 68,
              "y": 0.06355884789385104,
              "label": "epoch 68"
            },
            {
              "x": 69,
              "y": 0.0598319091431774,
              "label": "epoch 69"
            },
            {
              "x": 70,
              "y": 0.06623514512064234,
              "label": "epoch 70"
            },
            {
              "x": 71,
              "y": 0.062025587234837413,
              "label": "epoch 71"
            },
            {
              "x": 72,
              "y": 0.06265250236651329,
              "label": "epoch 72"
            },
            {
              "x": 73,
              "y": 0.06007146691830317,
              "label": "epoch 73"
            },
            {
              "x": 74,
              "y": 0.05464159087292017,
              "label": "epoch 74"
            },
            {
              "x": 75,
              "y": 0.06006326557916457,
              "label": "epoch 75"
            },
            {
              "x": 76,
              "y": 0.05606840796250951,
              "label": "epoch 76"
            },
            {
              "x": 77,
              "y": 0.05815981948618802,
              "label": "epoch 77"
            },
            {
              "x": 78,
              "y": 0.055687182129915025,
              "label": "epoch 78"
            },
            {
              "x": 79,
              "y": 0.05417725507428819,
              "label": "epoch 79"
            },
            {
              "x": 80,
              "y": 0.052299071317172846,
              "label": "epoch 80"
            },
            {
              "x": 81,
              "y": 0.053778082847009974,
              "label": "epoch 81"
            },
            {
              "x": 82,
              "y": 0.05211325770587269,
              "label": "epoch 82"
            },
            {
              "x": 83,
              "y": 0.05435466287471917,
              "label": "epoch 83"
            },
            {
              "x": 84,
              "y": 0.04857038562762863,
              "label": "epoch 84"
            },
            {
              "x": 85,
              "y": 0.04975693118603748,
              "label": "epoch 85"
            },
            {
              "x": 86,
              "y": 0.053832430640106115,
              "label": "epoch 86"
            },
            {
              "x": 87,
              "y": 0.05115885411605824,
              "label": "epoch 87"
            },
            {
              "x": 88,
              "y": 0.04464473160619642,
              "label": "epoch 88"
            },
            {
              "x": 89,
              "y": 0.05072600929364787,
              "label": "epoch 89"
            },
            {
              "x": 90,
              "y": 0.045805281844113886,
              "label": "epoch 90"
            },
            {
              "x": 91,
              "y": 0.05028320199548298,
              "label": "epoch 91"
            },
            {
              "x": 92,
              "y": 0.04731650530920558,
              "label": "epoch 92"
            },
            {
              "x": 93,
              "y": 0.0491143375426936,
              "label": "epoch 93"
            },
            {
              "x": 94,
              "y": 0.047406018064483954,
              "label": "epoch 94"
            },
            {
              "x": 95,
              "y": 0.04520268515146301,
              "label": "epoch 95"
            },
            {
              "x": 96,
              "y": 0.04835269340451841,
              "label": "epoch 96"
            },
            {
              "x": 97,
              "y": 0.04797260735037644,
              "label": "epoch 97"
            },
            {
              "x": 98,
              "y": 0.04589231367985468,
              "label": "epoch 98"
            },
            {
              "x": 99,
              "y": 0.04624973470485823,
              "label": "epoch 99"
            },
            {
              "x": 100,
              "y": 0.04896333100403634,
              "label": "epoch 100"
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
              "x": 100,
              "y": 1.481423760323148,
              "label": "epoch 100"
            }
          ]
        }
      ]
    },
    "branch-mdit-mse": {
      "id": "branch-mdit-mse",
      "type": "line",
      "title": "MDIT 主线 MSE 变化",
      "description": "把 xyz / rot6d / grip 三条误差拆开，解释 0.75@300/500 是靠哪类误差下降撑起来的。",
      "format": "float",
      "note": "W&B API 当前不可用，因此 mse 曲线回退到 summary 里保留下来的 95-99 epoch 尾段快照。",
      "series": [
        {
          "name": "mse_xyz",
          "color": "#2b766f",
          "points": [
            {
              "x": 95,
              "y": 0.0039648688080457135,
              "label": "epoch 95"
            },
            {
              "x": 96,
              "y": 0.003962987862522775,
              "label": "epoch 96"
            },
            {
              "x": 97,
              "y": 0.003990766806773057,
              "label": "epoch 97"
            },
            {
              "x": 98,
              "y": 0.00396996099880198,
              "label": "epoch 98"
            },
            {
              "x": 99,
              "y": 0.003953923623875629,
              "label": "epoch 99"
            }
          ]
        },
        {
          "name": "mse_rot6d",
          "color": "#a27a32",
          "points": [
            {
              "x": 95,
              "y": 0.06212384345972647,
              "label": "epoch 95"
            },
            {
              "x": 96,
              "y": 0.06223988661919353,
              "label": "epoch 96"
            },
            {
              "x": 97,
              "y": 0.06228032487936281,
              "label": "epoch 97"
            },
            {
              "x": 98,
              "y": 0.0621755134144271,
              "label": "epoch 98"
            },
            {
              "x": 99,
              "y": 0.0621499864523924,
              "label": "epoch 99"
            }
          ]
        },
        {
          "name": "mse_grip",
          "color": "#d4684c",
          "points": [
            {
              "x": 95,
              "y": 0.0635626536974374,
              "label": "epoch 95"
            },
            {
              "x": 96,
              "y": 0.0636380003131523,
              "label": "epoch 96"
            },
            {
              "x": 97,
              "y": 0.06358996952715906,
              "label": "epoch 97"
            },
            {
              "x": 98,
              "y": 0.06372388746985723,
              "label": "epoch 98"
            },
            {
              "x": 99,
              "y": 0.0638245981167529,
              "label": "epoch 99"
            }
          ]
        }
      ]
    },
    "branch-act-dataset": {
      "id": "branch-act-dataset",
      "type": "compare_cards",
      "title": "ACT 数据与感知验收",
      "description": "研究线页先看这条线到底沉淀了什么样的数据、感知和回放底座，而不是只看单个 demo 片段。",
      "cards": [
        {
          "badge": "Dataset",
          "title": "LeRobotDataset v3 已落成可训练数据闭环",
          "summary": "低维状态、动作、关节目标和多路视频已经统一落到 LeRobot v3 结构里，不再需要为训练和真机回放维护两套数据格式。",
          "metrics": [
            {
              "label": "episodes",
              "value": "5"
            },
            {
              "label": "frames",
              "value": "4379"
            },
            {
              "label": "fps",
              "value": "10Hz"
            }
          ]
        },
        {
          "badge": "Perception",
          "title": "多视角 RGB-D 观测已经对齐到策略输入侧",
          "summary": "D405 RGB、D405 Depth 伪彩和 UVC RGB 三路画面与低维 proprioception 同步记录，足以支撑 ACT、VLA 和世界模型后续接入。",
          "metrics": [
            {
              "label": "camera streams",
              "value": "3"
            },
            {
              "label": "robot",
              "value": "6DoF + 二值夹爪"
            },
            {
              "label": "dataset",
              "value": "LeRobot v3"
            }
          ]
        }
      ]
    },
    "branch-act-stack": {
      "id": "branch-act-stack",
      "type": "grouped_bar",
      "title": "ACT 具身栈覆盖范围",
      "description": "把真机控制、LeRobot 数据、仿真预训练和 ACT 部署放到同一张覆盖图里，明确这条线已经打通到哪里。",
      "format": "percent",
      "note": "这里的 1.0 表示基础链路已经实际跑通；VLA / 世界模型当前不是“从零开始”，而是建立在同一套数据、动作和回放接口之上继续扩展。",
      "categories": [
        "真机控制",
        "世界坐标示教",
        "LeRobot 数据",
        "MuJoCo 预览",
        "Isaac 预训练",
        "ACT 部署",
        "VLA 接口"
      ],
      "series": [
        {
          "name": "已打通",
          "values": [
            1,
            1,
            1,
            1,
            1,
            1,
            1
          ],
          "color": "#2b766f"
        },
        {
          "name": "待深化",
          "values": [
            0,
            0,
            0,
            0,
            0,
            0,
            1
          ],
          "color": "#a27a32"
        }
      ]
    },
    "branch-act-policy": {
      "id": "branch-act-policy",
      "type": "compare_cards",
      "title": "ACT 部署接口与 Sim2Real 桥接",
      "description": "直接看策略输入输出、joint replay 安全链和 sim2real warm-start 是如何衔接的。",
      "cards": [
        {
          "badge": "Policy IO",
          "title": "ACT 直接预测 future action chunk 与 action.joints",
          "summary": "策略既可以输出任务空间目标，也可以同步输出关节动作，部署时优先走安全回放链，避免在线 IK 抖动直接污染模型评估。",
          "metrics": [
            {
              "label": "输入",
              "value": "RGB-D + state"
            },
            {
              "label": "输出",
              "value": "action chunk"
            },
            {
              "label": "回放",
              "value": "joint replay"
            }
          ]
        },
        {
          "badge": "Sim2Real",
          "title": "Isaac warm-start 与真实 rollout 通过同一动作接口衔接",
          "summary": "Reach / PreGrasp / GraspLift 课程预训练先提供空间移动与接触阶段先验，再用真实 LeRobot rollout 做 ACT 微调，形成可复用的 sim2real 路线。",
          "metrics": [
            {
              "label": "curriculum",
              "value": "3 阶段"
            },
            {
              "label": "warm-start",
              "value": "已打通"
            },
            {
              "label": "扩展",
              "value": "VLA / 世界模型"
            }
          ]
        }
      ]
    },
    "branch-lingbot-smoke": {
      "id": "branch-lingbot-smoke",
      "type": "compare_cards",
      "title": "LingBot-VA smoke 训练指标",
      "description": "研究线页先看最小训练闭环有没有真的跑通，而不是把世界模型线误读成 success rate 项目。",
      "cards": [
        {
          "badge": "Smoke",
          "title": "单任务单卡训练链路已贯通",
          "summary": "当前 smoke 使用单任务、单步、只训练输出头的配置，重点验证训练链路而不是追求最终任务效果。",
          "metrics": [
            {
              "label": "latent_loss",
              "value": "0.0422"
            },
            {
              "label": "action_loss",
              "value": "0.7244"
            },
            {
              "label": "grad_norm",
              "value": "3.78"
            }
          ]
        },
        {
          "badge": "Checkpoint",
          "title": "checkpoint 与 WandB 记录已经稳定产出",
          "summary": "这条线现在已经能稳定保存新的 transformer checkpoint，并把最小训练指标留到 WandB，后面可以在这个基础上继续扩展正式训练。",
          "metrics": [
            {
              "label": "step",
              "value": "1"
            },
            {
              "label": "WandB",
              "value": "已打通"
            },
            {
              "label": "状态",
              "value": "可复现"
            }
          ]
        }
      ]
    },
    "branch-lingbot-eval": {
      "id": "branch-lingbot-eval",
      "type": "bar",
      "title": "LingBot-VA 离线 demo 指标",
      "description": "世界模型线当前最值得展示的是离线预测视频与动作的误差指标，而不是伪造任务 success 曲线。",
      "format": "float",
      "note": "当前导出使用 6 chunks / 2 video steps / 4 action steps，最终得到 45 帧预测视频和 192 个预测动作步，优先验证本地可视化链路。",
      "categories": [
        "video_mse",
        "action_mse"
      ],
      "series": [
        {
          "name": "LingBot-VA 离线 demo 指标",
          "values": [
            0.003563144477084279,
            0.006736649200320244
          ],
          "color": "#3e7cb1"
        }
      ]
    },
    "branch-lingbot-boundary": {
      "id": "branch-lingbot-boundary",
      "type": "grouped_bar",
      "title": "LingBot-VA 单卡路径边界",
      "description": "把已经打通的路径和当前单卡边界拆开看，避免后续世界模型推进时误判算力与训练策略。",
      "format": "percent",
      "note": "当前 RTX 5090 D v2 24GB 已确认可以完成 smoke 和离线 demo，但不能直接承载全参数单卡 RoboTwin post-train。",
      "categories": [
        "单任务 smoke",
        "离线 demo 导出",
        "全参数单卡 post-train"
      ],
      "series": [
        {
          "name": "已验证",
          "values": [
            1.0,
            1.0,
            0.0
          ],
          "color": "#2b766f"
        },
        {
          "name": "当前受限",
          "values": [
            0.0,
            0.0,
            1.0
          ],
          "color": "#b2573f"
        }
      ]
    },
    "branch-lelan-gate": {
      "id": "branch-lelan-gate",
      "type": "bar",
      "title": "LeLaN 阶段 gate 概览",
      "description": "这条线现在更像执行线，最重要的是 gate 与执行规则是否已经固定，而不是先追求复杂结构图。",
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
    "branch-lelan-readiness": {
      "id": "branch-lelan-readiness",
      "type": "grouped_bar",
      "title": "LeLaN 执行链路就绪度",
      "description": "把训练、评估、选模和留痕四条链路放在一张分组柱状图里，看这条线现在是不是已经具备长期追加实验的基础。",
      "format": "percent",
      "note": "这张图表达的是执行成熟度和 gate 位置，不是行为成功率。",
      "categories": [
        "训练入口",
        "评估链",
        "选模规则",
        "留痕规范"
      ],
      "series": [
        {
          "name": "已固定",
          "values": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "color": "#2b766f"
        },
        {
          "name": "待正式 run 验证",
          "values": [
            0.45,
            0.45,
            0.55,
            0.6
          ],
          "color": "#a27a32"
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
          "summary": "把点云观测到 action chunk 的模仿学习主线真正搭起来了",
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
          "summary": "把 5 路 RGB + 文本到 action chunk 的多模态主线真正立起来了",
          "metrics": [
            {
              "label": "best success@20",
              "value": "0.75"
            },
            {
              "label": "100 epoch 锚点",
              "value": "0.55"
            },
            {
              "label": "best epoch",
              "value": "300"
            }
          ]
        },
        {
          "badge": "ACT Demo",
          "title": "Dummy V2 LeRobot + ACT 具身模仿学习 Demo",
          "summary": "把自研机械臂整理成 LeRobot 可直接消费的数据和回放入口",
          "metrics": [
            {
              "label": "episodes",
              "value": "5"
            },
            {
              "label": "frames",
              "value": "4379"
            },
            {
              "label": "fps",
              "value": "10Hz"
            }
          ]
        },
        {
          "badge": "世界模型线",
          "title": "LingBot-VA 世界模型后训练切入",
          "summary": "视频 latent + 动作联合后训练入口已打通",
          "metrics": [
            {
              "label": "smoke step",
              "value": "1"
            },
            {
              "label": "offline action_mse",
              "value": "0.0067"
            },
            {
              "label": "当前阶段",
              "value": "smoke+demo"
            }
          ]
        },
        {
          "badge": "LeLaN",
          "title": "LeLaN 自动研究链路固化",
          "summary": "第一轮 recipe 固定，不先碰 backbone",
          "metrics": [
            {
              "label": "观测设置",
              "value": "5 路 RGB / 3 帧"
            },
            {
              "label": "动作步数",
              "value": "8"
            },
            {
              "label": "gate@100",
              "value": "0.45"
            }
          ]
        }
      ]
    }
  },
  "home_chart_ids": [],
  "showcase": {
    "items": [
      {
        "task_id": "dummy-sim2real-platform",
        "kind": "image",
        "title": "六轴臂平台封面",
        "caption": "概览展示这套六轴臂 Sim2Real 采集平台的整体形态，作为首页亮点封面使用。",
        "path": "research_archive/tasks/infra/media/demo/images/dummy-sim2real-platform/00-封面图.jpg",
        "showcase_preview": true
      },
      {
        "task_id": "dummy-sim2real-platform",
        "kind": "image",
        "title": "三维建模与仿真资产准备",
        "caption": "用三维建模补齐机械结构、关节关系与几何尺度，为后续导出 URDF 和整理碰撞/惯性参数打底。这一步把平台从单纯的运动控制，推进到可接入 Isaac 或 MuJoCo 的动力学仿真资产层。",
        "path": "research_archive/tasks/infra/media/demo/images/dummy-sim2real-platform/01-SW三维模型.png",
        "showcase_preview": false
      },
      {
        "task_id": "dummy-sim2real-platform",
        "kind": "video",
        "title": "URDF 与动力学仿真链路",
        "caption": "展示从三维建模到仿真资产落地的流程：先把机械结构整理成可导出的 URDF，再接入动力学引擎做运动与接触验证。它为后续在 Isaac / MuJoCo 中复现实验、扩展数据采集与世界模型环境提供了统一底座。",
        "path": "research_archive/tasks/infra/media/demo/videos/dummy-sim2real-platform/00-三维建模与动力学仿真-1.mp4",
        "showcase_preview": false
      },
      {
        "task_id": "dummy-sim2real-platform",
        "kind": "video",
        "title": "正逆运动解算演示",
        "caption": "展示六轴臂平台里从目标位姿到数值逆解、再到仿真预览与控制联动的过程。",
        "path": "research_archive/tasks/infra/media/demo/videos/dummy-sim2real-platform/01-运动逆解算.mp4",
        "showcase_preview": false
      },
      {
        "task_id": "dummy-sim2real-platform",
        "kind": "video",
        "title": "真机-仿真数字孪生同步",
        "caption": "展示真机姿态如何实时映射到仿真侧，验证 Sim2Real 运动映射与数字孪生同步效果。",
        "path": "research_archive/tasks/infra/media/demo/videos/dummy-sim2real-platform/02-真机仿真数字孪生.mp4",
        "showcase_preview": false
      },
      {
        "task_id": "dummy-sim2real-platform",
        "kind": "video",
        "title": "规划轨迹真机执行",
        "caption": "展示规划好的关节轨迹如何按照记录节奏下发真机，体现示教回放与总线保护链路。",
        "path": "research_archive/tasks/infra/media/demo/videos/dummy-sim2real-platform/03-规划轨迹执行.mp4",
        "showcase_preview": false
      },
      {
        "task_id": "pdit-anchor",
        "kind": "image",
        "title": "PDIT 点云主线封面",
        "caption": "作为当前 PDIT 主线封面，概括点云观测、动作生成与行为审计这条模仿学习主线的整体结构。",
        "path": "research_archive/tasks/pdit/media/demo/images/pdit.png",
        "showcase_preview": false
      },
      {
        "task_id": "pdit-anchor",
        "kind": "video",
        "title": "PDIT 点云策略关门演示",
        "caption": "展示点云主线在后期 checkpoint 上的仿真执行效果，说明 point cloud 到 action chunk 的策略已经能稳定落到具体 manipulation 动作。",
        "path": "research_archive/tasks/pdit/media/demo/videos/epoch_0450_pcd.mp4",
        "showcase_preview": false
      },
      {
        "task_id": "pdit-anchor",
        "kind": "video",
        "title": "Franka 拔插头仿真执行",
        "caption": "展示 PDIT 在拔插头任务中的仿真执行现场：策略从观测编码到 action chunk 输出后，驱动 Franka 机械臂完成接近、对位与执行动作。",
        "path": "research_archive/tasks/pdit/media/demo/videos/仿真-1.mp4",
        "showcase_preview": false
      },
      {
        "task_id": "mdit-mainline",
        "kind": "image",
        "title": "MDIT RGB+Text 主线封面",
        "caption": "作为当前 MDIT 主线封面，概括多视角视觉、文本条件与动作生成之间的整体结构。",
        "path": "research_archive/tasks/mdit/media/demo/images/mtdp_architecture.png",
        "showcase_preview": false
      },
      {
        "task_id": "mdit-mainline",
        "kind": "video",
        "title": "MDIT RGB+Text 关门仿真演示",
        "caption": "该片段来自 RGB+Text 主线训练后的关门仿真，说明语言条件已经能落到可执行动作轨迹。它对应的是一条更贴近 VLA / 世界模型接口的多模态策略路径：先对齐视觉与文本语义，再生成 action chunk。",
        "path": "research_archive/tasks/mdit/media/demo/videos/关门仿真-1.mp4",
        "showcase_preview": false
      },
      {
        "task_id": "act-lerobot-demo",
        "kind": "video",
        "title": "LeRobot + ACT 叠方块 Demo",
        "caption": "展示 Dummy V2 基于 LeRobot v3 数据和 ACT 策略完成方块抓取与叠放的具身模仿学习 demo。这条线已经把采集、训练、部署和安全回放接成闭环，并为后续 VLA / 世界模型继续接入保留了统一动作接口。",
        "path": "research_archive/tasks/act/media/demo/videos/01-LeRobot框架与ACTdemo.mp4",
        "showcase_preview": false
      },
      {
        "task_id": "lingbot-va-world-model",
        "kind": "image",
        "title": "LingBot-VA 世界模型线封面",
        "caption": "用 RoboTwin 任务场景作为切入口，展示这条线当前聚焦的视频 latent + 动作联合后训练方向。",
        "path": "research_archive/tasks/lingbot/media/demo/images/00-lingbot-va-cover.png",
        "showcase_preview": true
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
        "path": "research_archive/tasks/infra/media/demo/images/dummy-sim2real-platform/00-封面图.jpg",
        "showcase_preview": true
      },
      {
        "task_id": "lingbot-va-world-model",
        "kind": "image",
        "title": "LingBot-VA 世界模型线封面",
        "caption": "用 RoboTwin 任务场景作为切入口，展示这条线当前聚焦的视频 latent + 动作联合后训练方向。",
        "path": "research_archive/tasks/lingbot/media/demo/images/00-lingbot-va-cover.png",
        "showcase_preview": true
      }
    ]
  },
  "fix_highlights": [
    {
      "date": "2026-04-23",
      "title": "训练完成并进入待审计状态",
      "summary": "范围：research/mdit_trial_runner.py + docs/mdit/research_journal.md + docs/fixes.md 背景：候选 run put_books_on_bookshelf_mdit_rgb_text_3token_500 已完成训练阶段，需要…",
      "path": "docs/fixes.md"
    },
    {
      "date": "2026-04-21",
      "title": "同步 MDIT 成功原因与 PDIT 差异总结到稳定文档",
      "summary": "范围：docs/research_desk.md、docs/pdit-vs-mdit.md 背景：此前已经口头总结过“MDIT 主线为什么能成功”以及“它和 PDIT 的关键不同”，但稳定文档没有同步更新，导致后续阅读 research_desk 和 pdit-vs-mdit 时仍然容易读到旧口径…",
      "path": "docs/fixes.md"
    },
    {
      "date": "2026-04-21",
      "title": "增加 MDIT 审计队列监督器，close_door 与 put_books 两条 run 自动排队审计 · MDIT audit takeover",
      "summary": "范围：scripts/run_mdit_audit_queue_supervisor.py + tmux:mdit_audit_queue 背景：close_door_mdit_rgb_text_3token_500 已经训练完成但尚未进入共享离线审计；put_books_on_bookshelf…",
      "path": "docs/fixes.md"
    },
    {
      "date": "2026-04-21",
      "title": "put_books_on_bookshelf 后续任务增加数据完整性闸门，避免半传输目录误启动 · MDIT next-task bootstrap",
      "summary": "范围：scripts/run_put_books_on_bookshelf_mdit_mainline_500.sh 背景：检查发现 data/put_books_on_bookshelf 当前只落下了 train/data/pcd_xyz，valid 尚不存在，images 和 robot_st…",
      "path": "docs/fixes.md"
    }
  ]
};
