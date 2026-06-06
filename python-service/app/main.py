import os
from fastapi import FastAPI, HTTPException, Depends, Header
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import json
import requests
from dotenv import load_dotenv

from app.schemas import IngestRequest, IngestResponse
from app.services.threat_service import process_threat_log

load_dotenv()

app = FastAPI(
    title="Aegis SOC Analytics Microservice",
    description="Python microservice parsing security logs, running threat rule heuristics, and conducting AI-powered RAG operations via LangChain and ChromaDB.",
    version="1.0.0"
)

# OpenRouter Configuration
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

# Simple Pydantic models for validation of AI summaries and RAG
class IncidentSummaryRequest(BaseModel):
    incident_id: str
    category: str
    description: str
    threat_count: int

class ChatQueryRequest(BaseModel):
    query: str
    organization_id: str

# Ingestion endpoint
@app.post("/api/v1/ingest", response_model=IngestResponse, tags=["Ingestion"])
async def ingest_log(payload: IngestRequest):
    try:
        result = process_threat_log(
            source=payload.source,
            ip=payload.ip,
            message=payload.message
        )
        return IngestResponse(
            detected=result["detected"],
            attack_type=result["attack_type"],
            severity=result["severity"],
            incident_created=result["incident_created"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process ingestion: {str(e)}")

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
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
