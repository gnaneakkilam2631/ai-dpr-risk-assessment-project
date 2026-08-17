import React from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
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

// Main pages
import { DashboardPage } from "./pages/DashboardPage";
import { ReportsPage } from "./pages/ReportsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { ProfilePage } from "./pages/ProfilePage";

// DPR pages
import { ContradictionsPage } from "./pages/ContradictionsPage";
import { DprAnalysisPage } from "./pages/DprAnalysisPage";
import { DprCopilotPage } from "./pages/DprCopilotPage";
import { EvidenceViewerPage } from "./pages/EvidenceViewerPage";
import { MitigationAdvisorPage } from "./pages/MitigationAdvisorPage";
import { RiskIntelligencePage } from "./pages/RiskIntelligencePage";
import { UploadDprPage } from "./pages/UploadDprPage";
import { WhatIfSimulatorPage } from "./pages/WhatIfSimulatorPage";


/* =========================================================
   AUTHENTICATION CHECK
========================================================= */

function isAuthenticated(): boolean {
  return Boolean(
    localStorage.getItem("access_token")
  );
}


/* =========================================================
   PROTECTED ROUTE
========================================================= */

function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isAuthenticated()) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return <>{children}</>;
}


/* =========================================================
   GOOGLE CLIENT ID
========================================================= */

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID || "";


/* =========================================================
   APP
========================================================= */

function App() {
  return (
    <GoogleOAuthProvider
      clientId={GOOGLE_CLIENT_ID}
    >
      <BrowserRouter>

        <ThemeProvider>

          <ProjectProvider>

            <Routes>

              {/* =================================================
                  PUBLIC AUTHENTICATION ROUTES
              ================================================= */}

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


              {/* =================================================
                  PROTECTED APPLICATION ROUTES
              ================================================= */}

              <Route
                element={
                  <ProtectedRoute>
                    <AppShell />
                  </ProtectedRoute>
                }
              >

                {/* Dashboard */}

                <Route
                  path="/dashboard"
                  element={<DashboardPage />}
                />


                {/* DPR */}

                <Route
                  path="/dpr-analysis"
                  element={<DprAnalysisPage />}
                />

                <Route
                  path="/dpr-copilot"
                  element={<DprCopilotPage />}
                />

                <Route
                  path="/contradictions"
                  element={<ContradictionsPage />}
                />

                <Route
                  path="/evidence"
                  element={<EvidenceViewerPage />}
                />

                <Route
                  path="/risk-intelligence"
                  element={<RiskIntelligencePage />}
                />

                <Route
                  path="/mitigation-advisor"
                  element={<MitigationAdvisorPage />}
                />

                <Route
                  path="/upload-dpr"
                  element={<UploadDprPage />}
                />

                <Route
                  path="/what-if"
                  element={<WhatIfSimulatorPage />}
                />


                {/* Other */}

                <Route
                  path="/reports"
                  element={<ReportsPage />}
                />

                <Route
                  path="/profile"
                  element={<ProfilePage />}
                />

                <Route
                  path="/settings"
                  element={<SettingsPage />}
                />

              </Route>


              {/* =================================================
                  ROOT
              ================================================= */}

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


              {/* =================================================
                  FALLBACK
              ================================================= */}

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