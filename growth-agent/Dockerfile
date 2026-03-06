# ─── Growth Agent — Production Dockerfile ────────────────────────────────────
#
# Multi-stage build to keep the final image lean.
# Target: Fly.io / Render / Railway / any OCI-compatible runtime.
#
# Build:
#   docker build -t growth-agent .
#
# Run (daily-report):
#   docker run --env-file .env growth-agent python main.py daily-report
#
# Run (outreach):
#   docker run --env-file .env growth-agent python main.py outreach

# ─── Stage 1: dependency resolver ────────────────────────────────────────────
FROM python:3.13-slim AS deps

WORKDIR /install

COPY requirements.txt .

# Install all dependencies into a prefix directory we can copy later
RUN pip install --upgrade pip \
 && pip install --prefix=/runtime --no-cache-dir -r requirements.txt


# ─── Stage 2: runtime image ──────────────────────────────────────────────────
FROM python:3.13-slim AS runtime

# Non-root user for security
RUN groupadd --gid 1001 agent \
 && useradd  --uid 1001 --gid agent --shell /bin/bash --create-home agent

WORKDIR /app

# Copy installed packages from deps stage
COPY --from=deps /runtime /usr/local

# Copy source
COPY --chown=agent:agent . .

# Output directory (bind-mount this in production to persist files between runs)
RUN mkdir -p /app/output && chown agent:agent /app/output

USER agent

# Default command — override in your scheduler / Fly.io cron config
CMD ["sh", "start.sh"]
