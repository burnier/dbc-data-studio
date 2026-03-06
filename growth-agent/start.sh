#!/bin/sh
# ─── Growth Agent — Container Entrypoint ─────────────────────────────────────
#
# Usage (set via environment variable or Docker CMD override):
#   AGENT_COMMAND=daily-report  → runs python main.py daily-report
#   AGENT_COMMAND=outreach      → runs python main.py outreach
#
# Default: daily-report
# Default look-back window: 30 days (override with AGENT_DAYS env var)

set -e

COMMAND="${AGENT_COMMAND:-daily-report}"
DAYS="${AGENT_DAYS:-30}"

echo "[start.sh] Starting Growth Agent — command: ${COMMAND}, days: ${DAYS}"

exec python main.py "${COMMAND}" --days "${DAYS}"
