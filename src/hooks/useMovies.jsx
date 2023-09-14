import { useCallback, useMemo, useRef, useState } from "react";
import { searchMovies } from "../services/movies";

export function useMovies({ query, sort }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const previousQuery = useRef(query);

  // Forma de recibir datos de una API y usarlos en html. (API: Backend \ HTML: Fronted)

  // Tecnica para evitar que una funcio se cree continuamente cuando se rendiriza un componente. Esta solo se crea una vez y sus dependencias se inyectan por parametros. Asi cuando esta este por unica vez creada puede seguir funcionando
  const getMovies = useCallback(async ({ query }) => {
    // Evita que se haga la peticion si la busqueda es la misma
    if (query === previousQuery.current) return;

    try {
      setLoading(true);
      setError(null);
      previousQuery.current = query;

      const newMovies = await searchMovies({ query });
      setMovies(newMovies);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const sortedMovies = useMemo(() => {
    return sort
      ? [...movies].sort((a, b) => a.title.localeCompare(b.title))
      : movies;
  }, [sort, movies]);

  return { movies: sortedMovies, getMovies, loading };
}
