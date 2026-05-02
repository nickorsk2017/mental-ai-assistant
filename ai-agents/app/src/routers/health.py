"""Public health endpoint for orchestration and load balancers."""

from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get("/health")
def read_health_check() -> dict[str, str]:
    """Return a simple readiness payload."""
    return {"status": "ok"}
