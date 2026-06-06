"use client";

import React, { useState } from "react";
import { 
  FileText, Download, Calendar, Play, 
  CheckCircle, FileSignature, Clock, RefreshCw 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SecurityReport {
  id: string;
  name: string;
  type: string;
  compiledAt: string;
  status: "ready" | "compiling" | "failed";
  fileSize: string;
}

const INITIAL_REPORTS: SecurityReport[] = [
  { id: "REP-082", name: "Monthly Threat Intel Digest - May 2026", type: "Threat Summary", compiledAt: "2026-06-01 00:05", status: "ready", fileSize: "2.4 MB" },
  { id: "REP-081", name: "Compliance Posture Audit Report (SOC2 v2)", type: "Compliance Audit", compiledAt: "2026-05-15 14:32", status: "ready", fileSize: "1.8 MB" },
  { id: "REP-080", name: "Incident Remediation Audit Log - Q1 2026", type: "Incident Log", compiledAt: "2026-04-01 09:12", status: "ready", fileSize: "5.1 MB" },
];

export default function ReportsPage() {
  const [reports, setReports] = useState<SecurityReport[]>(INITIAL_REPORTS);
  const [isCompiling, setIsCompiling] = useState(false);

  const generateReport = () => {
    setIsCompiling(true);
    
    const newReportId = `REP-${Math.floor(Math.random() * 100 + 100)}`;
    const tempReport: SecurityReport = {
      id: newReportId,
      name: "Autonomous SOC Executive Digest - Live",
      type: "Executive Summary",
      compiledAt: "Compiling...",
      status: "compiling",
      fileSize: "Generating..."
    };

    setReports(prev => [tempReport, ...prev]);

    setTimeout(() => {
      const nowStr = new Date().toISOString().slice(0, 16).replace("T", " ");
      setReports(prev => prev.map(rep => rep.id === newReportId ? {
        ...rep,
        compiledAt: nowStr,
        status: "ready",
        fileSize: "1.2 MB"
      } : rep));
      setIsCompiling(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
            Executive Security Reports
          </h1>
          <p className="text-xs text-muted-foreground">
            Generate and download CISO-ready security summaries, incident audits, and compliance metrics.
          </p>
        </div>

        <Button 
          onClick={generateReport}
          disabled={isCompiling}
          className="bg-primary text-primary-foreground text-xs hover:opacity-90 transition-opacity h-9 border border-primary/20 shadow-[0_0_15px_rgba(6,182,212,0.1)] flex items-center gap-1.5"
        >
          {isCompiling ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Compiling PDF...
            </>
          ) : (
            <>
              <FileSignature className="w-4 h-4" />
              Compile Live Executive Summary
            </>
          )}
        </Button>
      </div>

      {/* Grid of Report Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-border bg-card/60">
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-mono uppercase text-muted-foreground">Threat Summaries</CardTitle>
            <FileText className="w-4 h-4 text-cyber-blue" />
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold">12 Reports</div>
            <p className="text-[10px] text-muted-foreground">Monthly aggregate analysis of block triggers.</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/60">
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-mono uppercase text-muted-foreground">Compliance Audits</CardTitle>
            <Clock className="w-4 h-4 text-cyber-green" />
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold">4 Audits</div>
            <p className="text-[10px] text-muted-foreground">Historical snapshots of SOC2 and ISO compliance scores.</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/60">
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-mono uppercase text-muted-foreground">Remediation Logs</CardTitle>
            <CheckCircle className="w-4 h-4 text-cyber-orange" />
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold">36 Resolved</div>
            <p className="text-[10px] text-muted-foreground">Detailed logs of incident assignees and mitigations.</p>
          </CardContent>
        </Card>
      </div>

      {/* Compiled Reports Table */}
      <Card className="border-border bg-card/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyber-blue" />
            <CardTitle className="text-sm font-semibold">Compiled PDF Archives</CardTitle>
          </div>
          <CardDescription className="text-xs">Historical repository of generated reports available for download.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-background/40">
              <TableRow className="border-b border-border">
                <TableHead className="w-28 text-xs font-mono">Report ID</TableHead>
                <TableHead className="text-xs">Document Name</TableHead>
                <TableHead className="text-xs">Category Type</TableHead>
                <TableHead className="text-xs">Date Generated</TableHead>
                <TableHead className="text-xs">Size</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-right text-xs">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id} className="border-b border-border hover:bg-secondary/10 transition-colors">
                  <TableCell className="font-mono text-xs text-muted-foreground">{report.id}</TableCell>
                  <TableCell className="text-xs font-semibold">{report.name}</TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">{report.type}</TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">{report.compiledAt}</TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">{report.fileSize}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[10px] capitalize font-mono ${
                      report.status === "ready" 
                        ? "border-cyber-green/30 text-cyber-green bg-cyber-green/5" 
                        : report.status === "compiling"
                          ? "border-cyber-orange/30 text-cyber-orange bg-cyber-orange/5 animate-pulse"
                          : "border-cyber-red/30 text-cyber-red"
                    }`}>
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={report.status !== "ready"}
                      className="text-xs h-8 border-border text-muted-foreground hover:text-foreground flex items-center gap-1.5 ml-auto"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download PDF
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
