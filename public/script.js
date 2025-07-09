
const form = document.getElementById("tweetForm");
const input = document.getElementById("tweetInput");
const API_URL = "/mgs";
let IDModal = 0

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (input.value == "") return;

  const tweet = input.value.trim();
  input.value = "";

  const UserName = document.getElementById('username').value;
  const novaMensagem = {
    name: UserName,
    msg: tweet,
    img:document.getElementById("profileImage").src
  };

  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(novaMensagem)
  })
    .then(res => res.text())
    .then(texto => {

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
            <button data-btn="true" class="like-btn react">👍 <span class="like-count">${m.likes}</span></button>
            <button data-btn="false" class="dislike-btn react">👎 <span class="dislike-count">${m.dislikes}</span></button>
          </div>
        `;
        tweet.setAttribute('data-id', m._id);
        tweet.addEventListener('click', abrirMens);
        feed.appendChild(tweet);
        atualizar()
        
      });
    });
}

window.onload = abrirfunctions;

function abrirfunctions(){
 topTweets();
 carregarMensagens();
}

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
  
  //Comentarios
  IDModal = id
  comentariosTewwet(id);
  
  document.getElementById('tweetModal').classList.remove('hidden');
}
async function comentariosTewwet(id){
  document.getElementById('comentariosLista').innerHTML = ""
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
  comentarioInput.value = ""
  if(comentarioTexto == ""){return}
  const nomeUsuario = document.getElementById('username').value;
  
  novoComentario = {
    name:nomeUsuario,
    msg:comentarioTexto
  }
  fetch(API_URL + `/comments/${IDModal}`,{
    method:"POST",
    headers:{ "Content-Type": "application/json" },
    body: JSON.stringify(novoComentario)
  }).then(res => res.text())
  .then(texto =>{
    console.log(texto)
    comentariosTewwet(IDModal)
  })
  
  
});
function atualizar(){
   document.querySelectorAll('.react').forEach(botao => {
    botao.addEventListener('click', (e) => {
      e.stopPropagation(); 
      const tipo = e.currentTarget.getAttribute('data-btn'); 
      const tweetEl = e.currentTarget.closest('.tweet');
      const id = tweetEl.getAttribute('data-id');

      const TypeofBoolean = tipo === "true";

      fetch(`${API_URL}/react/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ react: TypeofBoolean })
      })
        .then(res => res.text())
        .then(msg => {
          console.log(msg);
          carregarMensagens();
      });

    });
  });
}


//IMG User
const imageInput = document.getElementById("imageInput");
const profileImage = document.getElementById("profileImage");

imageInput.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function () {
      profileImage.src = reader.result;
    };
    reader.readAsDataURL(file);
  }
});


async function topTweets() {
  let Links = document.querySelector('.topA')
  console.log("Acionado")
  fetch(API_URL + '/top').then(response => response.json()).then(data =>{
    data.forEach(e =>{
      let msgCurta =  e.msg.substring(0, 20);
      
      Links.innerHTML += `<li><a href="#"><div>
            <p>${msgCurta}</p>
            <span>${e.likes} likes</span>
          </div></a></li>`
      console.log(msgCurta)
    })
    
  })
} 
