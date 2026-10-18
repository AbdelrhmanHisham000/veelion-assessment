"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const getPageInfo = () => {
    switch (pathname) {
      case "/tasks":
        return { title: "Task Dashboard", subtitle: "Track, filter and manage everyday tasks" };
      case "/activity":
        return { title: "Activity Feed", subtitle: "Real-time audit log of system events" };

      default:
        return { title: "Overview", subtitle: "Welcome to VeeLion Task Management Suite" };
    }
  };

  const pageInfo = getPageInfo();

  return (
    <div className="app-shell">
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />

      <div className="app-main">
        {/* Top Header Bar */}
        <header className="app-topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="hamburger-btn"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </button>

            <div className="topbar-page-info">
              <h1 className="topbar-title">{pageInfo.title}</h1>
              <p className="topbar-subtitle">{pageInfo.subtitle}</p>
            </div>
          </div>

          <div className="topbar-right">
            <div className="badge-pill-live">
              <span className="live-pulse" />
              <span>API Live</span>
            </div>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="app-content">
          {children}
        </main>
      </div>
    </div>
  );
}
