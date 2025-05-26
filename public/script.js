
const form = document.getElementById("tweetForm");
const input = document.getElementById("tweetInput");
const API_URL = "http://localhost:1000/mgs";

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value == "") return;

  const tweet = input.value.trim();
  input.value = "";

  const UserName = document.getElementById('username').value;
  const novaMensagem = {
    name: UserName,
    msg: tweet,
    likes: 0,
    dislikes: 0,
    comments:[

    ]
  };

  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(novaMensagem)
  })
    .then(res => res.text())
    .then(texto => {
      alert(texto);
      carregarMensagens(); // Atualiza a lista
    });
});

function carregarMensagens() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      const feed = document.querySelector(".feed");
      feed.innerHTML = "<h3>Tweets recentes</h3>"; // Mantém o título

      data.forEach(m => {
        const tweet = document.createElement("div");
        tweet.className = "tweet";
        tweet.innerHTML = `
          <div class="tweet-header">
            <div class="tweet-pic"></div>
            <strong>@${m.name}</strong>
          </div>
          <p>${m.msg}</p>
          <div class="tweet-actions">
            <button class="like-btn">👍 <span class="like-count">${m.likes}</span></button>
            <button class="dislike-btn">👎 <span class="dislike-count">${m.dislikes}</span></button>
          </div>
        `;
        tweet.setAttribute('data-id', m.id);
        tweet.addEventListener('click', abrirMens);
        feed.appendChild(tweet);
      });
    });
}

window.onload = carregarMensagens;

// Modal e comentários
let idAbrirMens = 0

async function abrirMens(e) {
  const tweetEl = e.currentTarget;
  const id = tweetEl.dataset.id
  let MensData = null
  idAbrirMens = id
  await fetch(API_URL + `/${id}`).then(response =>response.json()).then(data =>{
    MensData = data 
  })
  
  if (e.target.tagName === "BUTTON" || e.target.closest("button")) return;
  console.log(MensData)
  

  document.getElementById('tweetTexto').innerText = MensData.msg;
  document.querySelector('#tweetModal .tweet-header strong').innerText = `@${MensData.name}`;
  document.getElementById('comentariosLista').innerHTML = ""
  //Comentarios
  comentariosTewwet(id);
  document.getElementById('tweetModal').classList.remove('hidden');
}
async function comentariosTewwet(id){
  let ComnesData = null
  await fetch(API_URL + `/${id}`).then(response =>response.json()).then(data =>{
    ComnesData = data.comments
  })
  ComnesData.forEach((e) =>{
    const li = document.createElement('li');

    li.innerHTML = `
      <div class="comentario-header">
        <div class="comentario-pic"></div>
        <strong>@${e.name}</strong>
      </div>
      <p>${e.msg}</p>
    `;

    document.getElementById('comentariosLista').appendChild(li);
  })
  
}
// Fechar modal
document.querySelector('.modal .close').addEventListener('click', () => {
  document.getElementById('tweetModal').classList.add('hidden');
});

// Comentários com nome de usuário e mini visual
document.getElementById('comentarioForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const comentarioInput = document.getElementById('comentarioInput');
  const comentarioTexto = comentarioInput.value.trim();
  const nomeUsuario = document.getElementById('username').value;

  fetch(API_URL).then(data)
  //FAZER ROTA NO INDEX PARA /commenst/id para ele pegar o id e adiconar esse comentario no tweet
  if (comentarioTexto) {
    const li = document.createElement('li');

    li.innerHTML = `
      <div class="comentario-header">
        <div class="comentario-pic"></div>
        <strong>@${nomeUsuario}</strong>
      </div>
      <p>${comentarioTexto}</p>
    `;

    document.getElementById('comentariosLista').appendChild(li);
    comentarioInput.value = '';
  }
});
