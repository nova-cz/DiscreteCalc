

import React, { useState, useEffect } from 'react';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import styles from "./Graphs.module.css";

cytoscape.use(dagre);

const Graphs = () => {
  const [inputValue, setInputValue] = useState('');
  const [graphData, setGraphData] = useState({
    nodes: [],
    edges: []
  });

  useEffect(() => {
    if (graphData.nodes.length === 0 && graphData.edges.length === 0) return;

    const cy = cytoscape({
      container: document.getElementById('cy'),

      boxSelectionEnabled: false,
      autounselectify: true,

      style: cytoscape.stylesheet()
        .selector('node')
          .style({
            'content': 'data(id)'
          })
        .selector('edge')
          .style({
            'curve-style': 'bezier',
            'target-arrow-shape': 'triangle',
            'width': 4,
            'line-color': '#ddd',
            'target-arrow-color': '#ddd',
            'transition-property': 'line-color, target-arrow-color',
            'transition-duration': '0.5s'
          })
        .selector('.highlighted')
          .style({
            'background-color': '#14297b',
            'line-color': '#61bffc',
            'target-arrow-color': '#61bffc',
            'transition-property': 'background-color, line-color, target-arrow-color',
            'transition-duration': '0.5s'
          }),

      elements: graphData,

      layout: {
        name: 'dagre',
        rankDir: 'BT',
        nodeDimensionsIncludeLabels: true,
        padding: 10
      }
    });

    cy.nodes().forEach((node, i) => {
      setTimeout(() => {
        node.addClass('highlighted'); // Animar el nodo actual
        const edges = node.connectedEdges(); // Obtener las aristas conectadas al nodo
        
        edges.forEach((edge, j) => {
          setTimeout(() => {
            edge.addClass('highlighted'); // Animar la arista conectada
          }, (j + 1) * 1000); // Aplicar la animación a las aristas con un intervalo de 1000ms entre cada una
        });
      }, i * 2000); // Aplicar la animación a los nodos con un intervalo de 2000ms entre cada uno
    });

    return () => {
      cy.destroy();
    };
  }, [graphData]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleGenerateGraph = () => {
    const pairs = inputValue.match(/\(([^)]+)\)/g); // Extraer todos los pares entre paréntesis
    if (!pairs) return; // Salir si no se encuentran pares
    
    const nodes = [];
    const edges = [];
    
    pairs.forEach(pair => {
      const [source, target] = pair.replace(/[()]/g, '').split(','); // Eliminar paréntesis y separar source y target
      nodes.push({ data: { id: source } });
      nodes.push({ data: { id: target } });
      edges.push({ data: { id: `${source}-${target}`, source, target } });
    });
    
    setGraphData({ nodes, edges });
  };
  

  return (
    <div>
        <h2>Grafos</h2>
        <div className={styles.content}>
          <input
            className={styles.input}
            placeholder='Ingrese el conjunto de pares ordenados: (1,2);(3,4);(5,6)'
            type="text"
            value={inputValue}
            onChange={handleInputChange}
          />
          <button className={styles.main_button} onClick={handleGenerateGraph}>Generar Grafo</button>
          <div id="cy" style={{ height: '400px', width: '100%' }}></div>
        </div>
    </div>
  );
};

export default Graphs;
