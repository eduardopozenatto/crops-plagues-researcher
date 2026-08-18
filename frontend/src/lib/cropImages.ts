const CROP_IMAGE_MAP: Record<string, string> = {
  // Grãos e Leguminosas
  feijao: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=800&q=80', // Feijão em grãos / colheita
  soja: 'https://images.unsplash.com/photo-1599549924407-748ebf51950e?auto=format&fit=crop&w=800&q=80', // Vagens de soja no campo
  milho: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80', // Milharal / espigas de milho
  trigo: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80', // Campo de trigo dourado
  arroz: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80', // Plantação de arroz
  amendoim: 'https://images.unsplash.com/photo-1567892560266-1c1c2d4a2d8f?auto=format&fit=crop&w=800&q=80', // Amendoins secos / lavoura

  // Hortaliças e Frutos
  tomate: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80', // Tomates vermelhos no pé
  batata: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80', // Batatas colhidas no solo
  mandioca: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb16655?auto=format&fit=crop&w=800&q=80', // Raízes de mandioca
  cenoura: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80', // Cenouras frescas com ramas
  cebola: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cf?auto=format&fit=crop&w=800&q=80', // Cebolas roxas / brancas
  alho: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=800&q=80', // Cabeças de alho
  pimentao: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80', // Pimentões coloridos
  alface: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=800&q=80', // Horta de alface
  repolho: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?auto=format&fit=crop&w=800&q=80', // Cabeça de repolho fresco
  brocolis: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=800&q=80', // Brócolis verde na horta

  // Culturas Industriais e Perenes
  cafe: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=800&q=80', // Frutos/cerejas vermelhas de café no cafezal
  cacau: 'https://images.unsplash.com/photo-1599818816430-be2451475783?auto=format&fit=crop&w=800&q=80', // Fruto/cacaueiro com frutos maduros no tronco
  algodao: 'https://images.unsplash.com/photo-1594897030264-ab7d87efc473?auto=format&fit=crop&w=800&q=80', // Capulhos de algodão branco no algodoeiro
  cana: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80', // Canavial / colmos de cana-de-açúcar
  eucalipto: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=800&q=80', // Floresta de eucaliptos
  girassol: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80', // Campo de girassóis em flor

  // Fruticultura
  banana: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=800&q=80', // Cacho de bananas na bananeira
  laranja: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=800&q=80', // Laranjeira com frutos
  uva: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=800&q=80', // Cachos de uva no parreiral
  mamao: 'https://images.unsplash.com/photo-1517260739337-6799d239ce83?auto=format&fit=crop&w=800&q=80', // Mamoeiro com mamões
  abacaxi: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=800&q=80', // Fruto do abacaxizeiro
  melancia: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80', // Melancia na roça
  morango: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=800&q=80', // Morangos vermelhos no canteiro
  carambola: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=800&q=80', // Frutas de carambola amarelas
  goiaba: 'https://images.unsplash.com/photo-1536511135702-8373f7380f2d?auto=format&fit=crop&w=800&q=80', // Goiabas frescas
  abacate: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80', // Abacates na árvore
  melao: 'https://images.unsplash.com/photo-1571575173700-afb9492e6a50?auto=format&fit=crop&w=800&q=80', // Melões amarelos
  maracuja: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&w=800&q=80', // Maracujá no maracujazeiro
  pitaya: 'https://images.unsplash.com/photo-1527325678964-54921840fd9f?auto=format&fit=crop&w=800&q=80', // Frutas vermelhas de pitaya
  gengibre: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80', // Rizomas de gengibre
};

const DEFAULT_CROP_IMAGE = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80';

export function getCropImageUrl(cropName: string): string {
  if (!cropName) return DEFAULT_CROP_IMAGE;
  
  const norm = cropName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

  for (const [key, url] of Object.entries(CROP_IMAGE_MAP)) {
    if (norm.includes(key) || key.includes(norm)) {
      return url;
    }
  }

  return DEFAULT_CROP_IMAGE;
}
