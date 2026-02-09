"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronDown, ChevronUp, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FormSubmission {
  email: string;
  fullName: string;
  phone: string;
  instagram: string;
  occupation: string;
  occupationOther?: string;
  biggestChallenge: string;
  mainGoal: string;
  adsPerMonth: string;
  monthlyRevenue: string;
  commitmentLevel: number;
  submittedAt: string;
}

const OCCUPATION_LABELS: Record<string, string> = {
  infoprodutor: "Infoprodutor/Mentor",
  dr_owner: "Dono de operação de DR",
  coproducer: "Co-produtor",
  agency_owner: "Dono de agência",
  copywriter: "Copywriter",
  other: "Outro",
};

const ADS_LABELS: Record<string, string> = {
  none: "Nenhum",
  "1-5": "1-5 anúncios",
  "5-10": "5-10 anúncios",
  "10-20": "10-20 anúncios",
  "20+": "20+ anúncios",
};

const REVENUE_LABELS: Record<string, string> = {
  "less-5k": "Menos de R$ 5k",
  "5k-10k": "R$ 5k - R$ 10k",
  "10k-25k": "R$ 10k - R$ 25k",
  "25k-50k": "R$ 25k - R$ 50k",
  "50k-100k": "R$ 50k - R$ 100k",
  "100k+": "R$ 100k+",
};

export default function AdminPage() {
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputEmail, setInputEmail] = useState("");
  const [forms, setForms] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  useEffect(() => {
    const savedEmail = sessionStorage.getItem("adminEmail");
    if (savedEmail) {
      setAdminEmail(savedEmail);
      fetchForms(savedEmail);
    }
  }, []);

  const fetchForms = async (email: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setForms(data.forms);
        setIsAuthenticated(true);
        sessionStorage.setItem("adminEmail", email);
      } else {
        setError(data.error || "Acesso negado");
        setIsAuthenticated(false);
      }
    } catch (err) {
      setError("Erro ao carregar dados");
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminEmail(inputEmail);
    fetchForms(inputEmail);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminEmail");
    setIsAuthenticated(false);
    setAdminEmail("");
    setForms([]);
  };

  const toggleRow = (email: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(email)) {
      newExpanded.delete(email);
    } else {
      newExpanded.add(email);
    }
    setExpandedRows(newExpanded);
  };

  const exportToCSV = () => {
    const headers = [
      "Email",
      "Nome",
      "Telefone",
      "Instagram",
      "Ocupação",
      "Outro",
      "Maior Desafio",
      "Objetivo Principal",
      "Anúncios/Mês",
      "Faturamento",
      "Comprometimento",
      "Data",
    ];

    const rows = forms.map((form) => [
      form.email,
      form.fullName,
      form.phone,
      form.instagram,
      OCCUPATION_LABELS[form.occupation] || form.occupation,
      form.occupationOther || "",
      form.biggestChallenge,
      form.mainGoal,
      ADS_LABELS[form.adsPerMonth] || form.adsPerMonth,
      REVENUE_LABELS[form.monthlyRevenue] || form.monthlyRevenue,
      form.commitmentLevel,
      new Date(form.submittedAt).toLocaleString("pt-BR"),
    ]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `formularios_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">
              Admin - <span className="gradient-text">Painel de Controle</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email de Admin
                </label>
                <Input
                  type="email"
                  id="email"
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  placeholder="admin@email.com"
                  required
                />
              </div>

              {error && (
                <div className="bg-destructive/10 border border-destructive/50 text-destructive px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Verificando..." : "Acessar Painel"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Painel <span className="gradient-text">Administrativo</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              {forms.length} formulário{forms.length !== 1 ? "s" : ""} submetido{forms.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex gap-3">
            <Button onClick={exportToCSV} variant="outline" className="gap-2" disabled={forms.length === 0}>
              <Download className="w-4 h-4" />
              Exportar CSV
            </Button>
            <Button onClick={handleLogout} variant="outline">
              Sair
            </Button>
          </div>
        </div>

        {/* Forms Table */}
        {forms.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-muted-foreground text-lg">Nenhum formulário submetido ainda</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {forms.map((form) => (
              <Card key={form.email} className="overflow-hidden">
                <div
                  className="p-4 cursor-pointer hover:bg-secondary/50 transition-colors"
                  onClick={() => toggleRow(form.email)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Nome</p>
                        <p className="font-semibold">{form.fullName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium text-primary">{form.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Ocupação</p>
                        <p className="font-medium">
                          {OCCUPATION_LABELS[form.occupation] || form.occupation}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Comprometimento</p>
                        <p className="font-bold text-primary">{form.commitmentLevel}/10</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      {expandedRows.has(form.email) ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                </div>

                {expandedRows.has(form.email) && (
                  <div className="border-t border-border p-6 bg-secondary/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-foreground mb-4">Informações de Contato</h3>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-muted-foreground">Telefone</p>
                            <p className="font-medium">{form.phone}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Instagram</p>
                            <p className="font-medium">{form.instagram}</p>
                          </div>
                          {form.occupationOther && (
                            <div>
                              <p className="text-sm text-muted-foreground">Especificação (Outro)</p>
                              <p className="font-medium">{form.occupationOther}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-foreground mb-4">Métricas</h3>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-muted-foreground">Anúncios por Mês</p>
                            <p className="font-medium">{ADS_LABELS[form.adsPerMonth] || form.adsPerMonth}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Faturamento Mensal</p>
                            <p className="font-medium">{REVENUE_LABELS[form.monthlyRevenue] || form.monthlyRevenue}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Data de Submissão</p>
                            <p className="font-medium">
                              {new Date(form.submittedAt).toLocaleString("pt-BR")}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <h3 className="font-semibold text-foreground mb-4">Desafios e Objetivos</h3>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Maior Desafio</p>
                            <p className="text-foreground bg-card p-3 rounded-lg border border-border">
                              {form.biggestChallenge}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Objetivo Principal</p>
                            <p className="text-foreground bg-card p-3 rounded-lg border border-border">
                              {form.mainGoal}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
