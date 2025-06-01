
// API 1: 406nk87qmkmuh      
const API_URL = "https://sheetdb.io/api/v1/406nk87qmkmuh";
const FLUTUANTE_API_URL = "https://sheetdb.io/api/v1/406nk87qmkmuh";

// API 2:  ygjx7hr6r521t
//const API_URL = "https://sheetdb.io/api/v1/ygjx7hr6r521t";
//const FLUTUANTE_API_URL = "https://sheetdb.io/api/v1/ygjx7hr6r521t";

// Elementos do formulário busca
const formBusca =             document.getElementById("formBuscaProcesso");
const inputNumeroProcesso =   document.getElementById("numeroProcessoBusca");
const modal =                 document.getElementById("modalProcessos");
const listaProcessos =        document.getElementById("listaProcessos");
const fecharModal =           document.getElementById("fecharModal");

// Elementos do formulário revisão
const formRevisao = document.getElementById("formRevisao");
const inputNumeroProcessoRevisao = document.getElementById("numeroProcesso");

const item422resInput = document.getElementById("item422res");
const item422regInput = document.getElementById("item422reg");
const memorialDescritivoAinput = document.getElementById("memorialDescritivoA");
const memorialDescritivoBinput = document.getElementById("memorialDescritivoB");

// ---------------------
// BUSCA PROCESSO - abrir modal e carregar lista de processos
formBusca.addEventListener("submit", e => {
  e.preventDefault();

  modal.style.display = "block";
  listaProcessos.innerHTML = "<li>Carregando...</li>";

  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      const processosUnicos = [...new Set(data.map(item => item.numeroProcesso))].sort();

      if (processosUnicos.length === 0) {
        listaProcessos.innerHTML = "<li>Nenhum processo encontrado.</li>";
        return;
      }

      listaProcessos.innerHTML = processosUnicos.map(proc => `<li>${proc}</li>`).join("");

      // Duplo clique para selecionar processo
      document.querySelectorAll("#listaProcessos li").forEach(li => {
        li.addEventListener("dblclick", () => {
          inputNumeroProcesso.value = li.textContent;
          inputNumeroProcessoRevisao.value = li.textContent;
          modal.style.display = "none";
          carregarUltimaRevisao(li.textContent);
          carregarProduto(li.textContent); // Chama a função para preencher a DIV flutuante
        });
      });
    })
    .catch(() => {
      listaProcessos.innerHTML = "<li>Erro ao carregar processos.</li>";
    });
});

// Fechar modal
fecharModal.addEventListener("click", () => {
  modal.style.display = "none";
});
window.addEventListener("click", e => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// ---------------------
// FUNÇÃO para carregar última revisão no formulário revisão
function carregarUltimaRevisao(numero) {
  fetch(`${API_URL}/search?numeroProcesso=${encodeURIComponent(numero)}`)
    .then(res => res.json())
    .then(data => {
      if (data.length === 0) {
        alert("Processo não encontrado.");
        item422resInput.value = "";
        item422regInput.value = "";
        memorialDescritivoAinput.value = "";
        memorialDescritivoBinput.value = "";
        return;
      }

      const ultimaRevisao = data.reduce((prev, curr) => {
        return parseInt(curr.revisao) > parseInt(prev.revisao) ? curr : prev;
      });

      item422resInput.value = ultimaRevisao.item422res || "";
      item422regInput.value = ultimaRevisao.item422reg || "";
      memorialDescritivoAinput.value = ultimaRevisao.memorialDescritivoA || "";
      memorialDescritivoBinput.value = ultimaRevisao.memorialDescritivoB || "";
    })
    .catch(err => {
      alert("Erro ao buscar o processo: " + err.message);
      item422resInput.value = "";
      item422regInput.value = "";
      memorialDescritivoAinput.value = "";
      memorialDescritivoBinput.value = "";
    });
}

// ---------------------
// SUBMISSÃO DO FORMULÁRIO REVISÃO - salvar nova revisão
formRevisao.addEventListener("submit", e => {
  e.preventDefault();

  const numero = inputNumeroProcessoRevisao.value.trim();
  const novoItem422res = item422resInput.value.trim();
  const novoItem422reg = item422regInput.value.trim();
  const novomemorialDescritivoA = memorialDescritivoAinput.value.trim();
  const novomemorialDescritivoB = memorialDescritivoBinput.value.trim();

  if (!numero) {
    alert("Todos os campos devem ser preenchidos.");
    return;
  }

  fetch(`${API_URL}/search?numeroProcesso=${encodeURIComponent(numero)}`)
    .then(res => res.json())
    .then(data => {
      if (data.length === 0) {
        alert("Processo não encontrado para revisão.");
        return;
      }

      const maiorRevisao = data.reduce((max, atual) => {
        const rev = parseInt(atual.revisao);
        return rev > max ? rev : max;
      }, 0);

      const novaRevisao = (maiorRevisao + 1).toString();

      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            numeroProcesso: numero,
            item422res: novoItem422res,
            item422reg: novoItem422reg,
            memorialDescritivoA: novomemorialDescritivoA,
            memorialDescritivoB: novomemorialDescritivoB,
            revisao: novaRevisao
          }
        })
      })
        .then(response => {
          if (response.ok) {
            alert("Revisão adicionada com sucesso!");
            formRevisao.reset();
            inputNumeroProcesso.value = "";
            inputNumeroProcessoRevisao.value = "";
          } else {
            alert("Erro ao adicionar a revisão.");
          }
        })
        .catch(err => alert("Erro ao enviar revisão: " + err.message));
    })
    .catch(err => alert("Erro ao verificar revisões: " + err.message));
});

// ---------------------
// PREENCHER DADOS NA DIV FLUTUANTE
function carregarProduto(numeroProcesso) {
  fetch(`${API_URL}/search?sheet=dbProduto&Processo=${encodeURIComponent(numeroProcesso)}`)
    .then(response => response.json())
    .then(data => {
      if (data.length > 0) {
        const produto = data[0];
        document.getElementById('flutuante').innerHTML = `
          <strong>Tipo:</strong> ${produto.Tipo || '-'}<br>
          <strong>Modelo:</strong> ${produto.Modelo || '-'}<br>
          <strong>Tensão:</strong> ${produto.Tensao || '-'}
        `;
      } else {
        document.getElementById('flutuante').innerHTML = "Produto não encontrado.";
      }
    })
    .catch(() => {
      document.getElementById('flutuante').innerHTML = "Erro ao buscar o produto.";
    });
}