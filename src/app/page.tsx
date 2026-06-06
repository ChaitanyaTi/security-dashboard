"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowRight, Shield, Activity, Terminal, Cpu, Lock, 
  Globe, MessageSquare, Layers, CheckCircle2, ShieldCheck,
  Server, Zap, ShieldAlert, AlertCircle, Bot
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LandingPage() {
  // Live ticking stats
  const [threatsCount, setThreatsCount] = useState(1248390);
  const [logsCount, setLogsCount] = useState(12842903110);
  const [activeTab, setActiveTab] = useState<"threats" | "chat" | "compliance">("threats");

  // Animate statistics counters
  useEffect(() => {
    // Ticking threats (adds 1-3 threats every 1.5 seconds)
    const threatsInterval = setInterval(() => {
      setThreatsCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 1500);

    // Ticking logs (adds 800-2000 logs every 0.3 seconds)
    const logsInterval = setInterval(() => {
      setLogsCount((prev) => prev + Math.floor(Math.random() * 1200) + 800);
    }, 300);

    return () => {
      clearInterval(threatsInterval);
      clearInterval(logsInterval);
    };
  }, []);

  // Format numbers with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none" />

      {/* Radial glows */}
      <div className="absolute top-[-10%] left-[10%] w-[35rem] h-[35rem] bg-cyber-blue/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[15%] right-[-5%] w-[30rem] h-[30rem] bg-cyber-green/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="relative border-b border-border bg-background/40 backdrop-blur-md z-30">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyber-blue/10 border border-cyber-blue/30 text-cyber-blue shadow-[0_0_12px_rgba(6,182,212,0.15)]">
              <Shield className="w-4 h-4" />
            </div>
            <span className="font-semibold text-sm tracking-wider">
              AEGIS<span className="text-cyber-blue">SOC</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Platform</a>
            <a href="#mockup" className="hover:text-foreground transition-colors">Console</a>
            <a href="#trust" className="hover:text-foreground transition-colors">Security</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link 
              href="/sign-in" 
              className="text-xs font-medium hover:text-cyber-blue transition-colors px-3 py-1.5"
            >
              Sign In
            </Link>
            <Link 
              href="/overview"
              className="inline-flex h-8 items-center justify-center rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:opacity-90 transition-opacity border border-primary/20"
            >
              Go to App
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative max-w-7xl mx-auto px-6 pt-12 pb-16 z-20">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          {/* Release Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyber-blue/10 border border-cyber-blue/20 text-[10px] font-semibold text-cyber-blue tracking-wider uppercase">
            <Zap className="w-3 h-3 text-cyber-blue animate-pulse" />
            <span>AI-Powered Multi-Tenant Security Platform</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] text-foreground">
            Autonomous Threat Ingestion &
            <span className="block mt-1.5 bg-gradient-to-r from-cyber-blue via-cyber-cyan to-cyber-green bg-clip-text text-transparent filter drop-shadow-[0_0_20px_rgba(6,182,212,0.15)]">
              Agentic RAG Log Auditing
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
            Ingest firewalls and SSH server logs. Analyze compliance frameworks, generate automated incident triages, and chat with your infrastructure vector index using ChromaDB and OpenRouter.
          </p>

          {/* Hero CTAs */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link 
              href="/sign-up" 
              className="px-5 py-2.5 bg-primary text-primary-foreground font-semibold text-xs rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1.5 border border-primary/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]"
            >
              Deploy Free Cluster
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link 
              href="/overview" 
              className="px-5 py-2.5 bg-secondary/50 text-foreground border border-border hover:bg-secondary transition-colors font-semibold text-xs rounded-lg flex items-center gap-1.5"
            >
              <Terminal className="w-3.5 h-3.5 text-cyber-blue" />
              Launch Console Demo
            </Link>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-3xl mx-auto mt-10 p-3 bg-card/30 border border-border rounded-xl backdrop-blur-xs">
          <div className="p-3 text-center border-r border-border/40">
            <p className="text-[10px] uppercase font-mono text-muted-foreground tracking-wider">Threats Analyzed</p>
            <p className="text-lg md:text-xl font-bold font-mono text-cyber-red mt-1 transition-all duration-300">
              {formatNumber(threatsCount)}
            </p>
          </div>
          <div className="p-3 text-center md:border-r border-border/40">
            <p className="text-[10px] uppercase font-mono text-muted-foreground tracking-wider">Logs Processed</p>
            <p className="text-lg md:text-xl font-bold font-mono text-cyber-blue mt-1">
              {formatNumber(logsCount)}
            </p>
          </div>
          <div className="col-span-2 md:col-span-1 p-3 text-center">
            <p className="text-[10px] uppercase font-mono text-muted-foreground tracking-wider">Compliance Audits</p>
            <p className="text-lg md:text-xl font-bold font-mono text-cyber-green mt-1 flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyber-green animate-ping" />
              100% SECURE
            </p>
          </div>
        </div>

        {/* YC Styled Interactive Dashboard Screenshot Mockup */}
        <section id="mockup" className="mt-12 max-w-5xl mx-auto relative group">
          {/* Glow backdrop behind screen */}
          <div className="absolute inset-0 bg-cyber-blue/10 rounded-2xl blur-[50px] opacity-60 group-hover:opacity-85 transition-opacity pointer-events-none" />

          {/* Browser Container */}
          <div className="relative rounded-2xl border border-border/80 bg-background/85 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col h-[480px]">
            {/* Browser top-bar */}
            <div className="h-10 border-b border-border bg-card/60 px-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyber-red/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-cyber-orange/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-cyber-green/60" />
              </div>
              <div className="bg-background/80 border border-border/60 text-[9px] font-mono text-muted-foreground px-10 py-1.5 rounded-md truncate max-w-xs md:max-w-md">
                https://aegis-soc.com/dashboard/overview (Alpha Security Corp)
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse" />
                <span className="text-[9px] font-mono text-cyber-green">INGEST ACTIVE</span>
              </div>
            </div>

            {/* Dashboard Content area */}
            <div className="flex-1 flex overflow-hidden text-xs">
              {/* Mini Sidebar */}
              <aside className="w-44 border-r border-border bg-card/20 p-3 hidden sm:flex flex-col gap-2 shrink-0 select-none">
                <div className="flex items-center gap-1.5 px-2 py-1 mb-2">
                  <Shield className="w-3.5 h-3.5 text-cyber-blue" />
                  <span className="font-semibold text-[10px] tracking-widest text-foreground">AEGIS_SOC</span>
                </div>
                <div className="space-y-1">
                  <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[10px] font-medium transition-colors cursor-pointer ${activeTab === "threats" ? "bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/20" : "text-muted-foreground hover:bg-secondary/40"}`} onClick={() => setActiveTab("threats")}>
                    <Activity className="w-3 h-3" /> SOC Overview
                  </div>
                  <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[10px] font-medium transition-colors cursor-pointer ${activeTab === "chat" ? "bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/20" : "text-muted-foreground hover:bg-secondary/40"}`} onClick={() => setActiveTab("chat")}>
                    <MessageSquare className="w-3 h-3" /> Security AI Chat
                  </div>
                  <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[10px] font-medium transition-colors cursor-pointer ${activeTab === "compliance" ? "bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/20" : "text-muted-foreground hover:bg-secondary/40"}`} onClick={() => setActiveTab("compliance")}>
                    <CheckCircle2 className="w-3 h-3" /> Compliance Check
                  </div>
                </div>
                <div className="mt-auto p-2 bg-background/50 border border-border rounded-lg text-[9px] text-muted-foreground">
                  <span className="font-semibold block text-foreground">Active Tenant:</span>
                  org_alpha_systems
                </div>
              </aside>

              {/* Mini Main Panel */}
              <main className="flex-1 p-4 bg-background/20 overflow-y-auto space-y-4">
                {activeTab === "threats" && (
                  <div className="space-y-4 animate-fadeIn">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-foreground text-sm">Security Terminal Controls</h4>
                        <p className="text-[10px] text-muted-foreground">Threat tracing and multi-tenant firewall monitoring.</p>
                      </div>
                      <Badge className="bg-cyber-red/10 border border-cyber-red/30 text-cyber-red text-[8px] font-mono animate-pulse">
                        3 ALERT CRITICAL
                      </Badge>
                    </div>

                    {/* KPI row */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-2 bg-cyber-red/5 border border-cyber-red/20 rounded-lg">
                        <span className="text-[8px] font-mono text-cyber-red uppercase block">Intrusions</span>
                        <span className="text-sm font-bold font-mono text-cyber-red">3 Active</span>
                      </div>
                      <div className="p-2 bg-cyber-blue/5 border border-cyber-blue/20 rounded-lg">
                        <span className="text-[8px] font-mono text-cyber-blue uppercase block">Ingest Rate</span>
                        <span className="text-sm font-bold font-mono text-cyber-blue">1,489 /s</span>
                      </div>
                      <div className="p-2 bg-cyber-green/5 border border-cyber-green/20 rounded-lg">
                        <span className="text-[8px] font-mono text-cyber-green uppercase block">SOC2 Auditing</span>
                        <span className="text-sm font-bold font-mono text-cyber-green">94.8% Pass</span>
                      </div>
                    </div>

                    {/* Threat Map and terminal */}
                    <div className="grid md:grid-cols-5 gap-3">
                      {/* SVG Mini attack map */}
                      <div className="md:col-span-3 border border-border rounded-lg bg-black/40 p-2 flex flex-col items-center justify-center min-h-[140px] relative">
                        <span className="text-[7px] font-mono text-muted-foreground absolute top-1.5 left-2">ATTACK VECTORS SCANNER</span>
                        <svg viewBox="0 0 400 150" className="w-full h-full text-muted-foreground/20 p-2">
                          <circle cx="200" cy="75" r="40" fill="none" stroke="rgba(6,182,212,0.15)" strokeDasharray="3,3" />
                          <circle cx="200" cy="75" r="5" className="fill-cyber-blue animate-ping" />
                          {/* Attack vector lines */}
                          <line x1="80" y1="30" x2="200" y2="75" stroke="var(--cyber-red)" strokeWidth="1" strokeDasharray="2,2" />
                          <line x1="320" y1="120" x2="200" y2="75" stroke="var(--cyber-orange)" strokeWidth="1" />
                          {/* Pulses */}
                          <circle cx="80" cy="30" r="3" className="fill-cyber-red" />
                          <circle cx="320" cy="120" r="3" className="fill-cyber-orange" />
                        </svg>
                      </div>
                      
                      {/* Terminal log */}
                      <div className="md:col-span-2 border border-border rounded-lg bg-black/50 p-2 font-mono text-[8px] text-cyber-green overflow-hidden space-y-1">
                        <div className="text-muted-foreground">[10:50:18] INGEST STAGE ACTIVE</div>
                        <div className="text-cyber-red truncate">[CRIT] SQL Inject block: username=admin&apos; OR &apos;1&apos;=&apos;1</div>
                        <div className="text-cyber-orange truncate">[WARN] SSH Failure from 192.168.1.104</div>
                        <div className="text-cyber-blue truncate">[INFO] Port sweep complete (Stage node)</div>
                        <div className="text-muted-foreground/50 truncate">&gt; listening for B2B logs...</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "chat" && (
                  <div className="space-y-3 animate-fadeIn">
                    <div className="flex items-center gap-2 border-b border-border pb-2">
                      <Bot className="w-4 h-4 text-cyber-blue" />
                      <div>
                        <h4 className="font-semibold text-foreground text-[11px]">AI Log Advisor (RAG Agent)</h4>
                        <p className="text-[8px] text-muted-foreground">Ask questions indexing ChromaDB & LangChain.</p>
                      </div>
                    </div>

                    <div className="space-y-2 max-h-[220px] overflow-y-auto">
                      <div className="flex justify-start">
                        <div className="bg-card border border-border p-2 rounded-lg max-w-[90%] text-[10px] text-muted-foreground leading-relaxed">
                          Ask me anything about active anomalies. For example: <span className="text-cyber-blue font-mono">&quot;Are we compliant with SOC2?&quot;</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <div className="bg-primary text-primary-foreground p-2 rounded-lg text-[10px]">
                          Are we compliant with SOC2?
                        </div>
                      </div>

                      <div className="flex justify-start">
                        <div className="bg-card border border-border p-2 rounded-lg max-w-[90%] text-[10px] space-y-1.5">
                          <p className="text-foreground">ChromaDB matched compliance rules. Score is <span className="text-cyber-blue font-semibold">94.8%</span>.</p>
                          <p className="text-[9px]">**Failed control:** **SEC-06** - Staging server node lacks HIPS auditing software.</p>
                          <div className="pt-1.5 border-t border-border/40 text-[8px] text-muted-foreground flex gap-1 font-mono">
                            <span className="bg-secondary px-1 rounded">framework_soc2.json</span>
                            <span className="bg-secondary px-1 rounded">prisma://compliance/SEC-06</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-2 border-t border-border flex gap-2">
                      <Input placeholder="Type query (e.g. show SSH logins)..." readOnly className="h-7 text-[9px] bg-background/50 border-border" />
                      <Button size="sm" className="h-7 px-2.5 bg-primary text-primary-foreground text-[9px]">Send</Button>
                    </div>
                  </div>
                )}

                {activeTab === "compliance" && (
                  <div className="space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-border pb-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyber-green" />
                        <h4 className="font-semibold text-foreground text-[11px]">SaaS Framework Auditing</h4>
                      </div>
                      <Badge className="bg-cyber-green/10 text-cyber-green border-cyber-green/20 text-[8px] font-mono">94.8% SCORED</Badge>
                    </div>

                    <div className="border border-border rounded-lg bg-black/20 overflow-hidden">
                      <div className="grid grid-cols-4 bg-background/40 p-1.5 font-semibold text-[8px] text-muted-foreground uppercase tracking-wider border-b border-border">
                        <div>ID</div>
                        <div className="col-span-2">Policy Target</div>
                        <div>Status</div>
                      </div>
                      <div className="divide-y divide-border/50 text-[9px] font-mono">
                        <div className="grid grid-cols-4 p-1.5">
                          <div className="text-muted-foreground">SEC-01</div>
                          <div className="col-span-2 text-foreground truncate">Clerk MFA Enforced</div>
                          <div className="text-cyber-green">Compliant</div>
                        </div>
                        <div className="grid grid-cols-4 p-1.5">
                          <div className="text-muted-foreground">SEC-02</div>
                          <div className="col-span-2 text-foreground truncate">Neon SSL Configured</div>
                          <div className="text-cyber-green">Compliant</div>
                        </div>
                        <div className="grid grid-cols-4 p-1.5">
                          <div className="text-muted-foreground">SEC-06</div>
                          <div className="col-span-2 text-foreground truncate">Host HIPS active</div>
                          <div className="text-cyber-red">Failed</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </main>
            </div>
          </div>
        </section>

        {/* Trust & Badges Row */}
        <section id="trust" className="mt-12 text-center space-y-4">
          <p className="text-[10px] uppercase font-semibold font-mono tracking-widest text-muted-foreground">Compliance Frameworks Secured</p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card/40 backdrop-blur-xs shadow-[0_0_12px_rgba(255,255,255,0.01)] hover:border-cyber-blue/30 transition-colors">
              <ShieldCheck className="w-4 h-4 text-cyber-blue" />
              <span className="font-mono text-[10px] font-bold text-foreground">SOC2 TYPE II</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card/40 backdrop-blur-xs shadow-[0_0_12px_rgba(255,255,255,0.01)] hover:border-cyber-green/30 transition-colors">
              <Lock className="w-4 h-4 text-cyber-green" />
              <span className="font-mono text-[10px] font-bold text-foreground">ISO 27001</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card/40 backdrop-blur-xs shadow-[0_0_12px_rgba(255,255,255,0.01)] hover:border-cyber-orange/30 transition-colors">
              <Globe className="w-4 h-4 text-cyber-orange" />
              <span className="font-mono text-[10px] font-bold text-foreground">GDPR PRIVACY</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card/40 backdrop-blur-xs shadow-[0_0_12px_rgba(255,255,255,0.01)] hover:border-cyber-red/30 transition-colors">
              <ShieldAlert className="w-4 h-4 text-cyber-red" />
              <span className="font-mono text-[10px] font-bold text-foreground">OWASP TOP 10</span>
            </div>
          </div>
        </section>

        {/* Features & SaaS Core Capabilities */}
        <section id="features" className="mt-20 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">YC-Architected Platform Security</h2>
            <p className="text-xs text-muted-foreground max-w-xl mx-auto">
              Engineered for rapid log analytics, compliance verification, and agentic RAG reasoning.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <div className="p-5 bg-card/50 rounded-xl border border-border hover:border-cyber-blue/30 transition-all duration-300 shadow-md">
              <div className="p-2 bg-cyber-blue/10 rounded-lg text-cyber-blue w-fit mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold mb-1 text-foreground">Isolated Multi-Tenancy</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Logical schema-level database separation configured with Prisma and Clerk organization scopes.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-5 bg-card/50 rounded-xl border border-border hover:border-cyber-green/30 transition-all duration-300 shadow-md">
              <div className="p-2 bg-cyber-green/10 rounded-lg text-cyber-green w-fit mb-4">
                <Server className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold mb-1 text-foreground">FastAPI Daemon Ingestion</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Python log parser checking syntax patterns, scanning vulnerabilities, and storing indices.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-5 bg-card/50 rounded-xl border border-border hover:border-cyber-orange/30 transition-all duration-300 shadow-md">
              <div className="p-2 bg-cyber-orange/10 rounded-lg text-cyber-orange w-fit mb-4">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold mb-1 text-foreground">ChromaDB Vector Search</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                LangChain agent chains referencing security indices to resolve incidents with LLM advisors.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Tiers (Sleek YC Pricing Model) */}
        <section id="pricing" className="mt-20 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Flexible, Transparent Pricing</h2>
            <p className="text-xs text-muted-foreground max-w-xl mx-auto">
              Scale up your ingestion capacities as your network assets grow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="p-6 bg-card/40 rounded-xl border border-border space-y-5 flex flex-col justify-between hover:border-border/80 transition-colors">
              <div className="space-y-3">
                <Badge variant="outline" className="text-[9px] font-mono uppercase tracking-wider">Hacker</Badge>
                <h3 className="text-lg font-bold">Free</h3>
                <p className="text-[11px] text-muted-foreground">Basic SSH/Auth log checks for localized developers.</p>
                <div className="text-2xl font-extrabold font-mono">$0</div>
                <ul className="text-[11px] space-y-2 border-t border-border/60 pt-3 text-muted-foreground">
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-blue" />
                    1 Organization Tenant
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-blue" />
                    1 GB Monthly Log Ingestion
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-blue" />
                    Local CLI Audits Only
                  </li>
                </ul>
              </div>
              <Link 
                href="/sign-up" 
                className="w-full py-2 bg-secondary text-foreground text-center font-medium rounded-lg text-xs border border-border hover:bg-secondary/80 transition-colors"
              >
                Sign Up Free
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="p-6 bg-card rounded-xl border border-cyber-blue/30 relative space-y-5 flex flex-col justify-between shadow-[0_4px_25px_rgba(6,182,212,0.05)]">
              <div className="absolute top-0 right-6 -translate-y-1/2 bg-cyber-blue text-background text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                Startup Focus
              </div>
              <div className="space-y-3">
                <Badge className="bg-cyber-blue/10 text-cyber-blue hover:bg-cyber-blue/10 border-0 text-[9px] font-mono uppercase tracking-wider">Operator</Badge>
                <h3 className="text-lg font-bold">Pro</h3>
                <p className="text-[11px] text-muted-foreground">Complete automated auditing, incident queues, and AI advisories.</p>
                <div className="text-2xl font-extrabold font-mono">$49<span className="text-xs font-normal text-muted-foreground">/mo</span></div>
                <ul className="text-[11px] space-y-2 border-t border-border/60 pt-3 text-muted-foreground">
                  <li className="flex items-center gap-1.5 text-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-blue" />
                    Up to 5 Tenant Orgs
                  </li>
                  <li className="flex items-center gap-1.5 text-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-blue" />
                    50 GB Monthly Log Ingestion
                  </li>
                  <li className="flex items-center gap-1.5 text-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-blue" />
                    AI Incident Summarizer
                  </li>
                  <li className="flex items-center gap-1.5 text-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-blue" />
                    Standard LangChain Chat
                  </li>
                </ul>
              </div>
              <Link 
                href="/sign-up" 
                className="w-full py-2 bg-primary text-primary-foreground text-center font-medium rounded-lg text-xs hover:opacity-90 transition-opacity border border-primary/20 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
              >
                Start 14-Day Trial
              </Link>
            </div>

            {/* Enterprise Tier */}
            <div className="p-6 bg-card/40 rounded-xl border border-border space-y-5 flex flex-col justify-between hover:border-border/80 transition-colors">
              <div className="space-y-3">
                <Badge variant="outline" className="text-[9px] font-mono uppercase tracking-wider">Enterprise</Badge>
                <h3 className="text-lg font-bold">Enterprise</h3>
                <p className="text-[11px] text-muted-foreground">SLA-guaranteed ingestion, compliance mappings, and custom models.</p>
                <div className="text-2xl font-extrabold font-mono">Custom</div>
                <ul className="text-[11px] space-y-2 border-t border-border/60 pt-3 text-muted-foreground">
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-green" />
                    Unlimited Multi-Tenancy
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-green" />
                    Custom Ingest Quotas
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-green" />
                    ChromaDB Vector Index Syncing
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-green" />
                    24/7 Priority Support
                  </li>
                </ul>
              </div>
              <Button 
                variant="outline"
                className="w-full py-2 bg-secondary text-foreground font-medium rounded-lg text-xs border border-border hover:bg-secondary/80 transition-colors"
                onClick={() => alert("Redirecting to sales team...")}
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-20 bg-card/20 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-semibold tracking-wider text-foreground">AEGIS<span className="text-cyber-blue">SOC</span></span>
            <span>&copy; {new Date().getFullYear()} Aegis Systems Inc.</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-foreground transition-colors">Platform Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
