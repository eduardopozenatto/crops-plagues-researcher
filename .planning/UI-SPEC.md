# 🎨 UI-SPEC.md — Contrato de Design System & UX Responsiva

> **Versão**: 2.4.0 Mobile Responsiveness & Search Engine Polish  
> **Tema Visual**: Dark Graphite Minimalist (`#090d0b`) com Acentos Esmeralda (`#10b981`)  

---

## 📐 1. Breakpoints Responsivos (Mobile First)

| Breakpoint | Largura (px) | Dispositivos Alvo | Ajustes de Layout |
| :--- | :--- | :--- | :--- |
| **xs (Mobile Peq.)** | `360px - 389px` | Google Pixel, Galaxy S20, iPhone SE | Buscador em pilha vertical (`flex-col`), botão 100% largura, abas compactas em ícone + texto curto. |
| **sm (Mobile Grd.)** | `390px - 639px` | iPhone XR / 11 / 12 / 13 | Layout flex em pilha com toque de 44px, drawer de histórico em 100% da tela. |
| **md (Tablet)** | `640px - 1023px` | iPads, Tablets Android | Grid de 2 colunas para os Cards com Abas. |
| **lg (Desktop)** | `1024px+` | Monitores Desktop | Busca horizontal com tecla `[ Enter ↵ ]` e drawer lateral de 400px. |

---

## 🎨 2. Paleta de Cores (Dark Graphite Palette)

```css
--bg-primary: #090d0b;       /* Grafite Profundo de Fundo */
--bg-panel: #0d1310;         /* Vidro Translúcido dos Cards */
--bg-input: #050806;         /* Campo de Busca Ultra Escuro */
--accent-emerald: #10b981;   /* Esmeralda de Foco e Sucesso */
--accent-teal: #14b8a6;      /* Teal de Diagnósticos de IA */
--accent-amber: #f59e0b;     /* Âmbar de Tratores e Alertas */
--accent-rose: #f43f5e;      /* Rose de Sintomas e Danos */
```

---

## ✨ 3. Padrões de Micro-interações & Touch Targets

1. **Botão Diagnosticar (Mobile)**:
   - Altura mínima: `44px` (Alvo tátil padrão da Apple/Google).
   - Largura: `w-full` em telas `<640px` para fácil alcance com o polegar.
2. **Chips de Culturas Rápidas**:
   - Fonte compacta `text-[11px] sm:text-xs`.
   - Transição suave ao tocar/passar o mouse (`hover:border-emerald-700/60 transition-all`).
3. **Abas Navegáveis dos Cards**:
   - Pílulas flexíveis (`[📄 Biologia]` `[⚠️ Sintomas]` `[🛡️ MIP]` `[🚜 Máquinas]`).
