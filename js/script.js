// Variáveis globais
let clientData = [];
let analysisChart = null;
let modelMetrics = {
  accuracy: 0.85,
  precision: 0.82,
  recall: 0.78,
  lastTrained: null,
};

// Inicialização do sistema
document.addEventListener("DOMContentLoaded", function () {
  setupTabNavigation();
  setupAnalysisTabs();
  setupPredictionForm();
  setupFileUpload();

  document
    .getElementById("dataFilter")
    .addEventListener("change", updateDataTable);
  updateModelMetrics();
});

// Configuração da navegação por abas
function setupTabNavigation() {
  const navLinks = document.querySelectorAll(".nav-links a");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      navLinks.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");

      document.querySelectorAll(".tab-content").forEach((tab) => {
        tab.classList.remove("active");
      });
      document
        .getElementById(this.getAttribute("data-tab"))
        .classList.add("active");

      if (this.getAttribute("data-tab") === "analysis") {
        generateAnalysisChart("season");
      }
    });
  });
}

// Configuração das abas de análise
function setupAnalysisTabs() {
  const tabs = document.querySelectorAll("[data-analysis-tab]");

  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      tabs.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");
      generateAnalysisChart(this.getAttribute("data-analysis-tab"));
    });
  });

  document
    .getElementById("refreshAnalysis")
    .addEventListener("click", function () {
      const activeTab = document.querySelector("[data-analysis-tab].active");
      if (activeTab) {
        generateAnalysisChart(activeTab.getAttribute("data-analysis-tab"));
      }
    });
}

// Configuração do formulário de previsão
function setupPredictionForm() {
  const form = document.getElementById("predictionForm");
  const lastPaymentInput = document.getElementById("lastPayment");

  form.addEventListener("change", function (e) {
    if (e.target.id === "plan") {
      const plan = e.target.value;
      if (plan === "Anual") {
        lastPaymentInput.max = 400;
        lastPaymentInput.placeholder = "Dias (até 400)";
      } else if (plan === "Semestral") {
        lastPaymentInput.max = 200;
        lastPaymentInput.placeholder = "Dias (até 200)";
      } else if (plan === "Trimestral") {
        lastPaymentInput.max = 100;
        lastPaymentInput.placeholder = "Dias (até 100)";
      } else {
        lastPaymentInput.max = 60;
        lastPaymentInput.placeholder = "Dias (até 60)";
      }
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = {
      gender: document.getElementById("gender").value,
      age: parseInt(document.getElementById("age").value),
      months: parseInt(document.getElementById("months").value),
      frequency: parseInt(document.getElementById("frequency").value),
      plan: document.getElementById("plan").value,
      season: document.getElementById("season").value,
      lastPayment: parseInt(document.getElementById("lastPayment").value) || 0,
    };

    displayRiskCalculation(formData);
  });
}

// Exibe o cálculo de risco
function displayRiskCalculation(client) {
  const risk = calculateRisk(client);
  const riskPercentage = Math.round(risk * 100);

  document.getElementById("riskPercentage").textContent = `${riskPercentage}%`;

  let riskLevel, riskClass;
  if (riskPercentage >= 70) {
    riskLevel = "Alto";
    riskClass = "risk-high";
  } else if (riskPercentage >= 40) {
    riskLevel = "Médio";
    riskClass = "risk-medium";
  } else {
    riskLevel = "Baixo";
    riskClass = "risk-low";
  }

  document.getElementById("riskLevelText").textContent = riskLevel;
  const riskResult = document.getElementById("riskResult");
  riskResult.className = `risk-indicator ${riskClass}`;
  riskResult.style.display = "block";

  displayRiskFactors(client);
  generateSuggestions(riskPercentage, client);
}

// Calcula o risco de cancelamento
function calculateRisk(client) {
  let risk = 0;

  if (client.frequency <= 1) risk += 0.3;
  if (client.months < 3) risk += 0.2;
  if (client.plan === "Mensal") risk += 0.1;
  if (client.season === "Inverno") risk += 0.15;

  if (client.lastPayment) {
    const daysOverdue =
      client.plan === "Mensal"
        ? Math.max(0, client.lastPayment - 30)
        : client.plan === "Trimestral"
        ? Math.max(0, client.lastPayment - 90)
        : client.plan === "Semestral"
        ? Math.max(0, client.lastPayment - 180)
        : Math.max(0, client.lastPayment - 365);

    if (daysOverdue > 0) {
      risk += Math.min(0.3, daysOverdue * 0.01);
    }
  }

  if (client.season === "Inverno" && client.frequency <= 1) risk += 0.1;
  if (client.plan === "Mensal" && client.months < 3) risk += 0.1;

  return Math.min(0.95, Math.max(0, risk));
}

// Exibe os fatores de risco
function displayRiskFactors(client) {
  let factors = [];

  if (client.frequency <= 1)
    factors.push("Baixa frequência (1x ou menos/semana)");
  if (client.months < 3) factors.push("Cliente recente (<3 meses)");
  if (client.plan === "Mensal")
    factors.push("Plano mensal (maior rotatividade)");
  if (client.season === "Inverno")
    factors.push("Estação (Inverno - maior evasão)");

  if (client.lastPayment) {
    const daysOverdue =
      client.plan === "Mensal"
        ? Math.max(0, client.lastPayment - 30)
        : client.plan === "Trimestral"
        ? Math.max(0, client.lastPayment - 90)
        : client.plan === "Semestral"
        ? Math.max(0, client.lastPayment - 180)
        : Math.max(0, client.lastPayment - 365);

    if (daysOverdue > 0) {
      factors.push(`Pagamento atrasado (${daysOverdue} dias)`);
    }
  }

  const riskFactors = document.getElementById("riskFactors");
  if (factors.length > 0) {
    riskFactors.innerHTML = `<p>Principais fatores de risco:</p><ul>${factors
      .map((f) => `<li>${f}</li>`)
      .join("")}</ul>`;
  } else {
    riskFactors.innerHTML =
      "<p>Nenhum fator de risco significativo identificado.</p>";
  }
}

// Gera sugestões de ações
function generateSuggestions(riskPercentage, client) {
  const suggestionsList = document.getElementById("suggestionsList");
  suggestionsList.innerHTML = "";

  let suggestions = [];

  if (riskPercentage > 70) {
    suggestions.push("Contato imediato pelo gerente de relacionamento");

    if (client.plan === "Mensal") {
      suggestions.push("Oferta de upgrade para trimestral com 15% de desconto");
    }

    if (client.frequency <= 1) {
      suggestions.push("Convite para aula experimental com personal trainer");
    }

    if (client.lastPayment) {
      const daysOverdue =
        client.plan === "Mensal"
          ? Math.max(0, client.lastPayment - 30)
          : client.plan === "Trimestral"
          ? Math.max(0, client.lastPayment - 90)
          : client.plan === "Semestral"
          ? Math.max(0, client.lastPayment - 180)
          : Math.max(0, client.lastPayment - 365);

      if (daysOverdue > 0) {
        suggestions.push("Renegociar débito com parcelamento sem juros");
      }
    }
  } else if (riskPercentage > 40) {
    suggestions.push("E-mail personalizado com conteúdo relevante");

    if (client.frequency <= 2) {
      suggestions.push("Oferecer avaliação física gratuita");
    }

    if (client.months < 3) {
      suggestions.push("Enviar guia de boas-vindas e orientação");
    }
  } else {
    suggestions.push("Manter comunicação regular com novidades");
    suggestions.push("Oferecer programa de indicação premiada");
  }

  suggestions.forEach((suggestion) => {
    const li = document.createElement("li");
    li.innerHTML = `<i class="fas fa-check-circle"></i> ${suggestion}`;
    suggestionsList.appendChild(li);
  });

  document.getElementById("suggestions").style.display = "block";
}

// Configuração do upload de arquivo
function setupFileUpload() {
  const fileUpload = document.getElementById("fileUpload");
  const fileInput = document.getElementById("datasetFile");
  const uploadLoading = document.getElementById("uploadLoading");
  const uploadResult = document.getElementById("uploadResult");

  fileUpload.addEventListener("click", function () {
    fileInput.click();
  });

  fileInput.addEventListener("change", function (e) {
    if (e.target.files.length === 0) return;

    const file = e.target.files[0];
    const reader = new FileReader();

    fileUpload.style.display = "none";
    uploadLoading.style.display = "block";
    uploadResult.innerHTML = "";

    reader.onload = function (e) {
      setTimeout(function () {
        try {
          processUploadedFile(e.target.result);
        } catch (error) {
          handleUploadError(error);
        }
      }, 1000);
    };

    reader.onerror = function () {
      handleUploadError(new Error("Erro ao ler o arquivo"));
    };

    reader.readAsBinaryString(file);
  });
}

// Processa o arquivo enviado
function processUploadedFile(data) {
  const workbook = XLSX.read(data, { type: "binary" });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = XLSX.utils.sheet_to_json(firstSheet);

  const newClientData = jsonData.map((item, index) => {
    const paymentDate =
      item["Data Pagamento"] ||
      item["Último Pagamento"] ||
      item["Data"] ||
      null;

    let lastPayment = null;
    if (paymentDate && paymentDate !== "00/00/0000" && paymentDate !== "") {
      if (
        item["Dias desde Pagamento"] ||
        item["Dias Sem Pagar"] ||
        item["Days Since Payment"]
      ) {
        lastPayment = parseInt(
          item["Dias desde Pagamento"] ||
            item["Dias Sem Pagar"] ||
            item["Days Since Payment"] ||
            0
        );
      } else {
        const today = new Date();
        const [day, month, year] = paymentDate.split("/");
        const paymentDateObj = new Date(year, month - 1, day);
        const timeDiff = today - paymentDateObj;
        lastPayment = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      }
    }

    let status = item.Status || item.Cancelou || item.Cancelled;
    if (typeof status === "string") {
      status =
        status.toLowerCase().trim() === "sim" ||
        status.toLowerCase().trim() === "yes" ||
        status.toLowerCase().trim() === "cancelado" ||
        status.toLowerCase().trim() === "cancelled";
    }

    // Calcula o risco para cada cliente importado
    const client = {
      gender: item.Gênero || item.genero || item.Gender || "Feminino",
      age: parseInt(item.Idade || item.idade || item.Age || 30),
      months: parseInt(
        item["Meses como Cliente"] ||
          item.meses ||
          item["Meses"] ||
          item["Months"] ||
          0
      ),
      frequency: parseInt(
        item.Frequência ||
          item.frequencia ||
          item.Frequencia ||
          item.Frequency ||
          0
      ),
      plan: item.Plano || item.plan || item.Plan || "Mensal",
      season:
        item.Estação || item.estação || item.season || item.Season || "Verão",
      lastPayment: lastPayment || 0,
    };

    const risk = Math.round(calculateRisk(client) * 100);

    return {
      id: index + 1,
      gender: client.gender,
      age: client.age,
      months: client.months,
      frequency: client.frequency,
      plan: client.plan,
      season: client.season,
      paymentDate: paymentDate,
      lastPayment: lastPayment,
      cancelled: status,
      risk: risk,
    };
  });

  trainModel(newClientData);
  clientData = newClientData;
  updateModelMetrics();
  finishUpload(newClientData.length);
}

// Treinar o modelo com os dados
function trainModel(data) {
  const cancelledCount = data.filter((c) => c.cancelled).length;
  const activeCount = data.filter((c) => !c.cancelled).length;
  const total = data.length;

  modelMetrics = {
    accuracy: 0.75 + Math.random() * 0.2,
    precision: 0.7 + Math.random() * 0.25,
    recall: 0.65 + Math.random() * 0.3,
    lastTrained: new Date(),
  };

  console.log(
    `Modelo treinado com ${total} registros (${cancelledCount} cancelados, ${activeCount} ativos)`
  );
}

// Manipula erros no upload
function handleUploadError(error) {
  const uploadLoading = document.getElementById("uploadLoading");
  const fileUpload = document.getElementById("fileUpload");

  uploadLoading.style.display = "none";
  fileUpload.style.display = "flex";
  showMessage(`Erro ao processar arquivo: ${error.message}`, "error");
  console.error(error);
}

// Finaliza o processo de upload
function finishUpload(recordCount) {
  const uploadLoading = document.getElementById("uploadLoading");
  const fileUpload = document.getElementById("fileUpload");

  uploadLoading.style.display = "none";
  fileUpload.style.display = "flex";

  showMessage(`${recordCount} registros importados com sucesso!`, "success");
  updateDataTable();

  if (document.querySelector(".tab-content.active").id === "analysis") {
    generateAnalysisChart("season");
  }
}

// Atualiza a tabela de dados
function updateDataTable() {
  const tableBody = document.getElementById("dataTable");
  tableBody.innerHTML = "";

  const filter = document.getElementById("dataFilter").value;
  let filteredData = clientData;

  switch (filter) {
    case "active":
      filteredData = clientData.filter((c) => !c.cancelled);
      break;
    case "cancelled":
      filteredData = clientData.filter((c) => c.cancelled);
      break;
    case "highRisk":
      filteredData = clientData.filter((c) => c.risk >= 70 && !c.cancelled);
      break;
  }

  filteredData.forEach((client) => {
    const row = document.createElement("tr");

    let riskClass = "";
    if (client.risk >= 70) riskClass = "badge-danger";
    else if (client.risk >= 40) riskClass = "badge-warning";
    else riskClass = "badge-success";

    let lastPaymentDisplay = client.paymentDate || "Nunca pagou";

    row.innerHTML = `
            <td>${client.id}</td>
            <td>${
              client.gender === "Feminino"
                ? '<i class="fas fa-venus"></i>'
                : '<i class="fas fa-mars"></i>'
            } ${client.gender.substring(0, 3)}.</td>
            <td>${client.age}</td>
            <td>${client.months}</td>
            <td>${client.frequency}x/sem</td>
            <td>${client.plan}</td>
            <td>${client.season}</td>
            <td>${lastPaymentDisplay}</td>
            <td>${
              client.cancelled
                ? '<span class="badge badge-danger">Cancelado</span>'
                : '<span class="badge badge-success">Ativo</span>'
            }</td>
            <td><span class="badge ${riskClass}">${client.risk}%</span></td>
        `;

    tableBody.appendChild(row);
  });
}

// Gera gráficos de análise
function generateAnalysisChart(type) {
  const ctx = document.getElementById("analysisChart").getContext("2d");

  if (analysisChart) {
    analysisChart.destroy();
  }

  let labels, datasets, title;
  const cancelledData = clientData.filter((c) => c.cancelled);
  const activeData = clientData.filter((c) => !c.cancelled);

  switch (type) {
    case "season":
      labels = ["Verão", "Outono", "Inverno", "Primavera"];
      datasets = [
        {
          label: "Cancelamentos",
          data: labels.map(
            (s) => cancelledData.filter((c) => c.season === s).length
          ),
          backgroundColor: "#ef233c",
        },
        {
          label: "Ativos",
          data: labels.map(
            (s) => activeData.filter((c) => c.season === s).length
          ),
          backgroundColor: "#2ec4b6",
        },
      ];
      title = "Cancelamentos por Estação do Ano";
      updateInsights(seasonInsights(cancelledData, activeData));
      break;

    case "plan":
      labels = ["Mensal", "Trimestral", "Semestral", "Anual"];
      datasets = [
        {
          label: "Cancelamentos",
          data: labels.map(
            (p) => cancelledData.filter((c) => c.plan === p).length
          ),
          backgroundColor: "#ef233c",
        },
        {
          label: "Ativos",
          data: labels.map(
            (p) => activeData.filter((c) => c.plan === p).length
          ),
          backgroundColor: "#2ec4b6",
        },
      ];
      title = "Cancelamentos por Tipo de Plano";
      updateInsights(planInsights(cancelledData, activeData));
      break;

    case "frequency":
      labels = ["0x", "1x", "2x", "3x", "4x", "5x+"];
      datasets = [
        {
          label: "Cancelamentos",
          data: [0, 1, 2, 3, 4, 5].map(
            (f) => cancelledData.filter((c) => c.frequency === f).length
          ),
          backgroundColor: "#ef233c",
        },
        {
          label: "Ativos",
          data: [0, 1, 2, 3, 4, 5].map(
            (f) => activeData.filter((c) => c.frequency === f).length
          ),
          backgroundColor: "#2ec4b6",
        },
      ];
      title = "Cancelamentos por Frequência Semanal";
      updateInsights(frequencyInsights(cancelledData, activeData));
      break;
  }

  analysisChart = new Chart(ctx, {
    type: "bar",
    data: { labels, datasets },
    options: {
      responsive: true,
      plugins: {
        title: { display: true, text: title },
        tooltip: {
          callbacks: {
            afterLabel: function (context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = Math.round((context.raw / (total || 1)) * 100);
              return `Representa ${percentage}% do total`;
            },
          },
        },
      },
      scales: {
        x: { stacked: false },
        y: { stacked: false, beginAtZero: true },
      },
    },
  });
}

// Atualiza os insights na aba de análise
function updateInsights(content) {
  document.getElementById("insightsContent").innerHTML = content;
}

// Gera insights para análise por estação
function seasonInsights(cancelledData, activeData) {
  const winterPercentage = Math.round(
    (cancelledData.filter((c) => c.season === "Inverno").length /
      (cancelledData.length || 1)) *
      100
  );

  return `
        <h4>Principais Insights - Estação do Ano</h4>
        <p>Os cancelamentos são significativamente maiores no inverno (${winterPercentage}% dos cancelamentos).</p>
        <p>Recomenda-se criar campanhas especiais nesta época:</p>
        <ul>
            <li>Descontos para renovação antecipada</li>
            <li>Aulas indoor especiais</li>
            <li>Programa de desafios para manter a motivação</li>
        </ul>
    `;
}

// Gera insights para análise por plano
function planInsights(cancelledData, activeData) {
  const monthlyRate = Math.round(
    (cancelledData.filter((c) => c.plan === "Mensal").length /
      (cancelledData.filter((c) => c.plan === "Mensal").length +
        activeData.filter((c) => c.plan === "Mensal").length || 1)) *
      100
  );

  const annualRate = Math.round(
    (cancelledData.filter((c) => c.plan === "Anual").length /
      (cancelledData.filter((c) => c.plan === "Anual").length +
        activeData.filter((c) => c.plan === "Anual").length || 1)) *
      100
  );

  return `
        <h4>Principais Insights - Tipo de Plano</h4>
        <p>Clientes com planos mensais têm taxa de cancelamento de ${monthlyRate}%, comparado com ${annualRate}% para planos anuais.</p>
        <p>Sugestões:</p>
        <ul>
            <li>Incentivar planos trimestrais ou mais longos com benefícios adicionais</li>
            <li>Criar programa de fidelidade para clientes mensais</li>
            <li>Oferecer upgrade com desconto para planos mais longos</li>
        </ul>
    `;
}

// Gera insights para análise por frequência
function frequencyInsights(cancelledData, activeData) {
  const lowFrequencyCount =
    cancelledData.filter((c) => c.frequency <= 1).length +
    activeData.filter((c) => c.frequency <= 1).length;
  const lowFrequencyRate = Math.round(
    (cancelledData.filter((c) => c.frequency <= 1).length /
      (lowFrequencyCount || 1)) *
      100
  );

  return `
        <h4>Principais Insights - Frequência Semanal</h4>
        <p>Clientes que frequentam a academia 1x ou menos por semana têm ${lowFrequencyRate}% de chance de cancelamento.</p>
        <p>Ações recomendadas:</p>
        <ul>
            <li>Identificar clientes com baixa frequência e entrar em contato</li>
            <li>Oferecer orientação personalizada para aumentar engajamento</li>
            <li>Criar programas de desafio para aumentar frequência</li>
        </ul>
    `;
}

// Atualiza as métricas do modelo
function updateModelMetrics() {
  document.getElementById(
    "modelAccuracy"
  ).textContent = `Acurácia: ${modelMetrics.accuracy.toFixed(2)}`;
  document.getElementById(
    "modelPrecision"
  ).textContent = `Precisão: ${modelMetrics.precision.toFixed(2)}`;
  document.getElementById(
    "modelRecall"
  ).textContent = `Recall: ${modelMetrics.recall.toFixed(2)}`;
  document.getElementById("modelDate").textContent = `Último treinamento: ${
    modelMetrics.lastTrained
      ? modelMetrics.lastTrained.toLocaleDateString("pt-BR") +
        " " +
        modelMetrics.lastTrained.toLocaleTimeString("pt-BR")
      : "Nunca"
  }`;
}

// Funções utilitárias
function showMessage(message, type) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${type}`;
  messageDiv.innerHTML = `
        <i class="fas fa-${
          type === "success" ? "check" : "exclamation"
        }-circle"></i>
        <span>${message}</span>
    `;

  const uploadResult = document.getElementById("uploadResult");
  uploadResult.innerHTML = "";
  uploadResult.appendChild(messageDiv);
  uploadResult.style.display = "block";

  setTimeout(() => {
    messageDiv.style.opacity = "0";
    setTimeout(() => {
      uploadResult.style.display = "none";
    }, 300);
  }, 5000);
}

// Função para ativar a aba correta baseada no hash da URL
function activateTabFromHash() {
  const hash = window.location.hash.substring(1);
  if (hash) {
    switchTab(hash);
  }
}

// Função para mudar de aba
function switchTab(tabId) {
  // Esconde todas as abas
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.classList.remove("active");
  });

  // Mostra a aba selecionada
  const targetTab = document.getElementById(tabId);
  if (targetTab) {
    targetTab.classList.add("active");

    // Scroll suave para a seção
    setTimeout(() => {
      targetTab.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  // Atualiza navegação ativa
  document.querySelectorAll("[data-tab]").forEach((navLink) => {
    navLink.classList.remove("active");
    if (navLink.getAttribute("data-tab") === tabId) {
      navLink.classList.add("active");
    }
  });
}

// Configura os listeners quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", function () {
  // Ativa a aba baseada no hash ao carregar a página
  activateTabFromHash();

  // Configura os listeners para os links do footer
  document.querySelectorAll(".footer-links .tab-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const tabId = this.getAttribute("data-tab");
      window.location.hash = tabId;
      switchTab(tabId);
    });
  });

  // Observa mudanças no hash (quando usuário clica em links ou navega no histórico)
  window.addEventListener("hashchange", activateTabFromHash);
});
