import React, { useState, useEffect } from "react";
import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import styles from "./Graphs.module.css";

cytoscape.use(dagre);

const Graphs = () => {
  const [inputValue, setInputValue] = useState("");
  const [graphData, setGraphData] = useState({
    nodes: [],
    edges: [],
  });
  const [clearGraph, setClearGraph] = useState(false);
  const [relationMatrix, setRelationMatrix] = useState("");

  useEffect(() => {
    if (
      graphData.nodes.length === 0 &&
      graphData.edges.length === 0 &&
      !clearGraph
    )
      return;

    const cy = cytoscape({
      container: document.getElementById("cy"),
      boxSelectionEnabled: false,
      autounselectify: true,
      style: cytoscape
        .stylesheet()
        .selector("node")
        .style({
          content: "data(id)",
        })
        .selector("edge")
        .style({
          "curve-style": "bezier",
          "target-arrow-shape": "triangle",
          width: 4,
          "line-color": "#ddd",
          "target-arrow-color": "#ddd",
          "transition-property": "line-color, target-arrow-color",
          "transition-duration": "0.5s",
        })
        .selector(".highlighted")
        .style({
          "background-color": "#14297b",
          "line-color": "#61bffc",
          "target-arrow-color": "#61bffc",
          "transition-property":
            "background-color, line-color, target-arrow-color",
          "transition-duration": "0.5s",
        }),
      elements: graphData,
      layout: {
        name: "dagre",
        rankDir: "BT",
        nodeDimensionsIncludeLabels: true,
        padding: 10,
      },
    });

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

    return () => {
      cy.destroy();
    };
  }, [graphData, clearGraph]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleGenerateGraph = () => {
    const pairs = inputValue.match(/\(([^)]+)\)/g);
    if (!pairs) return;

    const nodesMap = new Map(); // Usaremos un Map para evitar nodos duplicados
    const edges = [];

    let maxNode = 0;

    pairs.forEach((pair) => {
      const [source, target] = pair.replace(/[()]/g, "").split(",");
      const sourceId = parseInt(source);
      const targetId = parseInt(target);
      nodesMap.set(sourceId, true);
      nodesMap.set(targetId, true);
      edges.push({
        data: {
          id: `${sourceId}-${targetId}`,
          source: sourceId,
          target: targetId,
        },
      });

      maxNode = Math.max(maxNode, sourceId, targetId);
    });

    const nodes = Array.from(nodesMap.keys()).map((nodeId) => ({
      data: { id: nodeId },
    }));

    setGraphData({ nodes, edges });
    setClearGraph((prevState) => !prevState);
  };

  const handleClearGraph = () => {
    setGraphData({ nodes: [], edges: [] });
    setInputValue("");
    setRelationMatrix("");
    setClearGraph((prevState) => !prevState);
  };

  const handleGenerateMatrix = () => {
    const pairs = inputValue.match(/\(([^)]+)\)/g);
    if (!pairs) return;

    let maxNode = 0;
    pairs.forEach((pair) => {
      const [source, target] = pair.replace(/[()]/g, "").split(",");
      const sourceId = parseInt(source);
      const targetId = parseInt(target);
      maxNode = Math.max(maxNode, sourceId, targetId);
    });

    const matrixSize = maxNode;
    const matrix = Array.from({ length: matrixSize }, () =>
      Array(matrixSize).fill(0)
    );

    const edges = [];
    pairs.forEach((pair) => {
      const [source, target] = pair.replace(/[()]/g, "").split(",");
      const sourceId = parseInt(source);
      const targetId = parseInt(target);
      edges.push({ source: sourceId, target: targetId });
    });

    edges.forEach((edge) => {
      matrix[edge.source - 1][edge.target - 1] = 1;
    });

    // Convertir la matriz a la cadena de texto con el formato requerido
    const matrixText = matrix.map((row) => row.join("")).join("\n");

    setRelationMatrix(matrixText);
  };

  return (
    <div className={`page ${styles.container}`}>
      <div className={styles.content}>
        <h2>Grafos</h2>
        <input
          className={styles.input}
          placeholder="Ingrese el conjunto de pares ordenados: (1,2);(3,4);(5,6)"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
        />
      </div>
      
      <div className={styles.cols_container}>
          <div className={styles.results_container}>
            <div className={styles.buttons_container}>
              <button
                className={styles.main_button}
                onClick={handleGenerateGraph}
              >
                Generar Grafo
              </button>
              <button className={styles.main_button} onClick={handleClearGraph}>
                Limpiar
              </button>
              <button
                className={styles.main_button}
                onClick={handleGenerateMatrix}
              >
                Generar Matriz
              </button>
            </div>

            <div style={{ marginTop: "20px" }}>
              <h3>Matriz de Relación:</h3>
              <br />
              <pre  className={styles.matrix_result}>{relationMatrix}</pre>
            </div>
          </div>

          <div className={styles.graph_container}>
            <div id="cy" style={{ minHeight: "100vh", width: "100%" }}></div>
          </div>
        </div>
    </div>
  );
};

export default Graphs;
