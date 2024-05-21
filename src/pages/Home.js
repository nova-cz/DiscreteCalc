import React from 'react'
import Navbar from '../components/layout/navbar/Navbar.js'
import Search from '../components/layout/search/Search.js'
import Header from '../components/home/header/Header.js'
import MainFunctionalities from '../components/home/mainFunctionalities/MainFunctionalities.js'
import About from '../components/home/about/About.js'
import AllFeatures from '../components/home/allFeatures/AllFeatures.js'

function Home() {
  return (
    <article >
      <Search/>
      <div className='page'>
        <Header />
        <MainFunctionalities />
        <About />
        <AllFeatures/>
      </div>
    </article>
  )
}

export default Home
