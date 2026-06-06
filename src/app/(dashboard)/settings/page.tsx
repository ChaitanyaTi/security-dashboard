"use client";

import React, { useState } from "react";
import { 
  Settings, Key, Copy, Check, Radio, Shield, 
  RefreshCw, Server, CreditCard, HelpCircle 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("ag_live_41a8fd72be81a9f3dc8e4f16b23d9021");
  const [isCopied, setIsCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [orgName, setOrgName] = useState("Alpha Security Corp");

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const regenerateApiKey = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      const chars = "abcdef0123456789";
      let key = "ag_live_";
      for (let i = 0; i < 32; i++) {
        key += chars[Math.floor(Math.random() * chars.length)];
      }
      setApiKey(key);
      setIsRegenerating(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
          Platform Settings
        </h1>
        <p className="text-xs text-muted-foreground">
          Manage your tenant organization credentials, billing preferences, and log ingestion keys.
        </p>
      </div>

      <div className="grid gap-6">
        
        {/* Org Profile */}
        <Card className="border-border bg-card/60">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Shield className="w-4.5 h-4.5 text-cyber-blue" />
              Tenant Organization Profile
            </CardTitle>
            <CardDescription className="text-xs">Configure your B2B SaaS identifier synced with Clerk Org.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2 max-w-md">
              <Label htmlFor="org-name" className="text-xs text-muted-foreground">Organization Display Name</Label>
              <div className="flex gap-2">
                <Input 
                  id="org-name" 
                  value={orgName} 
                  onChange={(e) => setOrgName(e.target.value)}
                  className="bg-background/50 border-border text-foreground text-xs focus-visible:ring-cyber-blue/40"
                />
                <Button variant="outline" className="text-xs border-border h-9">Update</Button>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-foreground">Clerk Tenant ID:</span>
                <span className="font-mono bg-secondary/80 px-2 py-0.5 rounded border border-border">org_2l9Af73Kb...</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-foreground">Database Pool:</span>
                <span className="text-cyber-green flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-green" /> Neon-West-1
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Credentials */}
        <Card className="border-border bg-card/60 relative overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-56 h-56 bg-cyber-orange/5 rounded-full blur-[50px] pointer-events-none" />
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Key className="w-4.5 h-4.5 text-cyber-orange" />
                Security Ingestion API Key
              </CardTitle>
              <Badge variant="outline" className="font-mono text-[9px] border-cyber-orange/30 text-cyber-orange bg-cyber-orange/5">
                ACTIVE KEY
              </Badge>
            </div>
            <CardDescription className="text-xs">Authenticate your log daemon or CI/CD runner to send security events to the FastAPI proxy.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Key box */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Ingest Bearer Token</Label>
              <div className="flex gap-2 max-w-lg">
                <Input 
                  readOnly 
                  value={apiKey} 
                  className="font-mono text-xs bg-background/80 border-border text-cyber-orange select-all"
                />
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleCopy} 
                  className="border-border shrink-0 hover:text-foreground h-9 w-9"
                >
                  {isCopied ? <Check className="w-4 h-4 text-cyber-green" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={regenerateApiKey} 
                  disabled={isRegenerating}
                  className="border-border shrink-0 hover:text-cyber-red h-9 w-9"
                >
                  {isRegenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Ingest code helper */}
            <div className="space-y-2 pt-2">
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-cyber-blue" />
                Integration Tutorial (cURL Command):
              </p>
              <pre className="p-3 bg-black/60 border border-border rounded font-mono text-[10px] text-cyber-blue leading-relaxed overflow-x-auto whitespace-pre-wrap">
{`curl -X POST "https://aegis-soc.com/api/logs/ingest" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "node_id": "server-cluster-04",
    "service": "ssh-daemon",
    "event": "Authentication failure for root from 185.120.2.4",
    "severity": "critical"
  }'`}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Plan */}
        <Card className="border-border bg-card/60">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <CreditCard className="w-4.5 h-4.5 text-cyber-blue" />
              SaaS Subscription Plan
            </CardTitle>
            <CardDescription className="text-xs">View quotas and ingestion capacity constraints.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div>
                <p className="text-xs font-semibold text-foreground">AI Cyber Agent Tier</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Renews automatically on June 15, 2026.</p>
              </div>
              <Badge className="bg-cyber-blue/10 border border-cyber-blue/20 text-cyber-blue font-mono text-[10px] hover:bg-cyber-blue/10">
                $799/month
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs pt-1">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-mono">Monthly Ingest Volume</p>
                <p className="font-semibold mt-1">42.8 GB / 250 GB</p>
                <div className="w-full bg-secondary h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-cyber-blue h-full" style={{ width: "17%" }} />
                </div>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-mono">Connected Nodes Limit</p>
                <p className="font-semibold mt-1">148 / Unlimited</p>
                <div className="w-full bg-secondary h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-cyber-green h-full" style={{ width: "100%" }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
