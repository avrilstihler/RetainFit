# 💪 RetainFit Analytics
**Sistema de Predição de Evasão em Academias**

## 📌 Visão Geral

- **Modelo preditivo** baseado em dados históricos
- **Análise visual** de fatores de risco
- **Sugestões personalizadas** para retenção de clientes
- **Painel administrativo** completo

## ✨ Funcionalidades Principais

| Módulo               | Descrição                                                                      | Detalhes                                                                 |
|----------------------|--------------------------------------------------------------------------------|--------------------------------------------------------------------------|
| **🔮 Módulo de Predição** | Realiza cálculos preditivos de cancelamento                                   | - 📌 Probabilidade em tempo real<br>- 📌 7 fatores de risco analisados<br>- 📌 Classificação em 3 níveis (🟥 Alto, 🟨 Médio, 🟩 Baixo) |
| **📊 Módulo de Análise**  | Gera visualizações e insights estratégicos                                    | - 📈 Gráficos interativos:<br>  • Tipo de plano<br>  • Estação do ano<br>  • Frequência semanal<br>- 💡 Insights automáticos |
| **📋 Módulo de Dados**    | Gerencia e filtra informações dos clientes                                    | - 🔍 Filtros dinâmicos:<br>  • Todos clientes<br>  • Ativos<br>  • Cancelados<br>  • Alto risco<br>- 📤 Importação de Excel |
## ✨ Funcionalidades Principais

### 🔮 Módulo de Predição
- Calcula probabilidade de cancelamento em tempo real
- Considera 7 fatores de risco principais
- Classifica o risco em 3 níveis (Alto, Médio, Baixo)

### 📊 Módulo de Análise
- Gráficos interativos por:
  - Tipo de plano
  - Estação do ano
  - Frequência semanal
- Principais insights automáticos

### 📋 Módulo de Dados
- Tabela dinâmica com filtros:
  - Todos clientes
  - Ativos
  - Cancelados
  - Alto risco
- Importação de planilhas Excel

## 🛠️ Tecnologias Utilizadas

<p align="left">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/SheetJS-xlsx-007ACC?style=for-the-badge&logo=microsoft-excel&logoColor=white" />
</p>



## 🚀 Como Usar

### Pré-requisitos
- Navegador moderno (Chrome, Firefox, Edge)
- Arquivo Excel no formato especificado (opcional)

### Instruções
1. **Previsão Individual**:
   - Preencha o formulário na aba "Previsão"
   - Obtenha o risco calculado e ações recomendadas

2. **Análise Geral**:
   - Navegue pelas abas de análise
   - Visualize gráficos por diferentes categorias

3. **Importar Dados**:
   - Na aba "Modelo", arraste um arquivo Excel
   - Sistema treinará com os novos dados

4. **Visualização**:
   - Use filtros na aba "Dados" para diferentes visualizações

## 📈 Modelo Preditivo

### Fatores Considerados
1. Dados demográficos (gênero, idade)
2. Histórico de uso (meses como cliente, frequência)
3. Detalhes do plano (tipo, dias desde último pagamento)
4. Fatores sazonais (estação do ano)

### Lógica de Atraso

| Tipo de Plano | Dias para Considerar Atraso |
|---------------|-----------------------------|
| Mensal        | 30+ dias                    |
| Trimestral    | 90+ dias                    |
| Semestral     | 180+ dias                   |
| Anual         | 365+ dias                   |


## 📝 Licença

Este projeto está licenciado sob a **Apache License 2.0**.  
Você pode usá-lo, modificá-lo e distribuí-lo, desde que siga os termos da licença.

Para mais detalhes, consulte o arquivo [LICENSE](./LICENSE).


---

<div align="center">

&copy; 2025 RetainFit Analytics — Todos os direitos reservados.  
Desenvolvido por Avril Stihler.

</div>
