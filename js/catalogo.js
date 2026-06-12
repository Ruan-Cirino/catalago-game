const API_JOGOS = "https://www.freetogame.com/api/games";

const listaJogos = document.getElementById("listaJogos");
const mensagem = document.getElementById("mensagem");
const pesquisa = document.getElementById("pesquisa");
const genero = document.getElementById("genero");
const contador = document.getElementById("contador");

let jogos = [];

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

function jogoFavoritado(id) {
  return buscarFavoritos().some(function (jogo) {
    return jogo.id === id;
  });
}

function alternarFavorito(jogo) {
  let favoritos = buscarFavoritos();
  const existe = favoritos.some(function (favorito) {
    return favorito.id === jogo.id;
  });

  if (existe) {
    favoritos = favoritos.filter(function (favorito) {
      return favorito.id !== jogo.id;
    });
  } else {
    favoritos.push(jogo);
  }

  salvarFavoritos(favoritos);
  exibirJogos();
}

function criarCard(jogo) {
  const card = document.createElement("article");
  card.className = "card";

  const favorito = jogoFavoritado(jogo.id) ? "★" : "☆";

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
        <button class="favoritar" type="button" aria-label="Favoritar ${jogo.title}">${favorito}</button>
      </div>
    </div>
  `;

  card.querySelector(".favoritar").addEventListener("click", function () {
    alternarFavorito(jogo);
  });

  return card;
}

function preencherGeneros() {
  const generos = [...new Set(jogos.map(function (jogo) {
    return jogo.genre;
  }).filter(Boolean))].sort();

  generos.forEach(function (nomeGenero) {
    const option = document.createElement("option");
    option.value = nomeGenero;
    option.textContent = nomeGenero;
    genero.appendChild(option);
  });
}

function filtrarJogos() {
  const termo = pesquisa.value.trim().toLowerCase();
  const generoEscolhido = genero.value;

  return jogos.filter(function (jogo) {
    const combinaNome = jogo.title.toLowerCase().includes(termo);
    const combinaGenero = !generoEscolhido || jogo.genre === generoEscolhido;
    return combinaNome && combinaGenero;
  });
}

function exibirJogos() {
  const jogosFiltrados = filtrarJogos();
  listaJogos.innerHTML = "";
  contador.textContent = `${jogosFiltrados.length} jogo(s)`;

  if (jogosFiltrados.length === 0) {
    mensagem.textContent = "Nenhum jogo encontrado.";
    return;
  }

  mensagem.textContent = "";

  jogosFiltrados.forEach(function (jogo) {
    listaJogos.appendChild(criarCard(jogo));
  });
}

async function carregarJogos() {
  try {
    const resposta = await fetch(API_JOGOS);

    if (!resposta.ok) {
      throw new Error("Erro ao carregar jogos.");
    }

    jogos = await resposta.json();
    preencherGeneros();
    exibirJogos();
  } catch (erro) {
    mensagem.textContent = "Nao foi possivel carregar os jogos da API.";
    contador.textContent = "Erro";
  }
}

function aplicarBuscaDaUrl() {
  const parametros = new URLSearchParams(window.location.search);
  const termo = parametros.get("q");

  if (termo) {
    pesquisa.value = termo;
    const buscaTopo = document.querySelector(".topo-busca input");
    buscaTopo.value = termo;
  }
}

pesquisa.addEventListener("input", exibirJogos);
genero.addEventListener("change", exibirJogos);

configurarMenu();
configurarSair();
atualizarAvatar();
aplicarBuscaDaUrl();
carregarJogos();
