import React, { useState, useEffect } from "react";
import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import styles from "./Graphs.module.css";

cytoscape.use(dagre);

const Graphs = () => {
  const [matrixSize, setMatrixSize] = useState(0);
  const [graphData, setGraphData] = useState({
    nodes: [],
    edges: [],
  });
  const [clearGraph, setClearGraph] = useState(false);
  const [relationMatrix, setRelationMatrix] = useState([]);
  const [orderedPairs, setOrderedPairs] = useState([]);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [pathStart, setPathStart] = useState("");
  const [pathEnd, setPathEnd] = useState("");
  const [shortestPath, setShortestPath] = useState("");
  const [explanation, setExplanation] = useState([]);

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
        .selector(".undirected")
        .style({
          "target-arrow-shape": "none", // Sin flecha en el extremo
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
    relationMatrix.forEach((row, i) => {
      row.forEach((value, j) => {
        if (value === 1) {
          const sourceNode = i + 1;
          const targetNode = j + 1;
          const pair = `(${sourceNode},${targetNode})`;
          pairs.push(pair);
        }
      });
    });
    setOrderedPairs(pairs);
  }, [relationMatrix]);

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

    const sourceNode = i + 1;
    const targetNode = j + 1;
    const pair = `(${sourceNode},${targetNode})`;

    // Agrega el par solo si el valor en la matriz es 1
    if (newMatrix[i][j] === 1) {
      setOrderedPairs((prevPairs) => [...prevPairs, pair]);
    }
  };

  useEffect(() => {
    const nodes = [];
    const edges = [];
    const undirectedEdges = new Set();

    relationMatrix.forEach((row, i) => {
      row.forEach((value, j) => {
        if (value === 1) {
          const sourceNode = i + 1;
          const targetNode = j + 1;
          const pair1 = `(${sourceNode},${targetNode})`;
          const pair2 = `(${targetNode},${sourceNode})`;

          if (relationMatrix[j][i] === 1) {
            if (!undirectedEdges.has(pair1) && !undirectedEdges.has(pair2)) {
              undirectedEdges.add(pair1);
              edges.push({
                data: {
                  id: pair1,
                  source: sourceNode,
                  target: targetNode,
                  undirected: true,
                },
                classes: "undirected",
              });
            }
          } else {
            edges.push({
              data: {
                id: pair1,
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

  const handleClearPage = () => {
    setGraphData({ nodes: [], edges: [] });
    setMatrixSize(0);
    setRelationMatrix([]);
    setOrderedPairs([]);
    setSelectedNodes([]);
    setDegrees([]);
    setPathStart("");
    setPathEnd("");
    setShortestPath("");
    setExplanation([]);
  };

  const handlePathStartChange = (e) => {
    setPathStart(e.target.value);
  };

  const handlePathEndChange = (e) => {
    setPathEnd(e.target.value);
  };

  const findShortestPath = () => {
    if (!pathStart || !pathEnd || relationMatrix.length === 0) {
      // Verificar si se han seleccionado nodos de origen y destino y si la matriz está vacía
      console.log("Selecciona nodos de origen y destino y crea la matriz");
      return;
    }
  
    const N = relationMatrix.length;
    const dist = Array(N).fill(Number.MAX_VALUE); // Inicializar todas las distancias a infinito
    const visited = Array(N).fill(false); // Inicializar todos los nodos como no visitados
    const path = Array(N).fill(-1); // Inicializar el array de padres
  
    // La distancia al nodo de origen es 0
    dist[pathStart - 1] = 0;
  
    for (let i = 0; i < N - 1; i++) {
      // Encontrar el nodo con la distancia mínima
      let u = -1;
      for (let v = 0; v < N; v++) {
        if (!visited[v] && (u === -1 || dist[v] < dist[u])) {
          u = v;
        }
      }
  
      // Marcar el nodo seleccionado como visitado
      visited[u] = true;
  
      // Actualizar las distancias de los nodos adyacentes
      for (let v = 0; v < N; v++) {
        if (
          !visited[v] &&
          relationMatrix[u][v] !== 0 &&
          dist[u] + relationMatrix[u][v] < dist[v]
        ) {
          dist[v] = dist[u] + relationMatrix[u][v];
          path[v] = u;
        }
      }
    }
  
    // Reconstruir el camino más corto
    const shortestPathNodes = [];
    let currentNode = pathEnd - 1;
    while (currentNode !== -1) {
      shortestPathNodes.unshift(currentNode + 1);
      currentNode = path[currentNode];
    }
  
    // Construir la explicación del camino más corto
    const explanation = [];
    for (let i = 0; i < shortestPathNodes.length - 1; i++) {
      const currentNode = shortestPathNodes[i];
      const nextNode = shortestPathNodes[i + 1];
      const edgeWeight = relationMatrix[currentNode - 1][nextNode - 1];
      explanation.push(`Desde el nodo ${currentNode} hasta el nodo ${nextNode} con un peso de ${edgeWeight}`);
    }
  
    // Establecer el resultado en el estado
    setShortestPath(shortestPathNodes);
    setExplanation(explanation);
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
        <div className={styles.ordered_pairs_container}>
          {"{"}
          {orderedPairs.map((pair, index) => (
            <span key={index}>{index > 0 ? ", " : ""}{pair}</span>
          ))}
          {"}"}
        </div>
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
        <h3>Buscar Camino Más Corto</h3>
        <div>
          <input
            className={styles.input}
            placeholder="Nodo de inicio"
            type="text"
            value={pathStart}
            onChange={handlePathStartChange}
          />
          <input
            className={styles.input}
            placeholder="Nodo de fin"
            type="text"
            value={pathEnd}
            onChange={handlePathEndChange}
          />
          <button
            className={styles.main_button}
            onClick={findShortestPath}
          >
            Encontrar Camino Más Corto
          </button>
          <div>
            {shortestPath && (
              <div>
                Camino más corto de {pathStart} a {pathEnd}: {shortestPath}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.cols_container}>
        <div className={styles.results_container}>
          <div className={styles.buttons_container}>
            <button className={styles.main_button} onClick={handleClearPage}>
              Limpiar Página
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
