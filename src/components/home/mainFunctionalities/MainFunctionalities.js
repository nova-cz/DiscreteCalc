import React from 'react'
import styles from "./MainFunctionalities.module.css"

function MainFunctionalities() {
  return (
    <section className={styles.cards_container}>
        <div className={styles.card}>
          <a href="/calculadora/matrices">
            <img className={styles.img}  src="/img.png" />
            <div className={styles.info}>
              <h3 className={styles.title}>Matriz de relaciones</h3>
              <p className={styles.description}>Operaciones entre matrices de pares ordenados</p>
            </div>
          </a>
        </div>
        <div className={styles.card}>
          <a href="/calculadora/conjuntos">
            <img className={styles.img} src="/img.png" />
            <div className={styles.info}>
              <h3 className={styles.title}>Conjuntos</h3>
              <p className={styles.description}>Operaciones básicas entre N conjuntos</p>
            </div>
          </a>
        </div>
        <div className={styles.card}>
          <a href="/calculadora/grafos">
            <img className={styles.img}  src="/img.png" />
            <div className={styles.info}>
              <h3 className={styles.title}>Grafos</h3>
              <p className={styles.description}>Grafos mediante conjuntos</p>
            </div>
          </a>
        </div>
        <div className={styles.card}>
          <a href="/calculadora/algebra-modular">
            <img className={styles.img}  src="/img.png" />
            <div className={styles.info}>
              <h3 className={styles.title}>Algebra Modular</h3>
              <p className={styles.description}>Clases</p>
            </div>
          </a>
        </div>
        <div className={styles.card}>
          <a href="/calculadora/hasse">
            <img className={styles.img}  src="/img.png" />
            <div className={styles.info}>
              <h3 className={styles.title}>Diagramas de Hasse</h3>
              <p className={styles.description}>Diagramas de Hasse mediante pares</p>
            </div>
          </a>
        </div>
        <div className={styles.card}>
          <a href="/calculadora/venn">
            <img className={styles.img}  src="/img.png" />
            <div className={styles.info}>
              <h3 className={styles.title}>Regiones</h3>
              <p className={styles.description}>Mediante tres conjuntos</p>
            </div>
          </a>
        </div>
    </section>
  )
}

export default MainFunctionalities