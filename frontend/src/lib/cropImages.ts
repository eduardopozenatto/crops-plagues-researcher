// Mapeamento iconográfico botânico para exibição minimalista e elegante (Zero dependência de fotos externas)
const CROP_ICON_MAP: Record<string, { icon: string; category: string }> = {
  // Grãos e Leguminosas
  feijao: { icon: '🫘', category: 'Leguminosa' },
  soja: { icon: '🌱', category: 'Grão Oleaginoso' },
  milho: { icon: '🌽', category: 'Cereal / Grão' },
  trigo: { icon: '🌾', category: 'Cereal de Inverno' },
  arroz: { icon: '🍚', category: 'Cereal / Várzea' },
  amendoim: { icon: '🥜', category: 'Leguminosa' },

  // Hortaliças e Tubérculos
  tomate: { icon: '🍅', category: 'Hortaliça / Fruto' },
  batata: { icon: '🥔', category: 'Tubérculo' },
  mandioca: { icon: '🪵', category: 'Raiz Tuberosa' },
  cenoura: { icon: '🥕', category: 'Hortaliça de Raiz' },
  cebola: { icon: '🧅', category: 'Hortaliça / Bulbo' },
  alho: { icon: '🧄', category: 'Hortaliça / Bulbo' },
  pimentao: { icon: '🫑', category: 'Hortaliça / Solanácea' },
  alface: { icon: '🥬', category: 'Folhosa' },
  repolho: { icon: '🥬', category: 'Crucífera' },
  brocolis: { icon: '🥦', category: 'Crucífera' },

  // Culturas Industriais e Perenes
  cafe: { icon: '☕', category: 'Lavoura Perene' },
  cacau: { icon: '🍫', category: 'Lavoura Agroflorestal' },
  algodao: { icon: '☁️', category: 'Fibra / Industrial' },
  cana: { icon: '🎋', category: 'Cultura Sucroalcooleira' },
  eucalipto: { icon: '🌲', category: 'Silvicultura' },
  girassol: { icon: '🌻', category: 'Oleaginosa' },

  // Fruticultura
  banana: { icon: '🍌', category: 'Fruticultura' },
  laranja: { icon: '🍊', category: 'Citricultura' },
  uva: { icon: '🍇', category: 'Viticultura' },
  mamao: { icon: '🥭', category: 'Fruticultura' },
  abacaxi: { icon: '🍍', category: 'Fruticultura' },
  melancia: { icon: '🍉', category: 'Olericultura' },
  morango: { icon: '🍓', category: 'Pequenas Frutas' },
  carambola: { icon: '⭐', category: 'Fruticultura Tropical' },
  goiaba: { icon: '🍈', category: 'Fruticultura' },
  abacate: { icon: '🥑', category: 'Fruticultura' },
  melao: { icon: '🍈', category: 'Olericultura' },
  maracuja: { icon: '🟡', category: 'Fruticultura' },
  pitaya: { icon: '🐉', category: 'Cactácea Frutífera' },
  gengibre: { icon: '🫚', category: 'Rizoma / Especiaria' },
};

const DEFAULT_CROP_META = { icon: '🌿', category: 'Cultura Agrícola' };

export function getCropMeta(cropName: string): { icon: string; category: string } {
  if (!cropName) return DEFAULT_CROP_META;
  
  const norm = cropName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

  for (const [key, meta] of Object.entries(CROP_ICON_MAP)) {
    if (norm.includes(key) || key.includes(norm)) {
      return meta;
    }
  }

  return DEFAULT_CROP_META;
}

// Mantido para compatibilidade semântica reversa, retornando ícone padrão seguro
export function getCropImageUrl(cropName: string): string {
  return '';
}
