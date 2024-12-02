import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ClipLoader } from "react-spinners";

const Detail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        setData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar los detalles:", err);
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><ClipLoader size={50} color="#3490dc" /></div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{data.name}</h1>
      <img
        src={data.sprites.front_default}
        alt={data.name}
        className="w-32 mx-auto mb-4"
      />
      <p className="text-lg">Altura: {data.height}</p>
      <p className="text-lg">Peso: {data.weight}</p>
      <div className="mt-4">
        <h3 className="text-xl font-semibold">Movimientos:</h3>
        <ul className="list-disc pl-8">
          {data.moves.slice(0, 5).map((move, index) => (
            <li key={index} className="text-lg">{move.move.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Detail;