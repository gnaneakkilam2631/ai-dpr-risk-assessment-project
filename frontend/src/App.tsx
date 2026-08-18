import React from "react";

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";

import { GoogleOAuthProvider } from "@react-oauth/google";

import { ThemeProvider } from "./context/ThemeContext";
import { ProjectProvider } from "./context/ProjectContext";

import AppShell from "./components/layout/AppShell";

// Authentication
import LoginPage from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

// Main
import { DashboardPage } from "./pages/DashboardPage";
import { ReportsPage } from "./pages/ReportsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { ProfilePage } from "./pages/ProfilePage";

// DPR
import { ContradictionsPage } from "./pages/ContradictionsPage";
import { DprAnalysisPage } from "./pages/DprAnalysisPage";
import { DprCopilotPage } from "./pages/DprCopilotPage";
import { EvidenceViewerPage } from "./pages/EvidenceViewerPage";
import { MitigationAdvisorPage } from "./pages/MitigationAdvisorPage";
import { RiskIntelligencePage } from "./pages/RiskIntelligencePage";
import { UploadDprPage } from "./pages/UploadDprPage";
import { WhatIfSimulatorPage } from "./pages/WhatIfSimulatorPage";


/* ============================================================
   AUTH
============================================================ */

function isAuthenticated(): boolean {
  const token =
    localStorage.getItem("access_token");

  return Boolean(
    token &&
    token.trim() !== ""
  );
}


/* ============================================================
   PROTECTED ROUTE
============================================================ */

function ProtectedRoute() {

  if (!isAuthenticated()) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return <Outlet />;
}


/* ============================================================
   GOOGLE
============================================================ */

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID || "";


/* ============================================================
   APP
============================================================ */

function App() {

  return (
    <GoogleOAuthProvider
      clientId={GOOGLE_CLIENT_ID}
    >

      <BrowserRouter>

        <ThemeProvider>

          <ProjectProvider>

            <Routes>

              {/* ==================================================
                  PUBLIC
              ================================================== */}

              <Route
                path="/login"
                element={<LoginPage />}
              />

              <Route
                path="/register"
                element={<RegisterPage />}
              />

              <Route
                path="/forgot-password"
                element={<ForgotPasswordPage />}
              />

              <Route
                path="/reset-password"
                element={<ResetPasswordPage />}
              />


              {/* ==================================================
                  PROTECTED
              ================================================== */}

              <Route
                element={<ProtectedRoute />}
              >

                <Route
                  element={<AppShell />}
                >

                  {/* Dashboard */}

                  <Route
                    path="/dashboard"
                    element={<DashboardPage />}
                  />


                  {/* DPR Analysis */}

                  <Route
                    path="/dpr-analysis"
                    element={<DprAnalysisPage />}
                  />


                  {/* Copilot */}

                  <Route
                    path="/dpr-copilot"
                    element={<DprCopilotPage />}
                  />


                  {/* Contradictions */}

                  <Route
                    path="/contradictions"
                    element={<ContradictionsPage />}
                  />


                  {/* Evidence */}

                  <Route
                    path="/evidence-viewer"
                    element={<EvidenceViewerPage />}
                  />


                  {/* Risk */}

                  <Route
                    path="/risk-intelligence"
                    element={<RiskIntelligencePage />}
                  />


                  {/* Mitigation */}

                  <Route
                    path="/mitigation-advisor"
                    element={<MitigationAdvisorPage />}
                  />


                  {/* Upload */}

                  <Route
                    path="/upload-dpr"
                    element={<UploadDprPage />}
                  />


                  {/* What If */}

                  <Route
                    path="/what-if-simulator"
                    element={<WhatIfSimulatorPage />}
                  />


                  {/* Reports */}

                  <Route
                    path="/reports"
                    element={<ReportsPage />}
                  />


                  {/* Profile */}

                  <Route
                    path="/profile"
                    element={<ProfilePage />}
                  />


                  {/* Settings */}

                  <Route
                    path="/settings"
                    element={<SettingsPage />}
                  />

                </Route>

              </Route>


              {/* ==================================================
                  ROOT
              ================================================== */}

              <Route
                path="/"
                element={
                  <Navigate
                    to={
                      isAuthenticated()
                        ? "/dashboard"
                        : "/login"
                    }
                    replace
                  />
                }
              />


              {/* ==================================================
                  UNKNOWN
              ================================================== */}

              <Route
                path="*"
                element={
                  <Navigate
                    to={
                      isAuthenticated()
                        ? "/dashboard"
                        : "/login"
                    }
                    replace
                  />
                }
              />

            </Routes>

          </ProjectProvider>

        </ThemeProvider>

      </BrowserRouter>

    </GoogleOAuthProvider>
  );
}

export default App;