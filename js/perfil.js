const form = document.getElementById("perfilForm");
const mensagem = document.getElementById("mensagem");
const fotoInput = document.getElementById("foto");
const removerFoto = document.getElementById("removerFoto");

let fotoAtual = "";

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

function buscarUsuario() {
  return JSON.parse(localStorage.getItem("catalogoGamerUsuario")) || {};
}

function buscarPerfil() {
  return JSON.parse(localStorage.getItem("catalogoGamerPerfil")) || {};
}

function inicial(nome) {
  return (nome || "Perfil").charAt(0).toUpperCase();
}

function atualizarPreview() {
  const nome = document.getElementById("nome").value.trim() || "Jogador";
  const email = document.getElementById("email").value.trim() || "email@exemplo.com";
  const fotoPreview = document.getElementById("fotoPreview");
  const avatar = document.getElementById("perfilAvatar");
  const dropdownAvatar = document.getElementById("dropdownAvatar");
  const contaNome = document.getElementById("contaNome");
  const dropdownNome = document.getElementById("dropdownNome");
  const primeiroNome = nome === "Jogador" ? "visitante" : nome.split(" ")[0];

  document.getElementById("nomePreview").textContent = nome;
  document.getElementById("emailPreview").textContent = email;
  contaNome.textContent = primeiroNome === "visitante" ? "Entrar ou Cadastrar" : primeiroNome;
  dropdownNome.textContent = primeiroNome;

  if (fotoAtual) {
    [fotoPreview, avatar, dropdownAvatar].forEach(function (item) {
      item.textContent = "";
      item.style.backgroundImage = `url(${fotoAtual})`;
    });
  } else {
    [fotoPreview, avatar, dropdownAvatar].forEach(function (item) {
      item.textContent = inicial(nome);
      item.style.backgroundImage = "";
    });
  }
}

function carregarPerfil() {
  const usuario = buscarUsuario();
  const perfil = buscarPerfil();

  document.getElementById("nome").value = perfil.nome || usuario.nome || "";
  document.getElementById("email").value = perfil.email || usuario.email || "";
  document.getElementById("telefone").value = perfil.telefone || "";
  document.getElementById("idade").value = perfil.idade || "";
  document.getElementById("plataforma").value = perfil.plataforma || "";
  document.getElementById("bio").value = perfil.bio || "";
  fotoAtual = perfil.foto || "";

  atualizarPreview();
}

function salvarPerfil(evento) {
  evento.preventDefault();

  const perfil = {
    nome: document.getElementById("nome").value.trim(),
    email: document.getElementById("email").value.trim(),
    telefone: document.getElementById("telefone").value.trim(),
    idade: document.getElementById("idade").value,
    plataforma: document.getElementById("plataforma").value,
    bio: document.getElementById("bio").value.trim(),
    foto: fotoAtual
  };

  localStorage.setItem("catalogoGamerPerfil", JSON.stringify(perfil));
  localStorage.setItem("catalogoGamerUsuario", JSON.stringify({
    nome: perfil.nome,
    email: perfil.email,
    dataLogin: new Date().toISOString()
  }));

  mensagem.textContent = "Perfil salvo com sucesso.";
  atualizarPreview();
}

fotoInput.addEventListener("change", function () {
  const arquivo = fotoInput.files[0];

  if (!arquivo) {
    return;
  }

  const leitor = new FileReader();
  leitor.onload = function () {
    fotoAtual = leitor.result;
    atualizarPreview();
  };
  leitor.readAsDataURL(arquivo);
});

removerFoto.addEventListener("click", function () {
  fotoAtual = "";
  fotoInput.value = "";
  atualizarPreview();
});

document.getElementById("nome").addEventListener("input", atualizarPreview);
document.getElementById("email").addEventListener("input", atualizarPreview);
form.addEventListener("submit", salvarPerfil);

configurarMenu();
configurarSair();
carregarPerfil();
