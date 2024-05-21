import React from 'react'
import styles from "./Navbar.css"

function Navbar() {
  return (
    <nav className="navbar">
      <h1 className='title'>
        <a href="/">DiscreteCalc</a>
      </h1>
      <ul className='menu'>
          <li className='menu_item'>
            <a className='menu_item' href="/calculadora/conjuntos">Conjuntos</a>
          </li>
          <li className='menu_item'>
            <a className='menu_item' href="/calculadora/matrices">Relaciones con matrices</a>
          </li>
          <li className='menu_item'>
            <a className='menu_item' href="/calculadora/grafos">Grafos</a>
          </li>
          <li className='menu_item'>
            <a className='menu_item' href="/calculadora/algebra-modular">Algebra modular</a>
          </li>
        </ul>
    </nav>
  )
}

export default Navbar
