from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel, EmailStr
from datetime import datetime
import csv
import os
from pathlib import Path

app = FastAPI()
templates = Jinja2Templates(directory="templates")

# Ensure data directory exists
DATA_DIR = Path(__file__).parent / "data"
DATA_DIR.mkdir(exist_ok=True)

WAITLIST_FILE = DATA_DIR / "waitlist.csv"
ANALYTICS_FILE = DATA_DIR / "analytics.csv"


class WaitlistRequest(BaseModel):
    email: EmailStr


def init_csv_files():
    """Initialize CSV files with headers if they don't exist"""
    # Initialize waitlist.csv
    if not WAITLIST_FILE.exists():
        with open(WAITLIST_FILE, "w", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(["email", "timestamp"])

    # Initialize analytics.csv
    if not ANALYTICS_FILE.exists():
        with open(ANALYTICS_FILE, "w", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(["event_name", "timestamp", "ip_address"])


@app.on_event("startup")
async def startup_event():
    """Initialize CSV files on startup"""
    init_csv_files()


@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    """Serve the landing page"""
    return templates.TemplateResponse("index.html", {"request": request})


@app.post("/waitlist")
async def join_waitlist(waitlist_request: WaitlistRequest, request: Request):
    """Add email to waitlist"""
    email = waitlist_request.email
    timestamp = datetime.now().isoformat()

    # Append to waitlist.csv
    with open(WAITLIST_FILE, "a", newline="") as f:
        writer = csv.writer(f)
        writer.writerow([email, timestamp])

    # Track waitlist signup
    await track_event(
        "waitlist_signup", request.client.host if request.client else "unknown"
    )

    return JSONResponse(
        status_code=200,
        content={
            "message": "Thanks! We'll notify you as soon as the JSON-to-CSV Flattener is live."
        },
    )


@app.get("/track/{event_name}")
async def track_event_endpoint(event_name: str, request: Request):
    """Track analytics events"""
    await track_event(event_name, request.client.host if request.client else "unknown")
    return JSONResponse(status_code=200, content={"status": "tracked"})


async def track_event(event_name: str, ip_address: str):
    """Log analytics event to CSV file"""
    timestamp = datetime.now().isoformat()
    with open(ANALYTICS_FILE, "a", newline="") as f:
        writer = csv.writer(f)
        writer.writerow([event_name, timestamp, ip_address])


@app.get("/admin", response_class=HTMLResponse)
async def admin_dashboard(request: Request):
    """Admin dashboard to view waitlist and analytics"""
    # Read waitlist data
    waitlist_data = []
    if WAITLIST_FILE.exists():
        with open(WAITLIST_FILE, "r", newline="") as f:
            reader = csv.DictReader(f)
            waitlist_data = list(reader)

    # Read analytics data
    analytics_data = []
    if ANALYTICS_FILE.exists():
        with open(ANALYTICS_FILE, "r", newline="") as f:
            reader = csv.DictReader(f)
            analytics_data = list(reader)

    # Calculate metrics
    page_views = sum(
        1 for row in analytics_data if row.get("event_name") == "page_view"
    )
    click_to_upload = sum(
        1 for row in analytics_data if row.get("event_name") == "click_to_upload"
    )
    waitlist_signups = len(waitlist_data)

    conversion_rate = (waitlist_signups / page_views * 100) if page_views > 0 else 0
    click_conversion = (
        (waitlist_signups / click_to_upload * 100) if click_to_upload > 0 else 0
    )

    return templates.TemplateResponse(
        "admin.html",
        {
            "request": request,
            "waitlist_data": waitlist_data,
            "analytics_data": analytics_data,
            "metrics": {
                "page_views": page_views,
                "click_to_upload": click_to_upload,
                "waitlist_signups": waitlist_signups,
                "conversion_rate": round(conversion_rate, 2),
                "click_conversion": round(click_conversion, 2),
            },
        },
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
