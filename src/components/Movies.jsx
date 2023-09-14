import notFoundImage from "../assets/not-found.jpg";

function RenderMovies({ movies }) {
  return (
    <ul className="movies">
      {movies.map((movie) => (
        <li className="movie" key={movie.id}>
          <h3>{movie.title}</h3>
          <p>{movie.year}</p>
          <img
            src={movie.poster === "N/A" ? notFoundImage : movie.poster}
            alt={movie.title}
          />
        </li>
      ))}
    </ul>
  );
}

function RenderNoResults() {
  return <p>No se encontraron peliculas</p>;
}

export default function Movies({ movies }) {
  const hasMovies = movies?.length > 0;

  return hasMovies ? <RenderMovies movies={movies} /> : <RenderNoResults />;
}
