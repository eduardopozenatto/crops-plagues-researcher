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
  CornerDownLeft
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
    setLoadingStep('Analisando cultura e compilando dados agronômicos...');

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
      alert(`Não foi possível conectar ao motor do backend (${BACKEND_URL}). Verifique a conexão com o servidor.`);
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
    <div className="min-h-screen bg-[#0b0f0d] text-slate-200 font-sans selection:bg-[#2d6a4f] selection:text-white">
      
      {/* Header Minimalista & Flat-Neumórfico */}
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-[#0b0f0d]/85 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="h-7 w-7 rounded-lg bg-[#18241e] border border-white/[0.08] flex items-center justify-center shadow-sm flex-shrink-0">
              <Sprout className="h-4 w-4 text-[#52b788]" />
            </div>
            <div className="truncate">
              <h1 className="text-sm font-medium tracking-tight text-slate-100 flex items-center gap-2">
                <span>Identificador Agrícola de Pragas</span>
                <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-[#16201b] text-slate-400 border border-white/[0.06]">
                  v3.0 Minimalist
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#131b17] hover:bg-[#19241f] border border-white/[0.06] text-xs font-normal text-slate-300 transition-colors cursor-pointer"
            >
              <History className="h-3.5 w-3.5 text-[#52b788]" />
              <span>Histórico ({savedRecords.length})</span>
            </button>

            <button
              onClick={() => setActiveModal('about')}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#131b17] hover:bg-[#19241f] border border-white/[0.06] text-xs font-normal text-slate-300 transition-colors cursor-pointer"
            >
              <Info className="h-3.5 w-3.5 text-slate-400" />
              <span className="hidden sm:inline">Sobre</span>
            </button>

            <div className="hidden xs:inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#101713] border border-white/[0.04] text-[11px] text-slate-400">
              <span className={`h-1.5 w-1.5 rounded-full ${backendOnline ? 'bg-[#52b788]' : 'bg-amber-400'}`} />
              <span className="hidden md:inline">{backendOnline ? 'Online' : 'Offline'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal com Conforto Editorial */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 sm:space-y-10">
        
        {/* HERO SEARCH AREA (Buscador Minimalista de Alta Precisão) */}
        <section className="text-center max-w-2xl mx-auto space-y-4 pt-2 sm:pt-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#141d18] border border-white/[0.06] text-slate-300 text-xs font-normal">
            <span className="h-1.5 w-1.5 rounded-full bg-[#52b788]" />
            <span>Diagnóstico Fitossanitário & Manejo de Lavouras</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-semibold text-slate-100 tracking-tight leading-tight">
            Identifique pragas e doenças na sua plantação
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed max-w-lg mx-auto">
            Informe a cultura agrícola semeada para obter catálogo técnico de patógenos, sintomas específicos, protocolos MIP e equipamentos indicados.
          </p>

          {/* Form de Busca Neumórfico Rebaixado */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex flex-col sm:flex-row gap-2.5 pt-2 max-w-xl mx-auto"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Qual cultura deseja pesquisar? (ex: Feijão, Tomate, Soja)..."
                className="w-full pl-10 pr-12 sm:pr-16 py-3.5 neumorphic-inset rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-[#52b788]/60 transition-colors"
              />
              <span className="hidden sm:inline-flex absolute right-3 top-3 px-1.5 py-0.5 rounded bg-[#131b17] border border-white/[0.06] text-[10px] text-slate-400 font-mono items-center gap-0.5">
                <span>Enter</span>
                <CornerDownLeft className="h-2.5 w-2.5 text-slate-500" />
              </span>
            </div>

            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="w-full sm:w-auto px-6 py-3.5 min-h-[44px] bg-[#2d6a4f] hover:bg-[#387c5d] disabled:opacity-40 disabled:hover:bg-[#2d6a4f] text-white font-medium text-sm rounded-xl transition-all duration-150 active:scale-[0.985] shadow-sm flex items-center justify-center space-x-2 flex-shrink-0 cursor-pointer"
            >
              {loading ? (
                <span className="animate-spin text-sm">⏳</span>
              ) : (
                <Search className="h-4 w-4 stroke-[2.2]" />
              )}
              <span>Diagnosticar</span>
            </button>
          </form>

          {/* Chips de Atalho Rápido */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
            <span className="text-xs text-slate-500 font-normal mr-1">Exemplos:</span>
            {popularCrops.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => {
                  setQuery(c.name);
                  handleSearch(c.name);
                }}
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg neumorphic-pill text-xs text-slate-300 font-normal cursor-pointer"
              >
                <span className="text-xs">{c.icon}</span>
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Indicador de Carregamento Suave */}
        {loading && (
          <div className="neumorphic-panel p-8 rounded-2xl max-w-md mx-auto text-center space-y-3 animate-smoothFade">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-[#18241e] text-[#52b788]">
              <Sprout className="h-6 w-6 animate-spin" />
            </div>
            <h3 className="text-sm font-medium text-slate-200">Processando Análise Fitossanitária...</h3>
            <p className="text-xs text-slate-400 font-normal">{loadingStep}</p>
          </div>
        )}

        {/* PAINEL DE RESULTADOS (HERO CARD + ABAS COM ESPAÇAMENTO EDITORIAL) */}
        {searchResult && !loading && (
          <section className="space-y-6 animate-smoothFade">
            
            {/* HERO OVERVIEW CARD */}
            <div className="neumorphic-panel rounded-2xl p-6 sm:p-7 space-y-5">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-[#18241e] border border-white/[0.08] flex items-center justify-center text-2xl sm:text-3xl shadow-sm flex-shrink-0">
                    {getCropMeta(searchResult.cropName).icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-normal px-2.5 py-0.5 rounded-full bg-[#151f1a] text-slate-300 border border-white/[0.06]">
                        {getCropMeta(searchResult.cropName).category}
                      </span>
                      {searchResult.isFromCache ? (
                        <span className="inline-flex items-center space-x-1 text-[11px] text-[#52b788]">
                          <Zap className="h-3 w-3 fill-[#52b788]" />
                          <span>Base Embrapa (0ms)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-[11px] text-teal-400">
                          <Sparkles className="h-3 w-3" />
                          <span>Síntese Gemini IA</span>
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mt-1">
                      {searchResult.cropName}
                    </h3>
                  </div>
                </div>

                {/* Alternador de Visualização & Ação */}
                <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
                  <button
                    type="button"
                    onClick={() => handleSearch(searchResult.cropName, true)}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#16201b] hover:bg-[#1c2923] border border-white/[0.06] text-xs font-normal text-slate-300 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="h-3.5 w-3.5 text-[#52b788]" />
                    <span>Reanalisar</span>
                  </button>

                  <div className="inline-flex rounded-xl neumorphic-inset p-1">
                    <button
                      onClick={() => setViewMode('cards')}
                      className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        viewMode === 'cards'
                          ? 'bg-[#1e2a23] text-white shadow-sm border border-white/[0.08]'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <LayoutGrid className="h-3.5 w-3.5" />
                      <span>Cards</span>
                    </button>

                    <button
                      onClick={() => setViewMode('table')}
                      className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        viewMode === 'table'
                          ? 'bg-[#1e2a23] text-white shadow-sm border border-white/[0.08]'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Table className="h-3.5 w-3.5" />
                      <span>Tabela</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 3 Cartões de Síntese Fitossanitária */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/[0.06]">
                <div className="p-3.5 rounded-xl bg-[#0e1411] border border-white/[0.04] flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-[#18241e] text-slate-300">
                    <AlertTriangle className="h-4 w-4 text-rose-400" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase tracking-wide font-medium">Diagnóstico</span>
                    <span className="text-xs font-medium text-slate-200">{searchResult.pests.length} Ameaças Mapeadas</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0e1411] border border-white/[0.04] flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-[#18241e] text-slate-300">
                    <ShieldCheck className="h-4 w-4 text-[#52b788]" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase tracking-wide font-medium">Manejo</span>
                    <span className="text-xs font-medium text-slate-200">Protocolos MIP & Bioinsumos</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0e1411] border border-white/[0.04] flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-[#18241e] text-slate-300">
                    <Tractor className="h-4 w-4 text-amber-400/90" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase tracking-wide font-medium">Equipamentos</span>
                    <span className="text-xs font-medium text-slate-200">Pulverizadores & Tratores</span>
                  </div>
                </div>
              </div>

            </div>

            {/* MODALIDADE 1: CARDS COM ABAS & LEITURA ESPAÇADA */}
            {viewMode === 'cards' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {searchResult.pests.map((pest, pIdx) => {
                  const currentTab = activeTabs[pIdx] || 'description';

                  return (
                    <article
                      key={pIdx}
                      className="neumorphic-card rounded-2xl p-5 sm:p-6 space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        {/* Header do Card */}
                        <div className="border-b border-white/[0.06] pb-3 space-y-1">
                          <span className="text-[10px] font-normal tracking-wider uppercase px-2 py-0.5 rounded bg-[#131b17] text-slate-400 border border-white/[0.05]">
                            Ameaça #{pIdx + 1}
                          </span>
                          <h4 className="text-base font-medium text-white leading-snug">
                            {pest.pestName}
                          </h4>
                        </div>

                        {/* Trilho de Abas Escovado */}
                        <div className="flex rounded-xl neumorphic-inset p-1 text-xs gap-1">
                          <button
                            type="button"
                            onClick={() => setCardTab(pIdx, 'description')}
                            className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center flex items-center justify-center space-x-1 truncate cursor-pointer ${
                              currentTab === 'description'
                                ? 'bg-[#1d2721] text-slate-100 font-medium border border-white/[0.08] shadow-sm'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <Info className="h-3 w-3 flex-shrink-0 text-slate-400" />
                            <span className="truncate">Descrição</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setCardTab(pIdx, 'impact')}
                            className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center flex items-center justify-center space-x-1 truncate cursor-pointer ${
                              currentTab === 'impact'
                                ? 'bg-[#1d2721] text-slate-100 font-medium border border-white/[0.08] shadow-sm'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <AlertTriangle className="h-3 w-3 flex-shrink-0 text-rose-400" />
                            <span className="truncate">Sintomas</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setCardTab(pIdx, 'control')}
                            className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center flex items-center justify-center space-x-1 truncate cursor-pointer ${
                              currentTab === 'control'
                                ? 'bg-[#1d2721] text-slate-100 font-medium border border-white/[0.08] shadow-sm'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <ShieldCheck className="h-3 w-3 flex-shrink-0 text-[#52b788]" />
                            <span className="truncate">Manejo</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setCardTab(pIdx, 'implements')}
                            className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center flex items-center justify-center space-x-1 truncate cursor-pointer ${
                              currentTab === 'implements'
                                ? 'bg-[#1d2721] text-slate-100 font-medium border border-white/[0.08] shadow-sm'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <Tractor className="h-3 w-3 flex-shrink-0 text-amber-400/90" />
                            <span className="truncate">Tratores</span>
                          </button>
                        </div>

                        {/* Conteúdo da Aba com Conforto Editorial */}
                        <div className="p-4 sm:p-5 rounded-xl bg-[#0e1411] border border-white/[0.04] min-h-[120px] text-sm text-slate-300 leading-relaxed sm:leading-7 animate-smoothFade">
                          {currentTab === 'description' && (
                            <div className="space-y-1.5">
                              <span className="text-[11px] font-medium text-[#52b788] uppercase tracking-wider block">1. Diagnóstico & Agente Causador:</span>
                              <p>{pest.description}</p>
                            </div>
                          )}

                          {currentTab === 'impact' && (
                            <div className="space-y-1.5">
                              <span className="text-[11px] font-medium text-rose-400 uppercase tracking-wider block">2. Sintomas & Danos Econômicos:</span>
                              <p>{pest.impactData}</p>
                            </div>
                          )}

                          {currentTab === 'control' && (
                            <div className="space-y-1.5">
                              <span className="text-[11px] font-medium text-[#52b788] uppercase tracking-wider block">3. Manejo Integrado de Pragas (MIP):</span>
                              <p>{pest.controlMethods}</p>
                            </div>
                          )}

                          {currentTab === 'implements' && (
                            <div className="space-y-1.5">
                              <span className="text-[11px] font-medium text-amber-300/90 uppercase tracking-wider block">4. Mecanização & Implementos Recomendados:</span>
                              <p>{pest.agriculturalImplements}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Rodapé do Card */}
                      <div className="pt-3 border-t border-white/[0.05] flex items-center justify-between text-xs text-slate-500">
                        <span className="truncate max-w-[200px]">Fonte: {pest.sourceUrl}</span>
                        <a
                          href={pest.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-[#52b788] hover:text-[#74c69d] font-normal transition-colors"
                        >
                          <span>Acessar fonte</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* MODALIDADE 2: TABELA COMPARATIVA */}
            {viewMode === 'table' && (
              <div className="neumorphic-panel rounded-2xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[650px]">
                    <thead className="bg-[#0e1411] border-b border-white/[0.06] text-slate-300 font-medium uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-4 w-1/4">Ameaça & Patógeno</th>
                        <th className="p-4 w-1/4">Sintomas & Danos</th>
                        <th className="p-4 w-1/4">Manejo MIP Recomendado</th>
                        <th className="p-4 w-1/4">Implementos Agrícolas</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05] text-slate-300 leading-relaxed">
                      {searchResult.pests.map((pest, idx) => (
                        <tr key={idx} className="hover:bg-[#17211b] transition-colors">
                          <td className="p-4 font-medium text-white space-y-1 align-top">
                            <span className="text-[10px] text-[#52b788] uppercase tracking-wider block">#{idx + 1}</span>
                            <span>{pest.pestName}</span>
                          </td>
                          <td className="p-4 text-slate-300 align-top leading-6">{pest.impactData}</td>
                          <td className="p-4 text-slate-300 align-top leading-6">{pest.controlMethods}</td>
                          <td className="p-4 text-slate-300 align-top leading-6">{pest.agriculturalImplements}</td>
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

      {/* PAINEL RETRÁTIL SLIDE-OVER (DRAWER DE HISTÓRICO) */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden animate-smoothFade">
          <div
            onClick={() => setIsDrawerOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
          />

          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-10">
            <div className="pointer-events-auto w-screen max-w-md bg-[#0e1411] border-l border-white/[0.08] shadow-2xl flex flex-col justify-between">
              
              {/* Header do Drawer */}
              <div className="p-4 sm:p-5 border-b border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <BookOpen className="h-4 w-4 text-[#52b788]" />
                  <h3 className="text-sm font-medium text-white">Histórico de Diagnósticos</h3>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a251f] transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Corpo do Drawer */}
              <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
                
                {/* Controles de Seleção */}
                {savedRecords.length > 0 && (
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                    <button
                      type="button"
                      onClick={toggleSelectAll}
                      className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#141e19] hover:bg-[#1a251f] border border-white/[0.06] text-xs text-slate-300 font-normal transition-colors cursor-pointer"
                    >
                      {selectedIds.length === getFilteredRecords().length ? (
                        <CheckSquare className="h-3.5 w-3.5 text-[#52b788]" />
                      ) : (
                        <Square className="h-3.5 w-3.5 text-slate-400" />
                      )}
                      <span>Selecionar Todos ({getFilteredRecords().length})</span>
                    </button>

                    {selectedIds.length > 0 && (
                      <button
                        type="button"
                        onClick={deleteSelectedRecords}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/25 text-xs text-rose-300 font-normal transition-colors cursor-pointer"
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
                      placeholder="Filtrar histórico..."
                      className="w-full pl-8 pr-3 py-1.5 neumorphic-inset rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#52b788]"
                    />
                  </div>
                )}

                {/* Lista de Cards do Histórico */}
                {getFilteredRecords().length === 0 ? (
                  <div className="text-center py-10 text-slate-500 text-xs space-y-1">
                    <p>Nenhum registro armazenado.</p>
                    <p className="text-[11px] text-slate-600">Pesquise culturas no painel para guardar diagnósticos.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {getFilteredRecords().map((record) => {
                      const isSelected = selectedIds.includes(record.id);
                      const cropMeta = getCropMeta(record.cropName);
                      return (
                        <div
                          key={record.id}
                          className={`p-3.5 rounded-xl border transition-all text-xs space-y-2 ${
                            isSelected
                              ? 'border-[#52b788]/60 bg-[#16221c]'
                              : 'border-white/[0.06] bg-[#121a16] hover:bg-[#16201b]'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center space-x-2.5 overflow-hidden">
                              <div className="h-8 w-8 rounded-lg bg-[#1a2520] border border-white/[0.06] flex items-center justify-center text-base flex-shrink-0">
                                {cropMeta.icon}
                              </div>
                              <div className="truncate">
                                <span className="text-[10px] font-normal text-[#52b788] uppercase tracking-wide block">
                                  {record.cropName} • {cropMeta.category}
                                </span>
                                <h5 className="text-xs font-medium text-white truncate">{record.pestName}</h5>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => toggleSelectRecord(record.id)}
                              className="text-slate-400 hover:text-white p-1 cursor-pointer"
                            >
                              {isSelected ? (
                                <CheckSquare className="h-4 w-4 text-[#52b788]" />
                              ) : (
                                <Square className="h-4 w-4 text-slate-600" />
                              )}
                            </button>
                          </div>

                          <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px]">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedRecordDetail(record);
                                setActiveModal('detail');
                              }}
                              className="text-[#52b788] hover:text-[#74c69d] font-normal cursor-pointer"
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
              <div className="p-4 border-t border-white/[0.06] text-center text-[11px] text-slate-500">
                Registros armazenados localmente no navegador.
              </div>

            </div>
          </div>
        </div>
      )}

      {/* MODAL: SOBRE O PROJETO */}
      {activeModal === 'about' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-smoothFade">
          <div className="neumorphic-panel rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-[#18241e] border border-white/[0.08] text-[#52b788]">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-medium text-white">Identificador Agrícola de Pragas</h3>
                  <p className="text-xs text-slate-400">Projeto de Feira de Ciências & Engenharia Fitossanitária</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-[#18241e] transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed sm:leading-7">
              <p>
                O <strong className="text-slate-100 font-medium">Identificador Agrícola de Pragas</strong> é um portal web interativo desenvolvido para identificação de ameaças biológicas e fitossanitárias em lavouras e culturas agrícolas.
              </p>

              <div className="p-4 rounded-xl bg-[#0e1411] border border-white/[0.06] space-y-1.5">
                <h4 className="font-medium text-slate-200 flex items-center gap-2 text-xs sm:text-sm">
                  <Cpu className="h-4 w-4 text-[#52b788]" />
                  Inteligência Fitossanitária & Base Embrapa
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Combina a base de conhecimento curada da Embrapa cobrindo as principais culturas agrícolas brasileiras com a inteligência artificial generativa do Google Gemini para diagnósticos fitossanitários em tempo real.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-white text-xs sm:text-sm">Escopo de Conteúdo Agronômico:</h4>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-400 text-xs leading-relaxed">
                  <li>Identificação precisa do patógeno/inseto vetor com nome popular e científico.</li>
                  <li>Sintomas e prejuízos quantitativos estimados em % na lavoura.</li>
                  <li>Métodos de Manejo Integrado de Pragas (MIP), bioinsumos e vazio sanitário.</li>
                  <li>Implementos, tratores, pulverizadores de barras e bicos de pulverização recomendados.</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-[#141812] border border-amber-900/30 text-amber-200/90 text-xs flex items-start space-x-2.5">
                <AlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  <strong>Aviso Técnico:</strong> Este sistema possui caráter educativo e de apresentação científica. A aplicação de defensivos em lavouras comerciais deve seguir a orientação de um Engenheiro Agrônomo responsável com emissão de Receituário Agronômico.
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.06] flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2.5 bg-[#2d6a4f] hover:bg-[#387c5d] text-white font-medium text-xs rounded-xl transition-colors cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DETALHES DA FICHA TÉCNICA */}
      {activeModal === 'detail' && selectedRecordDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-smoothFade">
          <div className="neumorphic-panel rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            {/* Header da Ficha Técnica */}
            <div className="rounded-xl p-4 bg-[#0e1411] border border-white/[0.06] flex items-center space-x-3.5">
              <div className="h-12 w-12 rounded-xl bg-[#18241e] border border-white/[0.08] flex items-center justify-center text-2xl flex-shrink-0">
                {getCropMeta(selectedRecordDetail.cropName).icon}
              </div>
              <div>
                <span className="text-[10px] font-normal text-[#52b788] uppercase tracking-wide block">
                  {selectedRecordDetail.cropName} • {getCropMeta(selectedRecordDetail.cropName).category}
                </span>
                <h4 className="text-base sm:text-lg font-medium text-white">{selectedRecordDetail.pestName}</h4>
              </div>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <h5 className="font-medium text-[#52b788] mb-1.5">1. Descrição & Agente Causador:</h5>
                <p className="text-slate-300 leading-relaxed sm:leading-7 bg-[#0e1411] p-4 rounded-xl border border-white/[0.04]">
                  {selectedRecordDetail.description}
                </p>
              </div>

              <div>
                <h5 className="font-medium text-rose-400 mb-1.5">2. Sintomas & Danos Econômicos:</h5>
                <p className="text-slate-300 leading-relaxed sm:leading-7 bg-[#0e1411] p-4 rounded-xl border border-white/[0.04]">
                  {selectedRecordDetail.impactData}
                </p>
              </div>

              <div>
                <h5 className="font-medium text-[#52b788] mb-1.5">3. Manejo Integrado de Pragas (MIP):</h5>
                <p className="text-slate-300 leading-relaxed sm:leading-7 bg-[#0e1411] p-4 rounded-xl border border-white/[0.04]">
                  {selectedRecordDetail.controlMethods}
                </p>
              </div>

              <div>
                <h5 className="font-medium text-amber-300/90 mb-1.5">4. Mecanização & Implementos Agrícolas:</h5>
                <p className="text-slate-300 leading-relaxed sm:leading-7 bg-[#0e1411] p-4 rounded-xl border border-white/[0.04]">
                  {selectedRecordDetail.agriculturalImplements}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.06] flex justify-between items-center text-xs">
              <span className="text-slate-500 truncate max-w-[200px]">Fonte: {selectedRecordDetail.sourceUrl}</span>
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2.5 bg-[#18241e] hover:bg-[#203028] text-slate-200 font-medium rounded-xl transition-colors cursor-pointer border border-white/[0.06]"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
