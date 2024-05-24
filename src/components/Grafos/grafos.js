// import React, { useState, useEffect } from "react";
// import cytoscape from "cytoscape";
// import dagre from "cytoscape-dagre";
// import styles from "./Graphs.module.css";

// cytoscape.use(dagre);

// const Graphs = () => {
//   const [inputValue, setInputValue] = useState("");
//   const [graphData, setGraphData] = useState({
//     nodes: [],
//     edges: [],
//   });
//   const [clearGraph, setClearGraph] = useState(false);
//   const [relationMatrix, setRelationMatrix] = useState("");

//   useEffect(() => {
//     if (
//       graphData.nodes.length === 0 &&
//       graphData.edges.length === 0 &&
//       !clearGraph
//     )
//       return;

//     const cy = cytoscape({
//       container: document.getElementById("cy"),
//       boxSelectionEnabled: false,
//       autounselectify: true,
//       style: cytoscape
//         .stylesheet()
//         .selector("node")
//         .style({
//           content: "data(id)",
//         })
//         .selector("edge")
//         .style({
//           "curve-style": "bezier",
//           "target-arrow-shape": "triangle",
//           width: 4,
//           "line-color": "#ddd",
//           "target-arrow-color": "#ddd",
//           "transition-property": "line-color, target-arrow-color",
//           "transition-duration": "0.5s",
//         })
//         .selector(".highlighted")
//         .style({
//           "background-color": "#14297b",
//           "line-color": "#61bffc",
//           "target-arrow-color": "#61bffc",
//           "transition-property":
//             "background-color, line-color, target-arrow-color",
//           "transition-duration": "0.5s",
//         }),
//       elements: graphData,
//       layout: {
//         name: "dagre",
//         rankDir: "BT",
//         nodeDimensionsIncludeLabels: true,
//         padding: 10,
//       },
//     });

//     cy.nodes().forEach((node, i) => {
//       setTimeout(() => {
//         node.addClass("highlighted");
//         const edges = node.connectedEdges();
//         edges.forEach((edge, j) => {
//           setTimeout(() => {
//             edge.addClass("highlighted");
//           }, (j + 1) * 1000);
//         });
//       }, i * 2000);
//     });

//     return () => {
//       cy.destroy();
//     };
//   }, [graphData, clearGraph]);

//   const handleInputChange = (e) => {
//     setInputValue(e.target.value);
//   };

//   const handleGenerateGraph = () => {
//     const pairs = inputValue.match(/\(([^)]+)\)/g);
//     if (!pairs) return;

//     const nodesMap = new Map(); // Usaremos un Map para evitar nodos duplicados
//     const edges = [];

//     let maxNode = 0;

//     pairs.forEach((pair) => {
//       const [source, target] = pair.replace(/[()]/g, "").split(",");
//       const sourceId = parseInt(source);
//       const targetId = parseInt(target);
//       nodesMap.set(sourceId, true);
//       nodesMap.set(targetId, true);
//       edges.push({
//         data: {
//           id: `${sourceId}-${targetId}`,
//           source: sourceId,
//           target: targetId,
//         },
//       });

//       maxNode = Math.max(maxNode, sourceId, targetId);
//     });

//     const nodes = Array.from(nodesMap.keys()).map((nodeId) => ({
//       data: { id: nodeId },
//     }));

//     setGraphData({ nodes, edges });
//     setClearGraph((prevState) => !prevState);
//   };

//   const handleClearGraph = () => {
//     setGraphData({ nodes: [], edges: [] });
//     setInputValue("");
//     setRelationMatrix("");
//     setClearGraph((prevState) => !prevState);
//   };

//   const handleGenerateMatrix = () => {
//     const pairs = inputValue.match(/\(([^)]+)\)/g);
//     if (!pairs) return;

//     let maxNode = 0;
//     pairs.forEach((pair) => {
//       const [source, target] = pair.replace(/[()]/g, "").split(",");
//       const sourceId = parseInt(source);
//       const targetId = parseInt(target);
//       maxNode = Math.max(maxNode, sourceId, targetId);
//     });

//     const matrixSize = maxNode;
//     const matrix = Array.from({ length: matrixSize }, () =>
//       Array(matrixSize).fill(0)
//     );

//     const edges = [];
//     pairs.forEach((pair) => {
//       const [source, target] = pair.replace(/[()]/g, "").split(",");
//       const sourceId = parseInt(source);
//       const targetId = parseInt(target);
//       edges.push({ source: sourceId, target: targetId });
//     });

//     edges.forEach((edge) => {
//       matrix[edge.source - 1][edge.target - 1] = 1;
//     });

//     // Convertir la matriz a la cadena de texto con el formato requerido
//     const matrixText = matrix.map((row) => row.join("")).join("\n");

//     setRelationMatrix(matrixText);
//   };

//   return (
//     <div className={`page ${styles.container}`}>
//       <div className={styles.content}>
//         <h2>Grafos</h2>
//         <div>
//           <input
//             className={styles.input}
//             placeholder="Ingrese el conjunto de pares ordenados: (1,2);(3,4);(5,6)"
//             type="text"
//             value={inputValue}
//             onChange={handleInputChange}
//           />
//           <h3>Matriz de Adyacencia</h3>
          
//         </div>
        
//       </div>
      
//       <div className={styles.cols_container}>
//           <div className={styles.results_container}>
//             <div className={styles.buttons_container}>
//               <button
//                 className={styles.main_button}
//                 onClick={handleGenerateGraph}
//               >
//                 Generar Grafo
//               </button>
//               <button className={styles.main_button} onClick={handleClearGraph}>
//                 Limpiar
//               </button>
//               <button
//                 className={styles.main_button}
//                 onClick={handleGenerateMatrix}
//               >
//                 Generar Matriz
//               </button>
//             </div>

//             <div style={{ marginTop: "20px" }}>
//               <h3>Matriz de Relación:</h3>
//               <br />
//               <pre  className={styles.matrix_result}>{relationMatrix}</pre>
//             </div>
//           </div>

//           <div className={styles.graph_container}>
//             <div id="cy" style={{ minHeight: "100vh", width: "100%" }}></div>
//           </div>
//         </div>
//     </div>
//   );
// };

// export default Graphs;
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
  const [matrixInput, setMatrixInput] = useState("");

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
          edges.push({
            data: {
              id: `${i}-${j}`,
              source: i,
              target: j,
            },
          });
          if (!nodes.find((node) => node.data.id === i.toString())) {
            nodes.push({
              data: { id: i.toString() },
            });
          }
          if (!nodes.find((node) => node.data.id === j.toString())) {
            nodes.push({
              data: { id: j.toString() },
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
