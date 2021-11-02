const API_URL =
  "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=";
const IMG_PATH = `https://image.tmdb.org/t/p/w1280`;
const SEARCH_URL =
  'http://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query=';

const form = document.getElementById("form");
const search = document.getElementById("search");
const cards = document.getElementById("cards");
const body = document.getElementById("body");
const loading = document.querySelector(".loading");
const detailsPage = document.getElementById("details-page");
const templateCard = document.getElementById("template-card").content;
const templateDetails = document.getElementById("template-details").content;
const fragment = document.createDocumentFragment();

getMovies(API_URL);

async function getMovies(url){
  let resp = await fetch(url);
  let data = await resp.json();
  let moviesData = data.results;
  console.log(moviesData)
  showMovies(moviesData)
};


function showMovies(movies){
    cards.innerHTML = "";
    movies.forEach((movie) => {
    const { vote_average, poster_path, id } = movie;
    templateCard.querySelector("img").setAttribute("src", IMG_PATH + poster_path);
    templateCard.querySelector("img").setAttribute("data-id", id);
    templateCard.querySelector("span").textContent = vote_average;
    const clone = templateCard.cloneNode(true);
    fragment.appendChild(clone);
    });
    cards.appendChild(fragment);
};


//Search

form.addEventListener("submit", async(e) =>{
    e.preventDefault();

    const searchTerm = search.value;
    if(searchTerm){
        await getMovies(SEARCH_URL + searchTerm)
        search.value = '';
    }
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
      templateDetails
        .getElementById("card-img")
        .setAttribute("src", IMG_PATH + poster_path);
      templateDetails.getElementById("card-title").textContent = title;
      templateDetails.getElementById("close-detail").textContent = `X`;
      templateDetails.getElementById("card-description").textContent = overview;
      templateDetails.getElementById(
        "card-categories"
      ).textContent = `Year: ${release_date}`;
      const clone = templateDetails.cloneNode(true);
      fragment.appendChild(clone);
      detailsPage.appendChild(fragment);
    }
  });
});

// Scroll infinito

window.addEventListener('scroll', async() => {
    const {scrollTop, scrollHeight, clientHeight } = document.documentElement;

    if(clientHeight + scrollTop >= scrollHeight -2 ){
        setTimeout(showLoading, 1000)
    }

    async function showLoading (url){
        let randomNum = Math.ceil(Math.random()*10)
        loading.classList.add("show")
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

