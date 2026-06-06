import os
from fastapi import FastAPI, HTTPException, Depends, Header
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import json
import requests
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Aegis SOC Analytics Microservice",
    description="Python microservice parsing security logs, running threat rule heuristics, and conducting AI-powered RAG operations via LangChain and ChromaDB.",
    version="1.0.0"
)

# OpenRouter Configuration
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

# Simple Pydantic models for validation
class LogPayload(BaseModel):
    node_id: str = Field(..., example="server-cluster-04")
    service: str = Field(..., example="ssh-daemon")
    event: str = Field(..., example="Failed login password attempt for root")
    severity: str = Field(..., example="critical")
    source_ip: Optional[str] = Field("0.0.0.0", example="185.122.2.4")

class IncidentSummaryRequest(BaseModel):
    incident_id: str
    category: str
    description: str
    threat_count: int

class ChatQueryRequest(BaseModel):
    query: str
    organization_id: str

# Ingestion endpoint with heuristic rule parsing
@app.post("/api/v1/ingest", tags=["Ingestion"])
async def ingest_log(payload: LogPayload, authorization: Optional[str] = Header(None)):
    # Verify Bearer Token in production
    # if not authorization or not authorization.startswith("Bearer "):
    #     raise HTTPException(status_code=401, detail="Invalid or missing API ingestion token")
    
    # 1. Rule Heuristic: Check for common attack signatures
    threat_detected = False
    threat_type = None
    event_lower = payload.event.lower()
    
    if "select" in event_lower and "from" in event_lower or "union" in event_lower or "' or '" in event_lower:
        threat_detected = True
        threat_type = "SQL Injection Attempt"
    elif "failed" in event_lower and "password" in event_lower or "login failure" in event_lower:
        threat_detected = True
        threat_type = "Brute Force Attempt"
    elif "flood" in event_lower or "syn_flood" in event_lower or "ddos" in event_lower:
        threat_detected = True
        threat_type = "DDoS Volumetric Target"
    elif "etc/passwd" in event_lower or "../../" in event_lower:
        threat_detected = True
        threat_type = "Directory Traversal"

    # 2. Mock persistence / indexing (Simulating writing to ChromaDB)
    # In production, you would embed the event using LangChain and save to ChromaDB:
    # vector_db.add_texts([f"Service: {payload.service} - Event: {payload.event}"], metadatas=[...])
    
    return {
        "status": "processed",
        "timestamp": datetime.utcnow().isoformat(),
        "threat_detected": threat_detected,
        "threat_type": threat_type,
        "payload_received": {
            "nodeId": payload.node_id,
            "service": payload.service,
            "severity": payload.severity,
            "sourceIp": payload.source_ip,
        }
    }

# AI Threat Summarizer endpoint (FastAPI -> OpenRouter)
@app.post("/api/v1/summarize", tags=["AI Operations"])
async def summarize_incident(request: IncidentSummaryRequest):
    if not OPENROUTER_API_KEY:
        # Fallback to local heuristic parsing report if OpenRouter key is missing
        return {
            "summary": f"### Heuristic Security Advisory: {request.incident_id}\n\nWarning: SQL signature validation active. Aggregate alerts count: {request.threat_count}.",
            "provider": "local_heuristics"
        }

    # Setup the LLM Prompt using OpenRouter
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://aegis-soc.com",
        "X-Title": "Aegis SOC SaaS"
    }

    prompt = f"""
    You are an expert Cybersecurity Incident Response Officer. Analyze this security alert and write a brief threat summary report:
    
    Incident ID: {request.incident_id}
    Incident Category: {request.category}
    Operational Description: {request.description}
    Alarms Count: {request.threat_count}
    
    Generate your report strictly in Markdown, containing these sections:
    1. Executive Summary (2 sentences)
    2. Root Cause Diagnostics
    3. Remediation Actions (Numbered lists)
    """

    payload = {
        "model": "meta-llama/llama-3.1-8b-instruct:free",
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }

    try:
        response = requests.post(OPENROUTER_URL, headers=headers, json=payload)
        response_json = response.json()
        summary = response_json["choices"][0]["message"]["content"]
        return {
            "summary": summary,
            "provider": "openrouter_llama3"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch AI summary from OpenRouter: {str(e)}")

# RAG logs querying endpoint (FastAPI -> ChromaDB + LangChain -> OpenRouter)
@app.post("/api/v1/chat", tags=["AI Operations"])
async def query_rag_chat(request: ChatQueryRequest):
    # ChromaDB Vector Store Retrieval Mock (Simulating LangChain + ChromaDB Retrieval QA Chain)
    # In production:
    # docs = db.similarity_search(request.query, filter={"org_id": request.organization_id})
    # context = "\n".join([d.page_content for d in docs])
    
    # 1. Local context retrieval search
    context = ""
    query_lower = request.query.lower()
    sources = []
    
    if "ssh" in query_lower or "brute force" in query_lower:
        context = "Log: SSH brute force attempts from IP 192.168.1.104 targeting root account. Target node staging-server."
        sources = ["auth.log lines 1042-1084", "prisma://audit-logs/id:100"]
      
    if not OPENROUTER_API_KEY:
        return {
            "response": f"ChromaDB local query matched logs.\n\nRetrieved context: {context}\n\nSources: {sources}",
            "sources": sources
        }

    # 2. Call LLM with Context (RAG)
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
    }

    prompt = f"""
    You are Aegis SOC AI, an agentic security chatbot. Answer the user query using the retrieved log context.
    
    User Query: {request.query}
    Retrieved Context: {context}
    Tenant Org ID: {request.organization_id}
    
    Suggest specific network and configuration mitigations.
    """

    payload = {
        "model": "meta-llama/llama-3.1-8b-instruct:free",
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }

    try:
        response = requests.post(OPENROUTER_URL, headers=headers, json=payload)
        response_json = response.json()
        llm_response = response_json["choices"][0]["message"]["content"]
        return {
            "response": llm_response,
            "sources": sources,
            "provider": "openrouter_llama3_rag"
        }
    except Exception as e:
         raise HTTPException(status_code=500, detail=f"LLM request error: {str(e)}")

@app.get("/health", tags=["Utilities"])
def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
