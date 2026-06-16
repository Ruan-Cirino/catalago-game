const detalhes = document.getElementById("detalhes");
const mensagem = document.getElementById("mensagem");

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
    localStorage.removeItem("catalogoGamerPerfil");
    localStorage.removeItem("catalogoGamerFavoritos");
    window.location.href = "login.html";
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
    favoritos.push({
      id: jogo.id,
      title: jogo.title,
      thumbnail: jogo.thumbnail,
      genre: jogo.genre,
      platform: jogo.platform,
      short_description: jogo.short_description
    });
  }

  salvarFavoritos(favoritos);
  document.getElementById("favoritoBtn").textContent = jogoFavoritado(jogo.id) ? "Remover dos favoritos" : "Adicionar aos favoritos";
}

function parametroId() {
  const parametros = new URLSearchParams(window.location.search);
  return parametros.get("id");
}

function texto(valor) {
  return valor || "Nao informado";
}

function exibirDetalhes(jogo) {
  mensagem.textContent = "";
  detalhes.innerHTML = `
    <div class="capa">
      <img src="${jogo.thumbnail}" alt="Imagem do jogo ${jogo.title}">
    </div>
    <article class="conteudo">
      <p class="tag">${texto(jogo.genre)}</p>
      <h1>${jogo.title}</h1>
      <p class="descricao">${texto(jogo.description || jogo.short_description)}</p>

      <div class="info">
        <div><strong>Plataforma</strong>${texto(jogo.platform)}</div>
        <div><strong>Desenvolvedora</strong>${texto(jogo.developer)}</div>
        <div><strong>Publicadora</strong>${texto(jogo.publisher)}</div>
        <div><strong>Lancamento</strong>${texto(jogo.release_date)}</div>
      </div>

      <div class="acoes">
        <button id="favoritoBtn" type="button">${jogoFavoritado(jogo.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}</button>
        <a class="site" href="${jogo.game_url}" target="_blank" rel="noopener">Site do jogo</a>
      </div>
    </article>
  `;

  document.getElementById("favoritoBtn").addEventListener("click", function () {
    alternarFavorito(jogo);
  });
}

async function carregarDetalhes() {
  const id = parametroId();

  if (!id) {
    mensagem.textContent = "Jogo nao encontrado.";
    return;
  }

  try {
    const resposta = await fetch(`https://www.freetogame.com/api/game?id=${id}`);

    if (!resposta.ok) {
      throw new Error("Erro ao carregar detalhes.");
    }

    const jogo = await resposta.json();
    exibirDetalhes(jogo);
  } catch (erro) {
    mensagem.textContent = "Nao foi possivel carregar os detalhes do jogo.";
  }
}

configurarMenu();
configurarSair();
atualizarAvatar();
carregarDetalhes();
