import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Asegúrate de que el modal sepa cuál es el elemento raíz de la aplicación

const ExtraPage = () => {
  const [abilities, setAbilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAbility, setSelectedAbility] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [isSortedAsc, setIsSortedAsc] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchAbilities();
  }, [page]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);
  }, []);

  const fetchAbilities = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/ability?limit=10&offset=${(page - 1) * 10}`
      );
      setAbilities(response.data.results);
      setLoading(false);
    } catch (err) {
      setError("No se pudieron cargar las habilidades. Inténtalo más tarde.");
      setLoading(false);
    }
  };

  const sortAbilities = () => {
    const sortedAbilities = [...abilities].sort((a, b) => 
      isSortedAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
    setAbilities(sortedAbilities);
    setIsSortedAsc(!isSortedAsc);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredAbilities = abilities.filter((ability) =>
    ability.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchAbilityDetails = async (abilityUrl) => {
    try {
      const response = await axios.get(abilityUrl);
      setSelectedAbility(response.data);
    } catch (err) {
      setError("No se pudo cargar la información detallada.");
    }
  };

  const clearSelection = () => {
    setSelectedAbility(null);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Información copiada al portapapeles");
  };

  const shareAbility = (ability) => {
    const shareData = {
      title: `Habilidad de Pokémon: ${ability.name}`,
      text: `Echa un vistazo a esta habilidad de Pokémon: ${ability.name}`,
      url: window.location.href,
    };
    navigator.share(shareData).catch(console.error);
  };

  const toggleFavorite = (ability) => {
    let updatedFavorites;
    if (favorites.includes(ability.name)) {
      updatedFavorites = favorites.filter(fav => fav !== ability.name);
    } else {
      updatedFavorites = [...favorites, ability.name];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className={`container mx-auto p-4 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Buscar habilidad..."
          className="p-2 border border-gray-300 rounded"
          value={searchTerm}
          onChange={handleSearch}
        />
        <button
          onClick={sortAbilities}
          className="ml-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          {isSortedAsc ? "Ordenar Descendentemente" : "Ordenar Ascendentemente"}
        </button>
        <button
          onClick={fetchAbilities}
          className="ml-2 p-2 bg-green-500 text-white rounded hover:bg-green-700"
        >
          Recargar Datos
        </button>
        <button
          onClick={toggleDarkMode}
          className="ml-2 p-2 bg-gray-500 text-white rounded hover:bg-gray-700"
        >
          {isDarkMode ? "Modo Claro" : "Modo Oscuro"}
        </button>
      </div>
      <h1 className="text-3xl font-bold mb-4">Habilidades de Pokémon</h1>
      {selectedAbility && (
        <Modal
          isOpen={!!selectedAbility}
          onRequestClose={clearSelection}
          contentLabel="Detalles de Habilidad"
          className="bg-white p-4 rounded shadow-lg max-w-lg mx-auto mt-20"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        >
          <h2 className="text-2xl font-bold mb-2">{selectedAbility.name}</h2>
          <p><strong>Efectos:</strong> {selectedAbility.effect_entries[0]?.effect || "No disponible"}</p>
          <p><strong>Generación:</strong> {selectedAbility.generation.name}</p>
          <button
            onClick={() => copyToClipboard(selectedAbility.effect_entries[0]?.effect || "No disponible")}
            className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Copiar Información
          </button>
          <button
            onClick={() => shareAbility(selectedAbility)}
            className="mt-4 p-2 bg-green-500 text-white rounded hover:bg-green-700"
          >
            Compartir
          </button>
          <button
            onClick={() => toggleFavorite(selectedAbility)}
            className={`mt-4 p-2 ${favorites.includes(selectedAbility.name) ? 'bg-red-500' : 'bg-yellow-500'} text-white rounded hover:bg-red-700`}
          >
            {favorites.includes(selectedAbility.name) ? 'Eliminar de Favoritos' : 'Agregar a Favoritos'}
          </button>
          <button
            onClick={clearSelection}
            className="mt-4 p-2 bg-red-500 text-white rounded hover:bg-red-700"
          >
            Cerrar
          </button>
        </Modal>
      )}
      {filteredAbilities.length === 0 ? (
        <div className="text-center text-gray-500">No se encontraron habilidades.</div>
      ) : (
        <ul className="list-disc pl-8">
          {filteredAbilities.map((ability, index) => (
            <li
              key={index}
              className="text-lg cursor-pointer hover:bg-blue-100 p-2 rounded"
              onClick={() => fetchAbilityDetails(ability.url)}
            >
              {ability.name}
            </li>
          ))}
        </ul>
      )}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded mx-2 hover:bg-blue-700"
        >
          Anterior
        </button>
        <span className="px-4 py-2">{`Página ${page}`}</span>
        <button
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded mx-2 hover:bg-blue-700"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default ExtraPage;