# 🌾 Explicação Didática do Projeto — Radar Agrícola IA

> **Para quem é este documento?**  
> Este guia foi feito para ser lido por colegas de equipe, professores, alunos e jurados da **Feira de Ciências**. Ele explica **o que o site faz, como ele funciona e por que ele foi construído**, usando uma linguagem simples e sem termos difíceis da computação!

---

## 📌 1. O que é o Radar Agrícola IA?

O **Radar Agrícola IA** é uma plataforma digital parecida com um "Google das Plantas". 

Quando um agricultor ou estudante digita o nome de uma cultura agrícola (por exemplo: *Feijão*, *Tomate*, *Milho*, *Soja*, *Café*, *Cacau*), o site imediatamente traz:
1. **📸 Foto Realista em HD da Planta**: Uma foto fotográfica bonita da lavoura.
2. **🐛 As 4 Principais Pragas e Doenças**: As ameaças biológicas mais famosas e perigosas que atacam aquela planta específica.
3. **🍂 Sintomas e Prejuízos**: O que acontece com as folhas, caules e frutos, e quanto o produtor pode perder na colheita.
4. **🛡️ Manejo Integrado de Pragas (MIP)**: Como combater a praga usando controle biológico (insetos do bem, fungos protetores) e métodos sustentáveis.
5. **🚜 Tratores e Equipamentos Agrícolas**: Quais tratores, pulverizadores de barras, bicos e ferramentas são usados no campo para cuidar da planta.

---

## 🧠 2. Como o site funciona por dentro? (De forma bem simples)

Imagine que o nosso site tem **duas cabeças trabalhando juntas**:

```
[ Colega/Usuário digita: "Feijão" ]
                │
                ▼
┌──────────────────────────────────────────────┐
│  Primeira Busca: Base do Computador (0ms)   │
│  (Procura nas 50+ plantas já guardadas)      │
└──────────────────────┬───────────────────────┘
                       │
         ┌─────────────┴─────────────┐
         ▼                           ▼
   [ Encontrou! ]             [ Não Encontrou? ]
   Retorna tudo na hora       Pergunta para a IA (Gemini)
   em 0 segundos!             e guarda o resultado para a próxima!
```

### A) O "Cérebro Rápido" (Base Curada da Embrapa)
- Nós estudamos e guardamos no sistema dados oficiais da **Embrapa** (Empresa Brasileira de Pesquisa Agropecuária) para mais de **50 culturas brasileiras**.
- Quando alguém pesquisa *Feijão*, *Tomate* ou *Milho*, o resultado aparece **instantaneamente (0 segundos)** porque já está pronto no sistema!

### B) O "Cérebro Inteligente" (Inteligência Artificial Gemini)
- Se alguém pesquisar uma planta muito rara ou diferente, o site chama a **Inteligência Artificial da Google (Gemini 3.5 Flash)**.
- A IA analisa a planta, gera os diagnósticos exatos e salva o resultado para que as próximas buscas fiquem instantâneas!
- **Segurança**: Se alguém digitar algo que não é planta (ex: *"Cadeira"* ou *"Celular"*), a IA percebe e avisa educadamente que o site serve apenas para lavouras agrícolas.

---

## 🎨 3. Como a Tela do Site está Organizada?

1. **Barra de Busca Central**:
   - Fica no meio da tela para a pessoa digitar ou clicar nos botões rápidos de culturas (*Feijão*, *Tomate*, *Milho*, etc.).
2. **Hero Banner Visual**:
   - Mostra a foto em alta definição da planta pesquisada com o nome em destaque.
3. **Cards de Pragas com Abas**:
   - Em vez de uma página gigante e cansativa de rolar, cada uma das 4 pragas tem **4 abas clicáveis**:
     - `[ 📄 Descrição ]`
     - `[ ⚠️ Sintomas ]`
     - `[ 🛡️ Manejo MIP ]`
     - `[ 🚜 Tratores e Equipamentos ]`
4. **Modo Tabela Comparativa**:
   - Um botão no topo permite ver todas as 4 pragas lado a lado em uma tabela perfeita para mostrar na Feira de Ciências!
5. **Histórico Retrátil (Drawer)**:
   - Todas as pesquisas ficam salvas em uma "gaveta" flutuante no topo que desliza da direita quando você clica em *"Histórico"*.

---

## 👥 4. Resumo para Explicar na Feira de Ciências em 30 Segundos!

> *"Nosso projeto é o **Radar Agrícola IA**. Ele ajuda estudantes e agricultores a identificar rapidamente as pragas de qualquer cultura agrícola, mostrando fotos em alta definição, sintomas de prejuízo, técnicas de manejo biológico sustentável e os tratores e pulverizadores necessários. Usamos dados científicos da Embrapa integrados com Inteligência Artificial para dar respostas instantâneas!"*
