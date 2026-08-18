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
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  Image as ImageIcon
} from 'lucide-react';
import { getCropImageUrl } from '@/lib/cropImages';

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
  cropImageUrl?: string;
  createdAt: string;
}

const BACKEND_URL = 'http://localhost:8000';

export default function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [searchResult, setSearchResult] = useState<CropSearchResult | null>(null);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [savedRecords, setSavedRecords] = useState<SavedCropRecord[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [activeModal, setActiveModal] = useState<'about' | 'detail' | null>(null);
  const [selectedRecordDetail, setSelectedRecordDetail] = useState<SavedCropRecord | null>(null);

  // Sistema Sanfonado (Accordion): mapeamento de seções abertas para cada card [pestIdx-sectionKey]
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [allExpanded, setAllExpanded] = useState<boolean>(false);

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

  const loadSavedRecordsFromStorage = () => {
    try {
      const stored = localStorage.getItem('radar_agricola_records');
      if (stored) {
        setSavedRecords(JSON.parse(stored));
      }
    } catch {
      setSavedRecords([]);
    }
  };

  const saveRecordToStorage = (cropResult: CropSearchResult) => {
    const cropImg = getCropImageUrl(cropResult.cropName);
    const newItems: SavedCropRecord[] = cropResult.pests.map((p, idx) => ({
      id: `${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
      cropName: cropResult.cropName,
      pestName: p.pestName,
      description: p.description,
      impactData: p.impactData,
      controlMethods: p.controlMethods,
      agriculturalImplements: p.agriculturalImplements,
      sourceUrl: p.sourceUrl,
      cropImageUrl: cropImg,
      createdAt: new Date().toISOString(),
    }));

    setSavedRecords((prev) => {
      const updated = [...newItems, ...prev];
      localStorage.setItem('radar_agricola_records', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSearch = async (searchTerm?: string) => {
    const targetCrop = (searchTerm || query).trim();
    if (!targetCrop) return;

    setLoading(true);
    setSearchResult(null);
    setLoadingStep('Consultando Motor Híbrido Fitossanitário...');

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
      setSearchResult(data);
      saveRecordToStorage(data);

      const initialSections: Record<string, boolean> = {};
      data.pests.forEach((_: PestItem, pIdx: number) => {
        initialSections[`${pIdx}-description`] = true;
      });
      setOpenSections(initialSections);
      setAllExpanded(false);

    } catch (err) {
      console.error(err);
      alert('Não foi possível conectar ao motor do backend. Certifique-se de que o backend FastAPI esteja rodando na porta 8000.');
    } fontally: {
      setLoading(false);
      setLoadingStep('');
    }
  };

  const toggleSection = (pestIdx: number, sectionKey: string) => {
    const key = `${pestIdx}-${sectionKey}`;
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleAllSections = () => {
    if (!searchResult) return;
    const newState = !allExpanded;
    setAllExpanded(newState);

    const updated: Record<string, boolean> = {};
    searchResult.pests.forEach((_: PestItem, pIdx: number) => {
      ['description', 'impact', 'control', 'implements'].forEach((sec) => {
        updated[`${pIdx}-${sec}`] = newState;
      });
    });
    setOpenSections(updated);
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
    <div className="min-h-screen bg-[#06110d] text-slate-100 font-sans selection:bg-emerald-500 selection:text-black">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))] pointer-events-none z-0" />

      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full border-b border-emerald-900/40 bg-[#06110d]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-950">
              <Sprout className="h-6 w-6 text-black stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Radar Agrícola IA
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-normal">
                  v2.2.0 Feira (Vite)
                </span>
              </h1>
              <p className="text-xs text-slate-400">Preservação de Lavoras & Diagnósticos Fitossanitários</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveModal('about')}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Info className="h-4 w-4 text-emerald-400" />
              <span className="hidden sm:inline">Sobre o Projeto</span>
            </button>

            <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-xs font-medium text-emerald-300">
              <span className={`h-2 w-2 rounded-full ${backendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>{backendOnline ? 'FastAPI Online' : 'Modo Offline'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 space-y-8">
        
        {/* Presentation Banner */}
        <section className="glass-panel p-6 sm:p-8 rounded-2xl border border-emerald-800/30 shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Projeto de Feira de Ciências & Conhecimento Científico Embrapa</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Identificação de Pragas, Manejo MIP & Equipamentos Agrícolas por Cultura
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Relacione a planta semeada às suas principais ameaças biológicas e aos implementos científicos (tratores, pulverizadores, atomizadores) necessários para a preservação da lavoura.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => setActiveModal('about')}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm transition-all shadow-lg shadow-emerald-950"
              >
                <BookOpen className="h-4 w-4" />
                <span>Ver Detalhes do Projeto</span>
              </button>
            </div>
          </div>
        </section>

        {/* Search Engine Area */}
        <section className="space-y-4">
          <div className="glass-panel p-6 rounded-2xl border border-emerald-800/30 space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="crop-input" className="block text-sm font-semibold text-slate-200">
                Pesquisar Cultura Agrícola Semeada
              </label>
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <Cpu className="h-3.5 w-3.5" />
                Motor Híbrido Alternativa C (Base Curada + Gemini Direto)
              </span>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                <input
                  id="crop-input"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ex: Feijão, Tomate, Milho, Soja, Cacau, Café, Trigo..."
                  className="w-full pl-11 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-950/50 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <span className="inline-block animate-spin font-bold">⏳</span>
                ) : (
                  <Search className="h-4 w-4 stroke-[2.5]" />
                )}
                <span>Diagnosticar Cultura & Imagem Agronômica</span>
              </button>
            </form>

            <div className="space-y-2 pt-2 border-t border-slate-800/60">
              <span className="text-xs text-slate-400 font-medium">Culturas populares para busca rápida (0ms):</span>
              <div className="flex flex-wrap gap-2">
                {popularCrops.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => {
                      setQuery(c.name);
                      handleSearch(c.name);
                    }}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900/60 hover:bg-emerald-950/60 border border-slate-800 hover:border-emerald-700/50 text-xs font-medium text-slate-300 hover:text-emerald-300 transition-colors"
                  >
                    <span>{c.icon}</span>
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Loading Indicator */}
        {loading && (
          <div className="glass-panel p-8 rounded-2xl border border-emerald-500/30 text-center space-y-4 animate-pulse">
            <div className="inline-flex items-center justify-center p-4 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Sprout className="h-8 w-8 animate-spin" />
            </div>
            <h3 className="text-lg font-bold text-white">Analisando Cultura Agrícola...</h3>
            <p className="text-sm text-emerald-400 font-medium">{loadingStep}</p>
          </div>
        )}

        {/* Search Results Dashboard */}
        {searchResult && !loading && (
          <section className="space-y-6 animate-fadeIn">
            <div className="relative rounded-2xl overflow-hidden border border-emerald-700/40 shadow-2xl h-48 sm:h-64 flex items-end">
              <img
                src={getCropImageUrl(searchResult.cropName)}
                alt={searchResult.cropName}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06110d] via-[#06110d]/60 to-transparent" />

              <div className="relative z-10 p-6 sm:p-8 w-full flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-2">
                    <ImageIcon className="h-3.5 w-3.5" />
                    <span>Identificação Fotográfica Agronômica</span>
                  </div>
                  <h3 className="text-3xl sm:text-5xl font-extrabold text-white capitalize drop-shadow-md">
                    {searchResult.cropName}
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm mt-1">
                    Exibindo as 4 pragas características, manejo MIP e implementos agrícolas recomendados.
                  </p>
                </div>

                <button
                  onClick={toggleAllSections}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-white transition-all shadow-lg backdrop-blur-md"
                >
                  {allExpanded ? <Minimize2 className="h-4 w-4 text-emerald-400" /> : <Maximize2 className="h-4 w-4 text-emerald-400" />}
                  <span>{allExpanded ? 'Recolher Todos' : 'Expandir Todos'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {searchResult.pests.map((pest, pIdx) => (
                <article
                  key={pIdx}
                  className="glass-panel rounded-2xl border border-emerald-900/40 p-6 space-y-4 hover:border-emerald-700/50 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3 border-b border-slate-800/80 pb-3">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Ameaça #{pIdx + 1}
                        </span>
                        <h4 className="text-lg font-bold text-white leading-snug">
                          {pest.pestName}
                        </h4>
                      </div>
                    </div>

                    <div className="border border-slate-800/80 rounded-xl overflow-hidden bg-slate-950/40">
                      <button
                        type="button"
                        onClick={() => toggleSection(pIdx, 'description')}
                        className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-900/50 transition-colors"
                      >
                        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400">
                          <Info className="h-4 w-4" />
                          <span>1. Descrição & Agente Causador</span>
                        </div>
                        {openSections[`${pIdx}-description`] ? (
                          <ChevronUp className="h-4 w-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        )}
                      </button>

                      {openSections[`${pIdx}-description`] && (
                        <div className="p-3.5 border-t border-slate-800/60 text-xs text-slate-300 leading-relaxed bg-slate-900/20">
                          {pest.description}
                        </div>
                      )}
                    </div>

                    <div className="border border-slate-800/80 rounded-xl overflow-hidden bg-slate-950/40">
                      <button
                        type="button"
                        onClick={() => toggleSection(pIdx, 'impact')}
                        className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-900/50 transition-colors"
                      >
                        <div className="flex items-center space-x-2 text-xs font-bold text-rose-400">
                          <AlertTriangle className="h-4 w-4" />
                          <span>2. Sintomas & Prejuízos na Lavoura</span>
                        </div>
                        {openSections[`${pIdx}-impact`] ? (
                          <ChevronUp className="h-4 w-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        )}
                      </button>

                      {openSections[`${pIdx}-impact`] && (
                        <div className="p-3.5 border-t border-slate-800/60 text-xs text-slate-300 leading-relaxed bg-slate-900/20">
                          {pest.impactData}
                        </div>
                      )}
                    </div>

                    <div className="border border-slate-800/80 rounded-xl overflow-hidden bg-slate-950/40">
                      <button
                        type="button"
                        onClick={() => toggleSection(pIdx, 'control')}
                        className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-900/50 transition-colors"
                      >
                        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-300">
                          <ShieldCheck className="h-4 w-4" />
                          <span>3. Manejo Integrado de Pragas (MIP)</span>
                        </div>
                        {openSections[`${pIdx}-control`] ? (
                          <ChevronUp className="h-4 w-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        )}
                      </button>

                      {openSections[`${pIdx}-control`] && (
                        <div className="p-3.5 border-t border-slate-800/60 text-xs text-slate-300 leading-relaxed bg-slate-900/20">
                          {pest.controlMethods}
                        </div>
                      )}
                    </div>

                    <div className="border border-slate-800/80 rounded-xl overflow-hidden bg-slate-950/40">
                      <button
                        type="button"
                        onClick={() => toggleSection(pIdx, 'implements')}
                        className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-900/50 transition-colors"
                      >
                        <div className="flex items-center space-x-2 text-xs font-bold text-amber-300">
                          <Tractor className="h-4 w-4" />
                          <span>4. Implementos & Equipamentos Agrícolas</span>
                        </div>
                        {openSections[`${pIdx}-implements`] ? (
                          <ChevronUp className="h-4 w-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        )}
                      </button>

                      {openSections[`${pIdx}-implements`] && (
                        <div className="p-3.5 border-t border-slate-800/60 text-xs text-slate-300 leading-relaxed bg-slate-900/20">
                          {pest.agriculturalImplements}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="truncate max-w-[200px]">Fonte: {pest.sourceUrl}</span>
                    <a
                      href={pest.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      <span>Ver Fonte</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Database History & Multi-Select Management */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-400" />
                Base de Conhecimento Registrada
              </h3>
              <p className="text-xs text-slate-400">
                Histórico de pesquisas salvas no banco relacional com fotos das culturas.
              </p>
            </div>

            {savedRecords.length > 0 && (
              <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
                <button
                  type="button"
                  onClick={toggleSelectAll}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 font-medium transition-colors"
                >
                  {selectedIds.length === getFilteredRecords().length ? (
                    <CheckSquare className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Square className="h-4 w-4 text-slate-400" />
                  )}
                  <span>Selecionar Todos ({getFilteredRecords().length})</span>
                </button>

                {selectedIds.length > 0 && (
                  <button
                    type="button"
                    onClick={deleteSelectedRecords}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-xs text-rose-300 font-semibold transition-colors animate-fadeIn"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Excluir Selecionados ({selectedIds.length})</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {savedRecords.length > 0 && (
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filtrar histórico por cultura ou praga..."
                className="w-full pl-9 pr-4 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          )}

          {getFilteredRecords().length === 0 ? (
            <div className="glass-panel p-8 rounded-2xl border border-slate-800/80 text-center space-y-2">
              <p className="text-sm text-slate-400">Nenhum registro encontrado no banco de dados.</p>
              <p className="text-xs text-slate-500">Pesquise por uma cultura acima para registrar novas informações fitossanitárias.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {getFilteredRecords().map((record) => {
                const isSelected = selectedIds.includes(record.id);
                return (
                  <div
                    key={record.id}
                    className={`glass-panel rounded-xl border p-4 space-y-3 relative group transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-950/20'
                        : 'border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2 overflow-hidden">
                        <img
                          src={record.cropImageUrl || getCropImageUrl(record.cropName)}
                          alt={record.cropName}
                          className="h-10 w-10 rounded-lg object-cover border border-slate-700 flex-shrink-0"
                        />
                        <div className="truncate">
                          <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider block">
                            {record.cropName}
                          </span>
                          <h5 className="text-sm font-bold text-white truncate">{record.pestName}</h5>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleSelectRecord(record.id)}
                        className="text-slate-400 hover:text-white transition-colors"
                      >
                        {isSelected ? (
                          <CheckSquare className="h-5 w-5 text-emerald-400" />
                        ) : (
                          <Square className="h-5 w-5 text-slate-600" />
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2">{record.description}</p>

                    <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRecordDetail(record);
                          setActiveModal('detail');
                        }}
                        className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
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
        </section>

      </main>

      {/* MODAL: SOBRE O PROJETO */}
      {activeModal === 'about' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="glass-panel border border-emerald-800/40 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Radar Agrícola IA</h3>
                  <p className="text-xs text-slate-400">Projeto de Feira de Ciências & Engenharia Fitossanitária</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>
                O <strong className="text-emerald-400">Radar Agrícola IA</strong> é um portal web interativo desenvolvido especificamente para apresentação em feiras de ciências e feiras agrícolas, relacionando plantas semeadas às suas ameaças biológicas mais características.
              </p>

              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/40 space-y-2">
                <h4 className="font-bold text-emerald-300 flex items-center gap-2 text-sm">
                  <Cpu className="h-4 w-4" />
                  Arquitetura Híbrida Alternativa C
                </h4>
                <p className="text-xs text-slate-300">
                  Combina uma base de conhecimento curada da Embrapa cobrindo 50+ culturas agrícolas brasileiras (respostas em 0ms) com a inteligência artificial generativa do Google Gemini 3.5 Flash (direta, sem raspagem de web ruidosa).
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-white text-sm">Escopo de Conteúdo Agronômico:</h4>
                <ul className="list-disc pl-5 space-y-1 text-slate-400">
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
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DETALHES DA FICHA TÉCNICA */}
      {activeModal === 'detail' && selectedRecordDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="glass-panel border border-emerald-800/40 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <div className="relative h-40 rounded-xl overflow-hidden border border-slate-800 mb-4">
              <img
                src={selectedRecordDetail.cropImageUrl || getCropImageUrl(selectedRecordDetail.cropName)}
                alt={selectedRecordDetail.cropName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06110d] via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                  {selectedRecordDetail.cropName}
                </span>
                <h4 className="text-lg font-bold text-white">{selectedRecordDetail.pestName}</h4>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
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
                <h5 className="font-bold text-emerald-300 mb-1">3. Manejo Integrado (MIP):</h5>
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
              <span className="text-slate-500">Fonte: {selectedRecordDetail.sourceUrl}</span>
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors"
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
