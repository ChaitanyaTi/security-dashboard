"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Shield, LayoutDashboard, ShieldAlert, AlertOctagon, 
  CheckSquare, FileText, Bot, Settings, Menu, X, 
  Bell, Volume2, VolumeX, ChevronDown, Radio, User,
  LogOut, Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserButton, OrganizationSwitcher } from "@clerk/nextjs";

interface NavItem {
  name: string;
  href: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ComponentType<any>;
  badge?: string;
  badgeVariant?: "destructive" | "default" | "secondary" | "outline";
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [utcTime, setUtcTime] = useState("");


  // Update live UTC clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().replace("GMT", "UTC"));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems: NavItem[] = [
    { name: "SOC Overview", href: "/overview", icon: LayoutDashboard },
    { name: "Threat Feed", href: "/threats", icon: ShieldAlert, badge: "3 Active", badgeVariant: "destructive" },
    { name: "Incidents Hub", href: "/incidents", icon: AlertOctagon, badge: "2", badgeVariant: "secondary" },
    { name: "Compliance Checker", href: "/compliance", icon: CheckSquare },
    { name: "Reports Center", href: "/reports", icon: FileText },
    { name: "Security AI Chat", href: "/chat", icon: Bot },
    { name: "Settings & API Keys", href: "/settings", icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-card/60 backdrop-blur-md border-r border-border relative z-20">
      {/* Sidebar Header / Logo */}
      <div className="flex items-center gap-2 px-6 h-16 border-b border-border">
        <div className="p-1.5 rounded bg-cyber-blue/10 border border-cyber-blue/30 text-cyber-blue shadow-[0_0_10px_rgba(6,182,212,0.1)]">
          <Shield className="w-5 h-5" />
        </div>
        <span className="font-semibold tracking-wider text-sm">
          AEGIS<span className="text-cyber-blue">SOC</span>
        </span>
        <Badge variant="outline" className="ml-auto text-[10px] py-0 px-1.5 border-cyber-blue/30 text-cyber-blue font-mono bg-cyber-blue/5">
          SaaS
        </Badge>
      </div>

      {/* Organization Switcher (Clerk B2B) */}
      <div className="p-4 border-b border-border">
        <OrganizationSwitcher 
          afterCreateOrganizationUrl="/overview"
          afterSelectOrganizationUrl="/overview"
          afterLeaveOrganizationUrl="/onboarding"
          appearance={{
            variables: {
              colorPrimary: "oklch(0.7 0.19 200)",
              colorBackground: "oklch(0.13 0.018 240)",
              colorText: "oklch(0.93 0.01 240)",
              colorTextSecondary: "oklch(0.65 0.02 240)",
              colorInputBackground: "oklch(0.11 0.015 240)",
              colorInputBorder: "oklch(0.18 0.02 240 / 70%)",
            },
            elements: {
              rootBox: "w-full",
              organizationSwitcherTrigger: "w-full justify-between bg-background/50 hover:bg-secondary/40 border border-border text-foreground text-xs px-3 h-10 rounded-lg flex flex-row items-center",
              organizationSwitcherTriggerIcon: "text-muted-foreground",
              organizationPreviewTextContainer: "text-left",
              organizationPreviewTitle: "text-xs font-semibold text-foreground",
              organizationPreviewSubtitle: "text-[9px] text-muted-foreground",
            }
          }}
        />
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm transition-all duration-200 group relative ${
                isActive 
                  ? "bg-cyber-blue/10 border border-cyber-blue/20 text-cyber-blue shadow-[0_0_15px_rgba(6,182,212,0.05)]" 
                  : "text-muted-foreground border border-transparent hover:bg-secondary/40 hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-105 ${
                  isActive ? "text-cyber-blue" : "text-muted-foreground group-hover:text-foreground"
                }`} />
                <span className="font-medium">{item.name}</span>
              </div>
              {item.badge && (
                <Badge 
                  variant={item.badgeVariant || "default"}
                  className={`text-[10px] px-1.5 py-0 h-5 font-mono ${
                    item.badgeVariant === "destructive" 
                      ? "bg-cyber-red/20 text-cyber-red border border-cyber-red/30" 
                      : "bg-secondary border border-border"
                  }`}
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Session Footer (Clerk UserButton) */}
      <div className="p-4 border-t border-border bg-background/30 flex items-center justify-between">
        <UserButton 
          showName={true}
          appearance={{
            variables: {
              colorPrimary: "oklch(0.7 0.19 200)",
              colorBackground: "oklch(0.13 0.018 240)",
              colorText: "oklch(0.93 0.01 240)",
              colorTextSecondary: "oklch(0.65 0.02 240)",
            },
            elements: {
              rootBox: "w-full flex items-center justify-between",
              userButtonTrigger: "w-full justify-between hover:bg-secondary/40 p-1.5 rounded-lg flex flex-row items-center border border-border/40 bg-background/30",
              userButtonBox: "flex flex-row items-center",
              userButtonOuterIdentifier: "text-xs font-semibold text-foreground",
            }
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-background text-foreground flex overflow-hidden">
      {/* Background SOC scanline layer */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-background/50 pointer-events-none" />

      {/* Desktop Sidebar (Left) */}
      <aside className={`hidden md:block shrink-0 transition-all duration-300 h-screen sticky top-0 ${
        isSidebarOpen ? "w-64" : "w-0 overflow-hidden border-r-0"
      }`}>
        {sidebarContent}
      </aside>

      {/* Main App Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Diagnostic Top Header */}
        <header className="h-16 shrink-0 border-b border-border bg-card/20 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            {/* Sidebar toggle button (desktop) */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden md:flex text-muted-foreground hover:text-foreground h-8 w-8 hover:bg-secondary/40"
            >
              <Menu className="w-4 h-4" />
            </Button>

            {/* Sidebar toggle button (mobile) */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMobileOpen(true)}
              className="flex md:hidden text-muted-foreground hover:text-foreground h-8 w-8 hover:bg-secondary/40"
            >
              <Menu className="w-4 h-4" />
            </Button>

            {/* Ingestion Engine Status */}
            <div className="flex items-center gap-2 bg-background/50 border border-border px-3 py-1.5 rounded-lg">
              <Radio className="w-3.5 h-3.5 text-cyber-green animate-pulse" />
              <span className="text-[10px] font-semibold font-mono tracking-wider text-cyber-green uppercase">
                INGESTION: ACTIVE
              </span>
            </div>

            {/* UTC Time */}
            <div className="hidden lg:block text-xs font-mono text-muted-foreground bg-background/30 border border-border/50 px-3 py-1.5 rounded-lg">
              {utcTime || "UTC CLOCK INIT"}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Global SOC Threat Level Indicator */}
            <div className="hidden sm:flex items-center gap-2 border border-cyber-red/20 bg-cyber-red/5 px-3 py-1.5 rounded-lg text-xs font-mono text-cyber-red">
              <span className="w-2 h-2 rounded-full bg-cyber-red animate-ping" />
              <span>DEFCON 3 / LEVEL: HIGH</span>
            </div>

            {/* Alarm Sound Toggle */}
            <Button
              variant="outline"
              size="icon"
              className={`h-9 w-9 border-border ${isMuted ? "text-muted-foreground" : "text-cyber-orange border-cyber-orange/30 bg-cyber-orange/5 animate-pulse"}`}
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>

            {/* Notification Bell */}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="outline" size="icon" className="h-9 w-9 border-border relative text-muted-foreground hover:text-foreground">
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyber-red" />
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-80 bg-card border-border text-foreground p-2">
                <DropdownMenuLabel className="text-xs text-muted-foreground">SOC Critical Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border" />
                <div className="space-y-2 py-2 max-h-60 overflow-y-auto">
                  <div className="p-2 bg-cyber-red/5 border border-cyber-red/20 rounded text-xs">
                    <p className="font-semibold text-cyber-red">Intrusion Alert (Severity 9.8)</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Unusual SSH attempts on server-cluster-04.</p>
                  </div>
                  <div className="p-2 bg-cyber-orange/5 border border-cyber-orange/20 rounded text-xs">
                    <p className="font-semibold text-cyber-orange">DDoS Mitigation Activated</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Rate limiter blocking IP 185.220.101.4.</p>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-1 p-6 relative">
          {children}
        </main>
      </div>

      {/* Mobile Drawer (Left overlay) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
          {/* Content */}
          <div className="relative w-64 h-full">
            {sidebarContent}
            {/* Close button */}
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-4 right-[-50px] border-border bg-card/60 backdrop-blur-md h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
