import React from 'react'
import styles from './AllFeatures.module.css'

function AllFeatures() {
  return (
    <section className={styles.container}>
        <h2 className={styles.title}>Todas las funcionalidades</h2>
        <div className={styles.cards_container}>
        
        <div>
        <a  className={styles.card} href='#'>
          <div className={styles.icon_container}>
            <img className={styles.icon} src="/icon_solid.svg" alt="Icono" />
          </div>
          <div className={styles.card_info}>
            <strong>Union de conjuntos</strong>
          </div>
        </a>
        </div>

        <div>
        <a  className={styles.card} href='#'>
          <div className={styles.icon_container}>
            <img className={styles.icon} src="/icon_solid.svg" alt="Icono" />
          </div>
          <div className={styles.card_info}>
            <strong>Diferencia entre conjuntos </strong>
          </div>
        </a>
        </div>

        <div>
        <a  className={styles.card} href='#'>
          <div className={styles.icon_container}>
            <img className={styles.icon} src="/icon_solid.svg" alt="Icono" />
          </div>
          <div className={styles.card_info}>
            <strong>Diferencia simétrica entre conjuntos</strong>
          </div>
        </a>
        </div>

        <div>
        <a  className={styles.card} href='#'>
          <div className={styles.icon_container}>
            <img className={styles.icon} src="/icon_solid.svg" alt="Icono" />
          </div>
          <div className={styles.card_info}>
            <strong>Complemento de conjuntos </strong>
          </div>
        </a>
        </div>

        <div>
        <a  className={styles.card} href='#'>
          <div className={styles.icon_container}>
            <img className={styles.icon} src="/icon_solid.svg" alt="Icono" />
          </div>
          <div className={styles.card_info}>
            <strong>Producto cartesiano de conjuntos</strong>
          </div>
        </a>
        </div>

        <div>
        <a  className={styles.card} href='#'>
          <div className={styles.icon_container}>
            <img className={styles.icon} src="/icon_solid.svg" alt="Icono" />
          </div>
          <div className={styles.card_info}>
            <strong>Subconjuntos</strong>
          </div>
        </a>
        </div>

        <div>
        <a  className={styles.card} href='#'>
          <div className={styles.icon_container}>
            <img className={styles.icon} src="/icon_solid.svg" alt="Icono" />
          </div>
          <div className={styles.card_info}>
            <strong>Relaciones</strong>
          </div>
        </a>
        </div>

        <div>
        <a  className={styles.card} href='#'>
          <div className={styles.icon_container}>
            <img className={styles.icon} src="/icon_solid.svg" alt="Icono" />
          </div>
          <div className={styles.card_info}>
            <strong>Calculadora </strong>
          </div>
        </a>
        </div>

        <div>
        <a  className={styles.card} href='#'>
          <div className={styles.icon_container}>
            <img className={styles.icon} src="/icon_solid.svg" alt="Icono" />
          </div>
          <div className={styles.card_info}>
            <strong>Calculadora </strong>
          </div>
        </a>
        </div>

        <div>
        <a  className={styles.card} href='#'>
          <div className={styles.icon_container}>
            <img className={styles.icon} src="/icon_solid.svg" alt="Icono" />
          </div>
          <div className={styles.card_info}>
            <strong>Calculadora</strong>
          </div>
        </a>
        </div>

        <div>
        <a  className={styles.card} href='#'>
          <div className={styles.icon_container}>
            <img className={styles.icon} src="/icon_solid.svg" alt="Icono" />
          </div>
          <div className={styles.card_info}>
            <strong>Calculadora</strong>
          </div>
        </a>
        </div>

        <div>
        <a  className={styles.card} href='#'>
          <div className={styles.icon_container}>
            <img className={styles.icon} src="/icon_solid.svg" alt="Icono" />
          </div>
          <div className={styles.card_info}>
            <strong>Calculadora</strong>
          </div>
        </a>
        </div>
        
        </div>
    </section>
  )
}

export default AllFeatures