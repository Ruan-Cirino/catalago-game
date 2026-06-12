const botao = document.getElementById("menuBtn");
const menu = document.getElementById("menu");
const sair = document.getElementById("sair");

botao.addEventListener("click", function () {
  menu.classList.toggle("aberto");
});

sair.addEventListener("click", function () {
  localStorage.removeItem("catalogoGamerUsuario");
});

function atualizarAvatar() {
  const avatar = document.getElementById("perfilAvatar");
  const dropdownAvatar = document.getElementById("dropdownAvatar");
  const contaNome = document.getElementById("contaNome");
  const dropdownNome = document.getElementById("dropdownNome");
  const usuario = JSON.parse(localStorage.getItem("catalogoGamerUsuario")) || {};
  const perfil = JSON.parse(localStorage.getItem("catalogoGamerPerfil")) || {};
  const nome = perfil.nome || usuario.nome || "Perfil";
  const primeiroNome = nome === "Perfil" ? "visitante" : nome.split(" ")[0];

  contaNome.textContent = primeiroNome === "visitante" ? "Entrar ou Cadastrar" : primeiroNome;
  dropdownNome.textContent = primeiroNome;

  if (perfil.foto) {
    [avatar, dropdownAvatar].forEach(function (item) {
      item.textContent = "";
      item.style.backgroundImage = `url(${perfil.foto})`;
    });
  } else {
    [avatar, dropdownAvatar].forEach(function (item) {
      item.textContent = nome.charAt(0).toUpperCase();
      item.style.backgroundImage = "";
    });
  }
}

atualizarAvatar();
