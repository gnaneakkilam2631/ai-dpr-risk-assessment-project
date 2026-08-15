import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FileText,
  AlertTriangle,
  HeartPulse,
  Flame,
  Plus,
  ArrowRight,
  Filter,
  Search,
  Building,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  MapPin,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useProject } from '../context/ProjectContext';
import { StatsCard } from '../components/common/StatsCard';
import { RiskBadge } from '../components/common/RiskBadge';

const RISK_BAR_DATA = [
  { name: 'Roads & Highways', Low: 24, Medium: 18, High: 9, Critical: 4 },
  { name: 'Water & Sanitation', Low: 32, Medium: 12, High: 4, Critical: 1 },
  { name: 'Healthcare', Low: 14, Medium: 8, High: 5, Critical: 2 },
  { name: 'Bridges & Tunnels', Low: 6, Medium: 7, High: 8, Critical: 5 },
  { name: 'Power & Energy', Low: 18, Medium: 6, High: 2, Critical: 0 },
];

const RISK_DONUT_DATA = [
  { name: 'Cost Risk', value: 34, color: '#ef4444' },
  { name: 'Schedule Risk', value: 28, color: '#f97316' },
  { name: 'Technical Risk', value: 16, color: '#f59e0b' },
  { name: 'Financial Risk', value: 22, color: '#3b82f6' },
  { name: 'Environmental Risk', value: 14, color: '#10b981' },
  { name: 'Compliance Risk', value: 10, color: '#8b5cf6' },
];

export const DashboardPage: React.FC = () => {
  const { projects, setActiveProjectById, criticalFindings, setActiveEvidenceTarget } = useProject();
  const navigate = useNavigate();
  const [filterSector, setFilterSector] = useState<string>('ALL');
  const [searchTable, setSearchTable] = useState<string>('');

  const filteredProjects = projects.filter((p) => {
    const matchesSector = filterSector === 'ALL' || p.sector === filterSector;
    const matchesSearch =
      p.name.toLowerCase().includes(searchTable.toLowerCase()) ||
      p.state.toLowerCase().includes(searchTable.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTable.toLowerCase());
    return matchesSector && matchesSearch;
  });

  const handleOpenProject = (id: string) => {
    setActiveProjectById(id);
    navigate('/dpr-analysis');
  };

  const handleViewEvidence = (finding: (typeof criticalFindings)[0]) => {
    setActiveEvidenceTarget({
      page: finding.pageNumber,
      section: finding.section,
      title: finding.title,
    });
    navigate('/evidence');
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
            Project Intelligence Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Monitor DPR quality, project risks, and critical findings across capital infrastructure portfolios.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/upload')}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            + Analyze New DPR
          </button>
        </div>
      </div>

      {/* 4 SUMMARY KPI CARDS (BENTO STRIP) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs dark:bg-[#0c1427] dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">DPRs Analyzed</span>
            <div className="p-1.5 bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 rounded-lg">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-sans">128</span>
            <span className="text-[10px] text-green-600 dark:text-emerald-400 font-medium">+12% ↑</span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Active DPR lifecycle review</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs dark:bg-[#0c1427] dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">High Risk Projects</span>
            <div className="p-1.5 bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400 rounded-lg">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-sans">17</span>
            <span className="text-[10px] text-red-600 dark:text-rose-400 font-medium">+3 critical</span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Requires immediate mitigation</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs dark:bg-[#0c1427] dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Avg. Health Score</span>
            <div className="p-1.5 bg-green-50 text-green-600 dark:bg-emerald-950/60 dark:text-emerald-400 rounded-lg">
              <HeartPulse className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-sans">81<span className="text-sm text-slate-400 font-normal">/100</span></span>
            <span className="text-[10px] text-green-600 dark:text-emerald-400 font-medium">Optimal</span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Consistent documentation quality</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs dark:bg-[#0c1427] dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Critical Findings</span>
            <div className="p-1.5 bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 rounded-lg">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-sans">23</span>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">Pending action</span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">AI-detected contradictions</p>
        </div>
      </div>

      {/* MAIN BENTO GRID (2 COLUMNS: TABLE + SIDEBAR TILES) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT 2-COLUMN BENTO: RECENT DPR ANALYSIS TABLE */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-xs dark:border-slate-800 dark:bg-[#0c1427] flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5 gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Recent DPR Analysis</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Intelligence feed of latest project reviews</p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter projects..."
                  value={searchTable}
                  onChange={(e) => setSearchTable(e.target.value)}
                  className="h-8 w-36 sm:w-44 rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                />
              </div>

              <select
                value={filterSector}
                onChange={(e) => setFilterSector(e.target.value)}
                className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs text-slate-700 font-medium focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 cursor-pointer"
              >
                <option value="ALL">All Sectors</option>
                <option value="Roads & Highways">Roads</option>
                <option value="Water Supply & Sanitation">Water</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Bridges & Tunnels">Bridges</option>
              </select>

              <button
                onClick={() => {
                  const csv = filteredProjects.map(p => `"${p.name}","${p.state}",${p.totalCostCr},${p.healthScore},"${p.overallRisk}"`).join('\n');
                  const blob = new Blob([`Project,State,CostCr,HealthScore,OverallRisk\n${csv}`], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'DPR_Portfolio_Appraisals.csv';
                  a.click();
                }}
                className="text-blue-600 dark:text-blue-400 text-[11px] font-bold hover:underline px-1 shrink-0 cursor-pointer"
              >
                Export CSV
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-900/80 sticky top-0">
                <tr className="text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 text-[11px]">
                  <th className="py-2.5 px-3 font-semibold">Project Name</th>
                  <th className="py-2.5 px-2 font-semibold text-center">Health</th>
                  <th className="py-2.5 px-2 font-semibold">Risk Level</th>
                  <th className="py-2.5 px-2 font-semibold">Cost (Est.)</th>
                  <th className="py-2.5 px-2 font-semibold">Status</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredProjects.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => handleOpenProject(p.id)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {p.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {p.state} • {p.sector}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                        p.healthScore >= 80
                          ? 'bg-green-100 text-green-700 dark:bg-green-950/80 dark:text-green-300'
                          : p.healthScore >= 70
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300'
                          : 'bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-300'
                      }`}>
                        {p.healthScore}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="flex items-center gap-1.5 text-[11px] font-medium">
                        <span className={`w-2 h-2 rounded-full ${
                          p.overallRisk === 'low'
                            ? 'bg-green-500'
                            : p.overallRisk === 'medium'
                            ? 'bg-amber-500'
                            : p.overallRisk === 'high'
                            ? 'bg-orange-500'
                            : 'bg-red-500'
                        }`} />
                        <span className="capitalize text-slate-700 dark:text-slate-300">{p.overallRisk}</span>
                      </span>
                    </td>
                    <td className="py-3 px-2 font-medium font-mono text-slate-800 dark:text-slate-200">
                      ₹{p.totalCostCr} Cr
                    </td>
                    <td className="py-3 px-2">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        p.status === 'Approved with Conditions'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : p.status === 'Flagged Issues'
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="inline-flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:underline">
                        Review <ChevronRight className="h-3 w-3 ml-0.5" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT 1-COLUMN BENTO STACK */}
        <div className="space-y-6 flex flex-col">
          {/* BENTO CARD 1: RISK DISTRIBUTION GAUGE */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs dark:border-slate-800 dark:bg-[#0c1427] flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Risk Distribution</h2>
              <span className="text-[10px] font-semibold text-slate-400">124 Factors</span>
            </div>

            <div className="flex items-center justify-center h-36 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={RISK_DONUT_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {RISK_DONUT_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => [`${val}% Weight`, 'Category']}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-base font-bold text-slate-900 dark:text-white font-sans">81%</span>
                <span className="text-[9px] text-slate-400 font-medium">Avg. Health</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-600 dark:text-slate-400">
                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                <span className="truncate">Technical (45%)</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-600 dark:text-slate-400">
                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                <span className="truncate">Cost (20%)</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-600 dark:text-slate-400">
                <span className="w-2 h-2 rounded-full bg-orange-400 shrink-0" />
                <span className="truncate">Schedule (25%)</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-600 dark:text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span className="truncate">Env (10%)</span>
              </div>
            </div>
          </div>

          {/* BENTO CARD 2: CRITICAL FINDINGS FEED */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs dark:border-slate-800 dark:bg-[#0c1427] flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Critical Findings</h2>
              <Link to="/contradictions" className="text-[10px] font-bold text-blue-600 dark:text-cyan-400 hover:underline">
                View All &rarr;
              </Link>
            </div>

            <div className="space-y-2.5 overflow-y-auto max-h-72 pr-1">
              <div
                onClick={() => handleViewEvidence(criticalFindings[0])}
                className="p-3 bg-red-50/80 dark:bg-red-950/40 border-l-4 border-red-500 rounded-r-lg hover:bg-red-100/70 dark:hover:bg-red-950/60 transition cursor-pointer"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[9px] font-bold text-red-700 dark:text-red-400 uppercase tracking-wider">CRITICAL</span>
                  <span className="text-[9px] text-slate-400 font-mono">Sec 4.2 vs 7.4</span>
                </div>
                <p className="text-[11px] font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                  Budget inconsistency detected between Sec 4.2 & 7.1 (₹14.6 Cr variance)
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Rural Connectivity Imp.</p>
              </div>

              <div
                onClick={() => handleViewEvidence(criticalFindings[1])}
                className="p-3 bg-orange-50/80 dark:bg-orange-950/40 border-l-4 border-orange-500 rounded-r-lg hover:bg-orange-100/70 dark:hover:bg-orange-950/60 transition cursor-pointer"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[9px] font-bold text-orange-700 dark:text-orange-400 uppercase tracking-wider">HIGH</span>
                  <span className="text-[9px] text-slate-400 font-mono">Sec 3.1 vs 8.2</span>
                </div>
                <p className="text-[11px] font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                  Schedule compression: unrealistic 12-month timeline vs 18-mo civil works
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Hospital Expansion</p>
              </div>

              <div
                onClick={() => handleViewEvidence(criticalFindings[2])}
                className="p-3 bg-amber-50/80 dark:bg-amber-950/40 border-l-4 border-amber-500 rounded-r-lg hover:bg-amber-100/70 dark:hover:bg-amber-950/60 transition cursor-pointer"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[9px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">MEDIUM</span>
                  <span className="text-[9px] text-slate-400 font-mono">Sec 9.4</span>
                </div>
                <p className="text-[11px] font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                  Missing Stage-1 Forest Clearance for 4.2 km corridor realignment
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Integrated Water Supply</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BENTO: SECTOR RISK STACKED BAR CHART */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs dark:border-slate-800 dark:bg-[#0c1427]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Project Risk Overview by Sector
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Distribution of risk ratings across infrastructure sectors
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
            128 DPRs Tracked
          </span>
        </div>

        <div className="mt-4 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={RISK_BAR_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                interval={0}
              />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="Low" fill="#10b981" stackId="a" />
              <Bar dataKey="Medium" fill="#f59e0b" stackId="a" />
              <Bar dataKey="High" fill="#f97316" stackId="a" />
              <Bar dataKey="Critical" fill="#ef4444" stackId="a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
