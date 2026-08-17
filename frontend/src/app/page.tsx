'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Sprout, 
  Bug, 
  ExternalLink, 
  Sparkles, 
  Database, 
  Activity, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  BookOpen, 
  Cpu, 
  ArrowRight,
  Filter,
  X,
  ShieldAlert,
  Layers,
  Zap,
  CheckSquare,
  Square,
  ListChecks,
  Wrench,
  ShieldCheck,
  Award,
  Info,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  Image as ImageIcon
} from 'lucide-react';
import { getCropImageUrl } from '@/lib/cropImages';

interface CropDiseaseItem {
  id?: string;
  cropName: string;
  cropImageUrl?: string;
  pestName: string;
  description: string;
  impactData: string;
  controlMethods?: string;
  agriculturalImplements?: string;
  sourceUrl: string;
  createdAt?: string;
}

interface CropSearchResult {
  cropName: string;
  cropImageUrl?: string;
  pests: CropDiseaseItem[];
  cached?: boolean;
  source?: string;
  message?: string;
}

const CROP_PRESETS = [
  { name: 'Tomate', icon: '🍅' },
  { name: 'Milho', icon: '🌽' },
  { name: 'Soja', icon: '🌱' },
  { name: 'Café', icon: '☕' },
  { name: 'Trigo', icon: '🌾' },
  { name: 'Batata', icon: '🥔' },
  { name: 'Cacau', icon: '🍫' },
  { name: 'Algodão', icon: '☁️' },
];

export default function Home() {
  const [cropName, setCropName] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  
  // Resultado da análise da cultura atual (contendo as 4 pragas/doenças e a imagem)
  const [currentResult, setCurrentResult] = useState<CropSearchResult | null>(null);

  // Histórico de registros gravados no banco
  const [history, setHistory] = useState<CropDiseaseItem[]>([]);
  const [historyQuery, setHistoryQuery] = useState('');
  const [historyLoading, setHistoryLoading] = useState(true);

  // Status do backend FastAPI
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [geminiConfigured, setGeminiConfigured] = useState<boolean>(false);

  // Modal de Detalhes
  const [selectedDisease, setSelectedDisease] = useState<CropDiseaseItem | null>(null);

  // Modal da Feira de Ciências
  const [showScienceFairModal, setShowScienceFairModal] = useState(false);

  // Estado de Multisseleção e Exclusão em Massa
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deletingBulk, setDeletingBulk] = useState(false);

  // Estado dos Accordions Sanfonados por Card (cardIndex -> sectionKey -> boolean)
  const [accordionState, setAccordionState] = useState<Record<string, boolean>>({});

  // Alternador Master ("Expandir Todos" / "Recolher Todos")
  const [allExpanded, setAllExpanded] = useState<boolean>(false);

  // Carrega histórico e verifica status do backend ao montar
  useEffect(() => {
    checkBackendStatus();
    loadHistory();
  }, []);

  // Sempre que novos resultados de pesquisa chegarem, inicializa a primeira seção de cada card aberta
  useEffect(() => {
    if (currentResult && currentResult.pests) {
      const initialState: Record<string, boolean> = {};
      currentResult.pests.forEach((_, pestIdx) => {
        initialState[`${pestIdx}-desc`] = true;
        initialState[`${pestIdx}-impact`] = false;
        initialState[`${pestIdx}-control`] = false;
        initialState[`${pestIdx}-implements`] = false;
      });
      setAccordionState(initialState);
      setAllExpanded(false);
    }
  }, [currentResult]);

  const toggleAccordionSection = (key: string) => {
    setAccordionState((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleAllAccordions = () => {
    if (!currentResult) return;
    const nextState = !allExpanded;
    const updatedState: Record<string, boolean> = {};
    currentResult.pests.forEach((_, pestIdx) => {
      updatedState[`${pestIdx}-desc`] = nextState;
      updatedState[`${pestIdx}-impact`] = nextState;
      updatedState[`${pestIdx}-control`] = nextState;
      updatedState[`${pestIdx}-implements`] = nextState;
    });
    setAccordionState(updatedState);
    setAllExpanded(nextState);
  };

  const checkBackendStatus = async () => {
    try {
      const res = await fetch('/api/backend-status');
      if (res.ok) {
        const data = await res.json();
        setBackendOnline(data.online);
        if (data.data) {
          setGeminiConfigured(!!data.data.gemini_api_key_configured);
        }
      } else {
        setBackendOnline(false);
      }
    } catch {
      setBackendOnline(false);
    }
  };

  const loadHistory = async (query = '') => {
    setHistoryLoading(true);
    try {
      const url = query ? `/api/diseases?q=${encodeURIComponent(query)}` : '/api/diseases';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error('Erro ao carregar histórico:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleSearch = async (e?: React.FormEvent, presetCrop?: string, forceRefresh = false) => {
    if (e) e.preventDefault();

    const targetCrop = presetCrop || cropName;

    if (!targetCrop.trim()) {
      setError('Por favor, digite o nome da Cultura Agrícola (ex: Tomate, Milho, Soja).');
      return;
    }

    if (presetCrop) setCropName(presetCrop);

    setLoading(true);
    setError(null);
    setLoadingStep(1);

    const timer1 = setTimeout(() => setLoadingStep(2), 800);
    const timer2 = setTimeout(() => setLoadingStep(3), 1500);

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cropName: targetCrop, forceRefresh }),
      });

      clearTimeout(timer1);
      clearTimeout(timer2);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Falha no processamento da pesquisa RAG.');
      }

      const result: CropSearchResult = await res.json();
      setCurrentResult(result);
      
      // Atualiza lista do histórico
      loadHistory();
    } catch (err: any) {
      setError(err.message || 'Erro inesperado ao pesquisar.');
    } finally {
      setLoading(false);
      setLoadingStep(0);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Deseja realmente remover este registro do histórico?')) return;

    try {
      const res = await fetch(`/api/diseases?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setHistory((prev) => prev.filter((item) => item.id !== id));
        setSelectedIds((prev) => prev.filter((i) => i !== id));
        if (selectedDisease?.id === id) setSelectedDisease(null);
      }
    } catch (err) {
      console.error('Erro ao excluir:', err);
    }
  };

  const toggleSelectId = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const allValidIds = history.map((item) => item.id).filter(Boolean) as string[];
    if (selectedIds.length === allValidIds.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(allValidIds);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Deseja realmente apagar os ${selectedIds.length} registros selecionados do banco de dados?`)) return;

    setDeletingBulk(true);
    try {
      const res = await fetch('/api/diseases', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds }),
      });

      if (res.ok) {
        setHistory((prev) => prev.filter((item) => item.id && !selectedIds.includes(item.id)));
        if (selectedDisease?.id && selectedIds.includes(selectedDisease.id)) {
          setSelectedDisease(null);
        }
        setSelectedIds([]);
      } else {
        const data = await res.json();
        alert(data.error || 'Falha ao excluir registros selecionados.');
      }
    } catch (err) {
      console.error('Erro na exclusão em massa:', err);
      alert('Erro de conexão ao excluir registros.');
    } finally {
      setDeletingBulk(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06110d] text-slate-100 font-sans selection:bg-emerald-500 selection:text-black pb-16">
      
      {/* NAVEGAÇÃO / HEADER PRINCIPAL */}
      <header className="sticky top-0 z-40 bg-[#06110d]/90 backdrop-blur-md border-b border-emerald-900/50 px-4 sm:px-6 lg:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Logo & Título */}
          <div className="flex items-center space-x-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 shrink-0">
              <div className="w-full h-full bg-emerald-950 rounded-[10px] flex items-center justify-center">
                <Sprout className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                  Radar Agrícola <span className="text-emerald-400">IA</span>
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Feira de Ciências
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium hidden sm:block">
                Preservação de Lavoras • Diagnósticos Fitossanitários • Implementos & Manejo MIP
              </p>
            </div>
          </div>

          {/* Status do Backend & Botão Feira de Ciências */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={() => setShowScienceFairModal(true)}
              className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Sobre o Projeto</span>
            </button>

            {backendOnline === true ? (
              <div className="px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center space-x-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>FastAPI Online</span>
              </div>
            ) : backendOnline === false ? (
              <div className="px-3 py-1.5 rounded-lg bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-semibold flex items-center space-x-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <span>Backend Indisponível</span>
              </div>
            ) : (
              <div className="px-3 py-1.5 rounded-lg bg-slate-900 text-slate-400 text-xs font-semibold flex items-center space-x-2">
                <RefreshCw className="w-3 h-3 animate-spin text-slate-400" />
                <span>Verificando Backend...</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-8">
        
        {/* BANNER EDUCATIVO PROJETO FEIRA DE CIÊNCIAS */}
        <div className="glass-panel p-4 sm:p-6 rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-r from-emerald-950/80 via-teal-950/60 to-emerald-950/80 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Projeto de Feira de Ciências
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-bold text-white leading-snug">
                Identificação de Pragas, Manejo MIP & Equipamentos Agrícolas por Cultura
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                Relacione a planta semeada às suas principais ameaças biológicas e aos implementos científicos (tratores, pulverizadores, atomizadores) necessários para preservação da lavoura.
              </p>
            </div>

            <button
              onClick={() => setShowScienceFairModal(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/20 shrink-0 flex items-center space-x-2 cursor-pointer"
            >
              <Info className="w-4 h-4" />
              <span>Ver Detalhes do Projeto</span>
            </button>
          </div>
        </div>

        {/* HERO / CONSOLE DE PESQUISA RAG */}
        <section className="glass-panel p-5 sm:p-8 rounded-3xl border border-emerald-800/40 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Motor Híbrido Alternativa C (Base Curada + Gemini Direto {"<1.5s"})</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Pesquisar Cultura Agrícola Semeada
            </h2>
            <p className="text-xs sm:text-base text-slate-300 max-w-3xl leading-relaxed">
              Informe a cultura agrícola (ex: <strong className="text-emerald-300">Feijão, Batata, Milho, Tomate, Cacau, Café, Algodão</strong>) para obter a foto ilustrativa, pragas emblemáticas, sintomas, métodos de manejo MIP e tratores/pulverizadores recomendados.
            </p>
          </div>

          {/* FORMULÁRIO DE BUSCA */}
          <div className="space-y-4">
            <form onSubmit={handleSearch} className="space-y-4">
              
              {/* Input Cultura */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-emerald-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Sprout className="w-4.5 h-4.5 text-emerald-400" />
                  <span>Informe a Cultura Agrícola</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                    placeholder="Ex: Tomate, Milho, Soja, Café, Trigo, Batata, Algodão..."
                    className="w-full bg-emerald-950/50 border border-emerald-800/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 text-sm sm:text-base outline-none transition-all pr-10"
                  />
                  <Search className="w-5 h-5 text-emerald-400/60 absolute right-3.5 top-4 pointer-events-none" />
                </div>
              </div>

              {/* Presets Rápidos de Culturas com Fotos */}
              <div className="space-y-2 pt-1">
                <span className="text-xs text-slate-400 block font-medium">Culturas populares para busca rápida (0ms):</span>
                <div className="flex flex-wrap gap-2">
                  {CROP_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSearch(undefined, p.name)}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/40 hover:border-emerald-500/40 text-xs font-medium text-emerald-200 flex items-center space-x-1.5 transition-all cursor-pointer"
                    >
                      <span>{p.icon}</span>
                      <span>{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Botão de Enviar */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-emerald-950 font-bold text-sm sm:text-base tracking-wide shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Identificando Cultura & Pragas...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>Diagnosticar Cultura & Imagem Agronômica</span>
                  </>
                )}
              </button>
            </form>

            {/* Mensagem de Erro */}
            {error && (
              <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs sm:text-sm flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Aviso do Sistema</p>
                  <p className="mt-1 opacity-90">{error}</p>
                </div>
              </div>
            )}

            {/* Indicador de Etapas do Carregamento */}
            {loading && (
              <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-700/50 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-emerald-300">
                  <span className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span>Processando requisição para '{cropName}'...</span>
                  </span>
                  <span>Passo {loadingStep} de 3</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className={`flex items-center space-x-2 ${loadingStep >= 1 ? 'text-emerald-300' : 'text-slate-500'}`}>
                    <span className={`w-2 h-2 rounded-full ${loadingStep >= 1 ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`} />
                    <span>1. Verificando dados e imagem agronômica HD (0ms)...</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${loadingStep >= 2 ? 'text-emerald-300' : 'text-slate-500'}`}>
                    <span className={`w-2 h-2 rounded-full ${loadingStep >= 2 ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`} />
                    <span>2. Sintetizando pragas características e implementos com Gemini Direto ({"<1.5s"})...</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${loadingStep >= 3 ? 'text-emerald-300' : 'text-slate-500'}`}>
                    <span className={`w-2 h-2 rounded-full ${loadingStep >= 3 ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`} />
                    <span>3. Gravando diagnósticos no Banco de Dados local (Prisma Auto-Cache)...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* HERO CROP VISUAL BANNER & GRADE DOS RESULTADOS */}
        {currentResult && currentResult.pests.length > 0 && (
          <section className="space-y-6">
            
            {/* BANNER VISUAL EM ALTA DEFINIÇÃO DA CULTURA PESQUISADA */}
            <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-500/40 shadow-2xl h-48 sm:h-64 bg-slate-950 flex items-end p-6">
              <img
                src={currentResult.cropImageUrl || getCropImageUrl(currentResult.cropName)}
                alt={currentResult.cropName}
                className="absolute inset-0 w-full h-full object-cover opacity-60 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06110d] via-[#06110d]/50 to-transparent" />
              
              <div className="relative z-10 w-full flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500 text-emerald-950 uppercase tracking-wider shadow-md">
                      Cultura Agrícola Identificada
                    </span>
                    {currentResult.cached ? (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/30 text-cyan-200 border border-cyan-400/40 backdrop-blur-md">
                        ⚡ Banco Local (0ms)
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/30 text-amber-200 border border-amber-400/40 backdrop-blur-md">
                        ✨ Gemini IA Direto
                      </span>
                    )}
                  </div>
                  <h2 className="text-3xl sm:text-5xl font-black text-white capitalize drop-shadow-md">
                    {currentResult.cropName}
                  </h2>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleAllAccordions}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-200 border border-emerald-500/50 backdrop-blur-md flex items-center space-x-2 transition-all cursor-pointer shadow-lg"
                  >
                    {allExpanded ? (
                      <>
                        <Minimize2 className="w-4 h-4 text-emerald-400" />
                        <span>Recolher Todos</span>
                      </>
                    ) : (
                      <>
                        <Maximize2 className="w-4 h-4 text-emerald-400" />
                        <span>Expandir Todos</span>
                      </>
                    )}
                  </button>

                  {currentResult.cached && (
                    <button
                      onClick={() => handleSearch(undefined, currentResult.cropName, true)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 backdrop-blur-md flex items-center space-x-2 transition-all cursor-pointer"
                      title="Forçar Re-Varredura RAG com Gemini"
                    >
                      <RefreshCw className="w-4 h-4 text-emerald-400" />
                      <span>Recarregar via IA</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Grid dos 4 Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {currentResult.pests.map((pest, pestIdx) => {
                const descKey = `${pestIdx}-desc`;
                const impactKey = `${pestIdx}-impact`;
                const controlKey = `${pestIdx}-control`;
                const implementsKey = `${pestIdx}-implements`;

                const isDescOpen = !!accordionState[descKey];
                const isImpactOpen = !!accordionState[impactKey];
                const isControlOpen = !!accordionState[controlKey];
                const isImplementsOpen = !!accordionState[implementsKey];

                return (
                  <div 
                    key={pestIdx}
                    className="glass-panel p-4 sm:p-6 rounded-2xl border-2 border-emerald-500/30 space-y-4 shadow-2xl relative overflow-hidden flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      {/* Header do Card */}
                      <div className="flex items-start justify-between gap-3 border-b border-emerald-800/40 pb-4">
                        <div>
                          <div className="flex items-center space-x-2 mb-1.5">
                            <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center">
                              #{pestIdx + 1}
                            </span>
                            <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[11px] font-bold uppercase tracking-wider border border-emerald-800/40">
                              {currentResult.cropName}
                            </span>
                          </div>
                          <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">{pest.pestName}</h3>
                        </div>

                        {/* Link Fonte Embrapa / Gemini */}
                        {pest.sourceUrl && (
                          <a
                            href={pest.sourceUrl.startsWith('http') ? pest.sourceUrl : 'https://www.embrapa.br'}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={pest.sourceUrl}
                            className="p-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 hover:text-white transition-all shrink-0"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>

                      {/* SEÇÃO SANFONADA 1: Descrição & Agente Causador */}
                      <div className="bg-emerald-950/40 rounded-xl border border-emerald-800/30 overflow-hidden transition-all">
                        <button
                          type="button"
                          onClick={() => toggleAccordionSection(descKey)}
                          className="w-full p-3.5 flex items-center justify-between text-left font-bold text-xs sm:text-sm text-emerald-400 hover:bg-emerald-900/30 transition-colors cursor-pointer"
                        >
                          <span className="flex items-center space-x-2">
                            <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span className="uppercase tracking-wider">Descrição & Agente Causador</span>
                          </span>
                          {isDescOpen ? (
                            <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-emerald-400/70 shrink-0" />
                          )}
                        </button>

                        {isDescOpen && (
                          <div className="px-3.5 pb-4 pt-1 text-xs sm:text-sm text-slate-200 leading-relaxed border-t border-emerald-800/20 whitespace-pre-line animate-fadeIn">
                            {pest.description}
                          </div>
                        )}
                      </div>

                      {/* SEÇÃO SANFONADA 2: Sintomas & Impacto na Lavoura */}
                      <div className="bg-amber-950/30 rounded-xl border border-amber-800/30 overflow-hidden transition-all">
                        <button
                          type="button"
                          onClick={() => toggleAccordionSection(impactKey)}
                          className="w-full p-3.5 flex items-center justify-between text-left font-bold text-xs sm:text-sm text-amber-400 hover:bg-amber-900/30 transition-colors cursor-pointer"
                        >
                          <span className="flex items-center space-x-2">
                            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                            <span className="uppercase tracking-wider">Sintomas & Impacto na Lavoura</span>
                          </span>
                          {isImpactOpen ? (
                            <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-amber-400/70 shrink-0" />
                          )}
                        </button>

                        {isImpactOpen && (
                          <div className="px-3.5 pb-4 pt-1 text-xs sm:text-sm text-slate-200 leading-relaxed border-t border-amber-800/20 whitespace-pre-line animate-fadeIn">
                            {pest.impactData}
                          </div>
                        )}
                      </div>

                      {/* SEÇÃO SANFONADA 3: Manejo & Controle Recomendado */}
                      {pest.controlMethods && (
                        <div className="bg-teal-950/40 rounded-xl border border-teal-800/30 overflow-hidden transition-all">
                          <button
                            type="button"
                            onClick={() => toggleAccordionSection(controlKey)}
                            className="w-full p-3.5 flex items-center justify-between text-left font-bold text-xs sm:text-sm text-teal-300 hover:bg-teal-900/30 transition-colors cursor-pointer"
                          >
                            <span className="flex items-center space-x-2">
                              <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
                              <span className="uppercase tracking-wider">Manejo & Controle (Literatura)</span>
                            </span>
                            {isControlOpen ? (
                              <ChevronUp className="w-4 h-4 text-teal-400 shrink-0" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-teal-400/70 shrink-0" />
                            )}
                          </button>

                          {isControlOpen && (
                            <div className="px-3.5 pb-4 pt-1 text-xs sm:text-sm text-slate-200 leading-relaxed border-t border-teal-800/20 whitespace-pre-line animate-fadeIn">
                              {pest.controlMethods}
                            </div>
                          )}
                        </div>
                      )}

                      {/* SEÇÃO SANFONADA 4: Implementos & Equipamentos Agrícolas */}
                      {pest.agriculturalImplements && (
                        <div className="bg-cyan-950/40 rounded-xl border border-cyan-800/40 overflow-hidden transition-all">
                          <button
                            type="button"
                            onClick={() => toggleAccordionSection(implementsKey)}
                            className="w-full p-3.5 flex items-center justify-between text-left font-bold text-xs sm:text-sm text-cyan-300 hover:bg-cyan-900/30 transition-colors cursor-pointer"
                          >
                            <span className="flex items-center space-x-2">
                              <Wrench className="w-4 h-4 text-cyan-400 shrink-0" />
                              <span className="uppercase tracking-wider">Implementos & Equipamentos</span>
                            </span>
                            {isImplementsOpen ? (
                              <ChevronUp className="w-4 h-4 text-cyan-400 shrink-0" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-cyan-400/70 shrink-0" />
                            )}
                          </button>

                          {isImplementsOpen && (
                            <div className="px-3.5 pb-4 pt-1 text-xs sm:text-sm text-slate-200 leading-relaxed border-t border-cyan-800/20 whitespace-pre-line animate-fadeIn">
                              {pest.agriculturalImplements}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Rodapé do Card */}
                    <div className="pt-2 flex items-center justify-between text-[11px] sm:text-xs">
                      {pest.sourceUrl ? (
                        <a
                          href={pest.sourceUrl.startsWith('http') ? pest.sourceUrl : 'https://www.embrapa.br'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1.5 font-bold text-emerald-400 hover:text-emerald-300 transition-colors truncate max-w-[200px] sm:max-w-none"
                        >
                          <span className="truncate">{pest.sourceUrl}</span>
                          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        </a>
                      ) : <span />}

                      <span className="text-[11px] text-slate-500 shrink-0">Prisma DB</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* HISTÓRICO DE CONSULTAS / BANCO DE DADOS COM FOTOS DE CULTURA */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-900/40 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-emerald-400 shrink-0" />
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">Base de Conhecimento Registrada</h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Histórico de pesquisas salvas no banco relacional PostgreSQL / Prisma com fotos das culturas
              </p>
            </div>

            {/* Controles do Histórico: Multisseleção */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setIsMultiSelectMode(!isMultiSelectMode);
                  setSelectedIds([]);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                  isMultiSelectMode 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                    : 'bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-800/40 text-emerald-300'
                }`}
              >
                <ListChecks className="w-4 h-4" />
                <span>{isMultiSelectMode ? 'Cancelar Seleção' : 'Multisseleção'}</span>
              </button>

              {isMultiSelectMode && (
                <>
                  <button
                    onClick={handleSelectAll}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-900/60 hover:bg-emerald-800/60 border border-emerald-700/50 text-emerald-200 flex items-center space-x-1.5 transition-all cursor-pointer"
                  >
                    {selectedIds.length === history.length && history.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                    <span>Selecionar Todos ({history.length})</span>
                  </button>

                  <button
                    onClick={handleDeleteSelected}
                    disabled={selectedIds.length === 0 || deletingBulk}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1.5 transition-all shadow-md shadow-red-600/20 cursor-pointer"
                  >
                    {deletingBulk ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                    <span>Apagar Selecionados ({selectedIds.length})</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Campo de Filtro do Histórico */}
          <div className="relative">
            <input
              type="text"
              value={historyQuery}
              onChange={(e) => {
                setHistoryQuery(e.target.value);
                loadHistory(e.target.value);
              }}
              placeholder="Filtrar histórico por cultura ou praga..."
              className="w-full bg-emerald-950/30 border border-emerald-800/40 focus:border-emerald-400 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-xs sm:text-sm outline-none transition-all pr-10"
            />
            <Filter className="w-4 h-4 text-emerald-400/60 absolute right-3.5 top-3.5 pointer-events-none" />
          </div>

          {/* Lista do Histórico com Thumbnail Fotográfico da Cultura */}
          {historyLoading ? (
            <div className="p-8 text-center text-xs text-slate-500 flex items-center justify-center space-x-2">
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
              <span>Carregando registros do banco...</span>
            </div>
          ) : history.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 glass-panel rounded-2xl border border-emerald-900/30">
              Nenhum registro encontrado no banco de dados.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {history.map((item) => {
                const isSelected = item.id ? selectedIds.includes(item.id) : false;
                const cropImg = item.cropImageUrl || getCropImageUrl(item.cropName);

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (isMultiSelectMode && item.id) {
                        toggleSelectId(item.id);
                      } else {
                        setSelectedDisease(item);
                      }
                    }}
                    className={`glass-panel rounded-2xl border transition-all cursor-pointer flex flex-col justify-between overflow-hidden relative group ${
                      isSelected 
                        ? 'border-amber-400 bg-amber-950/20' 
                        : 'border-emerald-900/40 hover:border-emerald-500/50 hover:bg-emerald-950/40'
                    }`}
                  >
                    {/* Header com Foto de Capa da Cultura */}
                    <div className="relative h-28 w-full overflow-hidden bg-slate-900">
                      <img
                        src={cropImg}
                        alt={item.cropName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#06110d] via-transparent to-transparent" />
                      
                      {/* Checkbox de Multisseleção */}
                      {isMultiSelectMode && item.id && (
                        <div 
                          onClick={(e) => toggleSelectId(item.id!, e)}
                          className="absolute top-2.5 right-2.5 z-10 p-1 bg-black/50 backdrop-blur-md rounded-lg"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-5 h-5 text-amber-400 fill-amber-400/20" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-300" />
                          )}
                        </div>
                      )}

                      {!isMultiSelectMode && item.id && (
                        <button
                          onClick={(e) => handleDelete(item.id!, e)}
                          className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded-lg bg-black/60 text-slate-300 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
                          title="Excluir Registro"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <span className="absolute bottom-2 left-3 px-2 py-0.5 rounded bg-emerald-950/90 text-emerald-300 text-[10px] font-bold uppercase tracking-wider border border-emerald-700/50 backdrop-blur-sm">
                        {item.cropName}
                      </span>
                    </div>

                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
                          {item.pestName}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-emerald-900/30 flex items-center justify-between text-[11px] text-slate-500">
                        <span className="truncate max-w-[130px]">{item.sourceUrl}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-1 transition-transform shrink-0" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </main>

      {/* MODAL DE FICHA TÉCNICA DETALHADA COM FOTO HEADER */}
      {selectedDisease && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel rounded-3xl border-2 border-emerald-500/40 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl relative animate-fadeIn">
            
            {/* Header da Cultura no Modal */}
            <div className="relative h-40 w-full overflow-hidden bg-slate-950 flex items-end p-6">
              <img
                src={selectedDisease.cropImageUrl || getCropImageUrl(selectedDisease.cropName)}
                alt={selectedDisease.cropName}
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06110d] via-[#06110d]/40 to-transparent" />
              
              <button
                onClick={() => setSelectedDisease(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-black/60 hover:bg-black text-slate-300 hover:text-white border border-white/20 transition-all cursor-pointer z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative z-10 space-y-1">
                <span className="px-2.5 py-0.5 rounded bg-emerald-500 text-emerald-950 text-xs font-extrabold uppercase tracking-wider">
                  {selectedDisease.cropName}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-snug drop-shadow-md">
                  {selectedDisease.pestName}
                </h3>
              </div>
            </div>

            <div className="p-5 sm:p-8 space-y-6 pt-0">
              <div className="space-y-4 text-xs sm:text-sm">
                <div className="bg-emerald-950/40 p-4 rounded-xl border border-emerald-800/30 space-y-2">
                  <h4 className="font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-2">
                    <BookOpen className="w-4 h-4" />
                    <span>Descrição & Agente Causador</span>
                  </h4>
                  <p className="text-slate-200 leading-relaxed whitespace-pre-line">{selectedDisease.description}</p>
                </div>

                <div className="bg-amber-950/30 p-4 rounded-xl border border-amber-800/30 space-y-2">
                  <h4 className="font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>Sintomas & Impacto na Lavoura</span>
                  </h4>
                  <p className="text-slate-200 leading-relaxed whitespace-pre-line">{selectedDisease.impactData}</p>
                </div>

                {selectedDisease.controlMethods && (
                  <div className="bg-teal-950/40 p-4 rounded-xl border border-teal-800/30 space-y-2">
                    <h4 className="font-bold text-teal-300 uppercase tracking-wider flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-teal-400" />
                      <span>Manejo & Controle Recomendado (Literatura)</span>
                    </h4>
                    <p className="text-slate-200 leading-relaxed whitespace-pre-line">{selectedDisease.controlMethods}</p>
                  </div>
                )}

                {selectedDisease.agriculturalImplements && (
                  <div className="bg-cyan-950/40 p-4 rounded-xl border border-cyan-800/40 space-y-2">
                    <h4 className="font-bold text-cyan-300 uppercase tracking-wider flex items-center space-x-2">
                      <Wrench className="w-4 h-4 text-cyan-400" />
                      <span>Implementos & Equipamentos Agrícolas</span>
                    </h4>
                    <p className="text-slate-200 leading-relaxed whitespace-pre-line">{selectedDisease.agriculturalImplements}</p>
                  </div>
                )}
              </div>

              {/* Aviso Orientativo do Engenheiro Agrônomo */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start space-x-2.5">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Nota Técnica:</strong> Para tomadas de decisão de manejo e aplicação de defensivos no campo, consulte sempre um <strong>Engenheiro Agrônomo habilitado</strong>.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                {selectedDisease.sourceUrl && (
                  <a
                    href={selectedDisease.sourceUrl.startsWith('http') ? selectedDisease.sourceUrl : 'https://www.embrapa.br'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs sm:text-sm flex items-center space-x-2 transition-all cursor-pointer"
                  >
                    <span>Acessar Fonte Oficial</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                <button
                  onClick={() => setSelectedDisease(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-bold transition-all cursor-pointer"
                >
                  Fechar Ficha
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PROPOSTA EDUCATIVA FEIRA DE CIÊNCIAS */}
      {showScienceFairModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-5 sm:p-8 rounded-3xl border-2 border-emerald-500/50 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl relative animate-fadeIn">
            
            <button
              onClick={() => setShowScienceFairModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-slate-400 hover:text-white border border-emerald-800/40 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 border-b border-emerald-800/40 pb-4 pr-10">
              <div className="flex items-center space-x-2">
                <Award className="w-6 h-6 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Apresentação Acadêmica
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
                Projeto de Feira de Ciências: Radar Agrícola IA
              </h3>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <div className="bg-emerald-950/50 p-4 rounded-2xl border border-emerald-800/40 space-y-2">
                <h4 className="font-bold text-emerald-400 text-sm flex items-center space-x-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Resumo do Projeto</span>
                </h4>
                <p>
                  A tecnologia tem se tornado uma importante ferramenta de apoio para o desenvolvimento das atividades agrícolas, em especial, na preservação e expansão de lavouras. Nesse contexto, foi elaborado este site que visa apresentar informações detalhadas de possíveis problemas relacionados à planta semeada, objetivando o auxílio na identificação de pragas que possam afetar a cultura agrícola.
                </p>
                <p className="pt-1">
                  Inclusive, o sistema proposto faz uma apresentação dos possíveis implementos agrícolas necessários para o controle dessas pragas, de acordo com as referências científicas da Embrapa.
                </p>
              </div>

              <div className="bg-teal-950/40 p-4 rounded-2xl border border-teal-800/40 space-y-2">
                <h4 className="font-bold text-teal-300 text-sm flex items-center space-x-2">
                  <Layers className="w-4 h-4" />
                  <span>Relação Tríplice da Solução Digital</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-center">
                  <div className="p-3 bg-emerald-900/40 rounded-xl border border-emerald-700/40">
                    <span className="block font-extrabold text-emerald-300">1. Cultura</span>
                    <span className="text-[11px] text-slate-300">Planta semeada com foto visual</span>
                  </div>
                  <div className="p-3 bg-amber-900/40 rounded-xl border border-amber-700/40">
                    <span className="block font-extrabold text-amber-300">2. Praga / Doença</span>
                    <span className="text-[11px] text-slate-300">Ameaça biológica com nome científico</span>
                  </div>
                  <div className="p-3 bg-cyan-900/40 rounded-xl border border-cyan-700/40">
                    <span className="block font-extrabold text-cyan-300">3. Implementos</span>
                    <span className="text-[11px] text-slate-300">Tratores, pulverizadores e manejo MIP</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start space-x-3">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-amber-300">Supervisão Técnica Obrigatória</h5>
                  <p className="mt-1 opacity-90">
                    Para qualquer aplicação prática de defensivos agrícolas ou tomada de decisão no campo, é indispensável a orientação e a emissão de receita agronômica por um <strong>Engenheiro Agrônomo habilitado</strong>.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowScienceFairModal(false)}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                Entendi e Compreendi
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
