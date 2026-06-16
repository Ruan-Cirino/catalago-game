const form = document.getElementById("loginForm");
const mensagemErro = document.getElementById("mensagemErro");

form.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();

  if (nome.length < 2 || email.length < 6) {
    mensagemErro.textContent = "Preencha nome e e-mail corretamente.";
    return;
  }

  const usuario = {
    nome,
    email,
    dataLogin: new Date().toISOString()
  };

  localStorage.setItem("catalogoGamerUsuario", JSON.stringify(usuario));
  window.location.href = "index.html";
  
  function logout() {
    localStorage.clear();
    window.location.href = "login.html";
  }
});
