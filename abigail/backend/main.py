"""
Abigail Arts & Oracles - FastAPI Backend
Main entry point for the API server.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import readings
from app.core.config import settings

app = FastAPI(
    title="Abigail Arts & Oracles Backend",
    description="FastAPI backend for generating card readings and managing business logic.",
    version="0.1.0",
)

# Architecture Decision: CORS configuration allows the Next.js frontend to communicate with this backend.
# In production, ensure CORS_ORIGINS is set to your actual frontend domain(s).
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(readings.router, prefix="/api")


@app.get("/health", summary="Health check endpoint", tags=["Monitoring"])
async def health_check():
    return {"status": "ok", "message": "FastAPI backend is running"}



