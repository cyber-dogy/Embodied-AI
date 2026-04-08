from __future__ import annotations

from typing import Iterable


DEFAULT_TASK_INSTRUCTIONS = {
    "close_door": "close the door",
    "close_drawer": "close the drawer",
    "close_microwave": "close the microwave door",
    "open_box": "open the box lid",
    "open_fridge": "open the fridge door",
    "open_oven": "open the oven door",
    "pick_cup": "pick up the cup",
    "pick_up_cup": "pick up the cup",
    "push_buttons": "push the correct button",
    "put_books_on_bookshelf": "put the books on the bookshelf",
    "take_frame_off_hanger": "take the frame off the hanger",
    "take_shoes_out_of_box": "take the shoes out of the box",
    "unplug_charger": "unplug the charger cable",
}

NORMALIZED_TASK_INSTRUCTIONS = {
    " ".join(key.replace("_", " ").split()).strip(): value
    for key, value in DEFAULT_TASK_INSTRUCTIONS.items()
}


def _clean_text(text: str | None) -> str:
    if text is None:
        return ""
    return " ".join(str(text).replace("_", " ").split()).strip()


def fallback_instruction_from_task_name(task_name: str) -> str:
    cleaned = _clean_text(task_name)
    if not cleaned:
        return "complete the manipulation task"
    return cleaned


def get_default_instruction(task_name: str) -> str:
    task_name = _clean_text(task_name)
    return NORMALIZED_TASK_INSTRUCTIONS.get(
        task_name,
        fallback_instruction_from_task_name(task_name),
    )


def choose_instruction(
    task_name: str,
    descriptions: Iterable[str] | None = None,
    override_text: str | None = None,
) -> str:
    override_text = _clean_text(override_text)
    if override_text:
        return override_text

    if descriptions is not None:
        for text in descriptions:
            cleaned = _clean_text(text)
            if cleaned:
                return cleaned

    return get_default_instruction(task_name)
