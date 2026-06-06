"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldAlert, ShieldCheck, Terminal as TerminalIcon, 
  Activity, ArrowUpRight, Cpu, Radio, Shield, Globe, 
  AlertOctagon, CheckCircle2, RefreshCw 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, 
  ResponsiveContainer, Tooltip, CartesianGrid 
} from "recharts";

// Mock log structure
interface SecurityLog {
  id: string;
  timestamp: string;
  sourceIp: string;
  severity: "critical" | "warning" | "info";
  event: string;
  country: string;
}

const INITIAL_LOGS: SecurityLog[] = [
  { id: "1", timestamp: "10:50:11", sourceIp: "185.220.101.4", severity: "critical", event: "SQL Injection attack blocked", country: "DE" },
  { id: "2", timestamp: "10:50:13", sourceIp: "82.102.23.41", severity: "info", event: "Successful port scan on port 443", country: "RU" },
  { id: "3", timestamp: "10:50:14", sourceIp: "192.168.1.104", severity: "warning", event: "Multiple SSH login failures on main-db", country: "US" },
  { id: "4", timestamp: "10:50:17", sourceIp: "94.242.59.18", severity: "info", event: "Ingress TCP traffic spike (15k req/sec)", country: "NL" },
  { id: "5", timestamp: "10:50:18", sourceIp: "185.220.101.12", severity: "critical", event: "DDoS handshake threshold exceeded", country: "DE" },
];

const ATTACK_DATA = [
  { time: "00:00", attacks: 120 },
  { time: "04:00", attacks: 380 },
  { time: "08:00", attacks: 210 },
  { time: "12:00", attacks: 850 },
  { time: "16:00", attacks: 420 },
  { time: "20:00", attacks: 910 },
  { time: "24:00", attacks: 610 },
];

const CATEGORY_DATA = [
  { name: "DDoS", count: 480, fill: "var(--cyber-red)" },
  { name: "SQLi", count: 290, fill: "var(--cyber-orange)" },
  { name: "Brute Force", count: 320, fill: "var(--cyber-blue)" },
  { name: "Port Scan", count: 180, fill: "var(--cyber-green)" },
];

export default function OverviewPage() {
  const [logs, setLogs] = useState<SecurityLog[]>(INITIAL_LOGS);
  const [activeIntrusions, setActiveIntrusions] = useState(3);
  const [injestRate, setInjestRate] = useState(1482);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Simulate real-time security events
  useEffect(() => {
    const eventTypes = [
      { event: "TCP/SYN Flood block on Node-8", severity: "warning" as const, country: "CN", ip: "45.143.20.18" },
      { event: "Suspicious file modification: /var/bin/cron", severity: "critical" as const, country: "US", ip: "192.168.1.112" },
      { event: "TLS handshake failure: Cipher mismatch", severity: "info" as const, country: "GB", ip: "212.48.10.9" },
      { event: "XSS attempt neutralized on login portal", severity: "critical" as const, country: "FR", ip: "79.132.88.54" },
      { event: "API key abuse: request threshold hit", severity: "warning" as const, country: "BR", ip: "187.94.102.5" },
    ];

    const interval = setInterval(() => {
      const selected = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];
      const newLog: SecurityLog = {
        id: Math.random().toString(),
        timestamp: timeStr,
        sourceIp: selected.ip,
        severity: selected.severity,
        event: selected.event,
        country: selected.country,
      };

      setLogs((prev) => [...prev.slice(-30), newLog]); // Keep max 30 logs

      // Randomize rates
      setInjestRate((prev) => Math.floor(prev + (Math.random() * 80 - 40)));
      
      if (Math.random() > 0.7) {
        setActiveIntrusions((prev) => Math.max(1, prev + (Math.random() > 0.5 ? 1 : -1)));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
            SOC Operations Terminal
          </h1>
          <p className="text-xs text-muted-foreground">
            System status monitoring: <span className="text-cyber-green font-semibold">Active Isolation</span>. Showing live threat intel.
          </p>
        </div>
        <Button variant="outline" size="sm" className="h-9 border-border bg-card/40 flex items-center gap-2">
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Core Metrics
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Intrusions */}
        <Card className="relative overflow-hidden border-cyber-red/20 bg-cyber-red/5 shadow-[0_0_15px_rgba(239,68,68,0.02)]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyber-red/5 rounded-full blur-2xl pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-mono tracking-wider uppercase text-cyber-red">Active Intrusions</CardTitle>
            <ShieldAlert className="w-4 h-4 text-cyber-red animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold font-mono text-cyber-red">{activeIntrusions}</div>
            <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-red animate-ping" />
              Triage response required.
            </p>
          </CardContent>
        </Card>

        {/* Log Ingest Rate */}
        <Card className="relative overflow-hidden border-cyber-blue/20 bg-cyber-blue/5">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyber-blue/5 rounded-full blur-2xl pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-mono tracking-wider uppercase text-cyber-blue">Ingest Rate</CardTitle>
            <Activity className="w-4 h-4 text-cyber-blue animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold font-mono text-cyber-blue">{injestRate} <span className="text-xs font-normal">/s</span></div>
            <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-blue" />
              Bandwidth: 48.2 MB/s
            </p>
          </CardContent>
        </Card>

        {/* Compliance Posture */}
        <Card className="relative overflow-hidden border-cyber-green/20 bg-cyber-green/5">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyber-green/5 rounded-full blur-2xl pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-mono tracking-wider uppercase text-cyber-green">Compliance SOC2</CardTitle>
            <ShieldCheck className="w-4 h-4 text-cyber-green" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold font-mono text-cyber-green">94.8%</div>
            <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-green" />
              14/15 policies audited
            </p>
          </CardContent>
        </Card>

        {/* Monitored Nodes */}
        <Card className="relative overflow-hidden border-border bg-card/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-mono tracking-wider uppercase text-muted-foreground">Monitored Nodes</CardTitle>
            <Cpu className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold font-mono">148 <span className="text-xs text-muted-foreground font-normal">/ 150</span></div>
            <p className="text-[10px] text-cyber-orange mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-orange animate-pulse" />
              2 offline node warnings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Visual Operations Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Real-time Threat Map Simulator (Left 2 Columns on large screens) */}
        <Card className="lg:col-span-2 border-border bg-card/50 backdrop-blur-sm relative overflow-hidden flex flex-col h-[400px]">
          <div className="absolute top-0 right-0 w-44 h-44 bg-cyber-blue/5 rounded-full blur-[60px] pointer-events-none" />
          <CardHeader className="border-b border-border pb-3 shrink-0 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyber-blue" />
                Active Attack Vectors Simulation
              </CardTitle>
              <CardDescription className="text-[10px]">Real-time visual threat tracer originating from global coordinates.</CardDescription>
            </div>
            <Badge variant="outline" className="font-mono text-[9px] border-cyber-blue/30 text-cyber-blue bg-cyber-blue/5 animate-pulse flex items-center gap-1">
              <Radio className="w-2.5 h-2.5" /> LIVE SCANNING
            </Badge>
          </CardHeader>
          <CardContent className="flex-1 relative bg-black/20 p-0 flex items-center justify-center">
            {/* SVG Visual Attack Vectors Map */}
            <svg viewBox="0 0 800 300" className="w-full h-full p-6 text-muted-foreground/30">
              {/* Grid Lines */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                </pattern>
                <radialGradient id="radial-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="var(--cyber-blue)" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="var(--cyber-blue)" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Glowing Center Hub */}
              <circle cx="400" cy="150" r="80" fill="url(#radial-glow)" />
              <circle cx="400" cy="150" r="10" className="fill-cyber-blue stroke-cyber-blue/30 stroke-[6px]" />
              <circle cx="400" cy="150" r="2" className="fill-background" />
              <text x="400" y="180" textAnchor="middle" className="fill-cyber-blue font-mono text-[10px] font-bold tracking-widest">HQ_NODE_01</text>

              {/* Concentric rings */}
              <circle cx="400" cy="150" r="50" fill="none" stroke="rgba(6,182,212,0.1)" strokeWidth="1" strokeDasharray="5,5" />
              <circle cx="400" cy="150" r="100" fill="none" stroke="rgba(6,182,212,0.06)" strokeWidth="1" />
              <circle cx="400" cy="150" r="160" fill="none" stroke="rgba(6,182,212,0.04)" strokeWidth="1" strokeDasharray="10,5" />

              {/* Scanning sweep line */}
              <motion.line 
                x1="400" y1="150" x2="700" y2="150" 
                stroke="rgba(6,182,212,0.25)" strokeWidth="2"
                style={{ originX: "400px", originY: "150px" }}
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />

              {/* Source Nodes */}
              {/* DE Node */}
              <circle cx="200" cy="80" r="4" className="fill-cyber-red animate-pulse" />
              <line x1="200" y1="80" x2="400" y2="150" stroke="var(--cyber-red)" strokeWidth="1" strokeDasharray="4,4" className="opacity-40" />
              <text x="180" y="75" className="fill-muted-foreground font-mono text-[9px]">DE_185.22</text>

              {/* RU Node */}
              <circle cx="650" cy="100" r="4" className="fill-cyber-orange animate-pulse" />
              <line x1="650" y1="100" x2="400" y2="150" stroke="var(--cyber-orange)" strokeWidth="1" strokeDasharray="4,4" className="opacity-40" />
              <text x="660" y="95" className="fill-muted-foreground font-mono text-[9px]">RU_82.10</text>

              {/* BR Node */}
              <circle cx="280" cy="240" r="4" className="fill-cyber-green animate-pulse" />
              <line x1="280" y1="240" x2="400" y2="150" stroke="var(--cyber-green)" strokeWidth="1" strokeDasharray="4,4" className="opacity-40" />
              <text x="250" y="255" className="fill-muted-foreground font-mono text-[9px]">BR_187.94</text>

              {/* Simulated Attack Vector pulses moving along line */}
              <motion.circle cx="200" cy="80" r="3" fill="var(--cyber-red)"
                animate={{ cx: [200, 400], cy: [80, 150], opacity: [0, 1, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.circle cx="650" cy="100" r="3" fill="var(--cyber-orange)"
                animate={{ cx: [650, 400], cy: [100, 150], opacity: [0, 1, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
            </svg>

            {/* Ingestion feed summary inside map */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between bg-black/40 border border-border/80 px-4 py-2 rounded-lg text-[9px] font-mono text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-cyber-red animate-ping" /> RED_ALERT: DDoS_DETECT</span>
              <span>FILTER: NONE</span>
              <span>COORDS: 48.85° N, 2.35° E</span>
            </div>
          </CardContent>
        </Card>

        {/* Live Event Terminal (Right 1 Column) */}
        <Card className="border-border bg-card/50 backdrop-blur-sm flex flex-col h-[400px]">
          <CardHeader className="border-b border-border pb-3 shrink-0 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <TerminalIcon className="w-4 h-4 text-cyber-blue" />
                Live Log Stream
              </CardTitle>
              <CardDescription className="text-[10px]">Raw event logs from connected tenant firewalls.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-3 bg-black/30 overflow-y-auto font-mono text-[10px] space-y-2.5 scrollbar-thin">
            <AnimatePresence initial={false}>
              {logs.map((log) => (
                <motion.div 
                  key={log.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-b border-border/20 pb-1.5"
                >
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-muted-foreground/60">[{log.timestamp}]</span>
                    <Badge variant="outline" className={`text-[8px] h-4 leading-none uppercase font-mono border-0 ${
                      log.severity === "critical" 
                        ? "bg-cyber-red/10 text-cyber-red" 
                        : log.severity === "warning" 
                          ? "bg-cyber-orange/10 text-cyber-orange" 
                          : "bg-cyber-blue/10 text-cyber-blue"
                    }`}>
                      {log.severity}
                    </Badge>
                    <span className="text-muted-foreground text-[9px]">{log.sourceIp} ({log.country})</span>
                  </div>
                  <p className="text-foreground/90 font-light truncate">{log.event}</p>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={terminalEndRef} />
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Line/Area Chart for threat volumes */}
        <Card className="border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Incident Attack Velocity (24h)</CardTitle>
            <CardDescription className="text-[11px]">Total registered malicious attempts across all tenant endpoints.</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ATTACK_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAttacks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--cyber-blue)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--cyber-blue)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2c35" opacity={0.3} />
                <XAxis dataKey="time" stroke="#6b7280" fontSize={10} tickLine={false} />
                <YAxis stroke="#6b7280" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#12141c", borderColor: "#272a34", color: "#f3f4f6" }}
                  itemStyle={{ color: "var(--cyber-blue)" }}
                />
                <Area type="monotone" dataKey="attacks" stroke="var(--cyber-blue)" strokeWidth={2} fillOpacity={1} fill="url(#colorAttacks)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart for Incident Categories */}
        <Card className="border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Threat Breakdown by Category</CardTitle>
            <CardDescription className="text-[11px]">Distribution of attack types categorized automatically by FastAPI.</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CATEGORY_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2c35" opacity={0.3} />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={10} tickLine={false} />
                <YAxis stroke="#6b7280" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#12141c", borderColor: "#272a34", color: "#f3f4f6" }}
                  cursor={{ fill: "rgba(255,255,255,0.02)" }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
