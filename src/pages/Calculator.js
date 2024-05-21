import React from "react";
import Grafos from "../components/Grafos/grafos";
import Matriz from "../components/relaciones/Matriz.js";
import ModularAlgebraSolver from "../components/AlgebraModular/algebraModular.js";
import styles from "../components/calculator/Calculator.module.css";
import SetOperations from "../components/conjuntos/Conjuentos.js"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import VennDiagram from "../components/Venn/ven.js";

import HasseDiagram from "../components/Hasse/hasse.js";

function Calculator() {
  return (
    <article className={styles.container}>
        <Routes>
            <Route path="conjuntos" element={<SetOperations />} />
            <Route path="matrices" element={<Matriz />} />
            <Route path="grafos" element={<Grafos />} />
            <Route path="algebra-modular" element={<ModularAlgebraSolver />} />
            <Route path="venn" element={<VennDiagram />} />
            <Route path="hasse"element={<HasseDiagram />} />
        </Routes>
    </article>
  );
}

export default Calculator;
