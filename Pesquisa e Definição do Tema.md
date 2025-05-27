<style>
  /* ======== RESET E BASE ======== */
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: "Segoe UI", sans-serif;
    background-color: #f9f9f9;
    color: #333;
  }

  h1, h2, h3 {
    color: #222;
    margin-bottom: 8px;
  }

  p {
    margin-bottom: 12px;
  }

  /* ======== CARD COM SOMBRA ======== */
  .card {
    background: white;
    border-radius: 16px;
    padding: 20px;
    margin: 16px 0;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
  }

  .card:hover {
    transform: scale(1.02);
  }

  /* ======== BOTÕES ANIMADOS ======== */
  .button {
    display: inline-block;
    background: linear-gradient(90deg, #06b6d4, #3b82f6);
    color: white;
    padding: 10px 18px;
    border-radius: 30px;
    text-decoration: none;
    margin: 6px 4px;
    font-weight: bold;
    transition: transform 0.3s ease, box-shadow 0.3s;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    cursor: pointer;
  }

  .button:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 6px 20px rgba(0,0,0,0.2);
  }

  /* ======== TABS COM FLEXIBILIDADE ======== */
  .tabs {
    display: flex;
    border-bottom: 2px solid #ddd;
    gap: 8px;
    flex-wrap: wrap;
  }

  .tab {
    padding: 10px 16px;
    cursor: pointer;
    border-radius: 16px 16px 0 0;
    background: #eee;
    transition: background 0.3s, transform 0.2s;
  }

  .tab:hover {
    background: #ddd;
    transform: scale(1.05);
  }

  .tab.active {
    background: white;
    border: 1px solid #ddd;
    border-bottom: none;
  }

  .tab-content {
    display: none;
    border: 1px solid #ddd;
    padding: 20px;
    border-radius: 0 0 16px 16px;
    background: white;
  }

  .tab-content.active {
    display: block;
  }

  /* ======== RESPONSIVO ======== */
  @media (max-width: 600px) {
    .tabs {
      flex-direction: column;
    }
    .tab {
      border-radius: 16px;
    }
  }

  /* Reset básico */
  * {
    box-sizing: border-box;
  }

  body {
    font-family: "Segoe UI", Roboto, Arial, sans-serif;
    background-color: #f9f9f9;
    color: #333;
  }

  h1, h2, h3 {
    color: #222;
  }

  /* Cards */
  .card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    padding: 16px;
    margin: 16px 0;
    transition: transform 0.2s ease;
  }

  .card:hover {
    transform: translateY(-3px);
  }

  /* Botões */
  .button {
    display: inline-block;
    background: #4CAF50;
    color: white;
    padding: 8px 16px;
    border-radius: 8px;
    text-decoration: none;
    margin: 4px 0;
    transition: background 0.3s;
  }

  .button:hover {
    background: #45a049;
  }

  .button.disabled {
    background: gray;
    cursor: not-allowed;
  }

  /* Tabs */
  .tabs {
    display: flex;
    border-bottom: 2px solid #ddd;
  }

  .tab {
    padding: 8px 16px;
    cursor: pointer;
    border-radius: 8px 8px 0 0;
    background: #eee;
    margin-right: 4px;
  }

  .tab.active {
    background: white;
    border: 1px solid #ddd;
    border-bottom: none;
  }

  .tab-content {
    display: none;
    border: 1px solid #ddd;
    padding: 16px;
    border-radius: 0 0 8px 8px;
    background: white;
  }

  .tab-content.active {
    display: block;
  }

  /* Responsive */
  @media (max-width: 600px) {
    .tabs {
      flex-direction: column;
    }
    .tab {
      margin-bottom: 4px;
    }
  }
</style>

# 🚀 Projeto: Missão Contra a Dengue

<div class="card">
  <h2>🎯 Objetivo</h2>
  <p>Ensinar, conscientizar e empoderar crianças na luta contra a dengue através de um jogo educativo e super divertido.</p>
</div>

<div class="card">
  <h2>📜 Descrição</h2>
  <p>O jogador se transforma em um Agente Mirim, com a missão de eliminar focos do mosquito, identificar criadouros e responder desafios educativos sobre saúde.</p>
</div>

# 🎮 Missão Contra a Dengue — Documentação Interativa

> **Projeto de Jogo Educacional — Etapa 1: Pesquisa e Definição do Tema**  
> Público-alvo: Crianças de 9 a 12 anos (Ensino Fundamental II)

---

## 📚 Tema Escolhido: **Saúde (Prevenção da Dengue)**

<div class="box">
<strong>Justificativa:</strong>  
A dengue é um problema de saúde pública que afeta milhares de pessoas no Brasil. O jogo visa conscientizar crianças sobre os riscos da dengue, ensinando formas de prevenção de maneira lúdica e divertida.  
</div>

### 🔍 Por que esse tema?

- Alta incidência de casos no Espírito Santo e no Brasil.
- Crianças estão em fase de formação de hábitos.
- Utiliza dados reais e experiências do SUS.
- Educar crianças torna elas multiplicadoras da informação.

---

## 🔬 Resumo das Informações Pesquisadas

- **Causa:** Vírus DENV transmitido pelo mosquito *Aedes aegypti*.
- **Sintomas:** Febre, dores no corpo, manchas na pele, vômitos e em casos graves, óbito.
- **Desafios Sociais:**
  - Falta de informação sobre proliferação.
  - Descuido com água parada.
  - Baixo engajamento em campanhas tradicionais.
  - Desvalorização do tema em algumas escolas.

---

## 🚀 Como o Jogo Vai Ajudar?

| Objetivo                                | Descrição                                          |
|------------------------------------------|----------------------------------------------------|
| 🏠 Localizar focos                       | Ensinar onde o mosquito se reproduz                |
| 🛑 Prevenção                             | Estimular hábitos como eliminar água parada        |
| 🎯 Mostrar consequências                  | Demonstrar os riscos e consequências da dengue     |
| 🦸‍♂️ Protagonismo da criança              | Transformar o aluno em agente ativo na prevenção   |

---

## 🎮 Análise de Jogos Educacionais

<details>
<summary>🔸 <strong>Jogo Contra a Dengue 2 — Ludo Educativo</strong></summary>

**Descrição:**  
Jogo de eliminação de criadouros e quizzes educativos.

**Pontos Positivos:**  
✔️ Aprendizado direto e quizzes interativos.

**Pontos Negativos:**  
❌ Interface simples e pouca liberdade de movimentação.

</details>

<details>
<summary>🔸 <strong>Guerra ao Mosquito — Escola Games</strong></summary>

**Descrição:**  
Jogo estilo defesa, onde se protege uma casa dos mosquitos.

**Pontos Positivos:**  
✔️ Visual moderno e gameplay dinâmico.

**Pontos Negativos:**  
❌ Conteúdo educativo superficial, foco mais na ação.

</details>

---

## 🏆 Conclusão

<div class="box">
O jogo **"Missão Contra a Dengue"** irá combinar diversão com conscientização. Por meio de desafios, elementos visuais envolventes e uma mecânica simples, busca-se ensinar conceitos de saúde pública e transformar as crianças em agentes de mudança contra a dengue.
</div>

---

## 🎖️ Status do Projeto

| Etapa                        | Status          | Prioridade |
|------------------------------|-----------------|------------|
| Pesquisa                     | ✔️ Concluída    | Alta       |
| Definição de Mecânicas       | 🚧 Em andamento | Média      |
| Protótipo do Jogo            | ❌ Pendente     | Alta       |
| Documentação                 | ✔️ Completa     | Média      |

---

## 🔘 Ações Rápidas

<button>📥 Baixar Documentação</button>
<button>🎥 Acessar Vídeo Demonstrativo</button>
<button disabled>🚀 Deploy — Indisponível</button>

---

## 💡 Ideias Futuras

- 🔥 Implementar ranking online.  
- 🔊 Adicionar narração para acessibilidade.  
- 🎨 Mais personalização de personagem.  
- 📱 Versão mobile otimizada.  

---
