const logo = document.getElementById("logo");
const go = document.getElementById("go");
logo.addEventListener("click", () => {
  window.location.href = `/`;
});

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

go.addEventListener("click", () => {
  const container = document.getElementById("main");
  container.innerHTML = "";
  const m1 = document.getElementById("m1");
  const m2 = document.getElementById("m2");
  const m3 = document.getElementById("m3");
  const data = { movie1: m1.value, movie2: m2.value, movie3: m3.value };

  axios
    .post("/suggest", data)
    .then((response) => {
      console.log(response.data);
      showResult(response.data);
    })
    .catch((err) => {
      console.error(err);
    });
});
