const form = document.getElementById("tweetForm");
const input = document.getElementById("tweetInput");
const API_URL = "/mgs";
let IDModal = 0;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  
  if (input.value.trim() === "") return;

  const tweet = input.value.trim();
  input.value = "";


  const novaMensagem = {
    msg: tweet,
    img: document.getElementById("profileImage").src
  };

  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(novaMensagem)
  })
    .then(res => res.text())
    .then(texto => {
      carregarMensagens();
    });
});

function carregarMensagens() {
  fetch(API_URL)
    .then(res => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    })
    .then(data => {
      const feed = document.querySelector(".feed");
      
      // Keep the header and clear the rest
      feed.innerHTML = `
        <div class="feed-header">
          <h3>Tweets recentes</h3>
        </div>
      `;

      if (data && data.length > 0) {
        data.forEach(m => {
          const tweet = document.createElement("div");
          tweet.className = "tweet";
          tweet.innerHTML = `
            <div class="tweet-avatar">
              <img src="${m.img || 'icone.png'}" alt="Avatar">
            </div>
            <div class="tweet-content">
              <div class="tweet-header">
                <span class="tweet-user">@${m.name}</span>
                <span class="tweet-time">agora</span>
              </div>
              <p class="tweet-text">${m.msg}</p>
              <div class="tweet-actions">
                <button data-btn="true" class="action-btn like-btn react">
                  <span class="action-icon">❤️</span>
                  <span class="like-count">${m.likes || 0}</span>
                </button>
                <button data-btn="false" class="action-btn dislike-btn react">
                  <span class="action-icon">👎</span>
                  <span class="dislike-count">${m.dislikes || 0}</span>
                </button>
                <button class="action-btn">
                  <span class="action-icon">💬</span>
                  <span>Comentar</span>
                </button>
                <button class="action-btn">
                  <span class="action-icon">🔄</span>
                  <span>Repostar</span>
                </button>
              </div>
            </div>
          `;
          tweet.setAttribute('data-id', m._id);
          tweet.id = m._id;
          
          feed.appendChild(tweet);
        });
      } else {
        // Show placeholder when no tweets are available
        const placeholder = document.createElement("div");
        placeholder.className = "tweet-placeholder";
        placeholder.innerHTML = `
          <div style="text-align: center; padding: 40px; color: #71767b;">
            <p>Nenhum tweet ainda...</p>
            <p>Seja o primeiro a postar algo!</p>
          </div>
        `;
        feed.appendChild(placeholder);
      }
      
      atualizar();
    })
    .catch(error => {
      console.error('Error loading messages:', error);
      const feed = document.querySelector(".feed");
      feed.innerHTML = `
        <div class="feed-header">
          <h3>Tweets recentes</h3>
        </div>
        <div style="text-align: center; padding: 40px; color: #71767b;">
          <p>Erro ao carregar tweets</p>
          <p>Verifique sua conexão</p>
        </div>
      `;
    });
}

window.onload = abrirfunctions;

async function abrirfunctions() {
  
  const user = await Userinfon()
  document.querySelector('#nameUser').innerHTML = user.nome
  
  topTweets();
  carregarMensagens();
}

// Modal e comentários
let idAbrirMens = 0;

async function abrirMens(e) {
  console.log('ABRIR MENS');

  const id = e;
  let MensData = null;
  idAbrirMens = id;
  
  await fetch(API_URL + `/${id}`)
    .then(response => response.json())
    .then(data => {
      MensData = data;
    });
  
  console.log(MensData);

  document.getElementById('tweetTexto').innerText = MensData.msg;
  document.querySelector('#tweetModal .tweet-user strong').innerText = `@${MensData.name}`;
  
  // Update like/dislike counts in modal
  document.querySelector('#tweetModal .like-count').innerText = MensData.likes || 0;
  document.querySelector('#tweetModal .dislike-count').innerText = MensData.dislikes || 0;
  
  // Comentarios
  IDModal = id;
  comentariosTewwet(id);
  
  document.getElementById('tweetModal').classList.remove('hidden');
}

async function comentariosTewwet(id) {
  document.getElementById('comentariosLista').innerHTML = "";
  let ComnesData = null;
  
  await fetch(API_URL + `/${id}`)
    .then(response => response.json())
    .then(data => {
      ComnesData = data.comments || [];
    });
  
  ComnesData.forEach((e) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="comment-avatar">
        <img src="icone.png" alt="Avatar">
      </div>
      <div class="comment-content">
        <div class="comment-header">
          <span class="comment-user">@${e.name}</span>
        </div>
        <p class="comment-text">${e.msg}</p>
      </div>
    `;
    document.getElementById('comentariosLista').appendChild(li);
  });
}

// Fechar modal
document.querySelector('.modal-close').addEventListener('click', () => {
  document.getElementById('tweetModal').classList.add('hidden');
});

// Close modal when clicking overlay
document.querySelector('.modal-overlay').addEventListener('click', () => {
  document.getElementById('tweetModal').classList.add('hidden');
});

// Comentários
document.getElementById('comentarioForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const comentarioInput = document.getElementById('comentarioInput');
  const comentarioTexto = comentarioInput.value.trim();
  
  if (comentarioTexto === "") return;
  
  comentarioInput.value = "";

  
  const novoComentario = {
    msg: comentarioTexto
  };
  
  fetch(API_URL + `/comments/${IDModal}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(novoComentario)
  })
    .then(res => res.text())
    .then(texto => {
      console.log(texto);
      comentariosTewwet(IDModal);
    });
});

function atualizar() {
  // Add event listeners for like/dislike buttons
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
  
  // Add event listeners for tweet clicks (to open modal)
  document.querySelectorAll(".tweet").forEach(div => {
    div.addEventListener('click', (e) => {
      // Don't open modal if clicking on action buttons
      if (e.target.closest('.tweet-actions')) return;
      abrirMens(div.id);
    });
  });
}

// Profile image upload
const imageInput = document.getElementById("imageInput");
const profileImage = document.getElementById("profileImage");

imageInput.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function () {
      profileImage.src = reader.result;
      // Update all avatar images in the interface
      document.querySelectorAll('.composer-avatar img, .comment-avatar').forEach(img => {
        img.src = reader.result;
      });
    };
    reader.readAsDataURL(file);
  }
});

async function topTweets() {
  const Links = document.querySelector('.topA');
  console.log("Acionado");
  
  try {
    const response = await fetch(API_URL + '/top');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    
    Links.innerHTML = ''; // Clear existing content
    
    if (data && data.length > 0) {
      data.forEach(e => {
        let msgCurta = e.msg.substring(0, 30);
        if (e.msg.length > 30) msgCurta += '...';
        
        const li = document.createElement('li');
        li.innerHTML = `
          <div>
            <p>${msgCurta}</p>
            <span>${e.likes || 0} likes</span>
          </div>
        `;
        li.onclick = () => abrirMens(e._id);
        Links.appendChild(li);
        console.log(msgCurta);
      });
    } else {
      // Show placeholder content when no data is available
      Links.innerHTML = `
        <li>
          <div>
            <p>Nenhum post popular ainda...</p>
            <span>0 likes</span>
          </div>
        </li>
      `;
    }
  } catch (error) {
    console.error('Error loading top tweets:', error);
    // Show placeholder content on error
    Links.innerHTML = `
      <li>
        <div>
          <p>Erro ao carregar posts populares</p>
          <span>Tente novamente</span>
        </div>
      </li>
    `;
  }
}

// Add login page redirect functionality
document.querySelector('.tweet-btn').addEventListener('click', () => {
  // This could redirect to login if user is not authenticated
  // For now, it just focuses on the tweet input
  document.getElementById('tweetInput').focus();
});

// Update character count and disable button if empty
document.getElementById('tweetInput').addEventListener('input', function() {
  const postBtn = document.querySelector('.post-btn');
  if (this.value.trim() === '') {
    postBtn.disabled = true;
  } else {
    postBtn.disabled = false;
  }
});

// Initialize the post button state
document.addEventListener('DOMContentLoaded', () => {
  const postBtn = document.querySelector('.post-btn');
  postBtn.disabled = true;
});

async function Userinfon() {
  const response = await fetch('/api/userinfo');

  const data = await response.json();

  return data
}