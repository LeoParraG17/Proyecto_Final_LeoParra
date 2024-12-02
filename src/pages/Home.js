import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const Home = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=20");
        setData(response.data.results);
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar los datos:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = data.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><ClipLoader size={50} color="#3490dc" /></div>;
  }

  return (
    <div id="all-container" className="container mx-auto p-4">
      <input
        type="text"
        className="p-2 border rounded mb-4 w-full sm:w-1/2 lg:w-1/3 mx-auto"
        placeholder="Buscar Pokémon..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <div className="poke-container">
        {filteredData.map((item, index) => (
          <div key={index} className="post">
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`}
              alt={item.name}
              className="w-32 mx-auto mb-4"
            />
            <h2 className="text-xl font-semibold text-center">{item.name}</h2>
            <Link to={`/detail/${item.name}`} className="block text-center text-blue-500 hover:underline mt-2">Ver detalles</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;