import React from 'react'
import styles from "./About.module.css"

function About() {
  return (
    <section className={styles.container}>
        <h2 className={styles.title}>Acerca del proyecto</h2>
        <div className={styles.info}>
            <div>
              <img className={styles.image} src="/fack.png" />
            </div>
            <div>
              <p>DiscreteCalc es una calculadora web diseñada para explorar conceptos de Matemáticas Discretas de manera interactiva y accesible para cualquier usuario. Desde conjuntos y operaciones entre ellos hasta relaciones, matrices, álgebra modular y grafos, DiscreteCalc proporciona una plataforma versátil para el aprendizaje y la práctica de estos conceptos fundamentales.</p>
              <p>Con una interfaz intuitiva y amigable, los usuarios pueden ingresar datos y obtener resultados instantáneos desde cualquier dispositivo con acceso a Internet. Ya sea que estén estudiando para un examen de Matemáticas Discretas o simplemente quieran repasar conceptos, DiscreteCalc ofrece una herramienta útil y práctica para estudiantes de todos los niveles.</p>
            </div>
        </div>
    </section>
  )
}

export default About