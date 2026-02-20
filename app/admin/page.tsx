"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Download,
  LogOut,
  Users,
  TrendingUp,
  Eye,
  EyeOff,
  Search,
  X,
  BarChart3,
  TableIcon,
  Calendar,
  Award,
  DollarSign,
  Briefcase,
  Megaphone,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface FormSubmission {
  email: string;
  full_name: string;
  phone: string;
  instagram: string;
  occupation: string;
  occupation_other?: string;
  biggest_challenge: string;
  main_goal: string;
  ads_per_month: string;
  monthly_revenue: string;
  commitment_level: number;
  submitted_at: string;
}

const OCCUPATION_LABELS: Record<string, string> = {
  infoprodutor: "Infoprodutor",
  dr_owner: "DR Owner",
  coproducer: "Co-produtor",
  agency_owner: "Agência",
  copywriter: "Copywriter",
  other: "Outro",
};

const ADS_LABELS: Record<string, string> = {
  none: "Nenhum",
  "1-5": "1-5",
  "5-10": "5-10",
  "10-20": "10-20",
  "20+": "20+",
};

// Normalize inconsistent ads values from DB
const NORMALIZE_ADS: Record<string, string> = {
  "De 1 a 5": "1-5",
  "De 5 a 10": "5-10",
  "De 10 a 20": "10-20",
  "Mais de 20": "20+",
  "Nenhum": "none",
};

function normalizeAds(raw: string): string {
  return NORMALIZE_ADS[raw] || raw;
}

// Normalize occupations: match known keys, text labels, and imported Sheets text
const NORMALIZE_OCCUPATION: Record<string, string> = {
  // Text labels from imported Google Sheets data
  "sou infoprodutor/mentor": "infoprodutor",
  "tenho minha própria empresa de resposta direta": "dr_owner",
  "dr owner": "dr_owner",
  "sou co-produtor": "coproducer",
  "co-produtor": "coproducer",
  "tenho minha própria agência": "agency_owner",
  "agência": "agency_owner",
  "sou copywriter estratégico": "copywriter",
};

function normalizeOccupation(raw: string): string {
  if (OCCUPATION_LABELS[raw]) return raw;
  const lower = raw.toLowerCase().trim();
  if (NORMALIZE_OCCUPATION[lower]) return NORMALIZE_OCCUPATION[lower];
  // Fuzzy match: check if raw contains key terms
  if (lower.includes("infoprodutor") || lower.includes("infoprodut") || lower.includes("mentor") || lower === "info") return "infoprodutor";
  if (lower.includes("operação de dr") || lower.includes("direct response") || lower.includes("direct responsive") || lower === "dr" || lower === "head dr" || lower.includes("dr owner") || lower.includes("dr_owner") || lower.includes("resposta direta") || lower.includes("trafego direto") || lower.includes("tráfego direto")) return "dr_owner";
  if (lower.includes("co-produ") || lower.includes("coprodu") || lower.includes("co produ")) return "coproducer";
  if (lower.includes("agência") || lower.includes("agencia") || lower.includes("agency") || lower.includes("dono de agência") || lower.includes("dono de agencia")) return "agency_owner";
  if (lower.includes("copywriter") || lower.includes("copywriting") || lower === "copy") return "copywriter";
  return "other";
}

const REVENUE_LABELS: Record<string, string> = {
  "less-5k": "< 5k",
  "5k-10k": "5k-10k",
  "10k-25k": "10k-25k",
  "25k-50k": "25k-50k",
  "50k-100k": "50k-100k",
  "100k+": "100k+",
};

const COMMITMENT_RANGES: Record<string, string> = {
  "1-3": "1-3 (Baixo)",
  "4-6": "4-6 (Médio)",
  "7-8": "7-8 (Alto)",
  "9-10": "9-10 (Muito alto)",
};

const CHART_COLORS = [
  "#ff4d00",
  "#ff7a3d",
  "#ff9d6e",
  "#ffbe9a",
  "#ffd9c2",
  "#e64500",
];

const DASHBOARD_PERIODS = [
  { label: "7 dias", days: 7 },
  { label: "30 dias", days: 30 },
  { label: "90 dias", days: 90 },
  { label: "Tudo", days: 0 },
];

function CommitmentBar({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden w-20">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${level * 10}%`,
            backgroundColor:
              level >= 8 ? "#22c55e" : level >= 5 ? "#f59e0b" : "#ef4444",
          }}
        />
      </div>
      <span className="text-xs font-bold text-white/70 w-6">{level}</span>
    </div>
  );
}

const darkTooltipStyle = {
  contentStyle: {
    backgroundColor: "#1a1a1a",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "13px",
  },
  itemStyle: { color: "#fff" },
  labelStyle: { color: "rgba(255,255,255,0.6)" },
};

function inCommitmentRange(level: number, range: string): boolean {
  const [min, max] = range.split("-").map(Number);
  return level >= min && level <= max;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [forms, setForms] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Tab state
  const [activeTab, setActiveTab] = useState<"forms" | "dashboard">("forms");
  const [chartsReady, setChartsReady] = useState(false);

  // Defer chart rendering to avoid ResponsiveContainer width(-1) warnings
  useEffect(() => {
    if (activeTab === "dashboard") {
      setChartsReady(false);
      const timer = setTimeout(() => setChartsReady(true), 50);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOccupations, setFilterOccupations] = useState<string[]>([]);
  const [filterRevenues, setFilterRevenues] = useState<string[]>([]);
  const [filterAdsValues, setFilterAdsValues] = useState<string[]>([]);
  const [filterCommitments, setFilterCommitments] = useState<string[]>([]);
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  const toggleFilter = (arr: string[], setArr: (v: string[]) => void, value: string) => {
    setArr(arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);
  };

  // Dashboard period state
  const [dashboardPeriodDays, setDashboardPeriodDays] = useState(30);
  const [dashboardDateFrom, setDashboardDateFrom] = useState("");
  const [dashboardDateTo, setDashboardDateTo] = useState("");

  useEffect(() => {
    const savedEmail = sessionStorage.getItem("adminEmail");
    const savedPassword = sessionStorage.getItem("adminPassword");
    if (savedEmail && savedPassword) fetchForms(savedEmail, savedPassword);
  }, []);

  const fetchForms = async (email: string, password: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setForms(data.forms);
        setIsAuthenticated(true);
        sessionStorage.setItem("adminEmail", email);
        sessionStorage.setItem("adminPassword", password);
      } else {
        setError(data.error || "Acesso negado");
      }
    } catch {
      setError("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchForms(inputEmail, inputPassword);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminEmail");
    sessionStorage.removeItem("adminPassword");
    setIsAuthenticated(false);
    setForms([]);
  };

  // Filtered forms for the Formulários tab
  const filteredForms = useMemo(() => {
    return forms.filter((f) => {
      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          f.full_name.toLowerCase().includes(q) ||
          f.email.toLowerCase().includes(q) ||
          f.instagram.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }
      // Occupation (multi)
      if (filterOccupations.length > 0 && !filterOccupations.includes(normalizeOccupation(f.occupation))) return false;
      // Revenue (multi)
      if (filterRevenues.length > 0 && !filterRevenues.includes(f.monthly_revenue)) return false;
      // Ads (multi)
      if (filterAdsValues.length > 0 && !filterAdsValues.includes(normalizeAds(f.ads_per_month))) return false;
      // Commitment (multi)
      if (filterCommitments.length > 0 && !filterCommitments.some((range) => inCommitmentRange(f.commitment_level, range)))
        return false;
      // Date range
      if (filterDateFrom) {
        const from = new Date(filterDateFrom);
        if (new Date(f.submitted_at) < from) return false;
      }
      if (filterDateTo) {
        const to = new Date(filterDateTo);
        to.setHours(23, 59, 59, 999);
        if (new Date(f.submitted_at) > to) return false;
      }
      return true;
    });
  }, [forms, searchQuery, filterOccupations, filterRevenues, filterAdsValues, filterCommitments, filterDateFrom, filterDateTo]);

  const hasActiveFilters =
    searchQuery || filterOccupations.length > 0 || filterRevenues.length > 0 || filterAdsValues.length > 0 || filterCommitments.length > 0 || filterDateFrom || filterDateTo;

  const clearFilters = () => {
    setSearchQuery("");
    setFilterOccupations([]);
    setFilterRevenues([]);
    setFilterAdsValues([]);
    setFilterCommitments([]);
    setFilterDateFrom("");
    setFilterDateTo("");
  };

  // Dashboard data
  const dashboardForms = useMemo(() => {
    // If custom dates are set, use them
    if (dashboardDateFrom || dashboardDateTo) {
      return forms.filter((f) => {
        const d = new Date(f.submitted_at);
        if (dashboardDateFrom && d < new Date(dashboardDateFrom)) return false;
        if (dashboardDateTo) {
          const to = new Date(dashboardDateTo);
          to.setHours(23, 59, 59, 999);
          if (d > to) return false;
        }
        return true;
      });
    }
    // Otherwise use preset period
    if (dashboardPeriodDays === 0) return forms;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - dashboardPeriodDays);
    return forms.filter((f) => new Date(f.submitted_at) >= cutoff);
  }, [forms, dashboardPeriodDays, dashboardDateFrom, dashboardDateTo]);

  // Chart: Submissions over time
  const submissionsOverTime = useMemo(() => {
    const map: Record<string, number> = {};
    dashboardForms.forEach((f) => {
      const day = new Date(f.submitted_at).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      });
      map[day] = (map[day] || 0) + 1;
    });
    // Sort by actual date
    const sorted = dashboardForms
      .map((f) => {
        const d = new Date(f.submitted_at);
        return {
          dateObj: d,
          day: d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
        };
      })
      .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

    const seen = new Set<string>();
    const result: { name: string; total: number }[] = [];
    sorted.forEach(({ day }) => {
      if (!seen.has(day)) {
        seen.add(day);
        result.push({ name: day, total: map[day] });
      }
    });
    return result;
  }, [dashboardForms]);

  // Chart: Distribution by occupation (normalized)
  const occupationDistribution = useMemo(() => {
    const map: Record<string, number> = {};
    dashboardForms.forEach((f) => {
      const key = normalizeOccupation(f.occupation);
      const label = OCCUPATION_LABELS[key] || "Outro";
      map[label] = (map[label] || 0) + 1;
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [dashboardForms]);

  // Chart: Distribution by revenue
  const revenueDistribution = useMemo(() => {
    const order = Object.keys(REVENUE_LABELS);
    const map: Record<string, number> = {};
    dashboardForms.forEach((f) => {
      const label = REVENUE_LABELS[f.monthly_revenue] || f.monthly_revenue;
      map[label] = (map[label] || 0) + 1;
    });
    return order
      .map((key) => ({
        name: REVENUE_LABELS[key],
        value: map[REVENUE_LABELS[key]] || 0,
      }))
      .filter((d) => d.value > 0);
  }, [dashboardForms]);

  // Chart: Distribution by ads/month (normalized)
  const adsDistribution = useMemo(() => {
    const order = ["Nenhum", "1-5", "5-10", "10-20", "20+"];
    const map: Record<string, number> = {};
    dashboardForms.forEach((f) => {
      const normalized = normalizeAds(f.ads_per_month);
      const label = ADS_LABELS[normalized] || normalized;
      map[label] = (map[label] || 0) + 1;
    });
    return order
      .map((name) => ({ name, value: map[name] || 0 }))
      .filter((d) => d.value > 0);
  }, [dashboardForms]);

  // Chart: Average commitment by occupation (normalized)
  const commitmentByOccupation = useMemo(() => {
    const sums: Record<string, { total: number; count: number }> = {};
    dashboardForms.forEach((f) => {
      const key = normalizeOccupation(f.occupation);
      const label = OCCUPATION_LABELS[key] || "Outro";
      if (!sums[label]) sums[label] = { total: 0, count: 0 };
      sums[label].total += f.commitment_level;
      sums[label].count += 1;
    });
    return Object.entries(sums)
      .map(([name, { total, count }]) => ({
        name,
        media: parseFloat((total / count).toFixed(1)),
      }))
      .sort((a, b) => b.media - a.media);
  }, [dashboardForms]);

  // Dashboard stats
  const dashboardStats = useMemo(() => {
    const total = dashboardForms.length;
    const avgCommitment =
      total > 0
        ? (dashboardForms.reduce((s, f) => s + f.commitment_level, 0) / total).toFixed(1)
        : "0";

    // Most common occupation (normalized)
    const occMap: Record<string, number> = {};
    dashboardForms.forEach((f) => {
      const key = normalizeOccupation(f.occupation);
      const label = OCCUPATION_LABELS[key] || "Outro";
      occMap[label] = (occMap[label] || 0) + 1;
    });
    const topOccupation =
      Object.entries(occMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

    // Most common revenue
    const revMap: Record<string, number> = {};
    dashboardForms.forEach((f) => {
      const label = REVENUE_LABELS[f.monthly_revenue] || f.monthly_revenue;
      revMap[label] = (revMap[label] || 0) + 1;
    });
    const topRevenue =
      Object.entries(revMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

    return { total, avgCommitment, topOccupation, topRevenue };
  }, [dashboardForms]);

  const exportToCSV = () => {
    const data = activeTab === "forms" ? filteredForms : forms;
    const headers = [
      "Email", "Nome", "Telefone", "Instagram", "Ocupacao", "Outro",
      "Maior Desafio", "Objetivo Principal", "Anuncios/Mes", "Faturamento",
      "Comprometimento", "Data",
    ];
    const rows = data.map((f) => [
      f.email, f.full_name, f.phone, f.instagram,
      OCCUPATION_LABELS[f.occupation] || f.occupation,
      f.occupation_other || "", f.biggest_challenge, f.main_goal,
      ADS_LABELS[normalizeAds(f.ads_per_month)] || f.ads_per_month,
      REVENUE_LABELS[f.monthly_revenue] || f.monthly_revenue,
      f.commitment_level,
      new Date(f.submitted_at).toLocaleString("pt-BR"),
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `formularios_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  // Stats for forms tab (use filtered data)
  const avgCommitment =
    filteredForms.length > 0
      ? (filteredForms.reduce((s, f) => s + f.commitment_level, 0) / filteredForms.length).toFixed(1)
      : "0";

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4">
        <Card className="w-full max-w-sm border border-white/10 bg-black/80">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h1 className="font-display font-black text-2xl text-white uppercase tracking-tight">
                Admin
              </h1>
              <p className="text-white/40 text-sm mt-1">Painel de controle</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="email"
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                placeholder="admin@email.com"
                required
              />
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 pr-11"
                  placeholder="Senha"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}
              <Button
                type="submit"
                className="w-full h-12 font-display font-bold"
                disabled={loading}
              >
                {loading ? "Verificando..." : "Acessar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display font-black text-2xl uppercase tracking-tight">
              Painel Admin
            </h1>
            <p className="text-white/40 text-sm mt-0.5">
              {forms.length} respostas totais
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={exportToCSV}
              variant="outline"
              size="sm"
              className="gap-2 border-white/10 bg-white/5 text-white hover:bg-white/10"
              disabled={forms.length === 0}
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">CSV</span>
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="gap-2 border-white/10 bg-white/5 text-white hover:bg-white/10"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white/[0.03] border border-white/10 rounded-lg p-1 w-fit">
          <button
            onClick={() => setActiveTab("forms")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "forms"
                ? "bg-[#ff4d00] text-white shadow-lg"
                : "text-white/50 hover:text-white/80 hover:bg-white/5"
            }`}
          >
            <TableIcon className="w-4 h-4" />
            Formulários
          </button>
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "dashboard"
                ? "bg-[#ff4d00] text-white shadow-lg"
                : "text-white/50 hover:text-white/80 hover:bg-white/5"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Dashboard
          </button>
        </div>

        {/* ====== FORMS TAB ====== */}
        {activeTab === "forms" && (
          <>
            {/* Search bar + filter toggle */}
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-11 pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  placeholder="Buscar nome, email, Instagram..."
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {hasActiveFilters && (
                <Button
                  onClick={clearFilters}
                  variant="ghost"
                  size="sm"
                  className="h-11 px-3 gap-1.5 text-white/50 hover:text-white hover:bg-white/10 text-xs shrink-0 border border-white/10"
                >
                  <X className="w-3.5 h-3.5" />
                  Limpar
                </Button>
              )}
            </div>

            {/* Filter chips - always visible */}
            <div className="mb-4 space-y-3">
              {/* Ocupação */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-white/30 font-medium w-24 shrink-0">
                  <Briefcase className="w-3 h-3 inline mr-1" />Ocupação
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(OCCUPATION_LABELS).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => toggleFilter(filterOccupations, setFilterOccupations, key)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        filterOccupations.includes(key)
                          ? "bg-[#ff4d00] text-white shadow-lg shadow-[#ff4d00]/20"
                          : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white/80"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Faturamento */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-white/30 font-medium w-24 shrink-0">
                  <DollarSign className="w-3 h-3 inline mr-1" />Faturamento
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(REVENUE_LABELS).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => toggleFilter(filterRevenues, setFilterRevenues, key)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        filterRevenues.includes(key)
                          ? "bg-[#ff4d00] text-white shadow-lg shadow-[#ff4d00]/20"
                          : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white/80"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ads/Mês */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-white/30 font-medium w-24 shrink-0">
                  <Megaphone className="w-3 h-3 inline mr-1" />Ads/Mês
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(ADS_LABELS).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => toggleFilter(filterAdsValues, setFilterAdsValues, key)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        filterAdsValues.includes(key)
                          ? "bg-[#ff4d00] text-white shadow-lg shadow-[#ff4d00]/20"
                          : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white/80"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comprometimento */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-white/30 font-medium w-24 shrink-0">
                  <Flame className="w-3 h-3 inline mr-1" />Nível
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(COMMITMENT_RANGES).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => toggleFilter(filterCommitments, setFilterCommitments, key)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        filterCommitments.includes(key)
                          ? "bg-[#ff4d00] text-white shadow-lg shadow-[#ff4d00]/20"
                          : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white/80"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Datas */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-white/30 font-medium w-24 shrink-0">
                  <Calendar className="w-3 h-3 inline mr-1" />Período
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={filterDateFrom}
                    onChange={(e) => setFilterDateFrom(e.target.value)}
                    className="h-8 px-2 rounded-full bg-white/5 border border-white/10 text-xs text-white/80 cursor-pointer"
                  />
                  <span className="text-white/20 text-xs">até</span>
                  <input
                    type="date"
                    value={filterDateTo}
                    onChange={(e) => setFilterDateTo(e.target.value)}
                    className="h-8 px-2 rounded-full bg-white/5 border border-white/10 text-xs text-white/80 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              <div className="border border-white/10 rounded-xl bg-white/[0.02] p-4">
                <div className="flex items-center gap-2 text-white/40 text-xs mb-1">
                  <Users className="w-3.5 h-3.5" />
                  {hasActiveFilters ? "Filtrados" : "Total"}
                </div>
                <p className="text-2xl font-display font-black text-[#ff4d00]">
                  {filteredForms.length}
                  {hasActiveFilters && (
                    <span className="text-sm text-white/30 font-normal ml-1">/ {forms.length}</span>
                  )}
                </p>
              </div>
              <div className="border border-white/10 rounded-xl bg-white/[0.02] p-4">
                <div className="flex items-center gap-2 text-white/40 text-xs mb-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Comprometimento Médio
                </div>
                <p className="text-2xl font-display font-black text-[#ff4d00]">
                  {avgCommitment}
                </p>
              </div>
              <div className="border border-white/10 rounded-xl bg-white/[0.02] p-4 col-span-2 sm:col-span-1">
                <div className="flex items-center gap-2 text-white/40 text-xs mb-1">
                  Último cadastro
                </div>
                <p className="text-sm font-medium text-white/80">
                  {filteredForms.length > 0
                    ? new Date(filteredForms[0].submitted_at).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—"}
                </p>
              </div>
            </div>

            {/* Table */}
            {filteredForms.length === 0 ? (
              <div className="border border-white/10 rounded-xl bg-white/[0.02] p-16 text-center">
                <p className="text-white/30">
                  {hasActiveFilters
                    ? "Nenhum resultado encontrado com os filtros atuais"
                    : "Nenhum formulário ainda"}
                </p>
              </div>
            ) : (
              <div className="border border-white/10 rounded-xl bg-white/[0.02] overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="text-white/50 font-display text-xs uppercase tracking-wider">Nome</TableHead>
                      <TableHead className="text-white/50 font-display text-xs uppercase tracking-wider">Contato</TableHead>
                      <TableHead className="text-white/50 font-display text-xs uppercase tracking-wider hidden md:table-cell">Ocupação</TableHead>
                      <TableHead className="text-white/50 font-display text-xs uppercase tracking-wider hidden lg:table-cell">Ads/Mês</TableHead>
                      <TableHead className="text-white/50 font-display text-xs uppercase tracking-wider hidden lg:table-cell">Faturamento</TableHead>
                      <TableHead className="text-white/50 font-display text-xs uppercase tracking-wider">Nível</TableHead>
                      <TableHead className="text-white/50 font-display text-xs uppercase tracking-wider hidden sm:table-cell">Data</TableHead>
                      <TableHead className="w-10" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredForms.map((form) => (
                      <>
                        <TableRow
                          key={form.email}
                          className="border-white/5 cursor-pointer hover:bg-white/[0.03]"
                          onClick={() =>
                            setExpandedRow(
                              expandedRow === form.email ? null : form.email
                            )
                          }
                        >
                          <TableCell>
                            <p className="font-semibold text-white text-sm">
                              {form.full_name}
                            </p>
                            {form.phone && (
                              <a
                                href={`https://wa.me/${form.phone.replace(/\D/g, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white/40 text-xs hover:text-[#25D366] transition-colors"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {form.phone}
                              </a>
                            )}
                          </TableCell>
                          <TableCell>
                            <p className="text-white/70 text-xs">{form.email}</p>
                            <p className="text-white/40 text-xs">{form.instagram}</p>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge
                              variant="secondary"
                              className="bg-white/5 text-white/60 border-white/10 text-xs"
                            >
                              {OCCUPATION_LABELS[normalizeOccupation(form.occupation)] || form.occupation}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <span className="text-white/60 text-sm">
                              {ADS_LABELS[normalizeAds(form.ads_per_month)] || form.ads_per_month}
                            </span>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <Badge
                              variant="outline"
                              className="text-[#ff4d00] border-[#ff4d00]/30 text-xs"
                            >
                              {REVENUE_LABELS[form.monthly_revenue] || form.monthly_revenue}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <CommitmentBar level={form.commitment_level} />
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <span className="text-white/40 text-xs">
                              {new Date(form.submitted_at).toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "short",
                              })}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-white/30 hover:text-white hover:bg-white/10"
                            >
                              {expandedRow === form.email ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>

                        {expandedRow === form.email && (
                          <TableRow
                            key={`${form.email}-detail`}
                            className="border-white/5 hover:bg-transparent"
                          >
                            <TableCell colSpan={8} className="p-0">
                              <div className="bg-white/[0.02] border-t border-white/5 px-3 py-4 sm:px-6 sm:py-5">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                  <div className="space-y-3">
                                    <h4 className="text-xs font-display uppercase tracking-wider text-[#ff4d00] font-bold">
                                      Contato
                                    </h4>
                                    <div className="space-y-2">
                                      <div>
                                        <span className="text-white/30 text-xs">Telefone</span>
                                        <p className="text-white/80 text-sm">{form.phone}</p>
                                      </div>
                                      <div>
                                        <span className="text-white/30 text-xs">Instagram</span>
                                        <p className="text-white/80 text-sm">{form.instagram}</p>
                                      </div>
                                      {form.occupation_other && (
                                        <div>
                                          <span className="text-white/30 text-xs">Ocupação (outro)</span>
                                          <p className="text-white/80 text-sm">{form.occupation_other}</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-display uppercase tracking-wider text-[#ff4d00] font-bold mb-3">
                                      Maior Desafio
                                    </h4>
                                    <p className="text-white/70 text-sm leading-relaxed bg-white/[0.03] border border-white/5 rounded-lg p-3">
                                      {form.biggest_challenge}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-display uppercase tracking-wider text-[#ff4d00] font-bold mb-3">
                                      Objetivo Principal
                                    </h4>
                                    <p className="text-white/70 text-sm leading-relaxed bg-white/[0.03] border border-white/5 rounded-lg p-3">
                                      {form.main_goal}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </>
        )}

        {/* ====== DASHBOARD TAB ====== */}
        {activeTab === "dashboard" && (
          <>
            {/* Period selector — refined controls */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-3 mb-8">
              <div className="flex gap-0.5 bg-white/[0.03] border border-white/[0.08] rounded-xl p-1 w-full sm:w-fit backdrop-blur-sm">
                {DASHBOARD_PERIODS.map((p) => (
                  <button
                    key={p.days}
                    onClick={() => {
                      setDashboardPeriodDays(p.days);
                      setDashboardDateFrom("");
                      setDashboardDateTo("");
                    }}
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 ${
                      dashboardPeriodDays === p.days && !dashboardDateFrom && !dashboardDateTo
                        ? "bg-[#ff4d00] text-white shadow-[0_2px_12px_rgba(255,77,0,0.4)]"
                        : "text-white/40 hover:text-white/70 hover:bg-white/[0.04]"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <div className="flex items-end gap-2">
                <div className="flex flex-col gap-1 flex-1 sm:flex-none">
                  <label className="text-[10px] uppercase tracking-[0.15em] text-white/25 font-medium">De</label>
                  <input
                    type="date"
                    value={dashboardDateFrom}
                    onChange={(e) => setDashboardDateFrom(e.target.value)}
                    className="h-9 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white/70 cursor-pointer w-full sm:w-auto focus:border-[#ff4d00]/40 focus:outline-none transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1 flex-1 sm:flex-none">
                  <label className="text-[10px] uppercase tracking-[0.15em] text-white/25 font-medium">Até</label>
                  <input
                    type="date"
                    value={dashboardDateTo}
                    onChange={(e) => setDashboardDateTo(e.target.value)}
                    className="h-9 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white/70 cursor-pointer w-full sm:w-auto focus:border-[#ff4d00]/40 focus:outline-none transition-colors"
                  />
                </div>
                {(dashboardDateFrom || dashboardDateTo) && (
                  <button
                    onClick={() => { setDashboardDateFrom(""); setDashboardDateTo(""); }}
                    className="h-9 w-9 flex items-center justify-center rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-all shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Dashboard Stats — elevated cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
              {[
                {
                  icon: Users,
                  label: "Total no período",
                  value: dashboardStats.total,
                  isLarge: true,
                  accent: "#ff4d00",
                },
                {
                  icon: TrendingUp,
                  label: "Comprometimento Médio",
                  value: dashboardStats.avgCommitment,
                  isLarge: true,
                  accent: "#ff4d00",
                },
                {
                  icon: Award,
                  label: "Ocupação mais comum",
                  value: dashboardStats.topOccupation,
                  isLarge: false,
                  accent: "#ff7a3d",
                },
                {
                  icon: DollarSign,
                  label: "Faturamento mais comum",
                  value: dashboardStats.topRevenue,
                  isLarge: false,
                  accent: "#ff7a3d",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="group relative overflow-hidden rounded-xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-4 transition-all duration-300 hover:border-white/[0.12] hover:shadow-[0_0_30px_rgba(255,77,0,0.04)]"
                >
                  {/* Subtle corner glow */}
                  <div
                    className="absolute -top-8 -right-8 w-20 h-20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
                    style={{ backgroundColor: stat.accent }}
                  />
                  <div className="relative">
                    <div className="flex items-center gap-2 text-white/35 text-[11px] tracking-wide mb-2">
                      <stat.icon className="w-3.5 h-3.5" style={{ color: stat.accent }} />
                      {stat.label}
                    </div>
                    <p
                      className={`font-display font-black ${
                        stat.isLarge ? "text-3xl" : "text-sm font-semibold mt-1"
                      }`}
                      style={{ color: stat.isLarge ? stat.accent : "rgba(255,255,255,0.85)" }}
                    >
                      {stat.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {dashboardForms.length === 0 ? (
              <div className="border border-white/[0.08] rounded-2xl bg-white/[0.02] p-20 text-center">
                <p className="text-white/25 text-sm">Nenhum dado no período selecionado</p>
              </div>
            ) : !chartsReady ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className={`rounded-2xl border border-white/[0.08] bg-white/[0.02] h-[320px] ${i === 1 ? "lg:col-span-2" : ""}`} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* ── Submissions over time ── */}
                <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-transparent p-4 sm:p-6 lg:col-span-2">
                  <div className="absolute top-0 right-0 w-60 h-40 bg-[#ff4d00]/[0.03] blur-3xl rounded-full pointer-events-none" />
                  <h3 className="relative text-xs sm:text-sm font-display font-bold uppercase tracking-[0.12em] text-white/50 mb-4 sm:mb-5 flex items-center gap-2.5">
                    <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#ff4d00]/10 border border-[#ff4d00]/20">
                      <Calendar className="w-3.5 h-3.5 text-[#ff4d00]" />
                    </span>
                    Cadastros ao longo do tempo
                  </h3>
                  <div className="h-[220px] sm:h-[280px]">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                      <AreaChart data={submissionsOverTime} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
                        <defs>
                          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#ff4d00" stopOpacity={0.25} />
                            <stop offset="100%" stopColor="#ff4d00" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                        <XAxis
                          dataKey="name"
                          tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                          axisLine={false}
                          tickLine={false}
                          allowDecimals={false}
                        />
                        <Tooltip {...darkTooltipStyle} />
                        <Area
                          type="monotone"
                          dataKey="total"
                          stroke="#ff4d00"
                          strokeWidth={2.5}
                          fillOpacity={1}
                          fill="url(#colorTotal)"
                          name="Cadastros"
                          dot={false}
                          activeDot={{ r: 5, fill: "#ff4d00", stroke: "#0a0a0a", strokeWidth: 2 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* ── Occupation distribution ── */}
                <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-transparent p-4 sm:p-6">
                  <h3 className="text-xs sm:text-sm font-display font-bold uppercase tracking-[0.12em] text-white/50 mb-4 sm:mb-5 flex items-center gap-2.5">
                    <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#ff7a3d]/10 border border-[#ff7a3d]/20">
                      <Briefcase className="w-3.5 h-3.5 text-[#ff7a3d]" />
                    </span>
                    Distribuição por Ocupação
                  </h3>
                  <div className="h-[240px] sm:h-[270px]">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                      <BarChart data={occupationDistribution} layout="vertical" margin={{ left: 0, right: 12, top: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                        <XAxis
                          type="number"
                          tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                          axisLine={false}
                          tickLine={false}
                          allowDecimals={false}
                        />
                        <YAxis
                          dataKey="name"
                          type="category"
                          tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 11, fontWeight: 500 }}
                          axisLine={false}
                          tickLine={false}
                          width={95}
                        />
                        <Tooltip {...darkTooltipStyle} />
                        <Bar dataKey="value" name="Total" radius={[0, 6, 6, 0]} barSize={18}>
                          {occupationDistribution.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* ── Revenue distribution ── */}
                <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-transparent p-4 sm:p-6">
                  <h3 className="text-xs sm:text-sm font-display font-bold uppercase tracking-[0.12em] text-white/50 mb-4 sm:mb-5 flex items-center gap-2.5">
                    <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#ffbe9a]/10 border border-[#ffbe9a]/20">
                      <DollarSign className="w-3.5 h-3.5 text-[#ffbe9a]" />
                    </span>
                    Distribuição por Faturamento
                  </h3>
                  <div className="h-[240px] sm:h-[270px]">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                      <BarChart data={revenueDistribution} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                        <XAxis
                          dataKey="name"
                          tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 500 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                          axisLine={false}
                          tickLine={false}
                          allowDecimals={false}
                        />
                        <Tooltip {...darkTooltipStyle} />
                        <Bar dataKey="value" name="Total" radius={[6, 6, 0, 0]} barSize={36}>
                          {revenueDistribution.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* ── Ads/month distribution (Donut) ── */}
                <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-transparent p-4 sm:p-6">
                  <h3 className="text-xs sm:text-sm font-display font-bold uppercase tracking-[0.12em] text-white/50 mb-4 sm:mb-5 flex items-center gap-2.5">
                    <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#e64500]/10 border border-[#e64500]/20">
                      <Megaphone className="w-3.5 h-3.5 text-[#e64500]" />
                    </span>
                    Distribuição por Ads/Mês
                  </h3>
                  <div className="h-[240px] sm:h-[270px]">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                      <PieChart>
                        <Pie
                          data={adsDistribution}
                          cx="50%"
                          cy="45%"
                          innerRadius={55}
                          outerRadius={95}
                          paddingAngle={4}
                          dataKey="value"
                          nameKey="name"
                          stroke="rgba(10,10,10,0.6)"
                          strokeWidth={2}
                        >
                          {adsDistribution.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip {...darkTooltipStyle} />
                        <Legend
                          wrapperStyle={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", paddingTop: "8px" }}
                          iconType="circle"
                          iconSize={8}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* ── Commitment by occupation ── */}
                <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-transparent p-4 sm:p-6">
                  <h3 className="text-xs sm:text-sm font-display font-bold uppercase tracking-[0.12em] text-white/50 mb-4 sm:mb-5 flex items-center gap-2.5">
                    <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#22c55e]/10 border border-[#22c55e]/20">
                      <Flame className="w-3.5 h-3.5 text-[#22c55e]" />
                    </span>
                    Comprometimento por Ocupação
                  </h3>
                  <div className="h-[240px] sm:h-[270px]">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                      <BarChart data={commitmentByOccupation} layout="vertical" margin={{ left: 0, right: 12, top: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                        <XAxis
                          type="number"
                          domain={[0, 10]}
                          tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          dataKey="name"
                          type="category"
                          tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 11, fontWeight: 500 }}
                          axisLine={false}
                          tickLine={false}
                          width={95}
                        />
                        <Tooltip {...darkTooltipStyle} />
                        <Bar dataKey="media" name="Média" radius={[0, 6, 6, 0]} barSize={18}>
                          {commitmentByOccupation.map((entry) => (
                            <Cell
                              key={entry.name}
                              fill={
                                entry.media >= 8
                                  ? "#22c55e"
                                  : entry.media >= 5
                                  ? "#f59e0b"
                                  : "#ef4444"
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
