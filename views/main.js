const API_KEY = "api_key=[YOUR_API_KEY]";
const BASE_URL = "https://api.themoviedb.org/3";

const menu = document.getElementById("menu-btn");
let dropmenu = null;

const API_URL = BASE_URL + "/discover/movie?sort_by=popularity.desc&" + API_KEY;

menu.addEventListener("click", () => {
  if (dropmenu) {
    dropmenu.remove();
    dropmenu = null;
  } else {
    dropmenu = document.createElement("div");
    dropmenu.innerHTML = `
        <div class="bg-red-700 font-bold rounded-xl m-2 p-2">
            <ul class="text-center text-white m-3">
            <li class="py-3"><a>Home</a></li>
            <li class="py-3"><a>Movies</a></li>
            <li class="py-3"><a>TV Shows</a></li>
            </ul>
            <form action="/search" method="get" class="flex justify-center">
              <input
                name="query"
                type="text"
                placeholder="Search"
                id="search-form"
                class=" md:block bg-black border-3 border border-red-950 w-full h-10 p-2 pl-5 rounded-full text-white"
              />
              <button
              type="submit"
              id="search-btn"
              class="mx-5 bg-white p-2 px-3 rounded-full">
                <i class="fa fa-search"></i>
              </button>
            </form>
        </div>
    `;
    document.querySelector("header").appendChild(dropmenu);
    const searchButton = dropmenu.querySelector("#search-btn");
    searchButton.addEventListener("click", () => {
      const SEARCH_URL = BASE_URL + "/search/movie?" + API_KEY;
      const Term = dropmenu.querySelector("#search-form").value;
      const container = document.getElementById("main");

      const heading = document.querySelector("#heading");
      heading.innerText = `Showing Results For ${Term}`;
      container.innerHTML = "";
      getResult(SEARCH_URL + "&query=" + Term);
    });
  }
});
getResult(API_URL);

function getResult(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => showResult(data.results));
}

function showResult(data) {
  const container = document.getElementById("main");
  const headerTag = document.querySelector("header");

  const POSTER_URL = "https://image.tmdb.org/t/p/w500";
  data.forEach((element) => {
    const card = document.createElement("div");
    card.innerHTML = `
      <div id="card" class="group relative m-3  inline-block w-[270px] h-[380px] rounded-xl">
        <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute bg-gray-950/50 text-white w-[270px] h-[340px] p-2">
          ${element.overview}
        </div>
        <img class="w-full h-[340px] rounded-xl" src="${
          POSTER_URL + element.poster_path
        }"/>
        <div class="flex justify-between items-center pr-2">
          <h2 class="text-white font-bold m-2">${element.title}</h2>
          <h2 class="text-white font-bold bg-gray-700 p-1 rounded-xl">${element.vote_average.toFixed(
            1
          )}</h2>
        </div>
      </div>   
    `;
    container.appendChild(card);
  });
}

const searchButton = document.getElementById("search-btn");
searchButton.addEventListener("click", () => {
  const SEARCH_URL = BASE_URL + "/search/movie?" + API_KEY;
  const Term = document.getElementById("search-form").value;
  const container = document.getElementById("main");

  const heading = document.querySelector("#heading");
  heading.innerText = `Showing Results For ${Term}`;
  container.innerHTML = "";
  getResult(SEARCH_URL + "&query=" + Term);
});

const logo = document.getElementById("logo");
logo.addEventListener("click", () => {
  window.location.href = `/`;
});

const ai = document.getElementById("ai");
ai.addEventListener("click", () => {
  window.location.href = `/recommend`;
});
