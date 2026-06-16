// URL da API que fornece a lista de jogos //
const API_JOGOS = "https://www.freetogame.com/api/games";

// Captura elementos do HTML //
const listaJogos = document.getElementById("listaJogos");
const mensagem = document.getElementById("mensagem");
const pesquisa = document.getElementById("pesquisa");
const genero = document.getElementById("genero");
const contador = document.getElementById("contador");

// Array que armazenará todos os jogos da API //
let jogos = [];

// Configura o botão do menu lateral //
function configurarMenu() {
  const botao = document.getElementById("menuBtn");
  const menu = document.getElementById("menu");

    // Abre ou fecha o menu ao clicar //
  botao.addEventListener("click", function () {
    menu.classList.toggle("aberto");
  });
}

// Configura o botão de sair da conta //
function configurarSair() {
  document.getElementById("sair").addEventListener("click", function () {
    localStorage.removeItem("catalogoGamerUsuario"); // Remove os dados do usuário armazenados
    localStorage.removeItem("catalogoGamerPerfil");
    localStorage.removeItem("catalogoGamerFavoritos");
    window.location.href = "login.html";
  });
}

// Atualiza as informações do avatar do usuário //
function atualizarAvatar() {

  // Busca elementos relacionados ao perfil
  const avatar = document.getElementById("perfilAvatar");
  const dropdownAvatar = document.getElementById("dropdownAvatar");
  const contaNome = document.getElementById("contaNome");
  const dropdownNome = document.getElementById("dropdownNome");

  // Recupera dados salvos no navegador
  const usuario = JSON.parse(localStorage.getItem("catalogoGamerUsuario")) || {};
  const perfil = JSON.parse(localStorage.getItem("catalogoGamerPerfil")) || {};

  // Define o nome que será exibido //
  const nome = perfil.nome || usuario.nome || "Perfil";
  const primeiroNome = nome === "Perfil" ? "visitante" : nome.split(" ")[0];

   // Atualiza o texto do perfil //
  contaNome.textContent = primeiroNome === "visitante" ? "Entrar ou Cadastrar" : primeiroNome;
  dropdownNome.textContent = primeiroNome;

   // Verifica se existe foto de perfil //
  if (perfil.foto) {
    [avatar, dropdownAvatar].forEach(function (item) {
      item.textContent = "";
      item.style.backgroundImage = `url(${perfil.foto})`;
    });
  } else {

    // Caso não exista foto, mostra a inicial do nome  //
    [avatar, dropdownAvatar].forEach(function (item) {
      item.textContent = nome.charAt(0).toUpperCase();
      item.style.backgroundImage = "";
    });
  }
}

// Retorna a lista de favoritos salva no navegador //
function buscarFavoritos() {
  return JSON.parse(localStorage.getItem("catalogoGamerFavoritos")) || [];
}

// Salva a lista de favoritos //
function salvarFavoritos(favoritos) {
  localStorage.setItem("catalogoGamerFavoritos", JSON.stringify(favoritos));
}

// Verifica se um jogo já está favoritado //
function jogoFavoritado(id) {
  return buscarFavoritos().some(function (jogo) {
    return jogo.id === id;
  });
}

// Adiciona ou remove um jogo dos favoritos
function alternarFavorito(jogo) {
  let favoritos = buscarFavoritos();

  // Verifica se o jogo já existe nos favoritos
  const existe = favoritos.some(function (favorito) {
    return favorito.id === jogo.id;
  });

  
  if (existe) {

    // Remove dos favoritos
    favoritos = favoritos.filter(function (favorito) {
      return favorito.id !== jogo.id;
    });
  } else {

     // Adiciona aos favoritos
    favoritos.push(jogo);
  }

  
  salvarFavoritos(favoritos); // Salva as alterações
  exibirJogos(); // Atualiza a tela
}

// Cria um card de jogo dinamicamente
function criarCard(jogo) {
  const card = document.createElement("article");
  card.className = "card";

  // Define o ícone de favorito
  const favorito = jogoFavoritado(jogo.id) ? "★" : "☆";

  // Monta o HTML do card
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

  // Evento para favoritar o jogo 
  card.querySelector(".favoritar").addEventListener("click", function () {
    alternarFavorito(jogo);
  });

  return card;
}

// Preenche automaticamente o filtro de gêneros
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

// Filtra os jogos conforme pesquisa e gênero selecionado
function filtrarJogos() {
  const termo = pesquisa.value.trim().toLowerCase();
  const generoEscolhido = genero.value;

  return jogos.filter(function (jogo) {
    const combinaNome = jogo.title.toLowerCase().includes(termo);
    const combinaGenero = !generoEscolhido || jogo.genre === generoEscolhido;
    return combinaNome && combinaGenero;
  });
}

// Exibe os jogos na tela
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

// Carrega os jogos da API
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

// Aplica uma busca recebida pela URL
function aplicarBuscaDaUrl() {
  const parametros = new URLSearchParams(window.location.search);
  const termo = parametros.get("q");

  if (termo) {
    pesquisa.value = termo;
    const buscaTopo = document.querySelector(".topo-busca input");
    buscaTopo.value = termo;
  }
}

pesquisa.addEventListener("input", exibirJogos); // Atualiza a lista conforme o usuário digita
genero.addEventListener("change", exibirJogos); // Atualiza a lista quando troca o gênero

// Inicialização do sistema
configurarMenu();
configurarSair();
atualizarAvatar();
aplicarBuscaDaUrl();
carregarJogos();
