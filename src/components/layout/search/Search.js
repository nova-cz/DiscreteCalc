import React from 'react'
import "./Search.css"

function Search() {
  return (
    <div className='container'>
      <form className='search_form'>
        <input className='search_input' type='text' placeholder='Ingrese el tipo de problema que desea realizar'/>
        <button className='search_button'>Ir</button>
      </form>
    </div>
  )
}

export default Search
