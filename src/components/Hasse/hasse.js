import React, { useState, useEffect } from "react";
import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import styles from "./Hasse.module.css";

cytoscape.use(dagre);

const HasseDiagram = () => {
  const [inputValue, setInputValue] = useState("");
  const [graphData, setGraphData] = useState({
    nodes: [],
    edges: [],
  });
  const [maximalElements, setMaximalElements] = useState([]);
  const [minimalElements, setMinimalElements] = useState([]);
  const [equivalenceMatrix, setEquivalenceMatrix] = useState([]);
  const [relationProperties, setRelationProperties] = useState({});
  const [showProperties, setShowProperties] = useState(false);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleClean = () => {
    setInputValue("");
    setGraphData({ nodes: [], edges: [] });
    setMaximalElements([]);
    setMinimalElements([]);
    setEquivalenceMatrix([]);
    setRelationProperties({});
    setShowProperties(false);
  };

  const handleGenerateGraph = () => {
    const pairs = inputValue.match(/\(([^)]+)\)/g);
    if (!pairs) return;

    const nodes = [];
    const edges = [];

    pairs.forEach((pair) => {
      const [source, target] = pair.replace(/[()]/g, "").split(",");
      if (!nodes.find((node) => node.data.id === source)) {
        nodes.push({ data: { id: source, label: source } });
      }
      if (!nodes.find((node) => node.data.id === target)) {
        nodes.push({ data: { id: target, label: target } });
      }

      if (source !== target) {
        edges.push({ data: { id: `${source}-${target}`, source, target } });
      }
    });

    setGraphData({ nodes, edges });
    setMaximalElements([]);
    setMinimalElements([]);
    setEquivalenceMatrix([]);
    setRelationProperties({});
    setShowProperties(false);
  };

  const handleCalculateMaximalMinimal = () => {
    const cy = cytoscape({
      elements: [...graphData.nodes, ...graphData.edges],
    });

    const nodes = cy.nodes();
    const minimalElements = nodes
      .filter((ele) => ele.incomers().length === 0)
      .map((ele) => ele.id());
    const maximalElements = nodes
      .filter((ele) => ele.outgoers().length === 0)
      .map((ele) => ele.id());

    setMinimalElements(minimalElements);
    setMaximalElements(maximalElements);
  };

  const handleGenerateEquivalenceMatrix = () => {
    const pairs = inputValue.match(/\(([^)]+)\)/g);
    if (!pairs) return;

    const nodes = new Set();
    pairs.forEach((pair) => {
      const [source, target] = pair.replace(/[()]/g, "").split(",");
      nodes.add(source);
      nodes.add(target);
    });

    // Convert nodes to sorted array
    const nodeList = Array.from(nodes).sort();
    const size = nodeList.length;

    // Create an empty matrix
    const matrix = Array.from({ length: size }, () => Array(size).fill(0));

    // Fill the matrix based on the pairs
    pairs.forEach((pair) => {
      const [source, target] = pair.replace(/[()]/g, "").split(",");
      const rowIndex = nodeList.indexOf(source);
      const colIndex = nodeList.indexOf(target);
      matrix[rowIndex][colIndex] = 1;
    });

    setEquivalenceMatrix(matrix);
    setShowProperties(false);
  };

  const verifyProperties = () => {
    const symmetric = isSymmetric();
    const reflexive = isReflexive();
    const transitive = isTransitive();

    setRelationProperties({
      Simétrica: symmetric,
      Reflexiva: reflexive,
      Transitiva: transitive,
      Equivalencia: symmetric && reflexive && transitive,
      "Orden Parcial": reflexive && transitive && !symmetric,
      "Orden Total": reflexive && transitive && !symmetric && isTotalOrder(),
    });
    setShowProperties(true);
  };

  const isSymmetric = () => {
    for (let i = 0; i < equivalenceMatrix.length; i++) {
      for (let j = 0; j < equivalenceMatrix[i].length; j++) {
        if (equivalenceMatrix[i][j] !== equivalenceMatrix[j][i]) {
          return false;
        }
      }
    }
    return true;
  };

  const isReflexive = () => {
    for (let i = 0; i < equivalenceMatrix.length; i++) {
      if (equivalenceMatrix[i][i] !== 1) {
        return false;
      }
    }
    return true;
  };

  const isTransitive = () => {
    for (let i = 0; i < equivalenceMatrix.length; i++) {
      for (let j = 0; j < equivalenceMatrix.length; j++) {
        if (equivalenceMatrix[i][j] === 1) {
          for (let k = 0; k < equivalenceMatrix.length; k++) {
            if (
              equivalenceMatrix[j][k] === 1 &&
              equivalenceMatrix[i][k] !== 1
            ) {
              return false;
            }
          }
        }
      }
    }
    return true;
  };

  const isTotalOrder = () => {
    const size = equivalenceMatrix.length;
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (
          i !== j &&
          equivalenceMatrix[i][j] === 0 &&
          equivalenceMatrix[j][i] === 0
        ) {
          return false;
        }
      }
    }
    return true;
  };

  useEffect(() => {
    if (equivalenceMatrix.length > 0) {
      verifyProperties();
    }
  }, [equivalenceMatrix]);

  useEffect(() => {
    if (graphData.nodes.length === 0 && graphData.edges.length === 0) return;

    const cy = cytoscape({
      container: document.getElementById("cy"),
      elements: [...graphData.nodes, ...graphData.edges],
      style: [
        {
          selector: "node",
          style: {
            label: "data(label)",
          },
        },
        {
          selector: "edge",
          style: {
            width: 4,
            "line-color": "#ddd",
            "target-arrow-color": "#ddd",
            "curve-style": "bezier",
          },
        },
        {
          selector: ".highlighted",
          style: {
            "background-color": "#39FF14", // verde fosforescente
            "line-color": "#39FF14", // verde fosforescente
            "target-arrow-color": "#39FF14", // verde fosforescente
            "transition-property":
              "background-color, line-color, target-arrow-color",
            "transition-duration": "0.5s",
          },
        },
      ],
      layout: {
        name: "dagre",
        rankDir: "BT",
      },
    });

    // Animación para resaltar nodos y arcos
    cy.nodes().forEach((node, i) => {
      setTimeout(() => {
        node.addClass("highlighted");
        const edges = node.connectedEdges();
        edges.forEach((edge, j) => {
          setTimeout(() => {
            edge.addClass("highlighted");
          }, (j + 1) * 1000);
        });
      }, i * 2000);
    });

    return () => cy.destroy();
  }, [graphData]);

  return (
    <div>
      <h2>Diagrama de Hasse</h2>
      <div className={styles.content}>
        <input
          className={styles.input}
          placeholder="Ingresa pares ordenados en este formato: (1,2);(3,4);(5,6)"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
        />
        <div className={styles.container}>
          <div className={styles.hasse}>
            <div className={styles.buttons}>
              <button
                className={styles.main_button}
                onClick={handleGenerateGraph}
              >
                Generar Diagrama de Hasse
              </button>
              <button className={styles.main_button} onClick={handleClean}>
                Limpiar
              </button>
            </div>
            <div id="cy" style={{ width: "100%", minHeight: "90vh" }}></div>
          </div>
          <div className={styles.maxmin}>
            <button
              className={styles.secondary_button}
              onClick={handleCalculateMaximalMinimal}
            >
              Calcular Maximales/Minimales
            </button>
            <div className={styles.results}>
              <div>
                <h3>Elementos Maximales:</h3>
                <ul>
                  {maximalElements.map((element, index) => (
                    <li key={index}>{element}</li>
                  ))}
                  </ul>
                </div>
                <div>
                  <h3>Elementos Minimales:</h3>
                  <ul>
                    {minimalElements.map((element, index) => (
                      <li key={index}>{element}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div>
                <button
                  className={styles.matrixbutton}
                  onClick={handleGenerateEquivalenceMatrix}
                >
                  Generar Matriz de Relacion
                </button>
                <h3>Matriz de Relacion:</h3>
                <table className={styles.matrix}>
                  <tbody>
                    {equivalenceMatrix.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((value, colIndex) => (
                          <td key={colIndex}>{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {showProperties && (
                <div>
                  <div className={styles.properties}>
                    <h3>Propiedades de la Relación:</h3>
                    <ul>
                      {Object.keys(relationProperties).map((property, index) => (
                        <li key={index}>
                          {property}: {relationProperties[property] ? "Sí" : "No"}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              {showProperties && (
                <div>
                  <div className={styles.properties}>
                    <h3>Explicación:</h3>
                    <ul>
                      {Object.keys(relationProperties).map((property, index) => (
                        <li key={index}>
                          {property}: {relationProperties[property] ? "Sí" : "No"}
                          {property === "Simétrica" && (
                            <>
                              {" "}
                              - Una relación es simétrica si para cada par (a, b),
                              también está presente el par (b, a). En este caso,
                              la relación es
                              {relationProperties[property]
                                ? " simétrica."
                                : " no simétrica."}
                            </>
                          )}
                          {property === "Reflexiva" && (
                            <>
                              {" "}
                              - Una relación es reflexiva si cada elemento está
                              relacionado consigo mismo. En este caso, la relación
                              es
                              {relationProperties[property]
                                ? " reflexiva."
                                : " no reflexiva."}
                            </>
                          )}
                          {property === "Transitiva" && (
                            <>
                              {" "}
                              - Una relación es transitiva si para cada par (a, b)
                              y (b, c) en la relación, también está presente el
                              par (a, c). En este caso, la relación es
                              {relationProperties[property]
                                ? " transitiva."
                                : " no transitiva."}
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default HasseDiagram;
  
