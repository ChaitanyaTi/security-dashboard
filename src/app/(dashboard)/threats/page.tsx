"use client";

import React, { useState } from "react";
import { 
  ShieldAlert, Filter, Search, ShieldX, 
  ExternalLink, Eye, ArrowUpDown, ChevronDown 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface ThreatIndicator {
  id: string;
  timestamp: string;
  sourceIp: string;
  targetNode: string;
  threatType: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "active" | "mitigated" | "whitelisted";
  payload: string;
}

const MOCK_THREATS: ThreatIndicator[] = [
  { id: "THR-102", timestamp: "2026-06-04 10:50:18", sourceIp: "185.220.101.12", targetNode: "k8s-ingress-node", threatType: "DDoS Attempt", severity: "critical", status: "active", payload: "TCP SYN flood, rate 15k/sec, sig: SYNC_FLOOD" },
  { id: "THR-101", timestamp: "2026-06-04 10:50:11", sourceIp: "185.220.101.4", targetNode: "customer-portal-api", threatType: "SQL Injection", severity: "critical", status: "active", payload: "POST /v1/login HTTP/1.1; username=admin' OR '1'='1" },
  { id: "THR-100", timestamp: "2026-06-04 10:50:14", sourceIp: "192.168.1.104", targetNode: "postgres-main-db", threatType: "SSH Brute Force", severity: "high", status: "active", payload: "pam_unix(ssh:auth): authentication failure; logname= uid=0 euid=0 ruser= rhost=192.168.1.104 user=root" },
  { id: "THR-099", timestamp: "2026-06-04 10:48:02", sourceIp: "82.102.23.41", targetNode: "staging-server", threatType: "Port Scanning", severity: "medium", status: "mitigated", payload: "TCP Port sweep detected across ports 21, 22, 80, 443, 8080" },
  { id: "THR-098", timestamp: "2026-06-04 10:45:51", sourceIp: "94.242.59.18", targetNode: "cdn-cache-02", threatType: "Anomalous Traffic Spike", severity: "medium", status: "mitigated", payload: "Ingress bandwidth hit 250% of historical average for 10 min window" },
  { id: "THR-097", timestamp: "2026-06-04 10:41:22", sourceIp: "5.188.10.45", targetNode: "internal-wiki", threatType: "Directory Traversal", severity: "high", status: "whitelisted", payload: "GET /index.php?page=../../../../etc/passwd HTTP/1.1" },
  { id: "THR-096", timestamp: "2026-06-04 10:38:00", sourceIp: "185.122.2.4", targetNode: "auth-gateway", threatType: "Credential Stuffing", severity: "high", status: "mitigated", payload: "Failed logins spike: 42 different accounts checked in 60s" }
];

export default function ThreatsPage() {
  const [threats, setThreats] = useState<ThreatIndicator[]>(MOCK_THREATS);
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [selectedThreat, setSelectedThreat] = useState<ThreatIndicator | null>(null);

  const filteredThreats = threats.filter((threat) => {
    const matchesSearch = threat.sourceIp.includes(searchTerm) || 
                          threat.threatType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          threat.targetNode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === "all" || threat.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const handleMitigate = (id: string) => {
    setThreats(prev => prev.map(t => t.id === id ? { ...t, status: "mitigated" } : t));
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
          Threat Intelligence Feed
        </h1>
        <p className="text-xs text-muted-foreground">
          Real-time security events captured, correlated, and flagged from tenant node firewalls.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by Source IP, Type, Node..." 
            className="pl-9 bg-card/60 border-border text-foreground text-xs focus-visible:ring-cyber-blue/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Severity filter buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <Button 
            variant={severityFilter === "all" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setSeverityFilter("all")}
            className="text-xs h-9 border-border"
          >
            All
          </Button>
          <Button 
            variant={severityFilter === "critical" ? "destructive" : "outline"} 
            size="sm" 
            onClick={() => setSeverityFilter("critical")}
            className={`text-xs h-9 border-border ${severityFilter === "critical" ? "bg-cyber-red hover:bg-cyber-red/80" : ""}`}
          >
            Critical
          </Button>
          <Button 
            variant={severityFilter === "high" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setSeverityFilter("high")}
            className={`text-xs h-9 border-border ${severityFilter === "high" ? "bg-cyber-orange hover:bg-cyber-orange/80 text-background font-semibold" : ""}`}
          >
            High
          </Button>
          <Button 
            variant={severityFilter === "medium" ? "secondary" : "outline"} 
            size="sm" 
            onClick={() => setSeverityFilter("medium")}
            className="text-xs h-9 border-border"
          >
            Medium
          </Button>
        </div>
      </div>

      {/* Threats Table Card */}
      <Card className="border-border bg-card/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-cyber-blue" />
            <CardTitle className="text-sm font-semibold">Active Threat Log (Ingestion Portal)</CardTitle>
          </div>
          <CardDescription className="text-[11px]">Click on any threat entry to inspect JSON payloads, firewall headers, and trigger mitigations.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-background/40">
                <TableRow className="border-b border-border">
                  <TableHead className="w-24 text-xs font-mono">Threat ID</TableHead>
                  <TableHead className="text-xs">Timestamp (UTC)</TableHead>
                  <TableHead className="text-xs">Source IP</TableHead>
                  <TableHead className="text-xs">Target Destination</TableHead>
                  <TableHead className="text-xs">Threat Type</TableHead>
                  <TableHead className="text-xs">Severity</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-right text-xs">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredThreats.length > 0 ? (
                  filteredThreats.map((threat) => (
                    <TableRow key={threat.id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                      <TableCell className="font-mono text-xs text-muted-foreground">{threat.id}</TableCell>
                      <TableCell className="text-xs text-muted-foreground font-mono">{threat.timestamp}</TableCell>
                      <TableCell className="text-xs font-semibold font-mono">{threat.sourceIp}</TableCell>
                      <TableCell className="text-xs font-mono">{threat.targetNode}</TableCell>
                      <TableCell className="text-xs font-medium">{threat.threatType}</TableCell>
                      <TableCell>
                        <Badge className={`text-[10px] capitalize font-mono border-0 font-semibold ${
                          threat.severity === "critical" 
                            ? "bg-cyber-red/20 text-cyber-red" 
                            : threat.severity === "high"
                              ? "bg-cyber-orange/20 text-cyber-orange"
                              : threat.severity === "medium"
                                ? "bg-cyber-blue/20 text-cyber-blue"
                                : "bg-muted text-muted-foreground"
                        }`}>
                          {threat.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-[10px] capitalize font-mono ${
                          threat.status === "active" 
                            ? "border-cyber-red/30 text-cyber-red bg-cyber-red/5" 
                            : threat.status === "mitigated"
                              ? "border-cyber-green/30 text-cyber-green bg-cyber-green/5"
                              : "border-muted text-muted-foreground"
                        }`}>
                          {threat.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger
                            render={
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8 border-border text-muted-foreground hover:text-foreground"
                                onClick={() => setSelectedThreat(threat)}
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </Button>
                            }
                          />
                          <DialogContent className="bg-card border-border text-foreground max-w-lg">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2 text-base font-bold">
                                <ShieldX className="w-5 h-5 text-cyber-red" />
                                Threat Incident Details: {selectedThreat?.id}
                              </DialogTitle>
                              <DialogDescription className="text-xs text-muted-foreground">Detailed packet metadata captured during rule matching.</DialogDescription>
                            </DialogHeader>

                            {selectedThreat && (
                              <div className="space-y-4 pt-2">
                                <div className="grid grid-cols-2 gap-4 text-xs">
                                  <div className="p-2 rounded bg-background/50 border border-border">
                                    <p className="text-[10px] text-muted-foreground uppercase font-mono">Source Host IP</p>
                                    <p className="font-semibold font-mono mt-0.5 text-foreground">{selectedThreat.sourceIp}</p>
                                  </div>
                                  <div className="p-2 rounded bg-background/50 border border-border">
                                    <p className="text-[10px] text-muted-foreground uppercase font-mono">Impacted Server Node</p>
                                    <p className="font-semibold font-mono mt-0.5 text-foreground">{selectedThreat.targetNode}</p>
                                  </div>
                                </div>

                                <div className="space-y-1.5">
                                  <p className="text-xs text-muted-foreground">Correlated Diagnostic Log Payload:</p>
                                  <pre className="p-3 bg-black/60 border border-border rounded font-mono text-[10px] text-cyber-orange leading-relaxed overflow-x-auto whitespace-pre-wrap">
                                    {selectedThreat.payload}
                                  </pre>
                                </div>

                                <div className="flex justify-end gap-2 border-t border-border pt-4">
                                  {selectedThreat.status === "active" && (
                                    <Button 
                                      variant="destructive" 
                                      className="text-xs bg-cyber-red hover:bg-cyber-red/80"
                                      onClick={() => {
                                        handleMitigate(selectedThreat.id);
                                        setSelectedThreat(prev => prev ? { ...prev, status: "mitigated" } : null);
                                      }}
                                    >
                                      Quarantine Source IP
                                    </Button>
                                  )}
                                  <Button variant="outline" className="text-xs border-border">
                                    Export Logs <ExternalLink className="w-3 h-3 ml-1" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-xs text-muted-foreground font-mono">
                      NO ACTIVE THREATS MATCHING SEARCH QUERY
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
