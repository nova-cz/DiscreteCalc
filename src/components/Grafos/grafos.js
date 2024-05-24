import React, { useState, useEffect } from "react";
import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import styles from "./Graphs.module.css";

cytoscape.use(dagre);

const Graphs = () => {
  const [inputValue, setInputValue] = useState("");
  const [matrixSize, setMatrixSize] = useState(0);
  const [graphData, setGraphData] = useState({
    nodes: [],
    edges: [],
  });
  const [clearGraph, setClearGraph] = useState(false);
  const [relationMatrix, setRelationMatrix] = useState([]);
  const [orderedPairs, setOrderedPairs] = useState("");
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [degrees, setDegrees] = useState([]);

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

  useEffect(() => {
    if (relationMatrix.length === 0) return;

    const pairs = [];
    const visitedPairs = new Set();
    relationMatrix.forEach((row, i) => {
      row.forEach((value, j) => {
        if (value === 1) {
          const sourceNode = i + 1;
          const targetNode = j + 1;
          const pair1 = `${sourceNode}-${targetNode}`;
          const pair2 = `${targetNode}-${sourceNode}`;
          if (!visitedPairs.has(pair1) && !visitedPairs.has(pair2)) {
            visitedPairs.add(pair1);
            visitedPairs.add(pair2);
            pairs.push(`(${sourceNode},${targetNode})`);
          }
        }
      });
    });
    setOrderedPairs(`{${pairs.join(", ")}}`);
  }, [relationMatrix]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleMatrixSizeChange = (e) => {
    setMatrixSize(Number(e.target.value));
  };

  const handleCreateMatrix = () => {
    const size = matrixSize;
    const initialMatrix = Array.from({ length: size }, () =>
      Array(size).fill(0)
    );
    setRelationMatrix(initialMatrix);
  };

  const toggleMatrixValue = (i, j) => {
    const newMatrix = relationMatrix.map((row, rowIndex) =>
      row.map((value, colIndex) =>
        rowIndex === i && colIndex === j ? (value === 0 ? 1 : 0) : value
      )
    );
    setRelationMatrix(newMatrix);
  };

  useEffect(() => {
    const nodes = [];
    const edges = [];

    relationMatrix.forEach((row, i) => {
      row.forEach((value, j) => {
        if (value === 1) {
          const sourceNode = i + 1;
          const targetNode = j + 1;
          const edgeId = `${sourceNode}-${targetNode}`;
          const edge = edges.find((e) => e.data.id === edgeId);
          if (edge) {
            edge.classes = "undirected";
          } else {
            edges.push({
              data: {
                id: edgeId,
                source: sourceNode,
                target: targetNode,
              },
            });
          }
          if (!nodes.find((node) => node.data.id === sourceNode.toString())) {
            nodes.push({
              data: { id: sourceNode.toString() },
            });
          }
          if (!nodes.find((node) => node.data.id === targetNode.toString())) {
            nodes.push({
              data: { id: targetNode.toString() },
            });
          }
        }
      });
    });

    setGraphData({ nodes, edges });
    setClearGraph((prevState) => !prevState);
  }, [relationMatrix]);

  const handleClearGraph = () => {
    setGraphData({ nodes: [], edges: [] });
    setInputValue("");
    setMatrixSize(0);
    setRelationMatrix([]);
    setClearGraph((prevState) => !prevState);
  };

  const toggleNodeSelection = (nodeId) => {
    setSelectedNodes((prevSelectedNodes) => {
      if (prevSelectedNodes.includes(nodeId)) {
        return prevSelectedNodes.filter((node) => node !== nodeId);
      } else {
        return [...prevSelectedNodes, nodeId];
      }
    });
  };

  const calculateDegrees = () => {
    const degrees = selectedNodes.map((nodeId) => {
      const degree = graphData.edges.reduce((count, edge) => {
        if (edge.data.source === nodeId || edge.data.target === nodeId) {
          return count + 1;
        } else {
          return count;
        }
      }, 0);
      return { nodeId, degree };
    });
    setDegrees(degrees);
  };

  return (
    <div className={`page ${styles.container}`}>
      <div className={styles.content}>
        <h2>Grafos</h2>
        <div>
          <input
            className={styles.input}
            placeholder="Tamaño de la matriz"
            type="number"
            value={matrixSize}
            onChange={handleMatrixSizeChange}
          />
          <button className={styles.main_button} onClick={handleCreateMatrix}>
            Crear Matriz
          </button>
        </div>
        <h3>Matriz de Adyacencia</h3>
        <div className={styles.matrix_container}>
          {relationMatrix.map((row, i) => (
            <div key={i} className={styles.matrix_row}>
              {row.map((value, j) => (
                <button
                  key={j}
                  className={styles.matrix_button}
                  onClick={() => toggleMatrixValue(i, j)}
                >
                  {value}
                </button>
              ))}
            </div>
          ))}
        </div>
        <h3>Conjunto de pares ordenados</h3>
        <div className={styles.ordered_pairs_container}>{orderedPairs}</div>
        <div>
          <h3>Calcular Grados</h3>
          <div>
            {graphData.nodes.map((node) => (
              <div key={node.data.id}>
                <input
                  type="checkbox"
                  id={`node-${node.data.id}`}
                  checked={selectedNodes.includes(node.data.id)}
                  onChange={() => toggleNodeSelection(node.data.id)}
                />
                <label htmlFor={`node-${node.data.id}`}>{node.data.id}</label>
              </div>
            ))}
          </div>
          <button
            className={styles.main_button}
            onClick={calculateDegrees}
          >
            Calcular
          </button>
          <div>
            {degrees.map((nodeDegree) => (
              <div key={nodeDegree.nodeId}>
                Nodo {nodeDegree.nodeId}: Grado {nodeDegree.degree}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.cols_container}>
        <div className={styles.results_container}>
          <div className={styles.buttons_container}>
            <button className={styles.main_button} onClick={handleClearGraph}>
              Limpiar
            </button>
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


