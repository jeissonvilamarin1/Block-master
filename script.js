const API_URL =
  "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=";
const IMG_PATH = `https://image.tmdb.org/t/p/w1280`;
const URL_TOPRATED = `https://api.themoviedb.org/3/movie/top_rated?api_key=3fd2be6f0c70a2a598f084ddfb75487c&language=en-US&page=1`;
const SEARCH_URL =
  "https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query=";
const URL_VIDEOS = `https://api.themoviedb.org/3/movie/{movie_id}/videos?api_key=3fd2be6f0c70a2a598f084ddfb75487c&language=en-US`;
const URL_POPULAR = `https://api.themoviedb.org/3/movie/upcoming?api_key=3fd2be6f0c70a2a598f084ddfb75487c&language=en-US&page=1`;

const form = document.getElementById("form");
const search = document.getElementById("search");
const cards = document.getElementById("cards");
const body = document.getElementById("body");
const loading = document.querySelector(".loading");
const detailsPage = document.getElementById("details-page");
const templateCard = document.getElementById("template-card").content;
const templateDetails = document.getElementById("template-details").content;
const fragment = document.createDocumentFragment();
const topRated = document.getElementById("top-rated");
const popular = document.getElementById("popular");
const heading = document.getElementById("heading");

getMovies(API_URL);

async function getMovies(url) {
  let resp = await fetch(url);
  let data = await resp.json();
  let moviesData = data.results;
  console.log(moviesData);
  showMovies(moviesData);
}

function showMovies(movies) {
  cards.innerHTML = "";
  movies.forEach((movie) => {
    const { vote_average, poster_path, id } = movie;
    templateCard
      .querySelector("img")
      .setAttribute("src", IMG_PATH + poster_path);
    templateCard.querySelector("img").setAttribute("data-id", id);
    templateCard.querySelector("span").textContent = vote_average;
    const clone = templateCard.cloneNode(true);
    fragment.appendChild(clone);
  });
  cards.appendChild(fragment);
}

//Search

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const searchTerm = search.value;
  if(searchTerm){
    await getMovies(SEARCH_URL + searchTerm);
    search.value = "";
  }
});

//Trailers
const trailer = document.getElementById("trailer")
const getMovieTrailers = async(id) => {
  let resp = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/videos?api_key=3fd2be6f0c70a2a598f084ddfb75487c&language=en-US`
  );
  let data = await resp.json();
  console.log(data);
  if (data.results.length > 0) {
    let embed = [];
    data.results.forEach((video) => {
      let {name, key, site} = video;
      embed.push(`
        <iframe class="video" width="560" height="315" src="https://www.youtube.com/embed/${key}?controls=0" title="${name}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        `);
    });
    trailer.innerHTML += `${embed[0]}`;
  } else {
    trailer.innerHTML = `No results found`;
  }
}
setTimeout(getMovieTrailers(438631), 1000);
setTimeout(getMovieTrailers(550988), 1000);


//Mas valoradas
topRated.addEventListener("click", async (e) => {
  e.preventDefault();
  await getMovies(URL_TOPRATED);
  heading.textContent = `Más Valoradas`;
});

//Mas populares
popular.addEventListener("click", async (e) => {
  e.preventDefault();
  await getMovies(URL_POPULAR);
  heading.textContent = `Más Populares`;
});

//Movie description
cards.addEventListener("click", async(e) => {
  e.preventDefault();
  let resp = await fetch(API_URL);
  let data = await resp.json();
  let movies = data.results;
  let idTarget = e.target.dataset.id;
  console.log(idTarget);
  body.style.overflow = "hidden";
  detailsPage.style.display = "flex";
  movies.forEach((movie) => {
    const { id, title, poster_path, overview, release_date } = movie;
    if (id == idTarget) {
      detailsPage.innerHTML = "";
      templateDetails.getElementById("card-img").setAttribute("src", IMG_PATH + poster_path);
      templateDetails.getElementById("card-title").textContent = title;
      templateDetails.getElementById("close-detail").textContent = `X`;
      templateDetails.getElementById("card-description").textContent = overview;
      templateDetails.getElementById("card-categories").textContent = `Year: ${release_date}`;
      const clone = templateDetails.cloneNode(true);
      fragment.appendChild(clone);
      detailsPage.appendChild(fragment);
    }
  });
});

// Scroll infinito
window.addEventListener("scroll", async () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (clientHeight + scrollTop >= scrollHeight - 2) {
    setTimeout(showLoading, 1000);
  }

  async function showLoading(url) {
    let randomNum = Math.ceil(Math.random() * 10);
    loading.classList.add("show");
    let resp = await fetch(API_URL + randomNum);
    let data = await resp.json();
    let moviesData = data.results;
    moviesData.forEach((movie) => {
      const { vote_average, poster_path, id } = movie;
      templateCard
        .querySelector("img")
        .setAttribute("src", IMG_PATH + poster_path);
      templateCard.querySelector("img").setAttribute("data-id", id);
      templateCard.querySelector("span").textContent = vote_average;
      const clone = templateCard.cloneNode(true);
      fragment.appendChild(clone);
    });
    cards.appendChild(fragment);
    loading.classList.remove("show");
  }
});
