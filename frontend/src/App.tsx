import React from "react";

import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";

import {
  GoogleOAuthProvider,
} from "@react-oauth/google";

import {
  ThemeProvider,
} from "./context/ThemeContext";

import {
  ProjectProvider,
} from "./context/ProjectContext";

import AppShell from "./components/layout/AppShell";

import LoginPage from "./pages/LoginPage";

import {
  RegisterPage,
} from "./pages/RegisterPage";

import ForgotPasswordPage from "./pages/ForgotPasswordPage";

import ResetPasswordPage from "./pages/ResetPasswordPage";

import {
  DashboardPage,
} from "./pages/DashboardPage";

import {
  ReportsPage,
} from "./pages/ReportsPage";

import {
  SettingsPage,
} from "./pages/SettingsPage";

import {
  ProfilePage,
} from "./pages/ProfilePage";

import {
  DprAnalysisPage,
} from "./pages/DprAnalysisPage";

import {
  ContradictionsPage,
} from "./pages/ContradictionsPage";

import {
  DprCopilotPage,
} from "./pages/DprCopilotPage";

import {
  EvidenceViewerPage,
} from "./pages/EvidenceViewerPage";

import {
  RiskIntelligencePage,
} from "./pages/RiskIntelligencePage";

import {
  MitigationAdvisorPage,
} from "./pages/MitigationAdvisorPage";

import {
  UploadDprPage,
} from "./pages/UploadDprPage";

import {
  WhatIfSimulatorPage,
} from "./pages/WhatIfSimulatorPage";


function isAuthenticated(): boolean {

  const token =
    localStorage.getItem(
      "access_token"
    );


  return Boolean(
    token &&
    token.trim()
  );
}


function ProtectedRoute():
  React.ReactElement {

  if (
    !isAuthenticated()
  ) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  return (
    <Outlet />
  );
}


function PublicOnlyRoute({
  children,
}: {
  children:
    React.ReactElement;
}) {

  if (
    isAuthenticated()
  ) {

    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }


  return children;
}


const GOOGLE_CLIENT_ID =
  import.meta.env
    .VITE_GOOGLE_CLIENT_ID ||
  "";


function App():
  React.ReactElement {

  return (
    <GoogleOAuthProvider
      clientId={
        GOOGLE_CLIENT_ID
      }
    >

      <BrowserRouter>

        <ThemeProvider>

          <ProjectProvider>

            <Routes>

              {/* PUBLIC */}

              <Route
                path="/login"
                element={
                  <PublicOnlyRoute>
                    <LoginPage />
                  </PublicOnlyRoute>
                }
              />

              <Route
                path="/register"
                element={
                  <PublicOnlyRoute>
                    <RegisterPage />
                  </PublicOnlyRoute>
                }
              />

              <Route
                path="/forgot-password"
                element={
                  <PublicOnlyRoute>
                    <ForgotPasswordPage />
                  </PublicOnlyRoute>
                }
              />

              <Route
                path="/reset-password"
                element={
                  <ResetPasswordPage />
                }
              />


              {/* PROTECTED */}

              <Route
                element={
                  <ProtectedRoute />
                }
              >

                <Route
                  element={
                    <AppShell />
                  }
                >

                  <Route
                    path="/dashboard"
                    element={
                      <DashboardPage />
                    }
                  />

                  <Route
                    path="/dpr-analysis"
                    element={
                      <DprAnalysisPage />
                    }
                  />

                  <Route
                    path="/dpr-copilot"
                    element={
                      <DprCopilotPage />
                    }
                  />

                  <Route
                    path="/contradictions"
                    element={
                      <ContradictionsPage />
                    }
                  />

                  <Route
                    path="/evidence-viewer"
                    element={
                      <EvidenceViewerPage />
                    }
                  />

                  <Route
                    path="/evidence"
                    element={
                      <EvidenceViewerPage />
                    }
                  />

                  <Route
                    path="/risk-intelligence"
                    element={
                      <RiskIntelligencePage />
                    }
                  />

                  <Route
                    path="/mitigation-advisor"
                    element={
                      <MitigationAdvisorPage />
                    }
                  />

                  <Route
                    path="/upload-dpr"
                    element={
                      <UploadDprPage />
                    }
                  />

                  <Route
                    path="/what-if-simulator"
                    element={
                      <WhatIfSimulatorPage />
                    }
                  />

                  <Route
                    path="/what-if"
                    element={
                      <WhatIfSimulatorPage />
                    }
                  />

                  <Route
                    path="/reports"
                    element={
                      <ReportsPage />
                    }
                  />

                  <Route
                    path="/profile"
                    element={
                      <ProfilePage />
                    }
                  />

                  <Route
                    path="/settings"
                    element={
                      <SettingsPage />
                    }
                  />

                </Route>

              </Route>


              {/* ROOT */}

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


              {/* UNKNOWN */}

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