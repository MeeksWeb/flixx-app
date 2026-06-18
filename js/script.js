//token
// eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3YmY1ZmEzNTEwMzA5MTQyZmFmMmI2ODY4NTcxNmYyYSIsIm5iZiI6MTc4MTUyMTQ3NS41NDksInN1YiI6IjZhMmZkYzQzMmE2NWRkY2M1MTczYTVlNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.YI9HrruIBB2O1j3tZIs3TJwdlpoXu-DyeB9c9ZPBUhM

//key
// 7bf5fa3510309142faf2b68685716f2a

//CREATE A ROUTER
const global = {
  currentPage: window.location.pathname,

  //below was added while creating the search function
  search: {
    term: "",
    type: "",
    page: 1,
    totalPage: 1,
  },
  //stops here

  //below was created as global to be accessible
  api: {
    key: "7bf5fa3510309142faf2b68685716f2a",
    url: "https://api.themoviedb.org/3/",
  },
};

function showSpinner() {
  document.querySelector(".spinner").classList.add("show");
}

function hideSpinner() {
  document.querySelector(".spinner").classList.remove("show");
}

//Highlight active link
function highLightActiveLink() {
  const links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    if (link.getAttribute("href") === global.currentPage) {
      link.classList.add("active");

      // // OR

      // if (global.currentPage.includes(link.getAttribute("href"))) {
      //   link.classList.add("active");
    }
  });
}

//fetch search result
async function searchAPIData(endpoint) {
  const API_KEY = global.api.key;
  const API_URL = global.api.url;
  showSpinner();
  try {
    const response = await fetch(
      `${API_URL}search/${global.search.type}?query=${global.search.term}&api_key=${API_KEY}&language=en-US`,
    );
    if (!response.ok) {
      hideSpinner();
      throw new Error(`Something went wrong. Status: ${response.status}`);
    }
    const data = await response.json();
    hideSpinner();
    return data;
  } catch (error) {
    console.log(`Fetch Error: ${error.message}`);
  }
}

//fetch data from TMDB API
async function fetchAPIData(endpoint) {
  const API_KEY = global.api.key;
  const API_URL = global.api.url;
  showSpinner();
  try {
    const response = await fetch(
      `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`,
    );
    if (!response.ok) {
      hideSpinner();
      throw new Error(`Something went wrong. Status: ${response.status}`);
    }
    const data = await response.json();
    hideSpinner();
    return data;
  } catch (error) {
    console.log(`Fetch Error: ${error.message}`);
  }
}

// Because fetchAPIData is an async function, it automatically wraps whatever it returns inside a Promise. To actually use the array of movie grids it brings back, you will need to handle it using await inside your endpoint display functions

//display 20 popular movies
async function displayPopularMovies() {
  const parentDiv = document.getElementById("popular-movies");
  const data = await fetchAPIData("movie/popular");

  //save in a variable
  const results = data.results;
  results.forEach((result) => {
    //create a div
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
          <a href="movie-details.html?id=${result.id}">
           ${
             result.poster_path
               ? ` <img
              src="https://image.tmdb.org/t/p/w500${result.poster_path}"
              class="card-img-top"
              alt="Movie Title"
            />`
               : ` <img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="Movie Title"
            />`
           }
          </a>
          <div class="card-body">
            <h5 class="card-title">${result.title}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${result.release_date}</small>
            </p>
          </div>
        `;
    //here
    parentDiv.appendChild(div);
  });
}

//display 20 popular TV Shows
async function displayPopularShows() {
  const parentDiv = document.getElementById("popular-shows");
  const data = await fetchAPIData("tv/popular");

  //save in a variable
  const results = data.results;
  console.log(results);
  results.forEach((result) => {
    //create a div
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
          <a href="tv-details.html?id=${result.id}">
           ${
             result.poster_path
               ? `<img
              src="https://image.tmdb.org/t/p/w500${result.poster_path}"
              class="card-img-top"
              alt=${result.name}
            />`
               : `<img
              src="images/no-image.jpg"
              class="card-img-top"
              alt=${result.name}
            />`
           }
          </a>
            <div class="card-body">
            <h5 class="card-title">${result.name}</h5>
            <p class="card-text">
              <small class="text-muted">Aired: ${result.first_air_date}</small>
            </p>
          </div>
        `;
    //here
    parentDiv.appendChild(div);
  });
}

async function displayMovieDetails() {
  //using the window location api (window.location.search)
  // const movieId = window.location.search  gives something like this ( ?id=1339713 ) depending on the active movie. you then split it at the = sign to result into to two arrays ?id,1339713. then pick the number.
  const movieId = window.location.search.split("=")[1];
  const movie = await fetchAPIData(`movie/${movieId}`);

  //overlay for background image
  displayBackgroundImage("movie", movie.backdrop_path);
  const movieDetails = document.querySelector("#movie-details");
  console.log(movie);
  const div = document.createElement("div");
  div.innerHTML = `<div class="details-top">
          <div>
            ${
              movie.poster_path
                ? ` <img
              src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
              class="card-img-top"
              alt="Movie Title"
            />`
                : ` <img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="${movie.title}"
            />`
            }
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i> ${movie.vote_average.toFixed(1)}/10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p>${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
             ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
            </ul>
            <a href="#" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $${movie.budget.toLocaleString("en-US")}</li>
            <li><span class="text-secondary">Revenue:</span> $${movie.revenue.toLocaleString("en-US")}</li>
            <li><span class="text-secondary">Runtime:</span> ${movie.runtime} minutes</li>
            <li><span class="text-secondary">Status:</span> ${movie.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${movie.production_companies.map((company) => `${company.name}, `).join("")} </div>
        </div>`;

  movieDetails.appendChild(div);
}

async function displayShowsDetails() {
  //using the window location api (window.location.search)
  // const movieId = window.location.search  gives something like this ( ?id=1339713 ) depending on the active movie. you then split it at the = sign to result into to two arrays ?id,1339713. then pick the number.
  const showsId = window.location.search.split("=")[1];
  const shows = await fetchAPIData(`tv/${showsId}`);
  displayBackgroundImage("tv", shows.backdrop_path);
  const movieDetails = document.querySelector("#show-details");
  const div = document.createElement("div");
  div.innerHTML = `<div class="details-top">
          <div>
            ${
              shows.poster_path
                ? ` <img
              src="https://image.tmdb.org/t/p/w500${shows.poster_path}"
              class="card-img-top"
              alt="${shows.title}"
            />`
                : ` <img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="${shows.title}"
            />`
            }
          </div>
          <div>
            <h2>${shows.name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${shows.vote_average.toFixed(1)}/10
            </p>
            <p class="text-muted">Release Date: ${shows.first_air_date}</p>
            <p>
              ${shows.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${shows.genres.map((show) => `<li>${show.name}</li>`).join("")}
            </ul>
            <a href="#" target="_blank" class="btn">Visit Show Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Show Info</h2>
          <ul>
            <li><span class="text-secondary">Number Of Episodes:</span> ${shows.number_of_episodes}</li>
            <li>
              <span class="text-secondary">Last Episode To Air:</span> ${shows.last_episode_to_air.episode_number}
            </li>
            <li><span class="text-secondary">Status:</span> ${shows.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${shows.production_companies.map((company) => `${company.name}, `).join("")}</div>
        </div>`;

  movieDetails.appendChild(div);
}

//display background on details page
function displayBackgroundImage(type, backgroundPath) {
  const overlayDiv = document.createElement("div");
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${backgroundPath})`;
  overlayDiv.style.backgroundSize = "cover";
  overlayDiv.style.backgroundPosition = "center";
  overlayDiv.style.backgroundRepeat = "no-repeat";
  overlayDiv.style.height = "100vh";
  overlayDiv.style.width = "100vw";
  overlayDiv.style.position = "absolute";
  overlayDiv.style.top = "0";
  overlayDiv.style.left = "0";
  overlayDiv.style.zIndex = "-1";
  overlayDiv.style.opacity = "0.1";

  // Append the overlay to the specific layout page container
  if (type === "movie") {
    document.querySelector("#movie-details").appendChild(overlayDiv);
  } else {
    document.querySelector("#show-details").appendChild(overlayDiv);
  }
}

//SEARCH MOVIE/SHOWS
async function search() {
  //get the querystring(made up of params) first i.e everything after the ? on the url
  const queryString = window.location.search;
  //console.log(queryString); = ?type=tv&search-term=meek
  //NOTE the param type in this case is tv but in my html, we have tv and movie...meaning the type can also be movie

  //then separate the params
  const urlParams = new URLSearchParams(queryString);
  //you get bunch of stuffs, so use the get() method and indicate the name of the param you want
  // console.log(urlParams.get("type")); = Tv
  // console.log(urlParams.get("search-term")); = meek

  global.search.type = urlParams.get("type");
  global.search.term = urlParams.get("search-term");

  //check to make sure the input field isnt empty
  if (global.search.term !== "" && global.search.term !== null) {
    const results = await searchAPIData();
    console.log(results);
  } else {
    showAlert("Please enter a search term");
  }
}

//Show Alert
function showAlert(message, className) {
  //create the message div
  const alertEl = document.createElement("div");
  alertEl.classList.add("alert", className);
  // alertEl.innerHTML = message

  //create the message & append to the alertEl
  const msg = document.createTextNode(message);
  alertEl.appendChild(msg);
  const alertDiv = document.querySelector("#alert");
  alertDiv.appendChild(alertEl);

  //add alert timer
  setTimeout(() => {
    alertDiv.remove();
  }, 3000);
}

//display slider movies
async function displaySlider() {
  const { results } = await fetchAPIData("movie/now_playing");
  // console.log(results);
  results.forEach((result) => {
    const div = document.createElement("div");
    div.classList.add("swiper-slide");
    div.innerHTML = `<a href="movie-details.html?id=${result.id}">
      <img src="https://image.tmdb.org/t/p/w500${result.poster_path}" alt="${result.title}" />
    </a>
   <h4 class="swiper-rating">
       <i class="fas fa-star text-secondary"></i>${result.vote_average.toFixed(1)} / 10
     </h4>`;
    document.querySelector(".swiper-wrapper").appendChild(div);
  });
  initSwiper();
}

function initSwiper() {
  const swiper = new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
}

//init app
function init() {
  switch (global.currentPage) {
    case "/":
    case "/index.html":
      displaySlider();
      displayPopularMovies();
      break;
    case "/shows.html":
      displayPopularShows();
      break;
    case "/movie-details.html":
      displayMovieDetails();
      break;
    case "/tv-details.html":
      displayShowsDetails();
      break;
    case "/search.html":
      search();
      break;
  }
  highLightActiveLink();
}

document.addEventListener("DOMContentLoaded", init);
