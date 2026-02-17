from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, EmailStr
from datetime import datetime
from pathlib import Path
from storage import (
    storage_manager,
    WAITLIST_FILE_LOCAL,
    ANALYTICS_FILE_LOCAL,
    WAITLIST_FILE_GCS,
    ANALYTICS_FILE_GCS,
)

app = FastAPI()
templates = Jinja2Templates(directory="templates")

# Mount static files directory
static_path = Path(__file__).parent / "static"
if static_path.exists():
    app.mount("/static", StaticFiles(directory=str(static_path)), name="static")


class WaitlistRequest(BaseModel):
    email: EmailStr


def init_csv_files():
    """Initialize CSV files with headers if they don't exist"""
    storage_manager.init_csv_file(
        WAITLIST_FILE_GCS, WAITLIST_FILE_LOCAL, ["email", "timestamp"]
    )
    storage_manager.init_csv_file(
        ANALYTICS_FILE_GCS,
        ANALYTICS_FILE_LOCAL,
        ["event_name", "timestamp", "ip_address"],
    )


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
    storage_manager.append_csv_row(
        WAITLIST_FILE_GCS,
        WAITLIST_FILE_LOCAL,
        [email, timestamp],
        ["email", "timestamp"],
    )

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
    storage_manager.append_csv_row(
        ANALYTICS_FILE_GCS,
        ANALYTICS_FILE_LOCAL,
        [event_name, timestamp, ip_address],
        ["event_name", "timestamp", "ip_address"],
    )


@app.get("/admin", response_class=HTMLResponse)
async def admin_dashboard(request: Request):
    """Admin dashboard to view waitlist and analytics"""
    # Read waitlist data
    waitlist_data = storage_manager.read_csv(WAITLIST_FILE_GCS, WAITLIST_FILE_LOCAL)

    # Read analytics data
    analytics_data = storage_manager.read_csv(ANALYTICS_FILE_GCS, ANALYTICS_FILE_LOCAL)

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
