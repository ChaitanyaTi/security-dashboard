"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, AlertTriangle, Play, RefreshCw, 
  CheckCircle2, ClipboardList, Info, ShieldAlert 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AuditRule {
  id: string;
  policy: string;
  category: string;
  status: "compliant" | "warning" | "failed";
  checkedDate: string;
  remediation: string;
}

const INITIAL_RULES: AuditRule[] = [
  { id: "SEC-01", policy: "Multi-Factor Authentication Enforced in Clerk", category: "Access Control", status: "compliant", checkedDate: "2026-06-04 09:12", remediation: "None required." },
  { id: "SEC-02", policy: "Neon Database SSL Encryption Enabled", category: "Data Protection", status: "compliant", checkedDate: "2026-06-04 09:12", remediation: "None required." },
  { id: "SEC-03", policy: "Log Retention Configuration (30-day min)", category: "Monitoring", status: "compliant", checkedDate: "2026-06-04 09:12", remediation: "None required." },
  { id: "SEC-04", policy: "Inbound log schema validator active", category: "Audit Log Integrity", status: "compliant", checkedDate: "2026-06-04 09:12", remediation: "None required." },
  { id: "SEC-05", policy: "Admin API Key Rotation Policy (90-day limit)", category: "Credentials", status: "warning", checkedDate: "2026-06-04 09:12", remediation: "Active API key has been open for 112 days. Rotate key in settings." },
  { id: "SEC-06", policy: "Active Host Intrusion Prevention System", category: "Endpoint Security", status: "failed", checkedDate: "2026-06-04 09:12", remediation: "Staging server endpoint is missing HIPS deployment package." },
];

export default function CompliancePage() {
  const [rules, setRules] = useState<AuditRule[]>(INITIAL_RULES);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditLogs, setAuditLogs] = useState<string[]>([]);
  const [complianceScore, setComplianceScore] = useState(83); // 5 compliant out of 6 (83%)

  const runAudit = () => {
    setIsAuditing(true);
    setAuditLogs([]);
    
    const consoleLogs = [
      "Initializing Aegis compliance scanner v1.5...",
      "Validating Neon Database SSL session certificates... COMPLIANT",
      "Scanning Clerk Tenant organization settings... COMPLIANT",
      "Parsing log ingestion database entries... COMPLIANT",
      "Verifying active API keys in settings schema... WARNING [Key exceeded 90-day window]",
      "Auditing active endpoint logs in endpoint services... FAILED [Endpoint: node-staging is unmonitored]",
      "Compiling compliance score audit index..."
    ];

    let logIndex = 0;
    const interval = setInterval(() => {
      if (logIndex < consoleLogs.length) {
        setAuditLogs((prev) => [...prev, consoleLogs[logIndex]]);
        logIndex++;
      } else {
        clearInterval(interval);
        setIsAuditing(false);
        // Fix warning and failure to simulate resolution if they want, but here we just update timestamp
        const nowStr = new Date().toISOString().slice(0, 16).replace("T", " ");
        setRules(prev => prev.map(r => ({ ...r, checkedDate: nowStr })));
      }
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
            Compliance Posture
          </h1>
          <p className="text-xs text-muted-foreground">
            Audit configurations against industry-standard security frameworks automatically.
          </p>
        </div>

        <Button 
          onClick={runAudit} 
          disabled={isAuditing}
          className="bg-primary text-primary-foreground text-xs hover:opacity-90 transition-opacity h-9 border border-primary/20 shadow-[0_0_15px_rgba(6,182,212,0.1)] flex items-center gap-1.5"
        >
          {isAuditing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Scanning System...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Run Compliance Audit
            </>
          )}
        </Button>
      </div>

      {/* Overview stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="border-border bg-card/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono uppercase text-muted-foreground">Overall Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold font-mono text-cyber-blue">{complianceScore}%</div>
            <p className="text-[10px] text-muted-foreground mt-1">Requires 100% for SOC2 certification.</p>
          </CardContent>
        </Card>
        
        <Card className="border-border bg-card/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono uppercase text-muted-foreground">Compliant Policies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold font-mono text-cyber-green">4 <span className="text-xs text-muted-foreground">/ 6</span></div>
            <p className="text-[10px] text-muted-foreground mt-1">Pass rate satisfies basic audit tier.</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono uppercase text-muted-foreground">Deficiencies Found</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold font-mono text-cyber-red">2</div>
            <p className="text-[10px] text-cyber-orange mt-1 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              1 critical policy failure
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Scanning console when active */}
      {isAuditing || auditLogs.length > 0 ? (
        <Card className="border-border bg-black/40">
          <CardHeader className="py-3 border-b border-border">
            <CardTitle className="text-xs font-mono text-cyber-blue flex items-center gap-1.5">
              <ClipboardList className="w-4 h-4" /> COMPLIANCE SCANNER LOG CONSOLE
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 font-mono text-[10px] text-cyber-green space-y-1 max-h-48 overflow-y-auto">
            {auditLogs.map((log, index) => (
              <div key={index} className="flex gap-2">
                <span className="text-muted-foreground/40">&gt;&gt;</span>
                <p className={log.includes("FAILED") ? "text-cyber-red" : log.includes("WARNING") ? "text-cyber-orange" : ""}>
                  {log}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {/* Tabs for framework audits */}
      <Tabs defaultValue="soc2" className="w-full">
        <TabsList className="bg-secondary/40 border border-border w-fit h-10 p-1 flex gap-2">
          <TabsTrigger value="soc2" className="text-xs data-[state=active]:bg-background/80 data-[state=active]:text-cyber-blue">SOC 2 Type II</TabsTrigger>
          <TabsTrigger value="iso" className="text-xs data-[state=active]:bg-background/80 data-[state=active]:text-cyber-blue">ISO 27001</TabsTrigger>
          <TabsTrigger value="gdpr" className="text-xs data-[state=active]:bg-background/80 data-[state=active]:text-cyber-blue">GDPR Privacy</TabsTrigger>
        </TabsList>
        
        <TabsContent value="soc2" className="mt-4">
          <Card className="border-border bg-card/50">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-cyber-blue" />
                SOC 2 Security Trust Services Criteria
              </CardTitle>
              <CardDescription className="text-xs">Security operations compliance mapping details for active tenant.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-background/40">
                  <TableRow className="border-b border-border">
                    <TableHead className="w-24 text-xs font-mono">Control ID</TableHead>
                    <TableHead className="text-xs">Policy Objective</TableHead>
                    <TableHead className="text-xs">Framework Category</TableHead>
                    <TableHead className="text-xs">Last Verified</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-xs">Remediation Advisory</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rules.map((rule) => (
                    <TableRow key={rule.id} className="border-b border-border hover:bg-secondary/10 transition-colors">
                      <TableCell className="font-mono text-xs text-muted-foreground">{rule.id}</TableCell>
                      <TableCell className="text-xs font-semibold">{rule.policy}</TableCell>
                      <TableCell className="text-xs text-muted-foreground font-mono">{rule.category}</TableCell>
                      <TableCell className="text-xs text-muted-foreground font-mono">{rule.checkedDate}</TableCell>
                      <TableCell>
                        <Badge className={`text-[10px] capitalize font-mono border-0 font-semibold ${
                          rule.status === "compliant" 
                            ? "bg-cyber-green/20 text-cyber-green" 
                            : rule.status === "warning"
                              ? "bg-cyber-orange/20 text-cyber-orange"
                              : "bg-cyber-red/20 text-cyber-red"
                        }`}>
                          {rule.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{rule.remediation}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="iso" className="mt-4">
          <Card className="border-border bg-card/50 p-6 text-center text-xs text-muted-foreground font-mono">
            ISO 27001 COMPLIANCE GRID IS INITIALIZING... RUN SYSTEM AUDIT TO SYNC DATA.
          </Card>
        </TabsContent>

        <TabsContent value="gdpr" className="mt-4">
          <Card className="border-border bg-card/50 p-6 text-center text-xs text-muted-foreground font-mono">
            GDPR CUSTOMER PRIVACY GRID IS INITIALIZING... RUN SYSTEM AUDIT TO SYNC DATA.
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
