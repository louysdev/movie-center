import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import Movies from "./components/Movies";
import { useMovies } from "./hooks/useMovies";
import debounce from "just-debounce-it";
import { AlphabeticIcon } from "./icons/Icons";
import MovieIcon from "./assets/movie-big.png";

// Forma de extraer logica del componente
function useSearch() {
  const [query, setQuery] = useState("");
  const [error, setError] = useState(null);
  const inputRef = useRef(true);

  const updatedSearch = (query) => {
    if (query.startsWith(" ")) return;
    setQuery(query);
  };

  useEffect(() => {
    // Solo se ejucuta antes del usuario escribe
    if (inputRef.current) {
      inputRef.current = query === "";
      return;
    }

    if (query === "") {
      setError("No se puede buscar sin nada escrito");
      return;
    }

    if (query.length < 3) {
      setError("Debe de haber minimo 3 caracteres");
      return;
    }

    setError(null);
  }, [query]);

  return { query, error, updatedSearch };
}

function App() {
  const [sort, setSort] = useState(false);

  const { query, updatedSearch, error } = useSearch();
  const { movies, getMovies, loading } = useMovies({ query, sort });

  const debouncedGetMovies = useCallback(
    debounce(
      (query) => {
        console.log("busqueda");
        getMovies({ query });
      },
      [300]
    ),
    [getMovies]
  );

  const handleSort = () => {
    setSort(!sort);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    getMovies({ query });
    // Forma de retornar un objeto con todas los inputs del formulario, sin hacerlo 1 por 1
    // const { input } = Object.fromEntries(new window.FormData(event.target));

    // Forma de obtener el dato del input sin el hook
    // const data = new window.FormData(event.target);
    // const input = data.get("input");

    // Forma con el Hook
    // event.preventDefault();
    // const inputContent = inputRef.current;
    // const value = inputContent.value;
    // console.log(value);
  };

  // Manera controlada de manejar el input
  const handleChange = (event) => {
    const newQuery = event.target.value;
    updatedSearch(newQuery);
    debouncedGetMovies(newQuery);
  };

  return (
    <div className="page">
      <header>
        <div
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h1>Movie Center </h1>
          <img
            style={{ width: "40px", marginTop: "9px" }}
            src={MovieIcon}
            alt="Icono de pelicula"
          />
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <input
            style={{
              border: "1px solid transparent",
              borderColor: error ? "red" : "transparent",
            }}
            onChange={handleChange}
            name="input"
            // Aparece en el input no lo que escribo si no lo que esta en el estado
            value={query}
            placeholder="Jhon Wick, Avengers"
          />
          <label
            htmlFor="filter"
            style={{ display: "grid", placeContent: "center" }}
          >
            <AlphabeticIcon />
          </label>
          <input
            id="filter"
            type="checkbox"
            onChange={handleSort}
            checked={sort}
          />
          <button type="submit">Buscar</button>
        </form>

        {error ? <p style={{ color: "red" }}>{error}</p> : ""}
      </header>

      <main>{loading ? <p>Cargando...</p> : <Movies movies={movies} />}</main>
    </div>
  );
}

export default App;
