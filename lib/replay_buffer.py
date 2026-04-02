from __future__ import annotations
import zarr
import numpy as np
from .dp_replay_buffer import ReplayBuffer
from .dp_imagecodecs_numcodecs import register_codec, Jpeg2k

register_codec(Jpeg2k)


class RobotReplayBuffer(ReplayBuffer):
    def __init__(self, root: zarr.Group):
        super().__init__(root)
        self.jpeg_compressor = Jpeg2k()
        return

    def add_episode_from_list(self, data_list: list[dict[str, np.ndarray]], **kwargs):
        """
        data_list 是一个字典列表，其中每个字典包含一个步骤的数据。
        """
        data_dict = dict()
        for key in data_list[0].keys():
            data_dict[key] = np.stack([x[key] for x in data_list])
        self.add_episode(data_dict, **kwargs)
        return

    def add_episode_from_list_compressed(self, data_list: list[dict[str, np.ndarray]], **kwargs):
        """
        data_list 是一个字典列表，其中每个字典包含一个步骤的数据。
        WARNING: 解码（即读取）是损坏的。
        """
        data_dict = {key: np.stack([x[key] for x in data_list]) for key in data_list[0].keys()}
        # 获取以“rgb*”开头的键
        rgb_keys = [key for key in data_dict.keys() if key.startswith("rgb")]
        rgb_shapes = [data_list[0][key].shape for key in rgb_keys]
        chunks = {rgb_keys[i]: (1, *rgb_shapes[i]) for i in range(len(rgb_keys))}
        compressors = {key: self.jpeg_compressor for key in rgb_keys}
        self.add_episode(data_dict, chunks, compressors, **kwargs)
        return
