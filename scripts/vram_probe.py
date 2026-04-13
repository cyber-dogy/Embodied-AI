#!/usr/bin/env python3
"""
VRAM 探测脚本 - 按文档 20-22GB 目标区间
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import subprocess
import json
import time
import torch

def get_gpu_memory():
    """获取当前 GPU 显存使用 (MB)"""
    if torch.cuda.is_available():
        torch.cuda.synchronize()
        allocated = torch.cuda.memory_allocated() / 1024 / 1024
        reserved = torch.cuda.memory_reserved() / 1024 / 1024
        return allocated, reserved
    return 0, 0

def probe_batch_size(batch_size, timeout=180):
    """测试一个 batch_size，返回 (显存使用_GB, 是否OOM)"""
    print(f"\n🧪 测试 batch_size={batch_size}...")
    
    config_path = "/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/configs/mdit/obs3_rgb5_sep_lastblock_a8_gate100.json"
    
    # 构建探测命令 - 只跑 1 epoch
    cmd = [
        "python", "scripts/run_mdit_autoresearch_trial.py",
        "--phase", "train-only",
        "--config", config_path,
        "--stage-epochs", "1",
        "--checkpoint-every", "1",
        "--device", "cuda",
        "--experiment-name", f"vram_probe_bs{batch_size}",
        "--run-name", f"vram_probe_bs{batch_size}_{int(time.time())}",
        "--description", f"VRAM probe for batch_size={batch_size}",
        "--set", f"batch_size={batch_size}",
        "--set", "grad_accum_steps=1",
        "--set", "wandb_enable=false",  # 探测时不记录 wandb
    ]
    
    # 清理 GPU 缓存
    if torch.cuda.is_available():
        torch.cuda.empty_cache()
        torch.cuda.synchronize()
    
    try:
        # 使用 timeout 运行
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=timeout,
            cwd="/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm"
        )
        
        # 检查是否有 OOM
        if "CUDA out of memory" in result.stderr or "RuntimeError" in result.stderr and "memory" in result.stderr:
            print(f"  ❌ batch_size={batch_size} -> OOM")
            return None, True
        
        if result.returncode != 0:
            print(f"  ❌ batch_size={batch_size} -> 错误: {result.stderr[:200]}")
            return None, True
        
        # 获取显存使用（通过 nvidia-smi）
        import subprocess as sp
        smi_result = sp.run(
            ["nvidia-smi", "--query-gpu=memory.used", "--format=csv,noheader,nounits"],
            capture_output=True, text=True
        )
        memory_used_mb = int(smi_result.stdout.strip())
        memory_used_gb = memory_used_mb / 1024
        
        print(f"  ✅ batch_size={batch_size} -> 显存 {memory_used_gb:.2f} GB (稳定)")
        return memory_used_gb, False
        
    except subprocess.TimeoutExpired:
        print(f"  ⏱️ batch_size={batch_size} -> 超时")
        return None, False
    except Exception as e:
        print(f"  ❌ batch_size={batch_size} -> 异常: {e}")
        return None, False

def main():
    print("=" * 60)
    print("MDIT VRAM 探测开始")
    print("目标区间: 20GB ~ 22GB")
    print("=" * 60)
    
    # 探测序列
    batch_sizes = [12, 16, 20, 24, 28, 32, 64, 128]
    results = []
    
    last_success_bs = None
    last_success_vram = None
    
    for bs in batch_sizes:
        vram_gb, is_oom = probe_batch_size(bs)
        
        if is_oom:
            print(f"\n🛑 遇到 OOM，停止探测")
            break
        
        if vram_gb is not None:
            results.append({"batch_size": bs, "vram_gb": vram_gb, "stable": True})
            last_success_bs = bs
            last_success_vram = vram_gb
            
            # 如果已经超过 23GB，不建议继续
            if vram_gb > 23:
                print(f"\n⚠️ 显存超过 23GB，停止增加 batch")
                break
    
    # 输出结果
    print("\n" + "=" * 60)
    print("显存探测结果汇总")
    print("=" * 60)
    for r in results:
        print(f"batch_size {r['batch_size']} -> 显存 {r['vram_gb']:.2f} GB -> {'稳定' if r['stable'] else '不稳定'}")
    
    if last_success_bs:
        print(f"\n✅ 推荐 batch_size: {last_success_bs} (显存使用: {last_success_vram:.2f} GB)")
        # 写入文件
        with open("/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/vram_probe_result.json", "w") as f:
            json.dump({
                "recommended_batch_size": last_success_bs,
                "vram_gb": last_success_vram,
                "all_results": results,
                "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
            }, f, indent=2)
        print(f"结果已保存到 vram_probe_result.json")
        return last_success_bs
    else:
        print("\n❌ 所有 batch_size 都失败")
        return None

if __name__ == "__main__":
    recommended_bs = main()
    sys.exit(0 if recommended_bs else 1)
