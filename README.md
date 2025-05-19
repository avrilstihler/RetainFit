# RetainFit Analytics
 <img src="https://img.shields.io/badge/Sistema_de_Predição_de_Evasão_em_Academias-007BFF?style=for-the-badge&logo=fitness&logoColor=white" />

Bem-vindo ao **RetainFit Analytics**, um sistema inteligente que ajuda academias a prever e reduzir a evasão de alunos.

## 📋 Visão Geral

- **Modelo preditivo** baseado em dados históricos
- **Análise visual** de fatores de risco
- **Sugestões personalizadas** para retenção de clientes
- **Painel administrativo** completo

## 📌 Funcionalidades Principais

### 🔮 Previsão
- Calcula probabilidade de cancelamento em tempo real
- Considera 7 fatores de risco principais
- Classifica o risco em 3 níveis (Alto, Médio, Baixo)

### 📈 Análise
- Gráficos interativos por:
  - Estação do ano
  - Tipo de plano
  - Frequência semanal
- Insights automáticos.

### 📋 Dados
- Filtros dinâmicos:
  - Todos clientes
  -  Ativos
  -  Cancelados
  -   Alto risco
- Visualização completa dos registros.

### 🤖 Modelo
- Importação de dados Excel (.xlsx ou .xls).
- Treinamento automático do modelo.

## 🛠️ Tecnologias Utilizadas

<p align="left">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/SheetJS-xlsx-007ACC?style=for-the-badge&logo=microsoft-excel&logoColor=white" />
</p>


## 🧭 Como Usar

### Pré-requisitos
- Navegador moderno (Chrome, Firefox, Edge)
- Arquivo Excel no formato especificado (opcional)

### 1. Importar Dados
- Vá até a aba **"Modelo"**
- Clique em **"Importar Dados"**
- Selecione o arquivo Excel (.xlsx ou .xls)
- Aguarde o processamento automático

### 2. Fazer Previsões Individuais
- Preencha os campos: Gênero, Idade, Meses, Frequência, Plano, Estação, Último Pagamento
- Clique em **"Calcular Risco"**
- O sistema exibirá:
  - Percentual e nível de risco
  - Fatores que influenciam o risco
  - Sugestões práticas

### 3. Explorar Análises
- Acesse a aba **"Análise"**
- Visualize gráficos comparando clientes ativos e cancelados
- Veja os principais padrões de evasão

### 4. Vizualizar Dados
- Acesse a aba **"Dados"**
- Consulte a visão geral dos clientes com base na tabela importada



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

## 📄 Licença

Este projeto está licenciado sob a [Creative Commons Atribuição-NãoComercial 4.0 Internacional (CC BY-NC 4.0)](https://creativecommons.org/licenses/by-nc/4.0/).
 
O uso comercial do código, ideia ou estrutura do sistema é **proibido** sem autorização prévia. 

Para mais detalhes, consulte o arquivo [LICENSE](./LICENSE).


---

<div align="center">

&copy; 2025 RetainFit Analytics — Todos os direitos reservados.  
Desenvolvido por Avril Stihler.

</div>
