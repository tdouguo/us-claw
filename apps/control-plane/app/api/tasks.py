from __future__ import annotations

from typing import Any

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field

from app.services.task_store import TaskStore


router = APIRouter(prefix="/api/tasks", tags=["tasks"])


class CreateTaskRequest(BaseModel):
    title: str = Field(min_length=1)
    description: str = ""
    mission_type: str = "general"
    risk_level: str = "normal"
    owning_entity: str = ""
    initiating_entity: str = ""
    initiating_role: str = ""
    launch_context: str = ""
    review_requirements: list[str] = Field(default_factory=list)


class TransitionTaskRequest(BaseModel):
    to_state: str = Field(min_length=1)


def get_task_store(request: Request) -> TaskStore:
    return request.app.state.task_store


@router.get("")
def list_tasks(request: Request) -> list[dict[str, Any]]:
    return get_task_store(request).list_tasks()


@router.get("/{task_id}/events")
def list_task_events(task_id: str, request: Request) -> list[dict[str, Any]]:
    task_store = get_task_store(request)
    if task_store.get_task(task_id) is None:
        raise HTTPException(status_code=404, detail=f"task not found: {task_id}")
    return task_store.list_task_events(task_id)


@router.post("")
def create_task(payload: CreateTaskRequest, request: Request) -> dict[str, Any]:
    return get_task_store(request).create_task(payload.model_dump())


@router.post("/{task_id}/transition")
def transition_task(task_id: str, payload: TransitionTaskRequest, request: Request) -> dict[str, Any]:
    try:
        return get_task_store(request).transition_task(task_id, payload.to_state)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
