# 🎨 UI-SPEC.md — Contrato de Design System Minimalista & Neumórfico Suave

> **Versão**: 3.0.0 Human-Crafted Editorial & Minimalist Hybrid  
> **Conceito Visual**: União de Flat Design moderno, Neumorfismo sutil de profundidade (soft shadows & dual-tone borders) e conforto visual editorial.  
> **Inspirações de Referência**: Linear.app, Apple Human Interface, Vercel Dashboard, Raycast.

---

## 🚫 1. Diretrizes de Desintoxicação Visual ("Anti-AI Look")

1. **Eliminação de Verdes Neon e Brilhos Excessivos**:
   - Proibido o uso de `bg-emerald-500` berrante em botões e banners.
   - Substituição por **Matte Sage & Forest Muted** (`#2d6a4f`, `#40916c`, `#52b788`) com contrastes balanceados.
   - Remoção de luzes e glows estourados no fundo (`radial-gradient` neon eliminado).
2. **Fim da Tipografia Apertada (Conforto de Leitura Editorial)**:
   - Aumentar o espaçamento entrelinhas (`leading-relaxed` a `leading-7`) e tamanho de fonte legível (`text-sm` em corpo de texto).
   - Espaçamento interno generoso nos cards (`p-6`) para permitir que o olho descanse.
3. **Harmonização de Cores**:
   - Cores semânticas (sintomas, MIP, tratores) devem atuar como **toques monocromáticos discretos**, e não um arco-íris de botões saturados.

---

## 📐 2. Superfícies, Profundidade Neumórfica & Elevação

```css
/* Paleta de Superfície Minimalista */
--surface-ground: #0b0f0d;       /* Fundo Obsidian Neutro */
--surface-card: #121815;         /* Placa Base Translúcida */
--surface-elevated: #18201c;     /* Camada de Foco / Hover */
--surface-inset: #080c0a;        /* Rebaixo Tátil do Input */

/* Bordas Dual-Tone (Flat Neumorphism) */
--border-subtle: rgba(255, 255, 255, 0.07);
--border-active: rgba(82, 183, 136, 0.35);

/* Sombras Suaves de Profundidade */
--shadow-neumorph: 0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 1px 2px 0 rgba(0, 0, 0, 0.3);
--shadow-inset-soft: inset 0 2px 4px 0 rgba(0, 0, 0, 0.4);
```

---

## 🔤 3. Tipografia & Conforto Visual

| Elemento | Tamanho / Peso | Leading (Entrelinha) | Cor da Fonte |
| :--- | :--- | :--- | :--- |
| **Título Principal (Hero)** | `text-3xl sm:text-4xl font-semibold` | `leading-tight tracking-tight` | `#f1f5f9` (Slate 100) |
| **Subtítulos de Seção** | `text-lg font-medium` | `leading-snug` | `#cbd5e1` (Slate 300) |
| **Nome da Praga / Card Title** | `text-base font-semibold` | `leading-snug` | `#ffffff` |
| **Texto Explicativo / Diagnóstico**| `text-sm font-normal` | `leading-relaxed (1.65)` | `#94a3b8` (Slate 400) |
| **Metadados & Tags** | `text-xs font-medium` | `leading-none tracking-wide` | `#64748b` a `#52b788` |

---

## 🔘 4. Componentes Chave Redesenhados

1. **Barra de Busca Flat-Neumórfica**:
   - Input rebaixado com toque tátil (`bg-[#080c0a]`, borda suave `border-white/[0.08]`, sombra interna suave).
   - Botão de ação com tom **Matte Forest** (`#2d6a4f` ➔ hover `#40916c`), tipografia branca elegante e sem visual de marca-texto.
2. **Chips Rápidos**:
   - Pílulas sutis em flat-neumorphic (`bg-[#121815] border border-white/[0.06] text-slate-300 hover:bg-[#18201c]`).
3. **Cards de Pragas com Abas Alinhadas**:
   - Navegador de abas em trilho escovado discreto (`bg-[#080c0a] p-1 rounded-xl`).
   - Aba ativa iluminada com borda sutil e fundo fosco (`bg-[#18201c] text-white`).
   - Área de conteúdo com tipografia espaçada, parágrafos fluidos e leitura despoluída.
4. **Hero Card da Cultura**:
   - Cabeçalho minimalista em ardósia escura, ícone botânico em relevo fosco e métricas com visual clean de dashboard de alta precisão.

---

## ✨ 5. Micro-animações Refinadas (Não Poluentes)

- Transições de 150ms a 200ms (`ease-out`) em mudanças de aba e hover de cards.
- Efeito de compressão tátil ao clicar (`active:scale-[0.985]`).
- Ausência de animações piscantes ou giros desnecessários.
