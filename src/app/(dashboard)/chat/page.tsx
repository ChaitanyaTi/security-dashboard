"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Bot, Send, User, Sparkles, Terminal, 
  Trash2, Database, AlertCircle, RefreshCw 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  sources?: string[];
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "m1",
    sender: "bot",
    text: "Greetings Analyst. I am the Aegis AI Threat Advisor, integrated with your LangChain logs database and ChromaDB vector indices. Ask me anything about log anomalies, active incidents, or compliance posture.",
    timestamp: "10:50:00"
  }
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isIndexing, setIsIndexing] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMessage: Message = {
      id: Math.random().toString(),
      sender: "user",
      text: inputVal,
      timestamp: new Date().toTimeString().split(" ")[0]
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputVal("");
    setIsTyping(true);

    // Simulated RAG Response targeting common cybersecurity SaaS queries
    setTimeout(() => {
      let botResponse = "";
      let sources: string[] = [];
      const query = userMessage.text.toLowerCase();

      if (query.includes("ssh") || query.includes("brute force") || query.includes("login")) {
        botResponse = `### Intrusion Report: SSH Brute Force
ChromaDB returned **42 log matches** corresponding to authentication failure diagnostics on \`postgres-main-db\` / \`staging-server\`.

**Analytics & Threat Intel:**
- **Source IP:** \`192.168.1.104\`
- **Attack Vector:** pam_unix daemon SSH login sweeps using common security profiles.
- **Timestamp Cluster:** June 4, 10:48 to 10:50 UTC.

**Recommended Actions:**
1. Block IP \`192.168.1.104\` at the edge router firewall level.
2. Instate security parameters restricting port 22 access strictly to your corporate VPN CIDR blocks.
3. Configure Clerk to require 2FA for all administrative dashboards.`;
        sources = ["auth.log lines 1042-1084", "prisma://audit-logs/id:100", "FastAPI Threat Rules: brute_force.py"];
      } else if (query.includes("soc2") || query.includes("compliance") || query.includes("audit")) {
        botResponse = `### Compliance Audit Status: SOC 2 Type II
According to the local database audit indices, your current score is **94.8%** compliance.

**Deficiencies Found:**
- **SEC-06 (Failed):** The staging server endpoint lacks active host intrusion prevention software. 

**Advisory:**
Install the \`aegis-agent-hips\` package on the staging node and trigger the compliance check again in the Compliance Checker panel.`;
        sources = ["prisma://compliance-checks/SEC-06", "compliance_framework_soc2.json", "FastAPI Core Agent Config"];
      } else if (query.includes("ddos") || query.includes("traffic")) {
        botResponse = `### DDoS Alert Vector Analysis
Analyzing network traffic profiles in ChromaDB. Found **128 correlated alert triggers** for packet rates exceeding threshold limits.

**Remediation Steps:**
- Mitigated by triggering the volumetric rate limiter on edge interface eth0. 
- Traffic from German proxy ranges was shed. Uptime remains green (100%).`;
        sources = ["syslog network_inbound.log", "FastAPI analytics: ddos_detector.py"];
      } else {
        botResponse = `I processed your query against the active vector database index.

No immediate critical alerts correspond exactly to **"${userMessage.text}"**. However, if you are referencing system logs or network traffic, make sure to ingest the corresponding raw logs using the FastAPI ingest api endpoint.

For assistance with standard queries, try asking:
- *"Are we compliant with SOC2?"*
- *"Show details on SSH brute force failures"*
- *"Provide incident summary for DDoS attacks"*`;
        sources = ["ChromaDB local vector index: log_index_latest"];
      }

      const botMessage: Message = {
        id: Math.random().toString(),
        sender: "bot",
        text: botResponse,
        timestamp: new Date().toTimeString().split(" ")[0],
        sources: sources
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, botMessage]);
    }, 2000);
  };

  const handleClear = () => {
    setMessages(INITIAL_MESSAGES);
  };

  const handleReindex = () => {
    setIsIndexing(true);
    setTimeout(() => {
      setIsIndexing(false);
    }, 2500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] space-y-4">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
            AI Threat RAG Agent
          </h1>
          <p className="text-xs text-muted-foreground">
            Ask security-related questions. The agent fetches relevant logs from ChromaDB and evaluates actions via LangChain.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs h-8 border-border text-muted-foreground hover:text-foreground flex items-center gap-1.5"
            onClick={handleReindex}
            disabled={isIndexing}
          >
            {isIndexing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Indexing ChromaDB...
              </>
            ) : (
              <>
                <Database className="w-3.5 h-3.5 text-cyber-blue" />
                Sync Vector Index
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs h-8 border-border text-muted-foreground hover:text-cyber-red"
            onClick={handleClear}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Main Terminal Window */}
      <div className="flex-1 bg-black/35 border border-border rounded-xl flex flex-col overflow-hidden relative backdrop-blur-sm">
        {/* Glow */}
        <div className="absolute top-[-10%] right-[-10%] w-72 h-72 bg-cyber-blue/5 rounded-full blur-[60px] pointer-events-none" />

        {/* Message history */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              {msg.sender === "bot" && (
                <div className="w-7 h-7 rounded-lg bg-cyber-blue/10 border border-cyber-blue/30 flex items-center justify-center text-cyber-blue shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.15)]">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed space-y-2.5 ${
                msg.sender === "user" 
                  ? "bg-primary text-primary-foreground border border-primary/20 shadow-[0_4px_15px_rgba(6,182,212,0.05)]" 
                  : "bg-card border border-border text-foreground"
              }`}>
                <div className="prose prose-invert prose-xs whitespace-pre-line text-inherit">
                  {msg.text}
                </div>

                {msg.sources && msg.sources.length > 0 && (
                  <div className="border-t border-border/40 pt-2 space-y-1">
                    <p className="text-[9px] text-muted-foreground uppercase font-mono tracking-wider flex items-center gap-1">
                      <Database className="w-3 h-3" /> ChromaDB References Source Slices:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.sources.map((src, i) => (
                        <Badge key={i} variant="secondary" className="font-mono text-[8px] px-1.5 py-0 border border-border/50 text-muted-foreground bg-background/50">
                          {src}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {msg.sender === "user" && (
                <div className="w-7 h-7 rounded-lg bg-secondary border border-border flex items-center justify-center text-foreground shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-7 h-7 rounded-lg bg-cyber-blue/10 border border-cyber-blue/30 flex items-center justify-center text-cyber-blue shrink-0 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-card border border-border rounded-lg p-3 text-xs text-muted-foreground flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-cyber-blue animate-spin" />
                RAG Agent searching ChromaDB and analyzing logs...
              </div>
            </div>
          )}
        </div>

        {/* Input panel */}
        <form onSubmit={handleSend} className="p-3 border-t border-border bg-background/40 flex items-center gap-2">
          <Input 
            placeholder="Type a log query, e.g., 'Are we compliant with SOC2?' or 'Show SSH logins'..."
            className="flex-1 bg-background/50 border-border text-foreground text-xs focus-visible:ring-cyber-blue/40"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={isTyping}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isTyping || !inputVal.trim()}
            className="h-9 w-9 bg-primary text-primary-foreground border border-cyber-blue/20 hover:opacity-90 transition-opacity"
          >
            <Send className="w-3.5 h-3.5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
