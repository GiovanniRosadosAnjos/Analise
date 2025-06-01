const API_URL = "https://sheetdb.io/api/v1/406nk87qmkmuh?sheet=dbAvaliacao"; // api 1
//const API_URL = "https://sheetdb.io/api/v1/ygjx7hr6r521t?sheet=dbAvaliacao"; // api 2

document.getElementById('formAuditoria').addEventListener('submit', function (e) {
  e.preventDefault();

  const numeroProcesso = document.getElementById('numeroProcesso').value.trim();
  const item422res = document.getElementById('item422res').value.trim();
  const item422reg = document.getElementById('item422reg').value.trim();
  const memorialDescritivoA = document.getElementById('memorialDescritivo').value.trim();
  const memorialDescritivoB = document.getElementById('memorialDescritivoB').value.trim();

  if (!numeroProcesso) {
    alert("Por favor, preencha o campo número do processo.");
    return;
  }

  // Verifica se já existe um registro inicial para esse número de processo
  fetch(`https://sheetdb.io/api/v1/406nk87qmkmuh/search?sheet=dbAvaliacao&numeroProcesso=${encodeURIComponent(numeroProcesso)}&revisao=0`)

  //fetch(`https://sheetdb.io/api/v1/ygjx7hr6r521t/search?sheet=dbAvaliacao&numeroProcesso=${encodeURIComponent(numeroProcesso)}&revisao=0`)



    .then(response => {
      if (!response.ok) {
        throw new Error("Erro na consulta de duplicidade");
      }
      return response.json();
    })
    .then(data => {
      if (data.length > 0) {
        alert('Já existe um registro inicial (revisão 0) para esse número de processo.');
      } else {
        // Se não existir, envia o novo registro
        fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            data: {
              numeroProcesso: numeroProcesso,
              item422res: item422res,
              item422reg: item422reg,
              memorialDescritivoA: memorialDescritivoA,
              memorialDescritivoB: memorialDescritivoB,
              revisao: "0"
            }
          })
        })
        .then(response => {
          if (response.ok) {
            alert('Dados enviados com sucesso!');
            document.getElementById('formAuditoria').reset();
          } else {
            alert('Erro ao enviar os dados.');
          }
        })
        .catch(error => {
          alert('Erro na conexão: ' + error.message);
        });
      }
    })
    .catch(error => {
      alert('Erro ao verificar duplicação: ' + error.message);
    });
});
