const getMovies = () => {
  return fetch("http://localhost:3000/movies")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }
      return response.json();
    })
    .then((movies) => {
      const moviesList = document.getElementById("moviesList");
      moviesList.innerHTML = movies
        .map((movie) => `<li>${movie.title}</li>`)
        .join("");
      return movies;
    });
};

const getFavourites = () => {
  return fetch("http://localhost:3000/favourites")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch favourites");
      }
      return response.json();
    })
    .then((favourites) => {
      const favouritesList = document.getElementById("favouritesList");
      favouritesList.innerHTML = favourites
        .map((fav) => `<li>${fav.title}</li>`)
        .join("");
      return favourites;
    });
};

let cachedMovies = null;
let cachedFavourites = null;

const addFavourite = (movieId) => {
  // Use cached data if available to avoid additional server calls
  const fetchMovies = cachedMovies
    ? Promise.resolve(cachedMovies)
    : getMovies().then((data) => (cachedMovies = data));
  const fetchFavourites = cachedFavourites
    ? Promise.resolve(cachedFavourites)
    : getFavourites().then((data) => (cachedFavourites = data));

  return Promise.all([fetchMovies, fetchFavourites]).then(
    ([movies, favourites]) => {
      const movieToAdd = movies.find((movie) => movie.id === movieId);

      if (!movieToAdd) {
        throw new Error("Movie not found");
      }

      if (favourites.some((fav) => fav.id === movieId)) {
        throw new Error("Movie is already added to favourites");
      }

      return fetch("http://localhost:3000/favourites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movieToAdd),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to add to favourites");
          }
          return response.json();
        })
        .then(() => {
          favourites.push(movieToAdd);
          const favouritesList = document.getElementById("favouritesList");
          favouritesList.innerHTML += `<li>${movieToAdd.title}</li>`;
          return favourites;
        });
    }
  );
};

module.exports = {
  getMovies,
  getFavourites,
  addFavourite,
};

// You will get error - Uncaught ReferenceError: module is not defined
// while running this script on browser which you shall ignore
// as this is required for testing purposes and shall not hinder
// it's normal execution
