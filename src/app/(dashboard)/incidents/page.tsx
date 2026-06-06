"use client";

import React, { useState } from "react";
import { 
  AlertOctagon, Sparkles, User, Shield, 
  ArrowRight, ShieldAlert, CheckCircle, RefreshCw 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface SecurityIncident {
  id: string;
  title: string;
  category: "DDoS" | "SQL Injection" | "Brute Force" | "Data Leak";
  threatCount: number;
  severity: "critical" | "high" | "medium";
  status: "open" | "investigating" | "resolved";
  assignedTo: string;
  createdTime: string;
  description: string;
}

const MOCK_INCIDENTS: SecurityIncident[] = [
  {
    id: "INC-2026-001",
    title: "SQL Injection Spike on Customer DB Gateway",
    category: "SQL Injection",
    threatCount: 14,
    severity: "critical",
    status: "open",
    assignedTo: "Analyst_01",
    createdTime: "2026-06-04 10:50:11",
    description: "Multiple attempts matching signature SQL_INJECT_EXPLOIT were recorded against the core billing portal. Source IPs originated from multiple locations, suggesting a coordinated distributed scanning attempt."
  },
  {
    id: "INC-2026-002",
    title: "Brute Force Auth Attack on Main Admin SSH Node",
    category: "Brute Force",
    threatCount: 42,
    severity: "high",
    status: "investigating",
    assignedTo: "Unassigned",
    createdTime: "2026-06-04 10:48:14",
    description: "Repeated connection attempts targeting sshd port 22 on staging-host. Authentication logs show attempts using high-frequency password lists for 'root', 'admin', and 'kubernetes' credentials."
  },
  {
    id: "INC-2026-003",
    title: "Volumetric DDoS Warning on Edge Router 04",
    category: "DDoS",
    threatCount: 128,
    severity: "critical",
    status: "resolved",
    assignedTo: "Analyst_02",
    createdTime: "2026-06-04 09:30:00",
    description: "Ingress bandwidth saturated interface eth0. Rate limiter thresholds activated, shedding 80% of untrusted TCP traffic from German proxy subnets."
  }
];

export default function IncidentsHub() {
  const [incidents, setIncidents] = useState<SecurityIncident[]>(MOCK_INCIDENTS);
  const [selectedIncident, setSelectedIncident] = useState<SecurityIncident | null>(null);
  
  // AI summary states
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);

  const handleTriage = (id: string, nextStatus: "open" | "investigating" | "resolved") => {
    setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status: nextStatus } : inc));
    if (selectedIncident?.id === id) {
      setSelectedIncident(prev => prev ? { ...prev, status: nextStatus } : null);
    }
  };

  const handleAssignSelf = (id: string) => {
    setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, assignedTo: "Analyst_01", status: "investigating" } : inc));
    if (selectedIncident?.id === id) {
      setSelectedIncident(prev => prev ? { ...prev, assignedTo: "Analyst_01", status: "investigating" } : null);
    }
  };

  const generateAiSummary = () => {
    if (!selectedIncident) return;
    setIsGeneratingAi(true);
    setAiReport(null);

    // Simulate calling python FastAPI + OpenRouter RAG engine
    setTimeout(() => {
      setIsGeneratingAi(false);
      setAiReport(`### [Aegis AI Threat Analysis Report: ${selectedIncident.id}]

**Executive Summary:**
A cluster of **${selectedIncident.threatCount} malicious events** matched pattern signatures for **${selectedIncident.category}**. This activity represents a concentrated exploit attempt targeting secondary application assets.

---

**Root Cause Diagnostics:**
- **Target Asset:** \`postgres-main-db\` / API router portal.
- **Exploit Signature:** SQL injection union-based payload injected into form query variables.
- **Attacker Profile:** Coordinated scanning nodes using public hosting server proxies.

---

**Mitigation & Action Checklist:**
1. [x] **IP Quarantine:** Source IP addresses blacklisted at the WAF level.
2. [ ] **Patches:** Validate API endpoint sanitation and install dependency patches for Node query builders.
3. [ ] **Secrets:** Rotate database application credentials immediately due to credential probe risks.

**SOC Advisory:** Severity remains high. Continue investigating surrounding firewall logs. Run compliance scan post-mitigation.`);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
            Security Incidents Hub
          </h1>
          <p className="text-xs text-muted-foreground">
            Correlated alarm groups aggregated from log anomaly streams. Assign and triage tickets here.
          </p>
        </div>
      </div>

      {/* Queue Table */}
      <Card className="border-border bg-card/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-cyber-red" />
            <CardTitle className="text-sm font-semibold">Incident Triage Queue</CardTitle>
          </div>
          <CardDescription className="text-[11px]">System-wide incident alerts classified by severity level.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-background/40">
                <TableRow className="border-b border-border">
                  <TableHead className="w-28 text-xs font-mono">Incident ID</TableHead>
                  <TableHead className="text-xs">Summary</TableHead>
                  <TableHead className="text-xs">Category</TableHead>
                  <TableHead className="text-xs">Correlated Alarms</TableHead>
                  <TableHead className="text-xs">Severity</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs">Assignee</TableHead>
                  <TableHead className="text-right text-xs">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incidents.map((incident) => (
                  <TableRow key={incident.id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                    <TableCell className="font-mono text-xs text-muted-foreground">{incident.id}</TableCell>
                    <TableCell className="text-xs font-semibold">{incident.title}</TableCell>
                    <TableCell className="text-xs font-mono">{incident.category}</TableCell>
                    <TableCell className="text-xs font-mono text-center">{incident.threatCount}</TableCell>
                    <TableCell>
                      <Badge className={`text-[10px] capitalize font-mono border-0 font-semibold ${
                        incident.severity === "critical" 
                          ? "bg-cyber-red/20 text-cyber-red" 
                          : incident.severity === "high"
                            ? "bg-cyber-orange/20 text-cyber-orange"
                            : "bg-cyber-blue/20 text-cyber-blue"
                      }`}>
                        {incident.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-[10px] capitalize font-mono ${
                        incident.status === "open" 
                          ? "border-cyber-red/30 text-cyber-red bg-cyber-red/5" 
                          : incident.status === "investigating"
                            ? "border-cyber-orange/30 text-cyber-orange bg-cyber-orange/5"
                            : "border-cyber-green/30 text-cyber-green bg-cyber-green/5"
                      }`}>
                        {incident.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground flex items-center gap-1 mt-1">
                      <User className="w-3.5 h-3.5 text-muted-foreground/60" />
                      {incident.assignedTo}
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog onOpenChange={(open) => { if (!open) setAiReport(null); }}>
                        <DialogTrigger
                          render={
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-xs h-8 border-border text-foreground hover:bg-secondary"
                              onClick={() => setSelectedIncident(incident)}
                            >
                              Triage Ticket
                            </Button>
                          }
                        />
                        <DialogContent className="bg-card border-border text-foreground max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-base font-bold">
                              <AlertOctagon className="w-5 h-5 text-cyber-red animate-pulse" />
                              Triage Workspace: {selectedIncident?.id}
                            </DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground">Perform incident review, assign operators, and consult Aegis AI advisory.</DialogDescription>
                          </DialogHeader>

                          {selectedIncident && (
                            <div className="space-y-4 pt-2">
                              {/* Meta Info */}
                              <div className="p-3.5 bg-background/50 border border-border rounded-lg space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-semibold text-foreground">{selectedIncident.title}</span>
                                  <Badge className="font-mono text-[9px]">{selectedIncident.category}</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">{selectedIncident.description}</p>
                              </div>

                              {/* Triage action row */}
                              <div className="flex flex-wrap items-center justify-between gap-3 border-y border-border py-3">
                                <div className="flex items-center gap-2">
                                  {selectedIncident.assignedTo === "Unassigned" && (
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="text-xs border-border text-cyber-blue border-cyber-blue/30 bg-cyber-blue/5 hover:bg-cyber-blue/10"
                                      onClick={() => handleAssignSelf(selectedIncident.id)}
                                    >
                                      Assign to Me
                                    </Button>
                                  )}
                                  {selectedIncident.status !== "resolved" ? (
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="text-xs border-border text-cyber-green border-cyber-green/30 bg-cyber-green/5 hover:bg-cyber-green/10"
                                      onClick={() => handleTriage(selectedIncident.id, "resolved")}
                                    >
                                      Mark as Resolved
                                    </Button>
                                  ) : (
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="text-xs border-border text-cyber-red border-cyber-red/30 bg-cyber-red/5 hover:bg-cyber-red/10"
                                      onClick={() => handleTriage(selectedIncident.id, "investigating")}
                                    >
                                      Reopen Ticket
                                    </Button>
                                  )}
                                </div>

                                <div className="text-xs text-muted-foreground">
                                  Assignee: <span className="font-mono font-semibold text-foreground">{selectedIncident.assignedTo}</span>
                                </div>
                              </div>

                              {/* AI Agent Report Section */}
                              <div className="space-y-2.5">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                    <Sparkles className="w-4 h-4 text-cyber-blue animate-pulse" />
                                    Aegis AI Copilot Advisor
                                  </h4>
                                  {!aiReport && !isGeneratingAi && (
                                    <Button 
                                      variant="default" 
                                      size="sm" 
                                      className="text-[10px] h-7 bg-primary border border-cyber-blue/20 hover:opacity-90 shadow-[0_0_15px_rgba(6,182,212,0.1)] flex items-center gap-1"
                                      onClick={generateAiSummary}
                                    >
                                      Run AI Threat Audit
                                    </Button>
                                  )}
                                </div>

                                {isGeneratingAi && (
                                  <div className="p-8 border border-cyber-blue/20 bg-cyber-blue/5 rounded-lg flex flex-col items-center justify-center gap-3 text-center">
                                    <RefreshCw className="w-6 h-6 text-cyber-blue animate-spin" />
                                    <div className="space-y-1">
                                      <p className="text-xs font-semibold text-foreground">Querying OpenRouter (langchain-agent)...</p>
                                      <p className="text-[10px] text-muted-foreground">Retrieving log slices and parsing attack signatures...</p>
                                    </div>
                                  </div>
                                )}

                                {aiReport && (
                                  <div className="p-4 border border-cyber-blue/30 bg-cyber-blue/5 rounded-lg font-sans text-xs space-y-3 shadow-[inset_0_0_20px_rgba(6,182,212,0.02)]">
                                    <div className="prose prose-invert prose-xs max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
                                      {aiReport}
                                    </div>
                                    <div className="border-t border-border/40 pt-2 flex justify-between items-center text-[10px] text-muted-foreground">
                                      <span>Model: OpenRouter Llama-3.1-8B</span>
                                      <span>Latency: 2.1s</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
