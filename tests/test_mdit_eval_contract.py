from __future__ import annotations

import json
import tempfile
from pathlib import Path
import unittest

import _bootstrap  # noqa: F401
from mdit.cli.shared import payload_cfg_to_experiment_cfg, prepare_eval_manifest
from mdit.config import config_to_dict, load_config, resolve_runtime_config
from mdit.config.consistency import build_eval_contract, build_experiment_manifest_payload, write_json
from research.mdit_trial_runner import TrialRequest


PROJECT_ROOT = Path(__file__).resolve().parents[1]


class MDITEvalContractTest(unittest.TestCase):
    def test_strict_lane_contract_contains_mtdp_fields(self) -> None:
        cfg = load_config(PROJECT_ROOT / "configs" / "mdit" / "fm_autodl_lane_c_mtdp_strict.json")
        cfg = resolve_runtime_config(cfg)
        contract = build_eval_contract(cfg)

        self.assertEqual(contract["fm_variant"], "mtdp_strict")
        self.assertEqual(contract["backbone_name"], "dit_mtdp_rope")
        self.assertEqual(contract["fm_timestep_sampling_strategy"], "beta")
        self.assertTrue(contract["use_rope"])
        self.assertIsNotNone(contract["state_min"])
        self.assertIsNotNone(contract["action_max"])

    def test_prepare_eval_manifest_accepts_matching_contract(self) -> None:
        cfg = load_config(PROJECT_ROOT / "configs" / "mdit" / "fm_autodl_lab.json")
        with tempfile.TemporaryDirectory() as tmp_dir:
            run_dir = Path(tmp_dir) / "run"
            ckpt_path = run_dir / "epochs" / "epoch_0050.pt"
            ckpt_path.parent.mkdir(parents=True, exist_ok=True)
            ckpt_path.write_bytes(b"")

            request = TrialRequest(config_path=PROJECT_ROOT / "configs" / "mdit" / "fm_autodl_lab.json")
            manifest = build_experiment_manifest_payload(
                line="mdit",
                lane="lane_a_mainline",
                strategy="fm",
                base_config_path=request.config_path,
                base_cfg=cfg,
                resolved_cfg=cfg,
                config_overrides={},
                trial_request={"config_path": str(request.config_path)},
                resolved_trial_request={"config_path": str(request.config_path)},
            )
            write_json(run_dir / "experiment_manifest.json", manifest)
            payload = {
                "cfg": config_to_dict(cfg),
                "eval_contract": build_eval_contract(cfg),
            }
            eval_cfg = payload_cfg_to_experiment_cfg(payload["cfg"], ckpt_root=run_dir.parent, seed=1234)
            eval_manifest, eval_manifest_path = prepare_eval_manifest(
                ckpt_path=ckpt_path,
                payload=payload,
                cfg=eval_cfg,
                strategy="fm",
                seed=1234,
                episodes=20,
                max_steps=200,
                headless=True,
                show_progress=False,
                prefer_ema=True,
                heartbeat_every=50,
            )

            self.assertEqual(eval_manifest["contract_issues"], [])
            self.assertTrue(eval_manifest_path.exists())

    def test_prepare_eval_manifest_rejects_drift(self) -> None:
        cfg = load_config(PROJECT_ROOT / "configs" / "mdit" / "fm_autodl_lab.json")
        with tempfile.TemporaryDirectory() as tmp_dir:
            run_dir = Path(tmp_dir) / "run"
            ckpt_path = run_dir / "epochs" / "epoch_0050.pt"
            ckpt_path.parent.mkdir(parents=True, exist_ok=True)
            ckpt_path.write_bytes(b"")

            request = TrialRequest(config_path=PROJECT_ROOT / "configs" / "mdit" / "fm_autodl_lab.json")
            manifest = build_experiment_manifest_payload(
                line="mdit",
                lane="lane_a_mainline",
                strategy="fm",
                base_config_path=request.config_path,
                base_cfg=cfg,
                resolved_cfg=cfg,
                config_overrides={},
                trial_request={"config_path": str(request.config_path)},
                resolved_trial_request={"config_path": str(request.config_path)},
            )
            write_json(run_dir / "experiment_manifest.json", manifest)
            payload = {
                "cfg": config_to_dict(cfg),
                "eval_contract": build_eval_contract(cfg),
            }
            eval_cfg = payload_cfg_to_experiment_cfg(
                payload["cfg"],
                ckpt_root=run_dir.parent,
                seed=1234,
                config_overrides={"command_mode": "mean_first_n", "average_first_n": 2},
            )

            with self.assertRaisesRegex(ValueError, "Evaluation contract drift detected"):
                prepare_eval_manifest(
                    ckpt_path=ckpt_path,
                    payload=payload,
                    cfg=eval_cfg,
                    strategy="fm",
                    seed=1234,
                    episodes=20,
                    max_steps=200,
                    headless=True,
                    show_progress=False,
                    prefer_ema=True,
                    heartbeat_every=50,
                )


if __name__ == "__main__":
    unittest.main()
