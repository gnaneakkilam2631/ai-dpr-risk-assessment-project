import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProjectProvider } from './context/ProjectContext';
import { AppShell } from './components/layout/AppShell';

import { DashboardPage } from './pages/DashboardPage';
import { UploadDprPage } from './pages/UploadDprPage';
import { DprAnalysisPage } from './pages/DprAnalysisPage';
import { ContradictionsPage } from './pages/ContradictionsPage';
import { RiskIntelligencePage } from './pages/RiskIntelligencePage';
import { WhatIfSimulatorPage } from './pages/WhatIfSimulatorPage';
import { MitigationAdvisorPage } from './pages/MitigationAdvisorPage';
import { DprCopilotPage } from './pages/DprCopilotPage';
import { EvidenceViewerPage } from './pages/EvidenceViewerPage';
import { ReportsPage } from './pages/ReportsPage';

export default function App() {
  return (
    <ProjectProvider>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/upload" element={<UploadDprPage />} />
            <Route path="/dpr-analysis" element={<DprAnalysisPage />} />
            <Route path="/contradictions" element={<ContradictionsPage />} />
            <Route path="/risk-intelligence" element={<RiskIntelligencePage />} />
            <Route path="/simulator" element={<WhatIfSimulatorPage />} />
            <Route path="/mitigation" element={<MitigationAdvisorPage />} />
            <Route path="/copilot" element={<DprCopilotPage />} />
            <Route path="/evidence" element={<EvidenceViewerPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </ProjectProvider>
  );
}
