import os
import re
from werkzeug.utils import secure_filename


def allowed_file(filename: str, allowed_extensions: set) -> bool:
    """Check if file extension is allowed."""
    if not filename or '.' not in filename:
        return False
    ext = filename.rsplit('.', 1)[1].lower()
    return ext in allowed_extensions


def safe_filename(filename: str) -> str:
    """Create a clean, secure filename."""
    base = secure_filename(filename)
    if not base:
        base = "upload_file"
    return base


def clean_text(text: str) -> str:
    """Remove excessive whitespace and normalize line endings."""
    if not text:
        return ""
    text = re.sub(r'\r\n', '\n', text)
    text = re.sub(r'\r', '\n', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    text = re.sub(r'[ \t]+', ' ', text)
    return text.strip()
