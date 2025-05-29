// user.js

function obterInfoUsuario(callback) {
  const user = prompt("Digite seu nome de usuário:") || "Desconhecido";
  const agora = new Date();
  const data = agora.toLocaleDateString('pt-BR');
  const hora = agora.toLocaleTimeString('pt-BR');

  callback({ user, data, hora });
}

export default obterInfoUsuario;