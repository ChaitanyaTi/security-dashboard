from pydantic import BaseModel
from typing import Optional

class IngestRequest(BaseModel):
    source: str
    ip: str
    message: str

class IngestResponse(BaseModel):
    detected: bool
    attack_type: Optional[str] = None
    severity: Optional[str] = None
    incident_created: bool
