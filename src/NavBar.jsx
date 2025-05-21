import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./App.css";

const NavBar = ({ isOwner }) => {
  const location = useLocation();
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li>
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>Jeu</Link>
        </li>
        {isOwner && (
          <li>
            <Link to="/admin" className={location.pathname === "/admin" ? "active" : ""}>Admin</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
