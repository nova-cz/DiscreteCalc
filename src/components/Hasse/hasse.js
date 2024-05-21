import React, { useState, useEffect } from 'react';
import cytoscape from 'cytoscape';
import styles from "./Hasse.module.css";

const HasseDiagram = () => {
  const [inputValue, setInputValue] = useState('');
  const [graphData, setGraphData] = useState({
    nodes: [],
    edges: []
  });

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleGenerateGraph = () => {
    const pairs = inputValue.match(/\(([^)]+)\)/g);
    if (!pairs) return;

    const nodes = [];
    const edges = [];
    let hasError = false; // Variable para controlar el error de bucle

    pairs.forEach(pair => {
      const [source, target] = pair.replace(/[()]/g, '').split(',');
      if (!nodes.find(node => node.data.id === source)) {
        nodes.push({ data: { id: source, label: source } });
      }
      if (!nodes.find(node => node.data.id === target)) {
        nodes.push({ data: { id: target, label: target } });
      }

      // Verificar si el par forma un bucle
      if (source === target) {
        hasError = true; // Activar el indicador de error
        alert('Error: No se permiten bucles en el diagrama de Hasse.');
        return; // Salir de la iteración actual
      }

      edges.push({ data: { id: `${source}-${target}`, source, target } });
    });

    if (!hasError) { // Solo si no hay errores de bucle
      setGraphData({ nodes, edges });
    }
  };

  const handleCalculateMaximalMinimal = () => {
    // Crear un nuevo objeto cytoscape
    const cy = cytoscape();

    // Agregar nodos y aristas al objeto cytoscape
    cy.add(graphData.nodes);
    cy.add(graphData.edges);

    // Calcular nodos máximos y mínimos
    const maximal = cy.nodes().filter(node => cy.edges("[source = '" + node.id() + "']").empty());
    const minimal = cy.nodes().filter(node => cy.edges("[target = '" + node.id() + "']").empty());

    // Log or display the results as needed
    console.log('Maximal elements:', maximal.map(node => node.data('id')).join(', '));
    console.log('Minimal elements:', minimal.map(node => node.data('id')).join(', '));
  };

  useEffect(() => {
    const cy = cytoscape({
      container: document.getElementById('cy'),
      elements: graphData,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#ccc',
            'label': 'data(label)',
            'shape': 'circle',
            'width': '50px',
            'height': '50px',
            'font-size': '14px',
            'text-halign': 'center',
            'text-valign': 'center',
            'border-width': 1,
            'border-color': '#555',
            'transition-property': 'background-color',
            'transition-duration': '0.5s'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 3,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle',
            'transition-property': 'line-color, target-arrow-color',
            'transition-duration': '0.5s'
          }
        },
        {
          selector: '.highlighted',
          style: {
            'background-color': '#14297b',
            'line-color': '#00ff00',
            'target-arrow-color': '#61bffc',
            'transition-property': 'background-color, line-color, target-arrow-color',
            'transition-duration': '0.5s'
          }
        },
        {
          selector: '.highlighted-green',
          style: {
            'background-color': '#00ff00',
            'transition-property': 'background-color',
            'transition-duration': '0.5s'
          }
        }
      ],
      layout: { name: 'dagre', rankDir: 'BT' }
    });

    cy.layout({ name: 'dagre', rankDir: 'BT' }).run();

    // Aplicar animación después de generar el grafo
    cy.nodes().forEach((node, i) => {
      setTimeout(() => {
        node.addClass('highlighted-green'); // Animar el nodo actual
        const edges = node.connectedEdges(); // Obtener las aristas conectadas al nodo
        
        edges.forEach((edge, j) => {
          setTimeout(() => {
            edge.addClass('highlighted'); // Animar la arista conectada
          }, (j + 1) * 1000); // Intervalo entre aristas
        });
      }, i * 2000); // Intervalo entre nodos
    });

    return () => {
      cy.destroy();
    };
  }, [graphData]);

  return (
    <div>
      <h2>Hasse Diagram</h2>
      <div className={styles.content}>
        <input
          className={styles.input}
          placeholder='Enter ordered pairs: (1,2);(3,4);(5,6)'
          type="text"
          value={inputValue}
          onChange={handleInputChange}
        />
        <button className={styles.main_button} onClick={handleGenerateGraph}>Generate Hasse Diagram</button>
        <button className={styles.secondary_button} onClick={handleCalculateMaximalMinimal}>Calculate Maximal/Minimal</button>
        <div id="cy" style={{ height: '400px', width: '100%' }}></div>
      </div>
    </div>
  );
};

export default HasseDiagram;
