function login() {
  let user = document.getElementById("user").value;
  let pass = document.getElementById("pass").value;

  if (user && pass) {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("chatBox").style.display = "block";
  } else {
    alert("Preencha tudo!");
  }
}

function send() {
  let input = document.getElementById("input");
  let msg = input.value;

  if (!msg) return;

  let box = document.getElementById("messages");

  box.innerHTML += `<p><b>Você:</b> ${msg}</p>`;

  let response = bot(msg);

  box.innerHTML += `<p><b>CoreBit:</b> ${response}</p>`;

  input.value = "";
}

function bot(msg) {
  msg = msg.toLowerCase();

  if (msg.includes("oi")) return "Olá! Eu sou o CoreBit 🤖";
  if (msg.includes("quem é você")) return "Sou a IA CoreBit criada para testes.";
  if (msg.includes("ajuda")) return "Digite perguntas simples para interagir comigo.";
  
  return "Não entendi seu comando.";
}