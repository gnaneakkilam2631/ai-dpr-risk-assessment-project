import React from "react";
import {
  LayoutDashboard,
  FileSearch,
  Bot,
  AlertTriangle,
  FileText,
  ShieldAlert,
  Lightbulb,
  Upload,
  FlaskConical,
  BarChart3,
  UserCircle,
  Settings,
  LogOut,
  ShieldCheck,
  Sun,
  Moon,
} from "lucide-react";

import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function AppShell() {
  const navigate = useNavigate();

  const userString = localStorage.getItem("user");

  let user: {
    id?: number;
    name?: string;
    email?: string;
  } | null = null;

  try {
    user = userString ? JSON.parse(userString) : null;
  } catch {
    user = null;
  }

  const userName = user?.name || "User";
  const userEmail = user?.email || "Not available";

  const [darkMode, setDarkMode] = React.useState(() => {
    return (
      localStorage.getItem("theme") !== "light"
    );
  });

  React.useEffect(() => {
    const theme = darkMode ? "dark" : "light";

    document.documentElement.setAttribute(
      "data-theme",
      theme
    );

    localStorage.setItem("theme", theme);
  }, [darkMode]);

  function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_type");
    localStorage.removeItem("user");
    sessionStorage.removeItem("session_only");

    navigate("/", {
      replace: true,
    });
  }

  function navClass({
    isActive,
  }: {
    isActive: boolean;
  }) {
    return `guardian-nav-link ${
      isActive ? "guardian-nav-active" : ""
    }`;
  }

  return (
    <div className="guardian-app">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="guardian-header">

        <div className="guardian-brand">

          <div className="guardian-brand-symbol">
            AI
          </div>

          <div>
            <h1 className="guardian-brand-title">
              AI-DPR Guardian
            </h1>

            <p className="guardian-brand-subtitle">
              Quality &amp; Risk Intelligence
            </p>
          </div>

        </div>


        {/* HEADER ACTIONS */}

        <div className="guardian-header-actions">

          <div className="guardian-status">
            <span className="guardian-status-dot" />
            SYSTEM ONLINE
          </div>


          <button
            type="button"
            className="guardian-theme-button"
            onClick={() =>
              setDarkMode((previous) => !previous)
            }
            title={
              darkMode
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
          >
            {darkMode ? (
              <Sun size={18} />
            ) : (
              <Moon size={18} />
            )}
          </button>


          <button
            type="button"
            className="guardian-user"
            onClick={() => navigate("/profile")}
            title="Open profile"
          >

            <div className="guardian-user-avatar">
              <UserCircle size={20} />
            </div>

            <div className="guardian-user-info">

              <span className="guardian-user-name">
                {userName}
              </span>

              <span className="guardian-user-role">
                {userEmail}
              </span>

            </div>

          </button>


          <button
            type="button"
            className="guardian-logout"
            onClick={logout}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>

        </div>

      </header>


      {/* =====================================================
          MAIN LAYOUT
      ===================================================== */}

      <div className="guardian-layout">


        {/* ===================================================
            SIDEBAR
        =================================================== */}

        <aside className="guardian-sidebar">

          <div className="guardian-sidebar-top">

            <p className="guardian-workspace-label">
              WORKSPACE
            </p>


            <nav className="guardian-navigation">


              {/* DASHBOARD */}

              <NavLink
                to="/dashboard"
                className={navClass}
              >
                <LayoutDashboard
                  size={20}
                  strokeWidth={1.8}
                />

                <span>
                  Dashboard
                </span>
              </NavLink>


              {/* DPR ANALYSIS */}

              <NavLink
                to="/dpr-analysis"
                className={navClass}
              >
                <FileSearch
                  size={20}
                  strokeWidth={1.8}
                />

                <span>
                  DPR Analysis
                </span>
              </NavLink>


              {/* DPR COPILOT */}

              <NavLink
                to="/dpr-copilot"
                className={navClass}
              >
                <Bot
                  size={20}
                  strokeWidth={1.8}
                />

                <span>
                  DPR Copilot
                </span>
              </NavLink>


              {/* CONTRADICTIONS */}

              <NavLink
                to="/contradictions"
                className={navClass}
              >
                <AlertTriangle
                  size={20}
                  strokeWidth={1.8}
                />

                <span>
                  Contradictions
                </span>
              </NavLink>


              {/* EVIDENCE VIEWER */}

              <NavLink
                to="/evidence-viewer"
                className={navClass}
              >
                <FileText
                  size={20}
                  strokeWidth={1.8}
                />

                <span>
                  Evidence Viewer
                </span>
              </NavLink>


              {/* RISK INTELLIGENCE */}

              <NavLink
                to="/risk-intelligence"
                className={navClass}
              >
                <ShieldAlert
                  size={20}
                  strokeWidth={1.8}
                />

                <span>
                  Risk Intelligence
                </span>
              </NavLink>


              {/* MITIGATION ADVISOR */}

              <NavLink
                to="/mitigation-advisor"
                className={navClass}
              >
                <Lightbulb
                  size={20}
                  strokeWidth={1.8}
                />

                <span>
                  Mitigation Advisor
                </span>
              </NavLink>


              {/* UPLOAD DPR */}

              <NavLink
                to="/upload-dpr"
                className={navClass}
              >
                <Upload
                  size={20}
                  strokeWidth={1.8}
                />

                <span>
                  Upload DPR
                </span>
              </NavLink>


              {/* WHAT-IF SIMULATOR */}

              <NavLink
                to="/what-if-simulator"
                className={navClass}
              >
                <FlaskConical
                  size={20}
                  strokeWidth={1.8}
                />

                <span>
                  What-If Simulator
                </span>
              </NavLink>


              {/* =================================================
                  MANAGEMENT
              ================================================= */}

              <div className="guardian-section-label">
                MANAGEMENT
              </div>


              {/* REPORTS */}

              <NavLink
                to="/reports"
                className={navClass}
              >
                <BarChart3
                  size={20}
                  strokeWidth={1.8}
                />

                <span>
                  Reports
                </span>
              </NavLink>


              {/* PROFILE */}

              <NavLink
                to="/profile"
                className={navClass}
              >
                <UserCircle
                  size={20}
                  strokeWidth={1.8}
                />

                <span>
                  Profile
                </span>
              </NavLink>


              {/* SETTINGS */}

              <NavLink
                to="/settings"
                className={navClass}
              >
                <Settings
                  size={20}
                  strokeWidth={1.8}
                />

                <span>
                  Settings
                </span>
              </NavLink>

            </nav>

          </div>


          {/* ===================================================
              SIDEBAR FOOTER
          =================================================== */}

          <div className="guardian-sidebar-footer">

            <div className="guardian-security-card">

              <div className="guardian-security-icon">
                <ShieldCheck size={18} />
              </div>

              <div>

                <div className="guardian-security-title">
                  SECURE WORKSPACE
                </div>

                <div className="guardian-security-text">
                  Your DPR intelligence is protected.
                </div>

              </div>

            </div>

          </div>

        </aside>


        {/* ===================================================
            MAIN CONTENT

            Outlet renders Dashboard/Profile/Settings/etc.
        =================================================== */}

        <main className="guardian-main">

          <div className="guardian-main-inner">

            <Outlet />

          </div>

        </main>

      </div>

    </div>
  );
}