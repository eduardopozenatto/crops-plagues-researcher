import { useState, useEffect } from 'react';
import {
  Sprout,
  Search,
  BookOpen,
  Info,
  ShieldCheck,
  Cpu,
  Tractor,
  AlertTriangle,
  ExternalLink,
  Trash2,
  CheckSquare,
  Square,
  Sparkles,
  LayoutGrid,
  Table,
  History,
  X,
  RefreshCw,
  Zap,
  CornerDownLeft,
  Layers
} from 'lucide-react';
import { getCropMeta } from '@/lib/cropImages';

interface PestItem {
  pestName: string;
  description: string;
  impactData: string;
  controlMethods: string;
  agriculturalImplements: string;
  sourceUrl: string;
}

interface CropSearchResult {
  cropName: string;
  pests: PestItem[];
  isFromCache?: boolean;
}

interface SavedCropRecord {
  id: string;
  cropName: string;
  pestName: string;
  description: string;
  impactData: string;
  controlMethods: string;
  agriculturalImplements: string;
  sourceUrl: string;
  createdAt: string;
}

const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000').replace(/\/$/, '');

type TabKey = 'description' | 'impact' | 'control' | 'implements';

export default function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [searchResult, setSearchResult] = useState<CropSearchResult | null>(null);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [savedRecords, setSavedRecords] = useState<SavedCropRecord[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterQuery, setFilterQuery] = useState('');
  
  // Modais e Painel Drawer
  const [activeModal, setActiveModal] = useState<'about' | 'detail' | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedRecordDetail, setSelectedRecordDetail] = useState<SavedCropRecord | null>(null);

  // Modo de Exibição: 'cards' ou 'table'
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Aba ativa para cada card de praga [pestIdx -> TabKey]
  const [activeTabs, setActiveTabs] = useState<Record<number, TabKey>>({});

  useEffect(() => {
    checkBackendStatus();
    loadSavedRecordsFromStorage();
  }, []);

  const checkBackendStatus = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/status`);
      if (res.ok) {
        setBackendOnline(true);
      } else {
        setBackendOnline(false);
      }
    } catch {
      setBackendOnline(false);
    }
  };

  const loadSavedRecordsFromStorage = (): SavedCropRecord[] => {
    try {
      const stored = localStorage.getItem('radar_agricola_records');
      if (stored) {
        const parsed = JSON.parse(stored);
        setSavedRecords(parsed);
        return parsed;
      }
    } catch {
      setSavedRecords([]);
    }
    return [];
  };

  const saveRecordToStorage = (cropResult: CropSearchResult) => {
    const newItems: SavedCropRecord[] = cropResult.pests.map((p, idx) => ({
      id: `${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
      cropName: cropResult.cropName,
      pestName: p.pestName,
      description: p.description,
      impactData: p.impactData,
      controlMethods: p.controlMethods,
      agriculturalImplements: p.agriculturalImplements,
      sourceUrl: p.sourceUrl,
      createdAt: new Date().toISOString(),
    }));

    setSavedRecords((prev) => {
      const filtered = prev.filter(
        (item) => item.cropName.toLowerCase() !== cropResult.cropName.toLowerCase()
      );
      const updated = [...newItems, ...filtered];
      localStorage.setItem('radar_agricola_records', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSearch = async (searchTerm?: string, forceRefresh: boolean = false) => {
    const targetCrop = (searchTerm || query).trim();
    if (!targetCrop) return;

    // 1. CHECAGEM CACHE-FIRST NO HISTÓRICO (LOCALSTORAGE)
    if (!forceRefresh) {
      const currentHistory = savedRecords.length > 0 ? savedRecords : loadSavedRecordsFromStorage();
      const normTarget = targetCrop.toLowerCase();
      const cached = currentHistory.filter(
        (r) => r.cropName.toLowerCase() === normTarget
      );

      if (cached.length >= 1) {
        const cachedResult: CropSearchResult = {
          cropName: cached[0].cropName,
          pests: cached.map((r) => ({
            pestName: r.pestName,
            description: r.description,
            impactData: r.impactData,
            controlMethods: r.controlMethods,
            agriculturalImplements: r.agriculturalImplements,
            sourceUrl: r.sourceUrl,
          })),
          isFromCache: true,
        };

        setSearchResult(cachedResult);
        const initialTabs: Record<number, TabKey> = {};
        cachedResult.pests.forEach((_, pIdx) => {
          initialTabs[pIdx] = 'description';
        });
        setActiveTabs(initialTabs);
        return;
      }
    }

    // 2. REQUISITA O BACKEND FASTAPI / GEMINI IA
    setLoading(true);
    setSearchResult(null);
    setLoadingStep('Consultando Motor Fitossanitário Híbrido...');

    try {
      const res = await fetch(`${BACKEND_URL}/api/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cropName: targetCrop }),
      });

      if (!res.ok) {
        throw new Error('Falha ao consultar backend.');
      }

      const data: CropSearchResult = await res.json();
      data.isFromCache = false;
      setSearchResult(data);
      saveRecordToStorage(data);

      const initialTabs: Record<number, TabKey> = {};
      data.pests.forEach((_, pIdx) => {
        initialTabs[pIdx] = 'description';
      });
      setActiveTabs(initialTabs);

    } catch (err) {
      console.error(err);
      alert(`Não foi possível conectar ao motor do backend (${BACKEND_URL}). Verifique a URL do backend nas variáveis de ambiente.`);
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  const setCardTab = (pestIdx: number, tab: TabKey) => {
    setActiveTabs((prev) => ({
      ...prev,
      [pestIdx]: tab,
    }));
  };

  const toggleSelectRecord = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const filtered = getFilteredRecords();
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((r) => r.id));
    }
  };

  const deleteSelectedRecords = () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Deseja excluir ${selectedIds.length} registro(s) selecionado(s)?`)) return;

    setSavedRecords((prev) => {
      const updated = prev.filter((r) => !selectedIds.includes(r.id));
      localStorage.setItem('radar_agricola_records', JSON.stringify(updated));
      return updated;
    });
    setSelectedIds([]);
  };

  const getFilteredRecords = () => {
    if (!filterQuery.trim()) return savedRecords;
    const norm = filterQuery.toLowerCase().trim();
    return savedRecords.filter(
      (r) =>
        r.cropName.toLowerCase().includes(norm) ||
        r.pestName.toLowerCase().includes(norm)
    );
  };

  const popularCrops = [
    { name: 'Feijão', icon: '🫘' },
    { name: 'Tomate', icon: '🍅' },
    { name: 'Milho', icon: '🌽' },
    { name: 'Soja', icon: '🌱' },
    { name: 'Café', icon: '☕' },
    { name: 'Trigo', icon: '🌾' },
    { name: 'Batata', icon: '🥔' },
    { name: 'Cacau', icon: '🍫' },
    { name: 'Algodão', icon: '☁️' },
  ];

  return (
    <div className="min-h-screen bg-[#090d0b] text-slate-100 font-sans selection:bg-emerald-500 selection:text-black">
      {/* Glow Fundo sutil */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_-10%,rgba(16,185,129,0.14),rgba(0,0,0,0))] pointer-events-none z-0" />

      {/* Header Minimalista Slim (100% Responsivo) */}
      <header className="sticky top-0 z-40 w-full border-b border-emerald-950/80 bg-[#090d0b]/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-700 flex items-center justify-center shadow-md shadow-emerald-950/50 flex-shrink-0">
              <Sprout className="h-4 sm:h-5 w-4 sm:w-5 text-black stroke-[2.5]" />
            </div>
            <div className="truncate">
              <h1 className="text-xs sm:text-sm font-bold tracking-tight text-white flex items-center gap-1.5 truncate">
                <span>Radar Agrícola IA</span>
                <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                  v2.5.0
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="inline-flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 text-xs font-medium text-slate-300 transition-colors"
            >
              <History className="h-3.5 w-3.5 text-emerald-400" />
              <span>Histórico ({savedRecords.length})</span>
            </button>

            <button
              onClick={() => setActiveModal('about')}
              className="inline-flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 text-xs font-medium text-slate-300 transition-colors"
            >
              <Info className="h-3.5 w-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Sobre</span>
            </button>

            <div className="hidden xs:inline-flex items-center space-x-1.5 px-2 py-1 rounded-lg bg-emerald-950/30 border border-emerald-800/30 text-[11px] text-emerald-400 font-medium">
              <span className={`h-2 w-2 rounded-full ${backendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="hidden md:inline">{backendOnline ? 'FastAPI Online' : 'Modo Offline'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal Minimalista */}
      <main className="max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-8 relative z-10 space-y-6 sm:space-y-8">
        
        {/* HERO SEARCH AREA (Centro Focal de Busca Estilo Motor IA) */}
        <section className="text-center max-w-2xl mx-auto space-y-3 sm:space-y-4 pt-2 sm:pt-4">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] sm:text-xs font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Pesquisa Fitossanitária Inteligente (Embrapa & Gemini IA)</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Diagnóstico Agronômico Instantâneo
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed px-2">
            Pesquise a lavoura semeada para visualizar pragas características, sintomas, manejo MIP e equipamentos recomendados.
          </p>

          {/* Form de Busca Responsivo */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex flex-col sm:flex-row gap-2 pt-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Qual cultura deseja pesquisar? (ex: Feijão, Tomate, Cacau)..."
                className="w-full pl-10 pr-12 sm:pr-16 py-3.5 bg-slate-950/90 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/80 focus:border-transparent transition-all shadow-inner"
              />
              <span className="hidden sm:inline-flex absolute right-3 top-3 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-500 font-mono items-center gap-0.5">
                <span>Enter</span>
                <CornerDownLeft className="h-2.5 w-2.5" />
              </span>
            </div>

            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="w-full sm:w-auto px-6 py-3.5 min-h-[44px] bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-emerald-950/60 flex items-center justify-center space-x-2 flex-shrink-0 cursor-pointer"
            >
              {loading ? (
                <span className="animate-spin font-bold">⏳</span>
              ) : (
                <Search className="h-4 w-4 stroke-[2.5]" />
              )}
              <span>Diagnosticar</span>
            </button>
          </form>

          {/* Chips de Culturas Populares em Grade Responsiva */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
            <span className="text-[11px] text-slate-500 font-medium mr-1">Atalhos rápidos:</span>
            {popularCrops.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => {
                  setQuery(c.name);
                  handleSearch(c.name);
                }}
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-900/70 hover:bg-emerald-950/70 border border-slate-800/80 hover:border-emerald-700/50 text-[11px] sm:text-xs font-medium text-slate-300 hover:text-emerald-300 transition-colors"
              >
                <span>{c.icon}</span>
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Indicator de Loading */}
        {loading && (
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-emerald-500/30 text-center space-y-3 max-w-md mx-auto animate-pulse">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Sprout className="h-6 w-6 animate-spin" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-white">Processando Diagnóstico Agronômico...</h3>
            <p className="text-xs text-emerald-400 font-medium">{loadingStep}</p>
          </div>
        )}

        {/* PAINEL DE RESULTADOS (HERO CARD TECNOLÓGICO + MODOS DE VISÃO) */}
        {searchResult && !loading && (
          <section className="space-y-4 sm:space-y-6 animate-fadeIn">
            
            {/* HERO CARD TECNOLÓGICO MINIMALISTA (Substitui o banner fotográfico) */}
            <div className="relative rounded-2xl border border-emerald-900/40 bg-gradient-to-b from-[#0e1612] to-[#090d0b] p-5 sm:p-6 shadow-xl space-y-4">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center space-x-3.5">
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-2xl sm:text-3xl shadow-inner flex-shrink-0">
                    {getCropMeta(searchResult.cropName).icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {getCropMeta(searchResult.cropName).category}
                      </span>
                      {searchResult.isFromCache ? (
                        <span className="inline-flex items-center space-x-1 text-[10px] font-medium text-emerald-400/90">
                          <Zap className="h-2.5 w-2.5 fill-emerald-400" />
                          <span>Base Embrapa (0ms)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-[10px] font-medium text-teal-300">
                          <Sparkles className="h-2.5 w-2.5 text-teal-300" />
                          <span>Síntese Gemini IA</span>
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white capitalize tracking-tight mt-0.5">
                      {searchResult.cropName}
                    </h3>
                  </div>
                </div>

                {/* Controles de Ação (Alternador de Modo + Atualizar IA) */}
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                  <button
                    type="button"
                    onClick={() => handleSearch(searchResult.cropName, true)}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-emerald-300 transition-all shadow-sm cursor-pointer"
                  >
                    <RefreshCw className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Reanalisar via IA</span>
                  </button>

                  <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800">
                    <button
                      onClick={() => setViewMode('cards')}
                      className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        viewMode === 'cards'
                          ? 'bg-emerald-500 text-black shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <LayoutGrid className="h-3.5 w-3.5" />
                      <span>Cards</span>
                    </button>

                    <button
                      onClick={() => setViewMode('table')}
                      className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        viewMode === 'table'
                          ? 'bg-emerald-500 text-black shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Table className="h-3.5 w-3.5" />
                      <span>Tabela</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Badges de Resumo Agronômico */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-800/80 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-center space-x-2.5">
                  <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-semibold">Diagnóstico</span>
                    <span className="font-medium text-slate-200">{searchResult.pests.length} Ameaças Críticas Mapeadas</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-center space-x-2.5">
                  <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-semibold">Controle</span>
                    <span className="font-medium text-slate-200">Manejo Integrado & Bioinsumos</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-center space-x-2.5">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                    <Tractor className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-semibold">Mecanização</span>
                    <span className="font-medium text-slate-200">Tratores, Bicos & Pulverizadores</span>
                  </div>
                </div>
              </div>

            </div>

            {/* MODALIDADE 1: CARDS MINIMALISTAS COM ABAS */}
            {viewMode === 'cards' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {searchResult.pests.map((pest, pIdx) => {
                  const currentTab = activeTabs[pIdx] || 'description';

                  return (
                    <article
                      key={pIdx}
                      className="glass-panel rounded-2xl border border-emerald-950/80 p-4 sm:p-5 space-y-3 hover:border-emerald-800/60 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        {/* Header do Card */}
                        <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-2">
                          <div className="space-y-0.5">
                            <span className="text-[9px] sm:text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              Praga #{pIdx + 1}
                            </span>
                            <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
                              {pest.pestName}
                            </h4>
                          </div>
                        </div>

                        {/* Abas Navegáveis no Topo do Card */}
                        <div className="flex rounded-xl bg-slate-950/80 p-1 border border-slate-800 text-[10px] sm:text-[11px] font-medium gap-0.5 sm:gap-1">
                          <button
                            type="button"
                            onClick={() => setCardTab(pIdx, 'description')}
                            className={`flex-1 py-1.5 px-1 sm:px-2 rounded-lg transition-all text-center flex items-center justify-center space-x-1 truncate cursor-pointer ${
                              currentTab === 'description'
                                ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <Info className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">Descrição</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setCardTab(pIdx, 'impact')}
                            className={`flex-1 py-1.5 px-1 sm:px-2 rounded-lg transition-all text-center flex items-center justify-center space-x-1 truncate cursor-pointer ${
                              currentTab === 'impact'
                                ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <AlertTriangle className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">Sintomas</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setCardTab(pIdx, 'control')}
                            className={`flex-1 py-1.5 px-1 sm:px-2 rounded-lg transition-all text-center flex items-center justify-center space-x-1 truncate cursor-pointer ${
                              currentTab === 'control'
                                ? 'bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <ShieldCheck className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">MIP</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setCardTab(pIdx, 'implements')}
                            className={`flex-1 py-1.5 px-1 sm:px-2 rounded-lg transition-all text-center flex items-center justify-center space-x-1 truncate cursor-pointer ${
                              currentTab === 'implements'
                                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <Tractor className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">Tratores</span>
                          </button>
                        </div>

                        {/* Conteúdo da Aba Selecionada */}
                        <div className="p-3 sm:p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 min-h-[100px] sm:min-h-[110px] text-xs text-slate-300 leading-relaxed animate-fadeIn">
                          {currentTab === 'description' && (
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">1. Descrição & Agente Causador:</span>
                              <p>{pest.description}</p>
                            </div>
                          )}

                          {currentTab === 'impact' && (
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">2. Sintomas & Prejuízos na Lavoura:</span>
                              <p>{pest.impactData}</p>
                            </div>
                          )}

                          {currentTab === 'control' && (
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-teal-300 uppercase tracking-wider block">3. Manejo Integrado de Pragas (MIP):</span>
                              <p>{pest.controlMethods}</p>
                            </div>
                          )}

                          {currentTab === 'implements' && (
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">4. Implementos & Equipamentos Agrícolas:</span>
                              <p>{pest.agriculturalImplements}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Rodapé do Card */}
                      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500">
                        <span className="truncate max-w-[180px] sm:max-w-[200px]">Fonte: {pest.sourceUrl}</span>
                        <a
                          href={pest.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                        >
                          <span>Fonte</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* MODALIDADE 2: TABELA COMPARATIVA PANORÂMICA */}
            {viewMode === 'table' && (
              <div className="glass-panel rounded-2xl border border-emerald-950/80 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[600px]">
                    <thead className="bg-slate-950 border-b border-slate-800 text-slate-300 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-3.5 w-1/4">Ameaça & Patógeno</th>
                        <th className="p-3.5 w-1/4">Sintomas & Danos</th>
                        <th className="p-3.5 w-1/4">Manejo MIP Recomendado</th>
                        <th className="p-3.5 w-1/4">Implementos Agrícolas</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300 leading-relaxed">
                      {searchResult.pests.map((pest, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                          <td className="p-3.5 font-semibold text-white space-y-1 align-top">
                            <span className="text-[10px] text-emerald-400 uppercase tracking-wider block font-bold">#{idx + 1}</span>
                            <span>{pest.pestName}</span>
                          </td>
                          <td className="p-3.5 text-slate-300 align-top">{pest.impactData}</td>
                          <td className="p-3.5 text-slate-300 align-top">{pest.controlMethods}</td>
                          <td className="p-3.5 text-slate-300 align-top">{pest.agriculturalImplements}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </section>
        )}

      </main>

      {/* PAINEL RETRÁTIL SLIDE-OVER (DRAWER DE HISTÓRICO - COM ÍCONES BOTÂNICOS ELEGANTES) */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
          <div
            onClick={() => setIsDrawerOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
          />

          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-10">
            <div className="pointer-events-auto w-screen max-w-md bg-[#090d0b] border-l border-emerald-900/40 shadow-2xl flex flex-col justify-between">
              
              {/* Header do Drawer */}
              <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-emerald-400" />
                  <h3 className="text-sm sm:text-base font-bold text-white">Histórico de Pesquisas</h3>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Corpo do Drawer */}
              <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
                
                {/* Controles de Multisseleção */}
                {savedRecords.length > 0 && (
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <button
                      type="button"
                      onClick={toggleSelectAll}
                      className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 font-medium transition-colors cursor-pointer"
                    >
                      {selectedIds.length === getFilteredRecords().length ? (
                        <CheckSquare className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Square className="h-3.5 w-3.5 text-slate-400" />
                      )}
                      <span>Todos ({getFilteredRecords().length})</span>
                    </button>

                    {selectedIds.length > 0 && (
                      <button
                        type="button"
                        onClick={deleteSelectedRecords}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-xs text-rose-300 font-semibold transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Excluir ({selectedIds.length})</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Filtro do Histórico */}
                {savedRecords.length > 0 && (
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                    <input
                      type="text"
                      value={filterQuery}
                      onChange={(e) => setFilterQuery(e.target.value)}
                      placeholder="Filtrar por cultura ou praga..."
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                )}

                {/* Lista de Cards do Histórico */}
                {getFilteredRecords().length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-xs space-y-1">
                    <p>Nenhum registro encontrado.</p>
                    <p className="text-[11px]">Realize buscas no painel para guardar diagnósticos.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {getFilteredRecords().map((record) => {
                      const isSelected = selectedIds.includes(record.id);
                      const cropMeta = getCropMeta(record.cropName);
                      return (
                        <div
                          key={record.id}
                          className={`p-3.5 rounded-xl border transition-all text-xs space-y-2 relative ${
                            isSelected
                              ? 'border-emerald-500 bg-emerald-950/20'
                              : 'border-slate-800/80 bg-slate-950/50 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center space-x-2.5 overflow-hidden">
                              <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-lg flex-shrink-0">
                                {cropMeta.icon}
                              </div>
                              <div className="truncate">
                                <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider block">
                                  {record.cropName} • {cropMeta.category}
                                </span>
                                <h5 className="text-xs font-bold text-white truncate">{record.pestName}</h5>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => toggleSelectRecord(record.id)}
                              className="text-slate-400 hover:text-white p-1 cursor-pointer"
                            >
                              {isSelected ? (
                                <CheckSquare className="h-4 w-4 text-emerald-400" />
                              ) : (
                                <Square className="h-4 w-4 text-slate-600" />
                              )}
                            </button>
                          </div>

                          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedRecordDetail(record);
                                setActiveModal('detail');
                              }}
                              className="text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
                            >
                              Ver Ficha Técnica
                            </button>
                            <span className="text-slate-500 text-[10px]">
                              {new Date(record.createdAt).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Rodapé do Drawer */}
              <div className="p-4 border-t border-slate-800 text-center text-[11px] text-slate-500">
                Registros armazenados localmente no navegador.
              </div>

            </div>
          </div>
        </div>
      )}

      {/* MODAL: SOBRE O PROJETO */}
      {activeModal === 'about' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="glass-panel border border-emerald-800/40 rounded-2xl max-w-2xl w-full p-5 sm:p-8 space-y-5 sm:space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 sm:pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <BookOpen className="h-5 sm:h-6 w-5 sm:w-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">Radar Agrícola IA</h3>
                  <p className="text-[11px] sm:text-xs text-slate-400">Projeto de Feira de Ciências & Engenharia Fitossanitária</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>
                O <strong className="text-emerald-400">Radar Agrícola IA</strong> é um portal web interativo desenvolvido especificamente para apresentação em feiras de ciências e feiras agrícolas, relacionando plantas semeadas às suas ameaças biológicas mais características.
              </p>

              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/40 space-y-2">
                <h4 className="font-bold text-emerald-300 flex items-center gap-2 text-xs sm:text-sm">
                  <Cpu className="h-4 w-4" />
                  Arquitetura Híbrida Alternativa C
                </h4>
                <p className="text-xs text-slate-300">
                  Combina uma base de conhecimento curada da Embrapa cobrindo 50+ culturas agrícolas brasileiras (respostas em 0ms) com a inteligência artificial generativa do Google Gemini (direta, sem raspagem de web ruidosa).
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-white text-xs sm:text-sm">Escopo de Conteúdo Agronômico:</h4>
                <ul className="list-disc pl-5 space-y-1 text-slate-400 text-xs">
                  <li>Identificação precisa do patógeno/inseto vetor com nome popular e científico.</li>
                  <li>Sintomas e prejuízos quantitativos estimados em % na lavoura.</li>
                  <li>Métodos de Manejo Integrado de Pragas (MIP), bioinsumos e vazio sanitário.</li>
                  <li>Implementos, tratores, pulverizadores de barras e bicos de pulverização recomendados.</li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/30 text-amber-300 text-xs flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Aviso Técnico:</strong> Este sistema possui caráter educativo e de apresentação científica. A aplicação de defensivos em lavouras comerciais deve seguir a orientação de um Engenheiro Agrônomo responsável com emissão de Receituário Agronômico.
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DETALHES DA FICHA TÉCNICA (HEADER TECNOLÓGICO LIMPO) */}
      {activeModal === 'detail' && selectedRecordDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="glass-panel border border-emerald-800/40 rounded-2xl max-w-2xl w-full p-5 sm:p-8 space-y-5 sm:space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            {/* Header da Ficha Técnica */}
            <div className="rounded-xl p-4 bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-800/40 flex items-center space-x-3.5 mb-2 sm:mb-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-2xl flex-shrink-0">
                {getCropMeta(selectedRecordDetail.cropName).icon}
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                  {selectedRecordDetail.cropName} • {getCropMeta(selectedRecordDetail.cropName).category}
                </span>
                <h4 className="text-base sm:text-lg font-bold text-white">{selectedRecordDetail.pestName}</h4>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
              <div>
                <h5 className="font-bold text-emerald-400 mb-1">1. Descrição & Biologia:</h5>
                <p className="text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  {selectedRecordDetail.description}
                </p>
              </div>

              <div>
                <h5 className="font-bold text-rose-400 mb-1">2. Sintomas & Prejuízos:</h5>
                <p className="text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  {selectedRecordDetail.impactData}
                </p>
              </div>

              <div>
                <h5 className="font-bold text-teal-300 mb-1">3. Manejo Integrado (MIP):</h5>
                <p className="text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  {selectedRecordDetail.controlMethods}
                </p>
              </div>

              <div>
                <h5 className="font-bold text-amber-300 mb-1">4. Implementos Agrícolas:</h5>
                <p className="text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  {selectedRecordDetail.agriculturalImplements}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-500 truncate max-w-[200px]">Fonte: {selectedRecordDetail.sourceUrl}</span>
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
              >
                Fechar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
