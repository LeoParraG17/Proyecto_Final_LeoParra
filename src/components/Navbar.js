import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/pokemon-logo.png"; 

const Navbar = () => {
  return (
    <nav className="bg-yellow-500 p-4 text-white fixed top-0 left-0 w-full z-10 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Pokémon Logo" className="h-10 mr-2" />
          <span className="text-2xl font-bold">PokéApp</span>
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="hover:underline" aria-label="Home">
              Inicio
            </Link>
          </li>
          <li>
            <Link to="/extra" className="hover:underline" aria-label="Extra">
              Página Extra
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;