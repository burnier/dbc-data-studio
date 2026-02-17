"""
Storage utility for handling CSV files in local filesystem or Cloud Storage.
Supports both local development and GCP Cloud Run deployment.
"""

import csv
import os
from pathlib import Path
from typing import List, Dict, Optional
from io import StringIO

# Try to import Google Cloud Storage
try:
    from google.cloud import storage

    GCS_AVAILABLE = True
except ImportError:
    GCS_AVAILABLE = False

# Configuration
USE_GCS = os.getenv("USE_GCS", "false").lower() == "true"
GCS_BUCKET_NAME = os.getenv("GCS_BUCKET_NAME", "")
GCS_PROJECT_ID = os.getenv("GCS_PROJECT_ID", "")

# Local filesystem paths
DATA_DIR = Path(__file__).parent / "data"
DATA_DIR.mkdir(exist_ok=True)

WAITLIST_FILE_LOCAL = DATA_DIR / "waitlist.csv"
ANALYTICS_FILE_LOCAL = DATA_DIR / "analytics.csv"

# GCS file paths
WAITLIST_FILE_GCS = "waitlist.csv"
ANALYTICS_FILE_GCS = "analytics.csv"


class StorageManager:
    """Manages storage operations for CSV files"""

    def __init__(self):
        self.use_gcs = USE_GCS and GCS_AVAILABLE and GCS_BUCKET_NAME
        self.bucket = None

        if self.use_gcs:
            self.client = storage.Client(project=GCS_PROJECT_ID or None)
            self.bucket = self.client.bucket(GCS_BUCKET_NAME)

    def _get_blob(self, filename: str):
        """Get a GCS blob object"""
        if not self.use_gcs:
            return None
        return self.bucket.blob(filename)

    def read_csv(self, filename: str, local_path: Path) -> List[Dict]:
        """Read CSV file from local filesystem or GCS"""
        if self.use_gcs:
            return self._read_from_gcs(filename)
        else:
            return self._read_from_local(local_path)

    def append_csv_row(
        self, filename: str, local_path: Path, row: List[str], headers: List[str]
    ):
        """Append a row to CSV file in local filesystem or GCS"""
        if self.use_gcs:
            self._append_to_gcs(filename, row, headers)
        else:
            self._append_to_local(local_path, row, headers)

    def init_csv_file(self, filename: str, local_path: Path, headers: List[str]):
        """Initialize CSV file with headers if it doesn't exist"""
        if self.use_gcs:
            self._init_gcs_file(filename, headers)
        else:
            self._init_local_file(local_path, headers)

    def _read_from_local(self, local_path: Path) -> List[Dict]:
        """Read CSV from local filesystem"""
        if not local_path.exists():
            return []
        with open(local_path, "r", newline="") as f:
            reader = csv.DictReader(f)
            return list(reader)

    def _read_from_gcs(self, filename: str) -> List[Dict]:
        """Read CSV from GCS"""
        blob = self._get_blob(filename)
        if not blob.exists():
            return []
        content = blob.download_as_text()
        reader = csv.DictReader(StringIO(content))
        return list(reader)

    def _append_to_local(self, local_path: Path, row: List[str], headers: List[str]):
        """Append row to local CSV file"""
        file_exists = local_path.exists()
        with open(local_path, "a", newline="") as f:
            writer = csv.writer(f)
            if not file_exists:
                writer.writerow(headers)
            writer.writerow(row)

    def _append_to_gcs(self, filename: str, row: List[str], headers: List[str]):
        """Append row to GCS CSV file"""
        blob = self._get_blob(filename)

        # Read existing content
        existing_data = []
        if blob.exists():
            content = blob.download_as_text()
            reader = csv.DictReader(StringIO(content))
            existing_data = list(reader)

        # Append new row
        existing_data.append({headers[i]: row[i] for i in range(len(row))})

        # Write back to GCS
        output = StringIO()
        writer = csv.DictWriter(output, fieldnames=headers)
        writer.writeheader()
        writer.writerows(existing_data)

        blob.upload_from_string(output.getvalue(), content_type="text/csv")

    def _init_local_file(self, local_path: Path, headers: List[str]):
        """Initialize local CSV file with headers"""
        if not local_path.exists():
            with open(local_path, "w", newline="") as f:
                writer = csv.writer(f)
                writer.writerow(headers)

    def _init_gcs_file(self, filename: str, headers: List[str]):
        """Initialize GCS CSV file with headers"""
        blob = self._get_blob(filename)
        if not blob.exists():
            output = StringIO()
            writer = csv.writer(output)
            writer.writerow(headers)
            blob.upload_from_string(output.getvalue(), content_type="text/csv")


# Global storage manager instance
storage_manager = StorageManager()
