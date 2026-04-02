from __future__ import annotations

from fastapi import APIRouter, HTTPException, Request

from app.services.soul_catalog import SoulCatalog


router = APIRouter(prefix="/api/organization", tags=["organization"])


def get_catalog(request: Request) -> SoulCatalog:
    return request.app.state.catalog


@router.get("/entities")
def list_entities(request: Request) -> list[dict[str, object]]:
    catalog = get_catalog(request)
    return [entity.__dict__ for entity in catalog.list_entities()]


@router.get("/entities/{entity_slug}/roles")
def list_roles(entity_slug: str, request: Request) -> list[dict[str, object]]:
    catalog = get_catalog(request)
    roles = catalog.list_roles(entity_slug)
    if not roles:
        raise HTTPException(status_code=404, detail=f"entity not found: {entity_slug}")
    return [role.__dict__ for role in roles]


@router.get("/roles/{entity_slug}/{role_slug}")
def get_role(entity_slug: str, role_slug: str, request: Request) -> dict[str, object]:
    catalog = get_catalog(request)
    try:
        role = catalog.get_role(entity_slug, role_slug)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return role.__dict__
