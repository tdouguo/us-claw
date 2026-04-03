# US-claw Review Follow-ups Plan

## Summary

- Date: `2026-04-03`
- Branch: `codex/review-followups-20260403`
- Goal: close the remaining review follow-ups without reopening Phase B scope
- Result: follow-up fixes completed, regression verification passed, completed subagents ready for cleanup

## Scope

- In scope:
  - `apps/control-plane`
  - `apps/web`
  - `deploy`
- Out of scope:
  - new runtime features
  - schema redesign
  - full compose runtime validation
  - broad docs rewrite outside the touched deploy note

## Closed Follow-up Items

### 1. Runtime telemetry semantics

- `GET /api/runtime/events`
- `GET /api/runtime/logs`

Closed by:

- rejecting non-positive `limit` values at the control-plane HTTP layer
- surfacing bridge telemetry feed failures instead of silently degrading to `[]`

Evidence:

- `apps/control-plane/app/api/runtime.py`
- `apps/control-plane/app/services/runtime_gateway.py`
- `apps/control-plane/tests/test_runtime_api.py`
- `apps/control-plane/tests/test_runtime_gateway.py`

### 2. Organization state consistency

Closed by:

- preventing same-entity stale role submission when the next role detail request fails
- clearing stale role-detail error state after a later successful selection

Evidence:

- `apps/web/src/features/organization/OrganizationView.tsx`
- `apps/web/src/app/App.test.tsx`

### 3. Mission Control sidecar consistency

Closed by:

- clearing transition success/error feedback when `selectedTaskId` changes

Evidence:

- `apps/web/src/features/mission-control/MissionControlView.tsx`
- `apps/web/src/app/App.test.tsx`

### 4. Deploy fallback path contract

Closed by:

- updating compose fallback OpenClaw mounts to repo-root `.codex-temp`
- aligning `deploy/README.md` with compose file-relative path behavior

Evidence:

- `deploy/docker-compose.yml`
- `deploy/README.md`

## Verification

### Repo root

```powershell
python -m unittest discover apps/control-plane/tests -v
```

Result:

- `26` tests passed

### apps/web

```powershell
npm test
npm run build
```

Result:

- `13` tests passed
- production build passed

### services/openclaw-bridge

```powershell
npm test
npm run build
```

Result:

- `6` tests passed
- TypeScript build passed

### Diff hygiene

```powershell
git diff --check
```

Result:

- no whitespace errors
- LF/CRLF warnings only

## Subagent Status

### Completed legacy reviewer threads

- `Bacon` `019d4e0f-26b3-7a42-8923-3f93ca6e9474`
- `Bohr` `019d4e0f-2712-72b0-b4ac-4a4e2dd03791`
- `Pauli` `019d4e3a-b768-7aa1-9aa4-9770e504fbe5`
- `Pascal` `019d4e3a-b77a-7081-ba26-120e87630fc0`

### Completed current-turn reviewer threads

- `Halley` `019d5164-ed5e-7ed3-b9ac-42a1d93ccca7`
- `Singer` `019d5165-0195-7402-a261-a262297a6463`

## Decision

- No unfinished subagent remained when this plan snapshot was written
- Safe next action after saving this file: close every completed subagent and keep no idle reviewer alive

## Remaining Boundary

- Local machine still lacks `docker`
- Compose dynamic validation remains pending and out of scope for this follow-up turn
