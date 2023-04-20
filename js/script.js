const url = "https://jsonplaceholder.typicode.com/posts";

const loadingElement = document.querySelector("#loading");
const postsContainer = document.querySelector("#postsContainer");

const pagePost = document.querySelector("#post");
const containerPost = document.querySelector("#post-container");
const comentarios = document.querySelector("#comentario-container");

const commentForm = document.querySelector("#comment-form");
const emailInput = document.querySelector("#email");
const bodyInput = document.querySelector("#body");

const urlSearchParams = new URLSearchParams(window.location.search);
const idPost = urlSearchParams.get("id");

async function getAllPosts() {
  const response = await fetch(url);

  const data = await response.json();

  loadingElement.classList.add("hide");

  data.map((post) => {
    const div = document.createElement("div");
    const title = document.createElement("h1");
    const body = document.createElement("p");
    const link = document.createElement("a");

    title.innerHTML = post.title;
    body.innerHTML = post.body;
    link.innerHTML = "Ler";
    link.setAttribute("href", `/post.html?id=${post.id}`);

    div.appendChild(title);
    div.appendChild(body);
    div.appendChild(link);

    postsContainer.appendChild(div);
  });
}

async function getPost(id) {
  const [responsePost, responseComentario] = await Promise.all([
    fetch(`${url}/${id}`),
    fetch(`${url}/${id}/comments`),
  ]);

  const dataPost = await responsePost.json();

  const dataComentarios = await responseComentario.json();

  loadingElement.classList.add("hide");
  pagePost.classList.remove("hide");

  const title = document.createElement("h1");
  const body = document.createElement("p");

  title.innerText = dataPost.title;
  body.innerText = dataPost.body;

  containerPost.appendChild(title);
  containerPost.appendChild(body);

  dataComentarios.map((comentario) => {
    criarComentario(comentario);
  });
}

function criarComentario(comentario) {
  const div = document.createElement("div");
  const email = document.createElement("h3");
  const comentariobody = document.createElement("p");

  email.innerText = comentario.email;
  comentariobody.innerText = comentario.body;

  div.appendChild(email);
  div.appendChild(comentariobody);

  comentarios.appendChild(div);
}

async function potComment(comment) {
  const response = await fetch(`${url}/${idPost}/comments`, {
    method: "POST",
    body: comment,
    headers: {
      "Content-type": "application/json",
    },
  });
  const data = await response.json();
  criarComentario(data);
}

if (!idPost) {
  getAllPosts();
} else {
  getPost(idPost);

  commentForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let comment = {
      email: emailInput.value,
      body: bodyInput.value,
    };

    comment = JSON.stringify(comment);

    potComment(comment);
  });
}
