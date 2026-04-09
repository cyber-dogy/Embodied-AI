from __future__ import annotations


def build_rgb_dataset(data_path: str, cfg):
    del data_path, cfg
    raise NotImplementedError(
        "RGB modality is reserved for future experiments. "
        "Add an RGB dataset module and an RGB encoder, then register them in "
        "`data/modalities/__init__.py` and `model/registry.py`."
    )
