const API_KEY = "506cfefd";

// Nunca pasar el estado
export const searchMovies = async ({ query }) => {
  if (query === "") return null;

  try {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`
    );
    const json = await response.json();

    const movies = json.Search;

    const mappedMovies = movies?.map((movies) => ({
      id: movies.imdbID,
      title: movies.Title,
      year: movies.Year,
      poster: movies.Poster,
    }));

    return mappedMovies;
  } catch (e) {
    throw new Error("Erros en la busqueda de la peliculas");
  }
};
