const listaFavoritos = document.getElementById("listaFavoritos");
const mensagem = document.getElementById("mensagem");
const limparFavoritos = document.getElementById("limparFavoritos");

function configurarMenu() {
  const botao = document.getElementById("menuBtn");
  const menu = document.getElementById("menu");

  botao.addEventListener("click", function () {
    menu.classList.toggle("aberto");
  });
}

function configurarSair() {
  document.getElementById("sair").addEventListener("click", function () {
    localStorage.removeItem("catalogoGamerUsuario");
  });
}

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

function buscarFavoritos() {
  return JSON.parse(localStorage.getItem("catalogoGamerFavoritos")) || [];
}

function salvarFavoritos(favoritos) {
  localStorage.setItem("catalogoGamerFavoritos", JSON.stringify(favoritos));
}

function removerFavorito(id) {
  const favoritos = buscarFavoritos().filter(function (jogo) {
    return jogo.id !== id;
  });

  salvarFavoritos(favoritos);
  exibirFavoritos();
}

function criarCard(jogo) {
  const card = document.createElement("article");
  card.className = "card";

  card.innerHTML = `
    <img src="${jogo.thumbnail}" alt="Imagem do jogo ${jogo.title}">
    <div class="card-body">
      <h2>${jogo.title}</h2>
      <div class="meta">
        <span class="pill">${jogo.genre || "Sem genero"}</span>
        <span class="pill">${jogo.platform || "Plataforma nao informada"}</span>
      </div>
      <div class="acoes">
        <a class="detalhar" href="detalhes.html?id=${jogo.id}">Detalhes</a>
        <button class="remover" type="button" aria-label="Remover ${jogo.title}">X</button>
      </div>
    </div>
  `;

  card.querySelector(".remover").addEventListener("click", function () {
    removerFavorito(jogo.id);
  });

  return card;
}

function exibirFavoritos() {
  const favoritos = buscarFavoritos();
  listaFavoritos.innerHTML = "";

  if (favoritos.length === 0) {
    mensagem.textContent = "Nenhum favorito salvo ainda.";
    return;
  }

  mensagem.textContent = "";

  favoritos.forEach(function (jogo) {
    listaFavoritos.appendChild(criarCard(jogo));
  });
}

limparFavoritos.addEventListener("click", function () {
  salvarFavoritos([]);
  exibirFavoritos();
});

configurarMenu();
configurarSair();
atualizarAvatar();
exibirFavoritos();
