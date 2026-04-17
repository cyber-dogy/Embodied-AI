from __future__ import annotations

from typing import Any, Iterable


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


def resolve_task_text(
    task_name: str,
    *,
    text_source: str = "task_template",
    descriptions: Iterable[str] | None = None,
    override_text: str | None = None,
) -> str:
    source = str(text_source or "task_template").strip().lower().replace("-", "_").replace(" ", "_")
    if source in {"task_template", "task_name"}:
        return choose_instruction(
            task_name=task_name,
            descriptions=None,
            override_text=override_text,
        )
    if source == "dataset":
        return choose_instruction(
            task_name=task_name,
            descriptions=descriptions,
            override_text=override_text,
        )
    raise ValueError(
        f"Unsupported text_source={text_source!r}. "
        "Expected one of: task_template, task_name, dataset."
    )


def build_task_text_contract(
    task_name: str,
    *,
    text_source: str = "task_template",
    descriptions: Iterable[str] | None = None,
    override_text: str | None = None,
) -> dict[str, Any]:
    description_list = [" ".join(str(text).split()) for text in descriptions or [] if str(text).strip()]
    effective_task_text = resolve_task_text(
        task_name=task_name,
        text_source=text_source,
        descriptions=description_list,
        override_text=override_text,
    )
    return {
        "task_name": _clean_text(task_name),
        "text_source": str(text_source or "task_template").strip().lower().replace("-", "_").replace(" ", "_"),
        "task_text_override": _clean_text(override_text) or None,
        "dataset_descriptions": description_list,
        "effective_task_text": effective_task_text,
    }
