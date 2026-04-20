window.homepageData = {
  "generated_at": "2026-04-20T19:44:03+08:00",
  "site": {
    "title": "GJW · Embodied AI Lab Notes",
    "slogan": "把实验、修复与主线推进整理成清晰可追溯的研究档案。",
    "description": ""
  },
  "stats": {
    "task_count": 6,
    "branch_count": 5,
    "timeline_count": 22,
    "validated_rows": 12,
    "archive_entry_count": 37,
    "archive_milestone_count": 3,
    "archive_complete_count": 12
  },
  "home": {
    "done_groups": [
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
        "value": "6"
      },
      {
        "label": "研究线",
        "value": "5"
      },
      {
        "label": "归档条目",
        "value": "37"
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
          "path": "research_archive/tasks/infra/media/demo/images/dummy-sim2real-platform/00-封面图.jpg",
          "showcase_preview": true
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
        "homepage/external/dummy_controller/INTERVIEW_TECH_DOC.md",
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
      "latest_update": "2026-04-20",
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
          "title": "research_archive 已固化 8 条run与 3 个 milestone",
          "body": "页面里的证据层、归档时间线和后续专题页素材现在都可以优先从 research_archive 消费，不必再回翻零散的 ckpt、autoresearch_records 和 docs 目录。",
          "metrics": [
            {
              "label": "归档条目",
              "value": "8"
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
          "title": "archive summary · collapse_run",
          "path": "research_archive/tasks/mdit/runs/2026-04-20__collapse_run/metrics/summary.json",
          "summary": "训练后固化的结构化 summary，会作为后续图表和专题页的统一输入。",
          "label": "打开 summary"
        },
        {
          "title": "archive audit · collapse_run",
          "path": "research_archive/tasks/mdit/runs/2026-04-20__collapse_run/metrics/audit_report.json",
          "summary": "共享审计或行为审计结果已复制进 archive，可直接作为后续展示证据。",
          "label": "打开 audit"
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
      "latest_update": "2026-04-20",
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
      "detail_intro": "围绕 RGB+文本主线、对照出清和 100→500 续训接管，收束成同一条可审计的多模态主线。 当前成果：best success 已稳定在 0.75@500，共享审计已越过早期 0.55@100 锚点。 当前已在 archive 中固化 8 条归档条目与 3 个 milestone。",
      "entry_path": "homepage/tasks/mdit-mainline/",
      "entry_label": "进入任务页",
      "related_task_ids": [
        "mdit-mainline"
      ],
      "timeline_groups": [
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
          "title": "archive summary · collapse_run",
          "path": "research_archive/tasks/mdit/runs/2026-04-20__collapse_run/metrics/summary.json",
          "summary": "训练后固化的结构化 summary，会作为后续图表和专题页的统一输入。",
          "label": "打开 summary"
        },
        {
          "title": "archive audit · collapse_run",
          "path": "research_archive/tasks/mdit/runs/2026-04-20__collapse_run/metrics/audit_report.json",
          "summary": "共享审计或行为审计结果已复制进 archive，可直接作为后续展示证据。",
          "label": "打开 audit"
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
          "title": "research_archive 已固化 8 条run与 3 个 milestone",
          "body": "页面里的证据层、归档时间线和后续专题页素材现在都可以优先从 research_archive 消费，不必再回翻零散的 ckpt、autoresearch_records 和 docs 目录。",
          "metrics": [
            {
              "label": "归档条目",
              "value": "8"
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
            },
            {
              "x": 268,
              "y": 0.027189532294869423,
              "label": "epoch 268"
            },
            {
              "x": 269,
              "y": 0.009195206686854362,
              "label": "epoch 269"
            },
            {
              "x": 270,
              "y": 0.008985331282019615,
              "label": "epoch 270"
            },
            {
              "x": 271,
              "y": 0.08604904264211655,
              "label": "epoch 271"
            },
            {
              "x": 272,
              "y": 0.02024383470416069,
              "label": "epoch 272"
            },
            {
              "x": 273,
              "y": 0.02836202085018158,
              "label": "epoch 273"
            },
            {
              "x": 274,
              "y": 0.025496765971183777,
              "label": "epoch 274"
            },
            {
              "x": 275,
              "y": 0.029461313039064407,
              "label": "epoch 275"
            },
            {
              "x": 276,
              "y": 0.024442605674266815,
              "label": "epoch 276"
            },
            {
              "x": 277,
              "y": 0.03129689767956734,
              "label": "epoch 277"
            },
            {
              "x": 278,
              "y": 0.026762422174215317,
              "label": "epoch 278"
            },
            {
              "x": 279,
              "y": 0.02410082146525383,
              "label": "epoch 279"
            },
            {
              "x": 280,
              "y": 0.09457599371671677,
              "label": "epoch 280"
            },
            {
              "x": 281,
              "y": 0.06998058408498764,
              "label": "epoch 281"
            },
            {
              "x": 282,
              "y": 0.012157936580479145,
              "label": "epoch 282"
            },
            {
              "x": 283,
              "y": 0.009146355092525482,
              "label": "epoch 283"
            },
            {
              "x": 284,
              "y": 0.06689399480819702,
              "label": "epoch 284"
            },
            {
              "x": 285,
              "y": 0.010854043997824192,
              "label": "epoch 285"
            },
            {
              "x": 286,
              "y": 0.13491272926330566,
              "label": "epoch 286"
            },
            {
              "x": 287,
              "y": 0.009188239462673664,
              "label": "epoch 287"
            },
            {
              "x": 288,
              "y": 0.011668888852000237,
              "label": "epoch 288"
            },
            {
              "x": 289,
              "y": 0.007045370992273092,
              "label": "epoch 289"
            },
            {
              "x": 290,
              "y": 0.01893223077058792,
              "label": "epoch 290"
            },
            {
              "x": 291,
              "y": 0.02114545740187168,
              "label": "epoch 291"
            },
            {
              "x": 292,
              "y": 0.07776788622140884,
              "label": "epoch 292"
            },
            {
              "x": 293,
              "y": 0.007741234730929136,
              "label": "epoch 293"
            },
            {
              "x": 294,
              "y": 0.037038493901491165,
              "label": "epoch 294"
            },
            {
              "x": 295,
              "y": 0.02305569313466549,
              "label": "epoch 295"
            },
            {
              "x": 296,
              "y": 0.014153104275465012,
              "label": "epoch 296"
            },
            {
              "x": 297,
              "y": 0.008638998493552208,
              "label": "epoch 297"
            },
            {
              "x": 298,
              "y": 0.05365333706140518,
              "label": "epoch 298"
            },
            {
              "x": 299,
              "y": 0.009703359566628933,
              "label": "epoch 299"
            },
            {
              "x": 300,
              "y": 0.014794686809182167,
              "label": "epoch 300"
            },
            {
              "x": 301,
              "y": 0.009071018546819687,
              "label": "epoch 301"
            },
            {
              "x": 302,
              "y": 0.04177522659301758,
              "label": "epoch 302"
            },
            {
              "x": 303,
              "y": 0.08622533082962036,
              "label": "epoch 303"
            },
            {
              "x": 304,
              "y": 0.011648157611489296,
              "label": "epoch 304"
            },
            {
              "x": 305,
              "y": 0.04870710149407387,
              "label": "epoch 305"
            },
            {
              "x": 306,
              "y": 0.009539468213915825,
              "label": "epoch 306"
            },
            {
              "x": 307,
              "y": 0.0774482786655426,
              "label": "epoch 307"
            },
            {
              "x": 308,
              "y": 0.014391002245247364,
              "label": "epoch 308"
            },
            {
              "x": 309,
              "y": 0.019627101719379425,
              "label": "epoch 309"
            },
            {
              "x": 310,
              "y": 0.011616659350693226,
              "label": "epoch 310"
            },
            {
              "x": 311,
              "y": 0.007713041268289089,
              "label": "epoch 311"
            },
            {
              "x": 312,
              "y": 0.014408351853489876,
              "label": "epoch 312"
            },
            {
              "x": 313,
              "y": 0.014642301946878433,
              "label": "epoch 313"
            },
            {
              "x": 314,
              "y": 0.02009112387895584,
              "label": "epoch 314"
            },
            {
              "x": 315,
              "y": 0.008359096013009548,
              "label": "epoch 315"
            },
            {
              "x": 316,
              "y": 0.09913589805364609,
              "label": "epoch 316"
            },
            {
              "x": 317,
              "y": 0.008515702560544014,
              "label": "epoch 317"
            },
            {
              "x": 318,
              "y": 0.006958600599318743,
              "label": "epoch 318"
            },
            {
              "x": 319,
              "y": 0.015804985538125038,
              "label": "epoch 319"
            },
            {
              "x": 320,
              "y": 0.00821197871118784,
              "label": "epoch 320"
            },
            {
              "x": 321,
              "y": 0.02469131536781788,
              "label": "epoch 321"
            },
            {
              "x": 322,
              "y": 0.004510987550020218,
              "label": "epoch 322"
            },
            {
              "x": 323,
              "y": 0.01099614892154932,
              "label": "epoch 323"
            },
            {
              "x": 324,
              "y": 0.036898158490657806,
              "label": "epoch 324"
            },
            {
              "x": 325,
              "y": 0.009736992418766022,
              "label": "epoch 325"
            },
            {
              "x": 326,
              "y": 0.012066646479070187,
              "label": "epoch 326"
            },
            {
              "x": 327,
              "y": 0.023209696635603905,
              "label": "epoch 327"
            },
            {
              "x": 328,
              "y": 0.012524735182523727,
              "label": "epoch 328"
            },
            {
              "x": 329,
              "y": 0.020074008032679558,
              "label": "epoch 329"
            },
            {
              "x": 330,
              "y": 0.015455393120646477,
              "label": "epoch 330"
            },
            {
              "x": 331,
              "y": 0.024939190596342087,
              "label": "epoch 331"
            },
            {
              "x": 332,
              "y": 0.09857409447431564,
              "label": "epoch 332"
            },
            {
              "x": 333,
              "y": 0.011254431679844856,
              "label": "epoch 333"
            },
            {
              "x": 334,
              "y": 0.01529735792428255,
              "label": "epoch 334"
            },
            {
              "x": 335,
              "y": 0.0676368698477745,
              "label": "epoch 335"
            },
            {
              "x": 336,
              "y": 0.01491574477404356,
              "label": "epoch 336"
            },
            {
              "x": 337,
              "y": 0.011625252664089203,
              "label": "epoch 337"
            },
            {
              "x": 338,
              "y": 0.007422985043376684,
              "label": "epoch 338"
            },
            {
              "x": 339,
              "y": 0.004705377854406834,
              "label": "epoch 339"
            },
            {
              "x": 340,
              "y": 0.027171123772859573,
              "label": "epoch 340"
            },
            {
              "x": 341,
              "y": 0.007528221234679222,
              "label": "epoch 341"
            },
            {
              "x": 342,
              "y": 0.01628005877137184,
              "label": "epoch 342"
            },
            {
              "x": 343,
              "y": 0.007407264783978462,
              "label": "epoch 343"
            },
            {
              "x": 344,
              "y": 0.010224254801869392,
              "label": "epoch 344"
            },
            {
              "x": 345,
              "y": 0.0066126687452197075,
              "label": "epoch 345"
            },
            {
              "x": 346,
              "y": 0.07322601974010468,
              "label": "epoch 346"
            },
            {
              "x": 347,
              "y": 0.06958091259002686,
              "label": "epoch 347"
            },
            {
              "x": 348,
              "y": 0.012828045524656773,
              "label": "epoch 348"
            },
            {
              "x": 349,
              "y": 0.05781381577253342,
              "label": "epoch 349"
            },
            {
              "x": 350,
              "y": 0.008395376615226269,
              "label": "epoch 350"
            },
            {
              "x": 351,
              "y": 0.032913561910390854,
              "label": "epoch 351"
            },
            {
              "x": 352,
              "y": 0.0070051332004368305,
              "label": "epoch 352"
            },
            {
              "x": 353,
              "y": 0.016287796199321747,
              "label": "epoch 353"
            },
            {
              "x": 354,
              "y": 0.07294604182243347,
              "label": "epoch 354"
            },
            {
              "x": 355,
              "y": 0.011353704147040844,
              "label": "epoch 355"
            },
            {
              "x": 356,
              "y": 0.004226011224091053,
              "label": "epoch 356"
            },
            {
              "x": 357,
              "y": 0.03749498724937439,
              "label": "epoch 357"
            },
            {
              "x": 358,
              "y": 0.036338143050670624,
              "label": "epoch 358"
            },
            {
              "x": 359,
              "y": 0.01695697195827961,
              "label": "epoch 359"
            },
            {
              "x": 360,
              "y": 0.06803108006715775,
              "label": "epoch 360"
            },
            {
              "x": 361,
              "y": 0.004896601662039757,
              "label": "epoch 361"
            },
            {
              "x": 362,
              "y": 0.015511964447796345,
              "label": "epoch 362"
            },
            {
              "x": 363,
              "y": 0.07278862595558167,
              "label": "epoch 363"
            },
            {
              "x": 364,
              "y": 0.014850789681077003,
              "label": "epoch 364"
            },
            {
              "x": 365,
              "y": 0.024884283542633057,
              "label": "epoch 365"
            },
            {
              "x": 366,
              "y": 0.004860039334744215,
              "label": "epoch 366"
            },
            {
              "x": 367,
              "y": 0.023944834247231483,
              "label": "epoch 367"
            },
            {
              "x": 368,
              "y": 0.014236953109502792,
              "label": "epoch 368"
            },
            {
              "x": 369,
              "y": 0.01877974532544613,
              "label": "epoch 369"
            },
            {
              "x": 370,
              "y": 0.01876736432313919,
              "label": "epoch 370"
            },
            {
              "x": 371,
              "y": 0.0062500168569386005,
              "label": "epoch 371"
            },
            {
              "x": 372,
              "y": 0.013451597653329372,
              "label": "epoch 372"
            },
            {
              "x": 373,
              "y": 0.055734213441610336,
              "label": "epoch 373"
            },
            {
              "x": 374,
              "y": 0.0076903849840164185,
              "label": "epoch 374"
            },
            {
              "x": 375,
              "y": 0.006560167297720909,
              "label": "epoch 375"
            },
            {
              "x": 376,
              "y": 0.10988280177116394,
              "label": "epoch 376"
            },
            {
              "x": 377,
              "y": 0.02112080715596676,
              "label": "epoch 377"
            },
            {
              "x": 378,
              "y": 0.004427387844771147,
              "label": "epoch 378"
            },
            {
              "x": 379,
              "y": 0.007912744767963886,
              "label": "epoch 379"
            },
            {
              "x": 380,
              "y": 0.02496047504246235,
              "label": "epoch 380"
            },
            {
              "x": 381,
              "y": 0.006759384647011757,
              "label": "epoch 381"
            },
            {
              "x": 382,
              "y": 0.005740731488913298,
              "label": "epoch 382"
            },
            {
              "x": 383,
              "y": 0.004252933897078037,
              "label": "epoch 383"
            },
            {
              "x": 384,
              "y": 0.01034968625754118,
              "label": "epoch 384"
            },
            {
              "x": 385,
              "y": 0.018785905092954636,
              "label": "epoch 385"
            },
            {
              "x": 386,
              "y": 0.007904919795691967,
              "label": "epoch 386"
            },
            {
              "x": 387,
              "y": 0.006096336059272289,
              "label": "epoch 387"
            },
            {
              "x": 388,
              "y": 0.007688029203563929,
              "label": "epoch 388"
            },
            {
              "x": 389,
              "y": 0.004722972400486469,
              "label": "epoch 389"
            },
            {
              "x": 390,
              "y": 0.0058059170842170715,
              "label": "epoch 390"
            },
            {
              "x": 391,
              "y": 0.006164760794490576,
              "label": "epoch 391"
            },
            {
              "x": 392,
              "y": 0.039785418659448624,
              "label": "epoch 392"
            },
            {
              "x": 393,
              "y": 0.010459511540830135,
              "label": "epoch 393"
            },
            {
              "x": 394,
              "y": 0.0050719017162919044,
              "label": "epoch 394"
            },
            {
              "x": 395,
              "y": 0.006749285385012627,
              "label": "epoch 395"
            },
            {
              "x": 396,
              "y": 0.0442185252904892,
              "label": "epoch 396"
            },
            {
              "x": 397,
              "y": 0.0065033878199756145,
              "label": "epoch 397"
            },
            {
              "x": 398,
              "y": 0.009789364412426949,
              "label": "epoch 398"
            },
            {
              "x": 399,
              "y": 0.008290504105389118,
              "label": "epoch 399"
            },
            {
              "x": 400,
              "y": 0.022984016686677933,
              "label": "epoch 400"
            },
            {
              "x": 401,
              "y": 0.00646132742986083,
              "label": "epoch 401"
            },
            {
              "x": 402,
              "y": 0.004978284705430269,
              "label": "epoch 402"
            },
            {
              "x": 403,
              "y": 0.0990067645907402,
              "label": "epoch 403"
            },
            {
              "x": 404,
              "y": 0.03863397613167763,
              "label": "epoch 404"
            },
            {
              "x": 405,
              "y": 0.01866036094725132,
              "label": "epoch 405"
            },
            {
              "x": 406,
              "y": 0.010861922055482864,
              "label": "epoch 406"
            },
            {
              "x": 407,
              "y": 0.009130235761404037,
              "label": "epoch 407"
            },
            {
              "x": 408,
              "y": 0.00747115770354867,
              "label": "epoch 408"
            },
            {
              "x": 409,
              "y": 0.0053983209654688835,
              "label": "epoch 409"
            },
            {
              "x": 410,
              "y": 0.06903785467147827,
              "label": "epoch 410"
            },
            {
              "x": 411,
              "y": 0.011531798169016838,
              "label": "epoch 411"
            },
            {
              "x": 412,
              "y": 0.08585716038942337,
              "label": "epoch 412"
            },
            {
              "x": 413,
              "y": 0.010756042785942554,
              "label": "epoch 413"
            },
            {
              "x": 414,
              "y": 0.05596190690994263,
              "label": "epoch 414"
            },
            {
              "x": 415,
              "y": 0.003261890960857272,
              "label": "epoch 415"
            },
            {
              "x": 416,
              "y": 0.043394312262535095,
              "label": "epoch 416"
            },
            {
              "x": 417,
              "y": 0.017365634441375732,
              "label": "epoch 417"
            },
            {
              "x": 418,
              "y": 0.009077655151486397,
              "label": "epoch 418"
            },
            {
              "x": 419,
              "y": 0.07380034774541855,
              "label": "epoch 419"
            },
            {
              "x": 420,
              "y": 0.021563829854130745,
              "label": "epoch 420"
            },
            {
              "x": 421,
              "y": 0.03221149742603302,
              "label": "epoch 421"
            },
            {
              "x": 422,
              "y": 0.016730375587940216,
              "label": "epoch 422"
            },
            {
              "x": 423,
              "y": 0.0040585813112556934,
              "label": "epoch 423"
            },
            {
              "x": 424,
              "y": 0.0045020319521427155,
              "label": "epoch 424"
            },
            {
              "x": 425,
              "y": 0.006441973615437746,
              "label": "epoch 425"
            },
            {
              "x": 426,
              "y": 0.008063744753599167,
              "label": "epoch 426"
            },
            {
              "x": 427,
              "y": 0.008091996423900127,
              "label": "epoch 427"
            },
            {
              "x": 428,
              "y": 0.017478549852967262,
              "label": "epoch 428"
            },
            {
              "x": 429,
              "y": 0.0230905469506979,
              "label": "epoch 429"
            },
            {
              "x": 430,
              "y": 0.038141943514347076,
              "label": "epoch 430"
            },
            {
              "x": 431,
              "y": 0.007977243512868881,
              "label": "epoch 431"
            },
            {
              "x": 432,
              "y": 0.024665020406246185,
              "label": "epoch 432"
            },
            {
              "x": 433,
              "y": 0.0051637375727295876,
              "label": "epoch 433"
            },
            {
              "x": 434,
              "y": 0.004888805095106363,
              "label": "epoch 434"
            },
            {
              "x": 435,
              "y": 0.008854949846863747,
              "label": "epoch 435"
            },
            {
              "x": 436,
              "y": 0.013286516070365906,
              "label": "epoch 436"
            },
            {
              "x": 437,
              "y": 0.009707369841635227,
              "label": "epoch 437"
            },
            {
              "x": 438,
              "y": 0.02674684301018715,
              "label": "epoch 438"
            },
            {
              "x": 439,
              "y": 0.06872086226940155,
              "label": "epoch 439"
            },
            {
              "x": 440,
              "y": 0.01799952983856201,
              "label": "epoch 440"
            },
            {
              "x": 441,
              "y": 0.015710441395640373,
              "label": "epoch 441"
            },
            {
              "x": 442,
              "y": 0.04923626035451889,
              "label": "epoch 442"
            },
            {
              "x": 443,
              "y": 0.004998111166059971,
              "label": "epoch 443"
            },
            {
              "x": 444,
              "y": 0.00991745013743639,
              "label": "epoch 444"
            },
            {
              "x": 445,
              "y": 0.0046872328966856,
              "label": "epoch 445"
            },
            {
              "x": 446,
              "y": 0.02131691761314869,
              "label": "epoch 446"
            },
            {
              "x": 447,
              "y": 0.0032988903112709522,
              "label": "epoch 447"
            },
            {
              "x": 448,
              "y": 0.005617281887680292,
              "label": "epoch 448"
            },
            {
              "x": 449,
              "y": 0.010895052924752235,
              "label": "epoch 449"
            },
            {
              "x": 450,
              "y": 0.016925128176808357,
              "label": "epoch 450"
            },
            {
              "x": 451,
              "y": 0.08590631932020187,
              "label": "epoch 451"
            },
            {
              "x": 452,
              "y": 0.004226307384669781,
              "label": "epoch 452"
            },
            {
              "x": 453,
              "y": 0.03094439208507538,
              "label": "epoch 453"
            },
            {
              "x": 454,
              "y": 0.015294143930077553,
              "label": "epoch 454"
            },
            {
              "x": 455,
              "y": 0.015509337186813354,
              "label": "epoch 455"
            },
            {
              "x": 456,
              "y": 0.004918700084090233,
              "label": "epoch 456"
            },
            {
              "x": 457,
              "y": 0.004090598318725824,
              "label": "epoch 457"
            },
            {
              "x": 458,
              "y": 0.06200274080038071,
              "label": "epoch 458"
            },
            {
              "x": 459,
              "y": 0.009024661034345627,
              "label": "epoch 459"
            },
            {
              "x": 460,
              "y": 0.004067031666636467,
              "label": "epoch 460"
            },
            {
              "x": 461,
              "y": 0.01140917744487524,
              "label": "epoch 461"
            },
            {
              "x": 462,
              "y": 0.019525883719325066,
              "label": "epoch 462"
            },
            {
              "x": 463,
              "y": 0.0038136588409543037,
              "label": "epoch 463"
            },
            {
              "x": 464,
              "y": 0.008588316850364208,
              "label": "epoch 464"
            },
            {
              "x": 465,
              "y": 0.00990120880305767,
              "label": "epoch 465"
            },
            {
              "x": 466,
              "y": 0.003452846547588706,
              "label": "epoch 466"
            },
            {
              "x": 467,
              "y": 0.0051016551442444324,
              "label": "epoch 467"
            },
            {
              "x": 468,
              "y": 0.004318626131862402,
              "label": "epoch 468"
            },
            {
              "x": 469,
              "y": 0.05473799630999565,
              "label": "epoch 469"
            },
            {
              "x": 470,
              "y": 0.00841209851205349,
              "label": "epoch 470"
            },
            {
              "x": 471,
              "y": 0.027981098741292953,
              "label": "epoch 471"
            },
            {
              "x": 472,
              "y": 0.003952663391828537,
              "label": "epoch 472"
            },
            {
              "x": 473,
              "y": 0.00658548204228282,
              "label": "epoch 473"
            },
            {
              "x": 474,
              "y": 0.004369574133306742,
              "label": "epoch 474"
            },
            {
              "x": 475,
              "y": 0.003759324550628662,
              "label": "epoch 475"
            },
            {
              "x": 476,
              "y": 0.013722418807446957,
              "label": "epoch 476"
            },
            {
              "x": 477,
              "y": 0.011249305680394173,
              "label": "epoch 477"
            },
            {
              "x": 478,
              "y": 0.009636707603931427,
              "label": "epoch 478"
            },
            {
              "x": 479,
              "y": 0.004219463095068932,
              "label": "epoch 479"
            },
            {
              "x": 480,
              "y": 0.005724437069147825,
              "label": "epoch 480"
            },
            {
              "x": 481,
              "y": 0.0539172925055027,
              "label": "epoch 481"
            },
            {
              "x": 482,
              "y": 0.04067965969443321,
              "label": "epoch 482"
            },
            {
              "x": 483,
              "y": 0.003887669648975134,
              "label": "epoch 483"
            },
            {
              "x": 484,
              "y": 0.023556649684906006,
              "label": "epoch 484"
            },
            {
              "x": 485,
              "y": 0.010309338569641113,
              "label": "epoch 485"
            },
            {
              "x": 486,
              "y": 0.017315633594989777,
              "label": "epoch 486"
            },
            {
              "x": 487,
              "y": 0.006511976011097431,
              "label": "epoch 487"
            },
            {
              "x": 488,
              "y": 0.004867063369601965,
              "label": "epoch 488"
            },
            {
              "x": 489,
              "y": 0.046696584671735764,
              "label": "epoch 489"
            },
            {
              "x": 490,
              "y": 0.006624337285757065,
              "label": "epoch 490"
            },
            {
              "x": 491,
              "y": 0.0061247460544109344,
              "label": "epoch 491"
            },
            {
              "x": 492,
              "y": 0.005148465279489756,
              "label": "epoch 492"
            },
            {
              "x": 493,
              "y": 0.011602011509239674,
              "label": "epoch 493"
            },
            {
              "x": 494,
              "y": 0.01943100616335869,
              "label": "epoch 494"
            },
            {
              "x": 495,
              "y": 0.01660173013806343,
              "label": "epoch 495"
            },
            {
              "x": 496,
              "y": 0.025625085458159447,
              "label": "epoch 496"
            },
            {
              "x": 497,
              "y": 0.01165518257766962,
              "label": "epoch 497"
            },
            {
              "x": 498,
              "y": 0.0038114781491458416,
              "label": "epoch 498"
            },
            {
              "x": 499,
              "y": 0.008870374411344528,
              "label": "epoch 499"
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
            },
            {
              "x": 268,
              "y": 1.4225225133551775,
              "label": "epoch 268"
            },
            {
              "x": 269,
              "y": 1.4608520816913562,
              "label": "epoch 269"
            },
            {
              "x": 270,
              "y": 1.443699781721654,
              "label": "epoch 270"
            },
            {
              "x": 271,
              "y": 1.1519441693089902,
              "label": "epoch 271"
            },
            {
              "x": 272,
              "y": 1.2397264638474506,
              "label": "epoch 272"
            },
            {
              "x": 273,
              "y": 1.2246275283886414,
              "label": "epoch 273"
            },
            {
              "x": 274,
              "y": 1.3009124757525952,
              "label": "epoch 274"
            },
            {
              "x": 275,
              "y": 1.2945500425014056,
              "label": "epoch 275"
            },
            {
              "x": 276,
              "y": 1.1862357727889168,
              "label": "epoch 276"
            },
            {
              "x": 277,
              "y": 1.3987849417240603,
              "label": "epoch 277"
            },
            {
              "x": 278,
              "y": 1.4548823954660053,
              "label": "epoch 278"
            },
            {
              "x": 279,
              "y": 1.250663336709534,
              "label": "epoch 279"
            },
            {
              "x": 280,
              "y": 1.393888238204741,
              "label": "epoch 280"
            },
            {
              "x": 281,
              "y": 1.4193559281258403,
              "label": "epoch 281"
            },
            {
              "x": 282,
              "y": 1.2099959876290278,
              "label": "epoch 282"
            },
            {
              "x": 283,
              "y": 1.4229950140426426,
              "label": "epoch 283"
            },
            {
              "x": 284,
              "y": 1.6315310267780565,
              "label": "epoch 284"
            },
            {
              "x": 285,
              "y": 1.3748592131673114,
              "label": "epoch 285"
            },
            {
              "x": 286,
              "y": 1.342739932851768,
              "label": "epoch 286"
            },
            {
              "x": 287,
              "y": 1.3930875399444056,
              "label": "epoch 287"
            },
            {
              "x": 288,
              "y": 1.2696129939714937,
              "label": "epoch 288"
            },
            {
              "x": 289,
              "y": 1.2596340313749879,
              "label": "epoch 289"
            },
            {
              "x": 290,
              "y": 1.180363759986664,
              "label": "epoch 290"
            },
            {
              "x": 291,
              "y": 1.1236513211563426,
              "label": "epoch 291"
            },
            {
              "x": 292,
              "y": 1.4095306124930318,
              "label": "epoch 292"
            },
            {
              "x": 293,
              "y": 1.4958316808394891,
              "label": "epoch 293"
            },
            {
              "x": 294,
              "y": 1.5501424637132961,
              "label": "epoch 294"
            },
            {
              "x": 295,
              "y": 1.3140253729775155,
              "label": "epoch 295"
            },
            {
              "x": 296,
              "y": 1.5700806237414087,
              "label": "epoch 296"
            },
            {
              "x": 297,
              "y": 1.5789533016688533,
              "label": "epoch 297"
            },
            {
              "x": 298,
              "y": 1.379655856296028,
              "label": "epoch 298"
            },
            {
              "x": 299,
              "y": 1.498857055619163,
              "label": "epoch 299"
            },
            {
              "x": 300,
              "y": 1.378408466147161,
              "label": "epoch 300"
            },
            {
              "x": 301,
              "y": 1.3053276907334006,
              "label": "epoch 301"
            },
            {
              "x": 302,
              "y": 1.352474745215946,
              "label": "epoch 302"
            },
            {
              "x": 303,
              "y": 1.411131699545015,
              "label": "epoch 303"
            },
            {
              "x": 304,
              "y": 1.455908373218814,
              "label": "epoch 304"
            },
            {
              "x": 305,
              "y": 1.351398035908412,
              "label": "epoch 305"
            },
            {
              "x": 306,
              "y": 1.3650860267348195,
              "label": "epoch 306"
            },
            {
              "x": 307,
              "y": 1.2101091298421747,
              "label": "epoch 307"
            },
            {
              "x": 308,
              "y": 1.3304394172798646,
              "label": "epoch 308"
            },
            {
              "x": 309,
              "y": 1.356860807337063,
              "label": "epoch 309"
            },
            {
              "x": 310,
              "y": 1.5957387957329814,
              "label": "epoch 310"
            },
            {
              "x": 311,
              "y": 1.5332107953849787,
              "label": "epoch 311"
            },
            {
              "x": 312,
              "y": 1.5071364164009298,
              "label": "epoch 312"
            },
            {
              "x": 313,
              "y": 1.2951535195308297,
              "label": "epoch 313"
            },
            {
              "x": 314,
              "y": 1.3132261918539083,
              "label": "epoch 314"
            },
            {
              "x": 315,
              "y": 1.2878159864094894,
              "label": "epoch 315"
            },
            {
              "x": 316,
              "y": 1.4829810858998251,
              "label": "epoch 316"
            },
            {
              "x": 317,
              "y": 1.5130737157244432,
              "label": "epoch 317"
            },
            {
              "x": 318,
              "y": 1.5384085249449861,
              "label": "epoch 318"
            },
            {
              "x": 319,
              "y": 1.4659934580130012,
              "label": "epoch 319"
            },
            {
              "x": 320,
              "y": 1.3291948019085746,
              "label": "epoch 320"
            },
            {
              "x": 321,
              "y": 1.4884413596928905,
              "label": "epoch 321"
            },
            {
              "x": 322,
              "y": 1.4753174440150982,
              "label": "epoch 322"
            },
            {
              "x": 323,
              "y": 1.412390863718955,
              "label": "epoch 323"
            },
            {
              "x": 324,
              "y": 1.464497479156738,
              "label": "epoch 324"
            },
            {
              "x": 325,
              "y": 1.3937975881547715,
              "label": "epoch 325"
            },
            {
              "x": 326,
              "y": 1.3407255821297632,
              "label": "epoch 326"
            },
            {
              "x": 327,
              "y": 1.492336196763637,
              "label": "epoch 327"
            },
            {
              "x": 328,
              "y": 1.3326248362856477,
              "label": "epoch 328"
            },
            {
              "x": 329,
              "y": 1.471493174199407,
              "label": "epoch 329"
            },
            {
              "x": 330,
              "y": 1.4199864295752425,
              "label": "epoch 330"
            },
            {
              "x": 331,
              "y": 1.4517445166007077,
              "label": "epoch 331"
            },
            {
              "x": 332,
              "y": 1.3701017715134902,
              "label": "epoch 332"
            },
            {
              "x": 333,
              "y": 1.591197965470584,
              "label": "epoch 333"
            },
            {
              "x": 334,
              "y": 1.3744561730785982,
              "label": "epoch 334"
            },
            {
              "x": 335,
              "y": 1.370813137067384,
              "label": "epoch 335"
            },
            {
              "x": 336,
              "y": 1.5395926321905695,
              "label": "epoch 336"
            },
            {
              "x": 337,
              "y": 1.642634472809732,
              "label": "epoch 337"
            },
            {
              "x": 338,
              "y": 1.543405329257152,
              "label": "epoch 338"
            },
            {
              "x": 339,
              "y": 1.5427940917005272,
              "label": "epoch 339"
            },
            {
              "x": 340,
              "y": 1.2429965832025598,
              "label": "epoch 340"
            },
            {
              "x": 341,
              "y": 1.510613225768075,
              "label": "epoch 341"
            },
            {
              "x": 342,
              "y": 1.3442003587383384,
              "label": "epoch 342"
            },
            {
              "x": 343,
              "y": 1.6138189651170058,
              "label": "epoch 343"
            },
            {
              "x": 344,
              "y": 1.4534131812029762,
              "label": "epoch 344"
            },
            {
              "x": 345,
              "y": 1.7392166150782846,
              "label": "epoch 345"
            },
            {
              "x": 346,
              "y": 1.3984767863232839,
              "label": "epoch 346"
            },
            {
              "x": 347,
              "y": 1.410945287133616,
              "label": "epoch 347"
            },
            {
              "x": 348,
              "y": 1.4917750677191897,
              "label": "epoch 348"
            },
            {
              "x": 349,
              "y": 1.2621544189015894,
              "label": "epoch 349"
            },
            {
              "x": 350,
              "y": 1.4261120428135128,
              "label": "epoch 350"
            },
            {
              "x": 351,
              "y": 1.3668593322417062,
              "label": "epoch 351"
            },
            {
              "x": 352,
              "y": 1.5216860961365073,
              "label": "epoch 352"
            },
            {
              "x": 353,
              "y": 1.3836526698432863,
              "label": "epoch 353"
            },
            {
              "x": 354,
              "y": 1.510798665670384,
              "label": "epoch 354"
            },
            {
              "x": 355,
              "y": 1.3501462725138194,
              "label": "epoch 355"
            },
            {
              "x": 356,
              "y": 1.3546588962505524,
              "label": "epoch 356"
            },
            {
              "x": 357,
              "y": 1.5685586953829778,
              "label": "epoch 357"
            },
            {
              "x": 358,
              "y": 1.453540592013221,
              "label": "epoch 358"
            },
            {
              "x": 359,
              "y": 1.428161661753333,
              "label": "epoch 359"
            },
            {
              "x": 360,
              "y": 1.5996703002111692,
              "label": "epoch 360"
            },
            {
              "x": 361,
              "y": 1.7024853070707697,
              "label": "epoch 361"
            },
            {
              "x": 362,
              "y": 1.5188426008374478,
              "label": "epoch 362"
            },
            {
              "x": 363,
              "y": 1.4606277709581743,
              "label": "epoch 363"
            },
            {
              "x": 364,
              "y": 1.3660436478002291,
              "label": "epoch 364"
            },
            {
              "x": 365,
              "y": 1.4703967184514593,
              "label": "epoch 365"
            },
            {
              "x": 366,
              "y": 1.2656189911557656,
              "label": "epoch 366"
            },
            {
              "x": 367,
              "y": 1.3878693416420567,
              "label": "epoch 367"
            },
            {
              "x": 368,
              "y": 1.6311371979842846,
              "label": "epoch 368"
            },
            {
              "x": 369,
              "y": 1.4856393052951287,
              "label": "epoch 369"
            },
            {
              "x": 370,
              "y": 1.4733058422999947,
              "label": "epoch 370"
            },
            {
              "x": 371,
              "y": 1.5252005766439987,
              "label": "epoch 371"
            },
            {
              "x": 372,
              "y": 1.7542466519302444,
              "label": "epoch 372"
            },
            {
              "x": 373,
              "y": 1.5513097614196962,
              "label": "epoch 373"
            },
            {
              "x": 374,
              "y": 1.6431277965342528,
              "label": "epoch 374"
            },
            {
              "x": 375,
              "y": 1.45358518906869,
              "label": "epoch 375"
            },
            {
              "x": 376,
              "y": 1.3028117245259254,
              "label": "epoch 376"
            },
            {
              "x": 377,
              "y": 1.5093876692392911,
              "label": "epoch 377"
            },
            {
              "x": 378,
              "y": 1.490765480373643,
              "label": "epoch 378"
            },
            {
              "x": 379,
              "y": 1.6767242128691195,
              "label": "epoch 379"
            },
            {
              "x": 380,
              "y": 1.5434361255948286,
              "label": "epoch 380"
            },
            {
              "x": 381,
              "y": 1.5145704419670725,
              "label": "epoch 381"
            },
            {
              "x": 382,
              "y": 1.5220466373169697,
              "label": "epoch 382"
            },
            {
              "x": 383,
              "y": 1.6414855284077163,
              "label": "epoch 383"
            },
            {
              "x": 384,
              "y": 1.3580371019503985,
              "label": "epoch 384"
            },
            {
              "x": 385,
              "y": 1.3204885249908425,
              "label": "epoch 385"
            },
            {
              "x": 386,
              "y": 1.4487638719208342,
              "label": "epoch 386"
            },
            {
              "x": 387,
              "y": 1.5082642840417593,
              "label": "epoch 387"
            },
            {
              "x": 388,
              "y": 1.6644657011707558,
              "label": "epoch 388"
            },
            {
              "x": 389,
              "y": 1.7169549991621782,
              "label": "epoch 389"
            },
            {
              "x": 390,
              "y": 1.351188395956629,
              "label": "epoch 390"
            },
            {
              "x": 391,
              "y": 1.348502494590847,
              "label": "epoch 391"
            },
            {
              "x": 392,
              "y": 1.5014768482161391,
              "label": "epoch 392"
            },
            {
              "x": 393,
              "y": 1.4294739587379521,
              "label": "epoch 393"
            },
            {
              "x": 394,
              "y": 1.7703890327707326,
              "label": "epoch 394"
            },
            {
              "x": 395,
              "y": 1.3696825773406185,
              "label": "epoch 395"
            },
            {
              "x": 396,
              "y": 1.4242053311685787,
              "label": "epoch 396"
            },
            {
              "x": 397,
              "y": 1.4194131751397723,
              "label": "epoch 397"
            },
            {
              "x": 398,
              "y": 1.501289216691236,
              "label": "epoch 398"
            },
            {
              "x": 399,
              "y": 1.7350181586256153,
              "label": "epoch 399"
            },
            {
              "x": 400,
              "y": 1.3955077757372667,
              "label": "epoch 400"
            },
            {
              "x": 401,
              "y": 1.4859090276724218,
              "label": "epoch 401"
            },
            {
              "x": 402,
              "y": 1.5508399461641122,
              "label": "epoch 402"
            },
            {
              "x": 403,
              "y": 1.4316985197855454,
              "label": "epoch 403"
            },
            {
              "x": 404,
              "y": 1.6867876997413604,
              "label": "epoch 404"
            },
            {
              "x": 405,
              "y": 1.4373352483012958,
              "label": "epoch 405"
            },
            {
              "x": 406,
              "y": 1.4785801439398998,
              "label": "epoch 406"
            },
            {
              "x": 407,
              "y": 1.6870253544153744,
              "label": "epoch 407"
            },
            {
              "x": 408,
              "y": 1.7811223940531675,
              "label": "epoch 408"
            },
            {
              "x": 409,
              "y": 1.6125203315046077,
              "label": "epoch 409"
            },
            {
              "x": 410,
              "y": 1.6078555797912966,
              "label": "epoch 410"
            },
            {
              "x": 411,
              "y": 1.650837188353762,
              "label": "epoch 411"
            },
            {
              "x": 412,
              "y": 1.740709999576211,
              "label": "epoch 412"
            },
            {
              "x": 413,
              "y": 1.6286797460756803,
              "label": "epoch 413"
            },
            {
              "x": 414,
              "y": 1.6912191490103539,
              "label": "epoch 414"
            },
            {
              "x": 415,
              "y": 1.4494189650163447,
              "label": "epoch 415"
            },
            {
              "x": 416,
              "y": 1.7646213244021822,
              "label": "epoch 416"
            },
            {
              "x": 417,
              "y": 1.479957316217846,
              "label": "epoch 417"
            },
            {
              "x": 418,
              "y": 1.7183466376981844,
              "label": "epoch 418"
            },
            {
              "x": 419,
              "y": 1.7108843745663762,
              "label": "epoch 419"
            },
            {
              "x": 420,
              "y": 1.659455621602798,
              "label": "epoch 420"
            },
            {
              "x": 421,
              "y": 1.5824566845733083,
              "label": "epoch 421"
            },
            {
              "x": 422,
              "y": 1.7606427268443727,
              "label": "epoch 422"
            },
            {
              "x": 423,
              "y": 1.8345387848584276,
              "label": "epoch 423"
            },
            {
              "x": 424,
              "y": 1.5309340145536943,
              "label": "epoch 424"
            },
            {
              "x": 425,
              "y": 1.855825756578461,
              "label": "epoch 425"
            },
            {
              "x": 426,
              "y": 1.3775061659245311,
              "label": "epoch 426"
            },
            {
              "x": 427,
              "y": 1.697054365171904,
              "label": "epoch 427"
            },
            {
              "x": 428,
              "y": 1.7879433398085989,
              "label": "epoch 428"
            },
            {
              "x": 429,
              "y": 1.747076618252322,
              "label": "epoch 429"
            },
            {
              "x": 430,
              "y": 1.641814198148878,
              "label": "epoch 430"
            },
            {
              "x": 431,
              "y": 1.61104297012973,
              "label": "epoch 431"
            },
            {
              "x": 432,
              "y": 1.5075219018188746,
              "label": "epoch 432"
            },
            {
              "x": 433,
              "y": 1.6905314160118763,
              "label": "epoch 433"
            },
            {
              "x": 434,
              "y": 1.650489838254687,
              "label": "epoch 434"
            },
            {
              "x": 435,
              "y": 1.6015873905761462,
              "label": "epoch 435"
            },
            {
              "x": 436,
              "y": 1.6074719724588489,
              "label": "epoch 436"
            },
            {
              "x": 437,
              "y": 1.8375825860145454,
              "label": "epoch 437"
            },
            {
              "x": 438,
              "y": 1.8301372872665524,
              "label": "epoch 438"
            },
            {
              "x": 439,
              "y": 1.4397124851514633,
              "label": "epoch 439"
            },
            {
              "x": 440,
              "y": 1.6988878147431503,
              "label": "epoch 440"
            },
            {
              "x": 441,
              "y": 1.8485193425348323,
              "label": "epoch 441"
            },
            {
              "x": 442,
              "y": 1.7003111031127016,
              "label": "epoch 442"
            },
            {
              "x": 443,
              "y": 1.6504366731785827,
              "label": "epoch 443"
            },
            {
              "x": 444,
              "y": 1.4665763562447147,
              "label": "epoch 444"
            },
            {
              "x": 445,
              "y": 1.7030332660008418,
              "label": "epoch 445"
            },
            {
              "x": 446,
              "y": 1.7217225821590738,
              "label": "epoch 446"
            },
            {
              "x": 447,
              "y": 1.6875343981297,
              "label": "epoch 447"
            },
            {
              "x": 448,
              "y": 1.636250549486201,
              "label": "epoch 448"
            },
            {
              "x": 449,
              "y": 1.547233894675676,
              "label": "epoch 449"
            },
            {
              "x": 450,
              "y": 1.4400055339854014,
              "label": "epoch 450"
            },
            {
              "x": 451,
              "y": 1.842954187261823,
              "label": "epoch 451"
            },
            {
              "x": 452,
              "y": 1.5074579963754666,
              "label": "epoch 452"
            },
            {
              "x": 453,
              "y": 1.7742008522250934,
              "label": "epoch 453"
            },
            {
              "x": 454,
              "y": 1.714648314114464,
              "label": "epoch 454"
            },
            {
              "x": 455,
              "y": 1.6429836406421505,
              "label": "epoch 455"
            },
            {
              "x": 456,
              "y": 1.9312921222176795,
              "label": "epoch 456"
            },
            {
              "x": 457,
              "y": 1.5814491168252731,
              "label": "epoch 457"
            },
            {
              "x": 458,
              "y": 1.8023530088708197,
              "label": "epoch 458"
            },
            {
              "x": 459,
              "y": 1.487269221749892,
              "label": "epoch 459"
            },
            {
              "x": 460,
              "y": 1.7480672617491924,
              "label": "epoch 460"
            },
            {
              "x": 461,
              "y": 1.8405343322573524,
              "label": "epoch 461"
            },
            {
              "x": 462,
              "y": 1.6566056292626614,
              "label": "epoch 462"
            },
            {
              "x": 463,
              "y": 1.6803839270785255,
              "label": "epoch 463"
            },
            {
              "x": 464,
              "y": 1.682725512005977,
              "label": "epoch 464"
            },
            {
              "x": 465,
              "y": 1.5794117262488918,
              "label": "epoch 465"
            },
            {
              "x": 466,
              "y": 1.5518832745300115,
              "label": "epoch 466"
            },
            {
              "x": 467,
              "y": 1.4938477770131278,
              "label": "epoch 467"
            },
            {
              "x": 468,
              "y": 1.8607381174929047,
              "label": "epoch 468"
            },
            {
              "x": 469,
              "y": 1.6944110714217746,
              "label": "epoch 469"
            },
            {
              "x": 470,
              "y": 1.7552128858300613,
              "label": "epoch 470"
            },
            {
              "x": 471,
              "y": 1.447006267078809,
              "label": "epoch 471"
            },
            {
              "x": 472,
              "y": 1.5301123138419108,
              "label": "epoch 472"
            },
            {
              "x": 473,
              "y": 1.5995879246926819,
              "label": "epoch 473"
            },
            {
              "x": 474,
              "y": 1.6705540478180505,
              "label": "epoch 474"
            },
            {
              "x": 475,
              "y": 1.6827423779146844,
              "label": "epoch 475"
            },
            {
              "x": 476,
              "y": 1.5282328261895792,
              "label": "epoch 476"
            },
            {
              "x": 477,
              "y": 1.8904600659826476,
              "label": "epoch 477"
            },
            {
              "x": 478,
              "y": 1.703831814315268,
              "label": "epoch 478"
            },
            {
              "x": 479,
              "y": 1.726648441662914,
              "label": "epoch 479"
            },
            {
              "x": 480,
              "y": 1.7667041283198877,
              "label": "epoch 480"
            },
            {
              "x": 481,
              "y": 1.5683377666496916,
              "label": "epoch 481"
            },
            {
              "x": 482,
              "y": 1.5494545324656523,
              "label": "epoch 482"
            },
            {
              "x": 483,
              "y": 1.5967467176654424,
              "label": "epoch 483"
            },
            {
              "x": 484,
              "y": 1.786340750619083,
              "label": "epoch 484"
            },
            {
              "x": 485,
              "y": 1.6716658029656268,
              "label": "epoch 485"
            },
            {
              "x": 486,
              "y": 1.6614295706447018,
              "label": "epoch 486"
            },
            {
              "x": 487,
              "y": 1.7439982498701858,
              "label": "epoch 487"
            },
            {
              "x": 488,
              "y": 1.6601135016566044,
              "label": "epoch 488"
            },
            {
              "x": 489,
              "y": 1.678948500365215,
              "label": "epoch 489"
            },
            {
              "x": 490,
              "y": 1.4344791220501065,
              "label": "epoch 490"
            },
            {
              "x": 491,
              "y": 1.733972992797039,
              "label": "epoch 491"
            },
            {
              "x": 492,
              "y": 1.6479065041547936,
              "label": "epoch 492"
            },
            {
              "x": 493,
              "y": 1.5452577660448457,
              "label": "epoch 493"
            },
            {
              "x": 494,
              "y": 1.703324574192888,
              "label": "epoch 494"
            },
            {
              "x": 495,
              "y": 1.595515463060062,
              "label": "epoch 495"
            },
            {
              "x": 496,
              "y": 1.8189190769764154,
              "label": "epoch 496"
            },
            {
              "x": 497,
              "y": 1.8159718683210055,
              "label": "epoch 497"
            },
            {
              "x": 498,
              "y": 1.5269644329030263,
              "label": "epoch 498"
            },
            {
              "x": 499,
              "y": 1.749937889656346,
              "label": "epoch 499"
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
            },
            {
              "x": 268,
              "y": 0.00423872646474353,
              "label": "epoch 268"
            },
            {
              "x": 269,
              "y": 0.0042347145407754735,
              "label": "epoch 269"
            },
            {
              "x": 270,
              "y": 0.004227157092827838,
              "label": "epoch 270"
            },
            {
              "x": 271,
              "y": 0.004233951614112716,
              "label": "epoch 271"
            },
            {
              "x": 272,
              "y": 0.004238126238832544,
              "label": "epoch 272"
            },
            {
              "x": 273,
              "y": 0.004234300260386111,
              "label": "epoch 273"
            },
            {
              "x": 274,
              "y": 0.004231464277453549,
              "label": "epoch 274"
            },
            {
              "x": 275,
              "y": 0.004242533315463285,
              "label": "epoch 275"
            },
            {
              "x": 276,
              "y": 0.004233360657005841,
              "label": "epoch 276"
            },
            {
              "x": 277,
              "y": 0.004233860966020362,
              "label": "epoch 277"
            },
            {
              "x": 278,
              "y": 0.004241472456334649,
              "label": "epoch 278"
            },
            {
              "x": 279,
              "y": 0.004225270052541562,
              "label": "epoch 279"
            },
            {
              "x": 280,
              "y": 0.004223480261172976,
              "label": "epoch 280"
            },
            {
              "x": 281,
              "y": 0.004250982920654535,
              "label": "epoch 281"
            },
            {
              "x": 282,
              "y": 0.00423421970864231,
              "label": "epoch 282"
            },
            {
              "x": 283,
              "y": 0.004234135440798893,
              "label": "epoch 283"
            },
            {
              "x": 284,
              "y": 0.004227203362939977,
              "label": "epoch 284"
            },
            {
              "x": 285,
              "y": 0.0042267261240723246,
              "label": "epoch 285"
            },
            {
              "x": 286,
              "y": 0.004208771573949458,
              "label": "epoch 286"
            },
            {
              "x": 287,
              "y": 0.00418990267452931,
              "label": "epoch 287"
            },
            {
              "x": 288,
              "y": 0.004201305832171592,
              "label": "epoch 288"
            },
            {
              "x": 289,
              "y": 0.004212349316635243,
              "label": "epoch 289"
            },
            {
              "x": 290,
              "y": 0.00419506569520117,
              "label": "epoch 290"
            },
            {
              "x": 291,
              "y": 0.004187543032458052,
              "label": "epoch 291"
            },
            {
              "x": 292,
              "y": 0.004211454685948985,
              "label": "epoch 292"
            },
            {
              "x": 293,
              "y": 0.004181710431064283,
              "label": "epoch 293"
            },
            {
              "x": 294,
              "y": 0.004161680956282285,
              "label": "epoch 294"
            },
            {
              "x": 295,
              "y": 0.0041851367752410865,
              "label": "epoch 295"
            },
            {
              "x": 296,
              "y": 0.004165858237492533,
              "label": "epoch 296"
            },
            {
              "x": 297,
              "y": 0.004168677618221601,
              "label": "epoch 297"
            },
            {
              "x": 298,
              "y": 0.004175173378730267,
              "label": "epoch 298"
            },
            {
              "x": 299,
              "y": 0.0041737557246386515,
              "label": "epoch 299"
            },
            {
              "x": 300,
              "y": 0.004162223195108757,
              "label": "epoch 300"
            },
            {
              "x": 301,
              "y": 0.004176985158042761,
              "label": "epoch 301"
            },
            {
              "x": 302,
              "y": 0.004185480988158624,
              "label": "epoch 302"
            },
            {
              "x": 303,
              "y": 0.004177549915958049,
              "label": "epoch 303"
            },
            {
              "x": 304,
              "y": 0.00418582262347244,
              "label": "epoch 304"
            },
            {
              "x": 305,
              "y": 0.004181980562479063,
              "label": "epoch 305"
            },
            {
              "x": 306,
              "y": 0.00416472999112509,
              "label": "epoch 306"
            },
            {
              "x": 307,
              "y": 0.004156693803164863,
              "label": "epoch 307"
            },
            {
              "x": 308,
              "y": 0.004175946162400865,
              "label": "epoch 308"
            },
            {
              "x": 309,
              "y": 0.004173253225943833,
              "label": "epoch 309"
            },
            {
              "x": 310,
              "y": 0.00417767181313952,
              "label": "epoch 310"
            },
            {
              "x": 311,
              "y": 0.004155193096314753,
              "label": "epoch 311"
            },
            {
              "x": 312,
              "y": 0.004184041578953743,
              "label": "epoch 312"
            },
            {
              "x": 313,
              "y": 0.0041537999614344075,
              "label": "epoch 313"
            },
            {
              "x": 314,
              "y": 0.004184994317352232,
              "label": "epoch 314"
            },
            {
              "x": 315,
              "y": 0.004156772319555258,
              "label": "epoch 315"
            },
            {
              "x": 316,
              "y": 0.004166653827843747,
              "label": "epoch 316"
            },
            {
              "x": 317,
              "y": 0.0041777181069942585,
              "label": "epoch 317"
            },
            {
              "x": 318,
              "y": 0.004186433836079423,
              "label": "epoch 318"
            },
            {
              "x": 319,
              "y": 0.004188878179487993,
              "label": "epoch 319"
            },
            {
              "x": 320,
              "y": 0.004190575967138437,
              "label": "epoch 320"
            },
            {
              "x": 321,
              "y": 0.004191908751779824,
              "label": "epoch 321"
            },
            {
              "x": 322,
              "y": 0.004174269424478744,
              "label": "epoch 322"
            },
            {
              "x": 323,
              "y": 0.004170858960270907,
              "label": "epoch 323"
            },
            {
              "x": 324,
              "y": 0.004188254914065749,
              "label": "epoch 324"
            },
            {
              "x": 325,
              "y": 0.004198104525321948,
              "label": "epoch 325"
            },
            {
              "x": 326,
              "y": 0.0042013778702790945,
              "label": "epoch 326"
            },
            {
              "x": 327,
              "y": 0.004213951097259077,
              "label": "epoch 327"
            },
            {
              "x": 328,
              "y": 0.004200700985261631,
              "label": "epoch 328"
            },
            {
              "x": 329,
              "y": 0.004204633546913483,
              "label": "epoch 329"
            },
            {
              "x": 330,
              "y": 0.004201191542961169,
              "label": "epoch 330"
            },
            {
              "x": 331,
              "y": 0.004212017698400335,
              "label": "epoch 331"
            },
            {
              "x": 332,
              "y": 0.004210454512136302,
              "label": "epoch 332"
            },
            {
              "x": 333,
              "y": 0.004205156814254894,
              "label": "epoch 333"
            },
            {
              "x": 334,
              "y": 0.0042250135712062105,
              "label": "epoch 334"
            },
            {
              "x": 335,
              "y": 0.004204930196513152,
              "label": "epoch 335"
            },
            {
              "x": 336,
              "y": 0.004218436388519446,
              "label": "epoch 336"
            },
            {
              "x": 337,
              "y": 0.004226499620448234,
              "label": "epoch 337"
            },
            {
              "x": 338,
              "y": 0.004212610006154711,
              "label": "epoch 338"
            },
            {
              "x": 339,
              "y": 0.004208592018250401,
              "label": "epoch 339"
            },
            {
              "x": 340,
              "y": 0.004219303156500437,
              "label": "epoch 340"
            },
            {
              "x": 341,
              "y": 0.0042293562667174755,
              "label": "epoch 341"
            },
            {
              "x": 342,
              "y": 0.004228437326673884,
              "label": "epoch 342"
            },
            {
              "x": 343,
              "y": 0.004219250524137782,
              "label": "epoch 343"
            },
            {
              "x": 344,
              "y": 0.004218115064998672,
              "label": "epoch 344"
            },
            {
              "x": 345,
              "y": 0.004212083007012935,
              "label": "epoch 345"
            },
            {
              "x": 346,
              "y": 0.00422011153530452,
              "label": "epoch 346"
            },
            {
              "x": 347,
              "y": 0.004210734431245855,
              "label": "epoch 347"
            },
            {
              "x": 348,
              "y": 0.004214158880610117,
              "label": "epoch 348"
            },
            {
              "x": 349,
              "y": 0.00421202221945063,
              "label": "epoch 349"
            },
            {
              "x": 350,
              "y": 0.0042381994770901085,
              "label": "epoch 350"
            },
            {
              "x": 351,
              "y": 0.004223673801645514,
              "label": "epoch 351"
            },
            {
              "x": 352,
              "y": 0.004215543727025904,
              "label": "epoch 352"
            },
            {
              "x": 353,
              "y": 0.004194995781290345,
              "label": "epoch 353"
            },
            {
              "x": 354,
              "y": 0.004205410723730701,
              "label": "epoch 354"
            },
            {
              "x": 355,
              "y": 0.004207501526061127,
              "label": "epoch 355"
            },
            {
              "x": 356,
              "y": 0.004220540264213923,
              "label": "epoch 356"
            },
            {
              "x": 357,
              "y": 0.004217652352771869,
              "label": "epoch 357"
            },
            {
              "x": 358,
              "y": 0.004216048485479979,
              "label": "epoch 358"
            },
            {
              "x": 359,
              "y": 0.004221527596344363,
              "label": "epoch 359"
            },
            {
              "x": 360,
              "y": 0.004234749210713505,
              "label": "epoch 360"
            },
            {
              "x": 361,
              "y": 0.0042434231650795,
              "label": "epoch 361"
            },
            {
              "x": 362,
              "y": 0.004231511896681408,
              "label": "epoch 362"
            },
            {
              "x": 363,
              "y": 0.004241787111248796,
              "label": "epoch 363"
            },
            {
              "x": 364,
              "y": 0.004224640513329129,
              "label": "epoch 364"
            },
            {
              "x": 365,
              "y": 0.004228882671955752,
              "label": "epoch 365"
            },
            {
              "x": 366,
              "y": 0.0042262333426103735,
              "label": "epoch 366"
            },
            {
              "x": 367,
              "y": 0.004222662072080359,
              "label": "epoch 367"
            },
            {
              "x": 368,
              "y": 0.00421209845233917,
              "label": "epoch 368"
            },
            {
              "x": 369,
              "y": 0.004211106140773106,
              "label": "epoch 369"
            },
            {
              "x": 370,
              "y": 0.004208684502947635,
              "label": "epoch 370"
            },
            {
              "x": 371,
              "y": 0.0042034408010965165,
              "label": "epoch 371"
            },
            {
              "x": 372,
              "y": 0.004218835331573102,
              "label": "epoch 372"
            },
            {
              "x": 373,
              "y": 0.004219922792751612,
              "label": "epoch 373"
            },
            {
              "x": 374,
              "y": 0.004222971316745603,
              "label": "epoch 374"
            },
            {
              "x": 375,
              "y": 0.004228278215649832,
              "label": "epoch 375"
            },
            {
              "x": 376,
              "y": 0.004229114814446994,
              "label": "epoch 376"
            },
            {
              "x": 377,
              "y": 0.004224346171739805,
              "label": "epoch 377"
            },
            {
              "x": 378,
              "y": 0.004214909274244411,
              "label": "epoch 378"
            },
            {
              "x": 379,
              "y": 0.004230048686287391,
              "label": "epoch 379"
            },
            {
              "x": 380,
              "y": 0.00422476599947243,
              "label": "epoch 380"
            },
            {
              "x": 381,
              "y": 0.004228641282871219,
              "label": "epoch 381"
            },
            {
              "x": 382,
              "y": 0.004228221371273608,
              "label": "epoch 382"
            },
            {
              "x": 383,
              "y": 0.0042169048944120545,
              "label": "epoch 383"
            },
            {
              "x": 384,
              "y": 0.004215380888413883,
              "label": "epoch 384"
            },
            {
              "x": 385,
              "y": 0.0042004704465446255,
              "label": "epoch 385"
            },
            {
              "x": 386,
              "y": 0.004199244439261843,
              "label": "epoch 386"
            },
            {
              "x": 387,
              "y": 0.004206049851506434,
              "label": "epoch 387"
            },
            {
              "x": 388,
              "y": 0.004205707166539996,
              "label": "epoch 388"
            },
            {
              "x": 389,
              "y": 0.004190792532187372,
              "label": "epoch 389"
            },
            {
              "x": 390,
              "y": 0.0041983344654957025,
              "label": "epoch 390"
            },
            {
              "x": 391,
              "y": 0.0042099067014580785,
              "label": "epoch 391"
            },
            {
              "x": 392,
              "y": 0.00421064731697123,
              "label": "epoch 392"
            },
            {
              "x": 393,
              "y": 0.004211200341447501,
              "label": "epoch 393"
            },
            {
              "x": 394,
              "y": 0.004177523735147827,
              "label": "epoch 394"
            },
            {
              "x": 395,
              "y": 0.004194245545429447,
              "label": "epoch 395"
            },
            {
              "x": 396,
              "y": 0.004182984016216851,
              "label": "epoch 396"
            },
            {
              "x": 397,
              "y": 0.004173796155986278,
              "label": "epoch 397"
            },
            {
              "x": 398,
              "y": 0.004185498249793646,
              "label": "epoch 398"
            },
            {
              "x": 399,
              "y": 0.004187247451275317,
              "label": "epoch 399"
            },
            {
              "x": 400,
              "y": 0.00417903118489592,
              "label": "epoch 400"
            },
            {
              "x": 401,
              "y": 0.004169142327890241,
              "label": "epoch 401"
            },
            {
              "x": 402,
              "y": 0.0041851410669072435,
              "label": "epoch 402"
            },
            {
              "x": 403,
              "y": 0.004178597886685135,
              "label": "epoch 403"
            },
            {
              "x": 404,
              "y": 0.004188611683754348,
              "label": "epoch 404"
            },
            {
              "x": 405,
              "y": 0.004189753145175545,
              "label": "epoch 405"
            },
            {
              "x": 406,
              "y": 0.004199766826978272,
              "label": "epoch 406"
            },
            {
              "x": 407,
              "y": 0.004170414187109073,
              "label": "epoch 407"
            },
            {
              "x": 408,
              "y": 0.004186890798767931,
              "label": "epoch 408"
            },
            {
              "x": 409,
              "y": 0.00417356524657838,
              "label": "epoch 409"
            },
            {
              "x": 410,
              "y": 0.004182380483574602,
              "label": "epoch 410"
            },
            {
              "x": 411,
              "y": 0.004173847122537585,
              "label": "epoch 411"
            },
            {
              "x": 412,
              "y": 0.004165718053531907,
              "label": "epoch 412"
            },
            {
              "x": 413,
              "y": 0.004167322628889356,
              "label": "epoch 413"
            },
            {
              "x": 414,
              "y": 0.004166161060167819,
              "label": "epoch 414"
            },
            {
              "x": 415,
              "y": 0.004174614340100609,
              "label": "epoch 415"
            },
            {
              "x": 416,
              "y": 0.004164786191770537,
              "label": "epoch 416"
            },
            {
              "x": 417,
              "y": 0.004169511297062088,
              "label": "epoch 417"
            },
            {
              "x": 418,
              "y": 0.004161013225951281,
              "label": "epoch 418"
            },
            {
              "x": 419,
              "y": 0.004162257820242207,
              "label": "epoch 419"
            },
            {
              "x": 420,
              "y": 0.0041746022145257725,
              "label": "epoch 420"
            },
            {
              "x": 421,
              "y": 0.004164453162765743,
              "label": "epoch 421"
            },
            {
              "x": 422,
              "y": 0.004171066610739983,
              "label": "epoch 422"
            },
            {
              "x": 423,
              "y": 0.004176636018918974,
              "label": "epoch 423"
            },
            {
              "x": 424,
              "y": 0.004161220133506791,
              "label": "epoch 424"
            },
            {
              "x": 425,
              "y": 0.004174124981785242,
              "label": "epoch 425"
            },
            {
              "x": 426,
              "y": 0.004173125835414363,
              "label": "epoch 426"
            },
            {
              "x": 427,
              "y": 0.004170611647790984,
              "label": "epoch 427"
            },
            {
              "x": 428,
              "y": 0.004174340178188255,
              "label": "epoch 428"
            },
            {
              "x": 429,
              "y": 0.004175345212340625,
              "label": "epoch 429"
            },
            {
              "x": 430,
              "y": 0.004172358770263504,
              "label": "epoch 430"
            },
            {
              "x": 431,
              "y": 0.004178409065245528,
              "label": "epoch 431"
            },
            {
              "x": 432,
              "y": 0.004168705594661572,
              "label": "epoch 432"
            },
            {
              "x": 433,
              "y": 0.004175341464073618,
              "label": "epoch 433"
            },
            {
              "x": 434,
              "y": 0.004174465002602358,
              "label": "epoch 434"
            },
            {
              "x": 435,
              "y": 0.0041729436381597465,
              "label": "epoch 435"
            },
            {
              "x": 436,
              "y": 0.004171975368272366,
              "label": "epoch 436"
            },
            {
              "x": 437,
              "y": 0.004175238681981634,
              "label": "epoch 437"
            },
            {
              "x": 438,
              "y": 0.004182034138801483,
              "label": "epoch 438"
            },
            {
              "x": 439,
              "y": 0.0041806493482956855,
              "label": "epoch 439"
            },
            {
              "x": 440,
              "y": 0.004181648618740789,
              "label": "epoch 440"
            },
            {
              "x": 441,
              "y": 0.00417727786981758,
              "label": "epoch 441"
            },
            {
              "x": 442,
              "y": 0.004179512374991502,
              "label": "epoch 442"
            },
            {
              "x": 443,
              "y": 0.004176121082931978,
              "label": "epoch 443"
            },
            {
              "x": 444,
              "y": 0.0041795987363959855,
              "label": "epoch 444"
            },
            {
              "x": 445,
              "y": 0.0041858263950991,
              "label": "epoch 445"
            },
            {
              "x": 446,
              "y": 0.004186897026604703,
              "label": "epoch 446"
            },
            {
              "x": 447,
              "y": 0.004185185754307129,
              "label": "epoch 447"
            },
            {
              "x": 448,
              "y": 0.004182086784184273,
              "label": "epoch 448"
            },
            {
              "x": 449,
              "y": 0.004182777047007173,
              "label": "epoch 449"
            },
            {
              "x": 450,
              "y": 0.0041796939924671804,
              "label": "epoch 450"
            },
            {
              "x": 451,
              "y": 0.004179652719023197,
              "label": "epoch 451"
            },
            {
              "x": 452,
              "y": 0.004178602235793062,
              "label": "epoch 452"
            },
            {
              "x": 453,
              "y": 0.0041740681802988734,
              "label": "epoch 453"
            },
            {
              "x": 454,
              "y": 0.004180353838340747,
              "label": "epoch 454"
            },
            {
              "x": 455,
              "y": 0.004174635377574687,
              "label": "epoch 455"
            },
            {
              "x": 456,
              "y": 0.00418406169506182,
              "label": "epoch 456"
            },
            {
              "x": 457,
              "y": 0.004185566890794833,
              "label": "epoch 457"
            },
            {
              "x": 458,
              "y": 0.004172732914938885,
              "label": "epoch 458"
            },
            {
              "x": 459,
              "y": 0.004176031646860984,
              "label": "epoch 459"
            },
            {
              "x": 460,
              "y": 0.004169683726152135,
              "label": "epoch 460"
            },
            {
              "x": 461,
              "y": 0.0041735740550824345,
              "label": "epoch 461"
            },
            {
              "x": 462,
              "y": 0.0041780645134215436,
              "label": "epoch 462"
            },
            {
              "x": 463,
              "y": 0.004170525476327289,
              "label": "epoch 463"
            },
            {
              "x": 464,
              "y": 0.00417299372049073,
              "label": "epoch 464"
            },
            {
              "x": 465,
              "y": 0.004174387633515596,
              "label": "epoch 465"
            },
            {
              "x": 466,
              "y": 0.004174723176938163,
              "label": "epoch 466"
            },
            {
              "x": 467,
              "y": 0.004176551352812615,
              "label": "epoch 467"
            },
            {
              "x": 468,
              "y": 0.004173859039024376,
              "label": "epoch 468"
            },
            {
              "x": 469,
              "y": 0.004177159346765716,
              "label": "epoch 469"
            },
            {
              "x": 470,
              "y": 0.0041756758368329,
              "label": "epoch 470"
            },
            {
              "x": 471,
              "y": 0.004176497618333853,
              "label": "epoch 471"
            },
            {
              "x": 472,
              "y": 0.004177502371021546,
              "label": "epoch 472"
            },
            {
              "x": 473,
              "y": 0.004174890870911584,
              "label": "epoch 473"
            },
            {
              "x": 474,
              "y": 0.004174887716209541,
              "label": "epoch 474"
            },
            {
              "x": 475,
              "y": 0.004173819518703232,
              "label": "epoch 475"
            },
            {
              "x": 476,
              "y": 0.004174827025532355,
              "label": "epoch 476"
            },
            {
              "x": 477,
              "y": 0.004174826170415862,
              "label": "epoch 477"
            },
            {
              "x": 478,
              "y": 0.004173443175539815,
              "label": "epoch 478"
            },
            {
              "x": 479,
              "y": 0.004167905149331905,
              "label": "epoch 479"
            },
            {
              "x": 480,
              "y": 0.004172735049858028,
              "label": "epoch 480"
            },
            {
              "x": 481,
              "y": 0.004178099834749254,
              "label": "epoch 481"
            },
            {
              "x": 482,
              "y": 0.004171623726602104,
              "label": "epoch 482"
            },
            {
              "x": 483,
              "y": 0.004173256031016966,
              "label": "epoch 483"
            },
            {
              "x": 484,
              "y": 0.004173276199205583,
              "label": "epoch 484"
            },
            {
              "x": 485,
              "y": 0.004176075613941066,
              "label": "epoch 485"
            },
            {
              "x": 486,
              "y": 0.004172609757102021,
              "label": "epoch 486"
            },
            {
              "x": 487,
              "y": 0.004172811558084122,
              "label": "epoch 487"
            },
            {
              "x": 488,
              "y": 0.004174581296147632,
              "label": "epoch 488"
            },
            {
              "x": 489,
              "y": 0.004178538002107464,
              "label": "epoch 489"
            },
            {
              "x": 490,
              "y": 0.004173545849258325,
              "label": "epoch 490"
            },
            {
              "x": 491,
              "y": 0.004179282673392568,
              "label": "epoch 491"
            },
            {
              "x": 492,
              "y": 0.004169728358024976,
              "label": "epoch 492"
            },
            {
              "x": 493,
              "y": 0.004168466343942687,
              "label": "epoch 493"
            },
            {
              "x": 494,
              "y": 0.004178931436112371,
              "label": "epoch 494"
            },
            {
              "x": 495,
              "y": 0.004166469261690509,
              "label": "epoch 495"
            },
            {
              "x": 496,
              "y": 0.004175285230494889,
              "label": "epoch 496"
            },
            {
              "x": 497,
              "y": 0.004171556137551211,
              "label": "epoch 497"
            },
            {
              "x": 498,
              "y": 0.004166641827109025,
              "label": "epoch 498"
            },
            {
              "x": 499,
              "y": 0.004175552111854286,
              "label": "epoch 499"
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
            },
            {
              "x": 268,
              "y": 0.06353853020405759,
              "label": "epoch 268"
            },
            {
              "x": 269,
              "y": 0.06359141319588066,
              "label": "epoch 269"
            },
            {
              "x": 270,
              "y": 0.06367675607716113,
              "label": "epoch 270"
            },
            {
              "x": 271,
              "y": 0.06379933862014073,
              "label": "epoch 271"
            },
            {
              "x": 272,
              "y": 0.06374322514219737,
              "label": "epoch 272"
            },
            {
              "x": 273,
              "y": 0.06376215040080224,
              "label": "epoch 273"
            },
            {
              "x": 274,
              "y": 0.06371964973196124,
              "label": "epoch 274"
            },
            {
              "x": 275,
              "y": 0.0637857630252639,
              "label": "epoch 275"
            },
            {
              "x": 276,
              "y": 0.06389250513817196,
              "label": "epoch 276"
            },
            {
              "x": 277,
              "y": 0.06386927693950527,
              "label": "epoch 277"
            },
            {
              "x": 278,
              "y": 0.0638366085787359,
              "label": "epoch 278"
            },
            {
              "x": 279,
              "y": 0.06381453191715991,
              "label": "epoch 279"
            },
            {
              "x": 280,
              "y": 0.0638529589144271,
              "label": "epoch 280"
            },
            {
              "x": 281,
              "y": 0.06391081078848067,
              "label": "epoch 281"
            },
            {
              "x": 282,
              "y": 0.06392273022241793,
              "label": "epoch 282"
            },
            {
              "x": 283,
              "y": 0.06380792060946605,
              "label": "epoch 283"
            },
            {
              "x": 284,
              "y": 0.06397317018490867,
              "label": "epoch 284"
            },
            {
              "x": 285,
              "y": 0.06395729645239619,
              "label": "epoch 285"
            },
            {
              "x": 286,
              "y": 0.06390302764454023,
              "label": "epoch 286"
            },
            {
              "x": 287,
              "y": 0.0638844779030861,
              "label": "epoch 287"
            },
            {
              "x": 288,
              "y": 0.0638535515953615,
              "label": "epoch 288"
            },
            {
              "x": 289,
              "y": 0.06390515519294575,
              "label": "epoch 289"
            },
            {
              "x": 290,
              "y": 0.0638196052,
              "label": "epoch 290"
            },
            {
              "x": 291,
              "y": 0.06373411363127066,
              "label": "epoch 291"
            },
            {
              "x": 292,
              "y": 0.06375522422948914,
              "label": "epoch 292"
            },
            {
              "x": 293,
              "y": 0.06368828399047886,
              "label": "epoch 293"
            },
            {
              "x": 294,
              "y": 0.06367871932257242,
              "label": "epoch 294"
            },
            {
              "x": 295,
              "y": 0.06368970179698265,
              "label": "epoch 295"
            },
            {
              "x": 296,
              "y": 0.06372340524218376,
              "label": "epoch 296"
            },
            {
              "x": 297,
              "y": 0.06362992487457202,
              "label": "epoch 297"
            },
            {
              "x": 298,
              "y": 0.06363135109801844,
              "label": "epoch 298"
            },
            {
              "x": 299,
              "y": 0.0635794792966695,
              "label": "epoch 299"
            },
            {
              "x": 300,
              "y": 0.06355039233006353,
              "label": "epoch 300"
            },
            {
              "x": 301,
              "y": 0.06364048701671939,
              "label": "epoch 301"
            },
            {
              "x": 302,
              "y": 0.06364628889882863,
              "label": "epoch 302"
            },
            {
              "x": 303,
              "y": 0.06363429413460453,
              "label": "epoch 303"
            },
            {
              "x": 304,
              "y": 0.06362649247067136,
              "label": "epoch 304"
            },
            {
              "x": 305,
              "y": 0.0636359618154912,
              "label": "epoch 305"
            },
            {
              "x": 306,
              "y": 0.06373712980099586,
              "label": "epoch 306"
            },
            {
              "x": 307,
              "y": 0.06358837356885105,
              "label": "epoch 307"
            },
            {
              "x": 308,
              "y": 0.0635765903919635,
              "label": "epoch 308"
            },
            {
              "x": 309,
              "y": 0.0636266548769383,
              "label": "epoch 309"
            },
            {
              "x": 310,
              "y": 0.06362888773429931,
              "label": "epoch 310"
            },
            {
              "x": 311,
              "y": 0.06362603000697593,
              "label": "epoch 311"
            },
            {
              "x": 312,
              "y": 0.06370034705469152,
              "label": "epoch 312"
            },
            {
              "x": 313,
              "y": 0.06365426684696056,
              "label": "epoch 313"
            },
            {
              "x": 314,
              "y": 0.06359574262464057,
              "label": "epoch 314"
            },
            {
              "x": 315,
              "y": 0.06359608819126918,
              "label": "epoch 315"
            },
            {
              "x": 316,
              "y": 0.06374705245482466,
              "label": "epoch 316"
            },
            {
              "x": 317,
              "y": 0.06367883168039905,
              "label": "epoch 317"
            },
            {
              "x": 318,
              "y": 0.06368039113505419,
              "label": "epoch 318"
            },
            {
              "x": 319,
              "y": 0.06373951486717774,
              "label": "epoch 319"
            },
            {
              "x": 320,
              "y": 0.06374251005150941,
              "label": "epoch 320"
            },
            {
              "x": 321,
              "y": 0.06374710343477905,
              "label": "epoch 321"
            },
            {
              "x": 322,
              "y": 0.06373904164368134,
              "label": "epoch 322"
            },
            {
              "x": 323,
              "y": 0.06373902997764067,
              "label": "epoch 323"
            },
            {
              "x": 324,
              "y": 0.06376551854421116,
              "label": "epoch 324"
            },
            {
              "x": 325,
              "y": 0.06376858327961313,
              "label": "epoch 325"
            },
            {
              "x": 326,
              "y": 0.06376800301261124,
              "label": "epoch 326"
            },
            {
              "x": 327,
              "y": 0.06384941139721807,
              "label": "epoch 327"
            },
            {
              "x": 328,
              "y": 0.06384133767354988,
              "label": "epoch 328"
            },
            {
              "x": 329,
              "y": 0.063855377477969,
              "label": "epoch 329"
            },
            {
              "x": 330,
              "y": 0.06386332351853764,
              "label": "epoch 330"
            },
            {
              "x": 331,
              "y": 0.06388931407165824,
              "label": "epoch 331"
            },
            {
              "x": 332,
              "y": 0.06389978741533828,
              "label": "epoch 332"
            },
            {
              "x": 333,
              "y": 0.0639105079629333,
              "label": "epoch 333"
            },
            {
              "x": 334,
              "y": 0.06388097519964886,
              "label": "epoch 334"
            },
            {
              "x": 335,
              "y": 0.06390258074373521,
              "label": "epoch 335"
            },
            {
              "x": 336,
              "y": 0.06389646898012295,
              "label": "epoch 336"
            },
            {
              "x": 337,
              "y": 0.06383631319113192,
              "label": "epoch 337"
            },
            {
              "x": 338,
              "y": 0.0638830526657234,
              "label": "epoch 338"
            },
            {
              "x": 339,
              "y": 0.06383765688243377,
              "label": "epoch 339"
            },
            {
              "x": 340,
              "y": 0.06388947560021495,
              "label": "epoch 340"
            },
            {
              "x": 341,
              "y": 0.06388428592962507,
              "label": "epoch 341"
            },
            {
              "x": 342,
              "y": 0.06393223891599949,
              "label": "epoch 342"
            },
            {
              "x": 343,
              "y": 0.06388714350798277,
              "label": "epoch 343"
            },
            {
              "x": 344,
              "y": 0.06386747969793903,
              "label": "epoch 344"
            },
            {
              "x": 345,
              "y": 0.06390190637102933,
              "label": "epoch 345"
            },
            {
              "x": 346,
              "y": 0.0638501308073357,
              "label": "epoch 346"
            },
            {
              "x": 347,
              "y": 0.0638508626631703,
              "label": "epoch 347"
            },
            {
              "x": 348,
              "y": 0.06383512777182132,
              "label": "epoch 348"
            },
            {
              "x": 349,
              "y": 0.06386335996495818,
              "label": "epoch 349"
            },
            {
              "x": 350,
              "y": 0.06384519188539248,
              "label": "epoch 350"
            },
            {
              "x": 351,
              "y": 0.0638117135447254,
              "label": "epoch 351"
            },
            {
              "x": 352,
              "y": 0.06389877478144818,
              "label": "epoch 352"
            },
            {
              "x": 353,
              "y": 0.0638709271040984,
              "label": "epoch 353"
            },
            {
              "x": 354,
              "y": 0.0638025484900266,
              "label": "epoch 354"
            },
            {
              "x": 355,
              "y": 0.06385675284093993,
              "label": "epoch 355"
            },
            {
              "x": 356,
              "y": 0.06385097279646863,
              "label": "epoch 356"
            },
            {
              "x": 357,
              "y": 0.06393816864300261,
              "label": "epoch 357"
            },
            {
              "x": 358,
              "y": 0.06389123750130621,
              "label": "epoch 358"
            },
            {
              "x": 359,
              "y": 0.06390481983965544,
              "label": "epoch 359"
            },
            {
              "x": 360,
              "y": 0.0639391595667755,
              "label": "epoch 360"
            },
            {
              "x": 361,
              "y": 0.06394200941079027,
              "label": "epoch 361"
            },
            {
              "x": 362,
              "y": 0.06393558834756013,
              "label": "epoch 362"
            },
            {
              "x": 363,
              "y": 0.06396233739054112,
              "label": "epoch 363"
            },
            {
              "x": 364,
              "y": 0.06392884890546587,
              "label": "epoch 364"
            },
            {
              "x": 365,
              "y": 0.0638887383100059,
              "label": "epoch 365"
            },
            {
              "x": 366,
              "y": 0.06388320930024124,
              "label": "epoch 366"
            },
            {
              "x": 367,
              "y": 0.06389811484194452,
              "label": "epoch 367"
            },
            {
              "x": 368,
              "y": 0.06386639233670921,
              "label": "epoch 368"
            },
            {
              "x": 369,
              "y": 0.06385790247192122,
              "label": "epoch 369"
            },
            {
              "x": 370,
              "y": 0.0638560984560555,
              "label": "epoch 370"
            },
            {
              "x": 371,
              "y": 0.0638303710199436,
              "label": "epoch 371"
            },
            {
              "x": 372,
              "y": 0.0638534148818412,
              "label": "epoch 372"
            },
            {
              "x": 373,
              "y": 0.06388059244292028,
              "label": "epoch 373"
            },
            {
              "x": 374,
              "y": 0.06385267137451783,
              "label": "epoch 374"
            },
            {
              "x": 375,
              "y": 0.0638803727922909,
              "label": "epoch 375"
            },
            {
              "x": 376,
              "y": 0.06391217893848845,
              "label": "epoch 376"
            },
            {
              "x": 377,
              "y": 0.06388730516635788,
              "label": "epoch 377"
            },
            {
              "x": 378,
              "y": 0.06390903524688359,
              "label": "epoch 378"
            },
            {
              "x": 379,
              "y": 0.06395567580540573,
              "label": "epoch 379"
            },
            {
              "x": 380,
              "y": 0.0639365609410896,
              "label": "epoch 380"
            },
            {
              "x": 381,
              "y": 0.06392148083499419,
              "label": "epoch 381"
            },
            {
              "x": 382,
              "y": 0.0639195529185695,
              "label": "epoch 382"
            },
            {
              "x": 383,
              "y": 0.0639316686842664,
              "label": "epoch 383"
            },
            {
              "x": 384,
              "y": 0.06394847345750589,
              "label": "epoch 384"
            },
            {
              "x": 385,
              "y": 0.0638861038839279,
              "label": "epoch 385"
            },
            {
              "x": 386,
              "y": 0.06392340847416658,
              "label": "epoch 386"
            },
            {
              "x": 387,
              "y": 0.06388888333075508,
              "label": "epoch 387"
            },
            {
              "x": 388,
              "y": 0.06389904096584742,
              "label": "epoch 388"
            },
            {
              "x": 389,
              "y": 0.06389636019268533,
              "label": "epoch 389"
            },
            {
              "x": 390,
              "y": 0.06397170080986382,
              "label": "epoch 390"
            },
            {
              "x": 391,
              "y": 0.06394636926377548,
              "label": "epoch 391"
            },
            {
              "x": 392,
              "y": 0.06399554078559863,
              "label": "epoch 392"
            },
            {
              "x": 393,
              "y": 0.06400055824173921,
              "label": "epoch 393"
            },
            {
              "x": 394,
              "y": 0.06397158572814844,
              "label": "epoch 394"
            },
            {
              "x": 395,
              "y": 0.06398872125723037,
              "label": "epoch 395"
            },
            {
              "x": 396,
              "y": 0.06398229340304265,
              "label": "epoch 396"
            },
            {
              "x": 397,
              "y": 0.06394045088764917,
              "label": "epoch 397"
            },
            {
              "x": 398,
              "y": 0.06394033757265118,
              "label": "epoch 398"
            },
            {
              "x": 399,
              "y": 0.06394844067242382,
              "label": "epoch 399"
            },
            {
              "x": 400,
              "y": 0.06391492881793008,
              "label": "epoch 400"
            },
            {
              "x": 401,
              "y": 0.0638961666451283,
              "label": "epoch 401"
            },
            {
              "x": 402,
              "y": 0.06396747996941006,
              "label": "epoch 402"
            },
            {
              "x": 403,
              "y": 0.06394145202227121,
              "label": "epoch 403"
            },
            {
              "x": 404,
              "y": 0.06398421868135828,
              "label": "epoch 404"
            },
            {
              "x": 405,
              "y": 0.0640268118915724,
              "label": "epoch 405"
            },
            {
              "x": 406,
              "y": 0.06403213262283795,
              "label": "epoch 406"
            },
            {
              "x": 407,
              "y": 0.0640223499706879,
              "label": "epoch 407"
            },
            {
              "x": 408,
              "y": 0.06404023665948587,
              "label": "epoch 408"
            },
            {
              "x": 409,
              "y": 0.06398026281960101,
              "label": "epoch 409"
            },
            {
              "x": 410,
              "y": 0.0639733174759481,
              "label": "epoch 410"
            },
            {
              "x": 411,
              "y": 0.06400023417958628,
              "label": "epoch 411"
            },
            {
              "x": 412,
              "y": 0.06399039867832662,
              "label": "epoch 412"
            },
            {
              "x": 413,
              "y": 0.06401204964200397,
              "label": "epoch 413"
            },
            {
              "x": 414,
              "y": 0.06399952007862005,
              "label": "epoch 414"
            },
            {
              "x": 415,
              "y": 0.0640578965337083,
              "label": "epoch 415"
            },
            {
              "x": 416,
              "y": 0.06400660533912933,
              "label": "epoch 416"
            },
            {
              "x": 417,
              "y": 0.06407306847713219,
              "label": "epoch 417"
            },
            {
              "x": 418,
              "y": 0.06402397836504142,
              "label": "epoch 418"
            },
            {
              "x": 419,
              "y": 0.06404818695514941,
              "label": "epoch 419"
            },
            {
              "x": 420,
              "y": 0.06400775370811491,
              "label": "epoch 420"
            },
            {
              "x": 421,
              "y": 0.06399231224809467,
              "label": "epoch 421"
            },
            {
              "x": 422,
              "y": 0.06404711153970168,
              "label": "epoch 422"
            },
            {
              "x": 423,
              "y": 0.06408853245260329,
              "label": "epoch 423"
            },
            {
              "x": 424,
              "y": 0.06410634352141642,
              "label": "epoch 424"
            },
            {
              "x": 425,
              "y": 0.06405639709364071,
              "label": "epoch 425"
            },
            {
              "x": 426,
              "y": 0.06405134320984392,
              "label": "epoch 426"
            },
            {
              "x": 427,
              "y": 0.06405141575171576,
              "label": "epoch 427"
            },
            {
              "x": 428,
              "y": 0.06407244963798132,
              "label": "epoch 428"
            },
            {
              "x": 429,
              "y": 0.06405442534225203,
              "label": "epoch 429"
            },
            {
              "x": 430,
              "y": 0.06398938733649343,
              "label": "epoch 430"
            },
            {
              "x": 431,
              "y": 0.0640017737320082,
              "label": "epoch 431"
            },
            {
              "x": 432,
              "y": 0.06394755744680113,
              "label": "epoch 432"
            },
            {
              "x": 433,
              "y": 0.0639813187733939,
              "label": "epoch 433"
            },
            {
              "x": 434,
              "y": 0.06393848444790101,
              "label": "epoch 434"
            },
            {
              "x": 435,
              "y": 0.06393786950847195,
              "label": "epoch 435"
            },
            {
              "x": 436,
              "y": 0.06390489792159458,
              "label": "epoch 436"
            },
            {
              "x": 437,
              "y": 0.06392320088228812,
              "label": "epoch 437"
            },
            {
              "x": 438,
              "y": 0.06392171140492121,
              "label": "epoch 438"
            },
            {
              "x": 439,
              "y": 0.06394234987486638,
              "label": "epoch 439"
            },
            {
              "x": 440,
              "y": 0.06392172281343128,
              "label": "epoch 440"
            },
            {
              "x": 441,
              "y": 0.06390038203971926,
              "label": "epoch 441"
            },
            {
              "x": 442,
              "y": 0.06387626510465787,
              "label": "epoch 442"
            },
            {
              "x": 443,
              "y": 0.06388064177793383,
              "label": "epoch 443"
            },
            {
              "x": 444,
              "y": 0.06389928159708354,
              "label": "epoch 444"
            },
            {
              "x": 445,
              "y": 0.06390079472916305,
              "label": "epoch 445"
            },
            {
              "x": 446,
              "y": 0.06392417533176117,
              "label": "epoch 446"
            },
            {
              "x": 447,
              "y": 0.06392044399916286,
              "label": "epoch 447"
            },
            {
              "x": 448,
              "y": 0.06391271709588564,
              "label": "epoch 448"
            },
            {
              "x": 449,
              "y": 0.06391613102153458,
              "label": "epoch 449"
            },
            {
              "x": 450,
              "y": 0.0638956973416498,
              "label": "epoch 450"
            },
            {
              "x": 451,
              "y": 0.06386253583102523,
              "label": "epoch 451"
            },
            {
              "x": 452,
              "y": 0.06387183962751326,
              "label": "epoch 452"
            },
            {
              "x": 453,
              "y": 0.06384251897543436,
              "label": "epoch 453"
            },
            {
              "x": 454,
              "y": 0.06385341743283023,
              "label": "epoch 454"
            },
            {
              "x": 455,
              "y": 0.0638482231948537,
              "label": "epoch 455"
            },
            {
              "x": 456,
              "y": 0.06383793301632211,
              "label": "epoch 456"
            },
            {
              "x": 457,
              "y": 0.06383116933763008,
              "label": "epoch 457"
            },
            {
              "x": 458,
              "y": 0.06384203863337079,
              "label": "epoch 458"
            },
            {
              "x": 459,
              "y": 0.0637832145473926,
              "label": "epoch 459"
            },
            {
              "x": 460,
              "y": 0.0638232279467813,
              "label": "epoch 460"
            },
            {
              "x": 461,
              "y": 0.06382107387999943,
              "label": "epoch 461"
            },
            {
              "x": 462,
              "y": 0.06378871790519425,
              "label": "epoch 462"
            },
            {
              "x": 463,
              "y": 0.06381528751195506,
              "label": "epoch 463"
            },
            {
              "x": 464,
              "y": 0.06382914002939574,
              "label": "epoch 464"
            },
            {
              "x": 465,
              "y": 0.06382642987649122,
              "label": "epoch 465"
            },
            {
              "x": 466,
              "y": 0.06384602517745837,
              "label": "epoch 466"
            },
            {
              "x": 467,
              "y": 0.06385231503449368,
              "label": "epoch 467"
            },
            {
              "x": 468,
              "y": 0.06380455976996975,
              "label": "epoch 468"
            },
            {
              "x": 469,
              "y": 0.06383014221328746,
              "label": "epoch 469"
            },
            {
              "x": 470,
              "y": 0.06382320528179039,
              "label": "epoch 470"
            },
            {
              "x": 471,
              "y": 0.06385896747949453,
              "label": "epoch 471"
            },
            {
              "x": 472,
              "y": 0.06384078181068426,
              "label": "epoch 472"
            },
            {
              "x": 473,
              "y": 0.06380512243374956,
              "label": "epoch 473"
            },
            {
              "x": 474,
              "y": 0.06383493739562446,
              "label": "epoch 474"
            },
            {
              "x": 475,
              "y": 0.06380935575936364,
              "label": "epoch 475"
            },
            {
              "x": 476,
              "y": 0.0637854222385565,
              "label": "epoch 476"
            },
            {
              "x": 477,
              "y": 0.06381961045860264,
              "label": "epoch 477"
            },
            {
              "x": 478,
              "y": 0.06381019586019408,
              "label": "epoch 478"
            },
            {
              "x": 479,
              "y": 0.06379957136308995,
              "label": "epoch 479"
            },
            {
              "x": 480,
              "y": 0.06380150341283297,
              "label": "epoch 480"
            },
            {
              "x": 481,
              "y": 0.06380752650894513,
              "label": "epoch 481"
            },
            {
              "x": 482,
              "y": 0.06381339288667445,
              "label": "epoch 482"
            },
            {
              "x": 483,
              "y": 0.06379708529091563,
              "label": "epoch 483"
            },
            {
              "x": 484,
              "y": 0.0637472163675978,
              "label": "epoch 484"
            },
            {
              "x": 485,
              "y": 0.06378694637226688,
              "label": "epoch 485"
            },
            {
              "x": 486,
              "y": 0.06381101279877935,
              "label": "epoch 486"
            },
            {
              "x": 487,
              "y": 0.06381274687086452,
              "label": "epoch 487"
            },
            {
              "x": 488,
              "y": 0.06379194369391801,
              "label": "epoch 488"
            },
            {
              "x": 489,
              "y": 0.06380039249377564,
              "label": "epoch 489"
            },
            {
              "x": 490,
              "y": 0.06382712627830762,
              "label": "epoch 490"
            },
            {
              "x": 491,
              "y": 0.06378801493720905,
              "label": "epoch 491"
            },
            {
              "x": 492,
              "y": 0.06380467464202268,
              "label": "epoch 492"
            },
            {
              "x": 493,
              "y": 0.06377689514403373,
              "label": "epoch 493"
            },
            {
              "x": 494,
              "y": 0.0638270361339796,
              "label": "epoch 494"
            },
            {
              "x": 495,
              "y": 0.06381811746369319,
              "label": "epoch 495"
            },
            {
              "x": 496,
              "y": 0.06380807218872513,
              "label": "epoch 496"
            },
            {
              "x": 497,
              "y": 0.06380706115056742,
              "label": "epoch 497"
            },
            {
              "x": 498,
              "y": 0.06380123507781384,
              "label": "epoch 498"
            },
            {
              "x": 499,
              "y": 0.06380291511787188,
              "label": "epoch 499"
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
            },
            {
              "x": 268,
              "y": 0.0650382274640181,
              "label": "epoch 268"
            },
            {
              "x": 269,
              "y": 0.06468832858107619,
              "label": "epoch 269"
            },
            {
              "x": 270,
              "y": 0.06512799429922504,
              "label": "epoch 270"
            },
            {
              "x": 271,
              "y": 0.06456814224138964,
              "label": "epoch 271"
            },
            {
              "x": 272,
              "y": 0.06517859934787396,
              "label": "epoch 272"
            },
            {
              "x": 273,
              "y": 0.06479620329563013,
              "label": "epoch 273"
            },
            {
              "x": 274,
              "y": 0.0650267424038439,
              "label": "epoch 274"
            },
            {
              "x": 275,
              "y": 0.06515101485998505,
              "label": "epoch 275"
            },
            {
              "x": 276,
              "y": 0.06508600944273499,
              "label": "epoch 276"
            },
            {
              "x": 277,
              "y": 0.06488112533902479,
              "label": "epoch 277"
            },
            {
              "x": 278,
              "y": 0.06517236390404653,
              "label": "epoch 278"
            },
            {
              "x": 279,
              "y": 0.0651241480614498,
              "label": "epoch 279"
            },
            {
              "x": 280,
              "y": 0.06506917448218162,
              "label": "epoch 280"
            },
            {
              "x": 281,
              "y": 0.06527863090140104,
              "label": "epoch 281"
            },
            {
              "x": 282,
              "y": 0.06462187242807342,
              "label": "epoch 282"
            },
            {
              "x": 283,
              "y": 0.06496739244743828,
              "label": "epoch 283"
            },
            {
              "x": 284,
              "y": 0.06511081481042275,
              "label": "epoch 284"
            },
            {
              "x": 285,
              "y": 0.06511882474957306,
              "label": "epoch 285"
            },
            {
              "x": 286,
              "y": 0.06463698352573481,
              "label": "epoch 286"
            },
            {
              "x": 287,
              "y": 0.0648226385436601,
              "label": "epoch 287"
            },
            {
              "x": 288,
              "y": 0.06535720336275792,
              "label": "epoch 288"
            },
            {
              "x": 289,
              "y": 0.0649255531824906,
              "label": "epoch 289"
            },
            {
              "x": 290,
              "y": 0.06511889626292905,
              "label": "epoch 290"
            },
            {
              "x": 291,
              "y": 0.0649374549749741,
              "label": "epoch 291"
            },
            {
              "x": 292,
              "y": 0.06525415568365875,
              "label": "epoch 292"
            },
            {
              "x": 293,
              "y": 0.06492967090601771,
              "label": "epoch 293"
            },
            {
              "x": 294,
              "y": 0.06466463068847504,
              "label": "epoch 294"
            },
            {
              "x": 295,
              "y": 0.06493405561866139,
              "label": "epoch 295"
            },
            {
              "x": 296,
              "y": 0.064843950823672,
              "label": "epoch 296"
            },
            {
              "x": 297,
              "y": 0.06513539621992274,
              "label": "epoch 297"
            },
            {
              "x": 298,
              "y": 0.06518049355437788,
              "label": "epoch 298"
            },
            {
              "x": 299,
              "y": 0.06498432345154165,
              "label": "epoch 299"
            },
            {
              "x": 300,
              "y": 0.06503707189366244,
              "label": "epoch 300"
            },
            {
              "x": 301,
              "y": 0.06490477081514039,
              "label": "epoch 301"
            },
            {
              "x": 302,
              "y": 0.06536619881879795,
              "label": "epoch 302"
            },
            {
              "x": 303,
              "y": 0.06548446104277535,
              "label": "epoch 303"
            },
            {
              "x": 304,
              "y": 0.0650437580735585,
              "label": "epoch 304"
            },
            {
              "x": 305,
              "y": 0.06534426844172153,
              "label": "epoch 305"
            },
            {
              "x": 306,
              "y": 0.06518090349678567,
              "label": "epoch 306"
            },
            {
              "x": 307,
              "y": 0.06520888927461761,
              "label": "epoch 307"
            },
            {
              "x": 308,
              "y": 0.06537873780680875,
              "label": "epoch 308"
            },
            {
              "x": 309,
              "y": 0.06540076854722536,
              "label": "epoch 309"
            },
            {
              "x": 310,
              "y": 0.06530786077287849,
              "label": "epoch 310"
            },
            {
              "x": 311,
              "y": 0.06532216334245863,
              "label": "epoch 311"
            },
            {
              "x": 312,
              "y": 0.06533711189175799,
              "label": "epoch 312"
            },
            {
              "x": 313,
              "y": 0.06508706458058848,
              "label": "epoch 313"
            },
            {
              "x": 314,
              "y": 0.06508218703717268,
              "label": "epoch 314"
            },
            {
              "x": 315,
              "y": 0.06589161235160645,
              "label": "epoch 315"
            },
            {
              "x": 316,
              "y": 0.0653591665812374,
              "label": "epoch 316"
            },
            {
              "x": 317,
              "y": 0.06560906213624289,
              "label": "epoch 317"
            },
            {
              "x": 318,
              "y": 0.06546817385650397,
              "label": "epoch 318"
            },
            {
              "x": 319,
              "y": 0.06524086835765418,
              "label": "epoch 319"
            },
            {
              "x": 320,
              "y": 0.06535521627282485,
              "label": "epoch 320"
            },
            {
              "x": 321,
              "y": 0.06546869069005218,
              "label": "epoch 321"
            },
            {
              "x": 322,
              "y": 0.06491964929733217,
              "label": "epoch 322"
            },
            {
              "x": 323,
              "y": 0.06543704254798137,
              "label": "epoch 323"
            },
            {
              "x": 324,
              "y": 0.065032438596247,
              "label": "epoch 324"
            },
            {
              "x": 325,
              "y": 0.06508541474666099,
              "label": "epoch 325"
            },
            {
              "x": 326,
              "y": 0.065681399419448,
              "label": "epoch 326"
            },
            {
              "x": 327,
              "y": 0.06523014561705502,
              "label": "epoch 327"
            },
            {
              "x": 328,
              "y": 0.06548711433832691,
              "label": "epoch 328"
            },
            {
              "x": 329,
              "y": 0.06562052516492738,
              "label": "epoch 329"
            },
            {
              "x": 330,
              "y": 0.06573016292589716,
              "label": "epoch 330"
            },
            {
              "x": 331,
              "y": 0.0653089867989132,
              "label": "epoch 331"
            },
            {
              "x": 332,
              "y": 0.06552577532485471,
              "label": "epoch 332"
            },
            {
              "x": 333,
              "y": 0.0649975418727437,
              "label": "epoch 333"
            },
            {
              "x": 334,
              "y": 0.06558986106200923,
              "label": "epoch 334"
            },
            {
              "x": 335,
              "y": 0.06539647770777815,
              "label": "epoch 335"
            },
            {
              "x": 336,
              "y": 0.06515758755572308,
              "label": "epoch 336"
            },
            {
              "x": 337,
              "y": 0.0656168227809321,
              "label": "epoch 337"
            },
            {
              "x": 338,
              "y": 0.06543141900622111,
              "label": "epoch 338"
            },
            {
              "x": 339,
              "y": 0.06546422712953197,
              "label": "epoch 339"
            },
            {
              "x": 340,
              "y": 0.06553068741745817,
              "label": "epoch 340"
            },
            {
              "x": 341,
              "y": 0.06561161017938993,
              "label": "epoch 341"
            },
            {
              "x": 342,
              "y": 0.06562139402914406,
              "label": "epoch 342"
            },
            {
              "x": 343,
              "y": 0.06551153570735162,
              "label": "epoch 343"
            },
            {
              "x": 344,
              "y": 0.06591086246054165,
              "label": "epoch 344"
            },
            {
              "x": 345,
              "y": 0.06590165108768381,
              "label": "epoch 345"
            },
            {
              "x": 346,
              "y": 0.06579695967329706,
              "label": "epoch 346"
            },
            {
              "x": 347,
              "y": 0.06571467185710694,
              "label": "epoch 347"
            },
            {
              "x": 348,
              "y": 0.06563434238634464,
              "label": "epoch 348"
            },
            {
              "x": 349,
              "y": 0.06548259062707391,
              "label": "epoch 349"
            },
            {
              "x": 350,
              "y": 0.06583159398698475,
              "label": "epoch 350"
            },
            {
              "x": 351,
              "y": 0.06550513153243735,
              "label": "epoch 351"
            },
            {
              "x": 352,
              "y": 0.06577978257124073,
              "label": "epoch 352"
            },
            {
              "x": 353,
              "y": 0.06550934710401628,
              "label": "epoch 353"
            },
            {
              "x": 354,
              "y": 0.06576054788301333,
              "label": "epoch 354"
            },
            {
              "x": 355,
              "y": 0.06581501304502972,
              "label": "epoch 355"
            },
            {
              "x": 356,
              "y": 0.06586913154569554,
              "label": "epoch 356"
            },
            {
              "x": 357,
              "y": 0.06568614273691172,
              "label": "epoch 357"
            },
            {
              "x": 358,
              "y": 0.06582136499578739,
              "label": "epoch 358"
            },
            {
              "x": 359,
              "y": 0.06611103220209943,
              "label": "epoch 359"
            },
            {
              "x": 360,
              "y": 0.06603325592152637,
              "label": "epoch 360"
            },
            {
              "x": 361,
              "y": 0.06585438168911806,
              "label": "epoch 361"
            },
            {
              "x": 362,
              "y": 0.06549511789883711,
              "label": "epoch 362"
            },
            {
              "x": 363,
              "y": 0.0657530364959275,
              "label": "epoch 363"
            },
            {
              "x": 364,
              "y": 0.06587106797208339,
              "label": "epoch 364"
            },
            {
              "x": 365,
              "y": 0.06576827961549127,
              "label": "epoch 365"
            },
            {
              "x": 366,
              "y": 0.06580476937817013,
              "label": "epoch 366"
            },
            {
              "x": 367,
              "y": 0.06623587483820502,
              "label": "epoch 367"
            },
            {
              "x": 368,
              "y": 0.06633208953820563,
              "label": "epoch 368"
            },
            {
              "x": 369,
              "y": 0.06582102487332452,
              "label": "epoch 369"
            },
            {
              "x": 370,
              "y": 0.06603865593423731,
              "label": "epoch 370"
            },
            {
              "x": 371,
              "y": 0.06604220640022468,
              "label": "epoch 371"
            },
            {
              "x": 372,
              "y": 0.06582644118511301,
              "label": "epoch 372"
            },
            {
              "x": 373,
              "y": 0.06591923912710747,
              "label": "epoch 373"
            },
            {
              "x": 374,
              "y": 0.06617651441727078,
              "label": "epoch 374"
            },
            {
              "x": 375,
              "y": 0.06585176614898065,
              "label": "epoch 375"
            },
            {
              "x": 376,
              "y": 0.06594251049688593,
              "label": "epoch 376"
            },
            {
              "x": 377,
              "y": 0.06627139321668994,
              "label": "epoch 377"
            },
            {
              "x": 378,
              "y": 0.06624931748674619,
              "label": "epoch 378"
            },
            {
              "x": 379,
              "y": 0.06568915803852686,
              "label": "epoch 379"
            },
            {
              "x": 380,
              "y": 0.0659965612940702,
              "label": "epoch 380"
            },
            {
              "x": 381,
              "y": 0.06578249648665828,
              "label": "epoch 381"
            },
            {
              "x": 382,
              "y": 0.06621368531736793,
              "label": "epoch 382"
            },
            {
              "x": 383,
              "y": 0.0660050602178824,
              "label": "epoch 383"
            },
            {
              "x": 384,
              "y": 0.06627468063955626,
              "label": "epoch 384"
            },
            {
              "x": 385,
              "y": 0.06598829823653468,
              "label": "epoch 385"
            },
            {
              "x": 386,
              "y": 0.06586397737049915,
              "label": "epoch 386"
            },
            {
              "x": 387,
              "y": 0.066112382022608,
              "label": "epoch 387"
            },
            {
              "x": 388,
              "y": 0.06621400162164773,
              "label": "epoch 388"
            },
            {
              "x": 389,
              "y": 0.06606210815335083,
              "label": "epoch 389"
            },
            {
              "x": 390,
              "y": 0.06591273020202387,
              "label": "epoch 390"
            },
            {
              "x": 391,
              "y": 0.06579871954761829,
              "label": "epoch 391"
            },
            {
              "x": 392,
              "y": 0.0657987580502919,
              "label": "epoch 392"
            },
            {
              "x": 393,
              "y": 0.06592653802641547,
              "label": "epoch 393"
            },
            {
              "x": 394,
              "y": 0.0662435904220084,
              "label": "epoch 394"
            },
            {
              "x": 395,
              "y": 0.06592972335184075,
              "label": "epoch 395"
            },
            {
              "x": 396,
              "y": 0.06591018367351496,
              "label": "epoch 396"
            },
            {
              "x": 397,
              "y": 0.0659805340633886,
              "label": "epoch 397"
            },
            {
              "x": 398,
              "y": 0.06596540464871443,
              "label": "epoch 398"
            },
            {
              "x": 399,
              "y": 0.0662517816599042,
              "label": "epoch 399"
            },
            {
              "x": 400,
              "y": 0.06575939619174533,
              "label": "epoch 400"
            },
            {
              "x": 401,
              "y": 0.0657409173015169,
              "label": "epoch 401"
            },
            {
              "x": 402,
              "y": 0.06588795628095985,
              "label": "epoch 402"
            },
            {
              "x": 403,
              "y": 0.06582902118679843,
              "label": "epoch 403"
            },
            {
              "x": 404,
              "y": 0.06591409941428894,
              "label": "epoch 404"
            },
            {
              "x": 405,
              "y": 0.06605286119793088,
              "label": "epoch 405"
            },
            {
              "x": 406,
              "y": 0.0661290396368555,
              "label": "epoch 406"
            },
            {
              "x": 407,
              "y": 0.06578205709735242,
              "label": "epoch 407"
            },
            {
              "x": 408,
              "y": 0.06610959718035608,
              "label": "epoch 408"
            },
            {
              "x": 409,
              "y": 0.06607016544332785,
              "label": "epoch 409"
            },
            {
              "x": 410,
              "y": 0.06634532678305498,
              "label": "epoch 410"
            },
            {
              "x": 411,
              "y": 0.06612830538724823,
              "label": "epoch 411"
            },
            {
              "x": 412,
              "y": 0.06615902101829774,
              "label": "epoch 412"
            },
            {
              "x": 413,
              "y": 0.06624363870821301,
              "label": "epoch 413"
            },
            {
              "x": 414,
              "y": 0.06601648738749931,
              "label": "epoch 414"
            },
            {
              "x": 415,
              "y": 0.06609914586299974,
              "label": "epoch 415"
            },
            {
              "x": 416,
              "y": 0.06622685760538168,
              "label": "epoch 416"
            },
            {
              "x": 417,
              "y": 0.0662149646757451,
              "label": "epoch 417"
            },
            {
              "x": 418,
              "y": 0.06612170242522397,
              "label": "epoch 418"
            },
            {
              "x": 419,
              "y": 0.06605152819455602,
              "label": "epoch 419"
            },
            {
              "x": 420,
              "y": 0.06642201956821032,
              "label": "epoch 420"
            },
            {
              "x": 421,
              "y": 0.06606795985453685,
              "label": "epoch 421"
            },
            {
              "x": 422,
              "y": 0.06665837832937134,
              "label": "epoch 422"
            },
            {
              "x": 423,
              "y": 0.06614411404390845,
              "label": "epoch 423"
            },
            {
              "x": 424,
              "y": 0.06586749120234751,
              "label": "epoch 424"
            },
            {
              "x": 425,
              "y": 0.06656594983608581,
              "label": "epoch 425"
            },
            {
              "x": 426,
              "y": 0.0659593303241911,
              "label": "epoch 426"
            },
            {
              "x": 427,
              "y": 0.0663566712807258,
              "label": "epoch 427"
            },
            {
              "x": 428,
              "y": 0.0664914586539217,
              "label": "epoch 428"
            },
            {
              "x": 429,
              "y": 0.06665215516064536,
              "label": "epoch 429"
            },
            {
              "x": 430,
              "y": 0.0663324603525287,
              "label": "epoch 430"
            },
            {
              "x": 431,
              "y": 0.06660532511908214,
              "label": "epoch 431"
            },
            {
              "x": 432,
              "y": 0.06667174685660159,
              "label": "epoch 432"
            },
            {
              "x": 433,
              "y": 0.06667109314080785,
              "label": "epoch 433"
            },
            {
              "x": 434,
              "y": 0.06658365711061152,
              "label": "epoch 434"
            },
            {
              "x": 435,
              "y": 0.0666058276388638,
              "label": "epoch 435"
            },
            {
              "x": 436,
              "y": 0.06678521832621735,
              "label": "epoch 436"
            },
            {
              "x": 437,
              "y": 0.06637913921548078,
              "label": "epoch 437"
            },
            {
              "x": 438,
              "y": 0.06669251744791127,
              "label": "epoch 438"
            },
            {
              "x": 439,
              "y": 0.06698952646196107,
              "label": "epoch 439"
            },
            {
              "x": 440,
              "y": 0.06640285900021699,
              "label": "epoch 440"
            },
            {
              "x": 441,
              "y": 0.06661802105059778,
              "label": "epoch 441"
            },
            {
              "x": 442,
              "y": 0.06657900335612958,
              "label": "epoch 442"
            },
            {
              "x": 443,
              "y": 0.06696480859770809,
              "label": "epoch 443"
            },
            {
              "x": 444,
              "y": 0.06685514266773901,
              "label": "epoch 444"
            },
            {
              "x": 445,
              "y": 0.06656094087014025,
              "label": "epoch 445"
            },
            {
              "x": 446,
              "y": 0.06658549870910328,
              "label": "epoch 446"
            },
            {
              "x": 447,
              "y": 0.0666798536003906,
              "label": "epoch 447"
            },
            {
              "x": 448,
              "y": 0.06664817265696574,
              "label": "epoch 448"
            },
            {
              "x": 449,
              "y": 0.06668384486156385,
              "label": "epoch 449"
            },
            {
              "x": 450,
              "y": 0.0668762766293358,
              "label": "epoch 450"
            },
            {
              "x": 451,
              "y": 0.06704571022741528,
              "label": "epoch 451"
            },
            {
              "x": 452,
              "y": 0.06693463391029578,
              "label": "epoch 452"
            },
            {
              "x": 453,
              "y": 0.06676201165445743,
              "label": "epoch 453"
            },
            {
              "x": 454,
              "y": 0.06676991202055367,
              "label": "epoch 454"
            },
            {
              "x": 455,
              "y": 0.0667961499592797,
              "label": "epoch 455"
            },
            {
              "x": 456,
              "y": 0.06692044086101209,
              "label": "epoch 456"
            },
            {
              "x": 457,
              "y": 0.06667650615451155,
              "label": "epoch 457"
            },
            {
              "x": 458,
              "y": 0.066656068743335,
              "label": "epoch 458"
            },
            {
              "x": 459,
              "y": 0.0666524036029305,
              "label": "epoch 459"
            },
            {
              "x": 460,
              "y": 0.06639076907445285,
              "label": "epoch 460"
            },
            {
              "x": 461,
              "y": 0.06663662939553093,
              "label": "epoch 461"
            },
            {
              "x": 462,
              "y": 0.06685907809133995,
              "label": "epoch 462"
            },
            {
              "x": 463,
              "y": 0.06661362022453314,
              "label": "epoch 463"
            },
            {
              "x": 464,
              "y": 0.06681146658344049,
              "label": "epoch 464"
            },
            {
              "x": 465,
              "y": 0.06668081536439667,
              "label": "epoch 465"
            },
            {
              "x": 466,
              "y": 0.06667422206654212,
              "label": "epoch 466"
            },
            {
              "x": 467,
              "y": 0.06674469763800576,
              "label": "epoch 467"
            },
            {
              "x": 468,
              "y": 0.06688488142841371,
              "label": "epoch 468"
            },
            {
              "x": 469,
              "y": 0.06675885843322589,
              "label": "epoch 469"
            },
            {
              "x": 470,
              "y": 0.06662894991210067,
              "label": "epoch 470"
            },
            {
              "x": 471,
              "y": 0.06676205951870959,
              "label": "epoch 471"
            },
            {
              "x": 472,
              "y": 0.0668837573911814,
              "label": "epoch 472"
            },
            {
              "x": 473,
              "y": 0.0668966032645143,
              "label": "epoch 473"
            },
            {
              "x": 474,
              "y": 0.06669926514783195,
              "label": "epoch 474"
            },
            {
              "x": 475,
              "y": 0.06690150963679437,
              "label": "epoch 475"
            },
            {
              "x": 476,
              "y": 0.06664045301870228,
              "label": "epoch 476"
            },
            {
              "x": 477,
              "y": 0.06668076443284726,
              "label": "epoch 477"
            },
            {
              "x": 478,
              "y": 0.06676426758638608,
              "label": "epoch 478"
            },
            {
              "x": 479,
              "y": 0.06680466692684944,
              "label": "epoch 479"
            },
            {
              "x": 480,
              "y": 0.06668827154317712,
              "label": "epoch 480"
            },
            {
              "x": 481,
              "y": 0.06675158606540899,
              "label": "epoch 481"
            },
            {
              "x": 482,
              "y": 0.06677666780502466,
              "label": "epoch 482"
            },
            {
              "x": 483,
              "y": 0.06688627115469686,
              "label": "epoch 483"
            },
            {
              "x": 484,
              "y": 0.06672176753526923,
              "label": "epoch 484"
            },
            {
              "x": 485,
              "y": 0.06674788928420493,
              "label": "epoch 485"
            },
            {
              "x": 486,
              "y": 0.06657663947627122,
              "label": "epoch 486"
            },
            {
              "x": 487,
              "y": 0.06697096164665069,
              "label": "epoch 487"
            },
            {
              "x": 488,
              "y": 0.06675684892685509,
              "label": "epoch 488"
            },
            {
              "x": 489,
              "y": 0.06696064283650553,
              "label": "epoch 489"
            },
            {
              "x": 490,
              "y": 0.0670177483965924,
              "label": "epoch 490"
            },
            {
              "x": 491,
              "y": 0.06700386117962313,
              "label": "epoch 491"
            },
            {
              "x": 492,
              "y": 0.0670047007172674,
              "label": "epoch 492"
            },
            {
              "x": 493,
              "y": 0.06642849702513774,
              "label": "epoch 493"
            },
            {
              "x": 494,
              "y": 0.06677995563590527,
              "label": "epoch 494"
            },
            {
              "x": 495,
              "y": 0.066820809841946,
              "label": "epoch 495"
            },
            {
              "x": 496,
              "y": 0.06666492998588502,
              "label": "epoch 496"
            },
            {
              "x": 497,
              "y": 0.06695296165554902,
              "label": "epoch 497"
            },
            {
              "x": 498,
              "y": 0.06688020705546512,
              "label": "epoch 498"
            },
            {
              "x": 499,
              "y": 0.06671041135320789,
              "label": "epoch 499"
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
            },
            {
              "x": 268,
              "y": 0.027189532294869423,
              "label": "epoch 268"
            },
            {
              "x": 269,
              "y": 0.009195206686854362,
              "label": "epoch 269"
            },
            {
              "x": 270,
              "y": 0.008985331282019615,
              "label": "epoch 270"
            },
            {
              "x": 271,
              "y": 0.08604904264211655,
              "label": "epoch 271"
            },
            {
              "x": 272,
              "y": 0.02024383470416069,
              "label": "epoch 272"
            },
            {
              "x": 273,
              "y": 0.02836202085018158,
              "label": "epoch 273"
            },
            {
              "x": 274,
              "y": 0.025496765971183777,
              "label": "epoch 274"
            },
            {
              "x": 275,
              "y": 0.029461313039064407,
              "label": "epoch 275"
            },
            {
              "x": 276,
              "y": 0.024442605674266815,
              "label": "epoch 276"
            },
            {
              "x": 277,
              "y": 0.03129689767956734,
              "label": "epoch 277"
            },
            {
              "x": 278,
              "y": 0.026762422174215317,
              "label": "epoch 278"
            },
            {
              "x": 279,
              "y": 0.02410082146525383,
              "label": "epoch 279"
            },
            {
              "x": 280,
              "y": 0.09457599371671677,
              "label": "epoch 280"
            },
            {
              "x": 281,
              "y": 0.06998058408498764,
              "label": "epoch 281"
            },
            {
              "x": 282,
              "y": 0.012157936580479145,
              "label": "epoch 282"
            },
            {
              "x": 283,
              "y": 0.009146355092525482,
              "label": "epoch 283"
            },
            {
              "x": 284,
              "y": 0.06689399480819702,
              "label": "epoch 284"
            },
            {
              "x": 285,
              "y": 0.010854043997824192,
              "label": "epoch 285"
            },
            {
              "x": 286,
              "y": 0.13491272926330566,
              "label": "epoch 286"
            },
            {
              "x": 287,
              "y": 0.009188239462673664,
              "label": "epoch 287"
            },
            {
              "x": 288,
              "y": 0.011668888852000237,
              "label": "epoch 288"
            },
            {
              "x": 289,
              "y": 0.007045370992273092,
              "label": "epoch 289"
            },
            {
              "x": 290,
              "y": 0.01893223077058792,
              "label": "epoch 290"
            },
            {
              "x": 291,
              "y": 0.02114545740187168,
              "label": "epoch 291"
            },
            {
              "x": 292,
              "y": 0.07776788622140884,
              "label": "epoch 292"
            },
            {
              "x": 293,
              "y": 0.007741234730929136,
              "label": "epoch 293"
            },
            {
              "x": 294,
              "y": 0.037038493901491165,
              "label": "epoch 294"
            },
            {
              "x": 295,
              "y": 0.02305569313466549,
              "label": "epoch 295"
            },
            {
              "x": 296,
              "y": 0.014153104275465012,
              "label": "epoch 296"
            },
            {
              "x": 297,
              "y": 0.008638998493552208,
              "label": "epoch 297"
            },
            {
              "x": 298,
              "y": 0.05365333706140518,
              "label": "epoch 298"
            },
            {
              "x": 299,
              "y": 0.009703359566628933,
              "label": "epoch 299"
            },
            {
              "x": 300,
              "y": 0.014794686809182167,
              "label": "epoch 300"
            },
            {
              "x": 301,
              "y": 0.009071018546819687,
              "label": "epoch 301"
            },
            {
              "x": 302,
              "y": 0.04177522659301758,
              "label": "epoch 302"
            },
            {
              "x": 303,
              "y": 0.08622533082962036,
              "label": "epoch 303"
            },
            {
              "x": 304,
              "y": 0.011648157611489296,
              "label": "epoch 304"
            },
            {
              "x": 305,
              "y": 0.04870710149407387,
              "label": "epoch 305"
            },
            {
              "x": 306,
              "y": 0.009539468213915825,
              "label": "epoch 306"
            },
            {
              "x": 307,
              "y": 0.0774482786655426,
              "label": "epoch 307"
            },
            {
              "x": 308,
              "y": 0.014391002245247364,
              "label": "epoch 308"
            },
            {
              "x": 309,
              "y": 0.019627101719379425,
              "label": "epoch 309"
            },
            {
              "x": 310,
              "y": 0.011616659350693226,
              "label": "epoch 310"
            },
            {
              "x": 311,
              "y": 0.007713041268289089,
              "label": "epoch 311"
            },
            {
              "x": 312,
              "y": 0.014408351853489876,
              "label": "epoch 312"
            },
            {
              "x": 313,
              "y": 0.014642301946878433,
              "label": "epoch 313"
            },
            {
              "x": 314,
              "y": 0.02009112387895584,
              "label": "epoch 314"
            },
            {
              "x": 315,
              "y": 0.008359096013009548,
              "label": "epoch 315"
            },
            {
              "x": 316,
              "y": 0.09913589805364609,
              "label": "epoch 316"
            },
            {
              "x": 317,
              "y": 0.008515702560544014,
              "label": "epoch 317"
            },
            {
              "x": 318,
              "y": 0.006958600599318743,
              "label": "epoch 318"
            },
            {
              "x": 319,
              "y": 0.015804985538125038,
              "label": "epoch 319"
            },
            {
              "x": 320,
              "y": 0.00821197871118784,
              "label": "epoch 320"
            },
            {
              "x": 321,
              "y": 0.02469131536781788,
              "label": "epoch 321"
            },
            {
              "x": 322,
              "y": 0.004510987550020218,
              "label": "epoch 322"
            },
            {
              "x": 323,
              "y": 0.01099614892154932,
              "label": "epoch 323"
            },
            {
              "x": 324,
              "y": 0.036898158490657806,
              "label": "epoch 324"
            },
            {
              "x": 325,
              "y": 0.009736992418766022,
              "label": "epoch 325"
            },
            {
              "x": 326,
              "y": 0.012066646479070187,
              "label": "epoch 326"
            },
            {
              "x": 327,
              "y": 0.023209696635603905,
              "label": "epoch 327"
            },
            {
              "x": 328,
              "y": 0.012524735182523727,
              "label": "epoch 328"
            },
            {
              "x": 329,
              "y": 0.020074008032679558,
              "label": "epoch 329"
            },
            {
              "x": 330,
              "y": 0.015455393120646477,
              "label": "epoch 330"
            },
            {
              "x": 331,
              "y": 0.024939190596342087,
              "label": "epoch 331"
            },
            {
              "x": 332,
              "y": 0.09857409447431564,
              "label": "epoch 332"
            },
            {
              "x": 333,
              "y": 0.011254431679844856,
              "label": "epoch 333"
            },
            {
              "x": 334,
              "y": 0.01529735792428255,
              "label": "epoch 334"
            },
            {
              "x": 335,
              "y": 0.0676368698477745,
              "label": "epoch 335"
            },
            {
              "x": 336,
              "y": 0.01491574477404356,
              "label": "epoch 336"
            },
            {
              "x": 337,
              "y": 0.011625252664089203,
              "label": "epoch 337"
            },
            {
              "x": 338,
              "y": 0.007422985043376684,
              "label": "epoch 338"
            },
            {
              "x": 339,
              "y": 0.004705377854406834,
              "label": "epoch 339"
            },
            {
              "x": 340,
              "y": 0.027171123772859573,
              "label": "epoch 340"
            },
            {
              "x": 341,
              "y": 0.007528221234679222,
              "label": "epoch 341"
            },
            {
              "x": 342,
              "y": 0.01628005877137184,
              "label": "epoch 342"
            },
            {
              "x": 343,
              "y": 0.007407264783978462,
              "label": "epoch 343"
            },
            {
              "x": 344,
              "y": 0.010224254801869392,
              "label": "epoch 344"
            },
            {
              "x": 345,
              "y": 0.0066126687452197075,
              "label": "epoch 345"
            },
            {
              "x": 346,
              "y": 0.07322601974010468,
              "label": "epoch 346"
            },
            {
              "x": 347,
              "y": 0.06958091259002686,
              "label": "epoch 347"
            },
            {
              "x": 348,
              "y": 0.012828045524656773,
              "label": "epoch 348"
            },
            {
              "x": 349,
              "y": 0.05781381577253342,
              "label": "epoch 349"
            },
            {
              "x": 350,
              "y": 0.008395376615226269,
              "label": "epoch 350"
            },
            {
              "x": 351,
              "y": 0.032913561910390854,
              "label": "epoch 351"
            },
            {
              "x": 352,
              "y": 0.0070051332004368305,
              "label": "epoch 352"
            },
            {
              "x": 353,
              "y": 0.016287796199321747,
              "label": "epoch 353"
            },
            {
              "x": 354,
              "y": 0.07294604182243347,
              "label": "epoch 354"
            },
            {
              "x": 355,
              "y": 0.011353704147040844,
              "label": "epoch 355"
            },
            {
              "x": 356,
              "y": 0.004226011224091053,
              "label": "epoch 356"
            },
            {
              "x": 357,
              "y": 0.03749498724937439,
              "label": "epoch 357"
            },
            {
              "x": 358,
              "y": 0.036338143050670624,
              "label": "epoch 358"
            },
            {
              "x": 359,
              "y": 0.01695697195827961,
              "label": "epoch 359"
            },
            {
              "x": 360,
              "y": 0.06803108006715775,
              "label": "epoch 360"
            },
            {
              "x": 361,
              "y": 0.004896601662039757,
              "label": "epoch 361"
            },
            {
              "x": 362,
              "y": 0.015511964447796345,
              "label": "epoch 362"
            },
            {
              "x": 363,
              "y": 0.07278862595558167,
              "label": "epoch 363"
            },
            {
              "x": 364,
              "y": 0.014850789681077003,
              "label": "epoch 364"
            },
            {
              "x": 365,
              "y": 0.024884283542633057,
              "label": "epoch 365"
            },
            {
              "x": 366,
              "y": 0.004860039334744215,
              "label": "epoch 366"
            },
            {
              "x": 367,
              "y": 0.023944834247231483,
              "label": "epoch 367"
            },
            {
              "x": 368,
              "y": 0.014236953109502792,
              "label": "epoch 368"
            },
            {
              "x": 369,
              "y": 0.01877974532544613,
              "label": "epoch 369"
            },
            {
              "x": 370,
              "y": 0.01876736432313919,
              "label": "epoch 370"
            },
            {
              "x": 371,
              "y": 0.0062500168569386005,
              "label": "epoch 371"
            },
            {
              "x": 372,
              "y": 0.013451597653329372,
              "label": "epoch 372"
            },
            {
              "x": 373,
              "y": 0.055734213441610336,
              "label": "epoch 373"
            },
            {
              "x": 374,
              "y": 0.0076903849840164185,
              "label": "epoch 374"
            },
            {
              "x": 375,
              "y": 0.006560167297720909,
              "label": "epoch 375"
            },
            {
              "x": 376,
              "y": 0.10988280177116394,
              "label": "epoch 376"
            },
            {
              "x": 377,
              "y": 0.02112080715596676,
              "label": "epoch 377"
            },
            {
              "x": 378,
              "y": 0.004427387844771147,
              "label": "epoch 378"
            },
            {
              "x": 379,
              "y": 0.007912744767963886,
              "label": "epoch 379"
            },
            {
              "x": 380,
              "y": 0.02496047504246235,
              "label": "epoch 380"
            },
            {
              "x": 381,
              "y": 0.006759384647011757,
              "label": "epoch 381"
            },
            {
              "x": 382,
              "y": 0.005740731488913298,
              "label": "epoch 382"
            },
            {
              "x": 383,
              "y": 0.004252933897078037,
              "label": "epoch 383"
            },
            {
              "x": 384,
              "y": 0.01034968625754118,
              "label": "epoch 384"
            },
            {
              "x": 385,
              "y": 0.018785905092954636,
              "label": "epoch 385"
            },
            {
              "x": 386,
              "y": 0.007904919795691967,
              "label": "epoch 386"
            },
            {
              "x": 387,
              "y": 0.006096336059272289,
              "label": "epoch 387"
            },
            {
              "x": 388,
              "y": 0.007688029203563929,
              "label": "epoch 388"
            },
            {
              "x": 389,
              "y": 0.004722972400486469,
              "label": "epoch 389"
            },
            {
              "x": 390,
              "y": 0.0058059170842170715,
              "label": "epoch 390"
            },
            {
              "x": 391,
              "y": 0.006164760794490576,
              "label": "epoch 391"
            },
            {
              "x": 392,
              "y": 0.039785418659448624,
              "label": "epoch 392"
            },
            {
              "x": 393,
              "y": 0.010459511540830135,
              "label": "epoch 393"
            },
            {
              "x": 394,
              "y": 0.0050719017162919044,
              "label": "epoch 394"
            },
            {
              "x": 395,
              "y": 0.006749285385012627,
              "label": "epoch 395"
            },
            {
              "x": 396,
              "y": 0.0442185252904892,
              "label": "epoch 396"
            },
            {
              "x": 397,
              "y": 0.0065033878199756145,
              "label": "epoch 397"
            },
            {
              "x": 398,
              "y": 0.009789364412426949,
              "label": "epoch 398"
            },
            {
              "x": 399,
              "y": 0.008290504105389118,
              "label": "epoch 399"
            },
            {
              "x": 400,
              "y": 0.022984016686677933,
              "label": "epoch 400"
            },
            {
              "x": 401,
              "y": 0.00646132742986083,
              "label": "epoch 401"
            },
            {
              "x": 402,
              "y": 0.004978284705430269,
              "label": "epoch 402"
            },
            {
              "x": 403,
              "y": 0.0990067645907402,
              "label": "epoch 403"
            },
            {
              "x": 404,
              "y": 0.03863397613167763,
              "label": "epoch 404"
            },
            {
              "x": 405,
              "y": 0.01866036094725132,
              "label": "epoch 405"
            },
            {
              "x": 406,
              "y": 0.010861922055482864,
              "label": "epoch 406"
            },
            {
              "x": 407,
              "y": 0.009130235761404037,
              "label": "epoch 407"
            },
            {
              "x": 408,
              "y": 0.00747115770354867,
              "label": "epoch 408"
            },
            {
              "x": 409,
              "y": 0.0053983209654688835,
              "label": "epoch 409"
            },
            {
              "x": 410,
              "y": 0.06903785467147827,
              "label": "epoch 410"
            },
            {
              "x": 411,
              "y": 0.011531798169016838,
              "label": "epoch 411"
            },
            {
              "x": 412,
              "y": 0.08585716038942337,
              "label": "epoch 412"
            },
            {
              "x": 413,
              "y": 0.010756042785942554,
              "label": "epoch 413"
            },
            {
              "x": 414,
              "y": 0.05596190690994263,
              "label": "epoch 414"
            },
            {
              "x": 415,
              "y": 0.003261890960857272,
              "label": "epoch 415"
            },
            {
              "x": 416,
              "y": 0.043394312262535095,
              "label": "epoch 416"
            },
            {
              "x": 417,
              "y": 0.017365634441375732,
              "label": "epoch 417"
            },
            {
              "x": 418,
              "y": 0.009077655151486397,
              "label": "epoch 418"
            },
            {
              "x": 419,
              "y": 0.07380034774541855,
              "label": "epoch 419"
            },
            {
              "x": 420,
              "y": 0.021563829854130745,
              "label": "epoch 420"
            },
            {
              "x": 421,
              "y": 0.03221149742603302,
              "label": "epoch 421"
            },
            {
              "x": 422,
              "y": 0.016730375587940216,
              "label": "epoch 422"
            },
            {
              "x": 423,
              "y": 0.0040585813112556934,
              "label": "epoch 423"
            },
            {
              "x": 424,
              "y": 0.0045020319521427155,
              "label": "epoch 424"
            },
            {
              "x": 425,
              "y": 0.006441973615437746,
              "label": "epoch 425"
            },
            {
              "x": 426,
              "y": 0.008063744753599167,
              "label": "epoch 426"
            },
            {
              "x": 427,
              "y": 0.008091996423900127,
              "label": "epoch 427"
            },
            {
              "x": 428,
              "y": 0.017478549852967262,
              "label": "epoch 428"
            },
            {
              "x": 429,
              "y": 0.0230905469506979,
              "label": "epoch 429"
            },
            {
              "x": 430,
              "y": 0.038141943514347076,
              "label": "epoch 430"
            },
            {
              "x": 431,
              "y": 0.007977243512868881,
              "label": "epoch 431"
            },
            {
              "x": 432,
              "y": 0.024665020406246185,
              "label": "epoch 432"
            },
            {
              "x": 433,
              "y": 0.0051637375727295876,
              "label": "epoch 433"
            },
            {
              "x": 434,
              "y": 0.004888805095106363,
              "label": "epoch 434"
            },
            {
              "x": 435,
              "y": 0.008854949846863747,
              "label": "epoch 435"
            },
            {
              "x": 436,
              "y": 0.013286516070365906,
              "label": "epoch 436"
            },
            {
              "x": 437,
              "y": 0.009707369841635227,
              "label": "epoch 437"
            },
            {
              "x": 438,
              "y": 0.02674684301018715,
              "label": "epoch 438"
            },
            {
              "x": 439,
              "y": 0.06872086226940155,
              "label": "epoch 439"
            },
            {
              "x": 440,
              "y": 0.01799952983856201,
              "label": "epoch 440"
            },
            {
              "x": 441,
              "y": 0.015710441395640373,
              "label": "epoch 441"
            },
            {
              "x": 442,
              "y": 0.04923626035451889,
              "label": "epoch 442"
            },
            {
              "x": 443,
              "y": 0.004998111166059971,
              "label": "epoch 443"
            },
            {
              "x": 444,
              "y": 0.00991745013743639,
              "label": "epoch 444"
            },
            {
              "x": 445,
              "y": 0.0046872328966856,
              "label": "epoch 445"
            },
            {
              "x": 446,
              "y": 0.02131691761314869,
              "label": "epoch 446"
            },
            {
              "x": 447,
              "y": 0.0032988903112709522,
              "label": "epoch 447"
            },
            {
              "x": 448,
              "y": 0.005617281887680292,
              "label": "epoch 448"
            },
            {
              "x": 449,
              "y": 0.010895052924752235,
              "label": "epoch 449"
            },
            {
              "x": 450,
              "y": 0.016925128176808357,
              "label": "epoch 450"
            },
            {
              "x": 451,
              "y": 0.08590631932020187,
              "label": "epoch 451"
            },
            {
              "x": 452,
              "y": 0.004226307384669781,
              "label": "epoch 452"
            },
            {
              "x": 453,
              "y": 0.03094439208507538,
              "label": "epoch 453"
            },
            {
              "x": 454,
              "y": 0.015294143930077553,
              "label": "epoch 454"
            },
            {
              "x": 455,
              "y": 0.015509337186813354,
              "label": "epoch 455"
            },
            {
              "x": 456,
              "y": 0.004918700084090233,
              "label": "epoch 456"
            },
            {
              "x": 457,
              "y": 0.004090598318725824,
              "label": "epoch 457"
            },
            {
              "x": 458,
              "y": 0.06200274080038071,
              "label": "epoch 458"
            },
            {
              "x": 459,
              "y": 0.009024661034345627,
              "label": "epoch 459"
            },
            {
              "x": 460,
              "y": 0.004067031666636467,
              "label": "epoch 460"
            },
            {
              "x": 461,
              "y": 0.01140917744487524,
              "label": "epoch 461"
            },
            {
              "x": 462,
              "y": 0.019525883719325066,
              "label": "epoch 462"
            },
            {
              "x": 463,
              "y": 0.0038136588409543037,
              "label": "epoch 463"
            },
            {
              "x": 464,
              "y": 0.008588316850364208,
              "label": "epoch 464"
            },
            {
              "x": 465,
              "y": 0.00990120880305767,
              "label": "epoch 465"
            },
            {
              "x": 466,
              "y": 0.003452846547588706,
              "label": "epoch 466"
            },
            {
              "x": 467,
              "y": 0.0051016551442444324,
              "label": "epoch 467"
            },
            {
              "x": 468,
              "y": 0.004318626131862402,
              "label": "epoch 468"
            },
            {
              "x": 469,
              "y": 0.05473799630999565,
              "label": "epoch 469"
            },
            {
              "x": 470,
              "y": 0.00841209851205349,
              "label": "epoch 470"
            },
            {
              "x": 471,
              "y": 0.027981098741292953,
              "label": "epoch 471"
            },
            {
              "x": 472,
              "y": 0.003952663391828537,
              "label": "epoch 472"
            },
            {
              "x": 473,
              "y": 0.00658548204228282,
              "label": "epoch 473"
            },
            {
              "x": 474,
              "y": 0.004369574133306742,
              "label": "epoch 474"
            },
            {
              "x": 475,
              "y": 0.003759324550628662,
              "label": "epoch 475"
            },
            {
              "x": 476,
              "y": 0.013722418807446957,
              "label": "epoch 476"
            },
            {
              "x": 477,
              "y": 0.011249305680394173,
              "label": "epoch 477"
            },
            {
              "x": 478,
              "y": 0.009636707603931427,
              "label": "epoch 478"
            },
            {
              "x": 479,
              "y": 0.004219463095068932,
              "label": "epoch 479"
            },
            {
              "x": 480,
              "y": 0.005724437069147825,
              "label": "epoch 480"
            },
            {
              "x": 481,
              "y": 0.0539172925055027,
              "label": "epoch 481"
            },
            {
              "x": 482,
              "y": 0.04067965969443321,
              "label": "epoch 482"
            },
            {
              "x": 483,
              "y": 0.003887669648975134,
              "label": "epoch 483"
            },
            {
              "x": 484,
              "y": 0.023556649684906006,
              "label": "epoch 484"
            },
            {
              "x": 485,
              "y": 0.010309338569641113,
              "label": "epoch 485"
            },
            {
              "x": 486,
              "y": 0.017315633594989777,
              "label": "epoch 486"
            },
            {
              "x": 487,
              "y": 0.006511976011097431,
              "label": "epoch 487"
            },
            {
              "x": 488,
              "y": 0.004867063369601965,
              "label": "epoch 488"
            },
            {
              "x": 489,
              "y": 0.046696584671735764,
              "label": "epoch 489"
            },
            {
              "x": 490,
              "y": 0.006624337285757065,
              "label": "epoch 490"
            },
            {
              "x": 491,
              "y": 0.0061247460544109344,
              "label": "epoch 491"
            },
            {
              "x": 492,
              "y": 0.005148465279489756,
              "label": "epoch 492"
            },
            {
              "x": 493,
              "y": 0.011602011509239674,
              "label": "epoch 493"
            },
            {
              "x": 494,
              "y": 0.01943100616335869,
              "label": "epoch 494"
            },
            {
              "x": 495,
              "y": 0.01660173013806343,
              "label": "epoch 495"
            },
            {
              "x": 496,
              "y": 0.025625085458159447,
              "label": "epoch 496"
            },
            {
              "x": 497,
              "y": 0.01165518257766962,
              "label": "epoch 497"
            },
            {
              "x": 498,
              "y": 0.0038114781491458416,
              "label": "epoch 498"
            },
            {
              "x": 499,
              "y": 0.008870374411344528,
              "label": "epoch 499"
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
            },
            {
              "x": 268,
              "y": 1.4225225133551775,
              "label": "epoch 268"
            },
            {
              "x": 269,
              "y": 1.4608520816913562,
              "label": "epoch 269"
            },
            {
              "x": 270,
              "y": 1.443699781721654,
              "label": "epoch 270"
            },
            {
              "x": 271,
              "y": 1.1519441693089902,
              "label": "epoch 271"
            },
            {
              "x": 272,
              "y": 1.2397264638474506,
              "label": "epoch 272"
            },
            {
              "x": 273,
              "y": 1.2246275283886414,
              "label": "epoch 273"
            },
            {
              "x": 274,
              "y": 1.3009124757525952,
              "label": "epoch 274"
            },
            {
              "x": 275,
              "y": 1.2945500425014056,
              "label": "epoch 275"
            },
            {
              "x": 276,
              "y": 1.1862357727889168,
              "label": "epoch 276"
            },
            {
              "x": 277,
              "y": 1.3987849417240603,
              "label": "epoch 277"
            },
            {
              "x": 278,
              "y": 1.4548823954660053,
              "label": "epoch 278"
            },
            {
              "x": 279,
              "y": 1.250663336709534,
              "label": "epoch 279"
            },
            {
              "x": 280,
              "y": 1.393888238204741,
              "label": "epoch 280"
            },
            {
              "x": 281,
              "y": 1.4193559281258403,
              "label": "epoch 281"
            },
            {
              "x": 282,
              "y": 1.2099959876290278,
              "label": "epoch 282"
            },
            {
              "x": 283,
              "y": 1.4229950140426426,
              "label": "epoch 283"
            },
            {
              "x": 284,
              "y": 1.6315310267780565,
              "label": "epoch 284"
            },
            {
              "x": 285,
              "y": 1.3748592131673114,
              "label": "epoch 285"
            },
            {
              "x": 286,
              "y": 1.342739932851768,
              "label": "epoch 286"
            },
            {
              "x": 287,
              "y": 1.3930875399444056,
              "label": "epoch 287"
            },
            {
              "x": 288,
              "y": 1.2696129939714937,
              "label": "epoch 288"
            },
            {
              "x": 289,
              "y": 1.2596340313749879,
              "label": "epoch 289"
            },
            {
              "x": 290,
              "y": 1.180363759986664,
              "label": "epoch 290"
            },
            {
              "x": 291,
              "y": 1.1236513211563426,
              "label": "epoch 291"
            },
            {
              "x": 292,
              "y": 1.4095306124930318,
              "label": "epoch 292"
            },
            {
              "x": 293,
              "y": 1.4958316808394891,
              "label": "epoch 293"
            },
            {
              "x": 294,
              "y": 1.5501424637132961,
              "label": "epoch 294"
            },
            {
              "x": 295,
              "y": 1.3140253729775155,
              "label": "epoch 295"
            },
            {
              "x": 296,
              "y": 1.5700806237414087,
              "label": "epoch 296"
            },
            {
              "x": 297,
              "y": 1.5789533016688533,
              "label": "epoch 297"
            },
            {
              "x": 298,
              "y": 1.379655856296028,
              "label": "epoch 298"
            },
            {
              "x": 299,
              "y": 1.498857055619163,
              "label": "epoch 299"
            },
            {
              "x": 300,
              "y": 1.378408466147161,
              "label": "epoch 300"
            },
            {
              "x": 301,
              "y": 1.3053276907334006,
              "label": "epoch 301"
            },
            {
              "x": 302,
              "y": 1.352474745215946,
              "label": "epoch 302"
            },
            {
              "x": 303,
              "y": 1.411131699545015,
              "label": "epoch 303"
            },
            {
              "x": 304,
              "y": 1.455908373218814,
              "label": "epoch 304"
            },
            {
              "x": 305,
              "y": 1.351398035908412,
              "label": "epoch 305"
            },
            {
              "x": 306,
              "y": 1.3650860267348195,
              "label": "epoch 306"
            },
            {
              "x": 307,
              "y": 1.2101091298421747,
              "label": "epoch 307"
            },
            {
              "x": 308,
              "y": 1.3304394172798646,
              "label": "epoch 308"
            },
            {
              "x": 309,
              "y": 1.356860807337063,
              "label": "epoch 309"
            },
            {
              "x": 310,
              "y": 1.5957387957329814,
              "label": "epoch 310"
            },
            {
              "x": 311,
              "y": 1.5332107953849787,
              "label": "epoch 311"
            },
            {
              "x": 312,
              "y": 1.5071364164009298,
              "label": "epoch 312"
            },
            {
              "x": 313,
              "y": 1.2951535195308297,
              "label": "epoch 313"
            },
            {
              "x": 314,
              "y": 1.3132261918539083,
              "label": "epoch 314"
            },
            {
              "x": 315,
              "y": 1.2878159864094894,
              "label": "epoch 315"
            },
            {
              "x": 316,
              "y": 1.4829810858998251,
              "label": "epoch 316"
            },
            {
              "x": 317,
              "y": 1.5130737157244432,
              "label": "epoch 317"
            },
            {
              "x": 318,
              "y": 1.5384085249449861,
              "label": "epoch 318"
            },
            {
              "x": 319,
              "y": 1.4659934580130012,
              "label": "epoch 319"
            },
            {
              "x": 320,
              "y": 1.3291948019085746,
              "label": "epoch 320"
            },
            {
              "x": 321,
              "y": 1.4884413596928905,
              "label": "epoch 321"
            },
            {
              "x": 322,
              "y": 1.4753174440150982,
              "label": "epoch 322"
            },
            {
              "x": 323,
              "y": 1.412390863718955,
              "label": "epoch 323"
            },
            {
              "x": 324,
              "y": 1.464497479156738,
              "label": "epoch 324"
            },
            {
              "x": 325,
              "y": 1.3937975881547715,
              "label": "epoch 325"
            },
            {
              "x": 326,
              "y": 1.3407255821297632,
              "label": "epoch 326"
            },
            {
              "x": 327,
              "y": 1.492336196763637,
              "label": "epoch 327"
            },
            {
              "x": 328,
              "y": 1.3326248362856477,
              "label": "epoch 328"
            },
            {
              "x": 329,
              "y": 1.471493174199407,
              "label": "epoch 329"
            },
            {
              "x": 330,
              "y": 1.4199864295752425,
              "label": "epoch 330"
            },
            {
              "x": 331,
              "y": 1.4517445166007077,
              "label": "epoch 331"
            },
            {
              "x": 332,
              "y": 1.3701017715134902,
              "label": "epoch 332"
            },
            {
              "x": 333,
              "y": 1.591197965470584,
              "label": "epoch 333"
            },
            {
              "x": 334,
              "y": 1.3744561730785982,
              "label": "epoch 334"
            },
            {
              "x": 335,
              "y": 1.370813137067384,
              "label": "epoch 335"
            },
            {
              "x": 336,
              "y": 1.5395926321905695,
              "label": "epoch 336"
            },
            {
              "x": 337,
              "y": 1.642634472809732,
              "label": "epoch 337"
            },
            {
              "x": 338,
              "y": 1.543405329257152,
              "label": "epoch 338"
            },
            {
              "x": 339,
              "y": 1.5427940917005272,
              "label": "epoch 339"
            },
            {
              "x": 340,
              "y": 1.2429965832025598,
              "label": "epoch 340"
            },
            {
              "x": 341,
              "y": 1.510613225768075,
              "label": "epoch 341"
            },
            {
              "x": 342,
              "y": 1.3442003587383384,
              "label": "epoch 342"
            },
            {
              "x": 343,
              "y": 1.6138189651170058,
              "label": "epoch 343"
            },
            {
              "x": 344,
              "y": 1.4534131812029762,
              "label": "epoch 344"
            },
            {
              "x": 345,
              "y": 1.7392166150782846,
              "label": "epoch 345"
            },
            {
              "x": 346,
              "y": 1.3984767863232839,
              "label": "epoch 346"
            },
            {
              "x": 347,
              "y": 1.410945287133616,
              "label": "epoch 347"
            },
            {
              "x": 348,
              "y": 1.4917750677191897,
              "label": "epoch 348"
            },
            {
              "x": 349,
              "y": 1.2621544189015894,
              "label": "epoch 349"
            },
            {
              "x": 350,
              "y": 1.4261120428135128,
              "label": "epoch 350"
            },
            {
              "x": 351,
              "y": 1.3668593322417062,
              "label": "epoch 351"
            },
            {
              "x": 352,
              "y": 1.5216860961365073,
              "label": "epoch 352"
            },
            {
              "x": 353,
              "y": 1.3836526698432863,
              "label": "epoch 353"
            },
            {
              "x": 354,
              "y": 1.510798665670384,
              "label": "epoch 354"
            },
            {
              "x": 355,
              "y": 1.3501462725138194,
              "label": "epoch 355"
            },
            {
              "x": 356,
              "y": 1.3546588962505524,
              "label": "epoch 356"
            },
            {
              "x": 357,
              "y": 1.5685586953829778,
              "label": "epoch 357"
            },
            {
              "x": 358,
              "y": 1.453540592013221,
              "label": "epoch 358"
            },
            {
              "x": 359,
              "y": 1.428161661753333,
              "label": "epoch 359"
            },
            {
              "x": 360,
              "y": 1.5996703002111692,
              "label": "epoch 360"
            },
            {
              "x": 361,
              "y": 1.7024853070707697,
              "label": "epoch 361"
            },
            {
              "x": 362,
              "y": 1.5188426008374478,
              "label": "epoch 362"
            },
            {
              "x": 363,
              "y": 1.4606277709581743,
              "label": "epoch 363"
            },
            {
              "x": 364,
              "y": 1.3660436478002291,
              "label": "epoch 364"
            },
            {
              "x": 365,
              "y": 1.4703967184514593,
              "label": "epoch 365"
            },
            {
              "x": 366,
              "y": 1.2656189911557656,
              "label": "epoch 366"
            },
            {
              "x": 367,
              "y": 1.3878693416420567,
              "label": "epoch 367"
            },
            {
              "x": 368,
              "y": 1.6311371979842846,
              "label": "epoch 368"
            },
            {
              "x": 369,
              "y": 1.4856393052951287,
              "label": "epoch 369"
            },
            {
              "x": 370,
              "y": 1.4733058422999947,
              "label": "epoch 370"
            },
            {
              "x": 371,
              "y": 1.5252005766439987,
              "label": "epoch 371"
            },
            {
              "x": 372,
              "y": 1.7542466519302444,
              "label": "epoch 372"
            },
            {
              "x": 373,
              "y": 1.5513097614196962,
              "label": "epoch 373"
            },
            {
              "x": 374,
              "y": 1.6431277965342528,
              "label": "epoch 374"
            },
            {
              "x": 375,
              "y": 1.45358518906869,
              "label": "epoch 375"
            },
            {
              "x": 376,
              "y": 1.3028117245259254,
              "label": "epoch 376"
            },
            {
              "x": 377,
              "y": 1.5093876692392911,
              "label": "epoch 377"
            },
            {
              "x": 378,
              "y": 1.490765480373643,
              "label": "epoch 378"
            },
            {
              "x": 379,
              "y": 1.6767242128691195,
              "label": "epoch 379"
            },
            {
              "x": 380,
              "y": 1.5434361255948286,
              "label": "epoch 380"
            },
            {
              "x": 381,
              "y": 1.5145704419670725,
              "label": "epoch 381"
            },
            {
              "x": 382,
              "y": 1.5220466373169697,
              "label": "epoch 382"
            },
            {
              "x": 383,
              "y": 1.6414855284077163,
              "label": "epoch 383"
            },
            {
              "x": 384,
              "y": 1.3580371019503985,
              "label": "epoch 384"
            },
            {
              "x": 385,
              "y": 1.3204885249908425,
              "label": "epoch 385"
            },
            {
              "x": 386,
              "y": 1.4487638719208342,
              "label": "epoch 386"
            },
            {
              "x": 387,
              "y": 1.5082642840417593,
              "label": "epoch 387"
            },
            {
              "x": 388,
              "y": 1.6644657011707558,
              "label": "epoch 388"
            },
            {
              "x": 389,
              "y": 1.7169549991621782,
              "label": "epoch 389"
            },
            {
              "x": 390,
              "y": 1.351188395956629,
              "label": "epoch 390"
            },
            {
              "x": 391,
              "y": 1.348502494590847,
              "label": "epoch 391"
            },
            {
              "x": 392,
              "y": 1.5014768482161391,
              "label": "epoch 392"
            },
            {
              "x": 393,
              "y": 1.4294739587379521,
              "label": "epoch 393"
            },
            {
              "x": 394,
              "y": 1.7703890327707326,
              "label": "epoch 394"
            },
            {
              "x": 395,
              "y": 1.3696825773406185,
              "label": "epoch 395"
            },
            {
              "x": 396,
              "y": 1.4242053311685787,
              "label": "epoch 396"
            },
            {
              "x": 397,
              "y": 1.4194131751397723,
              "label": "epoch 397"
            },
            {
              "x": 398,
              "y": 1.501289216691236,
              "label": "epoch 398"
            },
            {
              "x": 399,
              "y": 1.7350181586256153,
              "label": "epoch 399"
            },
            {
              "x": 400,
              "y": 1.3955077757372667,
              "label": "epoch 400"
            },
            {
              "x": 401,
              "y": 1.4859090276724218,
              "label": "epoch 401"
            },
            {
              "x": 402,
              "y": 1.5508399461641122,
              "label": "epoch 402"
            },
            {
              "x": 403,
              "y": 1.4316985197855454,
              "label": "epoch 403"
            },
            {
              "x": 404,
              "y": 1.6867876997413604,
              "label": "epoch 404"
            },
            {
              "x": 405,
              "y": 1.4373352483012958,
              "label": "epoch 405"
            },
            {
              "x": 406,
              "y": 1.4785801439398998,
              "label": "epoch 406"
            },
            {
              "x": 407,
              "y": 1.6870253544153744,
              "label": "epoch 407"
            },
            {
              "x": 408,
              "y": 1.7811223940531675,
              "label": "epoch 408"
            },
            {
              "x": 409,
              "y": 1.6125203315046077,
              "label": "epoch 409"
            },
            {
              "x": 410,
              "y": 1.6078555797912966,
              "label": "epoch 410"
            },
            {
              "x": 411,
              "y": 1.650837188353762,
              "label": "epoch 411"
            },
            {
              "x": 412,
              "y": 1.740709999576211,
              "label": "epoch 412"
            },
            {
              "x": 413,
              "y": 1.6286797460756803,
              "label": "epoch 413"
            },
            {
              "x": 414,
              "y": 1.6912191490103539,
              "label": "epoch 414"
            },
            {
              "x": 415,
              "y": 1.4494189650163447,
              "label": "epoch 415"
            },
            {
              "x": 416,
              "y": 1.7646213244021822,
              "label": "epoch 416"
            },
            {
              "x": 417,
              "y": 1.479957316217846,
              "label": "epoch 417"
            },
            {
              "x": 418,
              "y": 1.7183466376981844,
              "label": "epoch 418"
            },
            {
              "x": 419,
              "y": 1.7108843745663762,
              "label": "epoch 419"
            },
            {
              "x": 420,
              "y": 1.659455621602798,
              "label": "epoch 420"
            },
            {
              "x": 421,
              "y": 1.5824566845733083,
              "label": "epoch 421"
            },
            {
              "x": 422,
              "y": 1.7606427268443727,
              "label": "epoch 422"
            },
            {
              "x": 423,
              "y": 1.8345387848584276,
              "label": "epoch 423"
            },
            {
              "x": 424,
              "y": 1.5309340145536943,
              "label": "epoch 424"
            },
            {
              "x": 425,
              "y": 1.855825756578461,
              "label": "epoch 425"
            },
            {
              "x": 426,
              "y": 1.3775061659245311,
              "label": "epoch 426"
            },
            {
              "x": 427,
              "y": 1.697054365171904,
              "label": "epoch 427"
            },
            {
              "x": 428,
              "y": 1.7879433398085989,
              "label": "epoch 428"
            },
            {
              "x": 429,
              "y": 1.747076618252322,
              "label": "epoch 429"
            },
            {
              "x": 430,
              "y": 1.641814198148878,
              "label": "epoch 430"
            },
            {
              "x": 431,
              "y": 1.61104297012973,
              "label": "epoch 431"
            },
            {
              "x": 432,
              "y": 1.5075219018188746,
              "label": "epoch 432"
            },
            {
              "x": 433,
              "y": 1.6905314160118763,
              "label": "epoch 433"
            },
            {
              "x": 434,
              "y": 1.650489838254687,
              "label": "epoch 434"
            },
            {
              "x": 435,
              "y": 1.6015873905761462,
              "label": "epoch 435"
            },
            {
              "x": 436,
              "y": 1.6074719724588489,
              "label": "epoch 436"
            },
            {
              "x": 437,
              "y": 1.8375825860145454,
              "label": "epoch 437"
            },
            {
              "x": 438,
              "y": 1.8301372872665524,
              "label": "epoch 438"
            },
            {
              "x": 439,
              "y": 1.4397124851514633,
              "label": "epoch 439"
            },
            {
              "x": 440,
              "y": 1.6988878147431503,
              "label": "epoch 440"
            },
            {
              "x": 441,
              "y": 1.8485193425348323,
              "label": "epoch 441"
            },
            {
              "x": 442,
              "y": 1.7003111031127016,
              "label": "epoch 442"
            },
            {
              "x": 443,
              "y": 1.6504366731785827,
              "label": "epoch 443"
            },
            {
              "x": 444,
              "y": 1.4665763562447147,
              "label": "epoch 444"
            },
            {
              "x": 445,
              "y": 1.7030332660008418,
              "label": "epoch 445"
            },
            {
              "x": 446,
              "y": 1.7217225821590738,
              "label": "epoch 446"
            },
            {
              "x": 447,
              "y": 1.6875343981297,
              "label": "epoch 447"
            },
            {
              "x": 448,
              "y": 1.636250549486201,
              "label": "epoch 448"
            },
            {
              "x": 449,
              "y": 1.547233894675676,
              "label": "epoch 449"
            },
            {
              "x": 450,
              "y": 1.4400055339854014,
              "label": "epoch 450"
            },
            {
              "x": 451,
              "y": 1.842954187261823,
              "label": "epoch 451"
            },
            {
              "x": 452,
              "y": 1.5074579963754666,
              "label": "epoch 452"
            },
            {
              "x": 453,
              "y": 1.7742008522250934,
              "label": "epoch 453"
            },
            {
              "x": 454,
              "y": 1.714648314114464,
              "label": "epoch 454"
            },
            {
              "x": 455,
              "y": 1.6429836406421505,
              "label": "epoch 455"
            },
            {
              "x": 456,
              "y": 1.9312921222176795,
              "label": "epoch 456"
            },
            {
              "x": 457,
              "y": 1.5814491168252731,
              "label": "epoch 457"
            },
            {
              "x": 458,
              "y": 1.8023530088708197,
              "label": "epoch 458"
            },
            {
              "x": 459,
              "y": 1.487269221749892,
              "label": "epoch 459"
            },
            {
              "x": 460,
              "y": 1.7480672617491924,
              "label": "epoch 460"
            },
            {
              "x": 461,
              "y": 1.8405343322573524,
              "label": "epoch 461"
            },
            {
              "x": 462,
              "y": 1.6566056292626614,
              "label": "epoch 462"
            },
            {
              "x": 463,
              "y": 1.6803839270785255,
              "label": "epoch 463"
            },
            {
              "x": 464,
              "y": 1.682725512005977,
              "label": "epoch 464"
            },
            {
              "x": 465,
              "y": 1.5794117262488918,
              "label": "epoch 465"
            },
            {
              "x": 466,
              "y": 1.5518832745300115,
              "label": "epoch 466"
            },
            {
              "x": 467,
              "y": 1.4938477770131278,
              "label": "epoch 467"
            },
            {
              "x": 468,
              "y": 1.8607381174929047,
              "label": "epoch 468"
            },
            {
              "x": 469,
              "y": 1.6944110714217746,
              "label": "epoch 469"
            },
            {
              "x": 470,
              "y": 1.7552128858300613,
              "label": "epoch 470"
            },
            {
              "x": 471,
              "y": 1.447006267078809,
              "label": "epoch 471"
            },
            {
              "x": 472,
              "y": 1.5301123138419108,
              "label": "epoch 472"
            },
            {
              "x": 473,
              "y": 1.5995879246926819,
              "label": "epoch 473"
            },
            {
              "x": 474,
              "y": 1.6705540478180505,
              "label": "epoch 474"
            },
            {
              "x": 475,
              "y": 1.6827423779146844,
              "label": "epoch 475"
            },
            {
              "x": 476,
              "y": 1.5282328261895792,
              "label": "epoch 476"
            },
            {
              "x": 477,
              "y": 1.8904600659826476,
              "label": "epoch 477"
            },
            {
              "x": 478,
              "y": 1.703831814315268,
              "label": "epoch 478"
            },
            {
              "x": 479,
              "y": 1.726648441662914,
              "label": "epoch 479"
            },
            {
              "x": 480,
              "y": 1.7667041283198877,
              "label": "epoch 480"
            },
            {
              "x": 481,
              "y": 1.5683377666496916,
              "label": "epoch 481"
            },
            {
              "x": 482,
              "y": 1.5494545324656523,
              "label": "epoch 482"
            },
            {
              "x": 483,
              "y": 1.5967467176654424,
              "label": "epoch 483"
            },
            {
              "x": 484,
              "y": 1.786340750619083,
              "label": "epoch 484"
            },
            {
              "x": 485,
              "y": 1.6716658029656268,
              "label": "epoch 485"
            },
            {
              "x": 486,
              "y": 1.6614295706447018,
              "label": "epoch 486"
            },
            {
              "x": 487,
              "y": 1.7439982498701858,
              "label": "epoch 487"
            },
            {
              "x": 488,
              "y": 1.6601135016566044,
              "label": "epoch 488"
            },
            {
              "x": 489,
              "y": 1.678948500365215,
              "label": "epoch 489"
            },
            {
              "x": 490,
              "y": 1.4344791220501065,
              "label": "epoch 490"
            },
            {
              "x": 491,
              "y": 1.733972992797039,
              "label": "epoch 491"
            },
            {
              "x": 492,
              "y": 1.6479065041547936,
              "label": "epoch 492"
            },
            {
              "x": 493,
              "y": 1.5452577660448457,
              "label": "epoch 493"
            },
            {
              "x": 494,
              "y": 1.703324574192888,
              "label": "epoch 494"
            },
            {
              "x": 495,
              "y": 1.595515463060062,
              "label": "epoch 495"
            },
            {
              "x": 496,
              "y": 1.8189190769764154,
              "label": "epoch 496"
            },
            {
              "x": 497,
              "y": 1.8159718683210055,
              "label": "epoch 497"
            },
            {
              "x": 498,
              "y": 1.5269644329030263,
              "label": "epoch 498"
            },
            {
              "x": 499,
              "y": 1.749937889656346,
              "label": "epoch 499"
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
            },
            {
              "x": 268,
              "y": 0.00423872646474353,
              "label": "epoch 268"
            },
            {
              "x": 269,
              "y": 0.0042347145407754735,
              "label": "epoch 269"
            },
            {
              "x": 270,
              "y": 0.004227157092827838,
              "label": "epoch 270"
            },
            {
              "x": 271,
              "y": 0.004233951614112716,
              "label": "epoch 271"
            },
            {
              "x": 272,
              "y": 0.004238126238832544,
              "label": "epoch 272"
            },
            {
              "x": 273,
              "y": 0.004234300260386111,
              "label": "epoch 273"
            },
            {
              "x": 274,
              "y": 0.004231464277453549,
              "label": "epoch 274"
            },
            {
              "x": 275,
              "y": 0.004242533315463285,
              "label": "epoch 275"
            },
            {
              "x": 276,
              "y": 0.004233360657005841,
              "label": "epoch 276"
            },
            {
              "x": 277,
              "y": 0.004233860966020362,
              "label": "epoch 277"
            },
            {
              "x": 278,
              "y": 0.004241472456334649,
              "label": "epoch 278"
            },
            {
              "x": 279,
              "y": 0.004225270052541562,
              "label": "epoch 279"
            },
            {
              "x": 280,
              "y": 0.004223480261172976,
              "label": "epoch 280"
            },
            {
              "x": 281,
              "y": 0.004250982920654535,
              "label": "epoch 281"
            },
            {
              "x": 282,
              "y": 0.00423421970864231,
              "label": "epoch 282"
            },
            {
              "x": 283,
              "y": 0.004234135440798893,
              "label": "epoch 283"
            },
            {
              "x": 284,
              "y": 0.004227203362939977,
              "label": "epoch 284"
            },
            {
              "x": 285,
              "y": 0.0042267261240723246,
              "label": "epoch 285"
            },
            {
              "x": 286,
              "y": 0.004208771573949458,
              "label": "epoch 286"
            },
            {
              "x": 287,
              "y": 0.00418990267452931,
              "label": "epoch 287"
            },
            {
              "x": 288,
              "y": 0.004201305832171592,
              "label": "epoch 288"
            },
            {
              "x": 289,
              "y": 0.004212349316635243,
              "label": "epoch 289"
            },
            {
              "x": 290,
              "y": 0.00419506569520117,
              "label": "epoch 290"
            },
            {
              "x": 291,
              "y": 0.004187543032458052,
              "label": "epoch 291"
            },
            {
              "x": 292,
              "y": 0.004211454685948985,
              "label": "epoch 292"
            },
            {
              "x": 293,
              "y": 0.004181710431064283,
              "label": "epoch 293"
            },
            {
              "x": 294,
              "y": 0.004161680956282285,
              "label": "epoch 294"
            },
            {
              "x": 295,
              "y": 0.0041851367752410865,
              "label": "epoch 295"
            },
            {
              "x": 296,
              "y": 0.004165858237492533,
              "label": "epoch 296"
            },
            {
              "x": 297,
              "y": 0.004168677618221601,
              "label": "epoch 297"
            },
            {
              "x": 298,
              "y": 0.004175173378730267,
              "label": "epoch 298"
            },
            {
              "x": 299,
              "y": 0.0041737557246386515,
              "label": "epoch 299"
            },
            {
              "x": 300,
              "y": 0.004162223195108757,
              "label": "epoch 300"
            },
            {
              "x": 301,
              "y": 0.004176985158042761,
              "label": "epoch 301"
            },
            {
              "x": 302,
              "y": 0.004185480988158624,
              "label": "epoch 302"
            },
            {
              "x": 303,
              "y": 0.004177549915958049,
              "label": "epoch 303"
            },
            {
              "x": 304,
              "y": 0.00418582262347244,
              "label": "epoch 304"
            },
            {
              "x": 305,
              "y": 0.004181980562479063,
              "label": "epoch 305"
            },
            {
              "x": 306,
              "y": 0.00416472999112509,
              "label": "epoch 306"
            },
            {
              "x": 307,
              "y": 0.004156693803164863,
              "label": "epoch 307"
            },
            {
              "x": 308,
              "y": 0.004175946162400865,
              "label": "epoch 308"
            },
            {
              "x": 309,
              "y": 0.004173253225943833,
              "label": "epoch 309"
            },
            {
              "x": 310,
              "y": 0.00417767181313952,
              "label": "epoch 310"
            },
            {
              "x": 311,
              "y": 0.004155193096314753,
              "label": "epoch 311"
            },
            {
              "x": 312,
              "y": 0.004184041578953743,
              "label": "epoch 312"
            },
            {
              "x": 313,
              "y": 0.0041537999614344075,
              "label": "epoch 313"
            },
            {
              "x": 314,
              "y": 0.004184994317352232,
              "label": "epoch 314"
            },
            {
              "x": 315,
              "y": 0.004156772319555258,
              "label": "epoch 315"
            },
            {
              "x": 316,
              "y": 0.004166653827843747,
              "label": "epoch 316"
            },
            {
              "x": 317,
              "y": 0.0041777181069942585,
              "label": "epoch 317"
            },
            {
              "x": 318,
              "y": 0.004186433836079423,
              "label": "epoch 318"
            },
            {
              "x": 319,
              "y": 0.004188878179487993,
              "label": "epoch 319"
            },
            {
              "x": 320,
              "y": 0.004190575967138437,
              "label": "epoch 320"
            },
            {
              "x": 321,
              "y": 0.004191908751779824,
              "label": "epoch 321"
            },
            {
              "x": 322,
              "y": 0.004174269424478744,
              "label": "epoch 322"
            },
            {
              "x": 323,
              "y": 0.004170858960270907,
              "label": "epoch 323"
            },
            {
              "x": 324,
              "y": 0.004188254914065749,
              "label": "epoch 324"
            },
            {
              "x": 325,
              "y": 0.004198104525321948,
              "label": "epoch 325"
            },
            {
              "x": 326,
              "y": 0.0042013778702790945,
              "label": "epoch 326"
            },
            {
              "x": 327,
              "y": 0.004213951097259077,
              "label": "epoch 327"
            },
            {
              "x": 328,
              "y": 0.004200700985261631,
              "label": "epoch 328"
            },
            {
              "x": 329,
              "y": 0.004204633546913483,
              "label": "epoch 329"
            },
            {
              "x": 330,
              "y": 0.004201191542961169,
              "label": "epoch 330"
            },
            {
              "x": 331,
              "y": 0.004212017698400335,
              "label": "epoch 331"
            },
            {
              "x": 332,
              "y": 0.004210454512136302,
              "label": "epoch 332"
            },
            {
              "x": 333,
              "y": 0.004205156814254894,
              "label": "epoch 333"
            },
            {
              "x": 334,
              "y": 0.0042250135712062105,
              "label": "epoch 334"
            },
            {
              "x": 335,
              "y": 0.004204930196513152,
              "label": "epoch 335"
            },
            {
              "x": 336,
              "y": 0.004218436388519446,
              "label": "epoch 336"
            },
            {
              "x": 337,
              "y": 0.004226499620448234,
              "label": "epoch 337"
            },
            {
              "x": 338,
              "y": 0.004212610006154711,
              "label": "epoch 338"
            },
            {
              "x": 339,
              "y": 0.004208592018250401,
              "label": "epoch 339"
            },
            {
              "x": 340,
              "y": 0.004219303156500437,
              "label": "epoch 340"
            },
            {
              "x": 341,
              "y": 0.0042293562667174755,
              "label": "epoch 341"
            },
            {
              "x": 342,
              "y": 0.004228437326673884,
              "label": "epoch 342"
            },
            {
              "x": 343,
              "y": 0.004219250524137782,
              "label": "epoch 343"
            },
            {
              "x": 344,
              "y": 0.004218115064998672,
              "label": "epoch 344"
            },
            {
              "x": 345,
              "y": 0.004212083007012935,
              "label": "epoch 345"
            },
            {
              "x": 346,
              "y": 0.00422011153530452,
              "label": "epoch 346"
            },
            {
              "x": 347,
              "y": 0.004210734431245855,
              "label": "epoch 347"
            },
            {
              "x": 348,
              "y": 0.004214158880610117,
              "label": "epoch 348"
            },
            {
              "x": 349,
              "y": 0.00421202221945063,
              "label": "epoch 349"
            },
            {
              "x": 350,
              "y": 0.0042381994770901085,
              "label": "epoch 350"
            },
            {
              "x": 351,
              "y": 0.004223673801645514,
              "label": "epoch 351"
            },
            {
              "x": 352,
              "y": 0.004215543727025904,
              "label": "epoch 352"
            },
            {
              "x": 353,
              "y": 0.004194995781290345,
              "label": "epoch 353"
            },
            {
              "x": 354,
              "y": 0.004205410723730701,
              "label": "epoch 354"
            },
            {
              "x": 355,
              "y": 0.004207501526061127,
              "label": "epoch 355"
            },
            {
              "x": 356,
              "y": 0.004220540264213923,
              "label": "epoch 356"
            },
            {
              "x": 357,
              "y": 0.004217652352771869,
              "label": "epoch 357"
            },
            {
              "x": 358,
              "y": 0.004216048485479979,
              "label": "epoch 358"
            },
            {
              "x": 359,
              "y": 0.004221527596344363,
              "label": "epoch 359"
            },
            {
              "x": 360,
              "y": 0.004234749210713505,
              "label": "epoch 360"
            },
            {
              "x": 361,
              "y": 0.0042434231650795,
              "label": "epoch 361"
            },
            {
              "x": 362,
              "y": 0.004231511896681408,
              "label": "epoch 362"
            },
            {
              "x": 363,
              "y": 0.004241787111248796,
              "label": "epoch 363"
            },
            {
              "x": 364,
              "y": 0.004224640513329129,
              "label": "epoch 364"
            },
            {
              "x": 365,
              "y": 0.004228882671955752,
              "label": "epoch 365"
            },
            {
              "x": 366,
              "y": 0.0042262333426103735,
              "label": "epoch 366"
            },
            {
              "x": 367,
              "y": 0.004222662072080359,
              "label": "epoch 367"
            },
            {
              "x": 368,
              "y": 0.00421209845233917,
              "label": "epoch 368"
            },
            {
              "x": 369,
              "y": 0.004211106140773106,
              "label": "epoch 369"
            },
            {
              "x": 370,
              "y": 0.004208684502947635,
              "label": "epoch 370"
            },
            {
              "x": 371,
              "y": 0.0042034408010965165,
              "label": "epoch 371"
            },
            {
              "x": 372,
              "y": 0.004218835331573102,
              "label": "epoch 372"
            },
            {
              "x": 373,
              "y": 0.004219922792751612,
              "label": "epoch 373"
            },
            {
              "x": 374,
              "y": 0.004222971316745603,
              "label": "epoch 374"
            },
            {
              "x": 375,
              "y": 0.004228278215649832,
              "label": "epoch 375"
            },
            {
              "x": 376,
              "y": 0.004229114814446994,
              "label": "epoch 376"
            },
            {
              "x": 377,
              "y": 0.004224346171739805,
              "label": "epoch 377"
            },
            {
              "x": 378,
              "y": 0.004214909274244411,
              "label": "epoch 378"
            },
            {
              "x": 379,
              "y": 0.004230048686287391,
              "label": "epoch 379"
            },
            {
              "x": 380,
              "y": 0.00422476599947243,
              "label": "epoch 380"
            },
            {
              "x": 381,
              "y": 0.004228641282871219,
              "label": "epoch 381"
            },
            {
              "x": 382,
              "y": 0.004228221371273608,
              "label": "epoch 382"
            },
            {
              "x": 383,
              "y": 0.0042169048944120545,
              "label": "epoch 383"
            },
            {
              "x": 384,
              "y": 0.004215380888413883,
              "label": "epoch 384"
            },
            {
              "x": 385,
              "y": 0.0042004704465446255,
              "label": "epoch 385"
            },
            {
              "x": 386,
              "y": 0.004199244439261843,
              "label": "epoch 386"
            },
            {
              "x": 387,
              "y": 0.004206049851506434,
              "label": "epoch 387"
            },
            {
              "x": 388,
              "y": 0.004205707166539996,
              "label": "epoch 388"
            },
            {
              "x": 389,
              "y": 0.004190792532187372,
              "label": "epoch 389"
            },
            {
              "x": 390,
              "y": 0.0041983344654957025,
              "label": "epoch 390"
            },
            {
              "x": 391,
              "y": 0.0042099067014580785,
              "label": "epoch 391"
            },
            {
              "x": 392,
              "y": 0.00421064731697123,
              "label": "epoch 392"
            },
            {
              "x": 393,
              "y": 0.004211200341447501,
              "label": "epoch 393"
            },
            {
              "x": 394,
              "y": 0.004177523735147827,
              "label": "epoch 394"
            },
            {
              "x": 395,
              "y": 0.004194245545429447,
              "label": "epoch 395"
            },
            {
              "x": 396,
              "y": 0.004182984016216851,
              "label": "epoch 396"
            },
            {
              "x": 397,
              "y": 0.004173796155986278,
              "label": "epoch 397"
            },
            {
              "x": 398,
              "y": 0.004185498249793646,
              "label": "epoch 398"
            },
            {
              "x": 399,
              "y": 0.004187247451275317,
              "label": "epoch 399"
            },
            {
              "x": 400,
              "y": 0.00417903118489592,
              "label": "epoch 400"
            },
            {
              "x": 401,
              "y": 0.004169142327890241,
              "label": "epoch 401"
            },
            {
              "x": 402,
              "y": 0.0041851410669072435,
              "label": "epoch 402"
            },
            {
              "x": 403,
              "y": 0.004178597886685135,
              "label": "epoch 403"
            },
            {
              "x": 404,
              "y": 0.004188611683754348,
              "label": "epoch 404"
            },
            {
              "x": 405,
              "y": 0.004189753145175545,
              "label": "epoch 405"
            },
            {
              "x": 406,
              "y": 0.004199766826978272,
              "label": "epoch 406"
            },
            {
              "x": 407,
              "y": 0.004170414187109073,
              "label": "epoch 407"
            },
            {
              "x": 408,
              "y": 0.004186890798767931,
              "label": "epoch 408"
            },
            {
              "x": 409,
              "y": 0.00417356524657838,
              "label": "epoch 409"
            },
            {
              "x": 410,
              "y": 0.004182380483574602,
              "label": "epoch 410"
            },
            {
              "x": 411,
              "y": 0.004173847122537585,
              "label": "epoch 411"
            },
            {
              "x": 412,
              "y": 0.004165718053531907,
              "label": "epoch 412"
            },
            {
              "x": 413,
              "y": 0.004167322628889356,
              "label": "epoch 413"
            },
            {
              "x": 414,
              "y": 0.004166161060167819,
              "label": "epoch 414"
            },
            {
              "x": 415,
              "y": 0.004174614340100609,
              "label": "epoch 415"
            },
            {
              "x": 416,
              "y": 0.004164786191770537,
              "label": "epoch 416"
            },
            {
              "x": 417,
              "y": 0.004169511297062088,
              "label": "epoch 417"
            },
            {
              "x": 418,
              "y": 0.004161013225951281,
              "label": "epoch 418"
            },
            {
              "x": 419,
              "y": 0.004162257820242207,
              "label": "epoch 419"
            },
            {
              "x": 420,
              "y": 0.0041746022145257725,
              "label": "epoch 420"
            },
            {
              "x": 421,
              "y": 0.004164453162765743,
              "label": "epoch 421"
            },
            {
              "x": 422,
              "y": 0.004171066610739983,
              "label": "epoch 422"
            },
            {
              "x": 423,
              "y": 0.004176636018918974,
              "label": "epoch 423"
            },
            {
              "x": 424,
              "y": 0.004161220133506791,
              "label": "epoch 424"
            },
            {
              "x": 425,
              "y": 0.004174124981785242,
              "label": "epoch 425"
            },
            {
              "x": 426,
              "y": 0.004173125835414363,
              "label": "epoch 426"
            },
            {
              "x": 427,
              "y": 0.004170611647790984,
              "label": "epoch 427"
            },
            {
              "x": 428,
              "y": 0.004174340178188255,
              "label": "epoch 428"
            },
            {
              "x": 429,
              "y": 0.004175345212340625,
              "label": "epoch 429"
            },
            {
              "x": 430,
              "y": 0.004172358770263504,
              "label": "epoch 430"
            },
            {
              "x": 431,
              "y": 0.004178409065245528,
              "label": "epoch 431"
            },
            {
              "x": 432,
              "y": 0.004168705594661572,
              "label": "epoch 432"
            },
            {
              "x": 433,
              "y": 0.004175341464073618,
              "label": "epoch 433"
            },
            {
              "x": 434,
              "y": 0.004174465002602358,
              "label": "epoch 434"
            },
            {
              "x": 435,
              "y": 0.0041729436381597465,
              "label": "epoch 435"
            },
            {
              "x": 436,
              "y": 0.004171975368272366,
              "label": "epoch 436"
            },
            {
              "x": 437,
              "y": 0.004175238681981634,
              "label": "epoch 437"
            },
            {
              "x": 438,
              "y": 0.004182034138801483,
              "label": "epoch 438"
            },
            {
              "x": 439,
              "y": 0.0041806493482956855,
              "label": "epoch 439"
            },
            {
              "x": 440,
              "y": 0.004181648618740789,
              "label": "epoch 440"
            },
            {
              "x": 441,
              "y": 0.00417727786981758,
              "label": "epoch 441"
            },
            {
              "x": 442,
              "y": 0.004179512374991502,
              "label": "epoch 442"
            },
            {
              "x": 443,
              "y": 0.004176121082931978,
              "label": "epoch 443"
            },
            {
              "x": 444,
              "y": 0.0041795987363959855,
              "label": "epoch 444"
            },
            {
              "x": 445,
              "y": 0.0041858263950991,
              "label": "epoch 445"
            },
            {
              "x": 446,
              "y": 0.004186897026604703,
              "label": "epoch 446"
            },
            {
              "x": 447,
              "y": 0.004185185754307129,
              "label": "epoch 447"
            },
            {
              "x": 448,
              "y": 0.004182086784184273,
              "label": "epoch 448"
            },
            {
              "x": 449,
              "y": 0.004182777047007173,
              "label": "epoch 449"
            },
            {
              "x": 450,
              "y": 0.0041796939924671804,
              "label": "epoch 450"
            },
            {
              "x": 451,
              "y": 0.004179652719023197,
              "label": "epoch 451"
            },
            {
              "x": 452,
              "y": 0.004178602235793062,
              "label": "epoch 452"
            },
            {
              "x": 453,
              "y": 0.0041740681802988734,
              "label": "epoch 453"
            },
            {
              "x": 454,
              "y": 0.004180353838340747,
              "label": "epoch 454"
            },
            {
              "x": 455,
              "y": 0.004174635377574687,
              "label": "epoch 455"
            },
            {
              "x": 456,
              "y": 0.00418406169506182,
              "label": "epoch 456"
            },
            {
              "x": 457,
              "y": 0.004185566890794833,
              "label": "epoch 457"
            },
            {
              "x": 458,
              "y": 0.004172732914938885,
              "label": "epoch 458"
            },
            {
              "x": 459,
              "y": 0.004176031646860984,
              "label": "epoch 459"
            },
            {
              "x": 460,
              "y": 0.004169683726152135,
              "label": "epoch 460"
            },
            {
              "x": 461,
              "y": 0.0041735740550824345,
              "label": "epoch 461"
            },
            {
              "x": 462,
              "y": 0.0041780645134215436,
              "label": "epoch 462"
            },
            {
              "x": 463,
              "y": 0.004170525476327289,
              "label": "epoch 463"
            },
            {
              "x": 464,
              "y": 0.00417299372049073,
              "label": "epoch 464"
            },
            {
              "x": 465,
              "y": 0.004174387633515596,
              "label": "epoch 465"
            },
            {
              "x": 466,
              "y": 0.004174723176938163,
              "label": "epoch 466"
            },
            {
              "x": 467,
              "y": 0.004176551352812615,
              "label": "epoch 467"
            },
            {
              "x": 468,
              "y": 0.004173859039024376,
              "label": "epoch 468"
            },
            {
              "x": 469,
              "y": 0.004177159346765716,
              "label": "epoch 469"
            },
            {
              "x": 470,
              "y": 0.0041756758368329,
              "label": "epoch 470"
            },
            {
              "x": 471,
              "y": 0.004176497618333853,
              "label": "epoch 471"
            },
            {
              "x": 472,
              "y": 0.004177502371021546,
              "label": "epoch 472"
            },
            {
              "x": 473,
              "y": 0.004174890870911584,
              "label": "epoch 473"
            },
            {
              "x": 474,
              "y": 0.004174887716209541,
              "label": "epoch 474"
            },
            {
              "x": 475,
              "y": 0.004173819518703232,
              "label": "epoch 475"
            },
            {
              "x": 476,
              "y": 0.004174827025532355,
              "label": "epoch 476"
            },
            {
              "x": 477,
              "y": 0.004174826170415862,
              "label": "epoch 477"
            },
            {
              "x": 478,
              "y": 0.004173443175539815,
              "label": "epoch 478"
            },
            {
              "x": 479,
              "y": 0.004167905149331905,
              "label": "epoch 479"
            },
            {
              "x": 480,
              "y": 0.004172735049858028,
              "label": "epoch 480"
            },
            {
              "x": 481,
              "y": 0.004178099834749254,
              "label": "epoch 481"
            },
            {
              "x": 482,
              "y": 0.004171623726602104,
              "label": "epoch 482"
            },
            {
              "x": 483,
              "y": 0.004173256031016966,
              "label": "epoch 483"
            },
            {
              "x": 484,
              "y": 0.004173276199205583,
              "label": "epoch 484"
            },
            {
              "x": 485,
              "y": 0.004176075613941066,
              "label": "epoch 485"
            },
            {
              "x": 486,
              "y": 0.004172609757102021,
              "label": "epoch 486"
            },
            {
              "x": 487,
              "y": 0.004172811558084122,
              "label": "epoch 487"
            },
            {
              "x": 488,
              "y": 0.004174581296147632,
              "label": "epoch 488"
            },
            {
              "x": 489,
              "y": 0.004178538002107464,
              "label": "epoch 489"
            },
            {
              "x": 490,
              "y": 0.004173545849258325,
              "label": "epoch 490"
            },
            {
              "x": 491,
              "y": 0.004179282673392568,
              "label": "epoch 491"
            },
            {
              "x": 492,
              "y": 0.004169728358024976,
              "label": "epoch 492"
            },
            {
              "x": 493,
              "y": 0.004168466343942687,
              "label": "epoch 493"
            },
            {
              "x": 494,
              "y": 0.004178931436112371,
              "label": "epoch 494"
            },
            {
              "x": 495,
              "y": 0.004166469261690509,
              "label": "epoch 495"
            },
            {
              "x": 496,
              "y": 0.004175285230494889,
              "label": "epoch 496"
            },
            {
              "x": 497,
              "y": 0.004171556137551211,
              "label": "epoch 497"
            },
            {
              "x": 498,
              "y": 0.004166641827109025,
              "label": "epoch 498"
            },
            {
              "x": 499,
              "y": 0.004175552111854286,
              "label": "epoch 499"
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
            },
            {
              "x": 268,
              "y": 0.06353853020405759,
              "label": "epoch 268"
            },
            {
              "x": 269,
              "y": 0.06359141319588066,
              "label": "epoch 269"
            },
            {
              "x": 270,
              "y": 0.06367675607716113,
              "label": "epoch 270"
            },
            {
              "x": 271,
              "y": 0.06379933862014073,
              "label": "epoch 271"
            },
            {
              "x": 272,
              "y": 0.06374322514219737,
              "label": "epoch 272"
            },
            {
              "x": 273,
              "y": 0.06376215040080224,
              "label": "epoch 273"
            },
            {
              "x": 274,
              "y": 0.06371964973196124,
              "label": "epoch 274"
            },
            {
              "x": 275,
              "y": 0.0637857630252639,
              "label": "epoch 275"
            },
            {
              "x": 276,
              "y": 0.06389250513817196,
              "label": "epoch 276"
            },
            {
              "x": 277,
              "y": 0.06386927693950527,
              "label": "epoch 277"
            },
            {
              "x": 278,
              "y": 0.0638366085787359,
              "label": "epoch 278"
            },
            {
              "x": 279,
              "y": 0.06381453191715991,
              "label": "epoch 279"
            },
            {
              "x": 280,
              "y": 0.0638529589144271,
              "label": "epoch 280"
            },
            {
              "x": 281,
              "y": 0.06391081078848067,
              "label": "epoch 281"
            },
            {
              "x": 282,
              "y": 0.06392273022241793,
              "label": "epoch 282"
            },
            {
              "x": 283,
              "y": 0.06380792060946605,
              "label": "epoch 283"
            },
            {
              "x": 284,
              "y": 0.06397317018490867,
              "label": "epoch 284"
            },
            {
              "x": 285,
              "y": 0.06395729645239619,
              "label": "epoch 285"
            },
            {
              "x": 286,
              "y": 0.06390302764454023,
              "label": "epoch 286"
            },
            {
              "x": 287,
              "y": 0.0638844779030861,
              "label": "epoch 287"
            },
            {
              "x": 288,
              "y": 0.0638535515953615,
              "label": "epoch 288"
            },
            {
              "x": 289,
              "y": 0.06390515519294575,
              "label": "epoch 289"
            },
            {
              "x": 290,
              "y": 0.0638196052,
              "label": "epoch 290"
            },
            {
              "x": 291,
              "y": 0.06373411363127066,
              "label": "epoch 291"
            },
            {
              "x": 292,
              "y": 0.06375522422948914,
              "label": "epoch 292"
            },
            {
              "x": 293,
              "y": 0.06368828399047886,
              "label": "epoch 293"
            },
            {
              "x": 294,
              "y": 0.06367871932257242,
              "label": "epoch 294"
            },
            {
              "x": 295,
              "y": 0.06368970179698265,
              "label": "epoch 295"
            },
            {
              "x": 296,
              "y": 0.06372340524218376,
              "label": "epoch 296"
            },
            {
              "x": 297,
              "y": 0.06362992487457202,
              "label": "epoch 297"
            },
            {
              "x": 298,
              "y": 0.06363135109801844,
              "label": "epoch 298"
            },
            {
              "x": 299,
              "y": 0.0635794792966695,
              "label": "epoch 299"
            },
            {
              "x": 300,
              "y": 0.06355039233006353,
              "label": "epoch 300"
            },
            {
              "x": 301,
              "y": 0.06364048701671939,
              "label": "epoch 301"
            },
            {
              "x": 302,
              "y": 0.06364628889882863,
              "label": "epoch 302"
            },
            {
              "x": 303,
              "y": 0.06363429413460453,
              "label": "epoch 303"
            },
            {
              "x": 304,
              "y": 0.06362649247067136,
              "label": "epoch 304"
            },
            {
              "x": 305,
              "y": 0.0636359618154912,
              "label": "epoch 305"
            },
            {
              "x": 306,
              "y": 0.06373712980099586,
              "label": "epoch 306"
            },
            {
              "x": 307,
              "y": 0.06358837356885105,
              "label": "epoch 307"
            },
            {
              "x": 308,
              "y": 0.0635765903919635,
              "label": "epoch 308"
            },
            {
              "x": 309,
              "y": 0.0636266548769383,
              "label": "epoch 309"
            },
            {
              "x": 310,
              "y": 0.06362888773429931,
              "label": "epoch 310"
            },
            {
              "x": 311,
              "y": 0.06362603000697593,
              "label": "epoch 311"
            },
            {
              "x": 312,
              "y": 0.06370034705469152,
              "label": "epoch 312"
            },
            {
              "x": 313,
              "y": 0.06365426684696056,
              "label": "epoch 313"
            },
            {
              "x": 314,
              "y": 0.06359574262464057,
              "label": "epoch 314"
            },
            {
              "x": 315,
              "y": 0.06359608819126918,
              "label": "epoch 315"
            },
            {
              "x": 316,
              "y": 0.06374705245482466,
              "label": "epoch 316"
            },
            {
              "x": 317,
              "y": 0.06367883168039905,
              "label": "epoch 317"
            },
            {
              "x": 318,
              "y": 0.06368039113505419,
              "label": "epoch 318"
            },
            {
              "x": 319,
              "y": 0.06373951486717774,
              "label": "epoch 319"
            },
            {
              "x": 320,
              "y": 0.06374251005150941,
              "label": "epoch 320"
            },
            {
              "x": 321,
              "y": 0.06374710343477905,
              "label": "epoch 321"
            },
            {
              "x": 322,
              "y": 0.06373904164368134,
              "label": "epoch 322"
            },
            {
              "x": 323,
              "y": 0.06373902997764067,
              "label": "epoch 323"
            },
            {
              "x": 324,
              "y": 0.06376551854421116,
              "label": "epoch 324"
            },
            {
              "x": 325,
              "y": 0.06376858327961313,
              "label": "epoch 325"
            },
            {
              "x": 326,
              "y": 0.06376800301261124,
              "label": "epoch 326"
            },
            {
              "x": 327,
              "y": 0.06384941139721807,
              "label": "epoch 327"
            },
            {
              "x": 328,
              "y": 0.06384133767354988,
              "label": "epoch 328"
            },
            {
              "x": 329,
              "y": 0.063855377477969,
              "label": "epoch 329"
            },
            {
              "x": 330,
              "y": 0.06386332351853764,
              "label": "epoch 330"
            },
            {
              "x": 331,
              "y": 0.06388931407165824,
              "label": "epoch 331"
            },
            {
              "x": 332,
              "y": 0.06389978741533828,
              "label": "epoch 332"
            },
            {
              "x": 333,
              "y": 0.0639105079629333,
              "label": "epoch 333"
            },
            {
              "x": 334,
              "y": 0.06388097519964886,
              "label": "epoch 334"
            },
            {
              "x": 335,
              "y": 0.06390258074373521,
              "label": "epoch 335"
            },
            {
              "x": 336,
              "y": 0.06389646898012295,
              "label": "epoch 336"
            },
            {
              "x": 337,
              "y": 0.06383631319113192,
              "label": "epoch 337"
            },
            {
              "x": 338,
              "y": 0.0638830526657234,
              "label": "epoch 338"
            },
            {
              "x": 339,
              "y": 0.06383765688243377,
              "label": "epoch 339"
            },
            {
              "x": 340,
              "y": 0.06388947560021495,
              "label": "epoch 340"
            },
            {
              "x": 341,
              "y": 0.06388428592962507,
              "label": "epoch 341"
            },
            {
              "x": 342,
              "y": 0.06393223891599949,
              "label": "epoch 342"
            },
            {
              "x": 343,
              "y": 0.06388714350798277,
              "label": "epoch 343"
            },
            {
              "x": 344,
              "y": 0.06386747969793903,
              "label": "epoch 344"
            },
            {
              "x": 345,
              "y": 0.06390190637102933,
              "label": "epoch 345"
            },
            {
              "x": 346,
              "y": 0.0638501308073357,
              "label": "epoch 346"
            },
            {
              "x": 347,
              "y": 0.0638508626631703,
              "label": "epoch 347"
            },
            {
              "x": 348,
              "y": 0.06383512777182132,
              "label": "epoch 348"
            },
            {
              "x": 349,
              "y": 0.06386335996495818,
              "label": "epoch 349"
            },
            {
              "x": 350,
              "y": 0.06384519188539248,
              "label": "epoch 350"
            },
            {
              "x": 351,
              "y": 0.0638117135447254,
              "label": "epoch 351"
            },
            {
              "x": 352,
              "y": 0.06389877478144818,
              "label": "epoch 352"
            },
            {
              "x": 353,
              "y": 0.0638709271040984,
              "label": "epoch 353"
            },
            {
              "x": 354,
              "y": 0.0638025484900266,
              "label": "epoch 354"
            },
            {
              "x": 355,
              "y": 0.06385675284093993,
              "label": "epoch 355"
            },
            {
              "x": 356,
              "y": 0.06385097279646863,
              "label": "epoch 356"
            },
            {
              "x": 357,
              "y": 0.06393816864300261,
              "label": "epoch 357"
            },
            {
              "x": 358,
              "y": 0.06389123750130621,
              "label": "epoch 358"
            },
            {
              "x": 359,
              "y": 0.06390481983965544,
              "label": "epoch 359"
            },
            {
              "x": 360,
              "y": 0.0639391595667755,
              "label": "epoch 360"
            },
            {
              "x": 361,
              "y": 0.06394200941079027,
              "label": "epoch 361"
            },
            {
              "x": 362,
              "y": 0.06393558834756013,
              "label": "epoch 362"
            },
            {
              "x": 363,
              "y": 0.06396233739054112,
              "label": "epoch 363"
            },
            {
              "x": 364,
              "y": 0.06392884890546587,
              "label": "epoch 364"
            },
            {
              "x": 365,
              "y": 0.0638887383100059,
              "label": "epoch 365"
            },
            {
              "x": 366,
              "y": 0.06388320930024124,
              "label": "epoch 366"
            },
            {
              "x": 367,
              "y": 0.06389811484194452,
              "label": "epoch 367"
            },
            {
              "x": 368,
              "y": 0.06386639233670921,
              "label": "epoch 368"
            },
            {
              "x": 369,
              "y": 0.06385790247192122,
              "label": "epoch 369"
            },
            {
              "x": 370,
              "y": 0.0638560984560555,
              "label": "epoch 370"
            },
            {
              "x": 371,
              "y": 0.0638303710199436,
              "label": "epoch 371"
            },
            {
              "x": 372,
              "y": 0.0638534148818412,
              "label": "epoch 372"
            },
            {
              "x": 373,
              "y": 0.06388059244292028,
              "label": "epoch 373"
            },
            {
              "x": 374,
              "y": 0.06385267137451783,
              "label": "epoch 374"
            },
            {
              "x": 375,
              "y": 0.0638803727922909,
              "label": "epoch 375"
            },
            {
              "x": 376,
              "y": 0.06391217893848845,
              "label": "epoch 376"
            },
            {
              "x": 377,
              "y": 0.06388730516635788,
              "label": "epoch 377"
            },
            {
              "x": 378,
              "y": 0.06390903524688359,
              "label": "epoch 378"
            },
            {
              "x": 379,
              "y": 0.06395567580540573,
              "label": "epoch 379"
            },
            {
              "x": 380,
              "y": 0.0639365609410896,
              "label": "epoch 380"
            },
            {
              "x": 381,
              "y": 0.06392148083499419,
              "label": "epoch 381"
            },
            {
              "x": 382,
              "y": 0.0639195529185695,
              "label": "epoch 382"
            },
            {
              "x": 383,
              "y": 0.0639316686842664,
              "label": "epoch 383"
            },
            {
              "x": 384,
              "y": 0.06394847345750589,
              "label": "epoch 384"
            },
            {
              "x": 385,
              "y": 0.0638861038839279,
              "label": "epoch 385"
            },
            {
              "x": 386,
              "y": 0.06392340847416658,
              "label": "epoch 386"
            },
            {
              "x": 387,
              "y": 0.06388888333075508,
              "label": "epoch 387"
            },
            {
              "x": 388,
              "y": 0.06389904096584742,
              "label": "epoch 388"
            },
            {
              "x": 389,
              "y": 0.06389636019268533,
              "label": "epoch 389"
            },
            {
              "x": 390,
              "y": 0.06397170080986382,
              "label": "epoch 390"
            },
            {
              "x": 391,
              "y": 0.06394636926377548,
              "label": "epoch 391"
            },
            {
              "x": 392,
              "y": 0.06399554078559863,
              "label": "epoch 392"
            },
            {
              "x": 393,
              "y": 0.06400055824173921,
              "label": "epoch 393"
            },
            {
              "x": 394,
              "y": 0.06397158572814844,
              "label": "epoch 394"
            },
            {
              "x": 395,
              "y": 0.06398872125723037,
              "label": "epoch 395"
            },
            {
              "x": 396,
              "y": 0.06398229340304265,
              "label": "epoch 396"
            },
            {
              "x": 397,
              "y": 0.06394045088764917,
              "label": "epoch 397"
            },
            {
              "x": 398,
              "y": 0.06394033757265118,
              "label": "epoch 398"
            },
            {
              "x": 399,
              "y": 0.06394844067242382,
              "label": "epoch 399"
            },
            {
              "x": 400,
              "y": 0.06391492881793008,
              "label": "epoch 400"
            },
            {
              "x": 401,
              "y": 0.0638961666451283,
              "label": "epoch 401"
            },
            {
              "x": 402,
              "y": 0.06396747996941006,
              "label": "epoch 402"
            },
            {
              "x": 403,
              "y": 0.06394145202227121,
              "label": "epoch 403"
            },
            {
              "x": 404,
              "y": 0.06398421868135828,
              "label": "epoch 404"
            },
            {
              "x": 405,
              "y": 0.0640268118915724,
              "label": "epoch 405"
            },
            {
              "x": 406,
              "y": 0.06403213262283795,
              "label": "epoch 406"
            },
            {
              "x": 407,
              "y": 0.0640223499706879,
              "label": "epoch 407"
            },
            {
              "x": 408,
              "y": 0.06404023665948587,
              "label": "epoch 408"
            },
            {
              "x": 409,
              "y": 0.06398026281960101,
              "label": "epoch 409"
            },
            {
              "x": 410,
              "y": 0.0639733174759481,
              "label": "epoch 410"
            },
            {
              "x": 411,
              "y": 0.06400023417958628,
              "label": "epoch 411"
            },
            {
              "x": 412,
              "y": 0.06399039867832662,
              "label": "epoch 412"
            },
            {
              "x": 413,
              "y": 0.06401204964200397,
              "label": "epoch 413"
            },
            {
              "x": 414,
              "y": 0.06399952007862005,
              "label": "epoch 414"
            },
            {
              "x": 415,
              "y": 0.0640578965337083,
              "label": "epoch 415"
            },
            {
              "x": 416,
              "y": 0.06400660533912933,
              "label": "epoch 416"
            },
            {
              "x": 417,
              "y": 0.06407306847713219,
              "label": "epoch 417"
            },
            {
              "x": 418,
              "y": 0.06402397836504142,
              "label": "epoch 418"
            },
            {
              "x": 419,
              "y": 0.06404818695514941,
              "label": "epoch 419"
            },
            {
              "x": 420,
              "y": 0.06400775370811491,
              "label": "epoch 420"
            },
            {
              "x": 421,
              "y": 0.06399231224809467,
              "label": "epoch 421"
            },
            {
              "x": 422,
              "y": 0.06404711153970168,
              "label": "epoch 422"
            },
            {
              "x": 423,
              "y": 0.06408853245260329,
              "label": "epoch 423"
            },
            {
              "x": 424,
              "y": 0.06410634352141642,
              "label": "epoch 424"
            },
            {
              "x": 425,
              "y": 0.06405639709364071,
              "label": "epoch 425"
            },
            {
              "x": 426,
              "y": 0.06405134320984392,
              "label": "epoch 426"
            },
            {
              "x": 427,
              "y": 0.06405141575171576,
              "label": "epoch 427"
            },
            {
              "x": 428,
              "y": 0.06407244963798132,
              "label": "epoch 428"
            },
            {
              "x": 429,
              "y": 0.06405442534225203,
              "label": "epoch 429"
            },
            {
              "x": 430,
              "y": 0.06398938733649343,
              "label": "epoch 430"
            },
            {
              "x": 431,
              "y": 0.0640017737320082,
              "label": "epoch 431"
            },
            {
              "x": 432,
              "y": 0.06394755744680113,
              "label": "epoch 432"
            },
            {
              "x": 433,
              "y": 0.0639813187733939,
              "label": "epoch 433"
            },
            {
              "x": 434,
              "y": 0.06393848444790101,
              "label": "epoch 434"
            },
            {
              "x": 435,
              "y": 0.06393786950847195,
              "label": "epoch 435"
            },
            {
              "x": 436,
              "y": 0.06390489792159458,
              "label": "epoch 436"
            },
            {
              "x": 437,
              "y": 0.06392320088228812,
              "label": "epoch 437"
            },
            {
              "x": 438,
              "y": 0.06392171140492121,
              "label": "epoch 438"
            },
            {
              "x": 439,
              "y": 0.06394234987486638,
              "label": "epoch 439"
            },
            {
              "x": 440,
              "y": 0.06392172281343128,
              "label": "epoch 440"
            },
            {
              "x": 441,
              "y": 0.06390038203971926,
              "label": "epoch 441"
            },
            {
              "x": 442,
              "y": 0.06387626510465787,
              "label": "epoch 442"
            },
            {
              "x": 443,
              "y": 0.06388064177793383,
              "label": "epoch 443"
            },
            {
              "x": 444,
              "y": 0.06389928159708354,
              "label": "epoch 444"
            },
            {
              "x": 445,
              "y": 0.06390079472916305,
              "label": "epoch 445"
            },
            {
              "x": 446,
              "y": 0.06392417533176117,
              "label": "epoch 446"
            },
            {
              "x": 447,
              "y": 0.06392044399916286,
              "label": "epoch 447"
            },
            {
              "x": 448,
              "y": 0.06391271709588564,
              "label": "epoch 448"
            },
            {
              "x": 449,
              "y": 0.06391613102153458,
              "label": "epoch 449"
            },
            {
              "x": 450,
              "y": 0.0638956973416498,
              "label": "epoch 450"
            },
            {
              "x": 451,
              "y": 0.06386253583102523,
              "label": "epoch 451"
            },
            {
              "x": 452,
              "y": 0.06387183962751326,
              "label": "epoch 452"
            },
            {
              "x": 453,
              "y": 0.06384251897543436,
              "label": "epoch 453"
            },
            {
              "x": 454,
              "y": 0.06385341743283023,
              "label": "epoch 454"
            },
            {
              "x": 455,
              "y": 0.0638482231948537,
              "label": "epoch 455"
            },
            {
              "x": 456,
              "y": 0.06383793301632211,
              "label": "epoch 456"
            },
            {
              "x": 457,
              "y": 0.06383116933763008,
              "label": "epoch 457"
            },
            {
              "x": 458,
              "y": 0.06384203863337079,
              "label": "epoch 458"
            },
            {
              "x": 459,
              "y": 0.0637832145473926,
              "label": "epoch 459"
            },
            {
              "x": 460,
              "y": 0.0638232279467813,
              "label": "epoch 460"
            },
            {
              "x": 461,
              "y": 0.06382107387999943,
              "label": "epoch 461"
            },
            {
              "x": 462,
              "y": 0.06378871790519425,
              "label": "epoch 462"
            },
            {
              "x": 463,
              "y": 0.06381528751195506,
              "label": "epoch 463"
            },
            {
              "x": 464,
              "y": 0.06382914002939574,
              "label": "epoch 464"
            },
            {
              "x": 465,
              "y": 0.06382642987649122,
              "label": "epoch 465"
            },
            {
              "x": 466,
              "y": 0.06384602517745837,
              "label": "epoch 466"
            },
            {
              "x": 467,
              "y": 0.06385231503449368,
              "label": "epoch 467"
            },
            {
              "x": 468,
              "y": 0.06380455976996975,
              "label": "epoch 468"
            },
            {
              "x": 469,
              "y": 0.06383014221328746,
              "label": "epoch 469"
            },
            {
              "x": 470,
              "y": 0.06382320528179039,
              "label": "epoch 470"
            },
            {
              "x": 471,
              "y": 0.06385896747949453,
              "label": "epoch 471"
            },
            {
              "x": 472,
              "y": 0.06384078181068426,
              "label": "epoch 472"
            },
            {
              "x": 473,
              "y": 0.06380512243374956,
              "label": "epoch 473"
            },
            {
              "x": 474,
              "y": 0.06383493739562446,
              "label": "epoch 474"
            },
            {
              "x": 475,
              "y": 0.06380935575936364,
              "label": "epoch 475"
            },
            {
              "x": 476,
              "y": 0.0637854222385565,
              "label": "epoch 476"
            },
            {
              "x": 477,
              "y": 0.06381961045860264,
              "label": "epoch 477"
            },
            {
              "x": 478,
              "y": 0.06381019586019408,
              "label": "epoch 478"
            },
            {
              "x": 479,
              "y": 0.06379957136308995,
              "label": "epoch 479"
            },
            {
              "x": 480,
              "y": 0.06380150341283297,
              "label": "epoch 480"
            },
            {
              "x": 481,
              "y": 0.06380752650894513,
              "label": "epoch 481"
            },
            {
              "x": 482,
              "y": 0.06381339288667445,
              "label": "epoch 482"
            },
            {
              "x": 483,
              "y": 0.06379708529091563,
              "label": "epoch 483"
            },
            {
              "x": 484,
              "y": 0.0637472163675978,
              "label": "epoch 484"
            },
            {
              "x": 485,
              "y": 0.06378694637226688,
              "label": "epoch 485"
            },
            {
              "x": 486,
              "y": 0.06381101279877935,
              "label": "epoch 486"
            },
            {
              "x": 487,
              "y": 0.06381274687086452,
              "label": "epoch 487"
            },
            {
              "x": 488,
              "y": 0.06379194369391801,
              "label": "epoch 488"
            },
            {
              "x": 489,
              "y": 0.06380039249377564,
              "label": "epoch 489"
            },
            {
              "x": 490,
              "y": 0.06382712627830762,
              "label": "epoch 490"
            },
            {
              "x": 491,
              "y": 0.06378801493720905,
              "label": "epoch 491"
            },
            {
              "x": 492,
              "y": 0.06380467464202268,
              "label": "epoch 492"
            },
            {
              "x": 493,
              "y": 0.06377689514403373,
              "label": "epoch 493"
            },
            {
              "x": 494,
              "y": 0.0638270361339796,
              "label": "epoch 494"
            },
            {
              "x": 495,
              "y": 0.06381811746369319,
              "label": "epoch 495"
            },
            {
              "x": 496,
              "y": 0.06380807218872513,
              "label": "epoch 496"
            },
            {
              "x": 497,
              "y": 0.06380706115056742,
              "label": "epoch 497"
            },
            {
              "x": 498,
              "y": 0.06380123507781384,
              "label": "epoch 498"
            },
            {
              "x": 499,
              "y": 0.06380291511787188,
              "label": "epoch 499"
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
            },
            {
              "x": 268,
              "y": 0.0650382274640181,
              "label": "epoch 268"
            },
            {
              "x": 269,
              "y": 0.06468832858107619,
              "label": "epoch 269"
            },
            {
              "x": 270,
              "y": 0.06512799429922504,
              "label": "epoch 270"
            },
            {
              "x": 271,
              "y": 0.06456814224138964,
              "label": "epoch 271"
            },
            {
              "x": 272,
              "y": 0.06517859934787396,
              "label": "epoch 272"
            },
            {
              "x": 273,
              "y": 0.06479620329563013,
              "label": "epoch 273"
            },
            {
              "x": 274,
              "y": 0.0650267424038439,
              "label": "epoch 274"
            },
            {
              "x": 275,
              "y": 0.06515101485998505,
              "label": "epoch 275"
            },
            {
              "x": 276,
              "y": 0.06508600944273499,
              "label": "epoch 276"
            },
            {
              "x": 277,
              "y": 0.06488112533902479,
              "label": "epoch 277"
            },
            {
              "x": 278,
              "y": 0.06517236390404653,
              "label": "epoch 278"
            },
            {
              "x": 279,
              "y": 0.0651241480614498,
              "label": "epoch 279"
            },
            {
              "x": 280,
              "y": 0.06506917448218162,
              "label": "epoch 280"
            },
            {
              "x": 281,
              "y": 0.06527863090140104,
              "label": "epoch 281"
            },
            {
              "x": 282,
              "y": 0.06462187242807342,
              "label": "epoch 282"
            },
            {
              "x": 283,
              "y": 0.06496739244743828,
              "label": "epoch 283"
            },
            {
              "x": 284,
              "y": 0.06511081481042275,
              "label": "epoch 284"
            },
            {
              "x": 285,
              "y": 0.06511882474957306,
              "label": "epoch 285"
            },
            {
              "x": 286,
              "y": 0.06463698352573481,
              "label": "epoch 286"
            },
            {
              "x": 287,
              "y": 0.0648226385436601,
              "label": "epoch 287"
            },
            {
              "x": 288,
              "y": 0.06535720336275792,
              "label": "epoch 288"
            },
            {
              "x": 289,
              "y": 0.0649255531824906,
              "label": "epoch 289"
            },
            {
              "x": 290,
              "y": 0.06511889626292905,
              "label": "epoch 290"
            },
            {
              "x": 291,
              "y": 0.0649374549749741,
              "label": "epoch 291"
            },
            {
              "x": 292,
              "y": 0.06525415568365875,
              "label": "epoch 292"
            },
            {
              "x": 293,
              "y": 0.06492967090601771,
              "label": "epoch 293"
            },
            {
              "x": 294,
              "y": 0.06466463068847504,
              "label": "epoch 294"
            },
            {
              "x": 295,
              "y": 0.06493405561866139,
              "label": "epoch 295"
            },
            {
              "x": 296,
              "y": 0.064843950823672,
              "label": "epoch 296"
            },
            {
              "x": 297,
              "y": 0.06513539621992274,
              "label": "epoch 297"
            },
            {
              "x": 298,
              "y": 0.06518049355437788,
              "label": "epoch 298"
            },
            {
              "x": 299,
              "y": 0.06498432345154165,
              "label": "epoch 299"
            },
            {
              "x": 300,
              "y": 0.06503707189366244,
              "label": "epoch 300"
            },
            {
              "x": 301,
              "y": 0.06490477081514039,
              "label": "epoch 301"
            },
            {
              "x": 302,
              "y": 0.06536619881879795,
              "label": "epoch 302"
            },
            {
              "x": 303,
              "y": 0.06548446104277535,
              "label": "epoch 303"
            },
            {
              "x": 304,
              "y": 0.0650437580735585,
              "label": "epoch 304"
            },
            {
              "x": 305,
              "y": 0.06534426844172153,
              "label": "epoch 305"
            },
            {
              "x": 306,
              "y": 0.06518090349678567,
              "label": "epoch 306"
            },
            {
              "x": 307,
              "y": 0.06520888927461761,
              "label": "epoch 307"
            },
            {
              "x": 308,
              "y": 0.06537873780680875,
              "label": "epoch 308"
            },
            {
              "x": 309,
              "y": 0.06540076854722536,
              "label": "epoch 309"
            },
            {
              "x": 310,
              "y": 0.06530786077287849,
              "label": "epoch 310"
            },
            {
              "x": 311,
              "y": 0.06532216334245863,
              "label": "epoch 311"
            },
            {
              "x": 312,
              "y": 0.06533711189175799,
              "label": "epoch 312"
            },
            {
              "x": 313,
              "y": 0.06508706458058848,
              "label": "epoch 313"
            },
            {
              "x": 314,
              "y": 0.06508218703717268,
              "label": "epoch 314"
            },
            {
              "x": 315,
              "y": 0.06589161235160645,
              "label": "epoch 315"
            },
            {
              "x": 316,
              "y": 0.0653591665812374,
              "label": "epoch 316"
            },
            {
              "x": 317,
              "y": 0.06560906213624289,
              "label": "epoch 317"
            },
            {
              "x": 318,
              "y": 0.06546817385650397,
              "label": "epoch 318"
            },
            {
              "x": 319,
              "y": 0.06524086835765418,
              "label": "epoch 319"
            },
            {
              "x": 320,
              "y": 0.06535521627282485,
              "label": "epoch 320"
            },
            {
              "x": 321,
              "y": 0.06546869069005218,
              "label": "epoch 321"
            },
            {
              "x": 322,
              "y": 0.06491964929733217,
              "label": "epoch 322"
            },
            {
              "x": 323,
              "y": 0.06543704254798137,
              "label": "epoch 323"
            },
            {
              "x": 324,
              "y": 0.065032438596247,
              "label": "epoch 324"
            },
            {
              "x": 325,
              "y": 0.06508541474666099,
              "label": "epoch 325"
            },
            {
              "x": 326,
              "y": 0.065681399419448,
              "label": "epoch 326"
            },
            {
              "x": 327,
              "y": 0.06523014561705502,
              "label": "epoch 327"
            },
            {
              "x": 328,
              "y": 0.06548711433832691,
              "label": "epoch 328"
            },
            {
              "x": 329,
              "y": 0.06562052516492738,
              "label": "epoch 329"
            },
            {
              "x": 330,
              "y": 0.06573016292589716,
              "label": "epoch 330"
            },
            {
              "x": 331,
              "y": 0.0653089867989132,
              "label": "epoch 331"
            },
            {
              "x": 332,
              "y": 0.06552577532485471,
              "label": "epoch 332"
            },
            {
              "x": 333,
              "y": 0.0649975418727437,
              "label": "epoch 333"
            },
            {
              "x": 334,
              "y": 0.06558986106200923,
              "label": "epoch 334"
            },
            {
              "x": 335,
              "y": 0.06539647770777815,
              "label": "epoch 335"
            },
            {
              "x": 336,
              "y": 0.06515758755572308,
              "label": "epoch 336"
            },
            {
              "x": 337,
              "y": 0.0656168227809321,
              "label": "epoch 337"
            },
            {
              "x": 338,
              "y": 0.06543141900622111,
              "label": "epoch 338"
            },
            {
              "x": 339,
              "y": 0.06546422712953197,
              "label": "epoch 339"
            },
            {
              "x": 340,
              "y": 0.06553068741745817,
              "label": "epoch 340"
            },
            {
              "x": 341,
              "y": 0.06561161017938993,
              "label": "epoch 341"
            },
            {
              "x": 342,
              "y": 0.06562139402914406,
              "label": "epoch 342"
            },
            {
              "x": 343,
              "y": 0.06551153570735162,
              "label": "epoch 343"
            },
            {
              "x": 344,
              "y": 0.06591086246054165,
              "label": "epoch 344"
            },
            {
              "x": 345,
              "y": 0.06590165108768381,
              "label": "epoch 345"
            },
            {
              "x": 346,
              "y": 0.06579695967329706,
              "label": "epoch 346"
            },
            {
              "x": 347,
              "y": 0.06571467185710694,
              "label": "epoch 347"
            },
            {
              "x": 348,
              "y": 0.06563434238634464,
              "label": "epoch 348"
            },
            {
              "x": 349,
              "y": 0.06548259062707391,
              "label": "epoch 349"
            },
            {
              "x": 350,
              "y": 0.06583159398698475,
              "label": "epoch 350"
            },
            {
              "x": 351,
              "y": 0.06550513153243735,
              "label": "epoch 351"
            },
            {
              "x": 352,
              "y": 0.06577978257124073,
              "label": "epoch 352"
            },
            {
              "x": 353,
              "y": 0.06550934710401628,
              "label": "epoch 353"
            },
            {
              "x": 354,
              "y": 0.06576054788301333,
              "label": "epoch 354"
            },
            {
              "x": 355,
              "y": 0.06581501304502972,
              "label": "epoch 355"
            },
            {
              "x": 356,
              "y": 0.06586913154569554,
              "label": "epoch 356"
            },
            {
              "x": 357,
              "y": 0.06568614273691172,
              "label": "epoch 357"
            },
            {
              "x": 358,
              "y": 0.06582136499578739,
              "label": "epoch 358"
            },
            {
              "x": 359,
              "y": 0.06611103220209943,
              "label": "epoch 359"
            },
            {
              "x": 360,
              "y": 0.06603325592152637,
              "label": "epoch 360"
            },
            {
              "x": 361,
              "y": 0.06585438168911806,
              "label": "epoch 361"
            },
            {
              "x": 362,
              "y": 0.06549511789883711,
              "label": "epoch 362"
            },
            {
              "x": 363,
              "y": 0.0657530364959275,
              "label": "epoch 363"
            },
            {
              "x": 364,
              "y": 0.06587106797208339,
              "label": "epoch 364"
            },
            {
              "x": 365,
              "y": 0.06576827961549127,
              "label": "epoch 365"
            },
            {
              "x": 366,
              "y": 0.06580476937817013,
              "label": "epoch 366"
            },
            {
              "x": 367,
              "y": 0.06623587483820502,
              "label": "epoch 367"
            },
            {
              "x": 368,
              "y": 0.06633208953820563,
              "label": "epoch 368"
            },
            {
              "x": 369,
              "y": 0.06582102487332452,
              "label": "epoch 369"
            },
            {
              "x": 370,
              "y": 0.06603865593423731,
              "label": "epoch 370"
            },
            {
              "x": 371,
              "y": 0.06604220640022468,
              "label": "epoch 371"
            },
            {
              "x": 372,
              "y": 0.06582644118511301,
              "label": "epoch 372"
            },
            {
              "x": 373,
              "y": 0.06591923912710747,
              "label": "epoch 373"
            },
            {
              "x": 374,
              "y": 0.06617651441727078,
              "label": "epoch 374"
            },
            {
              "x": 375,
              "y": 0.06585176614898065,
              "label": "epoch 375"
            },
            {
              "x": 376,
              "y": 0.06594251049688593,
              "label": "epoch 376"
            },
            {
              "x": 377,
              "y": 0.06627139321668994,
              "label": "epoch 377"
            },
            {
              "x": 378,
              "y": 0.06624931748674619,
              "label": "epoch 378"
            },
            {
              "x": 379,
              "y": 0.06568915803852686,
              "label": "epoch 379"
            },
            {
              "x": 380,
              "y": 0.0659965612940702,
              "label": "epoch 380"
            },
            {
              "x": 381,
              "y": 0.06578249648665828,
              "label": "epoch 381"
            },
            {
              "x": 382,
              "y": 0.06621368531736793,
              "label": "epoch 382"
            },
            {
              "x": 383,
              "y": 0.0660050602178824,
              "label": "epoch 383"
            },
            {
              "x": 384,
              "y": 0.06627468063955626,
              "label": "epoch 384"
            },
            {
              "x": 385,
              "y": 0.06598829823653468,
              "label": "epoch 385"
            },
            {
              "x": 386,
              "y": 0.06586397737049915,
              "label": "epoch 386"
            },
            {
              "x": 387,
              "y": 0.066112382022608,
              "label": "epoch 387"
            },
            {
              "x": 388,
              "y": 0.06621400162164773,
              "label": "epoch 388"
            },
            {
              "x": 389,
              "y": 0.06606210815335083,
              "label": "epoch 389"
            },
            {
              "x": 390,
              "y": 0.06591273020202387,
              "label": "epoch 390"
            },
            {
              "x": 391,
              "y": 0.06579871954761829,
              "label": "epoch 391"
            },
            {
              "x": 392,
              "y": 0.0657987580502919,
              "label": "epoch 392"
            },
            {
              "x": 393,
              "y": 0.06592653802641547,
              "label": "epoch 393"
            },
            {
              "x": 394,
              "y": 0.0662435904220084,
              "label": "epoch 394"
            },
            {
              "x": 395,
              "y": 0.06592972335184075,
              "label": "epoch 395"
            },
            {
              "x": 396,
              "y": 0.06591018367351496,
              "label": "epoch 396"
            },
            {
              "x": 397,
              "y": 0.0659805340633886,
              "label": "epoch 397"
            },
            {
              "x": 398,
              "y": 0.06596540464871443,
              "label": "epoch 398"
            },
            {
              "x": 399,
              "y": 0.0662517816599042,
              "label": "epoch 399"
            },
            {
              "x": 400,
              "y": 0.06575939619174533,
              "label": "epoch 400"
            },
            {
              "x": 401,
              "y": 0.0657409173015169,
              "label": "epoch 401"
            },
            {
              "x": 402,
              "y": 0.06588795628095985,
              "label": "epoch 402"
            },
            {
              "x": 403,
              "y": 0.06582902118679843,
              "label": "epoch 403"
            },
            {
              "x": 404,
              "y": 0.06591409941428894,
              "label": "epoch 404"
            },
            {
              "x": 405,
              "y": 0.06605286119793088,
              "label": "epoch 405"
            },
            {
              "x": 406,
              "y": 0.0661290396368555,
              "label": "epoch 406"
            },
            {
              "x": 407,
              "y": 0.06578205709735242,
              "label": "epoch 407"
            },
            {
              "x": 408,
              "y": 0.06610959718035608,
              "label": "epoch 408"
            },
            {
              "x": 409,
              "y": 0.06607016544332785,
              "label": "epoch 409"
            },
            {
              "x": 410,
              "y": 0.06634532678305498,
              "label": "epoch 410"
            },
            {
              "x": 411,
              "y": 0.06612830538724823,
              "label": "epoch 411"
            },
            {
              "x": 412,
              "y": 0.06615902101829774,
              "label": "epoch 412"
            },
            {
              "x": 413,
              "y": 0.06624363870821301,
              "label": "epoch 413"
            },
            {
              "x": 414,
              "y": 0.06601648738749931,
              "label": "epoch 414"
            },
            {
              "x": 415,
              "y": 0.06609914586299974,
              "label": "epoch 415"
            },
            {
              "x": 416,
              "y": 0.06622685760538168,
              "label": "epoch 416"
            },
            {
              "x": 417,
              "y": 0.0662149646757451,
              "label": "epoch 417"
            },
            {
              "x": 418,
              "y": 0.06612170242522397,
              "label": "epoch 418"
            },
            {
              "x": 419,
              "y": 0.06605152819455602,
              "label": "epoch 419"
            },
            {
              "x": 420,
              "y": 0.06642201956821032,
              "label": "epoch 420"
            },
            {
              "x": 421,
              "y": 0.06606795985453685,
              "label": "epoch 421"
            },
            {
              "x": 422,
              "y": 0.06665837832937134,
              "label": "epoch 422"
            },
            {
              "x": 423,
              "y": 0.06614411404390845,
              "label": "epoch 423"
            },
            {
              "x": 424,
              "y": 0.06586749120234751,
              "label": "epoch 424"
            },
            {
              "x": 425,
              "y": 0.06656594983608581,
              "label": "epoch 425"
            },
            {
              "x": 426,
              "y": 0.0659593303241911,
              "label": "epoch 426"
            },
            {
              "x": 427,
              "y": 0.0663566712807258,
              "label": "epoch 427"
            },
            {
              "x": 428,
              "y": 0.0664914586539217,
              "label": "epoch 428"
            },
            {
              "x": 429,
              "y": 0.06665215516064536,
              "label": "epoch 429"
            },
            {
              "x": 430,
              "y": 0.0663324603525287,
              "label": "epoch 430"
            },
            {
              "x": 431,
              "y": 0.06660532511908214,
              "label": "epoch 431"
            },
            {
              "x": 432,
              "y": 0.06667174685660159,
              "label": "epoch 432"
            },
            {
              "x": 433,
              "y": 0.06667109314080785,
              "label": "epoch 433"
            },
            {
              "x": 434,
              "y": 0.06658365711061152,
              "label": "epoch 434"
            },
            {
              "x": 435,
              "y": 0.0666058276388638,
              "label": "epoch 435"
            },
            {
              "x": 436,
              "y": 0.06678521832621735,
              "label": "epoch 436"
            },
            {
              "x": 437,
              "y": 0.06637913921548078,
              "label": "epoch 437"
            },
            {
              "x": 438,
              "y": 0.06669251744791127,
              "label": "epoch 438"
            },
            {
              "x": 439,
              "y": 0.06698952646196107,
              "label": "epoch 439"
            },
            {
              "x": 440,
              "y": 0.06640285900021699,
              "label": "epoch 440"
            },
            {
              "x": 441,
              "y": 0.06661802105059778,
              "label": "epoch 441"
            },
            {
              "x": 442,
              "y": 0.06657900335612958,
              "label": "epoch 442"
            },
            {
              "x": 443,
              "y": 0.06696480859770809,
              "label": "epoch 443"
            },
            {
              "x": 444,
              "y": 0.06685514266773901,
              "label": "epoch 444"
            },
            {
              "x": 445,
              "y": 0.06656094087014025,
              "label": "epoch 445"
            },
            {
              "x": 446,
              "y": 0.06658549870910328,
              "label": "epoch 446"
            },
            {
              "x": 447,
              "y": 0.0666798536003906,
              "label": "epoch 447"
            },
            {
              "x": 448,
              "y": 0.06664817265696574,
              "label": "epoch 448"
            },
            {
              "x": 449,
              "y": 0.06668384486156385,
              "label": "epoch 449"
            },
            {
              "x": 450,
              "y": 0.0668762766293358,
              "label": "epoch 450"
            },
            {
              "x": 451,
              "y": 0.06704571022741528,
              "label": "epoch 451"
            },
            {
              "x": 452,
              "y": 0.06693463391029578,
              "label": "epoch 452"
            },
            {
              "x": 453,
              "y": 0.06676201165445743,
              "label": "epoch 453"
            },
            {
              "x": 454,
              "y": 0.06676991202055367,
              "label": "epoch 454"
            },
            {
              "x": 455,
              "y": 0.0667961499592797,
              "label": "epoch 455"
            },
            {
              "x": 456,
              "y": 0.06692044086101209,
              "label": "epoch 456"
            },
            {
              "x": 457,
              "y": 0.06667650615451155,
              "label": "epoch 457"
            },
            {
              "x": 458,
              "y": 0.066656068743335,
              "label": "epoch 458"
            },
            {
              "x": 459,
              "y": 0.0666524036029305,
              "label": "epoch 459"
            },
            {
              "x": 460,
              "y": 0.06639076907445285,
              "label": "epoch 460"
            },
            {
              "x": 461,
              "y": 0.06663662939553093,
              "label": "epoch 461"
            },
            {
              "x": 462,
              "y": 0.06685907809133995,
              "label": "epoch 462"
            },
            {
              "x": 463,
              "y": 0.06661362022453314,
              "label": "epoch 463"
            },
            {
              "x": 464,
              "y": 0.06681146658344049,
              "label": "epoch 464"
            },
            {
              "x": 465,
              "y": 0.06668081536439667,
              "label": "epoch 465"
            },
            {
              "x": 466,
              "y": 0.06667422206654212,
              "label": "epoch 466"
            },
            {
              "x": 467,
              "y": 0.06674469763800576,
              "label": "epoch 467"
            },
            {
              "x": 468,
              "y": 0.06688488142841371,
              "label": "epoch 468"
            },
            {
              "x": 469,
              "y": 0.06675885843322589,
              "label": "epoch 469"
            },
            {
              "x": 470,
              "y": 0.06662894991210067,
              "label": "epoch 470"
            },
            {
              "x": 471,
              "y": 0.06676205951870959,
              "label": "epoch 471"
            },
            {
              "x": 472,
              "y": 0.0668837573911814,
              "label": "epoch 472"
            },
            {
              "x": 473,
              "y": 0.0668966032645143,
              "label": "epoch 473"
            },
            {
              "x": 474,
              "y": 0.06669926514783195,
              "label": "epoch 474"
            },
            {
              "x": 475,
              "y": 0.06690150963679437,
              "label": "epoch 475"
            },
            {
              "x": 476,
              "y": 0.06664045301870228,
              "label": "epoch 476"
            },
            {
              "x": 477,
              "y": 0.06668076443284726,
              "label": "epoch 477"
            },
            {
              "x": 478,
              "y": 0.06676426758638608,
              "label": "epoch 478"
            },
            {
              "x": 479,
              "y": 0.06680466692684944,
              "label": "epoch 479"
            },
            {
              "x": 480,
              "y": 0.06668827154317712,
              "label": "epoch 480"
            },
            {
              "x": 481,
              "y": 0.06675158606540899,
              "label": "epoch 481"
            },
            {
              "x": 482,
              "y": 0.06677666780502466,
              "label": "epoch 482"
            },
            {
              "x": 483,
              "y": 0.06688627115469686,
              "label": "epoch 483"
            },
            {
              "x": 484,
              "y": 0.06672176753526923,
              "label": "epoch 484"
            },
            {
              "x": 485,
              "y": 0.06674788928420493,
              "label": "epoch 485"
            },
            {
              "x": 486,
              "y": 0.06657663947627122,
              "label": "epoch 486"
            },
            {
              "x": 487,
              "y": 0.06697096164665069,
              "label": "epoch 487"
            },
            {
              "x": 488,
              "y": 0.06675684892685509,
              "label": "epoch 488"
            },
            {
              "x": 489,
              "y": 0.06696064283650553,
              "label": "epoch 489"
            },
            {
              "x": 490,
              "y": 0.0670177483965924,
              "label": "epoch 490"
            },
            {
              "x": 491,
              "y": 0.06700386117962313,
              "label": "epoch 491"
            },
            {
              "x": 492,
              "y": 0.0670047007172674,
              "label": "epoch 492"
            },
            {
              "x": 493,
              "y": 0.06642849702513774,
              "label": "epoch 493"
            },
            {
              "x": 494,
              "y": 0.06677995563590527,
              "label": "epoch 494"
            },
            {
              "x": 495,
              "y": 0.066820809841946,
              "label": "epoch 495"
            },
            {
              "x": 496,
              "y": 0.06666492998588502,
              "label": "epoch 496"
            },
            {
              "x": 497,
              "y": 0.06695296165554902,
              "label": "epoch 497"
            },
            {
              "x": 498,
              "y": 0.06688020705546512,
              "label": "epoch 498"
            },
            {
              "x": 499,
              "y": 0.06671041135320789,
              "label": "epoch 499"
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
      "date": "2026-04-20",
      "title": "从 100epoch 主线锚点构建 500epoch 拔插头恢复线，并加入 0.75 自动停",
      "summary": "范围：mdit/config/schema.py + mdit/train/runner.py + scripts/prepare_mdit_resume_run.py + scripts/run_prepared_mdit_resume_guard.sh + scripts/run_unplug…",
      "path": "docs/fixes.md"
    },
    {
      "date": "2026-04-19",
      "title": "MDIT 训练保留清单追加 best_success 强保留",
      "summary": "范围：research/mdit_trial_runner.py 背景：用户要求最优线路 ckpt 严禁删除；虽然当前 close_door 只有一条主线并且 latest.pt 已强保留，但训练期如果未来启用 success selection，best_success.pt 也应进入默认保留集…",
      "path": "docs/fixes.md"
    },
    {
      "date": "2026-04-19",
      "title": "close_door 主线续训切换到 64x2",
      "summary": "范围：scripts/run_mdit_train_guard.sh、ckpt/close_door_mdit_rgb_text_3token_500/config.json 背景：close_door_mdit_rgb_text_3token_500 已具备 latest.pt，需要在不换 ru…",
      "path": "docs/fixes.md"
    },
    {
      "date": "2026-04-19",
      "title": "固化 MDIT 0.75 方法参考线并修复 mdit_best 锚点 · MDIT artifacts",
      "summary": "范围：scripts/solidify_mdit_reference_line.py + ckpt/mdit_best + ckpt/mdit_reference_line + docs/mdit/best_path.md 背景：历史清理漏洞已经导致 0.75@300/500 的原始长训 ckpt…",
      "path": "docs/fixes.md"
    }
  ]
};
