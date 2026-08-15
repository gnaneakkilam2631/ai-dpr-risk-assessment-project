import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Project,
  DPRHealthScore,
  RiskAssessment,
  Contradiction,
  CriticalFinding,
  MitigationRecommendation,
  DocumentSection,
  CopilotMessage,
} from '../types';
import {
  dprService,
  INITIAL_PROJECTS,
  MOCK_HEALTH_SCORE_PROJ_1,
  MOCK_CONTRADICTIONS,
  MOCK_CRITICAL_FINDINGS,
  MOCK_DPR_PAGES,
} from '../services/dprService';
import { MOCK_RISK_ITEMS, MOCK_MITIGATIONS } from '../services/riskService';
import { INITIAL_COPILOT_MESSAGES } from '../services/copilotService';

export interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'alert' | 'update' | 'check';
  read: boolean;
  link?: string;
}

interface ProjectContextType {
  projects: Project[];
  activeProject: Project;
  setActiveProjectById: (id: string) => void;
  healthScore: DPRHealthScore;
  contradictions: Contradiction[];
  markContradictionReviewed: (id: string, reviewed: boolean, notes?: string) => void;
  riskAssessment: RiskAssessment;
  mitigations: MitigationRecommendation[];
  updateMitigationStatus: (id: string, status: MitigationRecommendation['status']) => void;
  criticalFindings: CriticalFinding[];
  documentSections: DocumentSection[];
  activeEvidenceTarget: { page: number; section: string; title?: string } | null;
  setActiveEvidenceTarget: (target: { page: number; section: string; title?: string } | null) => void;
  copilotMessages: CopilotMessage[];
  addCopilotMessage: (msg: CopilotMessage) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  toasts: ToastNotification[];
  addToast: (type: ToastNotification['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNewUploadedProject: (project: Project) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [activeProject, setActiveProject] = useState<Project>(INITIAL_PROJECTS[0]);
  const [healthScore, setHealthScore] = useState<DPRHealthScore>(MOCK_HEALTH_SCORE_PROJ_1);
  const [contradictions, setContradictions] = useState<Contradiction[]>(MOCK_CONTRADICTIONS);
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment>({
    overallRisk: 'high',
    dimensions: {
      costRisk: 73,
      scheduleRisk: 81,
      technicalRisk: 42,
      financialRisk: 67,
      environmentalRisk: 59,
      complianceRisk: 28,
    },
    risks: MOCK_RISK_ITEMS,
  });
  const [mitigations, setMitigations] = useState<MitigationRecommendation[]>(MOCK_MITIGATIONS);
  const [criticalFindings, setCriticalFindings] = useState<CriticalFinding[]>(MOCK_CRITICAL_FINDINGS);
  const [documentSections, setDocumentSections] = useState<DocumentSection[]>(MOCK_DPR_PAGES);
  const [activeEvidenceTarget, setActiveEvidenceTarget] = useState<{ page: number; section: string; title?: string } | null>({
    page: 94,
    section: 'Section 7.2',
    title: 'Budget Contradiction (₹14.6 Cr)',
  });
  const [copilotMessages, setCopilotMessages] = useState<CopilotMessage[]>(INITIAL_COPILOT_MESSAGES);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Critical Cost Contradiction Detected',
      message: '₹14.60 Cr variance found between Executive Summary & BoQ Table 7.4.',
      time: '10m ago',
      type: 'alert',
      read: false,
      link: '/contradictions',
    },
    {
      id: 'notif-2',
      title: 'Schedule Feasibility Warning',
      message: 'DBM road surfacing overlaps with peak 2,800mm monsoon window in Arunachal Pradesh.',
      time: '45m ago',
      type: 'alert',
      read: false,
      link: '/risk-intelligence',
    },
    {
      id: 'notif-3',
      title: 'DPR Quality Analysis Completed',
      message: 'AI evaluation finished with Health Score 82/100.',
      time: '2h ago',
      type: 'check',
      read: true,
      link: '/dpr-analysis',
    },
  ]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setActiveProjectById = (id: string) => {
    const p = projects.find((item) => item.id === id);
    if (p) {
      setActiveProject(p);
      addToast('info', 'Project Switched', `Active DPR set to: ${p.name}`);
    }
  };

  const markContradictionReviewed = (id: string, reviewed: boolean, notes?: string) => {
    setContradictions((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            reviewed,
            reviewedAt: reviewed ? new Date().toLocaleString() : undefined,
            reviewerNotes: notes || (reviewed ? 'Reviewed by DPR Evaluator' : undefined),
          };
        }
        return c;
      })
    );
    addToast(
      reviewed ? 'success' : 'info',
      reviewed ? 'Contradiction Marked as Reviewed' : 'Review Status Reverted',
      `Audit record updated.`
    );
  };

  const updateMitigationStatus = (id: string, status: MitigationRecommendation['status']) => {
    setMitigations((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          return { ...m, status };
        }
        return m;
      })
    );
    addToast('success', 'Mitigation Action Updated', `Status changed to: ${status}`);
  };

  const addCopilotMessage = (msg: CopilotMessage) => {
    setCopilotMessages((prev) => [...prev, msg]);
  };

  const addToast = (type: ToastNotification['type'], title: string, message: string) => {
    const id = 'toast-' + Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, title, message, timestamp: 'Now' }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast('info', 'Notifications Cleared', 'All notifications marked as read');
  };

  const addNewUploadedProject = (newProj: Project) => {
    setProjects((prev) => [newProj, ...prev]);
    setActiveProject(newProj);
    addToast('success', 'DPR Ingested & Analyzed', `Successfully indexed: ${newProj.name}`);
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        activeProject,
        setActiveProjectById,
        healthScore,
        contradictions,
        markContradictionReviewed,
        riskAssessment,
        mitigations,
        updateMitigationStatus,
        criticalFindings,
        documentSections,
        activeEvidenceTarget,
        setActiveEvidenceTarget,
        copilotMessages,
        addCopilotMessage,
        theme,
        toggleTheme,
        toasts,
        addToast,
        removeToast,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        addNewUploadedProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
